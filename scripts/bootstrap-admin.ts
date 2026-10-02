/**
 * DentaCollab Super-Admin Bootstrap CLI
 * Injects super-admin custom claims and profile for: dentacollab-iraq
 * Usage: npx tsx scripts/bootstrap-admin.ts <adminEmail> <password> <fullName>
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

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
      console.log(`🔑 Initialized Firebase Admin using: ${path.basename(p)}`);
      initialized = true;
      break;
    }
  }

  if (!initialized) {
    initializeApp({
      projectId: 'dentacollab-iraq',
    });
  }
}

const auth = getAuth();
const db = getFirestore();

async function bootstrap() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@dentacollab.org';
  const password = args[1] || 'DentaCollab2026!Admin';
  const fullName = args[2] || 'المشرف العام للأكاديمية';

  console.log(`🔐 Bootstrapping Super-Admin for: ${email}`);

  let uid = 'admin_super_dentacollab';

  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`Firebase Auth user exists: ${user.uid}`);
      uid = user.uid;
    } catch {
      user = await auth.createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: true,
      });
      uid = user.uid;
      console.log(`Created new Firebase Auth user with UID: ${uid}`);
    }

    await auth.setCustomUserClaims(uid, { role: 'super_admin' });
    console.log(`✅ Granted custom claim: { role: 'super_admin' }`);
  } catch (authErr: any) {
    console.log(`ℹ️ Firebase Auth provider note: ${authErr.message || authErr}`);
    console.log('   (Please ensure Email/Password provider is enabled in Firebase Console -> Authentication -> Sign-in method)');
    console.log(`   Proceeding to inject super-admin records into Firestore collections...`);
  }

  // Write to staffMemberships and users collection in Firestore
  const nowIso = new Date().toISOString();

  await db.collection('staffMemberships').doc(uid).set({
    uid,
    email,
    fullName,
    role: 'super_admin',
    isActive: true,
    grantedByUid: 'CLI_BOOTSTRAP',
    updatedAt: nowIso,
    createdAt: nowIso,
  }, { merge: true });

  await db.collection('users').doc(uid).set({
    uid,
    email,
    fullName,
    role: 'super_admin',
    preferredLanguage: 'ar',
    preferredTheme: 'dark',
    createdAt: nowIso,
    updatedAt: nowIso,
  }, { merge: true });

  console.log(`🎉 Super-Admin successfully initialized in Firestore!`);
  console.log(`   UID: ${uid}`);
  console.log(`   Email: ${email}`);
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
