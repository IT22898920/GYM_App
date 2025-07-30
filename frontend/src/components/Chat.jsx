import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { useCall } from '../contexts/CallContext';
import { FiSend, FiX, FiUser, FiSmile, FiPhone, FiVideo, FiMoreHorizontal } from 'react-icons/fi';
import api from '../utils/api';

const Chat = ({ collaborationId, onClose }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { initiateCall } = useCall();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    fetchChat();
    // Focus input when chat opens
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [collaborationId]);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await api.getOrCreateChat(collaborationId);
      if (response.success) {
        setChat(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      showAlert('Failed to load chat', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsTyping(false);

    try {
      setSending(true);
      const response = await api.sendChatMessage(chat._id, messageText);
      
      if (response.success) {
        // Add the new message to chat with animation
        setChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, response.data]
        }));
        
        // Show success feedback
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showAlert('Failed to send message', 'error');
      // Restore message if failed
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Show typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const handleVoiceCall = async () => {
    if (!chat || !otherParticipant) return;
    
    try {
      showAlert(`Calling ${otherParticipant?.firstName}...`, 'info');
      await initiateCall(chat._id, 'voice', otherParticipant);
    } catch (error) {
      console.error('Error initiating voice call:', error);
      showAlert('Failed to start voice call', 'error');
    }
  };

  const handleVideoCall = async () => {
    if (!chat || !otherParticipant) return;
    
    try {
      showAlert(`Starting video call with ${otherParticipant?.firstName}...`, 'info');
      await initiateCall(chat._id, 'video', otherParticipant);
    } catch (error) {
      console.error('Error initiating video call:', error);
      showAlert('Failed to start video call', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">Failed to load chat</p>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const otherParticipant = chat.participants.find(p => p._id !== user.id);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden chat-container">
      {/* Modern Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-sm">
              {otherParticipant?.firstName?.charAt(0)}
              {otherParticipant?.lastName?.charAt(0)}
            </span>
          </div>
          
          <div>
            <h3 className="font-semibold text-white">
              {otherParticipant?.firstName} {otherParticipant?.lastName}
            </h3>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-blue-100">{chat.gym?.gymName}</p>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-green-200">Online</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleVoiceCall}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
            title="Voice Call"
          >
            <FiPhone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Voice Call
            </div>
          </button>
          <button 
            onClick={handleVideoCall}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
            title="Video Call"
          >
            <FiVideo className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Video Call
            </div>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors group relative">
            <FiMoreHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              More Options
            </div>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
            title="Close Chat"
          >
            <FiX className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Close Chat
            </div>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white chat-messages">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-4">
              <FiSmile className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Start your conversation!</h3>
            <p className="text-gray-500 max-w-sm">
              Send a message to {otherParticipant?.firstName} and begin collaborating on your fitness journey.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {chat.messages.map((message, index) => {
              const isMyMessage = message.sender._id === user.id;
              const prevMessage = chat.messages[index - 1];
              const showDate = !prevMessage || 
                formatDate(message.createdAt) !== formatDate(prevMessage.createdAt);
              
              return (
                <div key={index}>
                  {/* Date Separator */}
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      isMyMessage ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar for other user */}
                      {!isMyMessage && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-xs font-medium">
                            {otherParticipant?.firstName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm message-bubble ${
                          isMyMessage
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md animate-slide-in-right'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md animate-slide-in-left'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isMyMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
          You are typing...
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-100 chat-input-area">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${otherParticipant?.firstName}...`}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 max-h-32 chat-input"
              rows="1"
              disabled={sending}
              style={{
                minHeight: '48px',
                lineHeight: '1.5'
              }}
            />
            
            {/* Emoji Button */}
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <FiSmile className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-2xl transition-all duration-200 flex items-center justify-center send-button ${
              newMessage.trim() && !sending
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <FiSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;