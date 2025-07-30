import io from 'socket.io-client';

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.callId = null;
    this.isInitiator = false;
    this.onRemoteStreamHandler = null;
    this.onCallEndedHandler = null;
    this.onConnectionStateChangeHandler = null;

    // WebRTC configuration with STUN servers
    this.rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    };
  }

  // Initialize Socket.io connection
  initializeSocket() {
    if (this.socket?.connected) return;

    // Fallback to hardcoded URL if env variable doesn't work
    const envServerUrl = import.meta.env?.VITE_SERVER_URL;
    const serverUrl = envServerUrl || 'http://localhost:5000';
    
    console.log('🌐 Env VITE_SERVER_URL:', envServerUrl);
    console.log('🌐 Using Server URL:', serverUrl);
    console.log('🌐 All env vars:', import.meta.env);
    
    this.socket = io(`${serverUrl}/webrtc`, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.setupSocketListeners();
  }

  // Setup Socket.io event listeners
  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to WebRTC signaling server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebRTC signaling server');
    });

    this.socket.on('webrtc-offer', async (data) => {
      console.log('Received WebRTC offer:', data);
      await this.handleOffer(data.offer);
    });

    this.socket.on('webrtc-answer', async (data) => {
      console.log('Received WebRTC answer:', data);
      await this.handleAnswer(data.answer);
    });

    this.socket.on('webrtc-ice-candidate', async (data) => {
      console.log('Received ICE candidate:', data);
      await this.handleIceCandidate(data.candidate);
    });

    this.socket.on('call-ended', () => {
      console.log('Call ended by remote peer');
      this.endCall();
    });

    this.socket.on('participant-left', (socketId) => {
      console.log('Participant left:', socketId);
      this.endCall();
    });
  }

  // Initialize WebRTC peer connection
  initializePeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream');
      this.remoteStream = event.streams[0];
      if (this.onRemoteStreamHandler) {
        this.onRemoteStreamHandler(this.remoteStream);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        this.socket.emit('webrtc-ice-candidate', {
          callId: this.callId,
          candidate: event.candidate
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState);
      if (this.onConnectionStateChangeHandler) {
        this.onConnectionStateChangeHandler(this.peerConnection.connectionState);
      }
    };

    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
    };
  }

  // Start a call (initiator)
  async startCall(callId, isVideoCall = false) {
    try {
      this.callId = callId;
      this.isInitiator = true;

      // Initialize socket and peer connection
      this.initializeSocket();
      this.initializePeerConnection();

      // Get user media
      this.localStream = await this.getUserMedia(isVideoCall);

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Join call room
      this.socket.emit('join-call', callId);

      // Create and send offer
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: isVideoCall
      });

      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit('webrtc-offer', {
        callId: callId,
        offer: offer
      });

      console.log('Call initiated successfully');
      return this.localStream;

    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  // Answer a call (receiver)
  async answerCall(callId, isVideoCall = false) {
    try {
      this.callId = callId;
      this.isInitiator = false;

      // Initialize socket and peer connection
      this.initializeSocket();
      this.initializePeerConnection();

      // Get user media
      this.localStream = await this.getUserMedia(isVideoCall);

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Join call room
      this.socket.emit('join-call', callId);

      console.log('Ready to answer call');
      return this.localStream;

    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  }

  // Handle incoming offer
  async handleOffer(offer) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('webrtc-answer', {
        callId: this.callId,
        answer: answer
      });

      console.log('Answer sent');
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  // Handle incoming answer
  async handleAnswer(answer) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Answer handled');
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  // Handle incoming ICE candidate
  async handleIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('ICE candidate added');
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  // Get user media (camera and microphone)
  async getUserMedia(isVideoCall = false) {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // First try with ideal constraints
      let constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: isVideoCall ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got user media with ideal constraints:', stream);
        return stream;
      } catch (idealError) {
        console.warn('Failed with ideal constraints, trying basic:', idealError);
        
        // Fallback to basic constraints
        constraints = {
          audio: true,
          video: isVideoCall ? true : false
        };

        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('Got user media with basic constraints:', stream);
          return stream;
        } catch (basicError) {
          console.warn('Failed with basic constraints, trying audio only:', basicError);
          
          // Last fallback: audio only
          if (isVideoCall) {
            constraints = { audio: true, video: false };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Got audio-only stream for video call:', stream);
            return stream;
          } else {
            throw basicError;
          }
        }
      }
    } catch (error) {
      console.error('Error getting user media:', error);
      
      // Provide more specific error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera/microphone access denied. Please allow permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera/microphone found. Please connect a device and try again.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera/microphone is already in use by another application.');
      } else if (error.name === 'OverconstrainedError') {
        throw new Error('Camera/microphone does not support the required constraints.');
      } else {
        throw new Error(`Failed to access camera/microphone: ${error.message}`);
      }
    }
  }

  // Mute/unmute audio
  toggleAudio(muted) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
  }

  // Toggle video on/off
  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  // End the call
  endCall() {
    console.log('Ending call');

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Notify server
    if (this.socket && this.callId) {
      this.socket.emit('end-call', this.callId);
    }

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Call end handler
    if (this.onCallEndedHandler) {
      this.onCallEndedHandler();
    }

    // Reset state
    this.callId = null;
    this.isInitiator = false;
    this.remoteStream = null;
  }

  // Set event handlers
  onRemoteStream(handler) {
    this.onRemoteStreamHandler = handler;
  }

  onCallEnded(handler) {
    this.onCallEndedHandler = handler;
  }

  onConnectionStateChange(handler) {
    this.onConnectionStateChangeHandler = handler;
  }

  // Check if WebRTC is supported
  static isSupported() {
    return !!(navigator.mediaDevices && 
              navigator.mediaDevices.getUserMedia && 
              window.RTCPeerConnection);
  }

  // Get current connection state
  getConnectionState() {
    return this.peerConnection?.connectionState || 'disconnected';
  }

  // Get local stream
  getLocalStream() {
    return this.localStream;
  }

  // Get remote stream
  getRemoteStream() {
    return this.remoteStream;
  }
}

export default WebRTCService;