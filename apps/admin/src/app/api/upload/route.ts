import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرفاق ملف للرفع' }, { status: 400 });
    }

    // Validate type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو WebP أو SVG' },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم الصورة يتجاوز الحد الأقصى (10 ميغابايت)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = adminStorage.bucket();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;
    const token = randomUUID();

    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: token,
          uploadedBy: 'dentacollab-admin',
          originalName: file.name,
        },
      },
      resumable: false,
    });

    // Make public if supported, or rely on tokenized Firebase Storage URL
    await fileRef.makePublic().catch(() => {
      // Ignore if bucket uniform access policy restricts individual ACLs
    });

    // Firebase Storage official download URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: storagePath,
      name: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (error: any) {
    console.error('Firebase Storage upload error:', error);
    return NextResponse.json(
      { error: error.message || 'فشل رفع الصورة إلى Firebase Storage' },
      { status: 500 }
    );
  }
}
