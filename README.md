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
- `booktalk.kro.kr` → 서버 IP
- `server.booktalk.kro.kr` → 서버 IP

---

## 배포 절차

### 1. 백엔드 배포

```bash
cd book-talk-be
./bin/deploy-prod.sh
```

> `.env.prod` 파일이 설정되어 있어야 합니다.

### 2. 프론트엔드 배포

```bash
cd book-talk-fe
npm run build
sudo cp -r dist/* /var/www/booktalk/frontend/
```

> `.env.production` 파일에 `VITE_API_BASE_URL=https://server.booktalk.kro.kr` 설정 필요

### 3. Nginx 설정 (최초 1회)

```bash
sudo cp deploy/nginx/booktalk.conf /etc/nginx/sites-available/booktalk
sudo ln -s /etc/nginx/sites-available/booktalk /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo mkdir -p /var/www/html /var/www/booktalk/frontend
sudo chown -R www-data:www-data /var/www
sudo nginx -t && sudo systemctl reload nginx
```

### 4. SSL 인증서 설정 (최초 1회)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d booktalk.kro.kr
sudo certbot --nginx -d server.booktalk.kro.kr
```

---

## 재배포

```bash
# 백엔드
cd book-talk-be
./bin/deploy-prod.sh

# 프론트엔드
cd book-talk-fe
npm run build
sudo cp -r dist/* /var/www/booktalk/frontend/
```

---

## 트러블슈팅

### 백엔드 로그 확인
```bash
docker compose --env-file .env.prod logs -f backend
```

### 프론트엔드 재빌드
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
sudo cp -r dist/* /var/www/booktalk/frontend/
```

### Nginx 502 에러
```bash
# 백엔드 확인
curl http://localhost:8080
docker ps

# 에러 로그
sudo tail -f /var/log/nginx/error.log
```

### DNS 확인
```bash
ping booktalk.kro.kr
```

---

## 기술 스택

**프론트엔드:** React 19, TypeScript, Vite 7, Material-UI
**백엔드:** Kotlin 2.0, Spring Boot 3.5.4, PostgreSQL 16, Redis 7
**인프라:** Nginx, Docker, Let's Encrypt
