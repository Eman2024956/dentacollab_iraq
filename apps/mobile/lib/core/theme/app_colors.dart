import 'package:flutter/material.dart';

class AppColors {
  // Medical Fresh Mint & Teal Palette (Inspired by Image 1)
  static const Color primaryTeal = Color(0xFF0D9488);
  static const Color brandMint = Color(0xFF14B8A6);
  static const Color brandCyan = Color(0xFF00BFA5);
  static const Color primaryNavy = Color(0xFF0F292F);

  // Soft Warm Accents (Peach / Coral from image 1)
  static const Color accentPeach = Color(0xFFFF8A65);
  static const Color accentCoral = Color(0xFFFF7A59);
  static const Color softMintBg = Color(0xFFE6F7F5);
  static const Color softPeachBg = Color(0xFFFFF0EC);
  static const Color softBlueBg = Color(0xFFEBF6FF);

  // Light Mode Colors (Clinical Porcelain & Mint)
  static const Color lightBackground = Color(0xFFF3F8F8);
  static const Color lightCard = Colors.white;
  static const Color lightBorder = Color(0xFFE2EFF0);
  static const Color textPrimary = Color(0xFF0F292F);
  static const Color textSecondary = Color(0xFF648287);
  static const Color textMuted = Color(0xFF94A3B8);

  // Modern Dark Mode (Sleek Slate Medical Teal)
  static const Color darkBackground = Color(0xFF0A161B);
  static const Color darkCard = Color(0xFF112229);
  static const Color darkBorder = Color(0xFF1C3640);

  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF0284C7);

  // Gradient Helpers
  static const LinearGradient mintCyanGradient = LinearGradient(
    colors: [Color(0xFF14B8A6), Color(0xFF0284C7)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroBannerGradient = LinearGradient(
    colors: [Color(0xFF0D9488), Color(0xFF0284C7)],
    begin: Alignment.topRight,
    end: Alignment.bottomLeft,
  );

  static const LinearGradient heroBannerDarkGradient = LinearGradient(
    colors: [Color(0xFF112229), Color(0xFF0D333B)],
    begin: Alignment.topRight,
    end: Alignment.bottomLeft,
  );
}
