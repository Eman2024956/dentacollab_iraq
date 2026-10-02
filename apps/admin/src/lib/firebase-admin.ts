import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

function getAdminApp(): admin.app.App {
  if (admin.apps && admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  // Check if service account file exists
  const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'dentacollab-iraq',
      storageBucket: 'dentacollab-iraq.firebasestorage.app',
    });
  }

  // Fallback to default credentials
  return admin.initializeApp({
    projectId: 'dentacollab-iraq',
  });
}

export const adminApp = getAdminApp();

import { getFirestore, Firestore } from 'firebase-admin/firestore';

let _firestore: Firestore | null = null;
export function getAdminFirestore(): Firestore {
  if (!_firestore) {
    const app = getAdminApp();
    try {
      _firestore = getFirestore(app, 'dentacollab');
    } catch {
      _firestore = getFirestore(app);
    }
  }
  return _firestore;
}

export const adminDb = {
  collection: (name: string) => getAdminFirestore().collection(name),
  doc: (path: string) => getAdminFirestore().doc(path),
  batch: () => getAdminFirestore().batch(),
  getFirestore: () => getAdminFirestore(),
};

export const adminAuth = {
  getUser: (uid: string) => getAdminApp().auth().getUser(uid),
  createUser: (props: any) => getAdminApp().auth().createUser(props),
};

import { getStorage } from 'firebase-admin/storage';

export const adminMessaging = {
  send: (payload: any) => getAdminApp().messaging().send(payload),
};

export const adminStorage = {
  bucket: (name?: string) => getStorage(getAdminApp()).bucket(name || 'dentacollab-iraq.firebasestorage.app'),
};
