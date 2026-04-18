#!/bin/sh
set -e

echo "AI 서버 로컬 배포 (Docker Compose)"
ENV_FILE="packages/ai/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "$ENV_FILE 파일을 찾을 수 없습니다!"
  exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)

if ! docker network inspect booktalk-dev_net >/dev/null 2>&1; then
  echo "booktalk-dev_net 네트워크가 없습니다. book-talk-be를 먼저 배포해주세요."
  exit 1
fi

yarn install
yarn ai build

docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d --build

echo ""
echo "배포 완료!"
echo "  로그 보기:    docker compose -f docker-compose.dev.yml logs -f"
echo "  상태 확인:    docker compose -f docker-compose.dev.yml ps"
echo "  중지:         docker compose -f docker-compose.dev.yml down"
