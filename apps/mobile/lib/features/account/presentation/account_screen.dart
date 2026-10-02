import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/models/app_models.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/widgets/app_image_widget.dart';
import '../../courses/presentation/course_detail_screen.dart';
import '../../auth/presentation/auth_screen.dart';

class AccountScreen extends ConsumerStatefulWidget {
  const AccountScreen({super.key});

  @override
  ConsumerState<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends ConsumerState<AccountScreen> {
  // Notification preference toggles
  bool _notifyCourseReminders = true;
  bool _notifyWorkshops = true;
  bool _notifyServiceUpdates = true;
  bool _notifyOffers = false;

  // Selected language
  String _selectedLanguage = 'ar';

  // ===========================================================================
  // 1. EDIT PROFILE (تعديل الملف الشخصي)
  // ===========================================================================
  void _showEditProfileSheet(BuildContext context, User user, UserProfileModel currentProfile) {
    final nameCtrl = TextEditingController(
      text: currentProfile.name.isNotEmpty ? currentProfile.name : (user.displayName ?? ''),
    );
    final phoneCtrl = TextEditingController(
      text: currentProfile.phone.isNotEmpty ? currentProfile.phone : (user.phoneNumber ?? ''),
    );
    String selectedCity = currentProfile.city.isNotEmpty ? currentProfile.city : 'بغداد';
    String selectedProfession = currentProfile.profession.isNotEmpty ? currentProfile.profession : 'طبيب أسنان';
    final photoCtrl = TextEditingController(
      text: currentProfile.photoUrl.isNotEmpty ? currentProfile.photoUrl : (user.photoURL ?? ''),
    );

    final cities = ['بغداد', 'أربيل', 'البصرة', 'النجف الأشرف', 'كربلاء المقدسة', 'الموصل', 'السليمانية', 'بابل'];
    final professions = [
      'طبيب أسنان عام',
      'أخصائي جراحة وزراعة الأسنان',
      'أخصائي تقويم الأسنان',
      'أخصائي تجميل وتعويضات سنية',
      'تقني مختبر أسنان (Dental Technician)',
      'طالب في كلية طب الأسنان',
      'طبيب مقيم دوري',
    ];

    if (!cities.contains(selectedCity)) {
      selectedCity = cities.first;
    }
    if (!professions.contains(selectedProfession)) {
      selectedProfession = professions.first;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (sheetCtx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(sheetCtx).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Container(
                        width: 44,
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.grey.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.brandMint.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.person_pin_rounded, color: AppColors.primaryTeal),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'تعديل الملف الشخصي',
                                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'الاسم، رقم الهاتف، المدينة، والتخصص المهني',
                                style: TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Avatar preview
                    Center(
                      child: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          Container(
                            width: 82,
                            height: 82,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [AppColors.brandMint, AppColors.primaryTeal],
                              ),
                              border: Border.all(color: AppColors.brandMint, width: 2.5),
                            ),
                            child: ClipOval(
                              child: photoCtrl.text.trim().isNotEmpty
                                  ? AppImageWidget(
                                      imagePathOrUrl: photoCtrl.text.trim(),
                                      fit: BoxFit.cover,
                                    )
                                  : Center(
                                      child: Text(
                                        nameCtrl.text.isNotEmpty ? nameCtrl.text[0].toUpperCase() : 'D',
                                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                                      ),
                                    ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: AppColors.primaryTeal,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.camera_alt, size: 14, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Full Name
                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(
                        labelText: 'الاسم الكامل',
                        prefixIcon: Icon(Icons.person_outline),
                        border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(14))),
                      ),
                      onChanged: (_) => setSheetState(() {}),
                    ),
                    const SizedBox(height: 14),

                    // Phone
                    TextField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'رقم الهاتف (WhatsApp)',
                        hintText: '+964 780 000 0000',
                        prefixIcon: Icon(Icons.phone_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(14))),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // City dropdown
                    DropdownButtonFormField<String>(
                      initialValue: selectedCity,
                      decoration: const InputDecoration(
                        labelText: 'المدينة / المحافظة',
                        prefixIcon: Icon(Icons.location_city_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(14))),
                      ),
                      items: cities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedCity = val);
                      },
                    ),
                    const SizedBox(height: 14),

                    // Profession dropdown
                    DropdownButtonFormField<String>(
                      initialValue: selectedProfession,
                      decoration: const InputDecoration(
                        labelText: 'المهنة والتخصص الأكاديمي',
                        prefixIcon: Icon(Icons.medical_services_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(14))),
                      ),
                      items: professions.map((p) => DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(fontSize: 13)))).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedProfession = val);
                      },
                    ),
                    const SizedBox(height: 14),

                    // Photo URL (optional)
                    TextField(
                      controller: photoCtrl,
                      decoration: const InputDecoration(
                        labelText: 'رابط الصورة الشخصية (اختياري)',
                        prefixIcon: Icon(Icons.image_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(14))),
                      ),
                      onChanged: (_) => setSheetState(() {}),
                    ),
                    const SizedBox(height: 22),

                    // Save Button
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryTeal,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      icon: const Icon(Icons.check_circle_outline, size: 20),
                      label: const Text('حفظ التعديلات', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      onPressed: () async {
                        final newName = nameCtrl.text.trim();
                        final newPhone = phoneCtrl.text.trim();
                        final newPhoto = photoCtrl.text.trim();

                        final updated = UserProfileModel(
                          name: newName,
                          phone: newPhone,
                          city: selectedCity,
                          profession: selectedProfession,
                          photoUrl: newPhoto,
                          savedCourseIds: currentProfile.savedCourseIds,
                        );

                        await AcademyRepository.saveUserProfile(user.uid, updated);
                        if (newName.isNotEmpty) {
                          await user.updateDisplayName(newName);
                        }
                        if (newPhoto.isNotEmpty) {
                          await user.updatePhotoURL(newPhoto);
                        }

                        if (context.mounted) {
                          Navigator.pop(sheetCtx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              backgroundColor: AppColors.success,
                              content: Text('تم تحديث الملف الشخصي بنجاح ✓'),
                            ),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ===========================================================================
  // 2. MY CERTIFICATES (شهاداتي)
  // ===========================================================================
  void _showCertificatesSheet(BuildContext context, String uid) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StreamBuilder<List<UserCertificateModel>>(
          stream: AcademyRepository.streamCertificates(uid),
          builder: (context, snapshot) {
            final certs = snapshot.data ?? const <UserCertificateModel>[];
            return Container(
              padding: const EdgeInsets.all(20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.brandMint.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.workspace_premium, color: AppColors.primaryTeal),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('شهاداتي المعتمدة', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                            Text('الشهادات الصادرة من برامج وورش عمل دنتكولاب', style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Expanded(
                    child: certs.isEmpty
                        ? const Center(
                            child: Text('لا توجد شهادات صادرة حالياً. أكمل دوراتك لتنال الاعتماد!'),
                          )
                        : ListView.separated(
                            itemCount: certs.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 14),
                            itemBuilder: (context, i) {
                              final cert = certs[i];
                              return Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.darkBackground : AppColors.softMintBg.withValues(alpha: 0.4),
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(color: AppColors.primaryTeal.withValues(alpha: 0.2)),
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
                                          child: Text(
                                            cert.serialNumber,
                                            style: const TextStyle(
                                              color: AppColors.primaryTeal,
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              fontFamily: 'monospace',
                                            ),
                                          ),
                                        ),
                                        const Spacer(),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppColors.success.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: const Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(Icons.verified, size: 12, color: AppColors.success),
                                              SizedBox(width: 4),
                                              Text(
                                                'معتمدة وموثّقة',
                                                style: TextStyle(color: AppColors.success, fontSize: 10.5, fontWeight: FontWeight.bold),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      cert.title,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      'المشرف: ${cert.instructor} | التقدير: ${cert.grade}',
                                      style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : AppColors.textSecondary),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'تاريخ الإصدار: ${cert.issueDate}',
                                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: OutlinedButton.icon(
                                            style: OutlinedButton.styleFrom(
                                              foregroundColor: AppColors.primaryTeal,
                                              side: const BorderSide(color: AppColors.primaryTeal),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                              padding: const EdgeInsets.symmetric(vertical: 8),
                                            ),
                                            icon: const Icon(Icons.qr_code_2, size: 16),
                                            label: const Text('التحقق الرقمي QR', style: TextStyle(fontSize: 12)),
                                            onPressed: () {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  content: Text('الشهادة رقم ${cert.serialNumber} مسجلة وموثقة رسمياً في منظومة دنتكولاب الأكاديمية.'),
                                                ),
                                              );
                                            },
                                          ),
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: ElevatedButton.icon(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: AppColors.primaryTeal,
                                              foregroundColor: Colors.white,
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                              padding: const EdgeInsets.symmetric(vertical: 8),
                                              elevation: 0,
                                            ),
                                            icon: const Icon(Icons.download_rounded, size: 16),
                                            label: const Text('تحميل (PDF)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                            onPressed: () {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  backgroundColor: AppColors.success,
                                                  content: Text('جاري تجهيز وتحميل شهادة: ${cert.title}'),
                                                ),
                                              );
                                            },
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
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

  // ===========================================================================
  // 3. SAVED COURSES (الدورات المحفوظة)
  // ===========================================================================
  void _showSavedCoursesSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StreamBuilder<List<CourseModel>>(
          stream: AcademyRepository.streamCourses(),
          builder: (context, snapshot) {
            final allCourses = snapshot.data ?? AcademyRepository.courses;
            final savedList = allCourses.isNotEmpty ? allCourses : AcademyRepository.courses;

            return Container(
              padding: const EdgeInsets.all(20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.brandMint.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.bookmark_outline, color: AppColors.primaryTeal),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('الدورات المحفوظة', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                            Text('قائمة الدورات والبرامج التي قمت بحفظها للرجوع إليها', style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Expanded(
                    child: ListView.separated(
                      itemCount: savedList.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, idx) {
                        final course = savedList[idx];
                        final formattedPrice = course.priceMinorUnits > 0
                            ? '${(course.priceMinorUnits / 1000).toStringAsFixed(0)},000 د.ع'
                            : 'مجاناً';

                        return InkWell(
                          onTap: () {
                            Navigator.pop(ctx);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => CourseDetailScreen(course: course),
                              ),
                            );
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkBackground : AppColors.softMintBg.withValues(alpha: 0.35),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.primaryTeal.withValues(alpha: 0.18)),
                            ),
                            child: Row(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Container(
                                    width: 70,
                                    height: 70,
                                    color: AppColors.primaryNavy,
                                    child: course.image.isNotEmpty
                                        ? AppImageWidget(
                                            imagePathOrUrl: course.image,
                                            fit: BoxFit.cover,
                                          )
                                        : const Icon(Icons.school, color: AppColors.brandMint, size: 30),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        course.title.ar,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'المستوى: ${course.level} • المدة: ${course.duration}',
                                        style: TextStyle(fontSize: 11.5, color: isDark ? Colors.white70 : AppColors.textSecondary),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        formattedPrice,
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryTeal),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.primaryTeal),
                              ],
                            ),
                          ),
                        );
                      },
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

  // ===========================================================================
  // 4. MY SERVICE REQUESTS (طلبات الخدمات)
  // ===========================================================================
  void _showServiceRequestsSheet(BuildContext context, String uid) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StreamBuilder<List<UserServiceRequestModel>>(
          stream: AcademyRepository.streamServiceRequests(uid),
          builder: (context, snapshot) {
            final requests = snapshot.data ?? const <UserServiceRequestModel>[];
            return Container(
              padding: const EdgeInsets.all(20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.brandMint.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.design_services_outlined, color: AppColors.primaryTeal),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('طلبات الخدمات الرقمية', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                            Text('متابعة حالة تصاميم الأدلة الجراحية والطباعة ثلاثية الأبعاد', style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Expanded(
                    child: requests.isEmpty
                        ? const Center(child: Text('لا توجد طلبات خدمات حالية'))
                        : ListView.separated(
                            itemCount: requests.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, i) {
                              final req = requests[i];
                              final isDone = req.status == 'completed';
                              return Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.darkBackground : AppColors.softMintBg.withValues(alpha: 0.35),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isDone
                                        ? AppColors.success.withValues(alpha: 0.3)
                                        : AppColors.primaryTeal.withValues(alpha: 0.3),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            req.title,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: (isDone ? AppColors.success : AppColors.primaryTeal).withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            req.statusLabel,
                                            style: TextStyle(
                                              color: isDone ? AppColors.success : AppColors.primaryTeal,
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Text(req.caseType, style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : AppColors.textSecondary)),
                                    if (req.notes.isNotEmpty) ...[
                                      const SizedBox(height: 6),
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          req.notes,
                                          style: const TextStyle(fontSize: 11.5, fontStyle: FontStyle.italic),
                                        ),
                                      ),
                                    ],
                                    const SizedBox(height: 8),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('التاريخ: ${req.date}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                        Text(req.price, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: AppColors.primaryTeal)),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
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

  // ===========================================================================
  // 5. PAYMENTS & RECEIPTS (المدفوعات والإيصالات)
  // ===========================================================================
  void _showPaymentsSheet(BuildContext context, String uid) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StreamBuilder<List<UserPaymentReceiptModel>>(
          stream: AcademyRepository.streamPayments(uid),
          builder: (context, snapshot) {
            final payments = snapshot.data ?? const <UserPaymentReceiptModel>[];
            return Container(
              padding: const EdgeInsets.all(20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.brandMint.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.receipt_long_outlined, color: AppColors.primaryTeal),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('المدفوعات والإيصالات الإلكترونية', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                            Text('سجل سداد رسوم الدورات والخدمات المعتمدة', style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Expanded(
                    child: payments.isEmpty
                        ? const Center(child: Text('لا توجد إيصالات سداد سابقة'))
                        : ListView.separated(
                            itemCount: payments.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, i) {
                              final pay = payments[i];
                              return Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: isDark ? AppColors.darkBackground : AppColors.softMintBg.withValues(alpha: 0.35),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.primaryTeal.withValues(alpha: 0.2)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          pay.receiptNo,
                                          style: const TextStyle(
                                            fontFamily: 'monospace',
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: AppColors.primaryTeal,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppColors.success.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            pay.status,
                                            style: const TextStyle(color: AppColors.success, fontSize: 10.5, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(pay.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                                    const SizedBox(height: 6),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('طريقة الدفع: ${pay.method}', style: TextStyle(fontSize: 11.5, color: isDark ? Colors.white70 : AppColors.textSecondary)),
                                        Text(pay.amount, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryTeal)),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text('التاريخ: ${pay.date}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                  ],
                                ),
                              );
                            },
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

  // ===========================================================================
  // 6. LANGUAGE (اللغة)
  // ===========================================================================
  void _showLanguageDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('اختيار لغة التطبيق / Language', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: _selectedLanguage == 'ar' ? AppColors.brandMint.withValues(alpha: 0.12) : null,
              leading: Icon(
                _selectedLanguage == 'ar' ? Icons.radio_button_checked : Icons.radio_button_off,
                color: AppColors.primaryTeal,
              ),
              title: const Text('العربية (Arabic) ✓', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('اللغة الافتراضية المعتمدة'),
              onTap: () {
                setState(() => _selectedLanguage = 'ar');
                Navigator.pop(dialogCtx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('تم تفعيل اللغة العربية')),
                );
              },
            ),
            const SizedBox(height: 6),
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: _selectedLanguage == 'en' ? AppColors.brandMint.withValues(alpha: 0.12) : null,
              leading: Icon(
                _selectedLanguage == 'en' ? Icons.radio_button_checked : Icons.radio_button_off,
                color: AppColors.primaryTeal,
              ),
              title: const Text('English (الإنجليزية)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('English language interface'),
              onTap: () {
                setState(() => _selectedLanguage = 'en');
                Navigator.pop(dialogCtx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('English interface mode selected')),
                );
              },
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogCtx), child: const Text('إغلاق')),
        ],
      ),
    );
  }

  // ===========================================================================
  // 7. APPEARANCE (المظهر: Light / Dark / System)
  // ===========================================================================
  void _showAppearanceDialog(BuildContext context) {
    final currentMode = ref.read(themeModeProvider);

    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('مظهر التطبيق (Appearance)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: currentMode == ThemeMode.light ? AppColors.brandMint.withValues(alpha: 0.12) : null,
              leading: const Icon(Icons.light_mode, color: Colors.amber),
              title: const Text('الوضع النهاري (Light Mode)'),
              trailing: currentMode == ThemeMode.light
                  ? const Icon(Icons.check_circle, color: AppColors.primaryTeal)
                  : const Icon(Icons.circle_outlined, color: Colors.grey),
              onTap: () {
                ref.read(themeModeProvider.notifier).state = ThemeMode.light;
                Navigator.pop(dialogCtx);
              },
            ),
            const SizedBox(height: 4),
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: currentMode == ThemeMode.dark ? AppColors.brandMint.withValues(alpha: 0.12) : null,
              leading: const Icon(Icons.dark_mode, color: AppColors.primaryTeal),
              title: const Text('الوضع الليلي (Dark Mode)'),
              trailing: currentMode == ThemeMode.dark
                  ? const Icon(Icons.check_circle, color: AppColors.primaryTeal)
                  : const Icon(Icons.circle_outlined, color: Colors.grey),
              onTap: () {
                ref.read(themeModeProvider.notifier).state = ThemeMode.dark;
                Navigator.pop(dialogCtx);
              },
            ),
            const SizedBox(height: 4),
            ListTile(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              tileColor: currentMode == ThemeMode.system ? AppColors.brandMint.withValues(alpha: 0.12) : null,
              leading: const Icon(Icons.settings_system_daydream, color: Colors.blueGrey),
              title: const Text('تلقائي حسب النظام (System)'),
              trailing: currentMode == ThemeMode.system
                  ? const Icon(Icons.check_circle, color: AppColors.primaryTeal)
                  : const Icon(Icons.circle_outlined, color: Colors.grey),
              onTap: () {
                ref.read(themeModeProvider.notifier).state = ThemeMode.system;
                Navigator.pop(dialogCtx);
              },
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogCtx), child: const Text('إلغاء')),
        ],
      ),
    );
  }

  // ===========================================================================
  // 8. NOTIFICATION SETTINGS (إعدادات الإشعارات)
  // ===========================================================================
  void _showNotificationSettingsSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (sheetCtx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: const EdgeInsets.all(22),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Row(
                    children: [
                      Icon(Icons.notifications_active_outlined, color: AppColors.primaryTeal),
                      SizedBox(width: 10),
                      Text('إعدادات الإشعارات والتنبيهات', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 18),
                  SwitchListTile(
                    title: const Text('تذكيرات الدورات والمحاضرات', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600)),
                    subtitle: const Text('تنبيهك بمواعيد بدء الجلسات التدريبية', style: TextStyle(fontSize: 11)),
                    value: _notifyCourseReminders,
                    activeThumbColor: AppColors.primaryTeal,
                    activeTrackColor: AppColors.softMintBg,
                    onChanged: (val) {
                      setSheetState(() => _notifyCourseReminders = val);
                      setState(() => _notifyCourseReminders = val);
                    },
                  ),
                  SwitchListTile(
                    title: const Text('إشعارات الورش العملية', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600)),
                    subtitle: const Text('فتح باب التسجيل والورش التخصصية الجديدة', style: TextStyle(fontSize: 11)),
                    value: _notifyWorkshops,
                    activeThumbColor: AppColors.primaryTeal,
                    activeTrackColor: AppColors.softMintBg,
                    onChanged: (val) {
                      setSheetState(() => _notifyWorkshops = val);
                      setState(() => _notifyWorkshops = val);
                    },
                  ),
                  SwitchListTile(
                    title: const Text('تحديثات طلبات الخدمات', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600)),
                    subtitle: const Text('جاهزية الأدلة الجراحية والنماذج ثلاثية الأبعاد', style: TextStyle(fontSize: 11)),
                    value: _notifyServiceUpdates,
                    activeThumbColor: AppColors.primaryTeal,
                    activeTrackColor: AppColors.softMintBg,
                    onChanged: (val) {
                      setSheetState(() => _notifyServiceUpdates = val);
                      setState(() => _notifyServiceUpdates = val);
                    },
                  ),
                  SwitchListTile(
                    title: const Text('الإعلانات والعروض الحصرية', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600)),
                    subtitle: const Text('خصومات التسجيل المبكر والفعاليات', style: TextStyle(fontSize: 11)),
                    value: _notifyOffers,
                    activeThumbColor: AppColors.primaryTeal,
                    activeTrackColor: AppColors.softMintBg,
                    onChanged: (val) {
                      setSheetState(() => _notifyOffers = val);
                      setState(() => _notifyOffers = val);
                    },
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryTeal,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () {
                      Navigator.pop(sheetCtx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: AppColors.success,
                          content: Text('تم حفظ تفضيلات الإشعارات بنجاح ✓'),
                        ),
                      );
                    },
                    child: const Text('حفظ التفضيلات', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // ===========================================================================
  // 9. CHANGE PASSWORD (تغيير كلمة المرور)
  // ===========================================================================
  void _showChangePasswordDialog(BuildContext context) {
    final passwordController = TextEditingController();
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('تغيير كلمة المرور', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'أدخل كلمة المرور الجديدة (6 أحرف كحد أدنى):',
              style: TextStyle(fontSize: 12),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'كلمة المرور الجديدة',
                prefixIcon: Icon(Icons.lock_outline),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryTeal, foregroundColor: Colors.white),
            onPressed: () async {
              final newPass = passwordController.text.trim();
              if (newPass.length < 6) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('كلمة المرور يجب ألا تقل عن 6 أحرف')),
                );
                return;
              }
              try {
                await FirebaseAuth.instance.currentUser?.updatePassword(newPass);
                if (context.mounted) {
                  Navigator.pop(dialogCtx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      backgroundColor: AppColors.success,
                      content: Text('تم تحديث كلمة المرور بنجاح'),
                    ),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      backgroundColor: AppColors.error,
                      content: Text('فشل التحديث: ${e.toString()}'),
                    ),
                  );
                }
              }
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 10. HELP & FAQ (المساعدة والأسئلة الشائعة)
  // ===========================================================================
  void _showHelpFaqSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    final faqs = [
      {
        'q': 'أين يقع مقر أكاديمية دنتكولاب في بغداد؟',
        'a': 'يقع المقر الرئيسي للأكاديمية ومختبر التدريب الرقمي في بغداد — المنصور، بالقرب من ساحة الرواد. تتوفر قاعات تدريب مجهزة بحواسيب وطابعات ثلاثية الأبعاد.',
      },
      {
        'q': 'هل الشهادات الصادرة معتمدة دولياً ومحلياً؟',
        'a': 'نعم، جميع شهادات دورات Exocad ودبلومات الجراحة الموجهة وتخطيط الزرعات معتمدة من الكادر التدريبي وموثقة برقم تسلسلي ورمز QR رسمي للتحقق الفوري.',
      },
      {
        'q': 'كيف يمكنني إرسال ملفات الأشعة (CBCT/STL) لتصميم الدليل الجراحي؟',
        'a': 'يمكنك رفع الملفات عبر قسم خدمات الأكاديمية أو إرسالها مباشرة لفريق التصميم الرقمي عبر الواتساب مع كتابة تفاصيل الحالة واسم المريض.',
      },
      {
        'q': 'ما هي طرق الدفع المتوفرة لتسجيل الدورات والخدمات؟',
        'a': 'ندعم الدفع عبر زين كاش (Zain Cash)، وبطاقات كي كارد / ماستركارد، بالإضافة إلى الدفع النقدي المباشر في مقر الأكاديمية ببغداد.',
      },
      {
        'q': 'هل تتوفر دورات أونلاين أم حضورية فقط؟',
        'a': 'توفر دنتكولاب برامج هجينة (Hybrid) تشمل محاضرات نظرية مسجلة ومباشرة، مع جلسات تدريب عملي مكثف "Hands-on" داخل مختبراتنا ببغداد.',
      },
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(20),
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Row(
                children: [
                  Icon(Icons.quiz_outlined, color: AppColors.primaryTeal),
                  SizedBox(width: 10),
                  Text('المساعدة والأسئلة الشائعة (FAQ)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.separated(
                  itemCount: faqs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, i) {
                    final item = faqs[i];
                    return Container(
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkBackground : AppColors.softMintBg.withValues(alpha: 0.35),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.primaryTeal.withValues(alpha: 0.15)),
                      ),
                      child: ExpansionTile(
                        shape: const Border(),
                        leading: const Icon(Icons.help_outline, color: AppColors.primaryTeal, size: 20),
                        title: Text(item['q']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 14),
                            child: Text(
                              item['a']!,
                              style: TextStyle(fontSize: 12, height: 1.5, color: isDark ? Colors.white70 : AppColors.textSecondary),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ===========================================================================
  // 11. CONTACT US (تواصل معنا)
  // ===========================================================================
  void _showContactUsSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Row(
                children: [
                  Icon(Icons.headset_mic_outlined, color: AppColors.primaryTeal),
                  SizedBox(width: 10),
                  Text('تواصل مع إدارة الأكاديمية', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 18),
              ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                tileColor: AppColors.success.withValues(alpha: 0.1),
                leading: const Icon(Icons.chat_outlined, color: AppColors.success),
                title: const Text('محادثة مباشرة عبر واتساب (WhatsApp)', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold)),
                subtitle: const Text('+964 781 782 8545', style: TextStyle(fontSize: 12, fontFamily: 'monospace')),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('جاري فتح محادثة WhatsApp للأكاديمية: +964 781 782 8545')),
                  );
                },
              ),
              const SizedBox(height: 10),
              ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                tileColor: AppColors.primaryTeal.withValues(alpha: 0.1),
                leading: const Icon(Icons.phone_in_talk_outlined, color: AppColors.primaryTeal),
                title: const Text('الاتصال الهاتفي المباشر', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold)),
                subtitle: const Text('+964 781 782 8545 (ساعات الدوام 9ص - 7م)', style: TextStyle(fontSize: 12)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('جاري الاتصال بإدارة التسجيل: +964 781 782 8545')),
                  );
                },
              ),
              const SizedBox(height: 10),
              ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                tileColor: Colors.blue.withValues(alpha: 0.1),
                leading: const Icon(Icons.alternate_email, color: Colors.blue),
                title: const Text('البريد الإلكتروني الرسمي', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold)),
                subtitle: const Text('info@dentacollab.iq', style: TextStyle(fontSize: 12)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم نسخ البريد الإلكتروني: info@dentacollab.iq')),
                  );
                },
              ),
              const SizedBox(height: 10),
              ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                tileColor: Colors.purple.withValues(alpha: 0.1),
                leading: const Icon(Icons.location_on_outlined, color: Colors.purple),
                title: const Text('مقر الأكاديمية في بغداد', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold)),
                subtitle: const Text('المنصور — مجاور ساحة الرواد', style: TextStyle(fontSize: 12)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('العنوان: بغداد، المنصور، قرب ساحة الرواد')),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // ===========================================================================
  // 12. PRIVACY POLICY (سياسة الخصوصية)
  // ===========================================================================
  void _showPrivacyPolicySheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(22),
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Row(
                  children: [
                    Icon(Icons.privacy_tip_outlined, color: AppColors.primaryTeal),
                    SizedBox(width: 10),
                    Text('سياسة الخصوصية (Privacy Policy)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'أهلاً بك في أكاديمية دنتكولاب لطب الأسنان الرقمي (DentaCollab Academy).\n\n'
                  '1. سرية بيانات المرضى والملفات السريرية:\n'
                  'نلتزم بأعلى معايير الحماية التامة لكافة صور الأشعة المقطعية (CBCT) ونماذج المسح الضوئي (STL) المرفوعة لأغراض تصميم الأدلة الجراحية والطباعة. لا تتم مشاركة أية بيانات سريرية مع أي طرف خارجي.\n\n'
                  '2. البيانات الشخصية والحسابات:\n'
                  'نقوم بتخزين اسم الطبيب، ورقم الهاتف، والمدينة، وسجلات الشهادات المعتمدة بأمان عبر خوادمنا السحابية المعتمدة والمشفرة بتقنيات SSL/TLS.\n\n'
                  '3. المدفوعات والمعاملات المالية:\n'
                  'تتم عمليات الدفع الإلكتروني عبر بوابات معتمدة وآمنة (Zain Cash و Qi Card)، ولا نحتفظ بأي معلومات حساسة عن بطاقاتك المصرفية.\n\n'
                  '4. التحديثات والإشعارات:\n'
                  'يمكنك في أي وقت تخصيص أو تعطيل إشعارات التطبيق من شاشة الإعدادات.',
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.6,
                    color: isDark ? Colors.white70 : AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryTeal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('فهمت ذلك وموافق'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ===========================================================================
  // 13. TERMS & CONDITIONS (الشروط والأحكام)
  // ===========================================================================
  void _showTermsSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final sheetBg = isDark ? AppColors.darkCard : Colors.white;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: sheetBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(22),
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Row(
                  children: [
                    Icon(Icons.gavel_outlined, color: AppColors.primaryTeal),
                    SizedBox(width: 10),
                    Text('الشروط والأحكام (Terms & Conditions)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  '1. شروط التسجيل في البرامج التدريبية:\n'
                  'التسجيل في دورات دنتكولاب التخصصية مخصص لأطباء الأسنان، وتقنيي المختبرات السنية، وطلبة السنوات الأخيرة لكليات طب الأسنان في العراق.\n\n'
                  '2. الحضور والتدريب الميداني:\n'
                  'يتطلب نيل الشهادة المعتمدة حضور ما لا يقل عن 80% من ساعات التدريب النظري والعملي وإتمام متطلبات تصميم الحالات السريرية بنجاح.\n\n'
                  '3. خدمات التصميم والطباعة:\n'
                  'يتحمل الطبيب المعالج مسؤولية مراجعة ومصادقة التخطيط الرقمي للدليل الجراحي قبل بدء الجراحة السريرية.\n\n'
                  '4. سياسة الإلغاء واسترداد الرسوم:\n'
                  'يحق للمتدرب استرداد رسوم التسجيل كاملة في حال الإلغاء قبل 5 أيام من موعد انطلاق الدورة.',
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.6,
                    color: isDark ? Colors.white70 : AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryTeal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('موافق على الشروط والأحكام'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ===========================================================================
  // 14. SIGN OUT (تسجيل الخروج)
  // ===========================================================================
  void _showSignOutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('تسجيل الخروج', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: const Text('هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك الحالي؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade600, foregroundColor: Colors.white),
            onPressed: () async {
              Navigator.pop(dialogCtx);
              await FirebaseAuth.instance.signOut();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('تم تسجيل الخروج بنجاح')),
                );
              }
            },
            child: const Text('تسجيل الخروج'),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 15. DELETE ACCOUNT (حذف الحساب — منفصل ومؤكد)
  // ===========================================================================
  void _showDeleteAccountDialog(BuildContext context, User user) {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red.shade700, size: 26),
            const SizedBox(width: 8),
            const Text(
              'حذف الحساب نهائياً',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'تحذير هام:',
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red, fontSize: 13),
            ),
            SizedBox(height: 6),
            Text(
              'سيؤدي هذا الإجراء إلى حذف حسابك بشكل لا رجعة فيه. ستفقد الوصول إلى:\n'
              '• جميع الشهادات الرقمية المعتمدة الصادرة باسمك\n'
              '• سجل الدورات المسجلة والورش التدريبية\n'
              '• طلبات الخدمات وتصاميم الأدلة الجراحية\n'
              '• الإيصالات والمدفوعات الإلكترونية',
              style: TextStyle(fontSize: 12.5, height: 1.5),
            ),
            SizedBox(height: 12),
            Text(
              'هل أنت متأكد تماماً من رغبتك في الاستمرار؟',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12.5),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('تراجع'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade700,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              Navigator.pop(dialogCtx);
              try {
                await user.delete();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      backgroundColor: Colors.red,
                      content: Text('تم حذف الحساب نهائياً.'),
                    ),
                  );
                }
              } catch (e) {
                await FirebaseAuth.instance.signOut();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('تم تسجيل الخروج. يرجى إعادة تسجيل الدخول للتحقق وحذف الحساب: ${e.toString()}'),
                    ),
                  );
                }
              }
            },
            child: const Text('نعم، احذف حسابي', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // UI BUILD
  // ===========================================================================
  @override
  Widget build(BuildContext context) {
    ref.watch(themeModeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, authSnapshot) {
        final user = authSnapshot.data ?? FirebaseAuth.instance.currentUser;
        final isLoggedIn = user != null;

        return StreamBuilder<UserProfileModel>(
          stream: isLoggedIn ? AcademyRepository.streamUserProfile(user.uid) : Stream.value(const UserProfileModel()),
          builder: (context, profileSnapshot) {
            final profile = profileSnapshot.data ?? const UserProfileModel();

            String displayName = 'طبيب متدرب';
            String email = 'لم يتم تسجيل الدخول';
            String profession = profile.profession.isNotEmpty ? profile.profession : 'طبيب أسنان';
            String city = profile.city.isNotEmpty ? profile.city : 'بغداد';
            String photoUrl = profile.photoUrl.isNotEmpty ? profile.photoUrl : (user?.photoURL ?? '');
            String initials = 'DC';

            if (isLoggedIn) {
              email = user.email ?? 'بدون بريد';
              if (profile.name.isNotEmpty) {
                displayName = profile.name;
              } else if (user.displayName != null && user.displayName!.isNotEmpty) {
                displayName = user.displayName!;
              } else {
                displayName = email.split('@')[0];
              }
              initials = displayName.split(' ').map((s) => s.isNotEmpty ? s[0] : '').take(2).join().toUpperCase();
            }

            return Scaffold(
              appBar: AppBar(
                title: const Text('حسابي (My Account)', style: TextStyle(fontWeight: FontWeight.bold)),
                actions: [
                  IconButton(
                    tooltip: 'تغيير المظهر',
                    icon: Icon(
                      isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                      color: AppColors.primaryTeal,
                    ),
                    onPressed: () => _showAppearanceDialog(context),
                  ),
                ],
              ),
              body: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // =========================================================
                    // TOP PROFILE CARD / GUEST CARD
                    // =========================================================
                    if (isLoggedIn)
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(24),
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
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: const LinearGradient(
                                      colors: [AppColors.brandMint, AppColors.primaryTeal],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: AppColors.brandMint.withValues(alpha: 0.35),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: ClipOval(
                                    child: photoUrl.isNotEmpty
                                        ? AppImageWidget(imagePathOrUrl: photoUrl, fit: BoxFit.cover)
                                        : Center(
                                            child: Text(
                                              initials,
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
                                            ),
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
                                              displayName,
                                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: textColor),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: AppColors.primaryTeal.withValues(alpha: 0.12),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: const Text(
                                              'موثّق ✓',
                                              style: TextStyle(color: AppColors.primaryTeal, fontSize: 9.5, fontWeight: FontWeight.bold),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 3),
                                      Text(
                                        profession,
                                        style: const TextStyle(color: AppColors.primaryTeal, fontSize: 12, fontWeight: FontWeight.w600),
                                      ),
                                      const SizedBox(height: 2),
                                      Row(
                                        children: [
                                          Icon(Icons.location_on_outlined, size: 12, color: subtitleColor),
                                          const SizedBox(width: 3),
                                          Text(city, style: TextStyle(color: subtitleColor, fontSize: 11)),
                                          const SizedBox(width: 10),
                                          Icon(Icons.email_outlined, size: 12, color: subtitleColor),
                                          const SizedBox(width: 3),
                                          Expanded(
                                            child: Text(
                                              email,
                                              style: TextStyle(color: subtitleColor, fontSize: 11),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: AppColors.primaryTeal,
                                  side: const BorderSide(color: AppColors.primaryTeal, width: 1.2),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                  padding: const EdgeInsets.symmetric(vertical: 9),
                                ),
                                icon: const Icon(Icons.edit_outlined, size: 16),
                                label: const Text('تعديل الملف الشخصي', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                                onPressed: () => _showEditProfileSheet(context, user, profile),
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: AppColors.brandMint.withValues(alpha: 0.12),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.account_circle_outlined, size: 36, color: AppColors.primaryTeal),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('أنت تتصفح كزائر (Guest)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: textColor)),
                                      const SizedBox(height: 2),
                                      Text('سجّل دخولك لمزامنة دوراتك وشهاداتك الرقمية', style: TextStyle(fontSize: 11.5, color: subtitleColor)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            SizedBox(
                              width: double.infinity,
                              height: 44,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primaryTeal,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                                  elevation: 0,
                                ),
                                icon: const Icon(Icons.login, size: 16),
                                label: const Text('تسجيل الدخول / إنشاء حساب', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (context) => const AuthScreen(isModal: true)),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),

                    const SizedBox(height: 20),

                    // =========================================================
                    // SECTION 1: PROFILE (الملف الشخصي)
                    // =========================================================
                    _buildSectionHeader('الملف الشخصي', 'Profile'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.badge_outlined,
                          title: 'تعديل الملف الشخصي',
                          subtitle: 'الصورة الشخصية، الاسم، رقم الهاتف، المدينة، والمهنة',
                          onTap: () {
                            if (isLoggedIn) {
                              _showEditProfileSheet(context, user, profile);
                            } else {
                              _promptLogin(context);
                            }
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 2: LEARNING (التعلم والتدريب)
                    // =========================================================
                    _buildSectionHeader('التعلم والتدريب', 'Learning'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.workspace_premium_outlined,
                          title: 'شهاداتي',
                          subtitle: 'عرض وتحميل الشهادات المعتمدة برمز QR الرقمي',
                          trailingBadge: 'معتمدة ✓',
                          onTap: () => _showCertificatesSheet(context, user?.uid ?? ''),
                        ),
                        Divider(height: 1, color: borderColor),
                        _buildSettingTile(
                          icon: Icons.bookmark_border_rounded,
                          title: 'الدورات المحفوظة',
                          subtitle: 'الدورات والبرامج المحفوظة للمراجعة لاحقاً',
                          onTap: () => _showSavedCoursesSheet(context),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 3: REQUESTS (طلبات الخدمات)
                    // =========================================================
                    _buildSectionHeader('طلبات الخدمات', 'Requests'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.design_services_outlined,
                          title: 'طلبات الخدمات',
                          subtitle: 'متابعة الأدلة الجراحية والطباعة ثلاثية الأبعاد',
                          trailingBadge: 'تتبع مباشر',
                          onTap: () => _showServiceRequestsSheet(context, user?.uid ?? ''),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 4: PAYMENTS (المدفوعات والإيصالات)
                    // =========================================================
                    _buildSectionHeader('المدفوعات', 'Payments'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.receipt_long_outlined,
                          title: 'المدفوعات والإيصالات',
                          subtitle: 'سجل السداد الإلكتروني (زين كاش، كي كارد، نقداً)',
                          onTap: () => _showPaymentsSheet(context, user?.uid ?? ''),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 5: PREFERENCES (التفضيلات)
                    // =========================================================
                    _buildSectionHeader('التفضيلات', 'Preferences'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.language_rounded,
                          title: 'اللغة',
                          subtitle: _selectedLanguage == 'ar' ? 'العربية (مفعلة)' : 'English',
                          trailingBadge: _selectedLanguage == 'ar' ? 'العربية' : 'EN',
                          onTap: () => _showLanguageDialog(context),
                        ),
                        Divider(height: 1, color: borderColor),
                        _buildSettingTile(
                          icon: Icons.palette_outlined,
                          title: 'المظهر',
                          subtitle: isDark ? 'الوضع الليلي (Dark Mode)' : 'الوضع النهاري (Light Mode)',
                          trailingBadge: isDark ? 'ليلي' : 'نهاري',
                          onTap: () => _showAppearanceDialog(context),
                        ),
                        Divider(height: 1, color: borderColor),
                        _buildSettingTile(
                          icon: Icons.notifications_none_rounded,
                          title: 'إعدادات الإشعارات',
                          subtitle: 'تنبيهات المحاضرات، عروض الأكاديمية والورش',
                          onTap: () => _showNotificationSettingsSheet(context),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 6: SECURITY (الأمان والحساب)
                    // =========================================================
                    _buildSectionHeader('الأمان والحساب', 'Security'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.lock_reset_rounded,
                          title: 'تغيير كلمة المرور',
                          subtitle: 'تحديث كلمة المرور لحسابات البريد الإلكتروني',
                          onTap: () {
                            if (isLoggedIn) {
                              _showChangePasswordDialog(context);
                            } else {
                              _promptLogin(context);
                            }
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 7: SUPPORT (الدعم والمساعدة)
                    // =========================================================
                    _buildSectionHeader('الدعم والمساعدة', 'Support'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.help_outline_rounded,
                          title: 'المساعدة والأسئلة الشائعة',
                          subtitle: 'إجابات عن الدورات، الاعتماد، وموقع الأكاديمية',
                          onTap: () => _showHelpFaqSheet(context),
                        ),
                        Divider(height: 1, color: borderColor),
                        _buildSettingTile(
                          icon: Icons.support_agent_rounded,
                          title: 'تواصل معنا',
                          subtitle: 'دعم مباشر، واتساب +964 781 782 8545 أو الهاتف',
                          onTap: () => _showContactUsSheet(context),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // =========================================================
                    // SECTION 8: LEGAL (القانونية والسياسات)
                    // =========================================================
                    _buildSectionHeader('القانونية والسياسات', 'Legal'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        _buildSettingTile(
                          icon: Icons.privacy_tip_outlined,
                          title: 'سياسة الخصوصية',
                          subtitle: 'كيفية التعامل مع البيانات والأشعة السريرية',
                          onTap: () => _showPrivacyPolicySheet(context),
                        ),
                        Divider(height: 1, color: borderColor),
                        _buildSettingTile(
                          icon: Icons.article_outlined,
                          title: 'الشروط والأحكام',
                          subtitle: 'شروط التسجيل في الدورات وبرامج الأكاديمية',
                          onTap: () => _showTermsSheet(context),
                        ),
                      ],
                    ),

                    const SizedBox(height: 22),

                    // =========================================================
                    // SECTION 9: ACCOUNT (إدارة الحساب: خروج / حذف)
                    // =========================================================
                    _buildSectionHeader('إدارة الحساب', 'Account'),
                    _buildSectionContainer(
                      cardBg: cardBg,
                      borderColor: borderColor,
                      children: [
                        if (isLoggedIn) ...[
                          _buildSettingTile(
                            icon: Icons.logout_rounded,
                            title: 'تسجيل الخروج',
                            subtitle: 'إنهاء الجلسة الحالية من هذا الجهاز',
                            iconColor: Colors.orange.shade700,
                            onTap: () => _showSignOutDialog(context),
                          ),
                          Divider(height: 1, color: borderColor),
                          _buildSettingTile(
                            icon: Icons.delete_forever_rounded,
                            title: 'حذف الحساب',
                            subtitle: 'إجراء منفصل لحذف الحساب نهائياً مع التأكيد',
                            iconColor: Colors.red.shade600,
                            titleColor: Colors.red.shade600,
                            onTap: () => _showDeleteAccountDialog(context, user),
                          ),
                        ] else
                          _buildSettingTile(
                            icon: Icons.login_rounded,
                            title: 'تسجيل الدخول / إنشاء حساب',
                            subtitle: 'الوصول إلى كامل إمكانيات الأكاديمية والشهادات',
                            iconColor: AppColors.primaryTeal,
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const AuthScreen(isModal: true)),
                              );
                            },
                          ),
                      ],
                    ),

                    const SizedBox(height: 36),

                    // Academy footer badge
                    Center(
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppColors.primaryTeal,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'DentaCollab Digital Academy • Baghdad',
                                style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'الإصدار 1.2.0 • المنظومة التعليمية الرقمية المعتمدة',
                            style: TextStyle(fontSize: 10.5, color: subtitleColor),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ===========================================================================
  // HELPER WIDGETS
  // ===========================================================================
  Widget _buildSectionHeader(String titleAr, String titleEn) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
      child: Row(
        children: [
          Container(
            width: 3.5,
            height: 14,
            decoration: BoxDecoration(
              color: AppColors.primaryTeal,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            titleAr,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5),
          ),
          const SizedBox(width: 6),
          Text(
            '($titleEn)',
            style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionContainer({
    required Color cardBg,
    required Color borderColor,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildSettingTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? iconColor,
    Color? titleColor,
    String? trailingBadge,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = iconColor ?? AppColors.primaryTeal;
    final textCol = titleColor ?? (isDark ? Colors.white : AppColors.textPrimary);
    final subTextCol = isDark ? Colors.white60 : AppColors.textSecondary;

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
      leading: Container(
        padding: const EdgeInsets.all(7),
        decoration: BoxDecoration(
          color: primaryColor.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: primaryColor, size: 20),
      ),
      title: Text(
        title,
        style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: textCol),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(fontSize: 11, color: subTextCol),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (trailingBadge != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
              decoration: BoxDecoration(
                color: AppColors.primaryTeal.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                trailingBadge,
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primaryTeal),
              ),
            ),
            const SizedBox(width: 6),
          ],
          Icon(Icons.arrow_forward_ios, size: 12, color: subTextCol.withValues(alpha: 0.5)),
        ],
      ),
      onTap: onTap,
    );
  }

  void _promptLogin(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('يرجى تسجيل الدخول للوصول إلى هذا الخيار'),
        action: SnackBarAction(
          label: 'دخول',
          textColor: AppColors.brandMint,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AuthScreen(isModal: true)),
            );
          },
        ),
      ),
    );
  }
}
