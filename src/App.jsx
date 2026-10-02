import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  bi,
  settings,
  nav,
  courses,
  instructors,
  workshops,
  faqs,
  graduates,
  gallery,
  specialties,
} from "./data.js";
import { syncLiveData } from "./dynamicContent.js";

const UI = createContext(null);
function useUI() {
  return useContext(UI);
}
const img = (name) => "/assets/" + name;
function readPref(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
function savePref(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Private browsing may disable storage. */
  }
}
function Text({ value }) {
  const { locale } = useUI();
  return value?.[locale] ?? value;
}
function Link({ to, children, className = "", ...props }) {
  const { navigate } = useUI();
  return (
    <a
      href={to}
      className={className}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (
          !e.defaultPrevented &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          e.button === 0 &&
          to.startsWith("/")
        ) {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
}
function ButtonLink({ to, children, secondary = false }) {
  return (
    <Link to={to} className={"button " + (secondary ? "secondary" : "")}>
      {children}
    </Link>
  );
}
function Brand({ footer = false }) {
  return (
    <Link
      to="/"
      className={"brand " + (footer ? "footer-brand" : "")}
      aria-label="DentaCollab"
    >
      <img src={img("logo.png")} alt="" />
      <span dir="ltr">
        <span>
          <b>DENTA</b>COLLAB
        </span>
        <small>DIGITAL DENTISTRY ACADEMY</small>
      </span>
    </Link>
  );
}
function Header() {
  const { t, locale, setLocale, dark, setDark, path } = useUI();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="header">
      <div className="container header-row">
        <Brand />
        <nav
          aria-label={t("التنقل الرئيسي", "Main navigation")}
          className={open ? "navigation open" : "navigation"}
        >
          {nav.map(([href, label]) => (
            <Link
              key={href}
              to={href}
              aria-current={path === href ? "page" : undefined}
            >
              <Text value={label} />
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label={t("تبديل المظهر", "Toggle theme")}
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀" : "☾"}
          </button>
          <button
            className="icon-button language"
            aria-label={t("Switch to English", "التبديل للعربية")}
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          >
            {locale === "ar" ? "EN" : "AR"}
          </button>
          <ButtonLink to="/courses">
            {t("احجز دورة", "Book a course")}
          </ButtonLink>
          <button
            className="icon-button menu-button"
            aria-label={t("القائمة", "Menu")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  const { t } = useUI();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand footer />
          <p>
            {t(
              "منصّة تهدف لتطوير وبناء مسار ومهارات أطباء الأسنان.",
              "A platform dedicated to developing the careers and skills of dental professionals.",
            )}
            <br />
            {t(
              "استثمر معنا وانقل نفسك إلى مستوى آخر.",
              "Invest in your skills and take your next step.",
            )}
          </p>
          <Link to="/courses" className="text-link">
            {t("ابدأ رحلتك الآن", "Start your journey")} ←
          </Link>
          <div className="social-row">
            <a href={settings.instagram}>Instagram</a>
            <a href={settings.facebook}>Facebook</a>
            <a href={settings.whatsapp}>WhatsApp</a>
          </div>
        </div>
        <div>
          <h3>{t("روابط سريعة", "Quick links")}</h3>
          <div className="footer-links">
            {[
              ...nav.slice(1, 6),
              ["/faq", bi("الأسئلة الشائعة", "FAQ")],
              ["/chat", bi("المساعد الذكي", "Academy assistant")],
              ["/workshops", bi("الورش", "Workshops")],
              ["/benefits", bi("مزايا الطالب", "Student benefits")],
            ].map(([href, label]) => (
              <Link key={href} to={href}>
                <Text value={label} />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3>{t("تواصل معنا", "Contact us")}</h3>
          <small>{t("واتساب", "WhatsApp")}</small>
          <p>
            <a href={settings.whatsapp} dir="ltr">
              +964 781 782 8545
            </a>
          </p>
          <small>{t("انستغرام", "Instagram")}</small>
          <p>
            <a href={settings.instagram}>@dentacollab</a>
          </p>
          <small>{t("موقع الأكاديمية", "Academy location")}</small>
          <p>
            <a href={settings.maps}>
              {t("افتح الموقع على الخريطة", "Open academy location")}
            </a>
            <br />
            <span dir="ltr">33°17'16.0"N 44°20'52.4"E</span>
          </p>
        </div>
      </div>
      <div className="container copyright">
        © {new Date().getFullYear()} Denta Collab® —{" "}
        {t("دنتا كولاب. جميع الحقوق محفوظة.", "All rights reserved.")}
        <span>
          {t(
            "إعادة بناء للتصميم · نسخة توضيحية",
            "Design reconstruction · Demonstration",
          )}
        </span>
      </div>
    </footer>
  );
}
function PageHero({ eyebrow, title, body, children, dark = false }) {
  return (
    <section className={"page-hero " + (dark ? "dark-hero" : "")}>
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {body && <p className="lead">{body}</p>}
        {children}
      </div>
    </section>
  );
}
function Heading({ eyebrow, title, body }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}
function SampleNote() {
  const { t } = useUI();
  return (
    <p className="sample-note">
      {t(
        "بيانات توضيحية لعرض التصميم — ليست برامج أو أسعاراً أو تقييمات حالية.",
        "Illustrative content for the design preview — not current programs, prices or reviews.",
      )}
    </p>
  );
}
function Empty({ children }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">◇</span>
      <p>{children}</p>
    </div>
  );
}
function CourseCard({ course }) {
  const { t } = useUI();
  return (
    <Link to={"/courses/" + course.slug} className="card course-card">
      <img src={img(course.image)} alt="" loading="lazy" />
      <div className="card-body">
        <div className="tags">
          <span>
            <Text value={course.level} />
          </span>
          <span>
            <Text value={course.duration} />
          </span>
        </div>
        <h3>
          <Text value={course.title} />
        </h3>
        <p>
          <Text value={course.description} />
        </p>
        <span className="text-link">
          {t("التفاصيل والمنهج", "Details & curriculum")} ←
        </span>
      </div>
    </Link>
  );
}
function InstructorCard({ person }) {
  const { t } = useUI();
  return (
    <Link className="card instructor-card" to={"/instructors/" + person.id}>
      <div className="portrait">
        <img
          src={img(person.image)}
          alt={t("صورة المدرب المرجعية", "Reference instructor photograph")}
          loading="lazy"
        />
        <span className="portrait-caption">
          {t("ملف توضيحي للمدرب", "Demonstration profile")}
        </span>
      </div>
      <div className="card-body">
        <h3>
          <Text value={person.name} />
        </h3>
        <p className="accent">
          <Text value={person.title} />
        </p>
        <p>
          <Text value={person.bio} />
        </p>
        <span className="text-link">
          {t("عرض التفاصيل والدورات", "View details & courses")} ←
        </span>
      </div>
    </Link>
  );
}
function FAQList({ items = faqs }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={i}>
          <summary>
            <Text value={item.q} />
            <span aria-hidden="true">+</span>
          </summary>
          <p>
            <Text value={item.a} />
          </p>
        </details>
      ))}
    </div>
  );
}
function BenefitsGrid() {
  const { t } = useUI();
  return (
    <div className="grid four benefits-grid">
      {[
        [
          t("مناهج عملية", "Hands-on curricula"),
          t(
            "كل مفهوم يتحول إلى تطبيق عملي واضح.",
            "Turn each concept into a practical workflow.",
          ),
        ],
        [
          t("مدربون خبراء", "Expert instructors"),
          t(
            "خبرة تربط العيادة بالتقنيات الحديثة.",
            "Expertise connecting the clinic to modern technology.",
          ),
        ],
        [
          t("شهادات معتمدة", "Accredited certificates"),
          t(
            "استفسر عن شهادة كل برنامج وشروطها.",
            "Confirm certificate requirements for your program.",
          ),
        ],
        [
          t("مجتمع مهني", "Professional community"),
          t(
            "تبادل المعرفة واستمر بتطوير مهاراتك.",
            "Share knowledge and continue developing your skills.",
          ),
        ],
      ].map(([title, body], i) => (
        <article className="card card-body" key={title}>
          <span className="number">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}
function ModelViewer() {
  const { t } = useUI();
  const [tab, setTab] = useState("guide");
  const [load, setLoad] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const start = useRef(null);
  const models = {
    teeth: {
      id: "35b057aa657d4e48989c0c6af657f41d",
      credit: "elmagnifico",
      url: "https://sketchfab.com/3d-models/upper-jaw-teeth-anatomy-35b057aa657d4e48989c0c6af657f41d",
      license: "Sketchfab",
    },
    implant: {
      id: "ede1a07475db4236b43a6cd168d1225d",
      credit: "drandrescordova",
      url: "https://sketchfab.com/3d-models/implante-dental-ede1a07475db4236b43a6cd168d1225d",
      license: "CC BY",
    },
  };
  const names = {
    guide: t("دليل جراحي", "Surgical guide"),
    teeth: t("الأسنان", "Teeth"),
    implant: t("زرعة", "Implant"),
  };
  return (
    <div className="model-viewer">
      <div
        className="tabs"
        role="tablist"
        aria-label={t("اختيار النموذج", "Choose model")}
      >
        {Object.keys(names).map((id) => (
          <button
            id={"tab-" + id}
            aria-controls="model-panel"
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "selected" : ""}
            onClick={() => {
              setTab(id);
              setLoad(false);
            }}
          >
            {names[id]}
          </button>
        ))}
      </div>
      <div
        className="model-stage"
        role="tabpanel"
        id="model-panel"
        aria-labelledby={"tab-" + tab}
      >
        {tab === "guide" ? (
          <>
            <div
              className="model-demo"
              onPointerDown={(e) => {
                start.current = e.clientX;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (start.current !== null) {
                  setRotation((r) => r + (e.clientX - start.current) * 0.6);
                  start.current = e.clientX;
                }
              }}
              onPointerUp={() => (start.current = null)}
              onPointerCancel={() => (start.current = null)}
            >
              <div
                className="dental-arch"
                style={{
                  transform: `rotateX(48deg) rotateZ(${rotation}deg) scale(${zoom})`,
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} style={{ "--a": `${-165 + i * 30}deg` }} />
                ))}
              </div>
            </div>
            <div className="model-controls">
              <button
                aria-label={t("تدوير", "Rotate")}
                onClick={() => setRotation((r) => r + 20)}
              >
                ↻
              </button>
              <button
                aria-label={t("تكبير", "Zoom in")}
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              >
                +
              </button>
              <button
                aria-label={t("تصغير", "Zoom out")}
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              >
                −
              </button>
              <button
                onClick={() => {
                  setRotation(0);
                  setZoom(1);
                }}
              >
                {t("إعادة", "Reset")}
              </button>
            </div>
            <span className="model-label">
              {t(
                "مجسّم CSS توضيحي — ليس نموذجاً طبياً",
                "Illustrative CSS model — not a medical model",
              )}
            </span>
          </>
        ) : load ? (
          <iframe
            title={names[tab]}
            src={`https://sketchfab.com/models/${models[tab].id}/embed?autostart=1&dnt=1`}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        ) : (
          <div className="model-consent">
            <span className="model-symbol">◇</span>
            <h3>{names[tab]}</h3>
            <p>
              {t(
                "النموذج التفاعلي مستضاف على Sketchfab ويتطلب اتصالاً بالإنترنت.",
                "The interactive model is hosted on Sketchfab and needs an internet connection.",
              )}
            </p>
            <button className="button cyan" onClick={() => setLoad(true)}>
              {t("تحميل النموذج", "Load model")}
            </button>
          </div>
        )}
      </div>
      <div className="model-caption">
        <strong>{names[tab]}</strong>
        <p>
          {tab === "guide"
            ? t(
                "اسحب لتدوير المجسّم أو استخدم أزرار التكبير والتصغير. أضف ملفك الطبي المرخّص لعرض نموذج دقيق.",
                "Drag to rotate or use the zoom controls. Supply your licensed medical model for an accurate surgical guide.",
              )
            : t(
                "دوّر وقرّب لاستكشاف النموذج ثلاثي الأبعاد.",
                "Orbit and zoom to explore the 3D model.",
              )}
        </p>
        {models[tab] && (
          <small>
            {t("المصدر: ", "Source: ")}
            <a className="text-link" href={models[tab].url}>
              {models[tab].credit}
            </a>{" "}
            · {models[tab].license}
          </small>
        )}
      </div>
    </div>
  );
}
function Home() {
  const { t } = useUI();
  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="hero-copy">
            <Brand />
            <span className="pill">
              {t("أكاديمية طب الأسنان الرقمي", "Digital Dentistry Academy")}
            </span>
            <h1>
              {t(
                "المنصة الأولى في العراق لتطوير مهاراتك في طب الأسنان الرقمي",
                "Develop your digital dentistry skills in Iraq",
              )}
            </h1>
            <h2 className="accent">
              {t("صمّم. خطّط. نفّذ.", "Design. Plan. Create.")}
            </h2>
            <p>
              {t(
                "أكاديمية متخصصة في طب الأسنان الرقمي لتمكين الأطباء والمختبرات عبر تدريب عملي ومنهج احترافي.",
                "A specialized digital dentistry academy empowering clinicians and laboratories through hands-on training and professional programs.",
              )}
            </p>
            <div className="actions">
              <ButtonLink to="/courses">
                {t("استكشف الدورات", "Explore courses")}
              </ButtonLink>
              <ButtonLink to="/contact" secondary>
                {t("تواصل معنا", "Contact us")}
              </ButtonLink>
            </div>
            <div className="stats">
              {[
                ["500+", t("متدرب وطبيب", "Trainees & clinicians")],
                ["50+", t("خريج", "Graduates")],
                ["98%", t("رضا المتدربين", "Trainee satisfaction")],
              ].map(([num, label]) => (
                <div key={num}>
                  <strong dir="ltr">{num}</strong>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <Heading
            eyebrow={t("تجربة تفاعلية", "Interactive experience")}
            title={t("استكشف طب الأسنان الرقمي", "Explore digital dentistry")}
            body={t(
              "استكشف الدليل الجراحي لزراعة الأسنان، قوس الأسنان، أو الزرعة — نماذج قابلة للتدوير والتكبير.",
              "Explore a surgical guide, dental arch or implant with interactive viewing controls.",
            )}
          />
          <ModelViewer />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Heading
            eyebrow={t("من التصميم إلى الواقع", "From design to reality")}
            title={t("نطبع ما تصممه", "We print what you design")}
            body={t(
              "تعلّم سير العمل الرقمي الكامل من التصميم على Exocad وحتى الطباعة والنتيجة النهائية.",
              "Learn the complete digital workflow, from Exocad design to printing and the final result.",
            )}
          />
          <div className="grid four workflow">
            {[
              t("التصميم الرقمي", "Digital design"),
              t("تصدير ملف STL", "STL export"),
              t("الطباعة ثلاثية الأبعاد", "3D printing"),
              t("النتيجة النهائية", "Final result"),
            ].map((title, i) => (
              <article className="card" key={title}>
                <img
                  src={img(`step-${i + 1}.jpg`)}
                  alt={title}
                  loading="lazy"
                />
                <div className="card-body">
                  <span className="number">{i + 1}</span>
                  <h3>{title}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="callout">
            <div>
              <strong>
                ✓{" "}
                {t("تجربة عملية متكاملة", "An end-to-end hands-on experience")}
              </strong>
              <p>
                {t(
                  "لن تتعلم بالمشاهدة فقط، بل ستتدرب وتطبع كل خطوة بنفسك.",
                  "Learn by doing, with practical exercises throughout the workflow.",
                )}
              </p>
            </div>
            <ButtonLink to="/courses">
              {t("استكشف الدورات", "Explore courses")}
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <Heading
            eyebrow={t("التخصصات الأساسية", "Core specialties")}
            title={t(
              "من التصميم الرقمي إلى النتيجة النهائية",
              "From digital design to the final result",
            )}
          />
          <div className="specialty-grid">
            {specialties.map((s) => (
              <Link to="/courses" key={s.badge} className="specialty">
                <img src={img(s.image)} alt="" loading="lazy" />
                <div>
                  <span className="pill">{s.badge}</span>
                  <h3>
                    <Text value={s.title} />
                  </h3>
                  <p>
                    <Text value={s.body} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Heading
            eyebrow={t("دورات مختارة", "Featured courses")}
            title={t("مسارات واضحة لكل مستوى", "A clear path for every level")}
            body={t(
              "برامج واضحة للمستويات من الطلاب حتى المتقدمين.",
              "Structured programs for students through advanced practitioners.",
            )}
          />
          {settings.sampleData ? (
            <>
              <SampleNote />
              <div className="grid three">
                {courses.map((c) => (
                  <CourseCard key={c.slug} course={c} />
                ))}
              </div>
            </>
          ) : (
            <Empty>
              {t(
                "لا توجد دورات متاحة حالياً",
                "No courses available right now",
              )}
            </Empty>
          )}
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <Heading
            eyebrow={t("لماذا DENTACOLLAB؟", "Why DENTACOLLAB?")}
            title={t(
              "رؤية عملية للتدريب الرقمي",
              "A practical vision for digital training",
            )}
            body={t(
              "نربط المعرفة النظرية بالتطبيق السريري الحقيقي عبر منهج واضح، مدربين خبراء، ومختبرات رقمية حديثة.",
              "We connect theory with clinical practice through structured curricula, experienced instructors and modern digital laboratories.",
            )}
          />
          <BenefitsGrid />
        </div>
      </section>
      <section className="section">
        <div className="container split instructor-feature">
          <img
            src={img("dr-ammar.png")}
            alt={t("المدرب الرئيسي", "Lead instructor")}
            loading="lazy"
          />
          <div>
            <Heading
              eyebrow={t("المدرب الرئيسي", "Lead instructor")}
              title={t("خبراء طب الأسنان الرقمي", "Digital dentistry experts")}
              body={t(
                "خبرة أكاديمية وسريرية تمنحك فهماً عميقاً وتقنيات قابلة للتطبيق من أول يوم.",
                "Academic and clinical expertise for practical understanding and techniques you can apply.",
              )}
            />
            <div className="stats">
              <div>
                <strong>10+</strong>
                <small>{t("سنوات خبرة", "Years experience")}</small>
              </div>
              <div>
                <strong>500+</strong>
                <small>{t("متدرب", "Trainees")}</small>
              </div>
              <div>
                <strong>12k+</strong>
                <small>{t("ساعة تدريب", "Training hours")}</small>
              </div>
            </div>
            <ButtonLink to="/instructors">
              {t("تعرّف على المدربين", "Meet the instructors")}
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="section navy" id="reserve">
        <div className="container split">
          <div>
            <Brand />
            <h2>{t("احجز مقعدك الآن", "Reserve your seat")}</h2>
            <p>
              {t(
                "اختر الدورة المناسبة ثم راجع تفاصيل التسجيل.",
                "Choose your course and review the registration details.",
              )}
            </p>
          </div>
          <ReserveSelector />
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <Heading
            eyebrow={t("الأسئلة الشائعة", "FAQ")}
            title={t(
              "إجابات واضحة قبل التسجيل",
              "Clear answers before you register",
            )}
          />
          {settings.sampleData ? (
            <FAQList items={faqs.slice(0, 3)} />
          ) : (
            <Empty>
              {t("لا توجد أسئلة منشورة حالياً", "No published questions yet")}
            </Empty>
          )}
        </div>
      </section>
    </>
  );
}
function ReserveSelector() {
  const { t } = useUI();
  const [slug, setSlug] = useState(courses[0].slug);
  return (
    <div className="reservation">
      <label htmlFor="reserve-course">
        {t("اختر الدورة", "Choose your course")}
      </label>
      <select
        id="reserve-course"
        disabled={!settings.sampleData}
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      >
        {settings.sampleData ? (
          courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              <Text value={c.title} />
            </option>
          ))
        ) : (
          <option>
            {t("لا توجد دورات متاحة حالياً", "No courses available")}
          </option>
        )}
      </select>
      {settings.sampleData && (
        <ButtonLink to={"/courses/" + slug + "#registration"}>
          {t("عرض التسجيل", "View registration")}
        </ButtonLink>
      )}
    </div>
  );
}
function Courses() {
  const { t } = useUI();
  return (
    <>
      <PageHero
        eyebrow={t("برامج الأكاديمية", "Academy programs")}
        title={t("الدورات", "Courses")}
        body={t(
          "برامج احترافية في طب الأسنان الرقمي تجمع بين المعرفة السريرية والتطبيق العملي.",
          "Professional digital dentistry programs combining clinical knowledge and hands-on practice.",
        )}
      />
      <section className="section">
        <div className="container">
          {settings.sampleData ? (
            <>
              <SampleNote />
              <div className="grid three">
                {courses.map((c) => (
                  <CourseCard key={c.slug} course={c} />
                ))}
              </div>
            </>
          ) : (
            <Empty>
              {t(
                "لا توجد دورات متاحة حالياً",
                "No courses available right now",
              )}
            </Empty>
          )}
        </div>
      </section>
    </>
  );
}
function RegistrationForm({ course }) {
  const { t } = useUI();
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    if (!settings.apiBase) {
      setState("demo");
      return;
    }
    const form = e.currentTarget;
    setState("sending");
    setError("");
    try {
      const response = await fetch(settings.apiBase + "/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          ...Object.fromEntries(new FormData(form)),
        }),
      });
      if (!response.ok)
        throw Error(
          t(
            "تعذر إرسال الطلب. حاول لاحقاً.",
            "Unable to send the request. Try again later.",
          ),
        );
      setState("sent");
      form.reset();
    } catch (e) {
      setError(e.message);
      setState("idle");
    }
  }
  return (
    <form className="form-grid" onSubmit={submit}>
      {[
        ["fullName", t("الاسم الكامل", "Full name"), "text"],
        ["email", t("البريد الإلكتروني", "Email address"), "email"],
        ["phone", t("رقم الهاتف", "Phone number"), "tel"],
        ["city", t("المدينة", "City"), "text"],
        ["occupation", t("المهنة", "Occupation"), "text"],
        ["experience", t("سنوات الخبرة", "Years of experience"), "number"],
      ].map(([name, label, type]) => (
        <label key={name}>
          {label}
          <input
            name={name}
            type={type}
            min={type === "number" ? 0 : undefined}
            maxLength={type === "number" ? undefined : 200}
            required={["fullName", "email", "phone"].includes(name)}
            autoComplete={
              name === "fullName"
                ? "name"
                : name === "email"
                  ? "email"
                  : name === "phone"
                    ? "tel"
                    : "off"
            }
          />
        </label>
      ))}
      <label className="full">
        {t("ملاحظات إضافية (اختياري)", "Additional notes (optional)")}
        <textarea name="notes" rows="3" maxLength="2000" />
      </label>
      <button
        disabled={state === "sending"}
        className="button full"
        type="submit"
      >
        {state === "sending"
          ? t("جاري الإرسال…", "Sending…")
          : t("إرسال طلب التسجيل", "Submit registration")}
      </button>
      {state === "demo" && (
        <p role="status" className="notice full">
          {t(
            "تم التحقق من النموذج محلياً. لم يتم إرسال بيانات أو إنشاء حجز؛ اربط خادمك لتفعيل التسجيل.",
            "Form validated locally. No data was sent and no booking was created. Connect your backend to enable registration.",
          )}
        </p>
      )}
      {state === "sent" && (
        <p role="status" className="notice full">
          {t("تم إرسال طلب التسجيل.", "Registration request sent.")}
        </p>
      )}
      {error && (
        <p role="alert" className="error full">
          {error}
        </p>
      )}
    </form>
  );
}
function CourseDetail({ slug }) {
  const { t } = useUI();
  const c = settings.sampleData && courses.find((c) => c.slug === slug);
  if (!c)
    return (
      <NotFound
        label={t("الدورة غير موجودة", "Course not found")}
        back="/courses"
      />
    );
  return (
    <>
      <section
        className="detail-hero"
        style={{ "--cover": `url(${img(c.image)})` }}
      >
        <div className="container">
          <p className="eyebrow">
            {t(
              "دورة احترافية في طب الأسنان الرقمي",
              "Professional digital dentistry course",
            )}
          </p>
          <h1>
            <Text value={c.title} />
          </h1>
          <p>
            <Text value={c.description} />
          </p>
          <div className="actions">
            <a className="button cyan" href="#registration">
              {t("سجّل في الدورة", "Enroll now")}
            </a>
            <a className="button ghost" href="#curriculum">
              {t("استعرض المنهج", "View curriculum")}
            </a>
          </div>
        </div>
      </section>
      <div className="container">
        <SampleNote />
        <div className="course-facts">
          {[
            [t("المدة", "Duration"), c.duration],
            [t("المستوى", "Level"), c.level],
            [
              t("الشهادة", "Certificate"),
              bi("استفسر من الأكاديمية", "Confirm with academy"),
            ],
            [t("السعر", "Price"), bi("تواصل للسعر", "Contact for price")],
          ].map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>
                <Text value={value} />
              </strong>
            </div>
          ))}
        </div>
        <section className="section split">
          <div>
            <Heading
              eyebrow={t("عن الدورة", "About the course")}
              title={t(
                "طوّر مهاراتك في طب الأسنان الرقمي",
                "Level up your digital dentistry skills",
              )}
            />
            <p>
              <Text value={c.description} />
            </p>
            <ul className="check-list">
              {c.modules.map((m, i) => (
                <li key={i}>
                  <Text value={m} />
                </li>
              ))}
            </ul>
            <h3>{t("المتطلبات الأساسية", "Prerequisites")}</h3>
            <p>
              {t(
                "معرفة أساسية بطب الأسنان والرغبة في تعلّم سير العمل الرقمي. هذه متطلبات توضيحية وليست متطلبات برنامج حقيقي.",
                "Basic dental knowledge and an interest in digital workflows. These are illustrative requirements, not a live program specification.",
              )}
            </p>
          </div>
          <div id="curriculum" className="card card-body">
            <h2>{t("محتوى الدورة", "Course content")}</h2>
            <p>
              {c.modules.length} {t("وحدات تدريبية", "training modules")}
            </p>
            <div className="faq-list">
              {c.modules.map((m, i) => (
                <details key={i} open={i === 0}>
                  <summary>
                    <span className="number">0{i + 1}</span>
                    <Text value={m} />
                    <span>+</span>
                  </summary>
                  <p>
                    {t(
                      "شرح المفاهيم، استعراض سير العمل، ثم تمرين عملي ومراجعة النتائج.",
                      "Concepts, workflow demonstration, hands-on exercise and review of the results.",
                    )}
                  </p>
                  <ul>
                    <li>
                      {t("الشرح والعرض", "Explanation and demonstration")}
                    </li>
                    <li>{t("التطبيق العملي", "Hands-on exercise")}</li>
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="section pale">
        <div className="container">
          <Heading
            eyebrow={t("فريق التدريب", "Training team")}
            title={t(
              "تعرّف على المدربين الذين يقودون هذا البرنامج",
              "Meet the instructors behind this program",
            )}
          />
          <div className="grid three">
            <InstructorCard person={instructors[0]} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Heading
            eyebrow={t("ما توفره الأكاديمية", "What the academy provides")}
            title={t("كل شيء جاهز لك", "Everything is ready for you")}
          />
          <div className="grid four">
            {[
              t("تجهيز كامل من الأكاديمية", "Prepared training environment"),
              t("البرامج مثبتة مسبقاً", "Pre-installed software"),
              t("حساب exocad رسمي معتمد", "Official exocad account"),
              t("أنت فقط سجّل واحضر", "Register and attend"),
            ].map((s, i) => (
              <article className="card card-body" key={s}>
                <span className="number">0{i + 1}</span>
                <h3>{s}</h3>
                <p>
                  {t(
                    "تأكد من توافر التجهيزات ضمن برنامجك قبل الحجز.",
                    "Confirm the available equipment for your selected program.",
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section pale" id="registration">
        <div className="container split">
          <Heading
            eyebrow={t("ابدأ رحلتك", "Start your journey")}
            title={t("استمارة التسجيل", "Registration form")}
            body={t(
              "املأ البيانات لمعاينة تجربة التسجيل. الدفع غير مفعل في هذه النسخة.",
              "Complete the form to preview registration. Payments are not enabled in this version.",
            )}
          />
          <div className="card card-body">
            <RegistrationForm course={c} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <Heading title={t("الأسئلة الشائعة", "Frequently asked questions")} />
          <FAQList />
        </div>
      </section>
    </>
  );
}
function Instructors() {
  const { t } = useUI();
  return (
    <>
      <PageHero
        eyebrow={t("الخبراء", "Experts")}
        title={t("المدربون", "Instructors")}
        body={t(
          "تعلّم مع مدربين يجمعون بين الخبرة السريرية والتقنية الرقمية.",
          "Learn with instructors combining clinical expertise and digital technology.",
        )}
      />
      <section className="section">
        <div className="container">
          {settings.sampleData ? (
            <>
              <SampleNote />
              <div className="grid three">
                {instructors.map((p) => (
                  <InstructorCard key={p.id} person={p} />
                ))}
              </div>
            </>
          ) : (
            <Empty>
              {t(
                "لا يوجد مدربون منشورون حالياً.",
                "No published instructors yet.",
              )}
            </Empty>
          )}
        </div>
      </section>
    </>
  );
}
function InstructorDetail({ id }) {
  const { t } = useUI();
  const p = settings.sampleData && instructors.find((p) => p.id === id);
  if (!p)
    return (
      <NotFound
        label={t("المدرب غير موجود", "Instructor not found")}
        back="/instructors"
      />
    );
  return (
    <>
      <section className="section dark-hero">
        <div className="container profile-hero">
          <div>
            <Link className="text-link" to="/instructors">
              ← {t("كل المدربين", "All instructors")}
            </Link>
            <img src={img(p.image)} alt="" />
          </div>
          <div>
            <p className="eyebrow">{t("ملف المدرب", "Instructor profile")}</p>
            <h1>
              <Text value={p.name} />
            </h1>
            <p>
              <Text value={p.title} />
            </p>
          </div>
        </div>
      </section>
      <div className="container">
        <SampleNote />
        <section className="section split">
          <div>
            <h2>{t("عن المدرب", "About the instructor")}</h2>
            <p>
              <Text value={p.bio} />
            </p>
            <h3>{t("الشهادات والخبرات", "Certificates & credentials")}</h3>
            <div className="tags">
              {p.credentials.map((c, i) => (
                <span key={i}>
                  <Text value={c} />
                </span>
              ))}
            </div>
          </div>
          <aside className="card card-body">
            <h3>{t("ملخص", "Summary")}</h3>
            <dl>
              <div>
                <dt>{t("الدورات", "Courses")}</dt>
                <dd>{courses.length}</dd>
              </div>
              <div>
                <dt>{t("مجالات الخبرة", "Areas of expertise")}</dt>
                <dd>{p.credentials.length}</dd>
              </div>
            </dl>
            <ButtonLink to="/contact">
              {t("تواصل مع الأكاديمية", "Contact the academy")}
            </ButtonLink>
          </aside>
        </section>
      </div>
      <section className="section pale">
        <div className="container">
          <Heading
            eyebrow={t("برامج المدرب", "Instructor programs")}
            title={t("دوراته", "Courses by this instructor")}
          />
          <div className="grid three">
            {courses
              .filter((c) => c.instructor === id)
              .map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
function About() {
  const { t } = useUI();
  return (
    <>
      <section className="section dark-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">{t("من نحن", "About us")}</p>
            <h1 dir="ltr">
              DENTA<span className="accent">COLLAB</span>
            </h1>
            <h2>{t("الأكاديمية", "The academy")}</h2>
            <p className="lead">
              {t(
                "منصة تعليمية وتدريبية متخصصة تهدف إلى بناء وتطوير كفاءات أطباء الأسنان والفنيين، وتزويدهم بأحدث الخبرات والتطبيقات العملية.",
                "A specialized education and training platform dedicated to developing the competencies of dentists and technicians through modern expertise and practical applications.",
              )}
            </p>
            <div className="actions">
              <ButtonLink to="/courses">
                {t("استكشف الدورات", "Explore courses")}
              </ButtonLink>
              <ButtonLink to="/instructors" secondary>
                {t("كل المدربين", "All instructors")}
              </ButtonLink>
            </div>
          </div>
          <div className="academy-art">
            <img src={img("logo.png")} alt="DentaCollab" />
            <span>DIGITAL DENTISTRY ACADEMY</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <Heading
            eyebrow={t("قصتنا", "Our story")}
            title={t(
              "من فكرة سريرية إلى مسار تدريبي متكامل",
              "From a clinical need to a complete training path",
            )}
            body={t(
              "انطلقت الأكاديمية من حاجة حقيقية في العيادة والمختبر: تحويل المعرفة الرقمية إلى مهارة يومية قابلة للتطبيق. نصمم المناهج حول سيناريوهات حقيقية، ونبني التدريب خطوة بخطوة.",
              "The academy started from a real clinic and laboratory need: turning digital knowledge into everyday skill. Curricula are built around real scenarios with step-by-step training.",
            )}
          />
          <div className="stack">
            {[
              [
                t("المهمة", "Mission"),
                t(
                  "تأهيل أطباء ومختبرات يثقون بمسارهم الرقمي من التخطيط إلى النتيجة النهائية.",
                  "Train clinicians and laboratories to confidently follow their digital path from planning to the final result.",
                ),
              ],
              [
                t("الرؤية", "Vision"),
                t(
                  "أن نكون المرجع الإقليمي لتدريب طب الأسنان الرقمي العملي والمعتمد.",
                  "Become a regional reference for practical digital dentistry training.",
                ),
              ],
            ].map(([a, b]) => (
              <article className="card card-body" key={a}>
                <h3 className="accent">{a}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <Heading
            eyebrow={t("قيمنا", "Our values")}
            title={t(
              "ما نلتزم به في كل برنامج",
              "What we commit to in every program",
            )}
          />
          <BenefitsGrid />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Heading
            eyebrow="OUR TEAM"
            title={t("فريق الخبراء", "The experts behind the programs")}
          />
          {settings.sampleData ? (
            <>
              <SampleNote />
              <div className="grid three">
                {instructors.map((p) => (
                  <InstructorCard key={p.id} person={p} />
                ))}
              </div>
            </>
          ) : (
            <Empty>
              {t(
                "سيظهر فريق الأكاديمية هنا قريباً.",
                "The academy team will appear here soon.",
              )}
            </Empty>
          )}
          <div className="callout">
            <div>
              <h2>
                {t("جاهز تبدأ رحلتك معنا؟", "Ready to start your journey?")}
              </h2>
              <p>
                {t(
                  "استكشف البرامج أو تواصل مع فريق التسجيل مباشرة.",
                  "Explore programs or contact the registration team.",
                )}
              </p>
            </div>
            <ButtonLink to="/contact">
              {t("تواصل معنا", "Contact us")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
function Benefits() {
  const { t } = useUI();
  return (
    <>
      <PageHero
        eyebrow={t("لماذا DentaCollab", "Why DentaCollab")}
        title={t("مزايا الطالب", "Student benefits")}
        body={t(
          "تدريب عملي، محتوى محدّث، ومتابعة احترافية.",
          "Hands-on training, updated curricula and professional follow-up.",
        )}
      />
      <section className="section">
        <div className="container">
          <BenefitsGrid />
        </div>
      </section>
    </>
  );
}
function Gallery() {
  const { t } = useUI();
  const [filter, setFilter] = useState(-1);
  const [photo, setPhoto] = useState(null);
  const dialog = useRef();
  const lastTrigger = useRef();
  useEffect(() => {
    if (photo) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [photo]);
  return (
    <>
      <PageHero
        eyebrow={t("نتائج حقيقية", "Real results")}
        title={t("المعرض", "Gallery")}
        body={t(
          "لمحات من المشاريع والنتائج التدريبية.",
          "Highlights from training projects and clinical outcomes.",
        )}
      />
      <section className="section">
        <div className="container">
          <div className="filter-row">
            <button
              className={filter === -1 ? "selected" : ""}
              onClick={() => setFilter(-1)}
            >
              {t("الكل", "All")}
            </button>
            {gallery.map((g, i) => (
              <button
                key={i}
                className={filter === i ? "selected" : ""}
                onClick={() => setFilter(i)}
              >
                <Text value={g.title} />
              </button>
            ))}
          </div>
          {gallery
            .filter((_, i) => filter === -1 || filter === i)
            .map((g, i) => (
              <section className="gallery-group" key={i}>
                <h2>
                  <Text value={g.title} />
                </h2>
                <p>
                  <Text value={g.description} />
                </p>
                <div className="grid three gallery-grid">
                  {g.images.map((image, j) => (
                    <button
                      key={image}
                      className="gallery-tile"
                      aria-label={t(
                        `عرض الصورة ${j + 1}`,
                        `View image ${j + 1}`,
                      )}
                      onClick={(e) => {
                        lastTrigger.current = e.currentTarget;
                        setPhoto({ image, title: g.title });
                      }}
                    >
                      <img
                        src={img(image)}
                        alt={g.title[t("ar", "en")]}
                        loading="lazy"
                      />
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </section>
      <dialog
        className="lightbox"
        ref={dialog}
        onCancel={() => setPhoto(null)}
        onClose={() => {
          setPhoto(null);
          lastTrigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) setPhoto(null);
        }}
      >
        {photo && (
          <div>
            <button
              className="icon-button close"
              autoFocus
              aria-label={t("إغلاق", "Close")}
              onClick={() => setPhoto(null)}
            >
              ×
            </button>
            <img src={img(photo.image)} alt={photo.title[t("ar", "en")]} />
            <p>
              <Text value={photo.title} />
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
function Graduates() {
  const { t } = useUI();
  return (
    <>
      <PageHero
        eyebrow={t("قصص نجاح", "Success stories")}
        title={t("الخريجون", "Graduates")}
        body={t(
          "خريجو الأكاديمية: الدورة، التقييم، ورأيهم بعد إتمام البرنامج.",
          "Academy graduates: their courses, ratings and reviews after completing the program.",
        )}
      />
      <section className="section">
        <div className="container">
          {settings.sampleData ? (
            <>
              <SampleNote />
              <div className="grid three">
                {graduates.map((g) => (
                  <article className="card" key={g.id}>
                    <div className="graduate-avatar" aria-hidden="true">
                      {g.id.toString().padStart(2, "0")}
                    </div>
                    <div className="card-body">
                      <div className="row-between">
                        <h3>
                          <Text value={g.name} />
                        </h3>
                        <span
                          className="accent"
                          aria-label={t(
                            "٥ من ٥ — تقييم توضيحي",
                            "5 out of 5 — sample rating",
                          )}
                        >
                          ★★★★★
                        </span>
                      </div>
                      <p className="accent">
                        <Text value={g.course} />
                      </p>
                      <blockquote>
                        <Text value={g.quote} />
                      </blockquote>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <Empty>
              {t(
                "لا يوجد خريجون منشورون حالياً.",
                "No published graduates yet.",
              )}
            </Empty>
          )}
        </div>
      </section>
    </>
  );
}
function FAQ() {
  const { t, locale } = useUI();
  const [query, setQuery] = useState("");
  const items = faqs.filter((f) =>
    (f.q[locale] + " " + f.a[locale])
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const categories = [...new Set(items.map((f) => f.category[locale]))];
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={t("الأسئلة الشائعة", "Frequently asked questions")}
      />
      <section className="section">
        <div className="container narrow">
          {settings.sampleData ? (
            <>
              <SampleNote />
              <label className="search-label">
                {t("ابحث في الأسئلة", "Search questions")}
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("كيف يمكننا مساعدتك؟", "How can we help?")}
                />
              </label>
              {categories.map((category) => (
                <section className="faq-group" key={category}>
                  <h3 className="accent">{category}</h3>
                  <FAQList
                    items={items.filter((f) => f.category[locale] === category)}
                  />
                </section>
              ))}
              {!items.length && (
                <Empty>
                  {t("لا توجد نتائج مطابقة.", "No matching questions.")}
                </Empty>
              )}
            </>
          ) : (
            <Empty>
              {t("لا توجد أسئلة منشورة حالياً.", "No published questions yet.")}
            </Empty>
          )}
        </div>
      </section>
    </>
  );
}
function Workshops() {
  const { t } = useUI();
  return (
    <>
      <PageHero
        eyebrow={t("داخل المركز", "At the center")}
        title={t("الورش", "Workshops")}
        body={t(
          "ورش تطبيقية تُقام داخل مركز DentaCollab. اختر ورشة واطّلع على المقدّم والتفاصيل والموعد.",
          "Hands-on workshops at DentaCollab Center. Explore the presenter, details and schedule.",
        )}
      />
      <section className="section">
        <div className="container narrow">
          {settings.sampleData ? (
            <>
              <SampleNote />
              {workshops.map((w) => (
                <Link
                  key={w.slug}
                  to={"/workshops/" + w.slug}
                  className="card workshop-card"
                >
                  <img src={img(w.image)} alt="" />
                  <div className="card-body">
                    <span className="accent">
                      <Text value={w.schedule} />
                    </span>
                    <h2>
                      <Text value={w.title} />
                    </h2>
                    <p>
                      <Text value={w.description} />
                    </p>
                    <span className="text-link">
                      {t("التفاصيل", "Details")} ←
                    </span>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <Empty>
              {t(
                "لا توجد ورش منشورة حالياً.",
                "No published workshops right now.",
              )}
            </Empty>
          )}
        </div>
      </section>
    </>
  );
}
function WorkshopDetail({ slug }) {
  const { t } = useUI();
  const w = settings.sampleData && workshops.find((w) => w.slug === slug);
  if (!w)
    return (
      <NotFound
        label={t("الورشة غير متاحة", "Workshop unavailable")}
        back="/workshops"
      />
    );
  return (
    <>
      <section className="section pale">
        <div className="container split">
          <div>
            <p className="eyebrow">
              {t("ورشة داخل المركز", "In-center workshop")}
            </p>
            <h1>
              <Text value={w.title} />
            </h1>
            <p>
              <b>{t("الموعد: ", "Schedule: ")}</b>
              <Text value={w.schedule} />
            </p>
            <p>
              <b>{t("المقدّم: ", "Presenter: ")}</b>
              <Text value={instructors[0].name} />
            </p>
            <p>
              <b>{t("المكان: ", "Venue: ")}</b>DentaCollab Center
            </p>
            <div className="actions">
              <ButtonLink to="/contact">
                {t("احجز مقعدك", "Reserve a seat")}
              </ButtonLink>
              <ButtonLink to="/workshops" secondary>
                {t("كل الورش", "All workshops")}
              </ButtonLink>
            </div>
          </div>
          <img className="rounded-cover" src={img(w.image)} alt="" />
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <SampleNote />
          <h2>{t("تفاصيل الورشة", "Workshop details")}</h2>
          <p>
            <Text value={w.description} />
          </p>
        </div>
      </section>
    </>
  );
}
function Contact() {
  const { t } = useUI();
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [map, setMap] = useState(false);
  async function send(e) {
    e.preventDefault();
    if (!settings.apiBase) {
      setState("demo");
      return;
    }
    setState("sending");
    setError("");
    const form = e.currentTarget;
    try {
      const response = await fetch(settings.apiBase + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok)
        throw Error(t("تعذر إرسال الرسالة.", "Unable to send the message."));
      setState("sent");
      form.reset();
    } catch (e) {
      setError(e.message);
      setState("idle");
    }
  }
  return (
    <>
      <PageHero
        dark
        eyebrow={t("نحن هنا لمساعدتك", "We are here to help")}
        title={t("تواصل مع الأكاديمية", "Contact the academy")}
        body={t(
          "لديك سؤال عن الدورات أو التسجيل؟ تواصل معنا واختر الطريقة الأنسب لك.",
          "Questions about courses or registration? Choose the best way to reach our team.",
        )}
      >
        <div className="actions">
          <ButtonLink to="/courses">
            {t("استكشف الدورات", "Explore courses")}
          </ButtonLink>
          <ButtonLink to="/chat" secondary>
            {t("المساعد الذكي", "Academy assistant")}
          </ButtonLink>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <Heading
            eyebrow={t("قنوات التواصل", "Contact channels")}
            title={t(
              "اختر الطريقة الأنسب للتواصل",
              "Pick the best way to reach us",
            )}
          />
          <div className="grid four">
            {[
              ["Instagram", "@dentacollab", settings.instagram, "◎"],
              ["WhatsApp", "+964 781 782 8545", settings.whatsapp, "◉"],
              [
                "Facebook",
                "Digital dentistry training courses",
                settings.facebook,
                "f",
              ],
              [
                t("موقع الأكاديمية", "Academy location"),
                t("بغداد، العراق", "Baghdad, Iraq"),
                settings.maps,
                "⌖",
              ],
            ].map(([label, value, url, icon]) => (
              <a className="card card-body contact-card" href={url} key={label}>
                <span className="number">{icon}</span>
                <h3>{label}</h3>
                <p dir={label === "WhatsApp" ? "ltr" : undefined}>{value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="container split">
          <form className="card card-body form-grid" onSubmit={send}>
            <div className="full">
              <p className="eyebrow">{t("ابدأ هنا", "Start here")}</p>
              <h2>{t("أرسل لنا رسالة", "Send us a message")}</h2>
              <p>
                {t(
                  "اترك استفسارك وبيانات التواصل.",
                  "Share your question and contact details.",
                )}
              </p>
            </div>
            {[
              ["name", t("الاسم الكامل", "Full name"), "text"],
              ["email", t("البريد الإلكتروني", "Email"), "email"],
              ["phone", t("رقم الهاتف", "Phone"), "tel"],
              ["subject", t("الموضوع", "Subject"), "text"],
            ].map(([name, label, type]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  type={type}
                  maxLength="200"
                  required={name !== "phone"}
                />
              </label>
            ))}
            <label className="full">
              {t("رسالتك", "Message")}
              <textarea name="message" rows="5" required maxLength="5000" />
            </label>
            <button className="button full" disabled={state === "sending"}>
              {state === "sending"
                ? t("جاري الإرسال…", "Sending…")
                : t("إرسال الرسالة", "Send message")}
            </button>
            {state === "demo" && (
              <p role="status" className="notice full">
                {t(
                  "معاينة فقط: لم يتم إرسال الرسالة. فعّل خادمك لاستقبال الرسائل.",
                  "Preview only: no message was sent. Connect your backend to receive messages.",
                )}
              </p>
            )}
            {state === "sent" && (
              <p role="status" className="notice full">
                {t(
                  "تم إرسال رسالتك بنجاح.",
                  "Your message was sent successfully.",
                )}
              </p>
            )}
            {error && (
              <p role="alert" className="error full">
                {error}
              </p>
            )}
          </form>
          <div className="map-card">
            <div className="card-body">
              <h2>{t("موقع الأكاديمية", "Academy location")}</h2>
              <p>{t("بغداد، العراق", "Baghdad, Iraq")}</p>
              <p dir="ltr">33°17'16.0"N 44°20'52.4"E</p>
              <a className="text-link" href={settings.maps}>
                {t("افتح في Google Maps", "Open in Google Maps")} ↗
              </a>
            </div>
            {map ? (
              <iframe
                title={t("خريطة الأكاديمية", "Academy map")}
                src="https://maps.google.com/maps?q=33.287778%2C44.347889&z=17&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="map-preview">
                <span>⌖</span>
                <p>BAGHDAD · IRAQ</p>
                <button
                  className="button cyan"
                  type="button"
                  onClick={() => setMap(true)}
                >
                  {t("تحميل خريطة Google", "Load Google map")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function ChatPanel({ compact = false }) {
  const { t, locale } = useUI();
  const initial = () => [
    {
      role: "assistant",
      text: t(
        "مرحباً بك في DentaCollab. اسأل عن الدورات، التسجيل، أو الشهادات.",
        "Welcome to DentaCollab. Ask about courses, registration or certificates.",
      ),
    },
  ];
  const [messages, setMessages] = useState(initial);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef();
  useEffect(() => {
    setMessages(initial());
  }, [locale]);
  useEffect(() => {
    if (messages.length > 1) end.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);
  async function send(message) {
    if (!message.trim() || busy) return;
    setMessages((m) => [...m, { role: "user", text: message }]);
    setText("");
    setBusy(true);
    let answer;
    try {
      if (settings.apiBase) {
        const response = await fetch(settings.apiBase + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, locale }),
        });
        if (!response.ok) throw Error();
        const data = await response.json();
        if (typeof data.answer !== "string") throw Error();
        answer = data.answer;
      } else if (/شهاد|certificate/i.test(message)) {
        answer = t(
          "يمكنك مراجعة قسم الأسئلة الشائعة والتواصل مع الأكاديمية لتأكيد تفاصيل الشهادات. هذه إجابة توضيحية محلية.",
          "Visit FAQ or contact the academy to confirm certificate details. This is a local demonstration reply.",
        );
      } else {
        answer = t(
          "تصفّح صفحة الدورات لمعرفة البرامج، ثم افتح صفحة الدورة لمعاينة نموذج التسجيل. هذه نسخة تصميم، والمساعد غير متصل بنموذج AI.",
          "Browse Courses, then open a program to preview registration. This is a design demo; the assistant is not connected to an AI model.",
        );
      }
    } catch {
      answer = t(
        "تعذر الاتصال بالمساعد. حاول لاحقاً أو تواصل مع الأكاديمية.",
        "Could not reach the assistant. Try again later or contact the academy.",
      );
    }
    setMessages((m) => [...m, { role: "assistant", text: answer }]);
    setBusy(false);
  }
  return (
    <div className={"chat-panel " + (compact ? "compact" : "")}>
      <div className="chat-header">
        <img src={img("denta-bot.png")} alt="" />
        <div>
          <strong>{t("مساعد DentaCollab", "DentaCollab assistant")}</strong>
          <small>
            {settings.apiBase
              ? t("متصل بخادمك", "Connected to your backend")
              : t("محادثة توضيحية محلية", "Local demonstration chat")}
          </small>
        </div>
      </div>
      <div className="messages" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={"message " + m.role}>
            {m.text}
          </div>
        ))}
        {busy && <p role="status">{t("جاري الرد…", "Replying…")}</p>}
        <div ref={end} />
      </div>
      <div className="quick-questions">
        {[
          t("ما هي الدورات؟", "What courses are available?"),
          t("كيف أسجّل؟", "How do I register?"),
          t("الشهادات", "Certificates"),
        ].map((q) => (
          <button key={q} disabled={busy} onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <label
          className="sr-only"
          htmlFor={compact ? "chat-mini" : "chat-main"}
        >
          {t("رسالتك", "Your message")}
        </label>
        <input
          id={compact ? "chat-mini" : "chat-main"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("اكتب سؤالك هنا…", "Type your question…")}
          maxLength="2000"
        />
        <button
          className="button"
          disabled={busy || !text.trim()}
          aria-label={t("إرسال", "Send")}
        >
          ↑
        </button>
      </form>
    </div>
  );
}
function Chat() {
  const { t } = useUI();
  return (
    <>
      <PageHero
        eyebrow={t("مساعد الأكاديمية", "Academy assistant")}
        title={t("كيف يمكننا مساعدتك؟", "How can we help?")}
        body={t(
          "اسأل عن الدورات، التسجيل، أو الشهادات.",
          "Ask about courses, registration or certificates.",
        )}
      />
      <section className="section pale">
        <div className="container narrow">
          <ChatPanel />
        </div>
      </section>
    </>
  );
}
function Payment({ status }) {
  const { t } = useUI();
  const query = new URLSearchParams(location.search);
  const demo = query.get("demo") === "1";
  const title =
    status === "success"
      ? t("تم الدفع بنجاح", "Payment successful")
      : status === "failed"
        ? t("تعذر إتمام الدفع", "Payment failed")
        : t("تم إلغاء الدفع", "Payment cancelled");
  return (
    <section className="section payment-page">
      <div className="container narrow">
        <div className="card payment-card">
          {demo ? (
            <>
              <span
                className={
                  "payment-symbol " + (status === "success" ? "" : "failed")
                }
              >
                {status === "success" ? "✓" : status === "failed" ? "!" : "×"}
              </span>
              <p className="sample-note">
                {t(
                  "معاينة تصميم فقط — لم تحدث عملية دفع",
                  "Design preview only — no payment occurred",
                )}
              </p>
              <h1>{title}</h1>
              <p>
                {status === "success"
                  ? t(
                      "نموذج توضيحي لشاشة تأكيد التسجيل والدفع.",
                      "An illustrative registration and payment confirmation screen.",
                    )
                  : t(
                      "يمكنك العودة إلى الدورة أو التواصل مع الأكاديمية.",
                      "Return to the course or contact the academy.",
                    )}
              </p>
              {status === "success" && (
                <dl>
                  {[
                    [t("اسم الطالب", "Student"), "DEMO"],
                    [t("الدورة", "Course"), t("دورة تجريبية", "Sample course")],
                    [t("رقم التسجيل", "Registration"), "DEMO-0001"],
                    [t("رقم الفاتورة", "Invoice"), "PREVIEW-ONLY"],
                    [t("المبلغ", "Amount"), t("غير مطبق", "Not applicable")],
                  ].map(([a, b]) => (
                    <div key={a}>
                      <dt>{a}</dt>
                      <dd>{b}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          ) : (
            <>
              <span className="payment-symbol">◇</span>
              <h1>
                {t("جلسة الدفع غير مؤكدة", "Payment session not verified")}
              </h1>
              <p>
                {t(
                  "لا يمكن تأكيد حالة الدفع من رابط الصفحة. يجب ربط خادمك وبوابة الدفع والتحقق من المعاملة.",
                  "The URL alone cannot confirm a payment. Connect your backend and payment gateway to verify the transaction.",
                )}
              </p>
            </>
          )}
          <div className="actions centered">
            <ButtonLink to="/courses">
              {t("العودة للدورات", "Back to courses")}
            </ButtonLink>
            <ButtonLink to="/" secondary>
              {t("الرئيسية", "Home")}
            </ButtonLink>
            {demo && status === "success" && (
              <button
                className="button secondary"
                onClick={() => window.print()}
              >
                {t("طباعة المعاينة", "Print preview")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
function NotFound({ label, back = "/" }) {
  const { t } = useUI();
  return (
    <section className="section">
      <div className="container not-found">
        <span>404</span>
        <h1>{label || t("الصفحة غير موجودة", "Page not found")}</h1>
        <p>
          {t(
            "تحقق من الرابط أو ارجع لتصفح الموقع.",
            "Check the URL or return to browse the website.",
          )}
        </p>
        <ButtonLink to={back}>{t("العودة", "Go back")}</ButtonLink>
      </div>
    </section>
  );
}
function Router() {
  const { path } = useUI();
  let match;
  if (path === "/") return <Home />;
  if (path === "/courses") return <Courses />;
  if ((match = path.match(/^\/courses\/([^/]+)$/)))
    return <CourseDetail slug={decodeURIComponent(match[1])} />;
  if (path === "/instructors") return <Instructors />;
  if ((match = path.match(/^\/instructors\/([^/]+)$/)))
    return <InstructorDetail id={decodeURIComponent(match[1])} />;
  if (path === "/workshops") return <Workshops />;
  if ((match = path.match(/^\/workshops\/([^/]+)$/)))
    return <WorkshopDetail slug={decodeURIComponent(match[1])} />;
  if (path === "/about") return <About />;
  if (path === "/benefits") return <Benefits />;
  if (path === "/gallery") return <Gallery />;
  if (path === "/graduates" || path === "/testimonials") return <Graduates />;
  if (path === "/faq") return <FAQ />;
  if (path === "/contact") return <Contact />;
  if (path === "/chat") return <Chat />;
  if ((match = path.match(/^\/payments\/(success|failed|cancel)$/)))
    return <Payment status={match[1]} />;
  return <NotFound />;
}
export default function App() {
  const [locale, setLocale] = useState(() => readPref("dc-language", "ar"));
  const [dark, setDark] = useState(
    () => readPref("dc-theme", "light") === "dark",
  );
  const [path, setPath] = useState(location.pathname.replace(/\/$/, "") || "/");
  const [chat, setChat] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const main = useRef();
  const t = (ar, en) => (locale === "ar" ? ar : en);

  useEffect(() => {
    syncLiveData().then((synced) => {
      if (synced) {
        setDataVersion((v) => v + 1);
      }
    });
  }, []);
  function navigate(url, replace = false) {
    if (replace) history.replaceState({}, "", url);
    else history.pushState({}, "", url);
    setPath(location.pathname.replace(/\/$/, "") || "/");
    setChat(false);
    requestAnimationFrame(() => {
      if (location.hash)
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    });
  }
  useEffect(() => {
    const pop = () => {
      setPath(location.pathname.replace(/\/$/, "") || "/");
      setChat(false);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (path === "/testimonials") navigate("/graduates", true);
  }, [path]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    savePref("dc-language", locale);
    savePref("dc-theme", dark ? "dark" : "light");
  }, [locale, dark]);
  useEffect(() => {
    const names = {
      ...Object.fromEntries(nav),
      "/faq": bi("الأسئلة الشائعة", "FAQ"),
      "/workshops": bi("الورش", "Workshops"),
      "/benefits": bi("مزايا الطالب", "Student benefits"),
      "/chat": bi("المساعد الذكي", "Academy assistant"),
    };
    const item =
      courses.find((c) => path === "/courses/" + c.slug) ||
      workshops.find((w) => path === "/workshops/" + w.slug);
    document.title =
      (item?.title[locale] ||
        names[path]?.[locale] ||
        t("أكاديمية طب الأسنان الرقمي", "Digital Dentistry Academy")) +
      " | DentaCollab";
  }, [path, locale]);
  return (
    <UI.Provider
      value={{ locale, setLocale, dark, setDark, path, navigate, t }}
    >
      <a className="skip-link" href="#main">
        {t("تجاوز إلى المحتوى", "Skip to content")}
      </a>
      <Header />
      <main id="main" ref={main} tabIndex="-1">
        <Router />
      </main>
      <Footer />
      {path !== "/chat" && (
        <>
          <button
            className="chat-launcher"
            aria-label={
              chat
                ? t("إغلاق المحادثة", "Close chat")
                : t("فتح المحادثة", "Open chat")
            }
            aria-expanded={chat}
            onClick={() => setChat(!chat)}
          >
            {chat ? "×" : <img src={img("denta-bot.png")} alt="" />}
          </button>
          {chat && (
            <aside
              className="chat-widget"
              aria-label={t("المساعد الذكي", "Academy assistant")}
            >
              <ChatPanel compact />
            </aside>
          )}
        </>
      )}
    </UI.Provider>
  );
}
