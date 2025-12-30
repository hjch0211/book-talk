#!/bin/sh
set -e

echo "🚀 AI 서버 프로덕션 배포"
ENV_FILE="packages/ai/.env.production"

echo "환경 변수 파일: $ENV_FILE"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE 파일을 찾을 수 없습니다!"
  exit 1
fi
echo "✅ .env.production 파일 확인 완료"

echo "🌱 환경 변수 로드 중..."
export $(grep -v '^#' "$ENV_FILE" | xargs)
echo "✅ 환경 변수 로드 완료"

echo "📥 의존성 설치 중..."
yarn install
echo "✅ 의존성 설치 완료"

echo "📦 AI 패키지 빌드 중..."
yarn ai build
echo "✅ 빌드 완료"

echo "🐳 Docker 컨테이너 재시작 중..."
docker compose down
docker compose up -d --build
echo "✅ Docker 컨테이너 시작 완료"

echo ""
echo "🎉 배포 완료!"
echo ""
echo "📋 유용한 명령어:"
echo "  로그 보기:    docker compose logs -f"
echo "  상태 확인:    docker compose ps"
echo "  중지:         docker compose down"
