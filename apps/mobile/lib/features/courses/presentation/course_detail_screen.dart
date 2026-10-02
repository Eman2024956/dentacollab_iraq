import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/models/app_models.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/widgets/app_image_widget.dart';

class CourseDetailScreen extends StatefulWidget {
  final CourseModel course;

  const CourseDetailScreen({super.key, required this.course});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  bool _enrolling = false;

  void _showEnrollBottomSheet() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;
    final cohort = widget.course.cohorts.isNotEmpty ? widget.course.cohorts.first : null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: borderColor,
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'تأكيد حجز المقعد التدريبي',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.course.title.ar,
                    style: const TextStyle(fontSize: 13, color: AppColors.primaryTeal, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  if (cohort != null)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.brandMint.withValues(alpha: 0.25)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.calendar_today, size: 14, color: AppColors.primaryTeal),
                              const SizedBox(width: 8),
                              Text(cohort.title.ar, style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: textColor)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.location_on, size: 14, color: subtitleColor),
                              const SizedBox(width: 8),
                              Text(cohort.venueName.ar, style: TextStyle(fontSize: 11.5, color: subtitleColor)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.people, size: 14, color: subtitleColor),
                              const SizedBox(width: 8),
                              Text('المقاعد المتبقية: ${cohort.remainingSeats} من ${cohort.maxCapacity}',
                                  style: const TextStyle(fontSize: 11.5, color: AppColors.primaryTeal, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 22),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryTeal,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                        elevation: 0,
                      ),
                      onPressed: _enrolling
                          ? null
                          : () {
                              setModalState(() => _enrolling = true);
                              setState(() => _enrolling = true);

                              Future.delayed(const Duration(milliseconds: 600), () {
                                if (!mounted || !context.mounted) return;
                                Navigator.pop(context);
                                setState(() => _enrolling = false);

                                // Add to user's enrollments
                                AcademyRepository.myEnrollments.insert(
                                  0,
                                  EnrollmentModel(
                                    id: 'enr_${DateTime.now().millisecondsSinceEpoch}',
                                    courseTitle: widget.course.title.ar,
                                    cohortTitle: cohort?.title.ar ?? 'دفعة جديدة',
                                    dateSummary: cohort?.startDateFormatted ?? 'الموعد المعتمد',
                                    status: 'confirmed',
                                    verificationPassToken: 'dc_pass_${DateTime.now().millisecondsSinceEpoch}',
                                    qrData: 'DENTACOLLAB:PASS:${DateTime.now().millisecondsSinceEpoch}',
                                  ),
                                );

                                if (!mounted || !context.mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    backgroundColor: AppColors.primaryTeal,
                                    content: Text('تم حجز مقعدك بنجاح! بطاقة الدخول QR متوفرة الآن في شاشة تعلّمي ✅'),
                                  ),
                                );
                              });
                            },
                      child: _enrolling
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text('إتمام الحجز المباشر', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.course.title.ar, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: cardBg,
          border: Border(top: BorderSide(color: borderColor)),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.2 : 0.06),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('الرسوم التدريبية', style: TextStyle(color: subtitleColor, fontSize: 11)),
                  Text(
                    '${widget.course.priceMinorUnits ~/ 1000} ألف د.ع',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: textColor),
                  ),
                ],
              ),
              const Spacer(),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 13),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                  elevation: 0,
                ),
                onPressed: _showEnrollBottomSheet,
                icon: const Icon(Icons.arrow_forward_rounded, size: 16),
                label: const Text('حجز مقعد الآن', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover Image
            ClipRRect(
              child: AppImageWidget(
                imagePathOrUrl: widget.course.image,
                width: double.infinity,
                height: 220,
                fit: BoxFit.cover,
                errorWidget: Container(
                  height: 220,
                  color: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
                  child: const Center(
                    child: Icon(Icons.school, size: 60, color: AppColors.primaryTeal),
                  ),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.brandMint.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          widget.course.category,
                          style: const TextStyle(color: AppColors.primaryTeal, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'المدة: ${widget.course.duration}',
                        style: TextStyle(color: subtitleColor, fontSize: 12),
                      ),
                      const Spacer(),
                      Text(
                        'المستوى: ${widget.course.level}',
                        style: TextStyle(color: subtitleColor, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.course.title.ar,
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    widget.course.description.ar,
                    style: TextStyle(color: subtitleColor, fontSize: 13.5, height: 1.6),
                  ),
                  const SizedBox(height: 28),

                  // Curriculum & Modules Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'المنهج والوحدات التدريبية',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
                      ),
                      if (widget.course.syllabus.isNotEmpty)
                        Text(
                          '${widget.course.syllabus.length} وحدات تدريبية',
                          style: const TextStyle(fontSize: 12, color: AppColors.primaryTeal, fontWeight: FontWeight.bold),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Render Syllabus Modules List
                  if (widget.course.syllabus.isNotEmpty)
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: widget.course.syllabus.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 14),
                      itemBuilder: (context, i) {
                        final mod = widget.course.syllabus[i];
                        return InkWell(
                          onTap: () => _showModuleDetailSheet(mod),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: borderColor),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.12 : 0.04),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 44,
                                      height: 44,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0F1B2E),
                                        borderRadius: BorderRadius.circular(22),
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        mod.order.isNotEmpty ? mod.order : '${i + 1}'.padLeft(2, '0'),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            mod.title,
                                            style: TextStyle(
                                              fontSize: 14.5,
                                              fontWeight: FontWeight.bold,
                                              color: textColor,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            mod.lessonsCount,
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: subtitleColor,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.primaryTeal),
                                  ],
                                ),
                                if (mod.description.isNotEmpty) ...[
                                  const SizedBox(height: 12),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        width: 3,
                                        height: 20,
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF1FB6D1),
                                          borderRadius: BorderRadius.circular(2),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          mod.description,
                                          style: TextStyle(
                                            color: subtitleColor,
                                            fontSize: 12.5,
                                            height: 1.5,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF1FB6D1).withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        '${mod.lessons.length} دروس تفصيلية • ${mod.outcomes.length} مخرجات',
                                        style: const TextStyle(
                                          color: Color(0xFF0E7490),
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    const Text(
                                      'عرض المنهاج كاملاً',
                                      style: TextStyle(
                                        color: AppColors.primaryTeal,
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    )
                  else
                    // Fallback to legacy string modules if any
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: widget.course.modules.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, i) {
                        final mod = widget.course.modules[i];
                        return Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: borderColor),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Center(
                                  child: Text(
                                    '${i + 1}',
                                    style: const TextStyle(
                                      color: AppColors.primaryTeal,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Text(
                                  mod.ar,
                                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textColor),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

  /// Exact replica modal view of the attached screenshot with perfect RTL direction
  void _showModuleDetailSheet(CourseModuleModel module) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? const Color(0xFF071120) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF0F1D30) : Colors.white;
    final borderColor = isDark ? const Color(0xFF1E3554) : const Color(0xFFE2E8F0);
    final textColor = isDark ? Colors.white : const Color(0xFF0F1B2E);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: DraggableScrollableSheet(
            initialChildSize: 0.92,
            minChildSize: 0.5,
            maxChildSize: 0.96,
            expand: false,
            builder: (context, scrollController) {
              return Column(
                children: [
                  // Top handle bar with Cyan ✕ Close Button on the left corner
                  Padding(
                    padding: const EdgeInsets.only(top: 14, left: 16, right: 16, bottom: 4),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Center(
                          child: Container(
                            width: 44,
                            height: 4,
                            decoration: BoxDecoration(
                              color: isDark ? Colors.white24 : Colors.black12,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        ),
                        Align(
                          alignment: Alignment.centerLeft, // Always left corner
                          child: IconButton(
                            onPressed: () => Navigator.pop(ctx),
                            icon: const Icon(Icons.close_rounded, color: Color(0xFF1FB6D1), size: 24),
                            tooltip: 'إغلاق',
                          ),
                        ),
                      ],
                    ),
                  ),

                  Expanded(
                    child: ListView(
                      controller: scrollController,
                      padding: const EdgeInsets.fromLTRB(20, 6, 20, 32),
                      children: [
                        // Header Module Row: Round Order Badge (01) on the right, Title + Lessons Count to its left
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: const Color(0xFF0F1B2E),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                module.order,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 17,
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    module.title,
                                    style: TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.bold,
                                      color: textColor,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    module.lessonsCount,
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: subtitleColor,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),

                        // Module Quote / Track Description with Cyan Vertical Line on the Right
                        if (module.description.isNotEmpty) ...[
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 3.5,
                                height: 24,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1FB6D1),
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  module.description,
                                  style: TextStyle(
                                    color: subtitleColor,
                                    fontSize: 13,
                                    height: 1.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 22),
                        ],

                        // Learning Outcomes Card (مخرجات الوحدة)
                        if (module.outcomes.isNotEmpty) ...[
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF0A1626) : const Color(0xFFF9FBFC),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFF1FB6D1).withValues(alpha: 0.25)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'مخرجات الوحدة',
                                  style: TextStyle(
                                    color: Color(0xFF0284C7),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13.5,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Wrap(
                                  alignment: WrapAlignment.start,
                                  spacing: 8,
                                  runSpacing: 8,
                                  children: module.outcomes.map((outcome) {
                                    return Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                                      decoration: BoxDecoration(
                                        color: cardBg,
                                        borderRadius: BorderRadius.circular(24),
                                        border: Border.all(color: borderColor),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.check, size: 14, color: Color(0xFF0F1B2E)),
                                          const SizedBox(width: 6),
                                          Text(
                                            outcome,
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 22),
                        ],

                        // Dynamic Batch Lessons Cards
                        ...module.lessons.map((lesson) {
                          return Container(
                            width: double.infinity,
                            margin: const EdgeInsets.only(bottom: 14),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: borderColor),
                              boxShadow: [
                                BoxShadow(
                                  color: isDark ? Colors.black38 : Colors.black.withValues(alpha: 0.02),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Title with bullseye / target icon ◉ on the right
                                Row(
                                  children: [
                                    const Icon(Icons.radio_button_checked, size: 16, color: Color(0xFF0F1B2E)),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        lesson.title,
                                        style: TextStyle(
                                          fontSize: 14.5,
                                          fontWeight: FontWeight.bold,
                                          color: textColor,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                if (lesson.description.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  Text(
                                    lesson.description,
                                    style: TextStyle(
                                      fontSize: 12.5,
                                      color: subtitleColor,
                                      height: 1.5,
                                    ),
                                  ),
                                ],
                                const SizedBox(height: 12),

                                // Bottom Badges: Training Mode Pill first (on right), then Tags (to left)
                                Wrap(
                                  alignment: WrapAlignment.start,
                                  spacing: 6,
                                  runSpacing: 6,
                                  children: [
                                    // Training Mode Pill
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 4.5),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF1FB6D1).withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Text(
                                        'نمط التدريب: ${lesson.mode}',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: Color(0xFF0284C7),
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),

                                    // Tags
                                    ...lesson.tags.map((tag) => Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
                                      decoration: BoxDecoration(
                                        color: isDark ? const Color(0xFF192A42) : const Color(0xFFF1F5F9),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Text(
                                        tag,
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: isDark ? Colors.white70 : const Color(0xFF64748B),
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    )),
                                  ],
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        );
      },
    );
  }
}
