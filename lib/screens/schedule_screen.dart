import 'package:cabin_check/models/class_scheduling.dart';
import 'package:cabin_check/screens/addevents_screens.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({Key? key}) : super(key: key);

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  late DateTime selectedDate;
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now();
    _scrollController = ScrollController();
  }

  List<ClassSchedule> getClassesForDate(DateTime date) {
    int weekDay = date.weekday;
    return weeklySchedule
        .where((schedule) => schedule.weekDays.contains(weekDay))
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final classes = getClassesForDate(selectedDate);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
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
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: Colors.grey[400],
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            DateFormat('yyyy').format(selectedDate),
                            style: theme.textTheme.bodyLarge?.copyWith(
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
                      Container(
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
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: Colors.black,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const AddEventScreen(),
                            ),
                          );
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
                  final date = DateTime.now().subtract(
                      Duration(days: DateTime.now().weekday - index - 1));
                  final isSelected = date.day == selectedDate.day;

                  return GestureDetector(
                    onTap: () => _selectDate(date),
                    child: Container(
                      width: 45,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.black : Colors.transparent,
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
                              color: isSelected ? Colors.white : Colors.black,
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
              child: ListView.builder(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                itemCount: classes.length,
                itemBuilder: (context, index) {
                  final classSchedule = classes[index];
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 45,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              classSchedule.startTime.format(context),
                              style: TextStyle(
                                color: Colors.grey[400],
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              "To",
                              style: TextStyle(
                                color: Colors.grey[500],
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              classSchedule.endTime.format(context),
                              style: TextStyle(
                                color: Colors.grey[300],
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 1,
                        height: 120,
                        margin: const EdgeInsets.symmetric(horizontal: 12),
                        color: Colors.grey[200],
                      ),
                      Expanded(
                        child: _buildClassCard(
                          context,
                          classSchedule.title,
                          classSchedule.batch,
                          classSchedule.room,
                          classSchedule.professor,
                          isActive: isClassActive(classSchedule),
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

  Widget _buildClassCard(
    BuildContext context,
    String title,
    String batch,
    String room,
    String professor, {
    required bool isActive,
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
              Icon(
                Icons.more_vert,
                color: isActive ? Colors.white70 : Colors.grey[400],
                size: 20,
              ),
            ],
          ),
          const SizedBox(height: 16),
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
                radius: 10,
                backgroundColor: isActive ? Colors.white24 : Colors.grey[200],
                child: Icon(
                  Icons.person,
                  size: 14,
                  color: isActive ? Colors.white70 : Colors.grey[600],
                ),
              ),
              const SizedBox(width: 6),
              Text(
                professor,
                style: TextStyle(
                  color: isActive ? Colors.white70 : Colors.grey[600],
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
