import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET() {
    const checks: Record<string, string> = {};

    // Check Firebase Admin
    checks.firebase_admin_db = adminDb ? 'ok' : 'NOT INITIALIZED';
    checks.firebase_admin_auth = adminAuth ? 'ok' : 'NOT INITIALIZED';

    // Check env vars (never log actual values)
    checks.FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? `set (${process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length} chars)`
        : 'MISSING';
    checks.RESEND_API_KEY = process.env.RESEND_API_KEY ? 'set' : 'MISSING';
    checks.RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'MISSING';
    checks.NEXT_PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING';

    // Try a quick Firestore read to confirm connectivity
    if (adminDb) {
        try {
            await adminDb.collection('health').doc('ping').set({ ts: Date.now() });
            checks.firestore_write = 'ok';
        } catch (e: any) {
            checks.firestore_write = `ERROR: ${e.message}`;
        }
    }

    const allOk = Object.values(checks).every(v => v === 'ok' || v.startsWith('set'));
    return NextResponse.json({ status: allOk ? 'healthy' : 'degraded', checks });
}
