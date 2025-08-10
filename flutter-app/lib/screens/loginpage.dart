import 'package:cabin_check/screens/loading_model.dart';
import 'package:cabin_check/widgets/auth.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cabin_check/models/global_var.dart'; // Import global_var for logopath

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

StateProvider<bool> isSignButtonLoading = StateProvider<bool>((ref) {
  return false;
});

class _LoginPageState extends ConsumerState<LoginPage> {
  final auth = Auth();

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(isSignButtonLoading);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Image.asset(
                logopath, // Use the logopath from global_var
                height: 120, // Adjust height as needed
              ),
            ),
            const SizedBox(height: 62), // Spacing between logo and button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black, // Always black
                foregroundColor: Colors.white, // Text or spinner color
                disabledBackgroundColor:
                    Colors.black, // When "disabled", still black
                disabledForegroundColor:
                    Colors.white, // Spinner/text when disabled
              ),
              onPressed: isLoading
                  ? null // prevent multiple clicks
                  : () async {
                      ref.read(isSignButtonLoading.notifier).state = true;
                      await auth.signInWithGoogle(ref, context);
                      ref.read(isSignButtonLoading.notifier).state = false;
                    },
              child: isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Image.asset(
                          google, // Use the google logo from global_var
                          height: 20, // Adjust height as needed
                        ),
                        const SizedBox(
                            width: 10), // Spacing between logo and text
                        const Text("Sign in with Google"),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
