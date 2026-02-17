#!/bin/sh
set -e

echo "API & Batch 로컬 배포 (Docker Compose)"
ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "$ENV_FILE 파일을 찾을 수 없습니다!"
  exit 1
fi

docker network inspect booktalk-internal >/dev/null 2>&1 || docker network create booktalk-internal

docker compose --env-file "$ENV_FILE" stop backend batch
docker compose --env-file "$ENV_FILE" rm -f backend batch

docker compose --env-file "$ENV_FILE" build --no-cache backend
docker compose --env-file "$ENV_FILE" build --no-cache batch

docker compose --env-file "$ENV_FILE" up -d backend batch

sleep 10
echo "Container status:"
docker compose --env-file "$ENV_FILE" ps backend batch

echo ""
echo "배포 완료!"
echo "  Backend 로그:  docker compose --env-file .env.local logs -f backend"
echo "  Batch 로그:    docker compose --env-file .env.local logs -f batch"
echo "  중지:          docker compose --env-file .env.local stop backend batch"