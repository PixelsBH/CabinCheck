import 'dart:convert';

import 'package:cabin_check/models/class_scheduling.dart';
import 'package:cabin_check/models/global_var.dart';
import 'package:cabin_check/screens/addevents_screens.dart';
import 'package:cabin_check/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;

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

class ScheduleScreen extends ConsumerStatefulWidget {
  const ScheduleScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends ConsumerState<ScheduleScreen> {
  late DateTime selectedDate;
  late ScrollController _scrollController;
  Map<String, List<ClassSchedule>> weeklySchedule = {};
  bool isLoading = true;
  String errorMessage = '';

  final Map<String, int> dayToWeekday = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7,
  };

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now();
    _scrollController = ScrollController();
    fetchScheduleData();
  }

  void reloadData() {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });
    fetchScheduleData();
  }

  Future<void> fetchScheduleData() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    print(email);
    final provideremail = ref.read(emailProvider);
    print("BELOWWWWWW THIS SSSSS");
    print(provideremail);
    try {
      final url = Uri.parse(
          'http://172.16.204.118:5000/routes/schedules/$provideremail');
      final response = await http.get(
        url,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseList = json.decode(response.body);
        if (responseList.isEmpty) {
          setState(() {
            errorMessage = 'No schedule data available';
          });
          return;
        }

        final Map<String, dynamic> data = responseList;

        // Clear existing data
        weeklySchedule.clear();

        if (data.containsKey('schedule')) {
          final Map<String, dynamic> scheduleData = data['schedule'];

          scheduleData.forEach((day, classes) {
            if (day == "Custom") {
              weeklySchedule[day] =
                  (classes as List).map<ClassSchedule>((classData) {
                return ClassSchedule(
                  title: classData['title'] ?? '',
                  batch: classData['description'] ?? '',
                  room: classData['roomNo'] ?? 'Personal',
                  professor: classData['teacher'] ?? '',
                  startTime: TimeOfDay(
                    hour: int.tryParse(
                            classData['startTime']?.split(':')[0] ?? '0') ??
                        0,
                    minute: int.tryParse(
                            classData['startTime']?.split(':')[1] ?? '0') ??
                        0,
                  ),
                  endTime: TimeOfDay(
                    hour: int.tryParse(
                            classData['endTime']?.split(':')[0] ?? '0') ??
                        0,
                    minute: int.tryParse(
                            classData['endTime']?.split(':')[1] ?? '0') ??
                        0,
                  ),
                  weekDays: [classData['date'] ?? ''],
                );
              }).toList();
            } else if (classes is List) {
              final weekday = dayToWeekday[day] ?? 1;

              weeklySchedule[day] = classes.map<ClassSchedule>((classData) {
                return ClassSchedule(
                  title: classData['subject'] ?? '',
                  batch: classData['batch'] ?? '',
                  room: classData['roomNo'] ?? '',
                  professor: classData['teacher'] ?? '',
                  startTime: TimeOfDay(
                    hour: int.tryParse(
                            classData['startTime']?.split(':')[0] ?? '0') ??
                        0,
                    minute: int.tryParse(
                            classData['startTime']?.split(':')[1] ?? '0') ??
                        0,
                  ),
                  endTime: TimeOfDay(
                    hour: int.tryParse(
                            classData['endTime']?.split(':')[0] ?? '0') ??
                        0,
                    minute: int.tryParse(
                            classData['endTime']?.split(':')[1] ?? '0') ??
                        0,
                  ),
                  weekDays: [weekday],
                );
              }).toList();
            }
          });
        }
      } else if (response.statusCode == 404) {
        setState(() {
          errorMessage = 'No schedule data available in Database';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error fetching schedule data: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> deleteCustomEvent(String title) async {
    try {
      final teacherEmail = ref.read(emailProvider);
      print(teacherEmail);
      final url = Uri.parse('http://172.16.204.118:5000/routes/schedules');

      final response = await http.delete(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'teacher': teacherEmail,
          'title': title,
        }),
      );

      if (response.statusCode == 200) {
        reloadData(); // Refresh data after deletion
        _showSnackBar('Custom event deleted successfully', isSuccess: true);
      } else {
        _showSnackBar('Failed to delete event: Error ${response.statusCode}',
            isSuccess: false);
      }
    } catch (e) {
      // Simple catch-all for any error
      print('Error deleting custom event: $e');
      _showSnackBar('Error deleting custom event', isSuccess: false);
    }
  }

// Simple snackbar helper
  void _showSnackBar(String message, {required bool isSuccess}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isSuccess ? Icons.check_circle : Icons.error_outline,
              color: Colors.white,
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor:
            isSuccess ? Colors.green.shade600 : Colors.red.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  List<ClassSchedule> getClassesForDate(DateTime date) {
    String dateString = DateFormat('yyyy-MM-dd').format(date);

    // Combine regular and custom schedules
    List<ClassSchedule> classes = [];
    weeklySchedule.forEach((day, schedules) {
      if (day == "Custom") {
        classes.addAll(schedules
            .where((schedule) => schedule.weekDays.contains(dateString)));
      } else if (dayToWeekday[day] == date.weekday) {
        classes.addAll(schedules);
      }
    });

    return classes;
  }

  List<DateTime> getCustomEventDates() {
    if (!weeklySchedule.containsKey("Custom")) return [];
    return weeklySchedule["Custom"]!
        .map((event) =>
            DateTime.parse(event.weekDays.first as String)) // Cast to String
        .toList();
  }

  bool isClassActive(ClassSchedule classSchedule) {
    final now = TimeOfDay.now();
    return now.hour >= classSchedule.startTime.hour &&
        now.hour <= classSchedule.endTime.hour &&
        selectedDate.day == DateTime.now().day;
  }

  void _selectDate(DateTime date) {
    setState(() {
      selectedDate = date;
    });
  }

  Widget _buildClassCard(
    WidgetRef ref,
    BuildContext context,
    String title,
    String batch,
    String room,
    String professor, {
    required bool isActive,
    bool isCustomEvent = false, // Add flag to identify custom events
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isActive ? Colors.black : Colors.grey[50],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: isActive ? Colors.white : Colors.black,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    batch,
                    style: TextStyle(
                      color: isActive ? Colors.white70 : Colors.grey[600],
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'delete' && isCustomEvent) {
                    deleteCustomEvent(title);
                  }
                },
                itemBuilder: (context) => [
                  if (isCustomEvent)
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Delete'),
                        ],
                      ),
                    ),
                ],
                icon: Icon(
                  Icons.more_vert,
                  color: isActive ? Colors.white70 : Colors.grey[400],
                  size: 20,
                ),
              ),
            ],
          ),
          Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                size: 16,
                color: isActive ? Colors.white70 : Colors.grey[600],
              ),
              const SizedBox(width: 6),
              Text(
                room,
                style: TextStyle(
                  color: isActive ? Colors.white70 : Colors.grey[600],
                  fontSize: 13,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              CircleAvatar(
                radius: 14, // Slightly larger than before
                backgroundColor: isActive ? Colors.white24 : Colors.grey[200],
                backgroundImage: ref.watch(imageProvider).isNotEmpty
                    ? NetworkImage(ref.watch(imageProvider))
                    : null,
                child: ref.watch(imageProvider).isEmpty
                    ? Icon(
                        Icons.person,
                        size: 18, // Slightly larger than before
                        color: isActive ? Colors.white70 : Colors.grey[600],
                      )
                    : null,
              ),
              const SizedBox(width: 6),
              Text(
                ref.watch(nameProvider) ?? "",
                style: TextStyle(
                  color: AppTheme.black0,
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final classes = getClassesForDate(selectedDate);

    // Extract custom event dates
    final customEventDates = getCustomEventDates();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : errorMessage.isNotEmpty
                ? Center(child: Text(errorMessage))
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 18,
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Text(
                                  selectedDate.day.toString(),
                                  style: theme.textTheme.displayLarge?.copyWith(
                                    fontSize: 42,
                                    height: 1,
                                  ),
                                ),
                                SizedBox(
                                  width: 8,
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      DateFormat('E MMM').format(selectedDate),
                                      style:
                                          theme.textTheme.bodyLarge?.copyWith(
                                        color: Colors.grey[400],
                                        fontSize: 14,
                                      ),
                                    ),
                                    Text(
                                      DateFormat('yyyy').format(selectedDate),
                                      style:
                                          theme.textTheme.bodyLarge?.copyWith(
                                        color: Colors.grey[400],
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    _selectDate(DateTime.now());
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[100],
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      'Today',
                                      style:
                                          theme.textTheme.titleMedium?.copyWith(
                                        color: Colors.black,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                GestureDetector(
                                  onTap: () async {
                                    final result = await Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const AddEventScreen(),
                                      ),
                                    );
                                    if (result == true) {
                                      reloadData(); // Reload data instead of calling initState
                                    }
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[100],
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(
                                      Icons.add,
                                      color: Colors.black,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Container(
                        height: 80,
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        child: ListView.builder(
                          controller: _scrollController,
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          itemCount: 30,
                          itemBuilder: (context, index) {
                            final date = DateTime.now().subtract(Duration(
                                days: DateTime.now().weekday - index - 1));
                            final isSelected = date.day == selectedDate.day &&
                                date.month == selectedDate.month;

                            // Highlight custom event dates
                            final hasCustomEvent = customEventDates.any(
                                (customDate) =>
                                    customDate.year == date.year &&
                                    customDate.month == date.month &&
                                    customDate.day == date.day);

                            return GestureDetector(
                              onTap: () => _selectDate(date),
                              child: Container(
                                width: 45,
                                margin:
                                    const EdgeInsets.symmetric(horizontal: 4),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? Colors.black
                                      : hasCustomEvent
                                          ? Colors.blue[100]
                                          : Colors.transparent,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      DateFormat('E').format(date)[0],
                                      style: TextStyle(
                                        color: isSelected
                                            ? Colors.white70
                                            : Colors.grey[400],
                                        fontSize: 12,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      date.day.toString(),
                                      style: TextStyle(
                                        color: isSelected
                                            ? Colors.white
                                            : hasCustomEvent
                                                ? Colors.blue
                                                : Colors.black,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(24, 8, 24, 0),
                        child: Row(
                          children: [
                            Text(
                              'Time',
                              style: TextStyle(
                                color: Colors.grey[350],
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(width: 40),
                            Text(
                              'Course',
                              style: TextStyle(
                                color: Colors.grey[350],
                                fontSize: 13,
                              ),
                            ),
                            const Spacer(),
                            Icon(
                              Icons.sort,
                              color: Colors.grey[350],
                              size: 20,
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: classes.isEmpty
                            ? Center(
                                child: Text(
                                  'No classes scheduled for this day',
                                  style: TextStyle(
                                    color: Colors.grey[500],
                                    fontSize: 16,
                                  ),
                                ),
                              )
                            : ListView.builder(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 24, vertical: 16),
                                itemCount: classes.length,
                                itemBuilder: (context, index) {
                                  final classSchedule = classes[index];
                                  return Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SizedBox(
                                        width: 45,
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              _formatTimeOfDay(
                                                  classSchedule.startTime),
                                              style: TextStyle(
                                                color: Colors.grey[
                                                    600], // darker than 400
                                                fontSize: 13,
                                              ),
                                            ),
                                            Text(
                                              "To",
                                              style: TextStyle(
                                                color: Colors.grey[
                                                    500], // keep the same or tweak if you like
                                                fontSize: 13,
                                              ),
                                            ),
                                            Text(
                                              _formatTimeOfDay(
                                                  classSchedule.endTime),
                                              style: TextStyle(
                                                color: Colors.grey[
                                                    600], // darker than 300
                                                fontSize: 13,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        width: 1,
                                        height: 120,
                                        margin: const EdgeInsets.symmetric(
                                            horizontal: 12),
                                        color: Colors.grey[200],
                                      ),
                                      Expanded(
                                        child: _buildClassCard(
                                          ref,
                                          context,
                                          classSchedule.title,
                                          classSchedule.batch,
                                          classSchedule.room,
                                          classSchedule.professor,
                                          isActive:
                                              isClassActive(classSchedule),
                                          isCustomEvent:
                                              classSchedule.room == 'Personal',
                                        ),
                                      ),
                                    ],
                                  );
                                },
                              ),
                      ),
                    ],
                  ),
      ),
    );
  }

  // Helper method to format TimeOfDay without context
  String _formatTimeOfDay(TimeOfDay timeOfDay) {
    final hour = timeOfDay.hour.toString().padLeft(2, '0');
    final minute = timeOfDay.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}
