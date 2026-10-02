import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/models/app_models.dart';
import '../../courses/presentation/course_detail_screen.dart';
import '../../courses/presentation/courses_screen.dart';
import '../../courses/presentation/instructors_screen.dart';
import '../../courses/presentation/instructor_profile_screen.dart';
import '../../services/presentation/services_screen.dart';
import '../../graduates/presentation/graduates_screen.dart';
import '../../assistant/presentation/assistant_screen.dart';
import '../../workshops/presentation/workshops_screen.dart';
import '../../gallery/presentation/gallery_screen.dart';
import '../../../core/widgets/app_image_widget.dart';
import '../../../core/widgets/hero_slider_banner.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  // ── Level localization ─────────────────────────────────────────────────────
  static String _localizeLevel(String level) {
    switch (level.toLowerCase().trim()) {
      case 'basic':
        return 'مبتدئ';
      case 'intermediate':
        return 'متوسط';
      case 'advanced':
        return 'متقدم';
      case 'all_levels':
      case 'all levels':
        return 'جميع المستويات';
      default:
        return level;
    }
  }

  // ── Price formatter ────────────────────────────────────────────────────────
  static String _formatPrice(int minorUnits) {
    if (minorUnits <= 0) return 'مجاني';
    final buf = StringBuffer();
    final s = minorUnits.toString();
    for (int i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) buf.write(',');
      buf.write(s[i]);
    }
    return '${buf.toString()} د.ع';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(themeModeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bg = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtextColor = isDark ? Colors.white70 : AppColors.textSecondary;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: bg,
        elevation: 0,
        toolbarHeight: 56,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
              decoration: BoxDecoration(
                gradient: AppColors.mintCyanGradient,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.brandMint.withValues(alpha: 0.3),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Text(
                'DC',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DentaCollab',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Text(
                    'أكاديمية طب الأسنان الرقمي',
                    style: TextStyle(
                      fontSize: 10,
                      color: AppColors.primaryTeal,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'ورش العمل التخصصية',
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            icon: const Icon(Icons.handyman_outlined, size: 20, color: AppColors.primaryTeal),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const WorkshopsScreen()));
            },
          ),
          IconButton(
            tooltip: 'الخدمات والاستشارات الرقمية',
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            icon: const Icon(Icons.layers_outlined, size: 20, color: AppColors.primaryTeal),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ServicesScreen()));
            },
          ),
          IconButton(
            tooltip: 'تبديل المظهر',
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            icon: Icon(
              isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
              size: 20,
              color: AppColors.primaryTeal,
            ),
            onPressed: () {
              ref.read(themeModeProvider.notifier).state =
                  isDark ? ThemeMode.light : ThemeMode.dark;
            },
          ),
          PopupMenuButton<String>(
            icon: Icon(Icons.more_vert, size: 20, color: textColor),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            onSelected: (value) {
              if (value == 'workshops') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const WorkshopsScreen()));
              } else if (value == 'services') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ServicesScreen()));
              } else if (value == 'instructors') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const InstructorsScreen()));
              } else if (value == 'graduates') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const GraduatesScreen()));
              } else if (value == 'assistant') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AssistantScreen()));
              } else if (value == 'gallery') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const GalleryScreen()));
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'gallery',
                child: Row(children: [
                  Icon(Icons.collections_outlined, color: AppColors.brandMint, size: 18),
                  SizedBox(width: 10),
                  Text('معرض التقنيات والأعمال', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                ]),
              ),
              const PopupMenuItem(
                value: 'workshops',
                child: Row(children: [
                  Icon(Icons.handyman_outlined, color: AppColors.brandMint, size: 18),
                  SizedBox(width: 10),
                  Text('ورش العمل التخصصية', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                ]),
              ),
              const PopupMenuItem(
                value: 'services',
                child: Row(children: [
                  Icon(Icons.layers_outlined, color: AppColors.brandMint, size: 18),
                  SizedBox(width: 10),
                  Text('خدمات واستشارات الأكاديمية', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                ]),
              ),
              const PopupMenuItem(
                value: 'instructors',
                child: Row(children: [
                  Icon(Icons.school_outlined, color: AppColors.brandMint, size: 18),
                  SizedBox(width: 10),
                  Text('الكادر التدريبي المعتمد', style: TextStyle(fontSize: 13)),
                ]),
              ),
              const PopupMenuItem(
                value: 'graduates',
                child: Row(children: [
                  Icon(Icons.star_outline, color: AppColors.brandMint, size: 18),
                  SizedBox(width: 10),
                  Text('آراء وتقييمات الخريجين', style: TextStyle(fontSize: 13)),
                ]),
              ),
              const PopupMenuItem(
                value: 'assistant',
                child: Row(children: [
                  Icon(Icons.auto_awesome, color: AppColors.brandMint, size: 18),
                  SizedBox(width: 10),
                  Text('المساعد الأكاديمي الذكي', style: TextStyle(fontSize: 13)),
                ]),
              ),
            ],
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // ─── 1. HERO SLIDER BANNER ───────────────────────────────────
            const HeroSliderBannerWidget(),

            // ─── 2. SPECIALTIES ──────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'استكشف التخصصات',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 96,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: [
                  _buildSpecialtyChip(
                    context,
                    title: 'التصميم الرقمي',
                    badge: 'EXOCAD',
                    badgeBg: AppColors.softMintBg,
                    badgeColor: AppColors.primaryTeal,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textColor: textColor,
                  ),
                  _buildSpecialtyChip(
                    context,
                    title: 'تخطيط الزرعات',
                    badge: 'EXOPLAN',
                    badgeBg: AppColors.softBlueBg,
                    badgeColor: AppColors.info,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textColor: textColor,
                  ),
                  _buildSpecialtyChip(
                    context,
                    title: 'الطباعة ثلاثية الأبعاد',
                    badge: '3D PRINT',
                    badgeBg: AppColors.softPeachBg,
                    badgeColor: AppColors.accentCoral,
                    cardBg: cardBg,
                    borderColor: borderColor,
                    textColor: textColor,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // ─── 3. COURSES (Primary — moved above workshops) ─────────────
            _buildSectionHeader(
              context,
              title: 'الدورات المتاحة',
              actionLabel: 'عرض الكل',
              textColor: textColor,
              onAction: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CoursesScreen()),
              ),
            ),
            const SizedBox(height: 12),

            StreamBuilder<List<CourseModel>>(
              stream: AcademyRepository.streamCourses(),
              builder: (context, snapshot) {
                final allCourses = (snapshot.data ?? const <CourseModel>[])
                    .where((c) => c.isPublished)
                    .take(4)
                    .toList();

                if (allCourses.isEmpty) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 24),
                      child: Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryTeal)),
                    );
                  }
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    child: Center(
                      child: Text('لا توجد دورات متاحة حالياً', style: TextStyle(color: subtextColor)),
                    ),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: allCourses.length,
                  itemBuilder: (context, index) {
                    final course = allCourses[index];
                    final levelAr = _localizeLevel(course.level);
                    final priceStr = _formatPrice(course.priceMinorUnits);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: borderColor),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.05 : 0.06),
                            blurRadius: 14,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(20),
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => CourseDetailScreen(course: course)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Thumbnail
                              ClipRRect(
                                borderRadius: BorderRadius.circular(14),
                                child: AppImageWidget(
                                  imagePathOrUrl: course.image,
                                  width: 88,
                                  height: 88,
                                  fit: BoxFit.cover,
                                  errorWidget: Container(
                                    width: 88,
                                    height: 88,
                                    decoration: BoxDecoration(
                                      color: AppColors.softMintBg,
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: const Icon(Icons.school, color: AppColors.primaryTeal, size: 32),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              // Content
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Badges — Wrap prevents overflow
                                    Wrap(
                                      spacing: 6,
                                      runSpacing: 4,
                                      children: [
                                        _buildBadge(
                                          course.category,
                                          AppColors.softMintBg,
                                          AppColors.primaryTeal,
                                        ),
                                        _buildBadge(
                                          levelAr,
                                          isDark ? AppColors.darkBackground : const Color(0xFFF1F5F9),
                                          subtextColor,
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    // Title — strongest text element
                                    Text(
                                      course.title.ar,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13.5,
                                        color: textColor,
                                        height: 1.35,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 8),
                                    // Bottom row: price + CTA
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            priceStr,
                                            style: const TextStyle(
                                              color: AppColors.primaryTeal,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 13,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                          decoration: BoxDecoration(
                                            color: AppColors.brandMint.withValues(alpha: 0.12),
                                            borderRadius: BorderRadius.circular(10),
                                          ),
                                          child: const Text(
                                            'عرض التفاصيل ←',
                                            style: TextStyle(
                                              color: AppColors.primaryTeal,
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
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

            const SizedBox(height: 28),

            // ─── 4. WORKSHOPS ─────────────────────────────────────────────
            _buildSectionHeader(
              context,
              title: 'ورش العمل القادمة',
              actionLabel: 'عرض الكل',
              textColor: textColor,
              onAction: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const WorkshopsScreen()),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 190,
              child: StreamBuilder<List<WorkshopModel>>(
                stream: AcademyRepository.streamWorkshops(),
                builder: (context, snapshot) {
                  final workshops = snapshot.data ?? const <WorkshopModel>[];
                  if (workshops.isEmpty) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryTeal));
                    }
                    return Center(
                      child: Text('لا توجد ورش عمل قادمة حالياً', style: TextStyle(color: subtextColor)),
                    );
                  }

                  return ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: workshops.length,
                    itemBuilder: (context, index) {
                      final workshop = workshops[index];
                      final seatsLeft = workshop.maxCapacity - workshop.reservedSeats;
                      final hasCapacityData = workshop.maxCapacity > 0;

                      return Container(
                        width: 272,
                        margin: const EdgeInsets.symmetric(horizontal: 6),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.05 : 0.04),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(20),
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const WorkshopsScreen()),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // 1. Title — up to 2 lines
                              Text(
                                workshop.title.ar,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: textColor,
                                  height: 1.3,
                                ),
                              ),
                              const SizedBox(height: 6),
                              // 2. Instructor
                              Row(
                                children: [
                                  Icon(Icons.person_outline, size: 13, color: subtextColor),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      workshop.instructor,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(fontSize: 11.5, color: subtextColor),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              // 3. Date
                              if (workshop.date.isNotEmpty)
                                Row(
                                  children: [
                                    Icon(Icons.calendar_today_outlined, size: 12, color: subtextColor),
                                    const SizedBox(width: 4),
                                    Expanded(
                                      child: Text(
                                        workshop.date,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(fontSize: 11, color: subtextColor),
                                      ),
                                    ),
                                  ],
                                ),
                              // 4. Time on separate line
                              if (workshop.time.isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    Icon(Icons.access_time_outlined, size: 12, color: subtextColor),
                                    const SizedBox(width: 4),
                                    Text(
                                      workshop.time,
                                      style: TextStyle(fontSize: 11, color: subtextColor),
                                    ),
                                  ],
                                ),
                              ],
                              const Spacer(),
                              // 5. Bottom row: seats | price + CTA
                              Row(
                                children: [
                                  if (hasCapacityData)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: seatsLeft > 0
                                            ? AppColors.brandMint.withValues(alpha: 0.15)
                                            : Colors.red.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        seatsLeft > 0 ? 'متبقي $seatsLeft مقاعد' : 'اكتملت المقاعد',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: seatsLeft > 0 ? AppColors.brandMint : Colors.redAccent,
                                        ),
                                      ),
                                    ),
                                  if (hasCapacityData) const SizedBox(width: 6),
                                  if (workshop.price.isNotEmpty)
                                    Text(
                                      workshop.price,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                        color: AppColors.primaryTeal,
                                      ),
                                    ),
                                  const Spacer(),
                                  const Text(
                                    'تفاصيل وحجز ←',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.primaryTeal,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),

            const SizedBox(height: 28),

            // ─── 5. INSTRUCTORS ───────────────────────────────────────────
            _buildSectionHeader(
              context,
              title: 'تعرّف على المدربين',
              actionLabel: 'عرض الكل',
              textColor: textColor,
              onAction: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const InstructorsScreen()),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 158,
              child: StreamBuilder<List<InstructorModel>>(
                stream: AcademyRepository.streamInstructors(),
                builder: (context, snapshot) {
                  final instructors = snapshot.data ?? const <InstructorModel>[];
                  if (instructors.isEmpty) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryTeal));
                    }
                    return Center(
                      child: Text('لا يوجد مدربون حالياً', style: TextStyle(color: subtextColor)),
                    );
                  }
                  return ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: instructors.length,
                    itemBuilder: (context, index) {
                      final inst = instructors[index];
                      return GestureDetector(
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => InstructorProfileScreen(instructor: inst)),
                        ),
                        child: Container(
                          width: 220,
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: borderColor),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.05 : 0.05),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Header: avatar + name + role
                              Row(
                                children: [
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      gradient: AppColors.mintCyanGradient,
                                      borderRadius: BorderRadius.circular(14),
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppColors.brandMint.withValues(alpha: 0.25),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(14),
                                      child: inst.image.isNotEmpty
                                          ? AppImageWidget(
                                              imagePathOrUrl: inst.image,
                                              width: 44,
                                              height: 44,
                                              fit: BoxFit.cover,
                                              errorWidget: const Center(
                                                child: Icon(Icons.person, color: Colors.white, size: 22),
                                              ),
                                            )
                                          : const Center(
                                              child: Icon(Icons.person, color: Colors.white, size: 22),
                                            ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          inst.name.ar,
                                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textColor),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          inst.role,
                                          style: const TextStyle(color: AppColors.primaryTeal, fontSize: 10, fontWeight: FontWeight.w600),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              // Specialty title — up to 2 lines
                              Expanded(
                                child: Text(
                                  inst.title.ar,
                                  style: TextStyle(color: subtextColor, fontSize: 11, height: 1.4),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(height: 8),
                              // CTA — phone removed from home preview
                              Align(
                                alignment: AlignmentDirectional.centerEnd,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryTeal.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(9),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        'عرض الملف',
                                        style: TextStyle(color: AppColors.primaryTeal, fontSize: 10.5, fontWeight: FontWeight.bold),
                                      ),
                                      SizedBox(width: 3),
                                      Icon(Icons.arrow_forward_ios, size: 8, color: AppColors.primaryTeal),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),

            const SizedBox(height: 28),

            // ─── 6. GALLERY (last — reduced dominance) ────────────────────
            _buildSectionHeader(
              context,
              title: 'من أعمال الأكاديمية',
              actionLabel: 'عرض الكل',
              textColor: textColor,
              onAction: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const GalleryScreen()),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 210,
              child: StreamBuilder<List<GalleryAlbumModel>>(
                stream: AcademyRepository.streamGallery(),
                builder: (context, snapshot) {
                  final albums = snapshot.data ?? const <GalleryAlbumModel>[];
                  if (albums.isEmpty) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryTeal));
                    }
                    return Center(
                      child: Text('لا توجد أعمال في المعرض حالياً', style: TextStyle(color: subtextColor)),
                    );
                  }

                  return ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: albums.length,
                    itemBuilder: (context, index) {
                      final album = albums[index];
                      final images = album.images;
                      final imageCount = images.length;

                      return Container(
                        width: 260,
                        margin: const EdgeInsets.symmetric(horizontal: 6),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.05 : 0.04),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(20),
                          onTap: () {
                            if (images.isNotEmpty) {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => GalleryPhotoViewer(album: album, initialIndex: 0),
                                ),
                              );
                            } else {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => const GalleryScreen()));
                            }
                          },
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Cover — ~16:9 for 260 width = 146 height
                              Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(19)),
                                    child: AppImageWidget(
                                      imagePathOrUrl: images.isNotEmpty ? images.first : '',
                                      height: 146,
                                      width: double.infinity,
                                      fit: BoxFit.cover,
                                      errorWidget: Container(
                                        height: 146,
                                        color: AppColors.softMintBg,
                                        child: const Icon(Icons.collections, color: AppColors.primaryTeal, size: 36),
                                      ),
                                    ),
                                  ),
                                  // Category badge
                                  Positioned(
                                    top: 8,
                                    right: 8,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withValues(alpha: 0.65),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        album.category,
                                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ),
                                  // Image count badge
                                  if (imageCount > 0)
                                    Positioned(
                                      bottom: 8,
                                      left: 8,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: AppColors.primaryTeal.withValues(alpha: 0.9),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(Icons.photo_library_outlined, size: 11, color: Colors.white),
                                            const SizedBox(width: 4),
                                            Text(
                                              '$imageCount صور',
                                              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              // Album title + CTA (thumbnail strip removed from home)
                              Padding(
                                padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        album.title.ar,
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Text(
                                      'عرض المعرض ←',
                                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryTeal),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),

            // Bottom padding — clears bottom navigation bar safely
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  // ── Section header ─────────────────────────────────────────────────────────
  Widget _buildSectionHeader(
    BuildContext context, {
    required String title,
    String? actionLabel,
    VoidCallback? onAction,
    required Color textColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
          if (actionLabel != null && onAction != null)
            GestureDetector(
              onTap: onAction,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                child: Text(
                  '$actionLabel ←',
                  style: const TextStyle(color: AppColors.primaryTeal, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
            ),
        ],
      ),
    );
  }

  // ── Badge ──────────────────────────────────────────────────────────────────
  Widget _buildBadge(String label, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Text(label, style: TextStyle(color: fg, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  // ── Specialty chip ─────────────────────────────────────────────────────────
  Widget _buildSpecialtyChip(
    BuildContext context, {
    required String title,
    required String badge,
    required Color badgeBg,
    required Color badgeColor,
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
  }) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CoursesScreen())),
      child: Container(
        constraints: const BoxConstraints(minWidth: 110, maxWidth: 160),
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: badgeColor.withValues(alpha: 0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(color: badgeBg, borderRadius: BorderRadius.circular(8)),
              child: Text(badge, style: TextStyle(color: badgeColor, fontSize: 9, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: textColor),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
