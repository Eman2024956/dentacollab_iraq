class Bilingual {
  final String ar;
  final String en;

  const Bilingual({required this.ar, required this.en});

  String get(String locale) => locale == 'en' ? en : ar;

  factory Bilingual.fromDynamic(dynamic val, [String fallback = '']) {
    if (val is Map) {
      return Bilingual(
        ar: val['ar']?.toString() ?? val['en']?.toString() ?? fallback,
        en: val['en']?.toString() ?? val['ar']?.toString() ?? fallback,
      );
    }
    final str = val?.toString() ?? fallback;
    return Bilingual(ar: str, en: str);
  }
}

class InstructorModel {
  final String id;
  final Bilingual name;
  final Bilingual title;
  final Bilingual bio;
  final String image;
  final List<Bilingual> credentials;
  final List<String> courses;
  final String phone;
  final String email;
  final String role;
  final int order;
  final String status;

  const InstructorModel({
    required this.id,
    required this.name,
    required this.title,
    required this.bio,
    required this.image,
    required this.credentials,
    required this.courses,
    required this.phone,
    required this.email,
    required this.role,
    this.order = 99,
    this.status = 'active',
  });

  factory InstructorModel.fromMap(String docId, Map<String, dynamic> data) {
    final rawCreds = data['credentials'];
    final credList = <Bilingual>[];
    if (rawCreds is List) {
      for (final c in rawCreds) {
        credList.add(Bilingual.fromDynamic(c));
      }
    }

    final rawCourses = data['courses'];
    final courseList = <String>[];
    if (rawCourses is List) {
      for (final c in rawCourses) {
        courseList.add(c.toString());
      }
    }

    final rawImage = (data['image'] ?? data['imageUrl'] ?? data['avatarImagePath'] ?? data['avatarUrl'] ?? '').toString().trim();
    final instructorImage = rawImage.isNotEmpty ? rawImage : 'dr-ammar.png';

    return InstructorModel(
      id: docId,
      name: Bilingual.fromDynamic(data['name'], 'مدرب معتمد'),
      title: Bilingual.fromDynamic(data['title'], 'أخصائي طب الأسنان الرقمي'),
      bio: Bilingual.fromDynamic(data['bio'], ''),
      image: instructorImage,
      credentials: credList,
      courses: courseList,
      phone: data['phone']?.toString() ?? '+964 781 782 8545',
      email: data['email']?.toString() ?? 'info@dentacollab.org',
      role: data['role']?.toString() ?? 'مدرب معتمد',
      order: (data['order'] as num?)?.toInt() ?? 99,
      status: data['status']?.toString() ?? 'active',
    );
  }
}

class CourseLessonModel {
  final String title;
  final String description;
  final String mode; // 'عملي' | 'نظري'
  final List<String> tags;

  const CourseLessonModel({
    required this.title,
    required this.description,
    this.mode = 'عملي',
    this.tags = const [],
  });

  factory CourseLessonModel.fromMap(Map<String, dynamic> data) {
    final rawTags = data['tags'];
    final tagList = <String>[];
    if (rawTags is List) {
      for (final t in rawTags) {
        if (t != null && t.toString().trim().isNotEmpty) {
          tagList.add(t.toString().trim());
        }
      }
    }
    return CourseLessonModel(
      title: data['title']?.toString() ?? '',
      description: data['description']?.toString() ?? '',
      mode: data['mode']?.toString() ?? 'عملي',
      tags: tagList,
    );
  }

  Map<String, dynamic> toMap() => {
    'title': title,
    'description': description,
    'mode': mode,
    'tags': tags,
  };
}

class CourseModuleModel {
  final String id;
  final String order;
  final String title;
  final String lessonsCount;
  final String description;
  final List<String> outcomes;
  final List<CourseLessonModel> lessons;

  const CourseModuleModel({
    required this.id,
    required this.order,
    required this.title,
    required this.lessonsCount,
    required this.description,
    this.outcomes = const [],
    this.lessons = const [],
  });

