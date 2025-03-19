import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cabin_check/theme/app_theme.dart';
import 'package:cabin_check/screens/home_screen.dart';
import 'package:cabin_check/screens/schedule_screen.dart';
import 'package:cabin_check/screens/chat_screen.dart';
import 'package:cabin_check/screens/profile_screen.dart';
import 'package:cabin_check/widgets/main_scaffold.dart';

final bottomNavProvider = StateProvider<int>((ref) => 0);

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cabin Check',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: MainScaffold(),
    );
  }
}
