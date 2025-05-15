import 'package:flutter/material.dart';

class ClassSchedule {
  final String title;
  final String batch;
  final String room;
  final String professor;
  final TimeOfDay startTime;
  final TimeOfDay endTime;
  final List<int> weekDays; // 1 = Monday, 2 = Tuesday, etc.

  ClassSchedule({
    required this.title,
    required this.batch,
    required this.room,
    required this.professor,
    required this.startTime,
    required this.endTime,
    required this.weekDays,
  });
}

final Map<String, List<ClassSchedule>> weeklySchedule = {
  'Monday': [
    ClassSchedule(
      title: 'Computer Networks',
      batch: '2023 batch-2',
      room: 'Room 6-205',
      professor: 'Brooklyn Williamson',
      startTime: const TimeOfDay(hour: 11, minute: 35),
      endTime: const TimeOfDay(hour: 13, minute: 05),
      weekDays: [1],
    ),
  ],
  'Tuesday': [
    ClassSchedule(
      title: 'Secure Software',
      batch: '2023 Batch-2',
      room: 'Room 2-168',
      professor: 'Julie Watson',
      startTime: const TimeOfDay(hour: 13, minute: 15),
      endTime: const TimeOfDay(hour: 14, minute: 45),
      weekDays: [2],
    ),
  ],
  'Wednesday': [
    ClassSchedule(
      title: 'Computer Networks',
      batch: '2023 batch-2',
      room: 'Room 6-205',
      professor: 'Brooklyn Williamson',
      startTime: const TimeOfDay(hour: 11, minute: 35),
      endTime: const TimeOfDay(hour: 13, minute: 05),
      weekDays: [3],
    ),
    ClassSchedule(
      title: 'Computer Networks Lab',
      batch: '2023 Batch-2',
      room: 'Room 1-403',
      professor: 'Jenny Alexander',
      startTime: const TimeOfDay(hour: 15, minute: 10),
      endTime: const TimeOfDay(hour: 16, minute: 40),
      weekDays: [3],
    ),
  ],
  'Thursday': [
    ClassSchedule(
      title: 'Secure Software',
      batch: '2023 Batch-2',
      room: 'Room 2-168',
      professor: 'Julie Watson',
      startTime: const TimeOfDay(hour: 13, minute: 15),
      endTime: const TimeOfDay(hour: 14, minute: 45),
      weekDays: [4],
    ),
  ],
  'Friday': [
    ClassSchedule(
      title: 'Computer Networks Lab',
      batch: '2023 Batch-2',
      room: 'Room 1-403',
      professor: 'Jenny Alexander',
      startTime: const TimeOfDay(hour: 15, minute: 10),
      endTime: const TimeOfDay(hour: 16, minute: 40),
      weekDays: [5],
    ),
  ],
  'Custom': [],
};