  factory CourseModuleModel.fromMap(Map<String, dynamic> data) {
    final rawOutcomes = data['outcomes'];
    final outcomeList = <String>[];
    if (rawOutcomes is List) {
      for (final o in rawOutcomes) {
        if (o != null && o.toString().trim().isNotEmpty) {
          outcomeList.add(o.toString().trim());
        }
      }
    }

    final rawLessons = data['lessons'];
    final lessonList = <CourseLessonModel>[];
    if (rawLessons is List) {
      for (final l in rawLessons) {
        if (l is Map<String, dynamic>) {
          lessonList.add(CourseLessonModel.fromMap(l));
        } else if (l is Map) {
          lessonList.add(CourseLessonModel.fromMap(Map<String, dynamic>.from(l)));
        }
      }
    }

    return CourseModuleModel(
      id: data['id']?.toString() ?? 'mod_1',
      order: data['order']?.toString() ?? '01',
      title: data['title']?.toString() ?? '',
      lessonsCount: data['lessonsCount']?.toString() ?? '${lessonList.isNotEmpty ? lessonList.length : 10} درس',
      description: data['description']?.toString() ?? '',
      outcomes: outcomeList,
      lessons: lessonList,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'order': order,
    'title': title,
    'lessonsCount': lessonsCount,
    'description': description,
    'outcomes': outcomes,
    'lessons': lessons.map((l) => l.toMap()).toList(),
  };
}

class CourseModel {
  final String id;
  final String slug;
  final Bilingual title;
  final Bilingual description;
  final String category;
  final String level;
  final String duration;
  final String image;
  final int priceMinorUnits;
  final List<Bilingual> modules;
  final List<CourseModuleModel> syllabus;
  final List<CohortModel> cohorts;
  final String status;

  bool get isPublished => status != 'draft' && status != 'hidden';

  const CourseModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.description,
    required this.category,
    required this.level,
    required this.duration,
    required this.image,
    required this.priceMinorUnits,
    required this.modules,
    this.syllabus = const [],
    required this.cohorts,
    this.status = 'published',
  });

  factory CourseModel.fromMap(String docId, Map<String, dynamic> data) {
    final rawModules = data['modules'];
    final moduleList = <Bilingual>[];
    if (rawModules is List) {
      for (final m in rawModules) {
        moduleList.add(Bilingual.fromDynamic(m));
      }
    }

    final rawSyllabus = data['syllabus'] ?? data['curriculumBatch'];
    final syllabusList = <CourseModuleModel>[];
    if (rawSyllabus is List && rawSyllabus.isNotEmpty) {
      for (final sm in rawSyllabus) {
        if (sm is Map<String, dynamic>) {
          syllabusList.add(CourseModuleModel.fromMap(sm));
        } else if (sm is Map) {
          syllabusList.add(CourseModuleModel.fromMap(Map<String, dynamic>.from(sm)));
        }
      }
    } else {
      // Default structured curriculum matching academy syllabus specification
      syllabusList.add(
        const CourseModuleModel(
          id: 'mod_1',
          order: '01',
          title: 'المنهاج التدريبي — المستوى الأساسي للخريجين',
          lessonsCount: '10 درس',
          description: 'مسار عملي كامل من استيراد البيانات حتى طباعة الدليل الجراحي.',
          outcomes: [
            'إكمال تخطيط زرعات أساسي في Exoplan',
            'تصميم دليل جراحي قابل للطباعة',
            'تطبيق مسار الطباعة في Chitubox',
          ],
          lessons: [
            CourseLessonModel(
              title: 'مقدمة عن برنامج Exoplan',
              description: 'التعرف على الواجهة، الأدوات الأساسية، وسير العمل في البرنامج.',
              mode: 'نظري',
              tags: ['Project setup', 'Workflow overview', 'Interface'],
            ),
            CourseLessonModel(
              title: 'تحميل ومحاذاة ملفات DICOM و STL',
              description: 'استيراد بيانات CBCT والمسح الفموي وتحقيق محاذاة دقيقة.',
              mode: 'عملي',
              tags: ['Alignment', 'STL import', 'DICOM import'],
            ),
            CourseLessonModel(
              title: 'رسم وتحديد مسار العصب وتقسيم الجيوب الأنفية',
              description: 'بناء خريطة أمان تشريحية قبل وضع الزرعات.',
              mode: 'عملي',
              tags: ['Sinus segmentation', 'Nerve canal tracing', 'Safety mapping'],
            ),
            CourseLessonModel(
              title: 'تخطيط الزرعات (الزرعات المنفردة والجسور)',
              description: 'اختيار الزرعة وتخطيط الحالات المنفردة وحالات الجسور.',
              mode: 'عملي',
              tags: ['Implant library', 'Bridge planning', 'Single implant'],
            ),
          ],
        ),
      );
    }

    final rawCourseImage = (data['imageUrl'] ?? data['image'] ?? '').toString().trim();
    final courseImage = rawCourseImage.isNotEmpty ? rawCourseImage : 'assets/images/smale.jpg';

    return CourseModel(
      id: docId,
      slug: data['slug']?.toString() ?? docId,
      title: Bilingual.fromDynamic(
        data['title'] ?? {'ar': data['titleAr'], 'en': data['titleEn']},
        'دورة تدريبية',
      ),
      description: Bilingual.fromDynamic(
        data['description'] ?? {'ar': data['descriptionAr'], 'en': data['descriptionEn']},
        '',
      ),
      category: data['category']?.toString() ?? 'Exocad',
      level: data['level']?.toString() ?? 'مبتدئ / أساسي',
      duration: data['duration']?.toString() ?? '٤ أسابيع',
      image: courseImage,
      priceMinorUnits: (data['priceMinorUnits'] as num?)?.toInt() ?? 450000,
      modules: moduleList,
      syllabus: syllabusList,
      cohorts: const [],
      status: (data['publicationStatus'] ?? data['status'] ?? 'published').toString(),
    );
  }
}

