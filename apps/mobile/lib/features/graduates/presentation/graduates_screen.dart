import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/models/app_models.dart';
import '../../../core/widgets/app_image_widget.dart';

class GraduatesScreen extends StatefulWidget {
  const GraduatesScreen({super.key});

  @override
  State<GraduatesScreen> createState() => _GraduatesScreenState();
}

class _GraduatesScreenState extends State<GraduatesScreen> {
  String _selectedFilter = 'all';

  @override
  Widget build(BuildContext context) {
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
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: textColor, size: 18),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'آراء وتقييمات الخريجين',
          style: TextStyle(
            color: textColor,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: StreamBuilder<List<GraduateModel>>(
        stream: AcademyRepository.streamGraduates(),
        builder: (context, snapshot) {
          final graduates = snapshot.data ?? const <GraduateModel>[];

          final filtered = _selectedFilter == 'all'
              ? graduates
              : graduates.where((g) => g.courseId.contains(_selectedFilter)).toList();

          return CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
            slivers: [
              // Header Summary Card (Medical Mint Porcelain Banner)
              SliverToBoxAdapter(
                child: Container(
                  margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: isDark
                        ? AppColors.heroBannerDarkGradient
                        : AppColors.heroBannerGradient,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.brandMint.withValues(alpha: 0.25),
                        blurRadius: 18,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.verified, size: 14, color: Colors.white),
                                SizedBox(width: 4),
                                Text(
                                  'تجارب حقيقية موثقة',
                                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                          const Row(
                            children: [
                              Icon(Icons.star_rounded, color: Colors.amber, size: 18),
                              SizedBox(width: 4),
                              Text(
                                '5.0 / 5.0',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        'أطباء متخرجون ينقلون تجاربهم',
                        style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'شهادات حقيقية من نخبة أطباء الأسنان ومسؤولي المختبرات في العراق بعد إكمال التدريب الميداني المعتمد.',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 12, height: 1.5),
                      ),
                    ],
                  ),
                ),
              ),

              // Filter Chips (Pill shape inspired by Image 1)
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 42,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    children: [
                      _buildFilterChip('الكل', 'all', isDark),
                      const SizedBox(width: 8),
                      _buildFilterChip('Exocad', 'exocad', isDark),
                      const SizedBox(width: 8),
                      _buildFilterChip('Exoplan', 'implant', isDark),
                      const SizedBox(width: 8),
                      _buildFilterChip('الطباعة ثلاثية الأبعاد', 'printing', isDark),
                    ],
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 16)),

              // Graduates Cards List
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final item = filtered[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 14),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: borderColor),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.05 : 0.06),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(24),
                          onTap: () => _showGraduateDetailsSheet(context, item, isDark),
                          child: Padding(
                            padding: const EdgeInsets.all(18),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Doctor header
                                Row(
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        gradient: const LinearGradient(
                                          colors: [AppColors.brandMint, AppColors.info],
                                          begin: Alignment.topLeft,
                                          end: Alignment.bottomRight,
                                        ),
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(
                                            color: AppColors.brandMint.withValues(alpha: 0.3),
                                            blurRadius: 8,
                                            offset: const Offset(0, 3),
                                          ),
                                        ],
                                      ),
                                      child: ClipOval(
                                        child: item.image.isNotEmpty
                                            ? AppImageWidget(
                                                imagePathOrUrl: item.image,
                                                width: 48,
                                                height: 48,
                                                fit: BoxFit.cover,
                                                errorWidget: Center(
                                                  child: Text(
                                                    item.name.ar.isNotEmpty
                                                        ? item.name.ar.split(' ').map((s) => s.isNotEmpty ? s[0] : '').take(2).join()
                                                        : 'د',
                                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                                  ),
                                                ),
                                              )
                                            : Center(
                                                child: Text(
                                                  item.name.ar.isNotEmpty
                                                      ? item.name.ar.split(' ').map((s) => s.isNotEmpty ? s[0] : '').take(2).join()
                                                      : 'د',
                                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                                ),
                                              ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.name.ar,
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 14,
                                              color: textColor,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            '${item.profession} • ${item.city}',
                                            style: TextStyle(
                                              color: subtextColor,
                                              fontSize: 11,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    // Rating Stars
                                    Row(
                                      children: List.generate(
                                        5,
                                        (starIndex) => Icon(
                                          Icons.star_rounded,
                                          size: 16,
                                          color: starIndex < item.rating ? Colors.amber : Colors.grey.shade300,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),

                                // Quote
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isDark ? AppColors.darkBackground : AppColors.softMintBg,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Text(
                                    '"${item.quote.ar}"',
                                    style: TextStyle(
                                      color: textColor.withValues(alpha: 0.9),
                                      fontSize: 12,
                                      height: 1.5,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),

                                // Course Tag and Date
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: AppColors.brandMint.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        item.courseTitle.ar,
                                        style: const TextStyle(
                                          color: AppColors.primaryTeal,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    Row(
                                      children: [
                                        Text(
                                          item.graduationDate,
                                          style: TextStyle(
                                            color: subtextColor,
                                            fontSize: 10,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        const Icon(Icons.arrow_forward_ios_rounded, size: 11, color: AppColors.primaryTeal),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                    childCount: filtered.length,
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 30)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, bool isDark) {
    final isSelected = _selectedFilter == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.brandMint
              : (isDark ? AppColors.darkCard : Colors.white),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.brandMint : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.brandMint.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : (isDark ? Colors.white70 : AppColors.textPrimary),
            ),
          ),
        ),
      ),
    );
  }

  void _showGraduateDetailsSheet(BuildContext context, GraduateModel item, bool isDark) {
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtextColor = isDark ? Colors.white70 : AppColors.textSecondary;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF071224) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.35),
              blurRadius: 25,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Drag handle
            Container(
              width: 44,
              height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: Colors.grey.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Graduate Avatar with Medical Glow & Verified Badge
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.brandMint, AppColors.primaryTeal],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.brandMint.withValues(alpha: 0.4),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: item.image.isNotEmpty
                        ? AppImageWidget(
                            imagePathOrUrl: item.image,
                            width: 90,
                            height: 90,
                            fit: BoxFit.cover,
                            errorWidget: Center(
                              child: Text(
                                item.name.ar.isNotEmpty
                                    ? item.name.ar.split(' ').map((s) => s.isNotEmpty ? s[0] : '').take(2).join()
                                    : 'د',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 24),
                              ),
                            ),
                          )
                        : Center(
                            child: Text(
                              item.name.ar.isNotEmpty
                                  ? item.name.ar.split(' ').map((s) => s.isNotEmpty ? s[0] : '').take(2).join()
                                  : 'د',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 24),
                            ),
                          ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.verified_rounded,
                    color: AppColors.primaryTeal,
                    size: 22,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Doctor Name
            Text(
              item.name.ar,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
              textAlign: TextAlign.center,
            ),
            if (item.name.en.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                item.name.en,
                style: TextStyle(
                  fontSize: 12,
                  color: subtextColor,
                  fontFamily: 'monospace',
                ),
                textAlign: TextAlign.center,
              ),
            ],
            const SizedBox(height: 10),

            // Profession & City Badges
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (item.profession.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryTeal.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      item.profession,
                      style: const TextStyle(
                        color: AppColors.primaryTeal,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                if (item.city.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkBackground : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      item.city,
                      style: TextStyle(
                        color: subtextColor,
                        fontSize: 11,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 14),

            // Rating Stars
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                5,
                (i) => Icon(
                  Icons.star_rounded,
                  size: 22,
                  color: i < item.rating ? Colors.amber : Colors.grey.shade300,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Completed Course Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0D1C34) : AppColors.softMintBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.brandMint.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryTeal.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.school, size: 18, color: AppColors.primaryTeal),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'الدورة التدريبية المعتمدة',
                          style: TextStyle(fontSize: 10, color: AppColors.primaryTeal, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          item.courseTitle.ar,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (item.graduationDate.isNotEmpty)
                    Text(
                      item.graduationDate,
                      style: TextStyle(fontSize: 10, color: subtextColor),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Testimonial Quote
            if (item.quote.ar.isNotEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.format_quote_rounded, color: AppColors.brandMint, size: 20),
                        SizedBox(width: 4),
                        Text(
                          'تقييم وتجربة الخريج',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryTeal),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '"${item.quote.ar}"',
                      style: TextStyle(
                        color: textColor.withValues(alpha: 0.9),
                        fontSize: 12.5,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 20),

            // Close button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text('إغلاق', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
