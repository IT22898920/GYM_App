import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import api from '../utils/api';
import IncomingCallModal from '../components/IncomingCallModal';
import CallModal from '../components/CallModal';

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [showActiveCallModal, setShowActiveCallModal] = useState(false);
  const [processingCall, setProcessingCall] = useState(false);

  // Poll for incoming calls (in real app, use WebSocket/Socket.io)
  useEffect(() => {
    if (!user) return;

    const checkForIncomingCalls = async () => {
      try {
        // Check notifications for incoming calls
        const response = await api.getNotifications(1, 5, true);
        if (response.success) {
          const callNotification = response.data.find(
            notification => notification.type === 'incoming_call' && !notification.read
          );
          
          if (callNotification && !incomingCall) {
            // Simulate incoming call data (in real app, this would come from WebSocket)
            const callData = {
              _id: callNotification.data.callId,
              caller: {
                firstName: callNotification.message.split(' ')[0],
                lastName: callNotification.message.split(' ')[1] || ''
              },
              callType: callNotification.data.callType,
              status: 'ringing'
            };
            
            setIncomingCall(callData);
            setShowIncomingCallModal(true);
            
            // Mark notification as read
            await api.markNotificationAsRead(callNotification._id);
          }
        }
      } catch (error) {
        console.error('Error checking for incoming calls:', error);
      }
    };

    // Check every 3 seconds for incoming calls
    const interval = setInterval(checkForIncomingCalls, 3000);
    
    return () => clearInterval(interval);
  }, [user, incomingCall]);

  const acceptCall = async (call) => {
    if (processingCall) {
      console.log('🚫 CallContext: Call already being processed');
      return;
    }
    
    try {
      setProcessingCall(true);
      console.log('🔍 CallContext: Accepting call via API:', call._id);
      
      // Accept the call in the backend
      await api.acceptCall(call._id);
      
      console.log('✅ CallContext: Call accepted successfully');
      setIncomingCall(null);
      setShowIncomingCallModal(false);
      
      // Set call status to accepted for WebRTC
      const acceptedCall = {
        ...call,
        status: 'accepted'
      };
      
      setActiveCall(acceptedCall);
      setShowActiveCallModal(true);
      showAlert(`Call accepted with ${call.caller.firstName}`, 'success');
    } catch (error) {
      console.error('❌ CallContext: Error accepting call:', error);
      showAlert('Failed to accept call', 'error');
    } finally {
      setProcessingCall(false);
    }
  };

  const rejectCall = async (call) => {
    if (processingCall) {
      console.log('🚫 CallContext: Call already being processed');
      return;
    }
    
    try {
      setProcessingCall(true);
      console.log('🔍 CallContext: Rejecting call via API:', call?._id);
      
      if (call && call._id) {
        await api.rejectCall(call._id);
      }
      console.log('✅ CallContext: Call rejected successfully');
      setIncomingCall(null);
      setShowIncomingCallModal(false);
      showAlert('Call declined', 'info');
    } catch (error) {
      console.error('❌ CallContext: Error rejecting call:', error);
      setIncomingCall(null);
      setShowIncomingCallModal(false);
    } finally {
      setProcessingCall(false);
    }
  };

  const endCall = async (callId) => {
    try {
      if (callId) {
        await api.endCall(callId);
      }
      setActiveCall(null);
      setShowActiveCallModal(false);
      showAlert('Call ended', 'info');
    } catch (error) {
      console.error('Error ending call:', error);
      showAlert('Failed to end call', 'error');
    }
  };

  const closeIncomingCall = () => {
    setIncomingCall(null);
    setShowIncomingCallModal(false);
  };

  const closeActiveCall = () => {
    if (activeCall) {
      endCall(activeCall._id);
    } else {
      setShowActiveCallModal(false);
    }
  };

  const initiateCall = async (chatId, callType, participant) => {
    try {
      const response = await api.initiateCall(chatId, callType);
      if (response.success) {
        const callData = {
          ...response.data,
          recipient: participant
        };
        setActiveCall(callData);
        setShowActiveCallModal(true);
        return response;
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  };

  const value = {
    incomingCall,
    activeCall,
    acceptCall,
    rejectCall,
    endCall,
    initiateCall,
    showIncomingCallModal,
    showActiveCallModal
  };

  return (
    <CallContext.Provider value={value}>
      {children}
      
      {/* Incoming Call Modal */}
      {showIncomingCallModal && incomingCall && (
        <IncomingCallModal
          call={incomingCall}
          onAccept={() => acceptCall(incomingCall)}
          onReject={() => rejectCall(incomingCall)}
          onClose={closeIncomingCall}
        />
      )}
      
      {/* Active Call Modal */}
      {showActiveCallModal && activeCall && (
        <CallModal
          isOpen={showActiveCallModal}
          onClose={closeActiveCall}
          participant={activeCall.recipient || activeCall.caller}
          callType={activeCall.callType}
          callData={activeCall}
        />
      )}
    </CallContext.Provider>
  );
};