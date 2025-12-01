import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class AdminSidebar extends StatefulWidget {
  const AdminSidebar({super.key});

  @override
  State<AdminSidebar> createState() => _AdminSidebarState();
}

class _AdminSidebarState extends State<AdminSidebar> {
  final Map<String, bool> _expandedMenus = {};

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final user = authService.currentUser;
    final userRole = user?.role ?? 'customer';

    return Drawer(
      backgroundColor: const Color(0xFF1F2937).withOpacity(0.98),
      child: Column(
        children: [
          // Drawer Header
          _buildDrawerHeader(user),

          // Menu Items
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: _getMenuItems(userRole),
            ),
          ),

          // Bottom Section
          _buildBottomSection(),
        ],
      ),
    );
  }

  Widget _buildDrawerHeader(user) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF7C3AED),
            Color(0xFF4F46E5),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7C3AED).withOpacity(0.3),
            blurRadius: 20,
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white.withOpacity(0.3),
                  width: 2,
                ),
              ),
              child: Center(
                child: Text(
                  user?.firstName?.substring(0, 1).toUpperCase() ?? 'U',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Name
            Text(
              '${user?.firstName ?? ''} ${user?.lastName ?? ''}',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 4),
            // Role
            Text(
              _getRoleDisplayName(user?.role ?? ''),
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getRoleDisplayName(String role) {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'gym_owner':
        return 'Gym Owner';
      case 'instructor':
        return 'Instructor';
      case 'customer':
        return 'Customer';
      default:
        return 'User';
    }
  }

  List<Widget> _getMenuItems(String role) {
    switch (role) {
      case 'admin':
        return _buildAdminMenu();
      case 'gym_owner':
        return _buildGymOwnerMenu();
      case 'instructor':
        return _buildInstructorMenu();
      default:
        return _buildCustomerMenu();
    }
  }

  List<Widget> _buildAdminMenu() {
    return [
      _buildMenuItem(
        icon: Icons.dashboard_outlined,
        title: 'Dashboard',
        route: '/admin/dashboard',
      ),
      _buildExpandableMenuItem(
        icon: Icons.fitness_center,
        title: 'Instructors',
        children: [
          _buildSubMenuItem('Applications', '/admin/instructor-applications'),
          _buildSubMenuItem('Verified Instructors', '/admin/verified-instructors'),
        ],
      ),
      _buildExpandableMenuItem(
        icon: Icons.people_outline,
        title: 'Users',
        children: [
          _buildSubMenuItem('All Users', '/admin/users'),
          _buildSubMenuItem('Gym Owners', '/admin/gym-owners'),
          _buildSubMenuItem('Customers', '/admin/customers'),
          _buildSubMenuItem('Receptionists', '/admin/receptionists'),
        ],
      ),
      _buildMenuItem(
        icon: Icons.business_outlined,
        title: 'Gym Registrations',
        route: '/admin/gym-registrations',
      ),
      _buildExpandableMenuItem(
        icon: Icons.attach_money,
        title: 'Finance',
        children: [
          _buildSubMenuItem('Payments', '/admin/finance/payments'),
        ],
      ),
      _buildExpandableMenuItem(
        icon: Icons.bar_chart_outlined,
        title: 'Reports',
        children: [
          _buildSubMenuItem('Analytics', '/admin/reports/analytics'),
          _buildSubMenuItem('Financial Reports', '/admin/reports/financial'),
          _buildSubMenuItem('Member Reports', '/admin/reports/members'),
        ],
      ),
      _buildMenuItem(
        icon: Icons.message_outlined,
        title: 'Messages',
        route: '/admin/messages',
        badge: '3',
      ),
      _buildMenuItem(
        icon: Icons.description_outlined,
        title: 'Documents',
        route: '/admin/documents',
      ),
      _buildMenuItem(
        icon: Icons.grid_view_outlined,
        title: 'Facilities',
        route: '/admin/facilities',
      ),
    ];
  }

  List<Widget> _buildGymOwnerMenu() {
    return [
      _buildMenuItem(
        icon: Icons.dashboard_outlined,
        title: 'Dashboard',
        route: '/gym-owner/dashboard',
      ),
      _buildMenuItem(
        icon: Icons.people_outline,
        title: 'Members',
        route: '/gym-owner/members',
      ),
      _buildMenuItem(
        icon: Icons.person_outline,
        title: 'Instructor Members',
        route: '/gym-owner/instructor-members',
      ),
      _buildMenuItem(
        icon: Icons.fitness_center,
        title: 'Your Gym\'s Instructors',
        route: '/gym-owner/instructors',
      ),
      _buildMenuItem(
        icon: Icons.person_add_outlined,
        title: 'Apply to Instructor',
        route: '/gym-owner/apply-instructor',
      ),
      _buildMenuItem(
        icon: Icons.request_page_outlined,
        title: 'Gym Requests',
        route: '/gym-owner/gym-requests',
      ),
      _buildMenuItem(
        icon: Icons.attach_money,
        title: 'Finance',
        route: '/gym-owner/finance',
      ),
      _buildMenuItem(
        icon: Icons.bar_chart_outlined,
        title: 'Reports',
        route: '/gym-owner/reports',
      ),
      _buildMenuItem(
        icon: Icons.message_outlined,
        title: 'Messages',
        route: '/gym-owner/messages',
        badge: '5',
      ),
      _buildMenuItem(
        icon: Icons.grid_view_outlined,
        title: 'Facilities',
        route: '/gym-owner/facilities',
      ),
    ];
  }

  List<Widget> _buildInstructorMenu() {
    return [
      _buildMenuItem(
        icon: Icons.dashboard_outlined,
        title: 'Dashboard',
        route: '/instructor/dashboard',
      ),
      _buildMenuItem(
        icon: Icons.calendar_today_outlined,
        title: 'My Classes',
        route: '/instructor/classes',
      ),
      _buildExpandableMenuItem(
        icon: Icons.people_outline,
        title: 'Students',
        children: [
          _buildSubMenuItem('Gym Students', '/instructor/students/gym'),
          _buildSubMenuItem('Freelance Students', '/instructor/students/freelance'),
        ],
      ),
      _buildMenuItem(
        icon: Icons.fitness_center,
        title: 'Workout Plans',
        route: '/instructor/workout-plans',
      ),
      _buildMenuItem(
        icon: Icons.request_page_outlined,
        title: 'Gym Requests',
        route: '/instructor/gym-requests',
      ),
      _buildMenuItem(
        icon: Icons.check_circle_outline,
        title: 'Verify or Reject Gym',
        route: '/instructor/verify-gym',
      ),
      _buildMenuItem(
        icon: Icons.message_outlined,
        title: 'Messages',
        route: '/instructor/messages',
        badge: '2',
      ),
    ];
  }

  List<Widget> _buildCustomerMenu() {
    return [
      _buildMenuItem(
        icon: Icons.home_outlined,
        title: 'Home',
        route: '/customer/home',
      ),
      _buildMenuItem(
        icon: Icons.search,
        title: 'Find Gyms',
        route: '/find-gym',
      ),
      _buildMenuItem(
        icon: Icons.calendar_today_outlined,
        title: 'My Classes',
        route: '/customer/classes',
      ),
      _buildMenuItem(
        icon: Icons.person_outline,
        title: 'Profile',
        route: '/profile',
      ),
    ];
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required String route,
    String? badge,
  }) {
    final isActive = ModalRoute.of(context)?.settings.name == route;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: isActive
            ? const Color(0xFF7C3AED).withOpacity(0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.pop(context); // Close drawer
            Navigator.pushNamed(context, route);
          },
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isActive ? const Color(0xFF7C3AED) : const Color(0xFF9CA3AF),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                      color: isActive ? const Color(0xFF7C3AED) : const Color(0xFF9CA3AF),
                    ),
                  ),
                ),
                if (badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF7C3AED),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      badge,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildExpandableMenuItem({
    required IconData icon,
    required String title,
    required List<Widget> children,
  }) {
    final isExpanded = _expandedMenus[title] ?? false;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: isExpanded
            ? const Color(0xFF374151).withOpacity(0.3)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                setState(() {
                  _expandedMenus[title] = !isExpanded;
                });
              },
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    Icon(
                      icon,
                      size: 20,
                      color: const Color(0xFF9CA3AF),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ),
                    Icon(
                      isExpanded
                          ? Icons.keyboard_arrow_up
                          : Icons.keyboard_arrow_down,
                      size: 20,
                      color: const Color(0xFF9CA3AF),
                    ),
                  ],
                ),
              ),
            ),
          ),
          if (isExpanded) ...children,
        ],
      ),
    );
  }

  Widget _buildSubMenuItem(String title, String route) {
    final isActive = ModalRoute.of(context)?.settings.name == route;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          Navigator.pop(context); // Close drawer
          Navigator.pushNamed(context, route);
        },
        child: Container(
          padding: const EdgeInsets.only(left: 48, right: 16, top: 8, bottom: 8),
          child: Row(
            children: [
              Container(
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  color: isActive
                      ? const Color(0xFF7C3AED)
                      : const Color(0xFF6B7280),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 13,
                    color: isActive
                        ? const Color(0xFF7C3AED)
                        : const Color(0xFF9CA3AF),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomSection() {
    final authService = Provider.of<AuthService>(context, listen: false);

    return Container(
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(
            color: Color(0xFF374151),
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          _buildMenuItem(
            icon: Icons.settings_outlined,
            title: 'Settings',
            route: '/settings',
          ),
          _buildMenuItem(
            icon: Icons.help_outline,
            title: 'Help Center',
            route: '/help',
          ),
          _buildMenuItem(
            icon: Icons.support_agent_outlined,
            title: 'Support',
            route: '/support',
          ),
          Container(
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () async {
                  await authService.logout();
                  if (context.mounted) {
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      '/login',
                      (route) => false,
                    );
                  }
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.logout,
                        size: 20,
                        color: Colors.white,
                      ),
                      SizedBox(width: 12),
                      Text(
                        'Logout',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
