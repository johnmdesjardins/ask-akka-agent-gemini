/**
 * Video client for connecting to the video service
 * Handles webcam capture, audio recording, and communication with the server
 */

class VideoClient {
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private mediaStream: MediaStream | null = null;
  private isRecording: boolean = false;
  private responseContainer: HTMLDivElement | null = null;
  private imageInterval: number | null = null;
  private socket: WebSocket | null = null;
  private statusElement: HTMLDivElement | null = null;
  private _audioContext: AudioContext | null = null;
  private _audioProcessor: ScriptProcessorNode | null = null;
  private _audioDebugCounter: number = 0;
  private messageBuffer: string[] = [];
  private messageBufferTimer: number | null = null;
  private isBufferingMessages: boolean = false;

  constructor() {
    // Create UI elements
    this.createUI();
    
    // Initialize video elements
    this.videoElement = document.getElementById('webcam') as HTMLVideoElement;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.responseContainer = document.getElementById('responses') as HTMLDivElement;
    this.statusElement = document.getElementById('status') as HTMLDivElement;
  }

  private createUI(): void {
    const containerWrapper = document.getElementById('container-wrapper');
    if (!containerWrapper) {
      console.error('Container wrapper element not found');
      return;
    }
    const container = document.createElement('div');
    container.className = 'container';
    containerWrapper.appendChild(container);

    // Create context input field and send button
    const contextContainer = document.createElement('div');
    contextContainer.className = 'context-container';
    container.appendChild(contextContainer);

    const contextLabel = document.createElement('label');
    contextLabel.htmlFor = 'contextInput';
    contextLabel.textContent = 'AI Context:';
    contextContainer.appendChild(contextLabel);

    const contextInput = document.createElement('textarea');
    contextInput.id = 'contextInput';
    contextInput.placeholder = 'Enter context instructions for Gemini AI...';
    contextInput.rows = 5;
    contextInput.value = 'This is Shawn. He is trying to learn ASL alphabet. He will show you a sign and guess what that he is showing. Please tell him correct or tell him the actual sign he is holding up. If he is not holding up a valid ASL alphabet sign then please tell him it is not a valid sign.';
    contextContainer.appendChild(contextInput);

    const sendContextButton = document.createElement('button');
    sendContextButton.id = 'sendContextButton';
    sendContextButton.textContent = 'Set AI Context';
    sendContextButton.addEventListener('click', () => this.sendContext());
    contextContainer.appendChild(sendContextButton);

    // Create button
    const button = document.createElement('button');
    button.id = 'toggleButton';
    button.textContent = 'Start';
    button.addEventListener('click', () => this.toggleRecording());
    container.appendChild(button);

    // Create status indicator
    const statusElement = document.createElement('div');
    statusElement.id = 'status';
    statusElement.className = 'status';
    statusElement.textContent = 'Ready';
    container.appendChild(statusElement);

    // Create video element
    const videoElement = document.createElement('video');
    videoElement.id = 'webcam';
    videoElement.autoplay = true;
    videoElement.muted = true;
    container.appendChild(videoElement);

    // Create canvas for capturing images
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.style.display = 'none';
    container.appendChild(canvas);

    // Create response container
    const responseContainer = document.createElement('div');
    responseContainer.id = 'responses';
    responseContainer.className = 'response-container';
    container.appendChild(responseContainer);

    // Create Debug button
    const debugButton = document.createElement('button');
    debugButton.id = 'debugButton';
    debugButton.textContent = 'Debug Mode';
    debugButton.addEventListener('click', () => this.enableDebugMode());
    container.appendChild(debugButton);

    // Create Video Toggle button
    const videoToggleButton = document.createElement('button');
    videoToggleButton.id = 'videoToggleButton';
    videoToggleButton.textContent = 'Hide Video';
    videoToggleButton.addEventListener('click', () => this.toggleVideoVisibility());
    container.appendChild(videoToggleButton);
  }

