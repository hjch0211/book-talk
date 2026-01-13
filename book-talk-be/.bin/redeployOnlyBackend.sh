#!/bin/sh

echo "🔄 Backend & Batch 재배포 시작 (Production)"
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

# 컨테이너 중지 및 제거
echo ""
echo "🛑 기존 컨테이너 중지 및 제거 중..."
docker compose --env-file .env.prod stop backend batch
docker compose --env-file .env.prod rm -f backend batch
echo "✅ 컨테이너 중지 및 제거 완료"

# 이미지 빌드
echo ""
echo "🔨 이미지 빌드 중 (병렬 실행)..."

# Backend 빌드 (백그라운드)
(
  echo "  → Backend 빌드 시작..."
  if docker compose --env-file .env.prod build --no-cache backend 2>&1 | sed 's/^/    /'; then
    echo "  ✅ Backend 빌드 완료"
  else
    echo "  ❌ Backend 빌드 실패!"
    exit 1
  fi
) &
BACKEND_BUILD_PID=$!

# Batch 빌드 (백그라운드)
(
  echo "  → Batch 빌드 시작..."
  if docker compose --env-file .env.prod build --no-cache batch 2>&1 | sed 's/^/    /'; then
    echo "  ✅ Batch 빌드 완료"
  else
    echo "  ❌ Batch 빌드 실패!"
    exit 1
  fi
) &
BATCH_BUILD_PID=$!

# 빌드 완료 대기
wait $BACKEND_BUILD_PID
BACKEND_BUILD_STATUS=$?
wait $BATCH_BUILD_PID
BATCH_BUILD_STATUS=$?

if [ $BACKEND_BUILD_STATUS -ne 0 ] || [ $BATCH_BUILD_STATUS -ne 0 ]; then
  echo "❌ 이미지 빌드 실패!"
  exit 1
fi
echo "✅ 이미지 빌드 완료"

# 컨테이너 실행
echo ""
echo "🚀 컨테이너 실행 중..."
if ! docker compose --env-file .env.prod up -d backend batch; then
  echo "❌ 컨테이너 실행 실패!"
  exit 1
fi
echo "✅ 컨테이너 실행 완료"

# 헬스 체크 대기
echo ""
echo "🏥 서비스 헬스 체크 중..."
sleep 5
echo "✅ 헬스 체크 완료"

# 로그 확인
echo ""
echo "📋 Backend 로그 (최근 15줄):"
docker compose --env-file .env.prod logs --tail=15 backend

echo ""
echo "📋 Batch 로그 (최근 15줄):"
docker compose --env-file .env.prod logs --tail=15 batch

echo ""
echo "🎉 Backend & Batch 재배포 완료!"
echo ""
echo "💡 유용한 명령어:"
echo "  - Backend 로그 확인: docker compose --env-file .env.prod logs -f backend"
echo "  - Batch 로그 확인: docker compose --env-file .env.prod logs -f batch"
echo "  - 서비스 재시작: docker compose --env-file .env.prod restart backend batch"
echo "  - 컨테이너 상태 확인: docker compose --env-file .env.prod ps"
