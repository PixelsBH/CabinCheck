import 'dart:convert';
import 'package:cabin_check/models/global_var.dart';
import 'package:cabin_check/screens/home_screen.dart';
import 'package:cabin_check/screens/loginpage.dart';
import 'package:cabin_check/widgets/main_scaffold.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

class Auth {
  Future signInWithGoogle(WidgetRef ref, BuildContext context) async {
    ref.read(isSignButtonLoading.notifier).state = true;
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) return; // User canceled sign-in

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final cred = await FirebaseAuth.instance.signInWithCredential(credential);
      print(cred.user!.uid);

      print(
          "User signed in: ${FirebaseAuth.instance.currentUser?.displayName}");

      await sendDataToDatabase(
          cred.user!.displayName ?? "Unknown",
          cred.user!.uid,
          cred.user!.email ?? "No Email",
          cred.user!.photoURL ?? "No Image",
          context,
          ref);
    } catch (e) {
      print("Error during Google Sign-In: $e");
    } finally {
      ref.read(isSignButtonLoading.notifier).state = false;
    }
  }

  Future<void> sendDataToDatabase(String name, String uid, String email,
      String image, BuildContext context, WidgetRef ref) async {
    final url = Uri.parse("http://172.16.204.118:5000/routes/teachers");

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": name,
          "email": email,
          "image": image,
          "firebaseUID": uid,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        print("Successfully fetched data. Status: ${response.statusCode}");

        // Parse the JSON response
        Map teacherData = jsonDecode(response.body);

        id = teacherData['_id'];
        name = teacherData['name'];
        Username = teacherData['name'];
        ref.read(nameProvider.notifier).update((ref) => teacherData['name']);
        email = teacherData['email'];
        firebaseUID = teacherData['firebaseUID'] ?? 'Not available';
        status = teacherData['status'] ? 'InCabin' : 'OutCabin';
        ref.read(statusProvider.notifier).update((ref) => status);

        imageUrl = teacherData['image'];
        ref.read(imageProvider.notifier).update((ref) => imageUrl);
        ref.read(emailProvider.notifier).update((ref) => email);

        // Print all teacher information
        print("ID: ${teacherData['_id']}");
        print("Name: ${teacherData['name']}");
        print("Email: ${teacherData['email']}");
        print("Firebase UID: ${teacherData['firebaseUID'] ?? 'Not available'}");
        print("Status: ${teacherData['status'] ? 'Available' : 'Unavailable'}");
        print("Image URL: ${teacherData['image']}");

        print("-----------------------");
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => MainScaffold()),
        );
      } else {
        print("Failed to send data. Status: ${response.statusCode}");
      }
    } catch (e) {
      print("Error: $e");
    }
  }
}
