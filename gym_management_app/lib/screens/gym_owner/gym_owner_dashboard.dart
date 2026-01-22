import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_header.dart';
import '../../widgets/admin_sidebar.dart';
import 'dart:math' as math;

class GymOwnerDashboard extends StatefulWidget {
  const GymOwnerDashboard({super.key});

  @override
  State<GymOwnerDashboard> createState() => _GymOwnerDashboardState();
}

class _GymOwnerDashboardState extends State<GymOwnerDashboard>
    with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
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

                    // Stats Grid
                    _buildStatsGrid(),
                    const SizedBox(height: 32),

                    // Quick Actions Section
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: _buildGymManagementSection()),
                        const SizedBox(width: 16),
                        Expanded(child: _buildRecentActivitySection()),
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
          'Welcome back, ${user?.firstName ?? 'Gym Owner'}!',
          style: const TextStyle(
            fontSize: 16,
            color: Color(0xFF9CA3AF),
          ),
        ),
      ],
    );
  }

  Widget _buildStatsGrid() {
    final stats = [
      {
        'icon': Icons.people_outline,
        'label': 'Total Members',
        'value': '543',
        'change': '+12.5%',
        'changePositive': true,
        'description': 'Active memberships',
        'color': const Color(0xFF7C3AED),
      },
      {
        'icon': Icons.attach_money,
        'label': 'Monthly Revenue',
        'value': '\$45,678',
        'change': '+23.4%',
        'changePositive': true,
        'description': 'This month',
        'color': const Color(0xFF10B981),
      },
      {
        'icon': Icons.fitness_center,
        'label': 'Active Classes',
        'value': '86',
        'change': '-5.2%',
        'changePositive': false,
        'description': 'Classes this week',
        'color': const Color(0xFF3B82F6),
      },
      {
        'icon': Icons.calendar_today,
        'label': 'New Bookings',
        'value': '132',
        'change': '+18.7%',
        'changePositive': true,
        'description': 'Last 7 days',
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

  Widget _buildGymManagementSection() {
    final actions = [
      {
        'icon': Icons.edit_outlined,
        'label': 'Edit Gym Details',
        'description': 'Update gym information, facilities, and services',
        'color': const Color(0xFF7C3AED),
        'route': '/gym-owner/edit-gym',
      },
      {
        'icon': Icons.image_outlined,
        'label': 'Manage Photos & Logo',
        'description': 'Upload and manage gym photos and logo',
        'color': const Color(0xFF3B82F6),
        'route': '/gym-owner/manage-images',
      },
      {
        'icon': Icons.location_on_outlined,
        'label': 'Update Location',
        'description': 'Update gym address and map location',
        'color': const Color(0xFF10B981),
        'route': '/gym-owner/update-location',
      },
      {
        'icon': Icons.phone_outlined,
        'label': 'Contact Information',
        'description': 'Update phone, email, and social media',
        'color': const Color(0xFFFBBF24),
        'route': '/gym-owner/contact-info',
      },
      {
        'icon': Icons.account_balance_outlined,
        'label': 'Bank Account',
        'description': 'Manage payment and bank details',
        'color': const Color(0xFF10B981),
        'route': '/gym-owner/bank-account',
      },
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.settings_outlined,
                color: const Color(0xFF7C3AED),
                size: 24,
              ),
              const SizedBox(width: 12),
              const Text(
                'Gym Management',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...actions.map((action) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF111827).withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFF374151).withOpacity(0.3),
                ),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${action['label']} - Coming soon!')),
                    );
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: (action['color'] as Color).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            action['icon'] as IconData,
                            color: action['color'] as Color,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                action['label'] as String,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                action['description'] as String,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF9CA3AF),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios,
                          color: Color(0xFF6B7280),
                          size: 14,
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

  Widget _buildRecentActivitySection() {
    final activities = [
      {
        'text': 'New member registration',
        'time': '2 min ago',
        'color': const Color(0xFF10B981),
      },
      {
        'text': 'Class booking confirmed',
        'time': '15 min ago',
        'color': const Color(0xFF3B82F6),
      },
      {
        'text': 'Payment received',
        'time': '1 hour ago',
        'color': const Color(0xFF7C3AED),
      },
      {
        'text': 'Equipment maintenance due',
        'time': '3 hours ago',
        'color': const Color(0xFFFBBF24),
      },
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.trending_up,
                color: Color(0xFF7C3AED),
                size: 24,
              ),
              const SizedBox(width: 12),
              const Text(
                'Recent Activity',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...activities.map((activity) {
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF111827).withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFF374151).withOpacity(0.3),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: activity['color'] as Color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          activity['text'] as String,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFFD1D5DB),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          activity['time'] as String,
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
            );
          }).toList(),
        ],
      ),
    );
  }
}