class WorkshopModel {
  final String id;
  final String slug;
  final Bilingual title;
  final Bilingual venue;
  final String date;
  final String time;
  final String price;
  final String instructor;
  final int maxCapacity;
  final int reservedSeats;
  final String status;

  bool get isPublished => status != 'draft' && status != 'hidden';

  const WorkshopModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.venue,
    required this.date,
    required this.time,
    required this.price,
    required this.instructor,
    required this.maxCapacity,
    required this.reservedSeats,
    this.status = 'published',
  });

  factory WorkshopModel.fromMap(String docId, Map<String, dynamic> data) {
    return WorkshopModel(
      id: docId,
      slug: data['slug']?.toString() ?? docId,
      title: Bilingual.fromDynamic(
        data['title'] ?? {'ar': data['titleAr'], 'en': data['titleEn']},
        'ورشة عمل تخصصية',
      ),
      venue: Bilingual.fromDynamic(
        data['venue'] ?? {'ar': data['venueAr'], 'en': data['venueEn']},
        'مقر الأكاديمية — بغداد، المنصور',
      ),
      date: data['date']?.toString() ?? 'تشرين الأول ٢٠٢٦',
      time: data['time']?.toString() ?? '٩:٠٠ ص - ٤:٠٠ م',
      price: data['price']?.toString() ?? '150,000 د.ع',
      instructor: data['instructor']?.toString() ?? 'د. عمار صالح',
      maxCapacity: (data['maxCapacity'] as num?)?.toInt() ?? 15,
      reservedSeats: (data['reservedSeats'] as num?)?.toInt() ?? 8,
      status: (data['publicationStatus'] ?? data['status'] ?? 'published').toString(),
    );
  }
}

class ServiceItemModel {
  final String id;
  final String slug;
  final Bilingual title;
  final String category;
  final String priceMode;
  final String turnaround;
  final String status;

  const ServiceItemModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.category,
    required this.priceMode,
    required this.turnaround,
    required this.status,
  });

  factory ServiceItemModel.fromMap(String docId, Map<String, dynamic> data) {
    return ServiceItemModel(
      id: docId,
      slug: data['slug']?.toString() ?? docId,
      title: Bilingual.fromDynamic(
        data['title'] ?? {'ar': data['titleAr'], 'en': data['titleEn']},
        'خدمة رقمية',
      ),
      category: data['category']?.toString() ?? 'التصميم الرقمي',
      priceMode: data['priceMode']?.toString() ?? 'تسعير مخصص / Quote',
      turnaround: data['turnaround']?.toString() ?? '٢٤ - ٤٨ ساعة',
      status: data['status']?.toString() ?? 'active',
    );
  }
}

