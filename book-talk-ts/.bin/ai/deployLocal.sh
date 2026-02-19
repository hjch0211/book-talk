#!/bin/sh
set -e

echo "AI 서버 로컬 배포 (Docker Compose)"
ENV_FILE="packages/ai/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "$ENV_FILE 파일을 찾을 수 없습니다!"
  exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)

yarn install
yarn ai build

docker network inspect booktalk-internal >/dev/null 2>&1 || docker network create booktalk-internal

docker compose down
docker compose up -d --build

echo ""
echo "배포 완료!"
echo "  로그 보기:    docker compose logs -f"
echo "  상태 확인:    docker compose ps"
echo "  중지:         docker compose down"