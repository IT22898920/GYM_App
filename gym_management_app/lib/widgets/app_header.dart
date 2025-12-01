import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class AppHeader extends StatefulWidget implements PreferredSizeWidget {
  final bool isScrolled;
  final bool showMenuButton;

  const AppHeader({
    super.key,
    this.isScrolled = false,
    this.showMenuButton = true,
  });

  @override
  State<AppHeader> createState() => _AppHeaderState();

  @override
  Size get preferredSize => const Size.fromHeight(70);
}

class _AppHeaderState extends State<AppHeader> {
  bool _showUserMenu = false;
  bool _showLoginMenu = false;

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final isAuthenticated = authService.isAuthenticated;

    return Container(
      decoration: BoxDecoration(
        color: widget.isScrolled
            ? const Color(0xFF030712).withOpacity(0.9)
            : Colors.transparent,
        boxShadow: widget.isScrolled
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  blurRadius: 20,
                ),
              ]
            : null,
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              // Menu Button (Hamburger)
              if (widget.showMenuButton && isAuthenticated)
                Builder(
                  builder: (context) => IconButton(
                    icon: const Icon(
                      Icons.menu,
                      color: Color(0xFF9CA3AF),
                      size: 24,
                    ),
                    onPressed: () {
                      Scaffold.of(context).openDrawer();
                    },
                  ),
                ),

