# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repositories

이 프로젝트는 두 개의 별도 레포로 구성됩니다.

- **book-talk-be** (백엔드, Kotlin/Spring Boot) — 현재 디렉토리
- **book-talk-ts** (프론트엔드, React/TypeScript) — `../book-talk-ts`

---

## Backend (book-talk-be)

### Commands

```bash
# 빌드
./gradlew build

# API 서버 실행
./gradlew :_api:bootRun

# Batch 서버 실행
./gradlew :_batch:bootRun

# 테스트 (전체)
./gradlew test

# 특정 모듈 테스트
./gradlew :_api:test
```

### Module Structure

```
_lib    → 공통 유틸/클라이언트 (MonitorClient, BookClient, AiClient 등). bootJar 미생성
_data   → JPA Entity + Repository. bootJar 미생성
_api    → Spring Boot API 서버. _data, _lib 의존
_batch  → 스케줄러/배치 서버. _api, _data, _lib 모두 의존
```

의존 방향: `_api` / `_batch` → `_data` → `_lib`

### 핵심 패턴

**응답 포맷**: 모든 API 응답은 `HttpResult<T>`로 래핑. `.toResult()` 확장 함수 사용.

```kotlin
fun findOne(...): HttpResult<FindOneResponse> = debateService.findOne(id).toResult()
```

**에러 처리**: `httpBadRequest()`, `httpUnauthenticated()`, `httpForbidden()`, `httpInternalServerError()` 헬퍼 함수 사용. 5xx 에러는 `GlobalExceptionHandler`에서 자동으로 Slack 알람 발송.

**인증**: `AuthAccount` 파라미터를 컨트롤러 메서드에 추가하면 `AuthAccountArgumentResolver`가 `Authorization: Bearer <token>` 헤더를 자동 파싱. 없으면 401.

**Soft Delete**: 모든 Entity는 `AuditableLongIdEntity` 또는 `AuditableUuidEntity`를 상속하며 `archivedAt: Instant?` 필드를 보유. Soft delete = `archivedAt = Instant.now()` 설정.

**모니터링**: `MonitorClient.send(SendRequest(...))` — `INFO` (일반 알림), `ERROR` (에러+스택트레이스). suspend 함수이므로 코루틴 또는 `runBlocking` 필요.

**WebSocket**: `/ws` 엔드포인트, JWT 핸드셰이크 인터셉터 적용. `DebateWebSocketHandler`에서 토론 실시간 이벤트 처리.

### 도메인 구조 (_api/domain)

- `auth` — JWT 기반 인증, Google OAuth
- `account` — 회원 정보 조회/수정/탈퇴
- `debate` — 토론 CRUD, 참여, 라운드, 발언자, 채팅, AI 채팅, WebSocket 실시간
- `book` — 책 검색 (외부 API 연동)
- `presentation` — 발표 자료
- `survey` — 설문
- `openGraph` — OG 메타데이터

### _lib 외부 클라이언트

- `MonitorClient` (Slack Webhook)
- `BookClient` (책 검색 외부 API)
- `AiClient` (AI 서버)
- `GoogleAuthClient` (Google OAuth)
- `MailClient` (이메일)

---

## Frontend (book-talk-ts)

### Commands

```bash
# 루트에서 (../book-talk-ts)
yarn web dev        # 개발 서버
yarn web build      # 빌드
yarn web lint       # Biome 린트 체크
yarn web lint:fix   # 린트 자동 수정
yarn web format     # Biome 포맷
```

패키지 매니저: **yarn** (v1.22.19). `bun` 사용 금지.

### 패키지 구조

```
packages/web   → React 웹 애플리케이션
packages/ai    → AI 관련 패키지
```

### 프론트엔드 핵심 구조

**Provider 계층** (`src/main.tsx`):
```
DesignSystemProvider (MUI 테마)
  └─ QueryClientProvider (TanStack Query)
       └─ ToastProvider
            └─ ModalProvider (전역 단일 모달)
                 └─ AppRoutes
```

**externals**: 백엔드 API 호출 레이어. `apiClient` (인증 불필요) / `authApiClient` (인증 필요) 두 Axios 인스턴스 사용. 401 응답 시 자동 토큰 갱신, 실패 시 `/sign-in` 리다이렉트. 모든 응답은 `ApiResult<T>` 래퍼.

**컴포넌트 계층**: `atoms` → `molecules` → `organisms` → `templates` → `routes` (페이지)

**라우트**: `/ (Landing)`, `/home`, `/sign-in`, `/sign-up`, `/forgot-password`, `/my-page`, `/debate/:debateId`

### Modal 패턴

**전역 모달** (`useModal`): `ModalProvider`에서 관리하는 단일 모달. `openModal(Component, props)` 호출.

**Inner 모달** (`useInnerModal`): 컴포넌트 로컬 상태로 관리하는 단일 모달. `Modal` 컴포넌트에 `inner={true}` prop을 가진 모달(확인 다이얼로그 등)에 사용. 반환값 `{ openModal, closeModal, modals }` — `modals`를 JSX에 렌더링.

- `inner` 모달은 `z-index: 1400` (일반 모달 1300보다 높음), `hideBackdrop`, 닫기 버튼 위치 조정(top/right 축소).

### 코드 컨벤션

- **import type**: 타입만 import 시 `import type` 사용 (Biome 강제)
- 미사용 import/변수 → Biome 에러
- 따옴표: JS/TS는 single quote, JSX attribute는 double quote
- 세미콜론 필수, trailing comma (ES5), arrow function 항상 괄호
- `noNonNullAssertion` 규칙 off (non-null assertion `!` 허용)
