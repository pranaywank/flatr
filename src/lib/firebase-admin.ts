import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            // Trim stray quotes/spaces that sometimes appear in env var values
            const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
                .replace(/^['"]|['"]$/g, '')
                .trim();

            const serviceAccount = JSON.parse(rawKey);

            // Vercel stores newlines in private_key as the literal two-character
            // sequence "\n" instead of a real newline. Fix it so the RSA key is valid.
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            console.log('Firebase Admin initialized successfully');
        } else {
            console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set — Admin SDK will not work.');
            admin.initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
