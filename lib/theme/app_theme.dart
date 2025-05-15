import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const primaryColor = Color(0xFF000000);
  static const secondaryColor = Color(0xFF666666);
  static const backgroundColor = Color(0xFFFAFAFA);
  static const cardColor = Color(0xFFFFFFFF);
  static const accentColor = Color(0xFF007AFF);
  static const smtg = Color.fromRGBO(231, 230, 231, 1.0);
  static const white2 = Color.fromRGBO(232, 232, 237, 1.0);
  static const white3 = Color.fromRGBO(231, 230, 231, 1.0); // newly added color
  static const gray1 = Color.fromRGBO(205, 205, 205, 1.0);
  static const gray2 = Color.fromRGBO(185, 185, 185, 1.0);
  static const white0 = Color.fromRGBO(255, 255, 255, 1.0);
  static const white1 = Color.fromRGBO(245, 245, 245, 1.0);
  static const gray3 = Color.fromRGBO(145, 145, 145, 1.0);
  static const black1 = Color.fromRGBO(68, 68, 69, 1.0);
  static const black2 = Color.fromRGBO(22, 22, 23, 1.0);
  static const black3 = Color.fromRGBO(30, 30, 30, 1.0);
  static const black0 = Color.fromRGBO(0, 0, 0, 1.0);
  static const fire_red = Color.fromRGBO(230, 57, 70, 1.0);
  static const tree_green = Color.fromRGBO(50, 187, 120, 1.0);
  static const gray44 = Color.fromRGBO(132, 141, 151, 1.0);
  static const selected_red = Color(0xFFFFF5F5);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: primaryColor,
    scaffoldBackgroundColor: backgroundColor,
    cardColor: cardColor,
    textTheme: TextTheme(
      displayLarge: GoogleFonts.inter(
        fontSize: 48,
        fontWeight: FontWeight.bold,
        color: primaryColor,
        height: 1.1,
      ),
      displayMedium: GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: primaryColor,
      ),
      titleLarge: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: primaryColor,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: primaryColor,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: 16,
        color: secondaryColor,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 14,
        color: secondaryColor,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: cardColor,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    cardTheme: CardTheme(
      color: cardColor,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200),
      ),
    ),
  );
}
