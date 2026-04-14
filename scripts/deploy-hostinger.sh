#!/bin/bash
# Deploy EcomBuild Analytics to Hostinger VPS
# Prerequisites: SSH key configured, PM2 installed on server

set -e

SERVER_USER="${DEPLOY_USER:-root}"
SERVER_HOST="${DEPLOY_HOST:-your-server.hostinger.com}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/ecombuild}"
APP_NAME="ecombuild"

echo "========================================="
echo "  EcomBuild Analytics — Deploy"
echo "========================================="
echo ""

echo "▶ Building production bundle..."
npm run build

echo "▶ Syncing build to Hostinger ($SERVER_HOST)..."
rsync -avz --delete \
  .next/ \
  "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/.next/"

rsync -avz \
  package.json \
  next.config.ts \
  "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/"

# Copy .env.production (must exist locally)
if [ -f ".env.production" ]; then
  rsync -avz .env.production "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/.env.local"
  echo "▶ .env.production synced as .env.local"
else
  echo "⚠  Warning: .env.production not found — make sure server has .env.local configured"
fi

echo "▶ Restarting PM2 process..."
ssh "$SERVER_USER@$SERVER_HOST" "
  cd $DEPLOY_PATH
  npm install --production --ignore-scripts
  pm2 restart $APP_NAME || pm2 start 'node .next/standalone/server.js' --name $APP_NAME
  pm2 save
"

echo ""
echo "✅ Deploy complete!"
echo "   App running at: https://$SERVER_HOST"