class CohortModel {
  final String id;
  final String courseId;
  final Bilingual title;
  final Bilingual venueName;
  final String startDateFormatted;
  final int maxCapacity;
  final int reservedSeats;
  final bool registrationOpen;

  const CohortModel({
    required this.id,
    required this.courseId,
    required this.title,
    required this.venueName,
    required this.startDateFormatted,
    required this.maxCapacity,
    required this.reservedSeats,
    required this.registrationOpen,
  });

  int get remainingSeats => maxCapacity - reservedSeats;
}

class EnrollmentModel {
  final String id;
  final String courseTitle;
  final String cohortTitle;
  final String dateSummary;
  final String status; // 'confirmed', 'waitlisted', 'requested'
  final String verificationPassToken;
  final String qrData;

  const EnrollmentModel({
    required this.id,
    required this.courseTitle,
    required this.cohortTitle,
    required this.dateSummary,
    required this.status,
    required this.verificationPassToken,
    required this.qrData,
  });
}

class NotificationItemModel {
  final String id;
  final String title;
  final String body;
  final String time;
  final bool read;

  const NotificationItemModel({
    required this.id,
    required this.title,
    required this.body,
    required this.time,
    required this.read,
  });
}

// ─── Graduate / Testimonial ────────────────────────────────────────────
class GraduateModel {
  final String id;
  final Bilingual name;
  final String city;
  final String profession;
  final String courseId;
  final Bilingual courseTitle;
  final Bilingual quote;
  final int rating;
  final String graduationDate;
  final String image;
  final String status;

  const GraduateModel({
    required this.id,
    required this.name,
    required this.city,
    required this.profession,
    required this.courseId,
    required this.courseTitle,
    required this.quote,
    required this.rating,
    required this.graduationDate,
    required this.image,
    required this.status,
  });

  factory GraduateModel.fromMap(String docId, Map<String, dynamic> data) {
    return GraduateModel(
      id: docId,
      name: Bilingual.fromDynamic(data['name'], 'خريج'),
      city: data['city']?.toString() ?? '',
      profession: data['profession']?.toString() ?? '',
      courseId: data['courseId']?.toString() ?? '',
      courseTitle: Bilingual.fromDynamic(data['courseTitle'], 'دورة تدريبية'),
      quote: Bilingual.fromDynamic(data['quote'], ''),
      rating: (data['rating'] as num?)?.toInt() ?? 5,
      graduationDate: data['graduationDate']?.toString() ?? '',
      image: (data['image'] ?? data['imageUrl'] ?? data['photo'] ?? data['avatarUrl'] ?? '').toString().trim(),
      status: data['status']?.toString() ?? 'published',
    );
  }
}

// ─── Gallery Album ─────────────────────────────────────────────────────
class GalleryAlbumModel {
  final String id;
  final Bilingual title;
  final Bilingual description;
  final List<String> images;
  final String category;
  final int order;
  final String status;

  const GalleryAlbumModel({
    required this.id,
    required this.title,
    required this.description,
    required this.images,
    required this.category,
    required this.order,
    required this.status,
  });

  factory GalleryAlbumModel.fromMap(String docId, Map<String, dynamic> data) {
    final rawImages = data['images'];
    final imageList = <String>[];
    if (rawImages is List) {
      for (final img in rawImages) {
        imageList.add(img.toString());
      }
    }

    return GalleryAlbumModel(
      id: docId,
      title: Bilingual.fromDynamic(data['title'], 'ألبوم صور'),
      description: Bilingual.fromDynamic(data['description'], ''),
      images: imageList,
      category: data['category']?.toString() ?? 'عام',
      order: (data['order'] as num?)?.toInt() ?? 99,
      status: data['status']?.toString() ?? 'published',
    );
  }
}

// ─── Hero Slider Banner Settings ──────────────────────────────────────────
class HeroBannerSlideModel {
  final String id;
  final String tag;
  final String title;
  final String description;
  final String image;
  final String actionType; // 'courses', 'workshops', 'services', 'none'
  final String actionText;
  final int order;

