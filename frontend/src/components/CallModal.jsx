import React, { useState, useEffect, useRef } from 'react';
import { FiPhone, FiPhoneOff, FiMic, FiMicOff, FiVideo, FiVideoOff, FiX, FiVolumeX, FiVolume2, FiRefreshCw } from 'react-icons/fi';
import WebRTCService from '../services/webrtcService';
import { requestMediaPermissions } from '../utils/permissionUtils';

const CallModal = ({ isOpen, onClose, participant, callType, callData }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState('calling'); // calling, connected, ended
  const [connectionState, setConnectionState] = useState('new');
  
  const webrtcServiceRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !callData?._id) return;

    console.log('🔥 CallModal opened with data:', {
      callId: callData._id,
      callType,
      status: callData.status,
      participant: participant?.firstName
    });

    initializeWebRTC();

    return () => {
      cleanupWebRTC();
    };
  }, [isOpen, callData]);

  const initializeWebRTC = async () => {
    try {
      // Check WebRTC support
      if (!WebRTCService.isSupported()) {
        console.error('WebRTC is not supported in this browser');
        setCallStatus('error');
        return;
      }

      setCallStatus('connecting');
      
      // Initialize WebRTC service
      webrtcServiceRef.current = new WebRTCService();

      // Set up event handlers
      webrtcServiceRef.current.onRemoteStream((stream) => {
        console.log('Received remote stream');
        setIsConnected(true);
        setCallStatus('connected');
        
        // Set remote stream to video/audio elements
        if (callType === 'video' && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        } else if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
        }
      });

      webrtcServiceRef.current.onCallEnded(() => {
        console.log('Call ended by remote peer');
        setCallStatus('ended');
      });

      webrtcServiceRef.current.onConnectionStateChange((state) => {
        console.log('Connection state changed:', state);
        setConnectionState(state);
        
        if (state === 'connected') {
          setIsConnected(true);
          setCallStatus('connected');
        } else if (state === 'failed') {
          setCallStatus('error');
        }
      });

      // Delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Start or answer the call
      let localStream;
      try {
        // Check if we are the caller or recipient to determine action
        const isIncomingCall = callData.status === 'ringing' && callData.caller._id !== callData.recipient._id;
        
        if (isIncomingCall && callData.status === 'accepted') {
          // We accepted an incoming call
          console.log('Answering accepted call:', callData._id);
          localStream = await webrtcServiceRef.current.answerCall(callData._id, callType === 'video');
        } else {
          // We are initiating the call
          console.log('Starting call:', callData._id);
          localStream = await webrtcServiceRef.current.startCall(callData._id, callType === 'video');
        }

        // Set local stream to video/audio elements
        if (localStream) {
          if (callType === 'video' && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          } else if (localAudioRef.current) {
            localAudioRef.current.srcObject = localStream;
          }
          
          console.log('Local stream set successfully');
          setCallStatus('ringing');
        }
      } catch (streamError) {
        console.error('Error getting media stream:', streamError);
        if (streamError.name === 'NotAllowedError') {
          setCallStatus('error');
          // Don't auto end call on permission error, let user handle it
        } else if (streamError.name === 'NotFoundError') {
          setCallStatus('error');
          // Device not found, but keep call open
        } else {
          setCallStatus('error');
        }
      }

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setCallStatus('error');
      // Don't auto end call on initialization error
    }
  };

  const cleanupWebRTC = () => {
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.endCall();
      webrtcServiceRef.current = null;
    }
  };

  useEffect(() => {
    if (!isConnected) return;

    // Update call duration every second
    const durationTimer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(durationTimer);
  }, [isConnected]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    
    // End WebRTC call
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.endCall();
    }
    
    // Immediately call the onClose function
    if (callData && callData._id) {
      onClose(callData._id);
    } else {
      onClose();
    }
    
    // Reset states
    setIsConnected(false);
    setCallDuration(0);
    setCallStatus('calling');
    setIsMuted(false);
    setIsVideoOn(callType === 'video');
    setIsSpeakerOn(false);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Toggle audio in WebRTC
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.toggleAudio(newMutedState);
    }
  };

  const toggleVideo = () => {
    const newVideoState = !isVideoOn;
    setIsVideoOn(newVideoState);
    
    // Toggle video in WebRTC
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.toggleVideo(newVideoState);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handlePermissionRequest = async () => {
    try {
      setCallStatus('connecting');
      const result = await requestMediaPermissions(callType === 'video');
      
      if (result.success) {
        // Retry WebRTC initialization
        await initializeWebRTC();
      } else {
        setCallStatus('error');
        console.error('Permission request failed:', result.error);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setCallStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 w-full max-w-md mx-4 text-white shadow-2xl call-modal">
        {/* Call Status */}
        <div className="text-center mb-8">
          {callStatus === 'calling' && (
            <div className="mb-4">
              <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto animate-pulse mb-2"></div>
              <p className="text-yellow-300 text-sm font-medium">Connecting...</p>
            </div>
          )}
          
          {callStatus === 'connected' && (
            <div className="mb-4">
              <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
              <p className="text-green-300 text-sm font-medium">Connected • {formatDuration(callDuration)}</p>
            </div>
          )}
          
          {callStatus === 'ended' && (
            <div className="mb-4">
              <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2"></div>
              <p className="text-red-300 text-sm font-medium">Call Ended</p>
            </div>
          )}

          {callStatus === 'error' && (
            <div className="mb-4">
              <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2"></div>
              <p className="text-red-300 text-sm font-medium">Connection Error</p>
              <p className="text-red-200 text-xs mt-1">
                {connectionState === 'failed' 
                  ? 'Failed to connect to peer. Please check your internet connection.'
                  : 'Please allow camera/microphone permissions and try again.'
                }
              </p>
              <div className="mt-3 space-y-2">
                <button
                  onClick={handlePermissionRequest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2 mx-auto"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Allow {callType === 'video' ? 'Camera & Microphone' : 'Microphone'}</span>
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-blue-300 hover:text-blue-200 underline block mx-auto"
                >
                  Or refresh page and try again
                </button>
              </div>
            </div>
          )}

          {callStatus === 'connecting' && (
            <div className="mb-4">
              <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto animate-pulse mb-2"></div>
              <p className="text-blue-300 text-sm font-medium">Getting permissions...</p>
              <p className="text-blue-200 text-xs mt-1">Please allow camera/microphone access</p>
            </div>
          )}
        </div>

        {/* Participant Info */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className={`w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            callStatus === 'calling' ? 'call-ring' : ''
          }`}>
            <span className="text-2xl font-bold text-white">
              {participant?.firstName?.charAt(0)}{participant?.lastName?.charAt(0)}
            </span>
          </div>
          
          {/* Name */}
          <h2 className="text-2xl font-bold mb-1">
            {participant?.firstName} {participant?.lastName}
          </h2>
          
          {/* Call Type */}
          <p className="text-blue-200 text-sm flex items-center justify-center space-x-2">
            {callType === 'video' ? (
              <>
                <FiVideo className="w-4 h-4" />
                <span>Video Call</span>
              </>
            ) : (
              <>
                <FiPhone className="w-4 h-4" />
                <span>Voice Call</span>
              </>
            )}
          </p>
        </div>

        {/* Video Area */}
        {callType === 'video' && (
          <div className="mb-6">
            <div className="bg-gray-800 rounded-2xl h-48 relative overflow-hidden video-preview">
              {/* Remote Video (main view) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted={false}
                className="w-full h-full object-cover"
                style={{ display: isConnected ? 'block' : 'none' }}
              />
              
              {/* Fallback when no remote video */}
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FiVideo className="w-12 h-12 text-gray-400 mb-2 mx-auto" />
                    <p className="text-gray-400 text-sm">Waiting for video...</p>
                  </div>
                </div>
              )}
              
              {/* Local Video (corner preview) */}
              <div className="absolute top-4 right-4 w-20 h-16 bg-gray-700 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted={true}
                  className="w-full h-full object-cover"
                  style={{ display: isVideoOn ? 'block' : 'none' }}
                />
                {!isVideoOn && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-300">
                      {participant?.firstName?.charAt(0) || 'You'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audio Elements (hidden) */}
        <audio ref={localAudioRef} autoPlay playsInline muted={true} style={{ display: 'none' }} />
        <audio ref={remoteAudioRef} autoPlay playsInline muted={false} style={{ display: 'none' }} />

        {/* Call Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all duration-200 call-button ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? <FiMicOff className="w-6 h-6" /> : <FiMic className="w-6 h-6" />}
          </button>

          {/* Speaker Button */}
          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full transition-all duration-200 call-button ${
              isSpeakerOn 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isSpeakerOn ? <FiVolume2 className="w-6 h-6" /> : <FiVolumeX className="w-6 h-6" />}
          </button>

          {/* Video Toggle (only for video calls) */}
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 call-button ${
                isVideoOn 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isVideoOn ? <FiVideo className="w-6 h-6" /> : <FiVideoOff className="w-6 h-6" />}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 call-button transform hover:scale-105"
          >
            <FiPhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Call Info */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span>{isMuted ? 'Muted' : 'Mic On'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isSpeakerOn ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
              <span>{isSpeakerOn ? 'Speaker' : 'Earpiece'}</span>
            </div>
            
            {callType === 'video' && (
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isVideoOn ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>{isVideoOn ? 'Video On' : 'Video Off'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Connection Quality */}
        {isConnected && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="signal-bars">
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
              </div>
              <span className="text-xs text-green-300">
                {connectionState === 'connected' ? 'Connected' : 
                 connectionState === 'connecting' ? 'Connecting...' :
                 connectionState === 'failed' ? 'Connection Failed' : 
                 'Connection Status: ' + connectionState}
              </span>
            </div>
          </div>
        )}

        {/* WebRTC Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-center text-xs text-gray-400">
            WebRTC: {connectionState}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;