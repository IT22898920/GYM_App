import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

/// API Service for making HTTP requests
class ApiService {
  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Get auth token from storage
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // Get headers with auth token
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      final token = await _getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // GET request
  Future<http.Response> get(
    String url, {
    bool includeAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .get(
            Uri.parse(url),
            headers: headers,
          )
          .timeout(ApiConfig.timeout);
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // POST request
  Future<http.Response> post(
    String url, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .post(
            Uri.parse(url),
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(ApiConfig.timeout);
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // PUT request
  Future<http.Response> put(
    String url, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .put(
            Uri.parse(url),
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(ApiConfig.timeout);
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // PATCH request
  Future<http.Response> patch(
    String url, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .patch(
            Uri.parse(url),
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(ApiConfig.timeout);
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // DELETE request
  Future<http.Response> delete(
    String url, {
    bool includeAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(includeAuth: includeAuth);
      final response = await http
          .delete(
            Uri.parse(url),
            headers: headers,
          )
          .timeout(ApiConfig.timeout);
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // Multipart request (for file uploads)
  Future<http.StreamedResponse> multipartPost(
    String url,
    Map<String, String> fields,
    Map<String, String> files, {
    bool includeAuth = true,
  }) async {
    try {
      final request = http.MultipartRequest('POST', Uri.parse(url));

      // Add headers
      final headers = await _getHeaders(includeAuth: includeAuth);
      request.headers.addAll(headers);

      // Add fields
      request.fields.addAll(fields);

      // Add files
      for (var entry in files.entries) {
        request.files.add(await http.MultipartFile.fromPath(
          entry.key,
          entry.value,
        ));
      }

      return await request.send().timeout(ApiConfig.timeout);
    } catch (e) {
      rethrow;
    }
  }

  // Handle API response
  Map<String, dynamic> handleResponse(http.Response response) {
    final data = jsonDecode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      throw ApiException(
        message: data['message'] ?? 'Something went wrong',
        statusCode: response.statusCode,
      );
    }
  }
}

// Custom exception for API errors
class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException({
    required this.message,
    required this.statusCode,
  });

  @override
  String toString() => message;
}
