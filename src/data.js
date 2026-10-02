// Editable bilingual content. These records are illustrative, not live academy data.
export const bi = (ar, en) => ({ ar, en });
export const settings = {
  sampleData: true,
  whatsapp: "https://wa.me/9647817828545",
  instagram: "https://www.instagram.com/dentacollab",
  facebook: "https://www.facebook.com/Digitaldentistrytrainingcourses",
  maps: "https://maps.app.goo.gl/qJ7KMyB6dQEuxGQE7?g_st=ic",
  // Optional: your OWN backend. Never put a secret API key in browser code.
  apiBase: import.meta.env.VITE_API_BASE || "",
};
export const routes = [
  "/",
  "/about",
  "/courses",
  "/courses/:slug",
  "/workshops",
  "/workshops/:slug",
  "/instructors",
  "/instructors/:id",
  "/benefits",
  "/gallery",
  "/graduates",
  "/testimonials",
  "/faq",
  "/chat",
  "/contact",
  "/payments/success",
  "/payments/failed",
  "/payments/cancel",
];
export const nav = [
  ["/", bi("الرئيسية", "Home")],
  ["/courses", bi("الدورات", "Courses")],
  ["/graduates", bi("الخريجون", "Graduates")],
  ["/instructors", bi("المدربون", "Instructors")],
  ["/gallery", bi("المعرض", "Gallery")],
  ["/about", bi("عن الأكاديمية", "About")],
  ["/contact", bi("تواصل", "Contact")],
];
export const specialties = [
  {
    title: bi("التصميم الرقمي", "Digital design"),
    body: bi(
      "تصميم التركيبات والابتسامة عبر Exocad بمسار عملي واضح.",
      "Design restorations and smiles through a practical Exocad workflow.",
    ),
    image: "smale.jpg",
    badge: "EXOCAD",
  },
  {
    title: bi("تخطيط الزرعات", "Implant planning"),
    body: bi(
      "تخطيط دقيق وموجّه للحالات الجراحية.",
      "Precise, guided planning for surgical cases.",
    ),
    image: "exoplan.jpg",
    badge: "EXOPLAN",
  },
  {
    title: bi("الطباعة ثلاثية الأبعاد", "3D printing"),
    body: bi(
      "من الملف الرقمي إلى نموذج جاهز للاستخدام.",
      "From a digital file to a production-ready model.",
    ),
    image: "printer.jpg",
    badge: "FORMLABS",
  },
];
export const courses = [
  {
    slug: "digital-dentistry-foundations",
    title: bi("أساسيات طب الأسنان الرقمي", "Digital Dentistry Foundations"),
    description: bi(
      "ابدأ رحلتك من المسح الرقمي إلى تصميم أول حالة، ضمن مسار تدريبي عملي.",
      "Build a practical foundation, from digital scanning to designing your first case.",
    ),
    image: "smale.jpg",
    level: bi("أساسي", "Basic"),
    duration: bi("٤ أسابيع", "4 weeks"),
    instructor: "sample-instructor",
    modules: [
      bi("مقدمة في سير العمل الرقمي", "Introduction to digital workflows"),
      bi("المسح والتحضير الرقمي", "Scanning and digital preparation"),
      bi("تصميم التركيبات باستخدام Exocad", "Restoration design with Exocad"),
      bi("التطبيق العملي ومراجعة الحالات", "Hands-on practice and case review"),
    ],
  },
  {
    slug: "implant-planning",
    title: bi(
      "تخطيط الزرعات والدليل الجراحي",
      "Implant Planning & Surgical Guides",
    ),
    description: bi(
      "اكتشف أدوات التخطيط الرقمي وتصميم الأدلة الجراحية عبر حالات تدريبية.",
      "Explore digital planning and surgical guide design through training cases.",
    ),
    image: "exoplan.jpg",
    level: bi("متقدم", "Advanced"),
    duration: bi("٣ أسابيع", "3 weeks"),
    instructor: "sample-instructor",
    modules: [
      bi("تحليل الحالة", "Case analysis"),
      bi("التخطيط الرقمي", "Digital planning"),
      bi("تصميم الدليل الجراحي", "Surgical guide design"),
    ],
  },
  {
    slug: "dental-3d-printing",
    title: bi("الطباعة ثلاثية الأبعاد لطب الأسنان", "Dental 3D Printing"),
    description: bi(
      "حوّل التصميم إلى نموذج مطبوع وتعلّم إعداد الملفات والطباعة والمعالجة.",
      "Bring designs to life with file preparation, printing and post-processing.",
    ),
    image: "printer.jpg",
    level: bi("جميع المستويات", "All levels"),
    duration: bi("أسبوعان", "2 weeks"),
    instructor: "sample-instructor",
    modules: [
      bi("إعداد ملف STL", "Preparing an STL file"),
      bi("الطباعة والمواد", "Printing and materials"),
      bi("المعالجة وضبط الجودة", "Post-processing and quality control"),
    ],
  },
];
export const instructors = [
  {
    id: "sample-instructor",
    name: bi("مدرب توضيحي", "Sample instructor"),
    title: bi(
      "مدرب طب الأسنان الرقمي — بيانات تجريبية",
      "Digital dentistry trainer — sample data",
    ),
    image: "dr-ammar.png",
    bio: bi(
      "نموذج لملف المدرب يوضح طريقة عرض الخبرة والسيرة المهنية والشهادات والبرامج التدريبية. استبدل هذه البيانات بمعلومات المدرب المعتمدة.",
      "A demonstration profile showing biography, experience, credentials and linked courses. Replace this record with verified instructor information.",
    ),
    credentials: [
      bi("التصميم الرقمي", "Digital design"),
      bi("التخطيط الرقمي", "Digital planning"),
    ],
  },
];
export const workshops = [
  {
    slug: "digital-workflow-workshop",
    title: bi("ورشة سير العمل الرقمي", "Digital Workflow Workshop"),
    description: bi(
      "جلسة تدريبية توضيحية تجمع التصميم الرقمي والطباعة ثلاثية الأبعاد.",
      "An illustrative hands-on session connecting digital design and 3D printing.",
    ),
    image: "steps.jpg",
    schedule: bi(
      "موعد تجريبي — يُحدد لاحقاً",
      "Sample schedule — to be announced",
    ),
  },
];
export const faqs = [
  {
    category: bi("التسجيل", "Registration"),
    q: bi("كيف أسجّل في إحدى الدورات؟", "How do I register for a course?"),
    a: bi(
      "اختر الدورة، راجع تفاصيلها، ثم املأ استمارة التسجيل. هذه النسخة تعرض النموذج فقط ولا تنشئ حجزاً حقيقياً.",
      "Choose a course, review its details and complete the registration form. This design preview does not create a real booking.",
    ),
  },
  {
    category: bi("التسجيل", "Registration"),
    q: bi(
      "هل تناسب الدورات المبتدئين؟",
      "Are the courses suitable for beginners?",
    ),
    a: bi(
      "توضح صفحة كل برنامج المستوى والمتطلبات. اختر البرنامج المناسب لخبرتك، واستفسر من الأكاديمية قبل التسجيل.",
      "Each program lists its level and prerequisites. Choose a suitable program and confirm the requirements with the academy.",
    ),
  },
  {
    category: bi("التدريب", "Training"),
    q: bi("هل التدريب عملي؟", "Is the training hands-on?"),
    a: bi(
      "يركز تصميم البرامج على الجمع بين المعرفة والتطبيق، من التصميم إلى النتيجة المطبوعة.",
      "The programs connect theory and practical work, from design to the printed result.",
    ),
  },
  {
    category: bi("التدريب", "Training"),
    q: bi(
      "هل أحتاج إلى تجهيز البرامج مسبقاً؟",
      "Do I need to install software beforehand?",
    ),
    a: bi(
      "توضح تفاصيل الدورة التجهيزات المتاحة داخل الأكاديمية. يرجى تأكيد المتطلبات مع فريق التسجيل.",
      "Course details describe the equipment available at the academy. Confirm requirements with the registration team.",
    ),
  },
  {
    category: bi("الشهادات", "Certificates"),
    q: bi("كيف أستفسر عن الشهادة؟", "How can I ask about certification?"),
    a: bi(
      "تواصل مع فريق الأكاديمية لمعرفة شروط الشهادة الخاصة بالبرنامج الذي تختاره.",
      "Contact the academy to confirm certificate requirements for your chosen program.",
    ),
  },
];
export const graduates = [1, 2, 3].map((n) => ({
  id: n,
  name: bi(`خريج تجريبي ${n}`, `Sample graduate ${n}`),
  course: courses[n - 1].title,
  quote: bi(
    "هذا نص تجريبي لعرض تصميم بطاقة التقييم، وليس شهادة حقيقية من أحد المتدربين.",
    "This is sample text demonstrating a review card, not a real student testimonial.",
  ),
  rating: 5,
}));
export const gallery = [
  {
    title: bi("من التصميم إلى الواقع", "From design to reality"),
    description: bi(
      "مراحل سير العمل الرقمي",
      "The stages of a digital workflow",
    ),
    images: ["step-1.jpg", "step-2.jpg", "step-3.jpg", "step-4.jpg"],
  },
  {
    title: bi("التقنيات الرقمية", "Digital technology"),
    description: bi(
      "التصميم والتخطيط والطباعة",
      "Design, planning and printing",
    ),
    images: ["smale.jpg", "exoplan.jpg", "printer.jpg"],
  },
];
