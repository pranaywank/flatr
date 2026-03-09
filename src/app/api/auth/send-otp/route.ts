import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { resend, SENDER_EMAIL } from '@/lib/resend';

// Simple helper to generate a 6 digit code
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        if (!adminDb) {
            console.error('[send-otp] Firebase Admin DB is null — check FIREBASE_SERVICE_ACCOUNT_KEY env var');
            return NextResponse.json({ error: 'Server configuration error: DB not initialized' }, { status: 500 });
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 15 * 60 * 1000;

        // 1. Write OTP to Firestore
        try {
            await adminDb.collection('otps').doc(email).set({
                otp,
                expiresAt,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        } catch (dbErr: any) {
            console.error('[send-otp] Firestore write failed:', dbErr.message);
            return NextResponse.json({ error: `Database error: ${dbErr.message}` }, { status: 500 });
        }

        // 2. Send email via Resend
        const { data, error } = await resend.emails.send({
            from: `Flatr <${SENDER_EMAIL}>`,
            to: email,
            subject: 'Your Flatr Login Code',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; font-weight: 800; font-size: 24px; margin-bottom: 24px;">Flatr</h1>
          <p style="color: #000; font-size: 16px; margin-bottom: 24px;">Your login code is:</p>
          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #000; margin-bottom: 32px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
        });

        if (error) {
            console.error('[send-otp] Resend error:', JSON.stringify(error));
            return NextResponse.json({ error: `Email sending failed: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error: any) {
        console.error('[send-otp] Unhandled error:', error.message, error.stack);
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
