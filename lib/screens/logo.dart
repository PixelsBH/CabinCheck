import 'package:cabin_check/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CabinCheckLogo extends StatelessWidget {
  final double fontSize;

  const CabinCheckLogo({
    super.key,
    this.fontSize = 74,
  });

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: GoogleFonts.inter(
            fontSize: fontSize,
            fontWeight: FontWeight.w600,
            height: 1.0,
            letterSpacing: -0.7),
        children: const [
          TextSpan(
            text: 'Cabin\n',
            style: TextStyle(
              color: AppTheme.primaryColor,
            ),
          ),
          TextSpan(
            text: 'Check',
            style: TextStyle(
              color: AppTheme.primaryColor,
            ),
          ),
        ],
      ),
    );
  }
}
