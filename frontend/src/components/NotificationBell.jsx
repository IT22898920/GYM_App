import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiTrash2, FiX, FiEye, FiClock } from 'react-icons/fi';
import { MdNotifications, MdNotificationsNone } from 'react-icons/md';
import api from '../utils/api';
import { useAlert } from '../contexts/AlertContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const { showAlert } = useAlert();

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      console.log('🔔 Fetching unread count...');
      const response = await api.getUnreadNotificationCount();
      console.log('🔔 Unread count response:', response);
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      console.log('📥 Fetching notifications, page:', pageNum);
      const response = await api.getNotifications(pageNum, 10);
      console.log('📥 Notifications response:', response);
      if (response.success) {
        if (append) {
          setNotifications(prev => [...prev, ...response.data]);
        } else {
          setNotifications(response.data);
        }
        
        setHasMore(response.pagination.currentPage < response.pagination.totalPages);
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, true);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, read: true, readAt: new Date() }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
      );
      
      setUnreadCount(0);
      showAlert('All notifications marked as read', 'success');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showAlert('Failed to mark all as read', 'error');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.deleteNotification(notificationId);
      
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      showAlert('Notification deleted', 'success');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showAlert('Failed to delete notification', 'error');
    }
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return notifDate.toLocaleDateString();
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'collaboration_request_received':
        return '🤝';
      case 'collaboration_request_accepted':
        return '✅';
      case 'collaboration_request_rejected':
        return '❌';
      case 'gym_request_sent':
        return '📤';
      case 'gym_request_received':
        return '📨';
      case 'gym_request_approved':
        return '🎉';
      case 'gym_request_rejected':
        return '❌';
      case 'gym_request_cancelled':
        return '🚫';
      case 'gym_registration_approved':
        return '🎉';
      case 'gym_registration_rejected':
        return '❌';
      case 'gym_registration_submitted':
        return '📋';
      case 'new_gym_registration':
        return '🏢';
      case 'instructor_application_submitted':
        return '📝';
      case 'instructor_application_pending':
        return '⏳';
      case 'instructor_application_approved':
        return '🎓';
      case 'instructor_application_rejected':
        return '❌';
      case 'instructor_registration_completed':
        return '👨‍🏫';
      case 'admin_action_completed':
        return '⚡';
      case 'welcome_message':
        return '👋';
      case 'system_announcement':
        return '📢';
      default:
        return '🔔';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial fetch
  useEffect(() => {
    console.log('🚀 NotificationBell mounted, fetching initial data...');
    fetchUnreadCount();
    
    // Fetch unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => {
          console.log('🔔 Bell clicked, current state:', { isOpen, notifications: notifications.length });
          setIsOpen(!isOpen);
        }}
        className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-lg"
      >
        {unreadCount > 0 ? (
          <MdNotifications className="w-6 h-6" />
        ) : (
          <MdNotificationsNone className="w-6 h-6" />
        )}
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-[9999] max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FiBell className="w-5 h-5" />
              Notifications
            </h3>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600 mx-auto mb-2"></div>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MdNotificationsNone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                      !notification.read ? 'bg-violet-600/10 border-l-4 border-l-violet-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm mb-1 truncate">
                          {notification.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {/* Sender info */}
                        {notification.sender && (
                          <p className="text-gray-500 text-xs mb-1">
                            From: {notification.sender.firstName} {notification.sender.lastName}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
                                title="Mark as read"
                              >
                                <FiCheck className="w-3 h-3" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Load More */}
                {hasMore && (
                  <div className="p-4">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="w-full text-center text-violet-400 hover:text-violet-300 transition-colors text-sm"
                    >
                      {loading ? 'Loading...' : 'Load more notifications'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;