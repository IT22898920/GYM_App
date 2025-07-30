import React, { useState, useEffect } from 'react';
import { FiPhone, FiPhoneOff, FiVideo, FiX } from 'react-icons/fi';

const IncomingCallModal = ({ call, onAccept, onReject, onClose }) => {
  const [isRinging, setIsRinging] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!call) return;

    // Play ringtone (you can add actual audio here)
    const playRingtone = () => {
      // You can add audio element here
      console.log('📞 Incoming call ringtone');
    };

    playRingtone();

    // Auto-dismiss after 60 seconds if not answered (increased from 30s)
    const timeout = setTimeout(() => {
      handleReject();
    }, 60000);

    return () => {
      clearTimeout(timeout);
      setIsRinging(false);
    };
  }, [call]);

  const handleAccept = async () => {
    if (isProcessing) {
      console.log('🚫 Frontend: Call accept already in progress');
      return;
    }
    
    try {
      setIsProcessing(true);
      console.log('🔍 Frontend: IncomingCallModal - Calling onAccept callback:', {
        callId: call._id,
        callStatus: call.status,
        caller: call.caller,
        timestamp: new Date().toISOString()
      });
      setIsRinging(false);
      
      // Don't make API call here - let CallContext handle it
      onAccept(call);
    } catch (error) {
      console.error('❌ Frontend: Error in handleAccept:', error);
      setIsProcessing(false); // Reset on error
    }
  };

  const handleReject = async () => {
    if (isProcessing) {
      console.log('🚫 Frontend: Call reject already in progress');
      return;
    }
    
    try {
      setIsProcessing(true);
      setIsRinging(false);
      console.log('🔍 Frontend: IncomingCallModal - Calling onReject callback');
      
      // Don't make API call here - let CallContext handle it
      onReject();
    } catch (error) {
      console.error('Error rejecting call:', error);
    } finally {
      onClose();
    }
  };

  if (!call) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 w-full max-w-sm mx-4 text-white shadow-2xl call-modal animate-fade-in">
        {/* Call Type Indicator */}
        <div className="text-center mb-4">
          <div className="w-6 h-6 bg-green-400 rounded-full mx-auto animate-pulse mb-2"></div>
          <p className="text-green-300 text-sm font-medium">
            Incoming {call.callType} call
          </p>
        </div>

        {/* Caller Info */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className={`w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isRinging ? 'call-ring' : ''
          }`}>
            <span className="text-2xl font-bold text-white">
              {call.caller?.firstName?.charAt(0)}
              {call.caller?.lastName?.charAt(0)}
            </span>
          </div>
          
          {/* Name */}
          <h2 className="text-2xl font-bold mb-2">
            {call.caller?.firstName} {call.caller?.lastName}
          </h2>
          
          {/* Call Type */}
          <p className="text-blue-200 text-sm flex items-center justify-center space-x-2">
            {call.callType === 'video' ? (
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

        {/* Incoming Call Animation */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-green-300 text-sm mt-2">Ringing...</p>
        </div>

        {/* Call Actions */}
        <div className="flex justify-center space-x-8">
          {/* Reject Button */}
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 call-button shadow-lg ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 transform hover:scale-110'
            }`}
            title="Decline Call"
          >
            <FiPhoneOff className="w-8 h-8 text-white" />
          </button>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 call-button shadow-lg ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 transform hover:scale-110 animate-pulse'
            }`}
            title="Accept Call"
          >
            <FiPhone className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 mb-2">Quick Actions</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleReject}
              className="text-xs text-gray-300 hover:text-white transition-colors"
            >
              Decline & Message
            </button>
            <span className="text-gray-600">•</span>
            <button 
              onClick={handleReject}
              className="text-xs text-gray-300 hover:text-white transition-colors"
            >
              Remind Later
            </button>
          </div>
        </div>

        {/* Auto-dismiss countdown */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Call will auto-decline in 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;