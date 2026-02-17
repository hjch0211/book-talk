#!/bin/sh
set -e

echo "프론트엔드 로컬 실행 (Vite)"

if [ ! -f packages/web/.env.local ]; then
  echo "packages/web/.env.local 파일을 찾을 수 없습니다!"
  exit 1
fi

yarn install
yarn web dev