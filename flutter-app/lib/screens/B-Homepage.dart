import 'dart:convert';
import 'package:cabin_check/models/global_var.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

Future<void> toggleTeacherStatus(String teacherId, WidgetRef ref) async {
  final String baseUrl =
      "http://192.168.56.1:5000/routes/teachers"; // Replace <your-backend-ip> with your backend's IP address
  final String url = '$baseUrl/$teacherId/status';

  try {
    final response = await http.patch(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      status = data['status'] ? 'InCabin' : 'OutCabin';
      ref.read(statusProvider.notifier).update((ref) => status);
      print('Teacher status updated successfully: $data');
      
    } else {
      print('Failed to update teacher status: ${response.statusCode}');
      print('Error: ${response.body}');
    }
  } catch (error) {
    print('Error making request: $error');
  }
}
