#!/bin/bash
# 開発サーバー起動スクリプト（ポート競合を解消してから起動）
set -e
cd "$(dirname "$0")/.."

echo "既存の Next.js プロセスを停止しています..."
pkill -f "next dev" 2>/dev/null || true
sleep 1

if lsof -i :3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "ポート 3000 が使用中です。以下のプロセスを終了してください:"
  lsof -i :3000 -sTCP:LISTEN
  exit 1
fi

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo ".env.local を作成しました"
fi

echo ""
echo "起動中: http://localhost:3000"
echo "停止: Ctrl+C"
echo ""

npm run dev
