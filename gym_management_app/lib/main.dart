import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';
import 'services/auth_service.dart';
import 'screens/auth/login_screen.dart';
import 'screens/customer/home_screen.dart';
import 'screens/customer/customer_home_screen.dart';
import 'screens/gym_owner/gym_owner_dashboard.dart';
import 'screens/instructor/instructor_dashboard.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/common/coming_soon_screen.dart';

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
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
      ],
      child: MaterialApp(
        title: 'GYM Management',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 0,
          ),
        ),
        initialRoute: '/',
        onGenerateRoute: (settings) {
          // Define all implemented routes
          final routes = <String, WidgetBuilder>{
            '/': (context) => const HomeScreen(),
            '/login': (context) => const LoginScreen(),
            '/customer/home': (context) => const CustomerHomeScreen(),
            '/gym-owner/dashboard': (context) => const GymOwnerDashboard(),
            '/instructor/dashboard': (context) => const InstructorDashboard(),
            '/admin/dashboard': (context) => const AdminDashboard(),
          };

          // Check if route is implemented
          if (routes.containsKey(settings.name)) {
            return MaterialPageRoute(
              builder: routes[settings.name]!,
              settings: settings,
            );
          }

          // Show "Coming Soon" screen for undefined routes
          return MaterialPageRoute(
            builder: (context) => ComingSoonScreen(
              routeName: settings.name ?? 'Unknown',
            ),
            settings: settings,
          );
        },
      ),
    );
  }
}
