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
./bin/deployInitProd.sh
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
yarn run build
sudo cp -r dist/* /var/www/booktalk/frontend/
```

> `.env.production` 파일이 설정되어 있어야 합니다.

---

## 기술 스택

**프론트엔드:** React 19, TypeScript, Vite 7, Material-UI
**백엔드:** Kotlin 2.0, Spring Boot 3.5.4, PostgreSQL 16, Redis 7
**인프라:** Nginx, Docker, Let's Encrypt
