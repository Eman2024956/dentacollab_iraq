import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/theme/app_colors.dart';
import 'widgets/service_request_sheet.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  final List<Map<String, dynamic>> defaultServices = const [
    {
      'id': 'service_exocad_design',
      'title': 'خدمات التصميم الرقمي واستشارات Exocad',
      'subtitle': 'تصميم التيجان والجسور والابتسامة الرقمية (Digital Smile Design)',
      'description': 'استشارات تخصصية وتصميم حالات معقدة للعيادات والمختبرات وفق أعلى معايير الدقة والجمالية.',
      'badge': 'التصميم الرقمي',
      'icon': Icons.architecture,
      'turnaround': 'خلال ٢٤ - ٤٨ ساعة',
    },
    {
      'id': 'service_exoplan_guides',
      'title': 'تخطيط الزرعات وتصميم الأدلة الجراحية (Exoplan)',
      'subtitle': 'تخطيط موجه بالكمبيوتر استناداً إلى صور CBCT والموديلات الرقمية',
      'description': 'تصميم أدلة جراحية موجهة تضمن دقة غرس الزرعات وتقليل زمن الجراحة والألم للمريض.',
      'badge': 'زرعات موجهة',
      'icon': Icons.medical_services,
      'turnaround': 'خلال ٤٨ ساعة',
    },
    {
      'id': 'service_3d_printing',
      'title': 'طباعة النماذج ثلاثية الأبعاد ومعايرة الراتنجات',
      'subtitle': 'طباعة نماذج دقيقة وأدلة جراحية براتنجات حيوية معتمدة',
      'description': 'تحويل ملفات الـ STL إلى منتجات مطبوعة جاهزة للاستخدام السريري مع معالجة ضوئية متقدمة.',
      'badge': 'طباعة 3D',
      'icon': Icons.print,
      'turnaround': 'نفس اليوم / ٢٤ ساعة',
    },
  ];

  void _openRequestSheet(BuildContext context, String serviceTitle, String serviceId) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: isDark ? AppColors.darkCard : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) => ServiceRequestSheet(
        serviceTitle: serviceTitle,
        serviceId: serviceId,
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    if (category.contains('زرع') || category.toLowerCase().contains('exoplan')) {
      return Icons.medical_services;
    }
    if (category.contains('طباعة') || category.toLowerCase().contains('print')) {
      return Icons.print;
    }
    return Icons.architecture;
  }

  FirebaseFirestore get _firestore {
    try {
      return FirebaseFirestore.instanceFor(
        app: Firebase.app(),
        databaseId: 'dentacollab',
      );
    } catch (_) {
      return FirebaseFirestore.instance;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('خدمات واستشارات الأكاديمية', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: _firestore.collection('services').snapshots(),
        builder: (context, snapshot) {
          List<Map<String, dynamic>> displayServices = [];

          if (snapshot.hasData && snapshot.data!.docs.isNotEmpty) {
            displayServices = snapshot.data!.docs.map((doc) {
              final data = doc.data() as Map<String, dynamic>;
              String title = '';
              if (data['title'] is Map) {
                title = data['title']['ar'] ?? data['title']['en'] ?? '';
              } else {
                title = data['title']?.toString() ?? '';
              }

              String description = '';
              if (data['description'] is Map) {
                description = data['description']['ar'] ?? data['description']['en'] ?? '';
              } else {
                description = data['description']?.toString() ?? '';
              }

              String summary = '';
              if (data['summary'] is Map) {
                summary = data['summary']['ar'] ?? data['summary']['en'] ?? '';
              } else {
                summary = data['summary']?.toString() ?? '';
              }

              String turnaround = '';
              if (data['turnaroundSummary'] is Map) {
                turnaround = data['turnaroundSummary']['ar'] ?? data['turnaroundSummary']['en'] ?? '';
              } else {
                turnaround = data['turnaroundSummary']?.toString() ?? '٢٤ - ٤٨ ساعة';
              }

              final category = data['category']?.toString() ?? 'خدمة رقمية';
              final imageUrl = (data['imageUrl'] ?? data['image'] ?? '').toString();

              return {
                'id': doc.id,
                'title': title.isNotEmpty ? title : 'خدمة رقمية',
                'subtitle': summary.isNotEmpty ? summary : category,
                'description': description.isNotEmpty ? description : 'خدمة معتمدة من مختبر DentaCollab',
                'badge': category,
                'icon': _getCategoryIcon(category),
                'turnaround': turnaround.isNotEmpty ? turnaround : 'خلال ٢٤ - ٤٨ ساعة',
                'imageUrl': imageUrl,
              };
            }).toList();
          }

          if (displayServices.isEmpty) {
            displayServices = defaultServices;
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Banner
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: isDark
                      ? const LinearGradient(
                          colors: [AppColors.primaryNavy, AppColors.darkCard],
                          begin: Alignment.topRight,
                          end: Alignment.bottomLeft,
                        )
                      : const LinearGradient(
                          colors: [AppColors.primaryTeal, AppColors.brandMint],
                          begin: Alignment.topRight,
                          end: Alignment.bottomLeft,
                        ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryTeal.withValues(alpha: 0.25),
                      blurRadius: 18,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'استشارات طب الأسنان الرقمي في بغداد',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.5, color: Colors.white),
                    ),
                    SizedBox(height: 6),
                    Text(
                      'يقدم كادر DentaCollab المتخصص دعماً تقنياً وسريرياً متكاملاً لأطباء ومختبرات الأسنان في تصميم الحالات وتخطيط الجراحة الموجهة وطباعة النماذج.',
                      style: TextStyle(color: Colors.white70, fontSize: 12.5, height: 1.55),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'قائمة الخدمات المتاحة',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  if (snapshot.connectionState == ConnectionState.active)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.primaryTeal.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.cloud_done, size: 13, color: AppColors.primaryTeal),
                          SizedBox(width: 4),
                          Text('محدث مباشر', style: TextStyle(color: AppColors.primaryTeal, fontSize: 10.5, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 14),

              ...displayServices.map((item) {
                final String? imgUrl = item['imageUrl']?.toString();
                final bool hasImg = imgUrl != null && imgUrl.isNotEmpty && imgUrl.startsWith('http');

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
                      if (hasImg) ...[
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: AspectRatio(
                            aspectRatio: 16 / 9,
                            child: Image.network(
                              imgUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
                              loadingBuilder: (context, child, loadingProgress) {
                                if (loadingProgress == null) return child;
                                return Container(
                                  color: isDark ? AppColors.darkCard : AppColors.softMintBg,
                                  child: const Center(
                                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryTeal),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                      ],
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.brandMint.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              item['badge'],
                              style: const TextStyle(color: AppColors.primaryTeal, fontSize: 10.5, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const Spacer(),
                          Row(
                            children: [
                              Icon(Icons.schedule, size: 13, color: subtitleColor),
                              const SizedBox(width: 4),
                              Text(item['turnaround'], style: TextStyle(color: subtitleColor, fontSize: 11)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        item['title'],
                        style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.bold, color: textColor),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item['subtitle'],
                        style: const TextStyle(color: AppColors.primaryTeal, fontSize: 11.5, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        item['description'],
                        style: TextStyle(color: subtitleColor, fontSize: 12.5, height: 1.45),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 46,
                        child: ElevatedButton.icon(
                          onPressed: () => _openRequestSheet(context, item['title'], item['id']),
                          icon: const Icon(Icons.send_outlined, size: 16),
                          label: const Text('طلب الخدمة أو الاستشارة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryTeal,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(23)),
                            elevation: 0,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}
