import 'package:flutter/material.dart';

class ClassSchedule {
  final String title;
  final String batch;
  final String room;
  final String professor;
  final TimeOfDay startTime;
  final TimeOfDay endTime;
  final List<dynamic>
      weekDays; // Changed to List<dynamic> to handle both int and String

  ClassSchedule({
    required this.title,
    required this.batch,
    required this.room,
    required this.professor,
    required this.startTime,
    required this.endTime,
    required this.weekDays,
  });

  factory ClassSchedule.fromJson(Map<String, dynamic> json, int weekday) {
    // Parse time strings in format "HH:MM" to TimeOfDay
    TimeOfDay parseTimeString(String timeStr) {
      final parts = timeStr.split(':');
      return TimeOfDay(
        hour: int.parse(parts[0]),
        minute: int.parse(parts[1]),
      );
    }

    return ClassSchedule(
      title: json['subject'] ?? '',
      batch: json['batch'] ?? '',
      room: json['roomNo'] ?? '',
      professor: json['teacher'] ?? '',
      startTime: parseTimeString(json['startTime'] ?? '00:00'),
      endTime: parseTimeString(json['endTime'] ?? '00:00'),
      weekDays: [weekday], // Add the weekday directly
    );
  }
}
