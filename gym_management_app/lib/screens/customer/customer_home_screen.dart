import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_header.dart';
import '../../widgets/admin_sidebar.dart';
import 'dart:math' as math;

class CustomerHomeScreen extends StatefulWidget {
  const CustomerHomeScreen({super.key});

  @override
  State<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

class _CustomerHomeScreenState extends State<CustomerHomeScreen>
    with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  int _currentTabIndex = 0;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();

    _scrollController.addListener(() {
      if (_scrollController.offset > 50 && !_isScrolled) {
        setState(() => _isScrolled = true);
      } else if (_scrollController.offset <= 50 && _isScrolled) {
        setState(() => _isScrolled = false);
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final user = authService.currentUser;

    return Scaffold(
      appBar: AppHeader(isScrolled: _isScrolled),
      drawer: const AdminSidebar(),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1F1B2E),
              Color(0xFF111827),
            ],
          ),
        ),
        child: Stack(
          children: [
            // Animated Background Circles
            ...List.generate(20, (index) {
              return AnimatedBuilder(
                animation: _animationController,
                builder: (context, child) {
                  final random = math.Random(index);
                  final size = random.nextDouble() * 150 + 50;
                  final initialX = random.nextDouble();
                  final initialY = random.nextDouble();
                  final offset = math.sin(_animationController.value * 2 * math.pi +
                          random.nextDouble() * 2 * math.pi) *
                      15;

                  return Positioned(
                    left: MediaQuery.of(context).size.width * initialX + offset,
                    top: MediaQuery.of(context).size.height * initialY + offset,
                    child: Container(
                      width: size,
                      height: size,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.02),
                      ),
                    ),
                  );
                },
              );
            }),

            // Main Content
            SingleChildScrollView(
              controller: _scrollController,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    // Profile Header
                    _buildProfileHeader(user),
                    const SizedBox(height: 32),

                    // Tab Navigation
                    _buildTabNavigation(),
                    const SizedBox(height: 24),

                    // Tab Content
                    _buildTabContent(user),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(user) {
    final firstName = user?.firstName ?? 'User';
    final initial = firstName.substring(0, 1).toUpperCase();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF7C3AED).withOpacity(0.3),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Center(
              child: Text(
                initial,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 20),

          // Name and Member Since
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShaderMask(
                  shaderCallback: (bounds) => const LinearGradient(
                    colors: [Color(0xFFA78BFA), Color(0xFF818CF8)],
                  ).createShader(bounds),
                  child: Text(
                    '${user?.firstName ?? ''} ${user?.lastName ?? ''}',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Member since January 2025',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[400],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabNavigation() {
    final tabs = [
      {'label': 'Overview', 'icon': Icons.person_outline},
      {'label': 'Classes', 'icon': Icons.calendar_today_outlined},
      {'label': 'Progress', 'icon': Icons.trending_up},
    ];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.3),
        ),
      ),
      child: Row(
        children: tabs.asMap().entries.map((entry) {
          final index = entry.key;
          final tab = entry.value;
          final isActive = _currentTabIndex == index;

          return Expanded(
            child: InkWell(
              onTap: () => setState(() => _currentTabIndex = index),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: isActive
                      ? const Color(0xFF7C3AED).withOpacity(0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    bottom: BorderSide(
                      color: isActive
                          ? const Color(0xFF7C3AED)
                          : Colors.transparent,
                      width: 2,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      tab['icon'] as IconData,
                      color: isActive
                          ? const Color(0xFF7C3AED)
                          : const Color(0xFF9CA3AF),
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      tab['label'] as String,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: isActive
                            ? const Color(0xFF7C3AED)
                            : const Color(0xFF9CA3AF),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTabContent(user) {
    switch (_currentTabIndex) {
      case 0:
        return _buildOverviewTab(user);
      case 1:
        return _buildClassesTab();
      case 2:
        return _buildProgressTab();
      default:
        return _buildOverviewTab(user);
    }
  }

  Widget _buildOverviewTab(user) {
    return Column(
      children: [
        // Personal Information & Membership Details
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildPersonalInfoCard(user)),
            const SizedBox(width: 16),
            Expanded(child: _buildMembershipCard()),
          ],
        ),
        const SizedBox(height: 16),

        // Fitness Goals & Assigned Instructor
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildFitnessGoalsCard()),
            const SizedBox(width: 16),
            Expanded(child: _buildAssignedInstructorCard()),
          ],
        ),
        const SizedBox(height: 16),

        // Quick Stats
        _buildQuickStatsCard(),
        const SizedBox(height: 24),

        // View My Workout Button
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
            ),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF7C3AED).withOpacity(0.3),
                blurRadius: 20,
              ),
            ],
          ),
          child: ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Workout feature coming soon!')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'View My Workout',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPersonalInfoCard(user) {
    final infoItems = [
      {'icon': Icons.person_outline, 'label': 'Name', 'value': '${user?.firstName ?? ''} ${user?.lastName ?? ''}'},
      {'icon': Icons.email_outlined, 'label': 'Email', 'value': user?.email ?? ''},
      {'icon': Icons.phone_outlined, 'label': 'Phone', 'value': user?.phoneNumber ?? 'Not provided'},
      {'icon': Icons.location_on_outlined, 'label': 'Address', 'value': '123 Main St, City'},
      {'icon': Icons.calendar_today_outlined, 'label': 'Member Since', 'value': 'January 2025'},
    ];

