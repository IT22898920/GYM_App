import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_header.dart';
import '../../widgets/admin_sidebar.dart';
import 'dart:math' as math;

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard>
    with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  late AnimationController _animationController;
  String _selectedTimeRange = 'This Month';

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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Page Header with Time Range Selector
                    _buildPageHeader(user),
                    const SizedBox(height: 32),

                    // Stats Grid
                    _buildStatsGrid(),
                    const SizedBox(height: 32),

                    // Recent Members & Upcoming Classes
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: _buildRecentMembersSection()),
                        const SizedBox(width: 24),
                        Expanded(child: _buildUpcomingClassesSection()),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPageHeader(user) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Title Section
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [Color(0xFFA78BFA), Color(0xFF818CF8)],
              ).createShader(bounds),
              child: const Text(
                'Dashboard',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Welcome back, ${user?.firstName ?? 'Admin'}!',
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),

        // Time Range Selector & Quick Actions
        Row(
          children: [
            // Time Range Dropdown
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF1F2937).withOpacity(0.5),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: const Color(0xFF374151).withOpacity(0.5),
                ),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedTimeRange,
                  dropdownColor: const Color(0xFF1F2937),
                  style: const TextStyle(color: Color(0xFF9CA3AF)),
                  icon: const Icon(Icons.keyboard_arrow_down,
                      color: Color(0xFF9CA3AF)),
                  items: ['Today', 'This Week', 'This Month', 'This Year']
                      .map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedTimeRange = newValue!;
                    });
                  },
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Quick Actions
            _buildQuickAction(
              icon: Icons.person_add_outlined,
              label: 'Add Member',
              color: const Color(0xFF7C3AED),
            ),
            const SizedBox(width: 8),
            _buildQuickAction(
              icon: Icons.calendar_today_outlined,
              label: 'Schedule Class',
              color: const Color(0xFF3B82F6),
            ),
            const SizedBox(width: 8),
            _buildQuickAction(
              icon: Icons.bar_chart_outlined,
              label: 'View Reports',
              color: const Color(0xFF10B981),
            ),
            const SizedBox(width: 8),
            _buildQuickAction(
              icon: Icons.grid_view_outlined,
              label: 'Manage Equipment',
              color: const Color(0xFFFBBF24),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return Tooltip(
      message: label,
      child: Container(
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('$label - Coming soon!')),
              );
            },
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Icon(icon, color: color, size: 20),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatsGrid() {
    final stats = [
      {
        'icon': Icons.people_outline,
        'label': 'Total Members',
        'value': '2,543',
        'change': '+12.5%',
        'changePositive': true,
        'description': 'Active memberships this month',
        'color': const Color(0xFF7C3AED),
      },
      {
        'icon': Icons.attach_money,
        'label': 'Monthly Revenue',
        'value': '\$45,678',
        'change': '+23.4%',
        'changePositive': true,
        'description': 'Total revenue for February',
        'color': const Color(0xFF10B981),
      },
      {
        'icon': Icons.fitness_center,
        'label': 'Active Classes',
        'value': '186',
        'change': '-5.2%',
        'changePositive': false,
        'description': 'Classes scheduled this week',
        'color': const Color(0xFF3B82F6),
      },
      {
        'icon': Icons.calendar_today,
        'label': 'New Bookings',
        'value': '432',
        'change': '+18.7%',
        'changePositive': true,
        'description': 'Bookings in the last 7 days',
        'color': const Color(0xFFFBBF24),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        childAspectRatio: 1.5,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: stats.length,
      itemBuilder: (context, index) {
        final stat = stats[index];
        return _buildStatCard(
          icon: stat['icon'] as IconData,
          label: stat['label'] as String,
          value: stat['value'] as String,
          change: stat['change'] as String,
          changePositive: stat['changePositive'] as bool,
          description: stat['description'] as String,
          color: stat['color'] as Color,
        );
      },
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
    required String change,
    required bool changePositive,
    required String description,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
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
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 24,
                ),
              ),
              IconButton(
                icon: const Icon(
                  Icons.more_vert,
                  color: Color(0xFF6B7280),
                  size: 20,
                ),
                onPressed: () {},
              ),
            ],
          ),
          const Spacer(),
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF9CA3AF),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Row(
                children: [
                  Icon(
                    changePositive ? Icons.arrow_upward : Icons.arrow_downward,
                    size: 14,
                    color: changePositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    change,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: changePositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentMembersSection() {
    final recentMembers = [
      {
        'name': 'John Doe',
        'email': 'john@example.com',
        'membership': 'Premium',
        'joinDate': '2024-02-15',
        'status': 'active',
        'initial': 'J',
      },
      {
        'name': 'Sarah Smith',
        'email': 'sarah@example.com',
        'membership': 'Basic',
        'joinDate': '2024-02-14',
        'status': 'pending',
        'initial': 'S',
      },
      {
        'name': 'Mike Johnson',
        'email': 'mike@example.com',
        'membership': 'Premium',
        'joinDate': '2024-02-13',
        'status': 'active',
        'initial': 'M',
      },
    ];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Recent Members',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'View all',
                    style: TextStyle(
                      color: Color(0xFF7C3AED),
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Members List
          ...recentMembers.map((member) {
            return Container(
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: Color(0xFF374151),
                    width: 0.5,
                  ),
                ),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {},
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        // Avatar with Status
                        Stack(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
                                ),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Text(
                                  member['initial'] as String,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              right: 0,
                              bottom: 0,
                              child: Container(
                                width: 12,
                                height: 12,
                                decoration: BoxDecoration(
                                  color: member['status'] == 'active'
                                      ? const Color(0xFF10B981)
                                      : const Color(0xFFFBBF24),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: const Color(0xFF1F2937),
                                    width: 2,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(width: 16),

                        // Name & Email
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                member['name'] as String,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                member['email'] as String,
                                style: const TextStyle(
                                  color: Color(0xFF9CA3AF),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Membership Badge & Date
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: member['membership'] == 'Premium'
                                    ? const Color(0xFF7C3AED).withOpacity(0.1)
                                    : const Color(0xFF6B7280).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                member['membership'] as String,
                                style: TextStyle(
                                  color: member['membership'] == 'Premium'
                                      ? const Color(0xFF7C3AED)
                                      : const Color(0xFF9CA3AF),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              member['joinDate'] as String,
                              style: const TextStyle(
                                color: Color(0xFF6B7280),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildUpcomingClassesSection() {
    final upcomingClasses = [
      {
        'name': 'Morning Yoga',
        'instructor': 'Emma Wilson',
        'time': '07:00 AM',
        'attendees': 12,
        'capacity': 15,
        'status': 'upcoming',
        'type': 'yoga',
      },
      {
        'name': 'HIIT Training',
        'instructor': 'Alex Thompson',
        'time': '09:00 AM',
        'attendees': 15,
        'capacity': 15,
        'status': 'full',
        'type': 'hiit',
      },
      {
        'name': 'Strength Training',
        'instructor': 'David Brown',
        'time': '11:00 AM',
        'attendees': 8,
        'capacity': 12,
        'status': 'upcoming',
        'type': 'strength',
      },
    ];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151).withOpacity(0.5),
        ),
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Upcoming Classes',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'View schedule',
                    style: TextStyle(
                      color: Color(0xFF7C3AED),
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Classes List
          ...upcomingClasses.map((classData) {
            final attendees = classData['attendees'] as int;
            final capacity = classData['capacity'] as int;
            final progress = (attendees / capacity * 100).round();
            final isFull = classData['status'] == 'full';

            Color getTypeColor() {
              switch (classData['type']) {
                case 'yoga':
                  return const Color(0xFF7C3AED);
                case 'hiit':
                  return const Color(0xFFEF4444);
                case 'strength':
                  return const Color(0xFF3B82F6);
                default:
                  return const Color(0xFF7C3AED);
              }
            }

            return Container(
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: Color(0xFF374151),
                    width: 0.5,
                  ),
                ),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {},
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Class Type Icon
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: getTypeColor().withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                Icons.fitness_center,
                                color: getTypeColor(),
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 16),

                            // Class Info
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    classData['name'] as String,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    classData['instructor'] as String,
                                    style: const TextStyle(
                                      color: Color(0xFF9CA3AF),
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Time & Status
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.access_time,
                                      color: Color(0xFF9CA3AF),
                                      size: 14,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      classData['time'] as String,
                                      style: const TextStyle(
                                        color: Color(0xFFD1D5DB),
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isFull
                                        ? const Color(0xFFEF4444).withOpacity(0.1)
                                        : const Color(0xFF10B981).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        isFull
                                            ? Icons.cancel_outlined
                                            : Icons.check_circle_outline,
                                        size: 12,
                                        color: isFull
                                            ? const Color(0xFFEF4444)
                                            : const Color(0xFF10B981),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        isFull ? 'Full' : 'Available',
                                        style: TextStyle(
                                          color: isFull
                                              ? const Color(0xFFEF4444)
                                              : const Color(0xFF10B981),
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),

                        // Progress Bar
                        const SizedBox(height: 16),
                        Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '$progress% Full',
                                  style: const TextStyle(
                                    color: Color(0xFF7C3AED),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  '$attendees/$capacity Spots',
                                  style: const TextStyle(
                                    color: Color(0xFF9CA3AF),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: progress / 100,
                                minHeight: 8,
                                backgroundColor: const Color(0xFF374151),
                                valueColor: const AlwaysStoppedAnimation<Color>(
                                  Color(0xFF7C3AED),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
