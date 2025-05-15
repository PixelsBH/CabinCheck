import 'package:cabin_check/models/global_var.dart';
import 'package:cabin_check/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cabin_check/screens/help_support_screen.dart';
import 'package:cabin_check/screens/about_app_screen.dart';
import 'package:cabin_check/screens/loginpage.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Header
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Text(
                'Profile',
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                      color: AppTheme.black0,
                      fontWeight: FontWeight.w700,
                    ),
              ),
            ),

            // Profile Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.black0,
                  borderRadius: BorderRadius.circular(16),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    // Profile Image
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: AppTheme.gray1,
                        shape: BoxShape.circle,
                        image: ref.watch(imageProvider).isNotEmpty
                            ? DecorationImage(
                                image: NetworkImage(ref.watch(imageProvider)),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: ref.watch(imageProvider).isEmpty
                          ? Icon(
                              Icons.person_outline,
                              color: AppTheme.white0,
                              size: 32,
                            )
                          : null,
                    ),
                    const SizedBox(width: 16),
                    // Name and Role
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ref.watch(nameProvider),
                            style: TextStyle(
                              color: AppTheme.white0,
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            'Professor',
                            style: TextStyle(
                              color: AppTheme.gray3,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Edit Button
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Menu Items
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    _buildMenuItem(
                      icon: Icons.notifications_outlined,
                      title: 'Help & Support',
                      subtitle: '',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const HelpSupportScreen(),
                          ),
                        );
                      },
                    ),
                    _buildMenuItem(
                      icon: Icons.favorite_outline,
                      title: 'About App',
                      subtitle: '',
                      isLast: true,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const AboutAppScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Logout Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: _buildMenuItem(
                  icon: Icons.logout,
                  title: 'Log out',
                  subtitle: 'Further secure your account for safety',
                  isLast: true,
                  onTap: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const LoginPage(),
                      ),
                      (route) => false, // Clear navigation stack
                    );
                  },
                ),
              ),
            ),

            const Spacer(),

            // Bottom Navigation Bar
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    bool showWarning = false,
    bool isLast = false,
    VoidCallback? onTap, // Added onTap parameter
  }) {
    return InkWell(
      onTap: onTap, // Use the onTap callback
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: !isLast
              ? Border(
                  bottom: BorderSide(
                    color: AppTheme.gray1.withOpacity(0.2),
                    width: 1,
                  ),
                )
              : null,
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppTheme.gray1.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 20, color: AppTheme.black0),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.black0,
                    ),
                  ),
                  if (subtitle.isNotEmpty)
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.gray3,
                      ),
                    ),
                ],
              ),
            ),
            if (showWarning)
              Icon(
                Icons.warning_amber_rounded,
                color: AppTheme.fire_red,
                size: 20,
              ),
            Icon(
              Icons.chevron_right,
              color: AppTheme.gray3,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }
}
