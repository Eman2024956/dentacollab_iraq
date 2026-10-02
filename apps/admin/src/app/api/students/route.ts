import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Try 'students' collection first, then 'users' with role='student'
    let snapshot = await adminDb.collection('students').get();

    if (snapshot.empty) {
      snapshot = await adminDb.collection('users').where('role', '==', 'student').get();
    }

    if (snapshot.empty) {
      // Fall back to all users
      snapshot = await adminDb.collection('users').get();
    }

    const students = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: d.uid || doc.id,
        displayName: d.displayName || d.name || 'متدرب',
        email: d.email || '',
        phoneNumber: d.phoneNumber || d.phone || '',
        city: d.city || '',
        profession: d.profession || d.specialty || '',
        role: d.role || 'student',
        enrolledCourses: Array.isArray(d.enrolledCourses) ? d.enrolledCourses : [],
        attendanceRate: d.attendanceRate || '—',
        status: d.status || 'active',
        createdAt: d.createdAt || '',
      };
    });

    return NextResponse.json({ success: true, students, count: students.length });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
