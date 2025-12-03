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

## 주요 플로우

### voice chat flow

```mermaid
sequenceDiagram
	actor p1 as peer1
	participant s as Main server with Signaling
	actor p2 as peer2
	
	note over p1, p2: 토론방 입장, 네트워크 연결 복구, 재연결 시 C_VOICE_CHAT부터 시작
	p1->>s: C_VOICE_JOIN
	s->>p2: S_VOICE_JOIN(broadcast)
	p2->>p2: createOffer<br/>(이미 연결되어있더라도 재연결)<br/>(RTCPeerConnection 생성)
	p2->>s: C_VOICE_OFFER with RTCSessionDescription
	s->>p1: S_VOICE_OFFER with RTCSessionDescription
	p1->>p1: handleOffer<br/>(RTCPeerConnection 생성)
	p1->>s: C_VOICE_ANSWER
	s->>p2: S_VOICE_ANSWER
	p1->p2: handleAnswer(ICE candidate 교환 시작)
	p1->>p1: PeerConnection.onTrack(상대 미디어 수신)
	p2->>p2: PeerConnection.onTrack(상대 미디어 수신)
	
	note over p1, p2: 새로고침, 네트워크 연결 복구 발생 시<br/>최대 5번까지 C_VOICE_JOIN 메시지 전송 시도
```