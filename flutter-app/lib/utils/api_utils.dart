import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> addCustomEvent(String teacherEmail, String title, String startTime,
    String endTime, String date, String descp) async {
  final url = Uri.parse(
      'http://192.168.56.1:5000/routes/schedules'); // Replace with your API URL
  print(teacherEmail);
  print(startTime);
  print(endTime);
  print(date);
  final body = jsonEncode({
    'teacher': teacherEmail,
    'title': title,
    'startTime': startTime,
    'endTime': endTime,
    'date': date,
    'description': descp,
  });

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: body,
  );

  if (response.statusCode == 200) {
    print('Custom event added successfully: ${response.body}');
  } else {
    print('Failed to add custom event: ${response.body}');
  }
}
