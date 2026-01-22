# Flutter Mobile App - Quick Start Guide

This guide will help you get started with the Flutter mobile app development for the Gym Management System in just a few steps.

## 🚀 Prerequisites

Before you begin, ensure you have:

- [ ] Flutter SDK installed (v3.0.0 or higher)
- [ ] Android Studio or VS Code with Flutter extensions
- [ ] Xcode (for iOS development on macOS)
- [ ] Firebase account
- [ ] Backend server running (see BACKEND_MOBILE_SETUP.md)

### Check Your Flutter Installation

```bash
flutter doctor
```

Make sure all checkmarks are green. If not, follow the instructions provided by `flutter doctor`.

---

## 📱 Step 1: Create Flutter Project

```bash
# Navigate to your project root
cd /path/to/GYM_App

# Create Flutter project
flutter create gym_management_app

# Navigate into the project
cd gym_management_app

# Test that it works
flutter run
```

You should see the default Flutter counter app running.

---

## 🔥 Step 2: Setup Firebase for Flutter

### Install FlutterFire CLI

```bash
# Install FlutterFire CLI globally
dart pub global activate flutterfire_cli

# Add to PATH (if not already)
export PATH="$PATH":"$HOME/.pub-cache/bin"
```

### Configure Firebase

```bash
# Make sure you're in the Flutter project directory
cd gym_management_app

# Login to Firebase (if not already logged in)
firebase login

# Configure FlutterFire (this will create firebase_options.dart)
flutterfire configure
```

Follow the prompts:
1. Select your Firebase project (or create a new one)
2. Select platforms (iOS, Android, Web)
3. This will create `lib/firebase_options.dart`

---

## 📦 Step 3: Add Dependencies

Replace the contents of `pubspec.yaml` with the following:

```yaml
name: gym_management_app
description: Gym Management Mobile Application
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # State Management
  provider: ^6.1.1

  # HTTP & API
  dio: ^5.4.0
  pretty_dio_logger: ^1.3.1

  # Real-time Communication
  socket_io_client: ^2.0.3

  # Local Storage
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0

  # Authentication & Security
  jwt_decoder: ^2.0.1

  # UI & Design
  cupertino_icons: ^1.0.6
  google_fonts: ^6.1.0
  cached_network_image: ^3.3.0

  # Forms & Validation
  flutter_form_builder: ^9.1.1
  form_builder_validators: ^9.1.0

  # Image & File Handling
  image_picker: ^1.0.7
  file_picker: ^6.1.1
  path_provider: ^2.1.1

  # Maps & Location
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0

  # Push Notifications
  firebase_core: ^2.24.2
  firebase_messaging: ^14.7.9
  flutter_local_notifications: ^16.3.0

  # Date & Time
  intl: ^0.19.0

  # Utilities
  url_launcher: ^6.2.2
  permission_handler: ^11.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true
```

### Install Dependencies

```bash
flutter pub get
```

---

## 📂 Step 4: Create Project Structure

Run this script to create the folder structure:

```bash
# Create main folders
mkdir -p lib/config
mkdir -p lib/core/constants
mkdir -p lib/core/utils
mkdir -p lib/data/models
mkdir -p lib/data/repositories
mkdir -p lib/data/datasources/local
mkdir -p lib/data/datasources/remote
mkdir -p lib/presentation/providers
mkdir -p lib/presentation/screens/auth
mkdir -p lib/presentation/screens/customer
mkdir -p lib/presentation/screens/gym_owner
mkdir -p lib/presentation/screens/instructor
mkdir -p lib/presentation/screens/admin
mkdir -p lib/presentation/widgets/common
mkdir -p lib/services
mkdir -p assets/images
mkdir -p assets/icons

echo "✅ Folder structure created!"
```

---

## ⚙️ Step 5: Configure API Client

Create `lib/core/constants/api_constants.dart`:

```dart
class ApiConstants {
  // Update this with your backend URL
  static const String baseUrl = 'http://localhost:5000';

  // For Android emulator use: http://10.0.2.2:5000
  // For iOS simulator use: http://localhost:5000
  // For real device use: http://YOUR_COMPUTER_IP:5000

  // Auth endpoints
  static const String login = '/api/auth/login';
  static const String register = '/api/auth/register';
  static const String logout = '/api/auth/logout';
  static const String getMe = '/api/auth/me';
  static const String refreshToken = '/api/auth/refresh';

  // Mobile endpoints
  static const String registerDevice = '/api/mobile/register-device';
  static const String unregisterDevice = '/api/mobile/unregister-device';

  // Gym endpoints
  static const String gyms = '/api/gyms';
  static const String nearbyGyms = '/api/gyms/search/nearby';

  // Member endpoints
  static const String members = '/api/members';

  // Notification endpoints
  static const String notifications = '/api/notifications';
}
```

Create `lib/data/datasources/remote/api_client.dart`:

