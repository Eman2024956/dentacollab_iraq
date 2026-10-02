/**
 * DentaCollab Synthetic Seed Data Script
 * Seeds all required mock data into Firebase project: dentacollab-iraq
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Initialize with service account certificate
if (getApps().length === 0) {
  const serviceAccountPaths = [
    path.resolve(process.cwd(), 'services_input/dentacollab-iraq-firebase-adminsdk-fbsvc-e9d37c7b74.json'),
    path.resolve(process.cwd(), 'apps/admin/service-account.json'),
    path.resolve(process.cwd(), 'dentacollab-iraq-firebase-adminsdk-fbsvc-e9d37c7b74.json'),
  ];

  let initialized = false;
  for (const p of serviceAccountPaths) {
    if (fs.existsSync(p)) {
      const sa = JSON.parse(fs.readFileSync(p, 'utf8'));
      initializeApp({
        credential: cert(sa),
        projectId: 'dentacollab-iraq',
        storageBucket: 'dentacollab-iraq.firebasestorage.app',
      });
      console.log(`🔑 Initialized Firebase Admin using service account: ${path.basename(p)}`);
      initialized = true;
      break;
    }
  }

  if (!initialized) {
    initializeApp({
      projectId: 'dentacollab-iraq',
    });
    console.log('⚠️ Initialized Firebase Admin using default credentials');
  }
}

const db = getFirestore();

async function seed() {
  console.log('🌱 Starting full DentaCollab mock data injection into Firestore (dentacollab-iraq)...');
  const nowIso = new Date().toISOString();

  // 1. App Settings
  console.log('📦 1/13 Writing appSettings/public...');
  await db.collection('appSettings').doc('public').set({
    academyName: {
      ar: 'أكاديمية DentaCollab لطب الأسنان الرقمي',
      en: 'DentaCollab Digital Dentistry Academy',
    },
    tagline: {
      ar: 'صمّم. خطّط. نفّذ.',
      en: 'Design. Plan. Execute.',
    },
    contactWhatsApp: 'https://wa.me/9647817828545',
    contactPhone: '+9647817828545',
    contactEmail: 'info@dentacollab.org',
    socialInstagram: 'https://www.instagram.com/dentacollab',
    socialFacebook: 'https://www.facebook.com/Digitaldentistrytrainingcourses',
    academyLocationAddress: {
      ar: 'بغداد، العراق — المنصور، قرب ساحة الرواد',
      en: 'Baghdad, Iraq — Al-Mansour, near Al-Rowad Sq.',
    },
    academyLocationMapUrl: 'https://maps.app.goo.gl/qJ7KMyB6dQEuxGQE7?g_st=ic',
    servicesCatalogEnabled: true,
    aiAssistantEnabled: true,
    currency: 'IQD',
    updatedAt: nowIso,
  }, { merge: true });

  // 2. Instructors
  console.log('📦 2/13 Writing instructors...');
  const instructors = [
    {
      id: 'dr-ammar-salieh',
      slug: 'dr-ammar-salieh',
      name: { ar: 'د. عمار صالح', en: 'Dr. Ammar Salieh' },
      title: {
        ar: 'أخصائي ومحاضر طب الأسنان الرقمي وتصميم الابتسامة',
        en: 'Digital Dentistry & Smile Design Specialist',
      },
      bio: {
        ar: 'خبير ومحاضر معتمد في سير العمل الرقمي وطباعة وتصميم التركيبات والزرعات الجراحية باستخدام Exocad و Exoplan.',
        en: 'Certified specialist and trainer in digital workflows, surgical guide planning, and 3D printing using Exocad and Exoplan.',
      },
      credentials: [
        { ar: 'خبير تصميم Exocad المعتمد', en: 'Certified Exocad Designer' },
        { ar: 'محاضر دولي في التخطيط الجراحي الرقمي', en: 'International Guided Surgery Lecturer' },
      ],
      sortOrder: 1,
      publicationStatus: 'published',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'dr-saif-alnasser',
      slug: 'dr-saif-alnasser',
      name: { ar: 'د. سيف الناصر', en: 'Dr. Saif Al-Nasser' },
      title: {
        ar: 'استشاري التصوير الإشعاعي المقطعي CBCT والتحليل الفكي',
        en: 'Consultant Maxillofacial Radiologist & CBCT Specialist',
      },
      bio: {
        ar: 'خبير في تحليل ومطابقة صور الأشعة المقطعية CBCT مع الموديلات الفكية الرقمية والتخطيط التشخيصي للزرعات.',
        en: 'Expert in CBCT scan interpretation and optical model matching for diagnostic implant treatment.',
      },
      credentials: [
        { ar: 'بورد الأشعة الفكية والوجهية', en: 'Board Certified Maxillofacial Radiologist' },
      ],
      sortOrder: 2,
      publicationStatus: 'published',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  for (const inst of instructors) {
    await db.collection('instructors').doc(inst.id).set(inst, { merge: true });
  }

  // 3. Courses, Modules, Cohorts
  console.log('📦 3/13 Writing courses, modules, and cohorts...');
  const courses = [
    {
      id: 'digital-dentistry-foundations',
      slug: 'digital-dentistry-foundations',
      title: {
        ar: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات',
        en: 'Digital Dentistry Foundations & Restorations',
      },
      description: {
        ar: 'مسار تدريبي عملي ينقلك من المسح داخل الفم إلى تصميم أول حالة عبر برمجية Exocad وتجهيزها للطباعة ثلاثية الأبعاد.',
        en: 'Hands-on practical training from digital intraoral scanning to your first Exocad restoration design and 3D printing.',
      },
      level: 'basic',
      deliveryMode: 'in_person',
      category: 'Exocad',
      coverImagePath: 'smale.jpg',
      instructorIds: ['dr-ammar-salieh'],
      publicationStatus: 'published',
      publishedAt: nowIso,
      sortOrder: 1,
      featured: true,
      priceMinorUnits: 450000,
      createdAt: nowIso,
      updatedAt: nowIso,
      modules: [
        {
          id: 'mod-1',
          title: { ar: 'المسح الرقمي والتحضير السريري', en: 'Digital scanning and prep' },
          orderIndex: 1,
          lessons: [
            { id: 'les-1', title: { ar: 'المسح داخل الفم وإعداد ملفات الحالة', en: 'Intraoral scanning and case setup' } },
            { id: 'les-2', title: { ar: 'تحديد خط الإنهاء والإطباق الرقمي', en: 'Margin line & bite registration' } },
          ],
        },
        {
          id: 'mod-2',
          title: { ar: 'تصميم التيجان والجسور ببرمجية Exocad', en: 'Crown & Bridge design with Exocad' },
          orderIndex: 2,
          lessons: [
            { id: 'les-3', title: { ar: 'مكتبات الأسنان والتنسيق الإطباقي', en: 'Tooth libraries & anatomical setup' } },
            { id: 'les-4', title: { ar: 'تصدير ملفات الإنتاج STL و CAM', en: 'Production STL & CAM export' } },
          ],
        },
      ],
    },
    {
      id: 'implant-planning',
      slug: 'implant-planning',
      title: {
        ar: 'تخطيط الزرعات والدليل الجراحي الرقمي',
        en: 'Implant Planning & Surgical Guides',
      },
      description: {
        ar: 'تعلّم التخطيط ثلاثي الأبعاد بالاعتماد على صور CBCT وتصميم الأدلة الجراحية بدقة عالية عبر Exoplan.',
        en: 'Master 3D surgical guide planning based on CBCT scans using Exoplan guided surgery software.',
      },
      level: 'advanced',
      deliveryMode: 'in_person',
      category: 'Exoplan',
      coverImagePath: 'exoplan.jpg',
      instructorIds: ['dr-ammar-salieh'],
      publicationStatus: 'published',
      publishedAt: nowIso,
      sortOrder: 2,
      featured: true,
      priceMinorUnits: 650000,
      createdAt: nowIso,
      updatedAt: nowIso,
      modules: [
        {
          id: 'mod-1',
          title: { ar: 'تطابق صور الأشعة المقطعية والموديل البصري', en: 'CBCT & optical scan matching' },
          orderIndex: 1,
          lessons: [
            { id: 'les-1', title: { ar: 'تحديد القناة العصبية ومسار الزرعة', en: 'Nerve tracing & implant axis' } },
            { id: 'les-2', title: { ar: 'تصدير الدليل ومعايرة التسامح المخروطي', en: 'Guide export & sleeve calibration' } },
          ],
        },
      ],
    },
    {
      id: 'dental-3d-printing',
      slug: 'dental-3d-printing',
      title: {
        ar: 'الطباعة ثلاثية الأبعاد لطب الأسنان',
        en: 'Dental 3D Printing Technologies',
      },
      description: {
        ar: 'حوّل التصاميم إلى نماذج دقيقة وعملية، وتعلّم معايرة الراتنجات وطرق الغسيل والمعالجة اللاحقة.',
        en: 'Transform digital files into production-ready dental models with slicing, printing, and UV curing.',
      },
      level: 'all_levels',
      deliveryMode: 'in_person',
      category: '3D Printing',
      coverImagePath: 'printer.jpg',
      instructorIds: ['dr-ammar-salieh'],
      publicationStatus: 'published',
      publishedAt: nowIso,
      sortOrder: 3,
      featured: true,
      priceMinorUnits: 350000,
      createdAt: nowIso,
      updatedAt: nowIso,
      modules: [
        {
          id: 'mod-1',
          title: { ar: 'برمجيات التقطيع وإعداد دعامات الطباعة', en: 'Slicing software and supports' },
          orderIndex: 1,
          lessons: [
            { id: 'les-1', title: { ar: 'معايرة طبقات الطباعة وسرعة الرفع', en: 'Layer height and lift speed calibration' } },
          ],
        },
      ],
    },
  ];

  for (const c of courses) {
    const { modules, ...courseData } = c;
    await db.collection('courses').doc(c.id).set(courseData, { merge: true });

    for (const m of modules) {
      await db.collection('courses').doc(c.id).collection('modules').doc(m.id).set(m, { merge: true });
    }

    const cohortId = `cohort-${c.id}-oct2026`;
    await db.collection('courseCohorts').doc(cohortId).set({
      id: cohortId,
      courseId: c.id,
      title: {
        ar: `دفعة تشرين الأول ٢٠٢٦ — ${c.title.ar}`,
        en: `October 2026 Cohort — ${c.title.en}`,
      },
      venueName: { ar: 'مقر أكاديمية DentaCollab — بغداد، المنصور', en: 'DentaCollab Academy Lab — Baghdad' },
      venueAddress: { ar: 'بغداد، المنصور، قرب ساحة الرواد', en: 'Baghdad, Al-Mansour' },
      startDateUtc: '2026-10-15T06:00:00Z',
      endDateUtc: '2026-10-30T12:00:00Z',
      timezone: 'Asia/Baghdad',
      scheduleSummary: { ar: 'الخميس والجمعة (٩:٠٠ ص - ٢:٠٠ م)', en: 'Thu & Fri (9:00 AM - 2:00 PM)' },
      maxCapacity: 12,
      reservedSeats: 8,
      waitlistCount: 1,
      price: {
        amountMinorUnits: c.priceMinorUnits,
        currency: 'IQD',
        exponent: 0,
      },
      registrationOpen: true,
      publicationStatus: 'published',
      createdAt: nowIso,
      updatedAt: nowIso,
    }, { merge: true });
  }

  // 4. Workshops & Sessions
  console.log('📦 4/13 Writing workshops and workshopSessions...');
  const workshops = [
    {
      id: 'digital-workflow-workshop',
      slug: 'digital-workflow-workshop',
      title: {
        ar: 'ورشة سير العمل الرقمي الشامل للعيادات',
        en: 'Comprehensive Digital Workflow Clinic Workshop',
      },
      description: {
        ar: 'ورشة مكثفة ليوم واحد تركز على الربط بين الماسح الفموي والتصميم المخبري والطباعة المباشرة في العيادة.',
        en: 'One-day intensive workshop connecting intraoral scanning, chairside CAD design, and 3D printing.',
      },
      coverImagePath: 'smale.jpg',
      instructor: 'د. عمار صالح',
      instructorIds: ['dr-ammar-salieh'],
      venue: 'مختبر الأكاديمية — بغداد، المنصور',
      date: 'الجمعة، ٢٤ تشرين الأول ٢٠٢٦',
      time: '٩:٠٠ ص - ٤:٠٠ م',
      maxCapacity: 15,
      reservedSeats: 11,
      price: '150,000 د.ع',
      publicationStatus: 'published',
      publishedAt: nowIso,
      sortOrder: 1,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'exoplan-guided-surgery-intensive',
      slug: 'exoplan-guided-surgery-intensive',
      title: {
        ar: 'ورشة الجراحة الموجهة المكثفة وتصميم الدليل الجراحي',
        en: 'Exoplan Guided Surgery & Surgical Guide Intensive',
      },
      description: {
        ar: 'تطبيق عملي فردي على تصميم وطباعة الأدلة الجراحية لحالات الزرع المفرد والمتعدد.',
        en: 'Hands-on individual practice designing and printing surgical guides for single and multi-unit implants.',
      },
      coverImagePath: 'exoplan.jpg',
      instructor: 'د. عمار صالح',
      instructorIds: ['dr-ammar-salieh'],
      venue: 'مقر الأكاديمية — بغداد',
      date: 'السبت، ٣١ تشرين الأول ٢٠٢٦',
      time: '١٠:٠٠ ص - ٥:٠٠ م',
      maxCapacity: 12,
      reservedSeats: 8,
      price: '200,000 د.ع',
      publicationStatus: 'published',
      publishedAt: nowIso,
      sortOrder: 2,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'clinical-dental-photography-digital-documentation',
      slug: 'clinical-dental-photography-digital-documentation',
      title: {
        ar: 'ورشة تصوير الأسنان السريري وتوثيق الحالات الرقمية',
        en: 'Clinical Dental Photography & Digital Documentation',
      },
      description: {
        ar: 'إتقان التصوير داخل وخارج الفم، معايرة الإضاءة والعدسات، والتوثيق لمعاملات تصميم الابتسامة الرقمية.',
        en: 'Master intraoral and portrait dental photography, lighting settings, and smile design documentation.',
      },
      coverImagePath: 'smale.jpg',
      instructor: 'د. عمار صالح',
      instructorIds: ['dr-ammar-salieh'],
      venue: 'مقر الأكاديمية — بغداد، المنصور',
      date: 'الخميس، ٥ تشرين الثاني ٢٠٢٦',
      time: '١٠:٠٠ ص - ٤:٠٠ م',
      maxCapacity: 10,
      reservedSeats: 4,
      price: '125,000 د.ع',
      publicationStatus: 'published',
      publishedAt: nowIso,
      sortOrder: 3,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  for (const w of workshops) {
    await db.collection('workshops').doc(w.id).set(w, { merge: true });

    const sessionId = `session-${w.id}-1`;
    await db.collection('workshopSessions').doc(sessionId).set({
      id: sessionId,
      workshopId: w.id,
      title: { ar: `جلسة مكثفة — ${w.title.ar}`, en: `Intensive Session — ${w.title.en}` },
      dateUtc: '2026-10-24T06:00:00Z',
      venueName: { ar: w.venue, en: 'Academy Baghdad Lab' },
      maxCapacity: w.maxCapacity,
      reservedSeats: w.reservedSeats,
      price: { amountMinorUnits: 150000, currency: 'IQD', exponent: 0 },
      createdAt: nowIso,
      updatedAt: nowIso,
    }, { merge: true });
  }

  // 5. Academy Services
  console.log('📦 5/13 Writing services collection...');
  const services = [
    {
      id: 'service_exocad_design',
      slug: 'exocad-restoration-design',
      title: { ar: 'خدمات التصميم الرقمي واستشارات Exocad', en: 'Digital Dentistry Consultation & Exocad Design' },
      summary: { ar: 'تصميم التيجان والجسور والابتسامة الرقمية للعيادات والمختبرات', en: 'Crown, bridge, and digital smile design for clinics and labs' },
      description: { ar: 'استشارات تخصصية وتصميم حالات معقدة للعيادات والمختبرات وفق أعلى معايير الدقة والجمالية.', en: 'Specialized consultations and complex restorative design according to clinical accuracy standards.' },
      category: 'التصميم الرقمي',
      coverImagePath: 'smale.jpg',
      priceMode: 'quote',
      turnaroundSummary: { ar: 'خلال ٢٤ - ٤٨ ساعة', en: 'Within 24 - 48 hours' },
      featured: true,
      publicationStatus: 'published',
      sortOrder: 1,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'service_exoplan_guides',
      slug: 'exoplan-surgical-guides',
      title: { ar: 'تخطيط الزرعات وتصميم الأدلة الجراحية (Exoplan)', en: 'Guided Surgery Planning & Exoplan Guides' },
      summary: { ar: 'تخطيط دقيق استناداً لصور CBCT والموديلات الرقمية', en: 'Precise guided planning based on CBCT scans and optical impressions' },
      description: { ar: 'تصميم أدلة جراحية موجهة تضمن دقة غرس الزرعات وتقليل زمن الجراحة والألم للمريض.', en: 'Guided surgical guide design ensuring implant trajectory accuracy and reduced surgery time.' },
      category: 'زرعات موجهة',
      coverImagePath: 'exoplan.jpg',
      priceMode: 'quote',
      turnaroundSummary: { ar: 'خلال ٤٨ ساعة', en: 'Within 48 hours' },
      featured: true,
      publicationStatus: 'published',
      sortOrder: 2,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'service_3d_printing',
      slug: 'dental-3d-printing-service',
      title: { ar: 'طباعة النماذج ثلاثية الأبعاد ومعايرة الراتنجات', en: 'Dental 3D Printing & Model Production' },
      summary: { ar: 'طباعة نماذج وأدلة براتنجات حيوية معتمدة', en: '3D printing models and surgical guides with biocompatible resins' },
      description: { ar: 'تحويل ملفات الـ STL إلى منتجات مطبوعة جاهزة للاستخدام السريري مع معالجة ضوئية متقدمة.', en: 'Transforming STL files into clinic-ready printed models with post-curing.' },
      category: 'طباعة 3D',
      coverImagePath: 'printer.jpg',
      priceMode: 'starting_from',
      startingPrice: { amountMinorUnits: 35000, currency: 'IQD', exponent: 0 },
      turnaroundSummary: { ar: 'نفس اليوم / ٢٤ ساعة', en: 'Same day / 24 hours' },
      featured: true,
      publicationStatus: 'published',
      sortOrder: 3,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'service_cbct-optical-matching-diagnostic-planning',
      slug: 'cbct-optical-matching-diagnostic-planning',
      title: { ar: 'خدمة فحص ومطابقة ملفات CBCT والتصوير المقطعي', en: 'CBCT Optical Matching & Diagnostic Planning' },
      summary: { ar: 'مطابقة ملفات DICOM مع النماذج البصرية ثلاثية الأبعاد', en: 'DICOM and optical scan alignment for accurate diagnosis' },
      description: { ar: 'دمج ومعايرة بيانات التصوير المقطعي CBCT مع الماسح الفموي Intraoral بدقة تصل إلى 0.05mm لتشخيص متناهي الدقة.', en: 'Precision fusion of volumetric CBCT data with surface scans.' },
      category: 'فحص ومطابقة',
      priceMode: 'quote',
      turnaroundSummary: { ar: 'خلال ٢٤ ساعة', en: 'Within 24 hours' },
      featured: true,
      publicationStatus: 'published',
      sortOrder: 4,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  for (const s of services) {
    await db.collection('services').doc(s.id).set(s, { merge: true });
  }

  // 6. Service Requests
  console.log('📦 6/13 Writing serviceRequests collection...');
  const serviceRequests = [
    {
      id: 'req_demo_01',
      uid: 'user_1',
      serviceId: 'service_exoplan_guides',
      serviceTitle: 'تخطيط الزرعات وتصميم الأدلة الجراحية (Exoplan)',
      studentName: 'د. علي حسين السعدي',
      studentEmail: 'ali.saadi@example.com',
      studentPhone: '+964 781 782 8545',
      description: 'طلب تخطيط زرعة للسن رقم 36 وتصميم دليل جراحي متوافق مع نظام أكمام 4.2mm، تم تجهيز ملف CBCT و STL.',
      preferredContactMethod: 'whatsapp',
      quotedPrice: { amountMinorUnits: 120000, currency: 'IQD', exponent: 0 },
      adminNotes: 'تم استلام الملفات وجارِ مطابقة البيانات الفكية',
      status: 'under_review',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'req_demo_02',
      uid: 'user_2',
      serviceId: 'service_exocad_design',
      serviceTitle: 'خدمات التصميم الرقمي واستشارات Exocad',
      studentName: 'د. فاطمة مهدي الرديني',
      studentEmail: 'fatima.mahdi@example.com',
      studentPhone: '+964 770 987 6543',
      description: 'تصميم جسر زيركونيا مكون من 4 وحدات (11 to 23) مع محاكاة ابتسامة رقمية 2D-to-3D.',
      preferredContactMethod: 'whatsapp',
      quotedPrice: { amountMinorUnits: 80000, currency: 'IQD', exponent: 0 },
      adminNotes: 'اكتمل التصميم وتم إرسال صور المعاينة ثلاثية الأبعاد للطبيبة',
      status: 'completed',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'req_demo_03',
      uid: 'user_3',
      serviceId: 'service_3d_printing',
      serviceTitle: 'طباعة النماذج ثلاثية الأبعاد ومعايرة الراتنجات',
      studentName: 'د. سرمد عبد الكريم',
      studentEmail: 'sarmad.k@example.com',
      studentPhone: '+964 750 456 7890',
      description: 'طباعة 4 نماذج فكية مجوفة براتنج عالي الدقة (50 micron) مع معالجة UV نهائية.',
      preferredContactMethod: 'phone',
      quotedPrice: { amountMinorUnits: 70000, currency: 'IQD', exponent: 0 },
      adminNotes: 'قيد الطباعة على أجهزة Anycubic M5s بمختبر الأكاديمية',
      status: 'in_progress',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  for (const req of serviceRequests) {
    await db.collection('serviceRequests').doc(req.id).set(req, { merge: true });
  }

  // 7. Users / Student Directory
  console.log('📦 7/13 Writing users & students collection...');
  const users = [
    {
      uid: 'user_1',
      displayName: 'د. علي حسين السعدي',
      email: 'ali.saadi@example.com',
      phoneNumber: '+964 781 782 8545',
      city: 'بغداد',
      profession: 'طبيب أسنان عام',
      role: 'student',
      enrolledCourses: ['digital-dentistry-foundations'],
      attendanceRate: '١٠٠٪ (حاضر)',
      status: 'active',
      createdAt: nowIso,
    },
    {
      uid: 'user_2',
      displayName: 'د. فاطمة مهدي الرديني',
      email: 'fatima.mahdi@example.com',
      phoneNumber: '+964 770 987 6543',
      city: 'النجف الأشرف',
      profession: 'أخصائية جراحة وجه وفكين',
      role: 'student',
      enrolledCourses: ['implant-planning'],
      attendanceRate: '١٠٠٪ (حاضر)',
      status: 'active',
      createdAt: nowIso,
    },
    {
      uid: 'user_3',
      displayName: 'د. سرمد عبد الكريم',
      email: 'sarmad.k@example.com',
      phoneNumber: '+964 750 456 7890',
      city: 'أربيل',
      profession: 'تقني أسنان / مصمم CAD/CAM',
      role: 'student',
      enrolledCourses: ['dental-3d-printing'],
      attendanceRate: 'قيد المتابعة',
      status: 'active',
      createdAt: nowIso,
    },
    {
      uid: 'user_4',
      displayName: 'د. مريم الخفاجي',
      email: 'maryam.k@example.com',
      phoneNumber: '+964 771 234 5678',
      city: 'البصرة',
      profession: 'طبيبة تركيبات وتجميل أسنان',
      role: 'student',
      enrolledCourses: ['digital-dentistry-foundations', 'implant-planning'],
      attendanceRate: '١٠٠٪ (حاضر)',
      status: 'active',
      createdAt: nowIso,
    },
  ];

  for (const u of users) {
    await db.collection('users').doc(u.uid).set(u, { merge: true });
    // Also mirror to students collection for direct queries
    await db.collection('students').doc(u.uid).set(u, { merge: true });
  }

  // 8. Enrollments & Attendance
  console.log('📦 8/13 Writing enrollments & attendance...');
  const enrollmentsData = [
    {
      id: 'enr_ali_saadi_01',
      uid: 'user_1',
      studentName: 'د. علي حسين السعدي',
      studentEmail: 'ali.saadi@example.com',
      studentPhone: '+964 781 782 8545',
      courseId: 'digital-dentistry-foundations',
      courseTitle: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات (Exocad)',
      cohortId: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'enrolled',
      paymentStatus: 'paid',
      amountPaid: '450,000 د.ع',
      passToken: 'dc_pass_ali_saadi_exocad_2026',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'enr_fatima_02',
      uid: 'user_2',
      studentName: 'د. فاطمة مهدي الرديني',
      studentEmail: 'fatima.mahdi@example.com',
      studentPhone: '+964 770 987 6543',
      courseId: 'implant-planning',
      courseTitle: 'تخطيط الزرعات والدليل الجراحي الرقمي (Exoplan)',
      cohortId: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'enrolled',
      paymentStatus: 'paid',
      amountPaid: '650,000 د.ع',
      passToken: 'dc_pass_fatima_exoplan_2026',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'enr_sarmad_03',
      uid: 'user_3',
      studentName: 'د. سرمد عبد الكريم',
      studentEmail: 'sarmad.k@example.com',
      studentPhone: '+964 750 456 7890',
      courseId: 'dental-3d-printing',
      courseTitle: 'الطباعة ثلاثية الأبعاد لطب الأسنان (3D Printing)',
      cohortId: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'enrolled',
      paymentStatus: 'paid',
      amountPaid: '350,000 د.ع',
      passToken: 'dc_pass_sarmad_3dprint_2026',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'enr_maryam_04',
      uid: 'user_4',
      studentName: 'د. مريم الخفاجي',
      studentEmail: 'maryam.k@example.com',
      studentPhone: '+964 771 234 5678',
      courseId: 'digital-dentistry-foundations',
      courseTitle: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات (Exocad)',
      cohortId: 'دفعة تشرين الأول ٢٠٢٦',
      status: 'enrolled',
      paymentStatus: 'paid',
      amountPaid: '450,000 د.ع',
      passToken: 'dc_pass_maryam_exocad_2026',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  for (const enr of enrollmentsData) {
    await db.collection('enrollments').doc(enr.id).set(enr, { merge: true });

    // Sync QR Pass into attendance collection
    await db.collection('attendance').doc(enr.passToken).set({
      id: enr.passToken,
      enrollmentId: enr.id,
      uid: enr.uid,
      studentName: enr.studentName,
      courseTitle: enr.courseTitle,
      checkedIn: false,
      validFrom: nowIso,
      status: 'confirmed',
      createdAt: nowIso,
    }, { merge: true });
  }

  // 9. Support Tickets
  console.log('📦 9/13 Writing supportTickets collection...');
  const supportTickets = [
    {
      id: 'ticket_1',
      uid: 'user_1',
      studentName: 'د. علي حسين السعدي',
      studentEmail: 'ali.saadi@example.com',
      studentPhone: '+964 781 782 8545',
      subject: 'استفسار عن متطلبات حاسوب Exocad للجلسة الثانية',
      category: 'مناهج تدريبية',
      status: 'open',
      createdAt: nowIso,
      messages: [
        {
          sender: 'د. علي حسين السعدي',
          isStaff: false,
          time: '١١:٣٠ ص',
          content: 'السلام عليكم دكتور، هل أحتاج لجلب اللابتوب الخاص بي معي للجلسة القادمة، أم أن جميع محطات العمل في المختبر مجهزة بـ Exocad مع التراخيص؟',
        },
        {
          sender: 'فريق دعم DentaCollab',
          isStaff: true,
          time: '١١:٤٥ ص',
          content: 'وعليكم السلام دكتور علي. جميع مقاعد المختبر في بغداد مجهزة بحواسيب Workstation متوافقة بالكامل وتراخيص Exocad نشطة، جلب لابتوبك اختياري لحفظ مشاريعك الشخصية فقط.',
        },
      ],
    },
    {
      id: 'ticket_2',
      uid: 'user_2',
      studentName: 'د. فاطمة مهدي الرديني',
      studentEmail: 'fatima.mahdi@example.com',
      studentPhone: '+964 770 987 6543',
      subject: 'طلب تمديد فترة تحميل ملفات الـ STL التوضيحية',
      category: 'شهادات وملفات',
      status: 'resolved',
      createdAt: nowIso,
      messages: [
        {
          sender: 'د. فاطمة مهدي',
          isStaff: false,
          time: '٠٢:١٥ م',
          content: 'أرجو إعادة إرسال رابط تحميل حالات الجراحة الموجهة التجريبية لبرنامج Exoplan.',
        },
        {
          sender: 'فريق دعم DentaCollab',
          isStaff: true,
          time: '٠٢:٣٠ م',
          content: 'أهلاً دكتورة فاطمة، تم تفعيل صلاحية التحميل المباشر للحالات من تبويب حسابي داخل تطبيق الهاتف.',
        },
      ],
    },
  ];

  for (const t of supportTickets) {
    await db.collection('supportTickets').doc(t.id).set(t, { merge: true });
  }

  // 10. Public Notifications
  console.log('📦 10/13 Writing publicNotifications collection...');
  const notifications = [
    {
      id: 'notif_welcome',
      title: {
        ar: 'أهلاً بك في أكاديمية DentaCollab لطب الأسنان الرقمي',
        en: 'Welcome to DentaCollab Digital Dentistry Academy',
      },
      body: {
        ar: 'انطلاق التسجيل في دورات تشرين الأول ٢٠٢٦ لبرمجيات Exocad و Exoplan بمقرنا في بغداد.',
        en: 'Registration is now open for October 2026 Exocad and Exoplan cohorts in Baghdad.',
      },
      topic: 'all_customers',
      routeKey: 'courses',
      sentAt: nowIso,
    },
    {
      id: 'notif_workshop_announcement',
      title: {
        ar: 'ورشة عمل مكثفة: الجراحة الموجهة ببرمجية Exoplan',
        en: 'Intensive Workshop: Guided Surgery with Exoplan',
      },
      body: {
        ar: 'مقاعد محدودة متوفرة لورشة السبت القادم بمختبر المنصور في بغداد مع تطبيق عملي فردي.',
        en: 'Limited seats available for upcoming Saturday hands-on lab session in Baghdad.',
      },
      topic: 'all_customers',
      routeKey: 'workshops',
      sentAt: nowIso,
    },
  ];

  for (const n of notifications) {
    await db.collection('publicNotifications').doc(n.id).set(n, { merge: true });
  }

  // 11. FAQs
  console.log('📦 11/13 Writing faqs collection...');
  const faqs = [
    {
      id: 'faq-1',
      question: {
        ar: 'أين يقع مقر أكاديمية DentaCollab في بغداد؟',
        en: 'Where is DentaCollab Academy located in Baghdad?',
      },
      answer: {
        ar: 'يقع مقر ومختبر الأكاديمية في بغداد — منطقة المنصور، قرب ساحة الرواد. المختبر مجهز بأحدث محطات العمل وبرمجيات Exocad المرخصة وماسحات ضوئية وطابعات 3D.',
        en: 'Our academy and lab are located in Baghdad — Al-Mansour near Al-Rowad Square, equipped with licensed Exocad workstations, scanners, and 3D printers.',
      },
      category: 'general',
      sortOrder: 1,
    },
    {
      id: 'faq-2',
      question: {
        ar: 'كيف أستلم بطاقة الحضور الميداني (QR Pass)؟',
        en: 'How do I receive my in-person QR Entry Pass?',
      },
      answer: {
        ar: 'بمجرد تأكيد حجز مقعدك في أي دورة أو ورشة عمل، تظهر بطاقة الدخول الرقمية المشفرة مباشرة في شاشة "تعلّمي" داخل التطبيق، وتقوم بمسحها عند مدخل المختبر.',
        en: 'As soon as your enrollment is confirmed, your encrypted digital QR pass appears in the "My Learning" tab, scanned by academy staff upon entry.',
      },
      category: 'enrollment',
      sortOrder: 2,
    },
    {
      id: 'faq-3',
      question: {
        ar: 'هل تُمنح شهادة معتمدة بعد إتمام الدورة؟',
        en: 'Do I receive a certified certificate upon completion?',
      },
      answer: {
        ar: 'نعم، يحصل المتدرب على شهادة إتمام معتمدة من DentaCollab تثبت عدد الساعات التدريبية والمحاور المتقنة في طب الأسنان الرقمي والتصميم ثلاثي الأبعاد.',
        en: 'Yes, students receive a verified DentaCollab certificate detailing clinical hours and certified competency in digital dentistry design.',
      },
      category: 'certificates',
      sortOrder: 3,
    },
  ];

  for (const f of faqs) {
    await db.collection('faqs').doc(f.id).set(f, { merge: true });
  }

  // 12. Graduates / Testimonials
  console.log('📦 12/15 Writing graduates collection...');
  const graduates = [
    {
      id: 'grad-1',
      name: { ar: 'د. علي حسين السعدي', en: 'Dr. Ali Hussain Al-Saadi' },
      course: { ar: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات', en: 'Digital Dentistry Foundations & Restorations' },
      quote: {
        ar: 'الدورة نقلت عمل عيادتي بالكامل من الطريقة التقليدية إلى المسح والتصميم الرقمي عبر Exocad. التطبيق العملي الفردي في مختبر المنصور كان مبهراً.',
        en: 'The course completely transformed my clinic practice to digital scanning and Exocad restorative design. The hands-on practice in Baghdad was stellar.',
      },
      rating: 5,
      city: 'بغداد',
      createdAt: nowIso,
    },
    {
      id: 'grad-2',
      name: { ar: 'د. فاطمة مهدي الرديني', en: 'Dr. Fatima Mahdi Al-Rudaini' },
      course: { ar: 'تخطيط الزرعات والدليل الجراحي الرقمي', en: 'Implant Planning & Surgical Guides' },
      quote: {
        ar: 'إتقان برنامج Exoplan وتصميم الأدلة الجراحية الموجهة أعطاني ثقة ودقة مضاعفة أثناء غرس الزرعات في العمليات السريرية.',
        en: 'Mastering Exoplan and custom surgical guide design gave me tremendous confidence and accuracy in clinical implant placements.',
      },
      rating: 5,
      city: 'النجف الأشرف',
      createdAt: nowIso,
    },
    {
      id: 'grad-3',
      name: { ar: 'د. سرمد عبد الكريم', en: 'Dr. Sarmad Abdul-Karim' },
      course: { ar: 'الطباعة ثلاثية الأبعاد لطب الأسنان', en: 'Dental 3D Printing' },
      quote: {
        ar: 'أفضل استثمار لتقنيي وأطباء الأسنان، تعلمنا معايرة طابعات الراتنج وغسيل ومعالجة النماذج بدون أي أخطاء في الإطباق.',
        en: 'The best training investment for dental labs and doctors; we learned resin calibration and post-curing without occlusion discrepancies.',
      },
      rating: 5,
      city: 'أربيل',
      createdAt: nowIso,
    },
    {
      id: 'grad-4',
      name: { ar: 'د. مريم الخفاجي', en: 'Dr. Maryam Al-Khafaji' },
      course: { ar: 'أساسيات طب الأسنان الرقمي وتصميم التركيبات', en: 'Digital Dentistry Foundations & Restorations' },
      quote: {
        ar: 'التدريب العملي كان خطوة بخطوة مع الدكتور عمار، استطعنا تصميم ابتسامة كاملة وطباعتها وتجربتها في نفس اليوم.',
        en: 'Hands-on individual practice with Dr. Ammar; we designed a full smile restoration, printed it, and evaluated it on the same day.',
      },
      rating: 5,
      city: 'البصرة',
      createdAt: nowIso,
    },
  ];

  for (const g of graduates) {
    await db.collection('graduates').doc(g.id).set(g, { merge: true });
  }

  // 13. Gallery
  console.log('📦 13/15 Writing gallery collection...');
  const gallery = [
    {
      id: 'gal-1',
      title: { ar: 'من التصميم الرقمي إلى التطبيق السريري', en: 'From digital design to clinical reality' },
      description: { ar: 'مراحل سير العمل الرقمي الشامل داخل مختبر الأكاديمية ببغداد', en: 'Full digital workflow stages in our Baghdad academy lab' },
      images: ['step-1.jpg', 'step-2.jpg', 'step-3.jpg', 'step-4.jpg'],
      sortOrder: 1,
      createdAt: nowIso,
    },
    {
      id: 'gal-2',
      title: { ar: 'التقنيات ومحطات العمل الرقمية', en: 'Digital technology & workstations' },
      description: { ar: 'أجهزة مسح ضوئي، حواسيب Exocad المرخصة، وطابعات Formlabs ثلاثية الأبعاد', en: 'Scanners, licensed Exocad workstations, and 3D resin printers' },
      images: ['smale.jpg', 'exoplan.jpg', 'printer.jpg'],
      sortOrder: 2,
      createdAt: nowIso,
    },
  ];

  for (const gal of gallery) {
    await db.collection('gallery').doc(gal.id).set(gal, { merge: true });
  }

  // 14. Audit Logs
  console.log('📦 14/15 Writing auditLogs collection...');
  const auditEntries = [
    {
      action: 'system.seed',
      summary: 'حقن البيانات النموذجية الشاملة للأكاديمية والخدمات الرقمية في Firestore',
      admin: 'admin@dentacollab.org',
      timestamp: nowIso,
    },
    {
      action: 'course.publish',
      summary: 'نشر دبلوم المسح الفموي الرقمي المتقدم وتثبيت رسوم التسجيل',
      admin: 'admin@dentacollab.org',
      timestamp: nowIso,
    },
    {
      action: 'service.create',
      summary: 'تفعيل خدمة فحص ومطابقة ملفات CBCT والتصوير المقطعي في دليل الأكاديمية',
      admin: 'admin@dentacollab.org',
      timestamp: nowIso,
    },
  ];

  for (const log of auditEntries) {
    await db.collection('auditLogs').add(log);
  }

  // 15. Super Admin & Staff Records
  console.log('📦 15/15 Verifying staffMemberships & admin records...');
  await db.collection('staffMemberships').doc('admin@dentacollab.org').set({
    email: 'admin@dentacollab.org',
    role: 'super_admin',
    displayName: 'المشرف الأكاديمي العام',
    permissions: ['*'],
    isActive: true,
    updatedAt: nowIso,
  }, { merge: true });

  console.log('════════════════════════════════════════════════════════════════');
  console.log('🎉 SUCCESS: All mock data injected into Firebase project: dentacollab-iraq');
  console.log('Collections seeded:');
  console.log('  ✓ appSettings');
  console.log('  ✓ instructors');
  console.log('  ✓ courses & modules');
  console.log('  ✓ courseCohorts');
  console.log('  ✓ workshops');
  console.log('  ✓ workshopSessions');
  console.log('  ✓ services');
  console.log('  ✓ serviceRequests');
  console.log('  ✓ users & students');
  console.log('  ✓ enrollments');
  console.log('  ✓ attendance');
  console.log('  ✓ supportTickets');
  console.log('  ✓ publicNotifications');
  console.log('  ✓ faqs');
  console.log('  ✓ auditLogs');
  console.log('  ✓ staffMemberships');
  console.log('════════════════════════════════════════════════════════════════');
}

seed().catch((err) => {
  console.error('❌ Data injection failed:', err);
  process.exit(1);
});
