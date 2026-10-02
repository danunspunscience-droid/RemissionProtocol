#!/bin/bash
set -e

echo "Cleaning up existing processes..."
pkill -9 -f workerd || true
pkill -9 -f wrangler || true
fuser -k 8790/tcp || true
sleep 1

echo "Building web app..."
cd /mnt/SSD1/projects/RemissionProtocol/apps/web
npx vite build

echo "Starting wrangler server..."
npx wrangler pages dev /mnt/SSD1/projects/RemissionProtocol/apps/web/dist --ip 127.0.0.1 --port 8790 --inspector-port 9230 &
WRANGLER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
timeout=30
while [ $timeout -gt 0 ]; do
  if curl -s --max-time 2 http://127.0.0.1:8790/ > /dev/null; then
    echo "Server is ready"
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "Server did not become ready"
  kill $WRANGLER_PID
  exit 1
fi

echo "Testing API endpoints..."
echo "Admin hero endpoint:"
curl -s --max-time 5 -X GET http://127.0.0.1:8790/api/admin/hero
echo ""
echo "Auth endpoint:"
curl -s --max-time 5 -X POST http://127.0.0.1:8790/api/auth -H "Content-Type: application/json" -d '{"action":"login","email":"architect@remission.local","password":"securepassword123"}'
echo ""

echo "Running static verification suite..."
cd /mnt/SSD1/projects/RemissionProtocol
echo "TypeScript check for web:"
npx tsc --noEmit --prefix apps/web
echo "TypeScript check for functions:"
npx tsc --noEmit -p functions/tsconfig.json
echo "Knip check (last 25 lines):"
npx knip 2>&1 | tail -n 25

echo "Stopping wrangler server..."
kill $WRANGLER_PID
wait $WRANGLER_PID 2>/dev/null || true

echo "All steps completed successfully!"