              // Logo
              GestureDetector(
                onTap: () => Navigator.pushNamed(context, '/'),
                child: Row(
                  children: [
                    // Logo Icon
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1F2937), Color(0xFF374151)],
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Center(
                        child: Text(
                          'F',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Logo Text
                    ShaderMask(
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [Color(0xFFD1D5DB), Color(0xFFF3F4F6)],
                      ).createShader(bounds),
                      child: const Text(
                        'FitConnect',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Navigation Icons (simplified for mobile)
              Row(
                children: [
                  // Search Icon
                  IconButton(
                    icon: const Icon(
                      Icons.search,
                      color: Color(0xFF9CA3AF),
                      size: 22,
                    ),
                    onPressed: () {},
                  ),

                  // Notifications Icon
                  Stack(
                    children: [
                      IconButton(
                        icon: const Icon(
                          Icons.notifications_outlined,
                          color: Color(0xFF9CA3AF),
                          size: 22,
                        ),
                        onPressed: () {},
                      ),
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: const Color(0xFF374151),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: widget.isScrolled
                                  ? const Color(0xFF030712)
                                  : const Color(0xFF1F1B2E),
                              width: 2,
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              '2',
                              style: TextStyle(
                                fontSize: 9,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Shopping Bag Icon
                  Stack(
                    children: [
                      IconButton(
                        icon: const Icon(
                          Icons.shopping_bag_outlined,
                          color: Color(0xFF9CA3AF),
                          size: 22,
                        ),
                        onPressed: () {},
                      ),
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1F2937),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: widget.isScrolled
                                  ? const Color(0xFF030712)
                                  : const Color(0xFF1F1B2E),
                              width: 2,
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              '3',
                              style: TextStyle(
                                fontSize: 9,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Divider
                  Container(
                    width: 1,
                    height: 32,
                    color: const Color(0xFF1F2937),
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                  ),

                  // Login/User Menu
                  if (isAuthenticated)
                    _buildUserMenu(authService)
                  else
                    _buildLoginMenu(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserMenu(AuthService authService) {
    final user = authService.currentUser;

    return PopupMenuButton<String>(
      offset: const Offset(0, 50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: const Color(0xFF111827).withOpacity(0.95),
      child: Row(
        children: [
          // User Avatar
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
              ),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                user?.firstName?.substring(0, 1).toUpperCase() ?? 'U',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            user?.firstName ?? 'User',
            style: const TextStyle(
              color: Color(0xFF9CA3AF),
              fontSize: 14,
            ),
          ),
          const Icon(
            Icons.keyboard_arrow_down,
            color: Color(0xFF9CA3AF),
            size: 16,
          ),
        ],
      ),
      itemBuilder: (context) => [
        // User Info Header
        PopupMenuItem<String>(
          enabled: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${user?.firstName ?? ''} ${user?.lastName ?? ''}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                user?.role ?? '',
                style: const TextStyle(
                  color: Color(0xFF9CA3AF),
                  fontSize: 12,
                ),
              ),
              const Divider(color: Color(0xFF374151), height: 16),
            ],
          ),
        ),

        // Dashboard
        PopupMenuItem<String>(
          value: 'dashboard',
          child: const Row(
            children: [
              Icon(Icons.dashboard_outlined, color: Color(0xFF9CA3AF), size: 18),
              SizedBox(width: 12),
              Text(
                'Dashboard',
                style: TextStyle(color: Color(0xFF9CA3AF)),
              ),
            ],
          ),
        ),

        // Profile Settings
        PopupMenuItem<String>(
          value: 'profile',
          child: const Row(
            children: [
              Icon(Icons.settings_outlined, color: Color(0xFF9CA3AF), size: 18),
              SizedBox(width: 12),
              Text(
                'Profile Settings',
                style: TextStyle(color: Color(0xFF9CA3AF)),
              ),
            ],
          ),
        ),

        // Logout
        PopupMenuItem<String>(
          value: 'logout',
          child: const Row(
            children: [
              Icon(Icons.logout, color: Color(0xFFEF4444), size: 18),
              SizedBox(width: 12),
              Text(
                'Logout',
                style: TextStyle(color: Color(0xFFEF4444)),
              ),
            ],
          ),
        ),
      ],
      onSelected: (value) async {
        switch (value) {
          case 'dashboard':
            // Navigate based on role
            if (user?.role == 'admin') {
              Navigator.pushNamed(context, '/admin/dashboard');
            } else if (user?.role == 'gym_owner') {
              Navigator.pushNamed(context, '/gym-owner/dashboard');
            } else if (user?.role == 'instructor') {
              Navigator.pushNamed(context, '/instructor/dashboard');
            } else {
              Navigator.pushNamed(context, '/customer/home');
            }
            break;
          case 'profile':
            Navigator.pushNamed(context, '/profile');
            break;
          case 'logout':
            await authService.logout();
            if (context.mounted) {
              Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
            }
            break;
        }
      },
    );
  }

  Widget _buildLoginMenu() {
    return PopupMenuButton<String>(
      offset: const Offset(0, 50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: const Color(0xFF111827).withOpacity(0.95),
      child: const Row(
        children: [
          Icon(
            Icons.person_outline,
            color: Color(0xFF9CA3AF),
            size: 20,
          ),
          SizedBox(width: 4),
          Text(
            'Login',
            style: TextStyle(
              color: Color(0xFF9CA3AF),
              fontSize: 14,
            ),
          ),
          SizedBox(width: 4),
          Icon(
            Icons.keyboard_arrow_down,
            color: Color(0xFF9CA3AF),
            size: 16,
          ),
        ],
      ),
      itemBuilder: (context) => [
        // Customer Login
        PopupMenuItem<String>(
          value: 'customer',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.person, color: Color(0xFF60A5FA), size: 18),
                  SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Customer Login',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        'Find gyms & book classes',
                        style: TextStyle(
                          color: Color(0xFF6B7280),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),

        // Gym Owner Login
        PopupMenuItem<String>(
          value: 'gym_owner',
          child: const Row(
            children: [
              Icon(Icons.business, color: Color(0xFF10B981), size: 18),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Gym Owner',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    'Manage your gym business',
                    style: TextStyle(
                      color: Color(0xFF6B7280),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Instructor Login
        PopupMenuItem<String>(
          value: 'instructor',
          child: const Row(
            children: [
              Icon(Icons.fitness_center, color: Color(0xFFA78BFA), size: 18),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Instructor',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    'Teach classes & train clients',
                    style: TextStyle(
                      color: Color(0xFF6B7280),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Divider
        const PopupMenuDivider(),

        // Admin Login
        PopupMenuItem<String>(
          value: 'admin',
          child: const Row(
            children: [
              Icon(Icons.admin_panel_settings, color: Color(0xFFEF4444), size: 18),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Admin Access',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    'Platform administration',
                    style: TextStyle(
                      color: Color(0xFF6B7280),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
      onSelected: (value) {
        // All login options go to the same login page
        Navigator.pushNamed(context, '/login');
      },
    );
  }
}