  private updateStatus(message: string, isError: boolean = false): void {
    if (!this.statusElement) return;
    
    this.statusElement.textContent = message;
    this.statusElement.className = isError ? 'status error' : (
      message.includes('Connected') ? 'status connected' : 'status'
    );
  }

  private async toggleRecording(): Promise<void> {
    const button = document.getElementById('toggleButton') as HTMLButtonElement;
    
    if (!this.isRecording) {
      button.textContent = 'End';
      this.isRecording = true;
      this.updateStatus('Starting...');
      
      try {
        // Start recording
        await this.startRecording();
      } catch (error) {
        console.error('Error starting recording:', error);
        this.handleError(error);
      }
    } else {
      this.stopRecording();
      button.textContent = 'Start';
      this.updateStatus('Ready');
    }
  }

  private async startRecording(): Promise<void> {
    try {
      this.updateStatus('Accessing camera and microphone...');
      
      // Request access to webcam and microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (!this.videoElement) return;
      
      // Set up webcam
      this.videoElement.srcObject = this.mediaStream;
      this.updateStatus('Camera and microphone ready');
      
      // Set up audio processing using AudioContext instead of MediaRecorder
      const audioContext = new AudioContext({
        sampleRate: 16000, // Match Python client's SEND_SAMPLE_RATE
      });
      
      // Create audio source from the stream
      const source = audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create script processor node to access raw audio data
      // Note: ScriptProcessorNode is deprecated but still works in all browsers
      // while AudioWorklet is newer but requires more complex setup
      const processor = audioContext.createScriptProcessor(1024, 1, 1);
      
      // Connect the source to the processor
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      // Process audio data
      processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        
        // Debug - log that audio processing is happening
        if (this._audioDebugCounter === undefined) {
          this._audioDebugCounter = 0;
        }
        
        // Log every 10th audio packet to avoid flooding the console
        if (this._audioDebugCounter % 10 === 0) {
          console.log(`Audio processing: packet #${this._audioDebugCounter}, buffer size: ${e.inputBuffer.getChannelData(0).length}`);
        }
        this._audioDebugCounter++;
        
        // Get raw PCM audio data from input channel
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert Float32Array to Int16Array (matching Python's FORMAT = pyaudio.paInt16)
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          // Convert float (-1.0 to 1.0) to int16 (-32768 to 32767)
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        // Send audio data - we can directly use the ArrayBuffer from the Int16Array
        this.sendAudioData(pcmData.buffer);
      };
      
      // Store reference to clean up later
      this._audioContext = audioContext;
      this._audioProcessor = processor;
      
      // Connect to WebSocket server
      this.updateStatus('Connecting to server...');
      this.connectToWebSocket();
      
      // Start capturing images every second
      this.imageInterval = window.setInterval(() => {
        this.captureAndSendImage();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to access media devices:', error);
      this.handleError(error);
    }
  }

  private connectToWebSocket(): void {
    // Connect to WebSocket server (server.ts)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    const port = window.location.port || '3001';
    
    const wsUrl = `${protocol}//${host}:${port}/ws`;
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('Connected to WebSocket server at', wsUrl);
      this.updateStatus('Connected to server');
      
      // Initialize gRPC connection
      if (this.socket) {
        this.socket.send(JSON.stringify({
          type: 'config'
        }));
      }
    };
    
    this.socket.onmessage = (event) => {
      const message = event.data.toString();
      
      try {
        // Try to parse as JSON first
        const jsonMessage = JSON.parse(message);
        
        // Handle status messages
        if (jsonMessage.status) {
          // Update status for all status messages
          if (jsonMessage.message) {
            this.updateStatus(jsonMessage.message, jsonMessage.status === 'error');
          }
          
          // Only process content from data messages
          if (jsonMessage.status === 'data' && jsonMessage.data && jsonMessage.data.message) {
            this.processMessage(jsonMessage.data.message);
          }
        } else {
          // Non-status JSON - try to process as content
          this.processMessage(message);
        }
      } catch (e) {
        // Not JSON - try to process as plain text
        this.processMessage(message);
      }
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.updateStatus('Connection error', true);
      this.handleError(error);
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.updateStatus('Connection closed', this.isRecording);
      
      if (this.isRecording) {
        this.stopRecording();
        const button = document.getElementById('toggleButton') as HTMLButtonElement;
        button.textContent = 'Start';
      }
    };
  }

  private stopRecording(): void {
    this.isRecording = false;
    
    // Stop image capture interval
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
      this.imageInterval = null;
    }
    
    // Clean up audio context and processor
    if (this._audioProcessor) {
      this._audioProcessor.disconnect();
      this._audioProcessor = null;
    }
    
    if (this._audioContext) {
      this._audioContext.close().catch(console.error);
      this._audioContext = null;
    }
    
    // Stop all media tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    // Close WebSocket connection
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.socket = null;
    }
  }

  private captureAndSendImage(): void {
    if (!this.isRecording || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    if (!this.videoElement || !this.canvas) return;
    
    const context = this.canvas.getContext('2d');
    if (!context) return;
    
    // Draw video frame to canvas
    context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
    
    // Convert canvas to JPEG
    this.canvas.toBlob((blob) => {
      if (blob && this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log(`Captured image: ${blob.size} bytes`);
        
        // Convert blob to base64 for easier transport over WebSocket
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && this.socket) {
            const message = {
              type: 'image',
              mimeType: 'image/jpeg',
              data: reader.result
            };
            
            console.log(`Sending image data: ${reader.result.toString().substring(0, 50)}...`);
            this.socket.send(JSON.stringify(message));
          }
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/jpeg', 0.8);
  }

  private sendAudioData(arrayBuffer: ArrayBuffer): void {
    if (!this.isRecording || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    
    try {
      // Convert ArrayBuffer to Uint8Array for processing
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to base64
      const base64Data = this.arrayBufferToBase64(uint8Array);
      
      // Create a data URL with the correct MIME type (audio/pcm)
      const dataUrl = `data:audio/pcm;base64,${base64Data}`;
      
      const message = {
        type: 'audio',
        data: dataUrl
      };
      
      console.log(`Sending audio data: ${uint8Array.length} bytes`);
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending audio data:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
    }
  }
  
  // Helper method to convert ArrayBuffer to base64 string
  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);
  }

  private addResponse(message: string): void {
    if (!this.responseContainer) return;
    
    // Skip INFO and ERROR messages and empty messages
    if (message.startsWith('INFO:') || 
        message.startsWith('ERROR:') || 
        !message.trim() || 
        message === '{}' || 
        message === '{"message":""}' ||
        message === 'Setup complete') {
      return;
    }
    
    // Create a new response item for this message
    const responseItem = document.createElement('div');
    responseItem.className = 'response-item';
    responseItem.innerHTML = message;
    
    // Add to container
    this.responseContainer.appendChild(responseItem);
    
    // Scroll to the bottom
    this.responseContainer.scrollTop = this.responseContainer.scrollHeight;
  }

  private handleError(error: unknown): void {
    console.error('Error:', error);
    this.updateStatus('Error occurred', true);
    
    // Reset to initial state
    if (this.isRecording) {
      this.stopRecording();
      const button = document.getElementById('toggleButton') as HTMLButtonElement;
      button.textContent = 'Start';
    }
  }

  private toggleVideoVisibility(): void {
    if (!this.videoElement) return;
    
    const button = document.getElementById('videoToggleButton') as HTMLButtonElement;
    
    if (this.videoElement.classList.contains('hidden')) {
      // Show video
      this.videoElement.classList.remove('hidden');
      button.textContent = 'Hide Video';
    } else {
      // Hide video
      this.videoElement.classList.add('hidden');
      button.textContent = 'Show Video';
    }
  }

  private enableDebugMode(): void {
    // Show connection status
    this.updateStatus('Debug mode enabled');
    
    // Try connecting directly via a test request
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'debug',
        action: 'testGrpcService',
        serviceName: 'VideoServiceEndpoint'
      }));
    } else {
      // If not connected, try to connect
      this.connectToWebSocket();
    }
  }

  // New helper method to extract and process message content
  private processMessage(message: string): void {
    // Skip empty or system messages
    if (!message || 
        message === '{}' || 
        message === '{"message":""}' ||
        message === 'Setup complete' ||
        message.includes('sent audio data') ||
        message.includes('sent image data')) {
      return;
    }
    
    let content = message;
    
    // Remove "Content:" prefix if present
    if (content.startsWith('Content:')) {
      content = content.substring('Content:'.length).trim();
    }
    
    // Try to extract content from LiveServerMessage structure
    try {
      if (content.includes('LiveServerMessage') || 
          content.includes('LiveServerContent') || 
          content.includes('modelTurn')) {
        const jsonObj = JSON.parse(content);
        
        // Extract text from parts if available
        if (jsonObj.serverContent?.modelTurn?.parts) {
          const parts = jsonObj.serverContent.modelTurn.parts;
          for (const part of parts) {
            if (part.text) {
              content = part.text;
              break;
            }
          }
        }
      }
    } catch (e) {
      // If parsing fails, just use the original content
      console.log('Could not parse as LiveServerMessage, using raw content');
    }

    // Instead of displaying immediately, buffer the message
    this.bufferMessage(content);
  }

  // New method to buffer messages for 3 seconds
  private bufferMessage(message: string): void {
    // Add message to buffer
    this.messageBuffer.push(message);
    
    // If we're already buffering, just add to the existing buffer
    if (this.isBufferingMessages) {
      return;
    }
    
    // Start buffering for 3 seconds
    this.isBufferingMessages = true;
    
    // Clear any existing timer
    if (this.messageBufferTimer !== null) {
      window.clearTimeout(this.messageBufferTimer);
    }
    
    // Set a timer to process buffered messages after 3 seconds
    this.messageBufferTimer = window.setTimeout(() => {
      this.processBufferedMessages();
    }, 1000);
  }
  
  // Process all buffered messages
  private processBufferedMessages(): void {
    // Only display if we have messages
    if (this.messageBuffer.length > 0) {
      // Combine all messages with line breaks between them
      const combinedMessage = this.messageBuffer.join(' ');
      
      
      // Display the combined message
      this.addResponse(combinedMessage.replace(
        /\*\*(.*?)\*\*/g, 
        '<span style="font-weight: bold; color: #ffce4a">**$1**</span>'
      ).replace(/(\s,)/g, ','));
      
      // Clear the buffer
      this.messageBuffer = [];
    }
    
    // Reset the buffering flag
    this.isBufferingMessages = false;
  }

  private async sendContext(): Promise<void> {
    const contextInput = document.getElementById('contextInput') as HTMLTextAreaElement;
    if (!contextInput || !contextInput.value.trim()) {
      this.updateStatus('Please enter context before sending', true);
      return;
    }

    const context = contextInput.value.trim();
    this.updateStatus('Sending context to Gemini...');

    try {
      const response = await fetch('https://jolly-flower-9491.aws-us-east-2.akka.services/ai-context/gemini-live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context: context
        })
      });

      if (response.ok) {
        this.updateStatus('Context set successfully');
        // Add the context to the response container to confirm it was sent
        this.addResponse(`<em>New AI context set:</em> ${context}`);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to set context: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error sending context:', error);
      this.updateStatus(`Failed to set context: ${error instanceof Error ? error.message : String(error)}`, true);
    }
  }
}

// Initialize the client when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  new VideoClient();
}); 