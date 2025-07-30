import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChatList from '../../components/ChatList';
import CallHistory from '../../components/CallHistory';
import { FiMessageCircle, FiPhone } from 'react-icons/fi';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Messages & Calls</h1>
        <p className="text-gray-300">
          Chat with gym owners and view your call history
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'chats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiMessageCircle size={18} />
                <span>Chats</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'calls'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiPhone size={18} />
                <span>Call History</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'chats' && <ChatList />}
        {activeTab === 'calls' && <CallHistory userId={user?.id} />}
      </div>
    </div>
  );
};

export default Messages;