  const HeroBannerSlideModel({
    required this.id,
    required this.tag,
    required this.title,
    required this.description,
    required this.image,
    required this.actionType,
    required this.actionText,
    this.order = 1,
  });

  factory HeroBannerSlideModel.fromMap(Map<String, dynamic> data) {
    return HeroBannerSlideModel(
      id: data['id']?.toString() ?? '',
      tag: data['tag']?.toString() ?? 'التدريب الميداني المعتمد',
      title: data['title']?.toString() ?? 'صمّم. خطّط. نفّذ.',
      description: data['description']?.toString() ?? '',
      image: (data['image'] ?? data['imageUrl'] ?? '').toString(),
      actionType: data['actionType']?.toString() ?? 'courses',
      actionText: data['actionText']?.toString() ?? 'استكشف الدورات',
      order: (data['order'] as num?)?.toInt() ?? 1,
    );
  }
}

class HeroBannerSettingsModel {
  final bool isVisible;
  final bool enableAnimation;
  final int animationIntervalSeconds;
  final List<HeroBannerSlideModel> slides;

  const HeroBannerSettingsModel({
    this.isVisible = true,
    this.enableAnimation = true,
    this.animationIntervalSeconds = 4,
    this.slides = const [],
  });

  factory HeroBannerSettingsModel.fromMap(Map<String, dynamic>? data) {
    if (data == null) {
      return HeroBannerSettingsModel.fallback();
    }

    final rawSlides = data['slides'];
    final slideList = <HeroBannerSlideModel>[];
    if (rawSlides is List) {
      for (final s in rawSlides) {
        if (s is Map<String, dynamic>) {
          slideList.add(HeroBannerSlideModel.fromMap(s));
        } else if (s is Map) {
          slideList.add(HeroBannerSlideModel.fromMap(Map<String, dynamic>.from(s)));
        }
      }
    }

    return HeroBannerSettingsModel(
      isVisible: data['isVisible'] as bool? ?? true,
      enableAnimation: data['enableAnimation'] as bool? ?? true,
      animationIntervalSeconds: (data['animationIntervalSeconds'] as num?)?.toInt() ?? 4,
      slides: slideList.isNotEmpty ? slideList : HeroBannerSettingsModel.fallback().slides,
    );
  }

  static const HeroBannerSettingsModel defaultFallback = HeroBannerSettingsModel(
    isVisible: true,
    enableAnimation: true,
    animationIntervalSeconds: 4,
    slides: [
      HeroBannerSlideModel(
        id: 'slide_1',
        tag: 'التدريب الميداني المعتمد',
        title: 'صمّم. خطّط. نفّذ.',
        description: 'برامج تدريبية تخصصية في التصميم الرقمي عبر Exocad، وتخطيط الزرعات Exoplan، والطباعة ثلاثية الأبعاد بأحدث المعدات في بغداد.',
        image: '',
        actionType: 'courses',
        actionText: 'استكشف الدورات',
        order: 1,
      ),
      HeroBannerSlideModel(
        id: 'slide_2',
        tag: 'دبلوم الجراحة الموجهة',
        title: 'الدليل الجراحي الرقمي',
        description: 'إتقان سير العمل الجراحي الرقمي من تخطيط الأشعة CBCT حتى طباعة الأدلة الجراحية ووضع الزرعات بدقة سريرية متناهية.',
        image: '',
        actionType: 'workshops',
        actionText: 'ورش العمل المتاحة',
        order: 2,
      ),
      HeroBannerSlideModel(
        id: 'slide_3',
        tag: 'تقنيات الابتسامة ثلاثية الأبعاد',
        title: 'معايرة طباعة الراتنج الطبي',
        description: 'تطبيقات عملية مباشرة على طابعات Formlabs و Phrozen لإنتاج نماذج الأسنان والتعويضات بدقة ميكرونية فائقة.',
        image: '',
        actionType: 'services',
        actionText: 'خدمات المختبر الرقمي',
        order: 3,
      ),
    ],
  );

  factory HeroBannerSettingsModel.fallback() => defaultFallback;
}

