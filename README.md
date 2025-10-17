# Book Talk

책을 주제로 사용자들이 토론하고 발표하는 실시간 커뮤니케이션 플랫폼

---

## 프로덕션 배포

### 사전 준비

**필수:**

- Docker & Docker Compose
- Nginx
- Node.js 18+ & npm

**도메인:**

- `booktalk.my` → 서버 IP
- `server.booktalk.my` → 서버 IP

---

## 배포 절차

### 1. 백엔드 배포

#### 초기 배포 (DB 포함)

```bash
cd book-talk-be
./.bin/deployInitProd.sh
```

> `.env.prod` 파일이 설정되어 있어야 합니다.

#### 백엔드만 재배포

```bash
cd book-talk-be
./bin/redeployOnlyBackend.sh
```

> DB와 Redis는 유지하고 백엔드 코드만 재배포합니다.

### 2. 프론트엔드 배포

```bash
cd book-talk-fe
./bin/deployProd.sh
```

> `.env.production` 파일이 설정되어 있어야 합니다.

---

## 기술 스택

**프론트엔드:** React 19, TypeScript, Vite 7, Material-UI
**백엔드:** Kotlin 2.0, Spring Boot 3.5.4, PostgreSQL 16, Redis 7
**인프라:** Nginx, Docker, Let's Encrypt

---

## 주요 플로우

### 토론 시스템 시퀀스 다이어그램

```mermaid
sequenceDiagram
    autonumber
    actor c as Client
    participant ds as DebateScheduler
    participant d as Debate
    participant p as Presentation
    note over c, p: 토론 생성 단계
    c ->> d: 토론 생성 (POST /debates)
    d ->> d: 'HOST' 토론 멤버 생성
    d ->> p: 빈 토론 페이지 생성 (JSON: {})
    p -->> d: ok
    d -->> c: ok
    note over c, p: 준비 단계 (PREPARATION)
    c ->> d: 새로운 Client 토론 참여 (POST /debates/participants)
    d ->> d: 'MEMBER' 토론 멤버 생성
    d ->> p: 빈 토론 페이지 생성 (JSON: {})
    p -->> d: ok
    d -->> c: WebSocket: 토론 참여자 업데이트 (S_PRESENCE_UPDATE)
    c ->> p: 토론 페이지 작성/수정 (PATCH /presentations/{id})
    p -->> c: ok
    note over c, p: 발표 단계 (PRESENTATION)
    c ->> d: 발표 라운드 시작 (handlePresentationRound)
    d ->> d: PRESENTATION 라운드 생성
    d ->> d: 첫 번째 발언자 생성 (members[0])
    d ->> d: 두 번째 발언자 예약 (nextSpeakerId = members[1])
    d -->> c: ok
    d -->> c: WebSocket: 토론 라운드 업데이트 (S_DEBATE_ROUND_UPDATE)
    d -->> c: WebSocket: 발표자 업데이트 (S_SPEAKER_UPDATE)
    note over ds: 1초 단위로 토론 검증 시작

    opt 사용자가 수동으로 발언 종료하는 경우
        c ->> d: 발언자 발언 종료 (POST /debates/round/speakers)
        d ->> d: 현재 발언자 비활성화
        d ->> d: 다음 발표자를 현재 발언자로 설정
        d ->> d: 그 다음 발표자 예약 (nextSpeakerId 업데이트)
        d -->> c: ok
        d -->> c: WebSocket: 발표자 업데이트 (S_SPEAKER_UPDATE)
    end

    alt 발언자 발언 시간 자동 종료 (PRESENTATION 라운드만)
        ds ->> ds: 만료된 발언자 감지 (endedAt < now())
        ds ->> d: 다음 발표자를 현재 발언자로 설정
        d ->> d: 현재 발언자 비활성화 (isActive = false)
        d ->> d: 새 발언자 생성 (endedAt = now + config)
        d ->> d: 그 다음 발표자 예약 (nextSpeakerId 업데이트)
        d -->> ds: ok
        ds -->> c: WebSocket: 발표자 업데이트 (S_SPEAKER_UPDATE)
    end

    alt 모든 발언자 한 번씩 발언 완료 시
        ds ->> ds: 마지막 발언자 만료 감지 (currentIndex == members.size - 1)
        ds ->> d: FREE 라운드 생성
        d ->> d: PRESENTATION 라운드 종료 (endedAt = now)
        d ->> d: FREE 라운드 생성
        d ->> d: 첫 번째 멤버를 현재 발언자로 지정 (members[0])
        d -->> ds: ok
        ds -->> c: WebSocket: 토론 라운드 업데이트 (S_DEBATE_ROUND_UPDATE)
        ds -->> c: WebSocket: 발표자 업데이트 (S_SPEAKER_UPDATE)
    end

    note over c, p: 자유 발언 단계 (FREE)

    opt 현재 발언자가 발언 시간 연장 (FREE/PRESENTATION 모두 가능)
        c ->> d: 발언 시간 연장 (PATCH /debates/round/speakers)
        d ->> d: endedAt += config.debateRoundSpeakerSeconds()
        d -->> c: ok
        d -->> c: WebSocket: 발표자 업데이트 (S_SPEAKER_UPDATE)
    end

    opt 손들기 기능 (FREE 라운드에서 주로 사용)
        c ->> d: 손들기 토글 (WebSocket: C_TOGGLE_HAND)
        d ->> d: 손들기 상태 업데이트
        d -->> c: WebSocket: 손들기 업데이트 (S_HAND_RAISE_UPDATE)
    end

    opt HOST가 수동으로 다음 발언자 지정 (FREE 라운드)
        c ->> d: 다음 발언자 생성 (POST /debates/round/speakers)
        d ->> d: 현재 발언자 비활성화
        d ->> d: 지정된 사람을 현재 발언자로 설정
        d -->> c: ok
        d -->> c: WebSocket: 발표자 업데이트 (S_SPEAKER_UPDATE)
    end

    note over ds: FREE 라운드는 시간 만료 시 자동 전환 없음
    note over ds: DebateScheduler는 FREE 라운드 발언자를 무시

    opt 채팅 메시지 (모든 단계에서 가능)
        c ->> d: 채팅 메시지 전송 (POST /debates/round/chats)
        d ->> d: 채팅 메시지 저장
        d -->> c: ok
        d -->> c: WebSocket: 채팅 메시지 (S_CHAT_MESSAGE)
    end
```

### 주요 특징

#### 서버 주도 아키텍처

- **DebateScheduler**: 1초마다 실행되어 발표자 시간 만료를 자동으로 감지하고 처리
- **자동 진행**: PRESENTATION 라운드에서 발표자 시간이 끝나면 자동으로 다음 발표자로 전환
- **실시간 동기화**: 모든 상태 변경은 WebSocket을 통해 실시간으로 모든 클라이언트에게 브로드캐스트

#### 토론 라운드 타입

- **PREPARATION**: 토론 준비 단계 (발표 자료 작성)
- **PRESENTATION**: 순차적 발표 단계 (자동 진행)
- **FREE**: 자유 토론 단계 (수동 진행, 손들기 기능 활용)
