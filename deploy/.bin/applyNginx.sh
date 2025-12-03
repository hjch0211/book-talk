#!/.bin/sh

echo "🔧 Nginx 설정 적용"

NGINX_CONF="nginx/booktalk.conf"
NGINX_TARGET="/etc/nginx/sites-available/booktalk.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/booktalk.conf"

if [ ! -f "$NGINX_CONF" ]; then
  echo "❌ $NGINX_CONF 파일을 찾을 수 없습니다!"
  exit 1
fi
echo "✅ 설정 파일 확인 완료"

echo "📂 Nginx 설정 복사 중..."
sudo cp "$NGINX_CONF" "$NGINX_TARGET"
if [ $? -ne 0 ]; then
  echo "❌ 설정 파일 복사 실패!"
  exit 1
fi
echo "✅ 설정 파일 복사 완료"

if [ ! -L "$NGINX_ENABLED" ]; then
  echo "🔗 심볼릭 링크 생성 중..."
  sudo ln -s "$NGINX_TARGET" "$NGINX_ENABLED"
  if [ $? -ne 0 ]; then
    echo "❌ 심볼릭 링크 생성 실패!"
    exit 1
  fi
  echo "✅ 심볼릭 링크 생성 완료"
fi

echo "🔍 Nginx 설정 검증 중..."
sudo nginx -t
if [ $? -ne 0 ]; then
  echo "❌ Nginx 설정 검증 실패!"
  exit 1
fi
echo "✅ 설정 검증 완료"

echo "🔄 Nginx 재시작 중..."
sudo systemctl reload nginx
if [ $? -ne 0 ]; then
  echo "❌ Nginx 재시작 실패!"
  exit 1
fi
echo "✅ Nginx 재시작 완료"

echo "🎉 Nginx 설정 적용 완료!"
