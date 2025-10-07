#!/bin/sh

echo "🚀 Book Talk Frontend 빌드 시작 (Production)"

# Node.js 설치 확인
if ! command -v node > /dev/null 2>&1; then
  echo "❌ Node.js가 설치되어 있지 않습니다!"
  echo "   https://nodejs.org/ 에서 Node.js를 설치하세요."
  exit 1
fi
echo "✅ Node.js 확인 완료 ($(node --version))"

# npm 설치 확인
if ! command -v npm > /dev/null 2>&1; then
  echo "❌ npm이 설치되어 있지 않습니다!"
  exit 1
fi
echo "✅ npm 확인 완료 ($(npm --version))"

# package.json 확인
if [ ! -f package.json ]; then
  echo "❌ package.json 파일을 찾을 수 없습니다!"
  echo "   book-talk-fe 프로젝트 루트 디렉토리에서 실행하세요."
  exit 1
fi
echo "✅ package.json 확인 완료"

# 의존성 설치
echo ""
echo "📦 의존성 설치 중..."
if ! npm install; then
  echo "❌ 의존성 설치 실패!"
  exit 1
fi
echo "✅ 의존성 설치 완료"

# 기존 빌드 결과 삭제
if [ -d "dist" ]; then
  echo ""
  echo "🧹 기존 빌드 결과 삭제 중..."
  rm -rf dist
fi

# 프로덕션 빌드
echo ""
echo "🔨 프로덕션 빌드 중..."
if ! npm run build; then
  echo "❌ 빌드 실패!"
  exit 1
fi
echo "✅ 빌드 완료"

# 빌드 결과 확인
echo ""
if [ -d "dist" ]; then
  echo "✅ 빌드 결과 확인:"
  echo "   📁 dist 디렉토리 생성 완료"
  echo "   📊 파일 수: $(find dist -type f | wc -l | tr -d ' ')"
  echo "   💾 총 크기: $(du -sh dist | cut -f1)"
  echo ""
  echo "🎉 빌드 완료!"
  echo ""
  echo "💡 다음 단계:"
  echo "  - dist 폴더를 웹서버에 배포하세요"
  echo "  - 예: scp -r dist/* user@server:/var/www/html/"
else
  echo "❌ dist 디렉토리를 찾을 수 없습니다!"
  exit 1
fi
