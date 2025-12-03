#!/.bin/sh

echo "🚀 프론트엔드 프로덕션 배포"
echo "환경 변수 파일: packages/web/.env.production"

if [ ! -f packages/web/.env.production ]; then
  echo "❌ packages/web/.env.production 파일을 찾을 수 없습니다!"
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

echo "📦 Web 패키지 빌드 중..."
yarn web build
if [ $? -ne 0 ]; then
  echo "❌ 빌드 실패!"
  exit 1
fi
echo "✅ 빌드 완료"

echo "📂 빌드 파일 배포 중..."
sudo cp -r packages/web/dist/* /var/www/booktalk/frontend/
if [ $? -ne 0 ]; then
  echo "❌ 파일 복사 실패!"
  exit 1
fi
echo "✅ 파일 복사 완료"

echo "🎉 배포 완료!"