class UserProfileModel {
  final String name;
  final String phone;
  final String city;
  final String profession;
  final String photoUrl;
  final List<String> savedCourseIds;

  const UserProfileModel({
    this.name = '',
    this.phone = '',
    this.city = 'بغداد',
    this.profession = 'طبيب أسنان',
    this.photoUrl = '',
    this.savedCourseIds = const [],
  });

  factory UserProfileModel.fromMap(Map<String, dynamic>? data) {
    if (data == null) return const UserProfileModel();
    final rawSaved = data['savedCourseIds'];
    final savedList = <String>[];
    if (rawSaved is List) {
      for (final item in rawSaved) {
        if (item != null) savedList.add(item.toString());
      }
    }
    return UserProfileModel(
      name: data['name']?.toString() ?? '',
      phone: data['phone']?.toString() ?? '',
      city: data['city']?.toString() ?? 'بغداد',
      profession: data['profession']?.toString() ?? 'طبيب أسنان',
      photoUrl: data['photoUrl']?.toString() ?? '',
      savedCourseIds: savedList,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'phone': phone,
      'city': city,
      'profession': profession,
      'photoUrl': photoUrl,
      'savedCourseIds': savedCourseIds,
      'updatedAt': DateTime.now().toIso8601String(),
    };
  }
}

class UserCertificateModel {
  final String id;
  final String title;
  final String issueDate;
  final String serialNumber;
  final String instructor;
  final String credential;
  final String grade;
  final bool isVerified;

  const UserCertificateModel({
    required this.id,
    required this.title,
    required this.issueDate,
    required this.serialNumber,
    required this.instructor,
    required this.credential,
    this.grade = 'امتياز (Distinction)',
    this.isVerified = true,
  });

  factory UserCertificateModel.fromMap(String docId, Map<String, dynamic> data) {
    return UserCertificateModel(
      id: docId,
      title: data['title']?.toString() ?? '',
      issueDate: data['issueDate']?.toString() ?? '',
      serialNumber: data['serialNumber']?.toString() ?? 'DC-CERT-2026',
      instructor: data['instructor']?.toString() ?? 'الأكاديمية المعتمدة',
      credential: data['credential']?.toString() ?? 'شهادة إتمام معتمدة',
      grade: data['grade']?.toString() ?? 'امتياز',
      isVerified: data['isVerified'] as bool? ?? true,
    );
  }
}

class UserServiceRequestModel {
  final String id;
  final String title;
  final String caseType;
  final String date;
  final String status;
  final String statusLabel;
  final String price;
  final String notes;

  const UserServiceRequestModel({
    required this.id,
    required this.title,
    required this.caseType,
    required this.date,
    required this.status,
    required this.statusLabel,
    required this.price,
    this.notes = '',
  });

  factory UserServiceRequestModel.fromMap(String docId, Map<String, dynamic> data) {
    return UserServiceRequestModel(
      id: docId,
      title: data['title']?.toString() ?? '',
      caseType: data['caseType']?.toString() ?? '',
      date: data['date']?.toString() ?? '',
      status: data['status']?.toString() ?? 'in_progress',
      statusLabel: data['statusLabel']?.toString() ?? 'قيد التنفيذ',
      price: data['price']?.toString() ?? '',
      notes: data['notes']?.toString() ?? '',
    );
  }
}

class UserPaymentReceiptModel {
  final String id;
  final String title;
  final String amount;
  final String method;
  final String date;
  final String receiptNo;
  final String status;

  const UserPaymentReceiptModel({
    required this.id,
    required this.title,
    required this.amount,
    required this.method,
    required this.date,
    required this.receiptNo,
    this.status = 'مكتمل',
  });

  factory UserPaymentReceiptModel.fromMap(String docId, Map<String, dynamic> data) {
    return UserPaymentReceiptModel(
      id: docId,
      title: data['title']?.toString() ?? '',
      amount: data['amount']?.toString() ?? '',
      method: data['method']?.toString() ?? 'زين كاش (Zain Cash)',
      date: data['date']?.toString() ?? '',
      receiptNo: data['receiptNo']?.toString() ?? '',
      status: data['status']?.toString() ?? 'مكتمل',
    );
  }
}

