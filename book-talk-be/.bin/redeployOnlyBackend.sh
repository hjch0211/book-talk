#!/bin/sh

echo "🔄 Backend 재배포 시작 (Production)"
echo "환경 변수 파일: .env.prod"

# Docker 설치 확인
if ! command -v docker > /dev/null 2>&1; then
  echo "❌ Docker가 설치되어 있지 않습니다!"
  exit 1
fi

# Docker Compose 설치 확인
if ! docker compose version > /dev/null 2>&1; then
  echo "❌ Docker Compose가 설치되어 있지 않습니다!"
  exit 1
fi
echo "✅ Docker 확인 완료"

# .env.prod 파일 확인
if [ ! -f .env.prod ]; then
  echo "❌ .env.prod 파일을 찾을 수 없습니다!"
  exit 1
fi
echo "✅ .env.prod 파일 확인 완료"

# Backend 컨테이너 중지 및 제거
echo "🛑 기존 Backend 컨테이너 중지 중..."
docker compose --env-file .env.prod stop backend
docker compose --env-file .env.prod rm -f backend

# Backend 이미지 빌드
echo "🔨 Backend 이미지 빌드 중..."
if ! docker compose --env-file .env.prod build --no-cache backend; then
  echo "❌ Backend 이미지 빌드 실패!"
  exit 1
fi
echo "✅ Backend 이미지 빌드 완료"

# Backend 컨테이너 실행
echo "🚀 Backend 컨테이너 실행 중..."
if ! docker compose --env-file .env.prod up -d backend; then
  echo "❌ Backend 컨테이너 실행 실패!"
  exit 1
fi
echo "✅ Backend 컨테이너 실행 완료"

# 헬스 체크 대기
echo ""
echo "🏥 Backend 서비스 헬스 체크 중..."
sleep 5

# Backend 로그 확인
echo ""
echo "📋 Backend 로그 (최근 30줄):"
docker compose --env-file .env.prod logs --tail=30 backend

echo ""
echo "🎉 Backend 재배포 완료!"
echo ""
echo "💡 유용한 명령어:"
echo "  - Backend 로그 확인: docker compose --env-file .env.prod logs -f backend"
echo "  - Backend 재시작: docker compose --env-file .env.prod restart backend"
echo "  - 컨테이너 상태 확인: docker compose --env-file .env.prod ps"
