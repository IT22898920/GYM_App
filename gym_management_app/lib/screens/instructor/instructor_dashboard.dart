import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_header.dart';
import '../../widgets/admin_sidebar.dart';
import 'dart:math' as math;

class InstructorDashboard extends StatefulWidget {
  const InstructorDashboard({super.key});

  @override
  State<InstructorDashboard> createState() => _InstructorDashboardState();
}

class _InstructorDashboardState extends State<InstructorDashboard>
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Page Header
                    _buildPageHeader(user),
                    const SizedBox(height: 32),

                    // Tab Navigation
                    _buildTabNavigation(),
                    const SizedBox(height: 24),

                    // Tab Content
                    _buildTabContent(),
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
    return Column(
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
          'Welcome back, ${user?.firstName ?? 'Instructor'}!',
          style: const TextStyle(
            fontSize: 16,
            color: Color(0xFF9CA3AF),
          ),
        ),
      ],
    );
  }

  Widget _buildTabNavigation() {
    final tabs = [
      {'label': 'Overview', 'icon': Icons.fitness_center},
      {'label': 'Assigned Members', 'icon': Icons.people_outline},
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
                      ? const Color(0xFF3B82F6).withOpacity(0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    bottom: BorderSide(
                      color: isActive
                          ? const Color(0xFF3B82F6)
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
                          ? const Color(0xFF3B82F6)
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
                            ? const Color(0xFF3B82F6)
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

  Widget _buildTabContent() {
    switch (_currentTabIndex) {
      case 0:
        return _buildOverviewTab();
      case 1:
        return _buildAssignedMembersTab();
      default:
        return _buildOverviewTab();
    }
  }

  Widget _buildOverviewTab() {
    return _buildStatsGrid();
  }

  Widget _buildStatsGrid() {
    final stats = [
      {
        'icon': Icons.people_outline,
        'label': 'Total Students',
        'value': '124',
        'change': '+12.5%',
        'changePositive': true,
        'description': 'Active students',
        'color': const Color(0xFF7C3AED),
      },
      {
        'icon': Icons.attach_money,
        'label': 'Monthly Earnings',
        'value': '\$4,578',
        'change': '+23.4%',
        'changePositive': true,
        'description': 'This month',
        'color': const Color(0xFF10B981),
      },
      {
        'icon': Icons.fitness_center,
        'label': 'Classes Taught',
        'value': '86',
        'change': '+15.2%',
        'changePositive': true,
        'description': 'This month',
        'color': const Color(0xFF3B82F6),
      },
      {
        'icon': Icons.calendar_today,
        'label': 'Upcoming Classes',
        'value': '12',
        'change': '+8.7%',
        'changePositive': true,
        'description': 'Next 7 days',
        'color': const Color(0xFFFBBF24),
      },
    ];

    return GridView.builder(
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
            value,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
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

  Widget _buildAssignedMembersTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Stats Section
        Row(
          children: [
            Expanded(
              child: _buildMemberStatCard(
                'Assigned Members',
                '45',
                Icons.people_outline,
                const Color(0xFF7C3AED),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildMemberStatCard(
                'Avg Progress',
                '92%',
                Icons.fitness_center,
                const Color(0xFF10B981),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildMemberStatCard(
                'Attendance',
                '87%',
                Icons.access_time,
                const Color(0xFF3B82F6),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildMemberStatCard(
                'Retention',
                '95%',
                Icons.favorite_outline,
                const Color(0xFFFBBF24),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),

        // Members Table
        const Text(
          'Your Assigned Members',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildMembersTable(),
      ],
    );
  }

  Widget _buildMemberStatCard(String label, String value, IconData icon, Color color) {
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
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMembersTable() {
    final members = [
      {
        'name': 'John Smith',
        'email': 'john@example.com',
        'status': 'Active',
        'progress': 85,
        'gym': 'FitConnect Gym',
      },
      {
        'name': 'Sarah Johnson',
        'email': 'sarah@example.com',
        'status': 'Active',
        'progress': 92,
        'gym': 'PowerFit Center',
      },
      {
        'name': 'Mike Wilson',
        'email': 'mike@example.com',
        'status': 'Inactive',
        'progress': 45,
        'gym': 'FitConnect Gym',
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
          // Table Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFF374151),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: const [
                Expanded(
                  flex: 2,
                  child: Text(
                    'Member',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    'Status',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    'Progress',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
                ),
                SizedBox(width: 80),
              ],
            ),
          ),

          // Table Rows
          ...members.map((member) {
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: Color(0xFF374151),
                    width: 0.5,
                  ),
                ),
              ),
              child: Row(
                children: [
                  // Member Info
                  Expanded(
                    flex: 2,
                    child: Row(
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
                              member['name'].toString().substring(0, 1),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                member['name'] as String,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                member['email'] as String,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF9CA3AF),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Status
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: member['status'] == 'Active'
                            ? const Color(0xFF10B981).withOpacity(0.1)
                            : const Color(0xFFFBBF24).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        member['status'] as String,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: member['status'] == 'Active'
                              ? const Color(0xFF10B981)
                              : const Color(0xFFFBBF24),
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),

                  // Progress
                  Expanded(
                    child: Row(
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: (member['progress'] as int) / 100,
                              backgroundColor: const Color(0xFF374151),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                Color(0xFF7C3AED),
                              ),
                              minHeight: 6,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${member['progress']}%',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Actions
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(
                          Icons.visibility_outlined,
                          color: Color(0xFF3B82F6),
                          size: 20,
                        ),
                        onPressed: () {},
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
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