```dart
import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import '../../../core/constants/api_constants.dart';
import '../../../services/auth_service.dart';

class ApiClient {
  late Dio _dio;
  final AuthService _authService = AuthService();

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add logger
    _dio.interceptors.add(PrettyDioLogger(
      requestHeader: true,
      requestBody: true,
      responseBody: true,
      responseHeader: false,
      error: true,
      compact: true,
    ));

    // Add auth interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _authService.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired, try to refresh
            final newToken = await _authService.refreshAccessToken(_dio);
            if (newToken != null) {
              // Retry the request
              error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
              return handler.resolve(await _dio.fetch(error.requestOptions));
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  Dio get dio => _dio;
}
```

---

## 🔐 Step 6: Setup Authentication Service

Create `lib/services/auth_service.dart`:

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';

class AuthService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<void> storeTokens(String accessToken, String refreshToken) async {
    await _storage.write(key: 'access_token', value: accessToken);
    await _storage.write(key: 'refresh_token', value: refreshToken);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: 'access_token');
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: 'refresh_token');
  }

  bool isTokenExpired(String token) {
    return JwtDecoder.isExpired(token);
  }

  Future<String?> refreshAccessToken(Dio dio) async {
    try {
      final refreshToken = await getRefreshToken();
      if (refreshToken == null) return null;

      final response = await dio.post(
        ApiConstants.refreshToken,
        data: {'refreshToken': refreshToken}
      );

      if (response.statusCode == 200) {
        final newAccessToken = response.data['accessToken'];
        await _storage.write(key: 'access_token', value: newAccessToken);
        return newAccessToken;
      }
    } catch (e) {
      print('Error refreshing token: $e');
    }
    return null;
  }

  Future<void> logout() async {
    await _storage.deleteAll();
  }
}
```

---

## 🎨 Step 7: Create App Theme

Create `lib/config/theme.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.deepPurple,
        brightness: Brightness.light,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.deepPurple,
        brightness: Brightness.dark,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }
}
```

---

## 📱 Step 8: Update main.dart

Replace `lib/main.dart` with:

```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'config/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gym Management',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.fitness_center,
              size: 100,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 20),
            Text(
              'Gym Management',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 10),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
```

---

## 🧪 Step 9: Test the Setup

```bash
# Run on Android
flutter run -d android

# Run on iOS
flutter run -d ios

# Run on web
flutter run -d chrome
```

You should see the splash screen with the Gym Management app title.

---

## 🔧 Platform-Specific Configuration

### Android Configuration

Update `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- Add permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.CAMERA"/>

    <application
        android:label="Gym Management"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true"> <!-- Allow HTTP for development -->

        <!-- Rest of the file -->
    </application>
</manifest>
```

### iOS Configuration

Update `ios/Runner/Info.plist`:

```xml
<dict>
    <!-- Add permissions -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location to find nearby gyms</string>

    <key>NSCameraUsageDescription</key>
    <string>We need camera access to upload payment receipts</string>

    <key>NSPhotoLibraryUsageDescription</key>
    <string>We need photo library access to upload images</string>

    <!-- Rest of the file -->
</dict>
```

---

## 🎯 Next Steps

Now that your Flutter project is set up:

1. **Follow FLUTTER_MOBILE_APP_PLAN.md** for detailed implementation guide
2. **Start with authentication screens** (login, register)
3. **Implement API integration** for each user role
4. **Test with your backend** (make sure it's running!)

### Recommended Development Order:

1. Authentication (Login/Register) - Week 1
2. Customer features (Find gyms, Register) - Week 2-3
3. Gym Owner features (Members, Payment verification) - Week 4-5
4. Instructor features (Students, Workouts) - Week 6-7
5. Admin features (Approvals, Management) - Week 8
6. Polish and testing - Week 9-10

---

## 📚 Useful Commands

```bash
# Run app
flutter run

# Build APK
flutter build apk

# Build iOS
flutter build ios

# Clean build
flutter clean

# Update dependencies
flutter pub get

# Check for updates
flutter pub outdated

# Format code
flutter format .

# Analyze code
flutter analyze
```

---

## 🐛 Common Issues

### Issue: "Firebase not configured"
**Solution:** Run `flutterfire configure` again

### Issue: "Dio error - Network unreachable"
**Solution:**
- Check if backend is running
- Use correct IP for device testing
- For Android emulator: `http://10.0.2.2:5000`

### Issue: "Permission denied"
**Solution:** Add necessary permissions in AndroidManifest.xml and Info.plist

### Issue: "Package not found"
**Solution:** Run `flutter pub get` and restart IDE

---

## ✅ Checklist

- [ ] Flutter SDK installed and working
- [ ] Firebase project created and configured
- [ ] Flutter project created
- [ ] Dependencies installed
- [ ] Folder structure created
- [ ] API client configured with backend URL
- [ ] Theme configured
- [ ] App runs successfully
- [ ] Backend is running and accessible

---

**You're all set! 🎉**

Start building your first screen (Login/Register) and refer to the detailed implementation guide in `FLUTTER_MOBILE_APP_PLAN.md`.

Mokak harida den? Ready to code! 💪
