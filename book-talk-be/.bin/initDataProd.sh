#!/.bin/sh

echo "📦 초기 데이터 삽입 시작..."

# 환경 변수 로드
if [ -f .env.prod ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env.prod | xargs)
else
  echo "❌ .env.prod 파일을 찾을 수 없습니다!"
  exit 1
fi

# PostgreSQL 컨테이너 확인
if ! docker ps | grep -q book-talk-postgres; then
  echo "❌ PostgreSQL 컨테이너가 실행 중이지 않습니다!"
  exit 1
fi

# 초기 데이터 디렉토리
INIT_DIR="_data/src/main/resources/init"

# 초기 데이터 SQL 파일 실행
if [ -d "$INIT_DIR" ]; then
  echo "📂 초기 데이터 디렉토리: $INIT_DIR"
  for init_file in "$INIT_DIR"/*.sql; do
    if [ -f "$init_file" ]; then
      echo "  - 실행 중: $(basename "$init_file")"
      if ! docker exec -i book-talk-postgres psql -U "$DB_USER" -d "$DB_NAME" < "$init_file"; then
        echo "⚠️  초기 데이터 삽입 경고: $(basename "$init_file")"
        # 초기 데이터는 실패해도 계속 진행 (중복 데이터 등)
      fi
    fi
  done
  echo "✅ 초기 데이터 설정 완료"
else
  echo "⚠️  초기 데이터 디렉토리를 찾을 수 없습니다: $INIT_DIR"
  exit 1
fi

exit 0
