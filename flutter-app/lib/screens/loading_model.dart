import 'package:cabin_check/theme/app_theme.dart';
import 'package:flutter/material.dart';

Widget LoadingCircle(bool background) {
  return CircularProgressIndicator(
    // 70% completed
    backgroundColor: background ? AppTheme.gray3 : null,
    valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.white0),
    strokeWidth: 6.7,
    strokeCap: StrokeCap.round, // Makes it thicker
  );
}

Widget LoadingLine(bool background) {
  return LinearProgressIndicator(
    backgroundColor: background ? AppTheme.white3 : null,
    valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.white0),
    minHeight: 4.7, // Adjust thickness
  );
}
