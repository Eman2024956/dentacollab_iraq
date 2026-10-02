/**
 * Dynamic Content Sync Service
 * Connects the public website (port 5173) to live Firebase Firestore via the Admin API (port 3001)
 */

import {
  courses as defaultCourses,
  instructors as defaultInstructors,
  workshops as defaultWorkshops,
  graduates as defaultGraduates,
  gallery as defaultGallery,
  settings as defaultSettings,
  faqs as defaultFaqs,
  bi,
} from './data.js';

const ADMIN_API_BASE = 'http://localhost:3001/api';

export async function fetchLiveContent() {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/content`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.warn('Admin CMS API unavailable, using fallback data');
      return null;
    }

    const data = await res.json();
    if (!data.success) return null;

    // Transform courses
    const liveCourses = (data.courses && data.courses.length > 0)
      ? data.courses.map((c) => {
          const title = typeof c.title === 'object' ? c.title : bi(c.titleAr || c.title || '', c.titleEn || c.title || '');
          const description = typeof c.description === 'object' ? c.description : bi(c.descriptionAr || c.description || '', c.descriptionEn || '');
          const modules = Array.isArray(c.modules) && c.modules.length > 0
            ? c.modules.map((m) => (typeof m.title === 'object' ? m.title : bi(m.titleAr || m.title || '', m.titleEn || '')))
            : [
                bi('المسح والتحضير السريري الرقمي', 'Digital scanning and prep'),
                bi('تصميم التركيبات ببرمجية Exocad', 'Restoration design with Exocad'),
                bi('التخطيط ومعايرة طابعات 3D', '3D printer calibration & slicing'),
              ];

          return {
            slug: c.slug || c.id,
            title,
            description,
            image: c.coverImagePath || 'smale.jpg',
            level: bi(
              c.level === 'basic' ? 'أساسي' : c.level === 'advanced' ? 'متقدم' : c.level || 'جميع المستويات',
              c.level === 'basic' ? 'Basic' : c.level === 'advanced' ? 'Advanced' : c.level || 'All levels'
            ),
            duration: bi('٤ أسابيع', '4 weeks'),
            instructor: c.instructorIds?.[0] || 'dr-ammar-salieh',
            priceMinorUnits: c.priceMinorUnits || 450000,
            price: bi(`${(c.priceMinorUnits || 450000).toLocaleString()} د.ع`, `${(c.priceMinorUnits || 450000).toLocaleString()} IQD`),
            modules,
          };
        })
      : defaultCourses;

    // Transform instructors
    const liveInstructors = (data.instructors && data.instructors.length > 0)
      ? data.instructors.map((inst) => ({
          id: inst.id || inst.slug,
          name: typeof inst.name === 'object' ? inst.name : bi(inst.name || '', inst.name || ''),
          title: typeof inst.title === 'object' ? inst.title : bi(inst.title || '', inst.title || ''),
          image: inst.image || 'dr-ammar.png',
          bio: typeof inst.bio === 'object' ? inst.bio : bi(inst.bio || '', inst.bio || ''),
          credentials: Array.isArray(inst.credentials)
            ? inst.credentials.map((cr) => (typeof cr === 'object' ? cr : bi(cr, cr)))
            : [bi('التصميم الرقمي', 'Digital design')],
        }))
      : defaultInstructors;

    // Transform graduates
    const liveGraduates = (data.graduates && data.graduates.length > 0)
      ? data.graduates.map((g, idx) => ({
          id: g.id || idx + 1,
          name: typeof g.name === 'object' ? g.name : bi(g.name || '', g.name || ''),
          course: typeof g.course === 'object' ? g.course : bi(g.course || '', g.course || ''),
          quote: typeof g.quote === 'object' ? g.quote : bi(g.quote || '', g.quote || ''),
          rating: g.rating || 5,
        }))
      : defaultGraduates;

    // Transform gallery
    const liveGallery = (data.gallery && data.gallery.length > 0)
      ? data.gallery.map((gal) => ({
          title: typeof gal.title === 'object' ? gal.title : bi(gal.title || '', gal.title || ''),
          description: typeof gal.description === 'object' ? gal.description : bi(gal.description || '', gal.description || ''),
          images: gal.images || ['smale.jpg', 'exoplan.jpg', 'printer.jpg'],
        }))
      : defaultGallery;

    // Transform settings
    const liveSettings = {
      ...defaultSettings,
      whatsapp: data.settings?.contactWhatsApp || defaultSettings.whatsapp,
      phone: data.settings?.contactPhone || '+9647817828545',
      address: data.settings?.academyLocationAddress
        ? (typeof data.settings.academyLocationAddress === 'object' ? data.settings.academyLocationAddress : bi(data.settings.academyLocationAddress, data.settings.academyLocationAddress))
        : bi('بغداد، العراق — المنصور، قرب ساحة الرواد', 'Baghdad, Iraq — Al-Mansour'),
      maps: data.settings?.academyLocationMapUrl || defaultSettings.maps,
      aboutVision: data.settings?.aboutVision || bi(
        'أول أكاديمية ومختبر تدريبي تخصصي في العراق يقدّم تأهيلاً سريرياً وتطبيقاً فردياً على برمجيات Exocad و Exoplan وأحدث طابعات الراتنج ثلاثية الأبعاد.',
        'Iraq’s premier clinical training academy and digital lab offering hands-on workstation training on Exocad, Exoplan, and advanced 3D resin printing.'
      ),
      apiBase: ADMIN_API_BASE,
    };

    return {
      courses: liveCourses,
      instructors: liveInstructors,
      graduates: liveGraduates,
      gallery: liveGallery,
      settings: liveSettings,
      workshops: defaultWorkshops,
      faqs: defaultFaqs,
    };
  } catch (err) {
    console.error('Failed to fetch live content from Firebase CMS:', err);
    return null;
  }
}

export async function syncLiveData() {
  const live = await fetchLiveContent();
  if (!live) return false;

  if (live.courses && live.courses.length > 0) {
    defaultCourses.splice(0, defaultCourses.length, ...live.courses);
  }
  if (live.instructors && live.instructors.length > 0) {
    defaultInstructors.splice(0, defaultInstructors.length, ...live.instructors);
  }
  if (live.graduates && live.graduates.length > 0) {
    defaultGraduates.splice(0, defaultGraduates.length, ...live.graduates);
  }
  if (live.gallery && live.gallery.length > 0) {
    defaultGallery.splice(0, defaultGallery.length, ...live.gallery);
  }
  if (live.settings) {
    Object.assign(defaultSettings, live.settings);
  }
  return true;
}
