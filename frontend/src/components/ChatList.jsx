import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { FiMessageCircle, FiUsers, FiSearch, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';
import api from '../utils/api';
import Chat from './Chat';

const ChatList = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChats();
    fetchUnreadCount();
    
    // Refresh chats every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchChats();
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.getUserChats();
      if (response.success) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      showAlert('Failed to load chats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.getChatUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return messageDate.toLocaleDateString();
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user.id);
  };

  const openChat = (chat) => {
    setSelectedChat(chat.collaborationRequest);
  };

  const closeChat = () => {
    setSelectedChat(null);
    fetchChats(); // Refresh to update unread counts
    fetchUnreadCount();
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat);
    const searchLower = searchTerm.toLowerCase();
    return (
      otherParticipant?.firstName?.toLowerCase().includes(searchLower) ||
      otherParticipant?.lastName?.toLowerCase().includes(searchLower) ||
      chat.gym?.gymName?.toLowerCase().includes(searchLower)
    );
  });

  if (selectedChat) {
    return (
      <div className="space-y-4">
        {/* Back button */}
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={closeChat}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Messages</span>
          </button>
        </div>
        
        <Chat 
          collaborationId={selectedChat} 
          onClose={closeChat}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FiMessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Messages</h2>
              <p className="text-blue-100 text-sm">
                {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </div>
              <span className="text-blue-100 text-sm">unread</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {chats.length > 0 && (
          <div className="mt-4 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-600 font-medium">Loading conversations...</p>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-12 px-6">
            {searchTerm ? (
              // No search results
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try searching with a different name or gym
                </p>
              </div>
            ) : (
              // No chats at all
              <div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiMessageCircle className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">Start Conversations!</h3>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Your chats will appear here when you accept collaboration invitations from gym owners or instructors.
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FiUsers className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Accept collaboration requests to start chatting and collaborating!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat, index) => {
              const otherParticipant = getOtherParticipant(chat);
              const hasUnreadMessages = chat.unreadCount > 0;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className={`flex items-center p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 group chat-list-item ${
                    hasUnreadMessages ? 'bg-gradient-to-r from-blue-50/50 to-transparent' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200 group-hover:scale-105 ${
                      hasUnreadMessages 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <span className="text-lg">
                        {otherParticipant?.firstName?.charAt(0)}
                        {otherParticipant?.lastName?.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full online-indicator"></div>
                  </div>
                  
                  {/* Chat Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate ${
                        hasUnreadMessages ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {otherParticipant?.firstName} {otherParticipant?.lastName}
                      </h3>
                      
                      {chat.lastMessage && (
                        <span className={`text-xs flex-shrink-0 ml-2 ${
                          hasUnreadMessages ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}>
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-600 font-medium mb-1">
                          📍 {chat.gym?.gymName}
                        </p>
                        
                        {chat.lastMessage ? (
                          <p className={`text-sm truncate ${
                            hasUnreadMessages ? 'text-gray-800 font-medium' : 'text-gray-500'
                          }`}>
                            {chat.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No messages yet</p>
                        )}
                      </div>
                      
                      {hasUnreadMessages && (
                        <div className="flex items-center space-x-2 ml-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg unread-badge">
                            <span className="text-white text-xs font-bold">
                              {chat.unreadCount}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Role badge */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        otherParticipant?.role === 'gymOwner' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {otherParticipant?.role === 'gymOwner' ? '🏢 Gym Owner' : '💪 Instructor'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                    <FiMoreVertical className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;