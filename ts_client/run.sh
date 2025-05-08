#!/bin/bash
echo "Checking dependencies..."

curl --location 'https://localhost/ai-context/gemini-live' \
--header 'Content-Type: application/json' \
--data '{
    "context": "This is John. Greet John. John is trying to learn ASL alphabet. He will show you a sign and guess what that he is showing. Please tell him correct or tell him the actual sign he is holding up. If he is not holding up a valid ASL alphabet sign then please tell him it is not a valid sign."
}'

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

if [ ! -d "../node_modules" ]; then
  echo "Installing dependencies..."
  cd ..
  # Install necessary packages including gRPC
  npm init -y
  npm install typescript ts-node ws @types/ws
  npm install @grpc/grpc-js @grpc/proto-loader
  npm install --save-dev @types/node
  npm install esbuild
  cd "$SCRIPT_DIR"
fi

# Remove the TypeScript definition generation to avoid freezing
# if [ ! -f "./proto/video_service.d.ts" ]; then
#   echo "Generating TypeScript definitions from proto file..."
#   mkdir -p ./proto
#   npx proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./proto ./video-service.proto
# fi

echo "Stopping any existing ts-node processes..."
pkill -f "ts-node" || true

echo "Bundling client-side code..."
# This creates a browser-compatible bundle from client.ts
npx esbuild ./client.ts --bundle --outfile=./client-bundle.js

# Run server on port 3001
echo "Starting server on port 3001..."
PORT=3001 ts-node ./server.ts