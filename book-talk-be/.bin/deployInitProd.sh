#!/bin/sh

echo "🚀 Book Talk 배포 시작 (Production)"
echo "환경 변수 파일: .env.prod"

# Docker 설치 확인
if ! command -v docker > /dev/null 2>&1; then
  echo "❌ Docker가 설치되어 있지 않습니다!"
  echo "   https://docs.docker.com/get-docker/ 에서 Docker를 설치하세요."
  exit 1
fi

# Docker Compose 설치 확인
if ! docker compose version > /dev/null 2>&1; then
  echo "❌ Docker Compose가 설치되어 있지 않습니다!"
  echo "   https://docs.docker.com/compose/install/ 에서 Docker Compose를 설치하세요."
  exit 1
fi
echo "✅ Docker 및 Docker Compose 확인 완료"

# .env.prod 파일 확인
if [ ! -f .env.prod ]; then
  echo "❌ .env.prod 파일을 찾을 수 없습니다!"
  exit 1
fi
echo "✅ .env.prod 파일 확인 완료"

# 필수 디렉토리 확인
if [ ! -d "_data/src/main/resources/schema" ]; then
  echo "❌ schema 디렉토리를 찾을 수 없습니다!"
  echo "   book-talk-be 프로젝트 루트 디렉토리에서 실행하세요."
  exit 1
fi
echo "✅ 프로젝트 구조 확인 완료"

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너 중지 중..."
if ! docker compose --env-file .env.prod down; then
  echo "⚠️  기존 컨테이너 중지 실패 (컨테이너가 없을 수 있습니다)"
fi

# Docker 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
if ! docker compose --env-file .env.prod build --no-cache; then
  echo "❌ Docker 이미지 빌드 실패!"
  exit 1
fi
echo "✅ Docker 이미지 빌드 완료"

# Docker 컨테이너 실행
echo "🚀 Docker 컨테이너 실행 중..."
if ! docker compose --env-file .env.prod up -d; then
  echo "❌ Docker 컨테이너 실행 실패!"
  exit 1
fi
echo "✅ Docker 컨테이너 실행 완료"

# 컨테이너 상태 확인
echo ""
echo "ℹ️  컨테이너 상태 확인:"
docker compose --env-file .env.prod ps

# 헬스 체크 대기
echo ""
echo "🏥 서비스 헬스 체크 중..."
sleep 5

# 환경 변수 로드
# shellcheck disable=SC2046
export $(grep -v '^#' .env.prod | xargs)

# 데이터베이스 스키마 생성
echo ""
echo "📊 데이터베이스 스키마 생성 중..."
SCHEMA_DIR="_data/src/main/resources/schema"
if [ -d "$SCHEMA_DIR" ]; then
  for schema_file in "$SCHEMA_DIR"/*.sql; do
    if [ -f "$schema_file" ]; then
      echo "  - 실행 중: $(basename "$schema_file")"
      if ! docker exec -i book-talk-postgres psql -U "$DB_USER" -d "$DB_NAME" < "$schema_file"; then
        echo "❌ 스키마 생성 실패: $(basename "$schema_file")"
        exit 1
      fi
    fi
  done
  echo "✅ 데이터베이스 스키마 생성 완료"
else
  echo "⚠️  스키마 디렉토리를 찾을 수 없습니다: $SCHEMA_DIR"
fi

# 초기 데이터 삽입
echo ""
echo "📦 초기 데이터 설정 스크립트 실행 중..."
if [ -f ".bin/initDataProd.sh" ]; then
  if ! ./..bin/initDataProd.sh; then
    echo "❌ 초기 데이터 설정 실패!"
    exit 1
  fi
else
  echo "⚠️  초기 데이터 스크립트를 찾을 수 없습니다: .bin/initDataProd.sh"
fi

# Backend 로그 확인
echo ""
echo "📋 Backend 로그 (최근 20줄):"
docker compose --env-file .env.prod logs --tail=20 backend

echo ""
echo "🎉 배포 완료!"
echo ""
echo "💡 유용한 명령어:"
echo "  - 로그 확인: docker compose --env-file .env.prod logs -f backend"
echo "  - 전체 로그: docker compose --env-file .env.prod logs -f"
echo "  - 컨테이너 중지: docker compose --env-file .env.prod down"
echo "  - 컨테이너 재시작: docker compose --env-file .env.prod restart backend"
