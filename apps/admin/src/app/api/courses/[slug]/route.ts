import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function corsResponse(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return corsResponse({}, 200);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return corsResponse({ error: 'Slug parameter is required' }, 400);
    }

    // Try finding by ID or slug
    let doc = await adminDb.collection('courses').doc(slug).get();
    if (!doc.exists) {
      const query = await adminDb.collection('courses').where('slug', '==', slug).limit(1).get();
      if (!query.empty) {
        doc = query.docs[0];
      }
    }

    if (!doc || !doc.exists) {
      return corsResponse({ error: 'Course not found' }, 404);
    }

    const courseData = { id: doc.id, ...doc.data() };

    // Also get modules
    const modulesSnapshot = await adminDb.collection('courses').doc(doc.id).collection('modules').get();
    const modules = modulesSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Also get cohorts
    const cohortsSnapshot = await adminDb.collection('courseCohorts').where('courseId', '==', doc.id).get();
    const cohorts = cohortsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return corsResponse({
      success: true,
      course: courseData,
      modules,
      cohorts,
    });
  } catch (error: any) {
    console.error('Error fetching course by slug:', error);
    return corsResponse({ error: error.message || 'Failed to fetch course' }, 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const nowIso = new Date().toISOString();

    const courseRef = adminDb.collection('courses').doc(slug);
    await courseRef.set({
      ...body,
      updatedAt: nowIso,
    }, { merge: true });

    // Log update
    await adminDb.collection('auditLogs').add({
      action: 'course.update',
      slug,
      summary: `تعديل تفاصيل دورة: ${body.title?.ar || slug}`,
      admin: 'admin@dentacollab.org',
      timestamp: nowIso,
    });

    return corsResponse({ success: true, message: 'Course updated successfully' });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return corsResponse({ error: error.message || 'Failed to update course' }, 500);
  }
}
