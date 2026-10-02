import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/models/app_models.dart';

class WorkshopsScreen extends StatefulWidget {
  const WorkshopsScreen({super.key});

  @override
  State<WorkshopsScreen> createState() => _WorkshopsScreenState();
}

class _WorkshopsScreenState extends State<WorkshopsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text.trim();
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showBookingSheet(BuildContext context, WorkshopModel workshop) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final remaining = workshop.maxCapacity - workshop.reservedSeats;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: isDark ? AppColors.darkCard : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primaryTeal.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.handyman_outlined,
                        color: AppColors.primaryTeal,
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            workshop.title.ar,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            workshop.instructor,
                            style: TextStyle(
                              color: isDark ? Colors.white60 : AppColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Divider(),
                const SizedBox(height: 12),
                _buildInfoRow(Icons.calendar_today_outlined, 'الموعد', workshop.date),
                const SizedBox(height: 10),
                _buildInfoRow(Icons.access_time_outlined, 'التوقيت', workshop.time),
                const SizedBox(height: 10),
                _buildInfoRow(Icons.location_on_outlined, 'المكان', workshop.venue.ar),
                const SizedBox(height: 10),
                _buildInfoRow(Icons.payments_outlined, 'رسوم المشاركة', workshop.price),
                const SizedBox(height: 10),
                _buildInfoRow(
                  Icons.event_seat_outlined,
                  'المقاعد المتبقية',
                  remaining > 0 ? '$remaining من أصل ${workshop.maxCapacity} مقعد' : 'اكتمل العدد',
                  valueColor: remaining > 0 ? AppColors.brandMint : Colors.redAccent,
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'تم تسجيل اهتمامك في "${workshop.title.ar}". سيتواصل معك منسق الأكاديمية لتأكيد الحجز.',
                          ),
                          backgroundColor: const Color(0xFF1E293B),
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryTeal,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'تأكيد طلب حجز المقعد',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, {Color? valueColor}) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.primaryTeal),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: const TextStyle(fontSize: 12.5, color: Colors.grey),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: bg,
        elevation: 0,
        title: Text(
          'ورش العمل التخصصية',
          style: TextStyle(fontWeight: FontWeight.bold, color: textColor),
        ),
      ),
      body: StreamBuilder<List<WorkshopModel>>(
        stream: AcademyRepository.streamWorkshops(),
        builder: (context, snapshot) {
          final allWorkshops = (snapshot.data ?? const <WorkshopModel>[])
              .where((w) => w.isPublished)
              .toList();
          final filtered = allWorkshops.where((w) {
            if (_searchQuery.isEmpty) return true;
            final q = _searchQuery.toLowerCase();
            return w.title.ar.toLowerCase().contains(q) ||
                w.title.en.toLowerCase().contains(q) ||
                w.instructor.toLowerCase().contains(q) ||
                w.venue.ar.toLowerCase().contains(q);
          }).toList();

          return Column(
            children: [
              // Search Toolbar
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
                child: Container(
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _searchQuery.isNotEmpty
                          ? AppColors.primaryTeal
                          : borderColor,
                      width: _searchQuery.isNotEmpty ? 1.5 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: TextField(
                    controller: _searchController,
                    style: TextStyle(color: textColor, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'ابحث عن ورشة عمل، مدرب أو موقع...',
                      hintStyle: TextStyle(
                        color: subtitleColor.withValues(alpha: 0.7),
                        fontSize: 13,
                      ),
                      prefixIcon: Icon(
                        Icons.search_rounded,
                        color: _searchQuery.isNotEmpty
                            ? AppColors.primaryTeal
                            : subtitleColor,
                        size: 22,
                      ),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              color: subtitleColor,
                              onPressed: () => _searchController.clear(),
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                    ),
                  ),
                ),
              ),

              // Workshops List
              Expanded(
                child: filtered.isEmpty
                    ? Center(
                        child: Text(
                          _searchQuery.isNotEmpty
                              ? 'لا توجد ورش مطابقة لبحثك'
                              : 'لا توجد ورش عمل متاحة حالياً',
                          style: TextStyle(color: subtitleColor),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final workshop = filtered[index];
                          final capacityPercent = workshop.maxCapacity > 0
                              ? (workshop.reservedSeats / workshop.maxCapacity).clamp(0.0, 1.0)
                              : 0.0;
                          final seatsLeft = workshop.maxCapacity - workshop.reservedSeats;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: borderColor),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.06 : 0.05),
                                  blurRadius: 16,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(18),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.brandMint.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Text(
                                          'ورشة عمل تطبيقية',
                                          style: TextStyle(
                                            color: AppColors.primaryTeal,
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      const Spacer(),
                                      Text(
                                        workshop.price,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14,
                                          color: AppColors.primaryTeal,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    workshop.title.ar,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: textColor,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    workshop.title.en,
                                    style: TextStyle(
                                      fontSize: 11.5,
                                      fontFamily: 'monospace',
                                      color: subtitleColor,
                                    ),
                                  ),
                                  const SizedBox(height: 14),
                                  // Instructor & Venue
                                  Row(
                                    children: [
                                      Icon(Icons.person_outline, size: 16, color: subtitleColor),
                                      const SizedBox(width: 6),
                                      Text(
                                        workshop.instructor,
                                        style: TextStyle(fontSize: 12, color: textColor),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(Icons.location_on_outlined, size: 16, color: subtitleColor),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: Text(
                                          workshop.venue.ar,
                                          style: TextStyle(fontSize: 12, color: subtitleColor),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(Icons.calendar_today_outlined, size: 16, color: subtitleColor),
                                      const SizedBox(width: 6),
                                      Text(
                                        '${workshop.date}  •  ${workshop.time}',
                                        style: TextStyle(fontSize: 12, color: subtitleColor),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  // Capacity Progress
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            seatsLeft > 0 ? 'المقاعد المتبقية: $seatsLeft' : 'اكتملت المقاعد',
                                            style: TextStyle(
                                              fontSize: 11.5,
                                              fontWeight: FontWeight.bold,
                                              color: seatsLeft > 0 ? AppColors.brandMint : Colors.redAccent,
                                            ),
                                          ),
                                          Text(
                                            '${workshop.reservedSeats}/${workshop.maxCapacity}',
                                            style: TextStyle(fontSize: 11, color: subtitleColor),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(4),
                                        child: LinearProgressIndicator(
                                          value: capacityPercent,
                                          backgroundColor: isDark ? AppColors.primaryNavy : AppColors.softMintBg,
                                          valueColor: AlwaysStoppedAnimation<Color>(
                                            capacityPercent >= 0.9 ? Colors.amber : AppColors.brandMint,
                                          ),
                                          minHeight: 6,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 44,
                                    child: OutlinedButton(
                                      onPressed: () => _showBookingSheet(context, workshop),
                                      style: OutlinedButton.styleFrom(
                                        side: const BorderSide(color: AppColors.primaryTeal),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(14),
                                        ),
                                      ),
                                      child: const Text(
                                        'حجز مقعد أو استفسار',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.primaryTeal,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}
