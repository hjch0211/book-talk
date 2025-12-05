#!/bin/sh

echo "🚀 AI 서버 프로덕션 배포"
echo "환경 변수 파일: packages/ai/.env.production"

if [ ! -f packages/ai/.env.production ]; then
  echo "❌ packages/ai/.env.production 파일을 찾을 수 없습니다!"
  exit 1
fi
echo "✅ .env.production 파일 확인 완료"

echo "📥 의존성 설치 중..."
yarn install
if [ $? -ne 0 ]; then
  echo "❌ 의존성 설치 실패!"
  exit 1
fi
echo "✅ 의존성 설치 완료"

echo "📦 AI 패키지 빌드 중..."
yarn ai build
if [ $? -ne 0 ]; then
  echo "❌ 빌드 실패!"
  exit 1
fi
echo "✅ 빌드 완료"

echo "🐳 Docker 컨테이너 재시작 중..."
cd packages/ai
docker compose down
docker compose up -d --build
if [ $? -ne 0 ]; then
  echo "❌ Docker 컨테이너 시작 실패!"
  exit 1
fi
echo "✅ Docker 컨테이너 시작 완료"

echo ""
echo "🎉 배포 완료!"
echo ""
echo "📋 유용한 명령어:"
echo "  로그 보기:    docker compose -f packages/ai/docker-compose.yml logs -f"
echo "  상태 확인:    docker compose -f packages/ai/docker-compose.yml ps"
echo "  중지:         docker compose -f packages/ai/docker-compose.yml down"