    return _buildCard(
      title: 'Personal Information',
      trailing: IconButton(
        icon: const Icon(Icons.edit_outlined, color: Color(0xFF7C3AED)),
        onPressed: () {},
      ),
      child: Column(
        children: infoItems.map((item) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF7C3AED).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    item['icon'] as IconData,
                    color: const Color(0xFF7C3AED),
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['label'] as String,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                      Text(
                        item['value'] as String,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMembershipCard() {
    return _buildCard(
      title: 'Membership Details',
      child: Column(
        children: [
          _buildMembershipItem('Plan', 'Premium', isPlan: true),
          _buildMembershipItem('Status', 'Active', isStatus: true),
          _buildMembershipItem('Next Payment', 'Feb 15, 2025'),
          _buildMembershipItem('Home Gym', 'FitConnect Gym'),
        ],
      ),
    );
  }

  Widget _buildMembershipItem(String label, String value, {bool isPlan = false, bool isStatus = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF9CA3AF),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isPlan
                  ? const Color(0xFF7C3AED).withOpacity(0.1)
                  : isStatus
                      ? const Color(0xFF10B981).withOpacity(0.1)
                      : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              value,
              style: TextStyle(
                fontSize: 14,
                color: isPlan
                    ? const Color(0xFF7C3AED)
                    : isStatus
                        ? const Color(0xFF10B981)
                        : Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFitnessGoalsCard() {
    final goals = [
      'Lose 10 kg',
      'Build muscle mass',
      'Improve endurance',
      'Increase flexibility',
    ];

    return _buildCard(
      title: 'Fitness Goals',
      trailing: IconButton(
        icon: const Icon(Icons.edit_outlined, color: Color(0xFF7C3AED)),
        onPressed: () {},
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: goals.map((goal) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  color: Color(0xFF7C3AED),
                  size: 20,
                ),
                const SizedBox(width: 12),
                Text(
                  goal,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF9CA3AF),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAssignedInstructorCard() {
    final hasInstructor = true; // Change based on actual data

    return _buildCard(
      title: 'Assigned Instructor',
      child: Column(
        children: [
          if (hasInstructor) ...[
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      'JD',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'John Doe',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'Personal Trainer',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.message_outlined, size: 18),
                    label: const Text('Chat'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B82F6),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.phone_outlined, size: 18),
                    label: const Text('Call'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ] else
            const Text(
              'Not assigned yet',
              style: TextStyle(
                fontSize: 14,
                color: Color(0xFF9CA3AF),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildQuickStatsCard() {
    final stats = [
      {'icon': Icons.fitness_center, 'label': 'Workouts', 'value': '24'},
      {'icon': Icons.access_time, 'label': 'Hours', 'value': '48'},
      {'icon': Icons.trending_up, 'label': 'Attendance', 'value': '92%'},
      {'icon': Icons.track_changes, 'label': 'Progress', 'value': '78%'},
    ];

    return _buildCard(
      title: 'Quick Stats',
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1.5,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: stats.length,
        itemBuilder: (context, index) {
          final stat = stats[index];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF111827).withOpacity(0.5),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF374151).withOpacity(0.5),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  stat['icon'] as IconData,
                  color: const Color(0xFF7C3AED),
                  size: 24,
                ),
                const Spacer(),
                Text(
                  stat['value'] as String,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  stat['label'] as String,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF9CA3AF),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildClassesTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Upcoming Classes
        const Text(
          'Upcoming Classes',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildUpcomingClasses(),
        const SizedBox(height: 32),

        // Class History
        const Text(
          'Class History',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildClassHistory(),
      ],
    );
  }

  Widget _buildUpcomingClasses() {
    return Container(
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: const Center(
        child: Column(
          children: [
            Icon(
              Icons.calendar_today_outlined,
              size: 64,
              color: Color(0xFF6B7280),
            ),
            SizedBox(height: 16),
            Text(
              'No upcoming classes scheduled',
              style: TextStyle(
                fontSize: 16,
                color: Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClassHistory() {
    return Container(
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: const Center(
        child: Column(
          children: [
            Icon(
              Icons.history,
              size: 64,
              color: Color(0xFF6B7280),
            ),
            SizedBox(height: 16),
            Text(
              'No class history available',
              style: TextStyle(
                fontSize: 16,
                color: Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Body Measurements
        const Text(
          'Body Measurements',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildBodyMeasurements(),
        const SizedBox(height: 32),

        // Progress Overview
        const Text(
          'Progress Overview',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildProgressOverview(),
      ],
    );
  }

  Widget _buildBodyMeasurements() {
    final measurements = [
      {'label': 'Weight', 'value': '75', 'unit': 'kg'},
      {'label': 'BMI', 'value': '24.2', 'unit': ''},
      {'label': 'Body Fat', 'value': '18', 'unit': '%'},
      {'label': 'Height', 'value': '175', 'unit': 'cm'},
      {'label': 'Waist', 'value': '85', 'unit': 'cm'},
      {'label': 'Hips', 'value': '95', 'unit': 'cm'},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1.2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: measurements.length,
      itemBuilder: (context, index) {
        final measurement = measurements[index];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1F2937).withOpacity(0.5),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFF374151).withOpacity(0.5),
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.bar_chart,
                color: Color(0xFF7C3AED),
                size: 24,
              ),
              const SizedBox(height: 8),
              Text(
                '${measurement['value']}${measurement['unit']}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Text(
                measurement['label'] as String,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF9CA3AF),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildProgressOverview() {
    final stats = [
      {'label': 'Workouts Completed', 'value': '24'},
      {'label': 'Attendance Rate', 'value': '92%'},
      {'label': 'Overall Progress', 'value': '78%'},
      {'label': 'Hours Spent', 'value': '48'},
    ];

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: stats.map((stat) {
          return Column(
            children: [
              Text(
                stat['value'] as String,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF7C3AED),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                stat['label'] as String,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF9CA3AF),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCard({
    required String title,
    Widget? trailing,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              if (trailing != null) trailing,
            ],
          ),
          const SizedBox(height: 20),
          child,
        ],
      ),
    );
  }
}
