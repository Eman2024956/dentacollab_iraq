import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/models/app_models.dart';

class MyLearningScreen extends StatefulWidget {
  const MyLearningScreen({super.key});

  @override
  State<MyLearningScreen> createState() => _MyLearningScreenState();
}

class _MyLearningScreenState extends State<MyLearningScreen> {
  void _showQrPassDialog(EnrollmentModel enrollment) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: cardBg,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.brandMint.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'بطاقة الحضور الميداني (QR Pass)',
                    style: TextStyle(color: AppColors.primaryTeal, fontSize: 11.5, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  enrollment.courseTitle,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: textColor),
                ),
                const SizedBox(height: 4),
                Text(
                  enrollment.cohortTitle,
                  textAlign: TextAlign.center,
                  style: TextStyle(color: subtitleColor, fontSize: 11.5),
                ),
                const SizedBox(height: 20),

                // High contrast QR Code
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryTeal.withValues(alpha: 0.1),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: QrImageView(
                    data: enrollment.qrData,
                    version: QrVersions.auto,
                    size: 180.0,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'أظهر هذا الرمز لمشرف الأكاديمية عند الدخول لتسجيل حضورك',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: subtitleColor, fontSize: 11.5),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('إغلاق', style: TextStyle(color: AppColors.primaryTeal, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final enrollments = AcademyRepository.myEnrollments;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('تعلّمي والشهادات', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: enrollments.isEmpty
          ? Center(
              child: Text(
                'لا توجد تسجيلات حالية. يمكنك استعراض الدورات والتسجيل الآن.',
                style: TextStyle(color: subtitleColor),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: enrollments.length,
              itemBuilder: (context, index) {
                final enr = enrollments[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: borderColor),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.12 : 0.05),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primaryTeal.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'مؤكد ومقبول',
                              style: TextStyle(color: AppColors.primaryTeal, fontSize: 10.5, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const Spacer(),
                          const Icon(Icons.verified, color: AppColors.primaryTeal, size: 18),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        enr.courseTitle,
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15.5, color: textColor),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        enr.cohortTitle,
                        style: TextStyle(color: subtitleColor, fontSize: 12.5),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'المواعيد: ${enr.dateSummary}',
                        style: TextStyle(color: subtitleColor.withValues(alpha: 0.7), fontSize: 11.5),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: OutlinedButton.icon(
                          onPressed: () => _showQrPassDialog(enr),
                          icon: const Icon(Icons.qr_code, size: 16, color: AppColors.primaryTeal),
                          label: const Text(
                            'عرض بطاقة الدخول الرقمية (QR Pass)',
                            style: TextStyle(color: AppColors.primaryTeal, fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.primaryTeal),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
