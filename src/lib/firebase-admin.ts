import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            // Trim to ensure we don't have stray quotes or spaces breaking the JSON payload
            const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/^'|'$/g, '').trim();
            const serviceAccount = JSON.parse(rawKey);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            console.log('Firebase Admin Initialized successfully with Service Account Key');
        } else {
            console.warn('Firebase Admin initialized without service account key. Custom token minting will fail.');
            admin.initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } catch (error: any) {
        console.error('Firebase admin initialization error:', error);
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
