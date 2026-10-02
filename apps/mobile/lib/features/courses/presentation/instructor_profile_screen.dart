import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/models/app_models.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/widgets/app_image_widget.dart';
import 'course_detail_screen.dart';

class InstructorProfileScreen extends StatelessWidget {
  final InstructorModel instructor;

  const InstructorProfileScreen({
    super.key,
    required this.instructor,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('الملف الشخصي للمدرب', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Header Card (Aesthetic matching Image 1)
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(26),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.15 : 0.06),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Avatar with clinical glow
                  Container(
                    width: 88,
                    height: 88,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.brandMint, AppColors.primaryTeal],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.brandMint.withValues(alpha: 0.35),
                          blurRadius: 18,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: instructor.image.isNotEmpty
                          ? AppImageWidget(
                              imagePathOrUrl: instructor.image,
                              width: 88,
                              height: 88,
                              fit: BoxFit.cover,
                              errorWidget: const Center(
                                child: Icon(Icons.person, color: Colors.white, size: 48),
                              ),
                            )
                          : const Center(
                              child: Icon(Icons.person, color: Colors.white, size: 48),
                            ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Name & Role Tag
                  Text(
                    instructor.name.ar,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    instructor.name.en,
                    style: TextStyle(
                      fontSize: 12.5,
                      color: subtitleColor,
                      fontFamily: 'monospace',
                    ),
                  ),
                  const SizedBox(height: 8),

                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryTeal.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.brandMint.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.verified, size: 14, color: AppColors.primaryTeal),
                        const SizedBox(width: 6),
                        Text(
                          instructor.role.isNotEmpty ? instructor.role : 'مدرب معتمد',
                          style: const TextStyle(
                            color: AppColors.primaryTeal,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),
                  Text(
                    instructor.title.ar,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.primaryTeal,
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 20),
                  Divider(color: borderColor, height: 1),
                  const SizedBox(height: 16),

                  // Contact quick buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildQuickAction(
                        icon: Icons.phone_in_talk_rounded,
                        label: 'اتصال مباشر',
                        value: instructor.phone,
                        textColor: textColor,
                        subtitleColor: subtitleColor,
                        isDark: isDark,
                      ),
                      Container(width: 1, height: 36, color: borderColor),
                      _buildQuickAction(
                        icon: Icons.email_outlined,
                        label: 'البريد الأكاديمي',
                        value: instructor.email.isNotEmpty ? instructor.email : 'contact@dentacollab.iq',
                        textColor: textColor,
                        subtitleColor: subtitleColor,
                        isDark: isDark,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Bio Section
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.1 : 0.04),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.brandMint.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.badge_outlined, color: AppColors.primaryTeal, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'نبذة عن الخبرة السريرية والأكاديمية',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    instructor.bio.ar.isNotEmpty
                        ? instructor.bio.ar
                        : 'أخصائي ومحاضر معتمد يشرف على التدريب العملي السريري في الأكاديمية ونقل الخبرات لأطباء الأسنان في العراق.',
                    style: TextStyle(
                      fontSize: 13.5,
                      color: subtitleColor,
                      height: 1.65,
                    ),
                  ),
                ],
              ),
            ),

            // Credentials & Certifications
            if (instructor.credentials.isNotEmpty)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: borderColor),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.1 : 0.04),
                      blurRadius: 14,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.brandMint.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.workspace_premium_outlined, color: AppColors.primaryTeal, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'الشهادات والاعتمادات المهنية',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    ...instructor.credentials.map((cred) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              margin: const EdgeInsets.only(top: 4),
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.primaryTeal,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                cred.ar,
                                style: TextStyle(
                                  fontSize: 13,
                                  color: textColor,
                                  fontWeight: FontWeight.w500,
                                  height: 1.45,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
                ),
              ),

            // Supervised Courses Section
            StreamBuilder<List<CourseModel>>(
              stream: AcademyRepository.streamCourses(),
              initialData: AcademyRepository.courses,
              builder: (context, snapshot) {
                final allCourses = snapshot.data ?? AcademyRepository.courses;
                final instructorCourses = allCourses.where((c) {
                  return instructor.courses.contains(c.id) ||
                      c.title.ar.contains('Exocad') ||
                      c.title.ar.contains('Exoplan');
                }).take(2).toList();

                if (instructorCourses.isEmpty) return const SizedBox.shrink();

                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: borderColor),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.1 : 0.04),
                        blurRadius: 14,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.brandMint.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.school_outlined, color: AppColors.primaryTeal, size: 20),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'الدورات التدريبية المعتمدة بإشرافه',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      ...instructorCourses.map((course) {
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: isDark ? AppColors.darkBorder : AppColors.brandMint.withValues(alpha: 0.3),
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: AppColors.primaryTeal.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.auto_stories, color: AppColors.primaryTeal, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      course.title.ar,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'المدة: ${course.duration} • المستوى: ${course.level}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: subtitleColor,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => CourseDetailScreen(course: course)),
                                  );
                                },
                                child: const Text('تفاصيل', style: TextStyle(color: AppColors.primaryTeal, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 16),

            // Bottom CTA Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryTeal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                    elevation: 0,
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: AppColors.primaryTeal,
                        content: Text('تم توجيه طلب التواصل مع ${instructor.name.ar} إلى إدارة الأكاديمية بنجاح ✅'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.chat_bubble_outline, size: 18),
                  label: Text('حجز استشارة أو تدريب مع ${instructor.name.ar.split(' ')[0]}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                ),
              ),
            ),

            const SizedBox(height: 36),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required String value,
    required Color textColor,
    required Color subtitleColor,
    required bool isDark,
  }) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppColors.primaryTeal, size: 20),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(color: subtitleColor, fontSize: 11),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            color: textColor,
            fontSize: 11,
            fontWeight: FontWeight.bold,
            fontFamily: 'monospace',
          ),
        ),
      ],
    );
  }
}
