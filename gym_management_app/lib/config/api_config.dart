/// API Configuration
/// Change the baseUrl based on your environment
class ApiConfig {
  // Base URL for API requests
  // For local development (running on emulator/web):
  static const String baseUrl = 'http://localhost:5000/api';

  // For Android emulator (use your computer's IP):
  // static const String baseUrl = 'http://10.0.2.2:5000/api';

  // For real device on same network (use your computer's IP):
  // static const String baseUrl = 'http://192.168.1.X:5000/api';

  // For production:
  // static const String baseUrl = 'https://your-domain.com/api';

  // API Endpoints
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String logout = '$baseUrl/auth/logout';
  static const String getMe = '$baseUrl/auth/me';
  static const String refreshToken = '$baseUrl/auth/refresh';

  // Gym endpoints
  static const String gyms = '$baseUrl/gyms';
  static String gymById(String id) => '$baseUrl/gyms/$id';
  static const String registerGym = '$baseUrl/gyms/register';

  // Member endpoints
  static const String members = '$baseUrl/members';
  static String memberById(String id) => '$baseUrl/members/$id';
  static String registerToGym(String gymId) => '$baseUrl/members/register/$gymId';

  // Notification endpoints
  static const String notifications = '$baseUrl/notifications';
  static const String unreadCount = '$baseUrl/notifications/unread-count';

  // Mobile endpoints (for push notifications)
  static const String registerDevice = '$baseUrl/mobile/register-device';
  static const String unregisterDevice = '$baseUrl/mobile/unregister-device';

  // Instructor endpoints
  static const String instructors = '$baseUrl/instructors';
  static const String applyInstructor = '$baseUrl/instructors/apply';

  // Class endpoints
  static const String classes = '$baseUrl/classes';

  // Timeout duration for API requests
  static const Duration timeout = Duration(seconds: 30);
}
