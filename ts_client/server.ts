import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as WebSocket from 'ws';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Get the current directory
const currentDir = __dirname;

// Load the proto file - use try/catch to handle errors gracefully
let protoDescriptor: any = null;
let ChunkType: any = null;
try {
  const PROTO_PATH = path.resolve(__dirname, '../akka/src/main/proto/video-service.proto');
  console.log(`Loading proto file from: ${PROTO_PATH}`);
  
  // Load the proto definitions
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  
  protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
  // Store reference to the Chunk message type
  ChunkType = protoDescriptor.Chunk;
  console.log('Proto file loaded successfully');
  console.log('Available types:', Object.keys(protoDescriptor));
} catch (error) {
  console.error('Failed to load proto file:', error);
}

// Create HTTP server for serving our web client
const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);
  
  let filePath = path.join(currentDir, req.url || '');
  if (req.url === '/' || req.url === '') {
    filePath = path.join(currentDir, 'index.html');
  }
  
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 - File Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'
});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket.WebSocket) => {
  console.log('Client connected to WebSocket');
  
  // Communication variables
  let isStreaming = false;
  let grpcClient: any = null;
  let call: any = null;
  
  // Handle messages from WebSocket client
  ws.on('message', (message) => {
    try {
      console.log('Received WebSocket message');
      
      // Parse the message
      const parsedMessage = JSON.parse(message.toString());
      
      // Handle debug message
      if (parsedMessage.type === 'debug') {
        console.log('Debug message:', parsedMessage);
        
        if (parsedMessage.action === 'testConnection') {
          // Test if we can connect to the gRPC service
          try {
            // Check if protoDescriptor was loaded successfully
            if (!protoDescriptor) {
              ws.send(JSON.stringify({
                status: 'error',
                message: 'Proto file not loaded'
              }));
              return;
            }
            
            // Find the service in the descriptor
            console.log('Available services in proto:', Object.keys(protoDescriptor));
            
            // Create a simple HTTP request to test basic connectivity to port 443
            const http = require('https');
            const req = http.request({
              hostname: 'localhost',
              port: 443,
              path: '/',
              method: 'GET',
              timeout: 3000 // 3 second timeout
            }, (res: http.IncomingMessage) => {
              console.log(`Port 443 connectivity test: ${res.statusCode}`);
              ws.send(JSON.stringify({
                status: 'info',
                message: `Port 443 responded with status: ${res.statusCode}`
              }));
            });
            
            req.on('error', (e: Error) => {
              console.error(`Port 443 connectivity error: ${e.message}`);
              ws.send(JSON.stringify({
                status: 'error',
                message: `Cannot connect to port 443: ${e.message}`
              }));
            });
            
            req.end();
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error('Debug connection test error:', errorMessage);
            ws.send(JSON.stringify({
              status: 'error',
              message: `Debug test error: ${errorMessage}`
            }));
          }
        }
        
        if (parsedMessage.action === 'testGrpcService') {
          const serviceName = parsedMessage.serviceName || 'VideoServiceEndpoint';
          console.log(`Testing gRPC service: ${serviceName}`);
          
          try {
            // Find the service
            const ServiceClass = protoDescriptor[serviceName];
            if (!ServiceClass) {
              ws.send(JSON.stringify({
                status: 'error',
                message: `Service '${serviceName}' not found in proto file`
              }));
              return;
            }
            
            console.log(`Found service ${serviceName}, creating client`);
            const testClient = new ServiceClass(
              'localhost:443',
              grpc.credentials.createSsl()
            );
            
            // Log all available methods
            const methods = Object.keys(testClient);
            console.log(`Available methods on ${serviceName}:`, methods);
            
            ws.send(JSON.stringify({
              status: 'info',
              message: `gRPC service '${serviceName}' found with methods: ${methods.join(', ')}`
            }));
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error(`Error testing gRPC service '${serviceName}':`, errorMessage);
            ws.send(JSON.stringify({
              status: 'error',
              message: `Error testing gRPC service '${serviceName}': ${errorMessage}`
            }));
          }
        }
        
        return;
      }
      
      // Handle config message - initialize gRPC client
      if (parsedMessage.type === 'config') {
        console.log('Config message received - initializing gRPC client');
        
        try {
          // Check if protoDescriptor was loaded successfully
          if (!protoDescriptor) {
            ws.send(JSON.stringify({
              status: 'error',
              message: 'Proto file not loaded'
            }));
            return;
          }
          
          // Print available services for debugging
          console.log('Available services in proto:', Object.keys(protoDescriptor));
          
          // Try to find the VideoService
          let VideoService: any = null;
          
          // Try to determine the service name from the available keys
          const services = Object.keys(protoDescriptor);
          console.log('Looking for VideoService in:', services);
          
          // Common service name patterns to try
          const servicesToTry = [
            'VideoServiceEndpoint',
            'VideoService',
            'io.akka.VideoServiceEndpoint',
            'video.VideoServiceEndpoint',
            'akka.VideoServiceEndpoint'
          ];
          
          for (const serviceName of servicesToTry) {
            if (protoDescriptor[serviceName]) {
              VideoService = protoDescriptor[serviceName];
              console.log(`Found service: ${serviceName}`);
              break;
            }
          }
          
          // Instead of using the first service if none match, specifically check for VideoServiceEndpoint
          const serviceToUse = protoDescriptor['VideoServiceEndpoint'];
          if (serviceToUse) {
            VideoService = serviceToUse;
            console.log('Found service: VideoServiceEndpoint');
          } else if (services.length > 0) {
            // Only as a fallback, use the first service
            VideoService = protoDescriptor[services[0]];
            console.log(`Using first available service: ${services[0]}`);
          }
          
          if (!VideoService) {
            ws.send(JSON.stringify({
              status: 'error',
              message: 'VideoService not found in proto'
            }));
            return;
          }
          
          // Create gRPC client with secure credentials
          grpcClient = new VideoService(
            'localhost:443',
            grpc.credentials.createSsl()
          );
          
          console.log('gRPC client initialized');
          console.log('Available methods:', Object.keys(grpcClient));
          
          ws.send(JSON.stringify({
            status: 'success',
            message: 'gRPC client initialized'
          }));
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          console.error('Error initializing gRPC client:', errorMessage);
          ws.send(JSON.stringify({
            status: 'error',
            message: `Failed to initialize gRPC client: ${errorMessage}`
          }));
        }
        
        return;
      }
      
      // For image or audio data
      if (parsedMessage.data && typeof parsedMessage.data === 'string' && 
          parsedMessage.data.startsWith('data:')) {
        
        // Extract binary data from data URL
        const dataUrl = parsedMessage.data;
        const [header, base64Data] = dataUrl.split(',');
        const binary = Buffer.from(base64Data, 'base64');
        
        console.log(`Received ${parsedMessage.type} data: ${binary.length} bytes`);
        
        // Add extra debugging for audio data
        if (parsedMessage.type === 'audio') {
          console.log(`Audio data details - Header: ${header}`);
          console.log(`Audio data first few bytes: ${binary.slice(0, Math.min(20, binary.length)).toString('hex')}`);
          
          // If audio data is suspiciously small, log a warning
          if (binary.length < 1000) {
            console.warn(`WARNING: Audio data is only ${binary.length} bytes, which is unusually small for audio`);
            console.warn('This may indicate a problem with audio capture or encoding on the client side');
          }
        }
        
        // Check if we have a gRPC client
        if (!grpcClient) {
          console.log('No gRPC client available, echoing data back');
          ws.send(JSON.stringify({
            status: 'data',
            message: `Received ${parsedMessage.type} data (no gRPC connection)`,
            type: parsedMessage.type
          }));
          return;
        }
        
        // Try to send data to gRPC service
        try {
          // If we don't have an active stream, create one
          if (!isStreaming || !call) {
            console.log('Starting new gRPC stream');
            
            try {
              // Find the streamVideo method (or similar)
              const methods = Object.keys(grpcClient);
              console.log('Available methods:', methods);
              
              let streamMethod = null;
              
              // When looking for the streaming method, check these first
              const methodsToTry = [
                'streamVideo',
                'StreamVideo',
                'stream',
                'videoStream',
                'streamAudio', // Additional methods that might be relevant
                'StreamAudio',
                'streamFrames',
                'process'
              ];
              
              for (const methodName of methodsToTry) {
                if (typeof grpcClient[methodName] === 'function') {
                  streamMethod = methodName;
                  console.log(`Found stream method: ${methodName}`);
                  break;
                }
              }
              
              // If not found by common names, look for any method that might be a streaming method
              if (!streamMethod) {
                for (const methodName of methods) {
                  if (typeof grpcClient[methodName] === 'function') {
                    streamMethod = methodName;
                    console.log(`Using method: ${methodName}`);
                    break;
                  }
                }
              }
              
              if (!streamMethod) {
                throw new Error('No suitable streaming method found');
              }
              
              // Create a streaming call with proper error handling
              call = grpcClient[streamMethod]({
                "deadline": Date.now() + 60000  // 60 second deadline
              });
              isStreaming = true;
              
              // Handle incoming responses
              call.on('data', (response: any) => {
                console.log('Received gRPC response:', response);
                
                if (ws.readyState === WebSocket.OPEN) {
                  // Send a cleaner formatted message to the client
                  ws.send(JSON.stringify({
                    status: 'data',
                    message: 'Content from server',
                    data: {
                      message: response.message || JSON.stringify(response)
                    }
                  }));
                }
              });
              
              call.on('end', () => {
                console.log('gRPC stream ended');
                isStreaming = false;
                call = null;
                
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    status: 'info',
                    message: 'gRPC stream ended'
                  }));
                }
              });
              
              call.on('error', (err: Error) => {
                console.error('gRPC stream error:', err);
                console.error('Error details:', err.stack || 'No stack trace available');
                isStreaming = false;
                call = null;
                
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    status: 'error',
                    message: `gRPC stream error: ${err.message}`,
                    details: err.stack
                  }));
                }
              });
              
              // Add a ping to verify the connection
              const pingInterval = setInterval(() => {
                if (call && isStreaming) {
                  try {
                    console.log('Sending ping to verify gRPC connection');
                    // Create a properly formatted Chunk message
                    if (!ChunkType) {
                      console.log('ChunkType is not available, skipping ping');
                      return;
                    }
                    
                    // Create a Chunk message for ping - using audio/pcm type instead of text/plain
                    // to avoid the "Unsupported media chunk type: 'text/plain'" error
                    const pingPayload = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]); // Empty audio buffer
                    const pingMessage = {
                      mime_type: 'audio/pcm', // Using supported media type instead of 'text/plain'
                      payload: pingPayload
                    };
                    console.log('Sending ping message with audio/pcm mime type');
                    call.write(pingMessage);
                  } catch (e) {
                    console.error('Error sending ping:', e);
                    clearInterval(pingInterval);
                  }
                } else {
                  clearInterval(pingInterval);
                }
              }, 10000); // Ping every 10 seconds
              
              console.log('Stream handlers set up with ping verification');
            } catch (e) {
              const errorMessage = e instanceof Error ? e.message : String(e);
              console.error('Error setting up gRPC stream:', errorMessage);
              ws.send(JSON.stringify({
                status: 'error',
                message: `Failed to set up gRPC stream: ${errorMessage}`
              }));
              return;
            }
          }
          
          // Send the data through the gRPC stream
          // Format the message to exactly match what Python client is sending
          // Python uses: video_service_pb2.Chunk(mime_type=mime_type, payload=image_bytes)
          if (!ChunkType) {
            console.log('ChunkType is not available, using simple object');
          }
          
          // Create the message with mime_type and payload
          const messageType = parsedMessage.type;
          
          // Extract the actual MIME type from the data URL header if possible
          let mimeType;
          if (messageType === 'audio') {
            const audioFormatMatch = header.match(/data:(audio\/[^;]+);/);
            mimeType = audioFormatMatch ? audioFormatMatch[1] : 'audio/pcm';
            console.log(`Using audio MIME type: ${mimeType} (extracted from header: ${!!audioFormatMatch})`);
          } else {
            // For images, continue using image/jpeg
            mimeType = 'image/jpeg';
          }
          
          // Create the message with mime_type and payload
          const message = {
            mime_type: mimeType,
            payload: binary
          };
          
          console.log(`Sending ${messageType} data to gRPC service (${binary.length} bytes)`);
          console.log('Message structure:', JSON.stringify({
            mime_type: mimeType,
            payload_length: binary.length
          }));
          
          // Add additional debug info for the audio format
          if (messageType === 'audio') {
            // Try to determine more details about the audio format from the header
            const audioFormatMatch = header.match(/data:(audio\/[^;]+);/);
            const actualMimeType = audioFormatMatch ? audioFormatMatch[1] : 'unknown';
            
            console.log(`Actual audio MIME type from header: ${actualMimeType}`);
            console.log(`Using MIME type for gRPC: ${mimeType}`);
            
            // If the header suggests a different format than what we're using, warn about it
            if (actualMimeType !== 'unknown' && actualMimeType !== mimeType) {
              console.warn(`WARNING: Client is sending ${actualMimeType} but we're telling gRPC it's ${mimeType}`);
              console.warn('Consider updating the audio MIME type to match what the client is sending');
            }
          }
          
          call.write(message);
          
          // Also echo to the client that we received the data
          ws.send(JSON.stringify({
            status: 'info',
            message: `Sent ${parsedMessage.type} data to gRPC service`
          }));
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          console.error('Error sending data to gRPC service:', errorMessage);
          
          // Reset streaming state on error
          isStreaming = false;
          call = null;
          
          ws.send(JSON.stringify({
            status: 'error',
            message: `Error sending data to gRPC service: ${errorMessage}`
          }));
        }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          status: 'error',
          message: 'Error processing message'
        }));
      }
    }
  });
  
  // Handle WebSocket close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    
    // End the gRPC stream if active
    if (isStreaming && call) {
      try {
        call.end();
      } catch (e) {
        console.error('Error ending gRPC call:', e);
      }
    }
    
    isStreaming = false;
    call = null;
  });
});

// Use port from environment variable or default to 3001
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
  console.log(`Serving files from: ${currentDir}`);
}); 