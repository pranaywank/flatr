import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!rawKey) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY env var is not set');
        }

        // Parse the JSON — Vercel sometimes double-escapes so trim stray quotes
        const serviceAccount = JSON.parse(
            rawKey.replace(/^['"]|['"]$/g, '').trim()
        );

        // Vercel stores private_key newlines as literal \n — fix them
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        // Use project_id from the JSON itself — don't rely on a separate env var
        const projectId = serviceAccount.project_id;
        if (!projectId) {
            throw new Error('project_id is missing from FIREBASE_SERVICE_ACCOUNT_KEY JSON');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId,
        });

        console.log(`Firebase Admin initialized for project: ${projectId}`);
    } catch (error: any) {
        console.error('Firebase Admin initialization FAILED:', error.message);
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
