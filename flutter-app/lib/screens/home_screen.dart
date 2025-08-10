import 'package:cabin_check/main.dart';
import 'package:cabin_check/models/global_var.dart';
import 'package:cabin_check/screens/B-Homepage.dart';
import 'package:cabin_check/screens/logo.dart';
import 'package:cabin_check/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    final status = ref.watch(statusProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  // Timeline view

                  const SizedBox(height: 24),
                  CabinCheckLogo(
                    fontSize: 57,
                  ),
                  const SizedBox(height: 24),
                  // Status button
                  ElevatedButton(
                    onPressed: () {
                      toggleTeacherStatus(id, ref);
                      ref.read(statusProvider.notifier).state =
                          status == "InCabin" ? "Out of Cabin" : "InCabin";
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ref.watch(statusProvider) == "InCabin"
                          ? AppTheme.tree_green
                          : AppTheme.fire_red,
                      minimumSize: const Size(double.infinity, 56),
                    ),
                    child: Text(
                      ref.watch(statusProvider),
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Quick actions grid
                  GridView.count(
                    shrinkWrap: true,
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.5,
                    children: [
                      _buildQuickActionCard('Share\nNote', _onShareNote),
                      _buildQuickActionCard('Add\nEvent', _onAddEvent),
                      _buildQuickActionCard('Profile', _onEditProfile),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _onShareNote() {
    // Implement the logic for sharing a note
    ref.read(bottomNavProvider.notifier).state = 2;
  }

  void _onAutoUpdateStatus() {
    // Implement the logic for auto-updating status
    print('Auto Update Status clicked');
  }

  void _onAddEvent() {
    // Implement the logic for adding an event
    ref.read(bottomNavProvider.notifier).state = 1;
  }

  void _onEditProfile() {
    // Implement the logic for editing the timetable
    ref.read(bottomNavProvider.notifier).state = 3;
  }

  Widget _buildQuickActionCard(String title, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: Icon(Icons.more_vert, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }
}
