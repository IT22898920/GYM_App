import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/user.dart';
import 'api_service.dart';

/// Authentication Service
/// Handles login, signup, logout, and token management
class AuthService extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  User? _currentUser;
  String? _token;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _currentUser != null && _token != null;

  // Set loading state
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  // Set error message
  void _setError(String? message) {
    _errorMessage = message;
    notifyListeners();
  }

  /// Login user
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _setError(null);

      final response = await _apiService.post(
        ApiConfig.login,
        body: {
          'email': email,
          'password': password,
        },
        includeAuth: false,
      );

      final data = _apiService.handleResponse(response);

      if (data['success'] == true) {
        // Save token
        _token = data['token'];
        await _saveToken(_token!);

        // Save user data
        _currentUser = User.fromJson(data['user']);
        await _saveUser(_currentUser!);

        notifyListeners();
        return true;
      }

      _setError(data['message'] ?? 'Login failed');
      return false;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('Network error. Please check your connection.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Register new user
  Future<bool> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String? phoneNumber,
    String role = 'customer',
  }) async {
    try {
      _setLoading(true);
      _setError(null);

      final response = await _apiService.post(
        ApiConfig.register,
        body: {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
          'phoneNumber': phoneNumber,
          'role': role,
        },
        includeAuth: false,
      );

      final data = _apiService.handleResponse(response);

      if (data['success'] == true) {
        // Auto-login after registration
        _token = data['token'];
        await _saveToken(_token!);

        _currentUser = User.fromJson(data['user']);
        await _saveUser(_currentUser!);

        notifyListeners();
        return true;
      }

      _setError(data['message'] ?? 'Registration failed');
      return false;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('Network error. Please check your connection.');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Logout user
  Future<void> logout() async {
    try {
      // Call logout API (optional - backend may want to invalidate token)
      if (_token != null) {
        await _apiService.post(ApiConfig.logout);
      }
    } catch (e) {
      // Ignore errors on logout
      if (kDebugMode) {
        print('Logout API error: $e');
      }
    } finally {
      // Clear local data
      _currentUser = null;
      _token = null;
      await _clearStorage();
      notifyListeners();
    }
  }

  /// Get current user from API
  Future<bool> getCurrentUser() async {
    try {
      final response = await _apiService.get(ApiConfig.getMe);
      final data = _apiService.handleResponse(response);

      if (data['success'] == true) {
        _currentUser = User.fromJson(data['user']);
        await _saveUser(_currentUser!);
        notifyListeners();
        return true;
      }

      return false;
    } catch (e) {
      if (kDebugMode) {
        print('Get current user error: $e');
      }
      return false;
    }
  }

  /// Load saved user and token from storage
  Future<bool> loadSavedAuth() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      final savedToken = prefs.getString('token');
      if (savedToken == null) return false;

      _token = savedToken;

      // Try to get current user from API
      final success = await getCurrentUser();

      if (success) {
        notifyListeners();
        return true;
      } else {
        // Token might be expired, clear it
        await _clearStorage();
        return false;
      }
    } catch (e) {
      if (kDebugMode) {
        print('Load saved auth error: $e');
      }
      return false;
    }
  }

  /// Save token to local storage
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  /// Save user to local storage
  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('userId', user.id);
    await prefs.setString('userRole', user.role);
    await prefs.setString('userName', user.fullName);
    await prefs.setString('userEmail', user.email);
  }

  /// Clear all storage
  Future<void> _clearStorage() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userId');
    await prefs.remove('userRole');
    await prefs.remove('userName');
    await prefs.remove('userEmail');
  }

  /// Clear error message
  void clearError() {
    _setError(null);
  }
}
