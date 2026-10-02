import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/models/app_models.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/widgets/app_image_widget.dart';
import 'instructor_profile_screen.dart';

class InstructorsScreen extends StatelessWidget {
  const InstructorsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('الكادر التدريبي المعتمد'),
        centerTitle: true,
      ),
      body: StreamBuilder<List<InstructorModel>>(
        stream: AcademyRepository.streamInstructors(),
        builder: (context, snapshot) {
          final instructors = snapshot.data ?? const <InstructorModel>[];

          if (instructors.isEmpty) {
            return Center(
              child: Text(
                'لا يوجد مدربون متاحون حالياً.',
                style: TextStyle(color: subtitleColor),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: instructors.length,
            itemBuilder: (context, index) {
              final inst = instructors[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => InstructorProfileScreen(instructor: inst),
                    ),
                  );
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
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
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Top Row: Avatar & Names
                        Row(
                          children: [
                            Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [AppColors.brandMint, AppColors.primaryTeal],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.brandMint.withValues(alpha: 0.35),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(20),
                                child: inst.image.isNotEmpty
                                    ? AppImageWidget(
                                        imagePathOrUrl: inst.image,
                                        width: 60,
                                        height: 60,
                                        fit: BoxFit.cover,
                                        errorWidget: const Center(
                                          child: Icon(Icons.person, color: Colors.white, size: 30),
                                        ),
                                      )
                                    : const Center(
                                        child: Icon(Icons.person, color: Colors.white, size: 30),
                                      ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          inst.name.ar,
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                            color: textColor,
                                          ),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.brandMint.withValues(alpha: 0.12),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Text(
                                          'كبير المدربين',
                                          style: TextStyle(
                                            color: AppColors.primaryTeal,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    inst.name.en,
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: subtitleColor,
                                      fontFamily: 'monospace',
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    inst.title.ar,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.primaryTeal,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 14),
                        Text(
                          inst.bio.ar,
                          style: TextStyle(
                            fontSize: 12.5,
                            color: subtitleColor,
                            height: 1.55,
                          ),
                        ),

                        if (inst.credentials.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: inst.credentials.map((c) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: isDark ? AppColors.darkBorder : AppColors.brandMint.withValues(alpha: 0.3),
                                  ),
                                ),
                                child: Text(
                                  c.ar,
                                  style: TextStyle(
                                    color: isDark ? Colors.white70 : AppColors.primaryTeal,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],

                        const SizedBox(height: 14),
                        Divider(color: borderColor, height: 1),
                        const SizedBox(height: 12),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.phone, size: 14, color: subtitleColor),
                                const SizedBox(width: 6),
                                Text(
                                  inst.phone,
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: subtitleColor,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                              decoration: BoxDecoration(
                                color: AppColors.primaryTeal,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'الملف الشخصي الكامل',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(Icons.arrow_forward, size: 12, color: Colors.white),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
