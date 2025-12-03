#!/.bin/sh

echo "📦 Local DB 시작"
echo "환경 변수 파일: .env.local"

if [ ! -f .env.local ]; then
  echo "❌ .env.local 파일을 찾을 수 없습니다!"
  exit 1
fi
echo "✅ .env.local 파일 확인 완료"

echo "🚀 Docker Compose 실행 중..."
docker compose --env-file .env.local up -d
if [ $? -ne 0 ]; then
  echo "❌ Docker Compose 실행 실패!"
  exit 1
fi
echo "✅ Docker Compose 실행 완료"

echo "ℹ️ 컨테이너 상태 확인:"
docker compose ps

echo "🎉 모든 작업 완료!"