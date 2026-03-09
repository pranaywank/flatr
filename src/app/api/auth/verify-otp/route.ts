import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        if (!adminDb || !adminAuth) {
            return NextResponse.json({ error: 'Internal Server Error: DB/Auth not initialized' }, { status: 500 });
        }

        // Retrieve the stored OTP record
        const otpDocRef = adminDb.collection('otps').doc(email);
        const otpDoc = await otpDocRef.get();

        if (!otpDoc.exists) {
            return NextResponse.json({ error: 'OTP request not found or expired' }, { status: 400 });
        }

        const data = otpDoc.data()!;

        if (data.expiresAt < Date.now()) {
            await otpDocRef.delete();
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        if (data.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
        }

        // OTP is valid!
        // Delete the OTP document so it can't be reused
        await otpDocRef.delete();

        // Ensure user exists in Firebase Auth, or create them
        let userRecord;
        try {
            console.log("Looking up user for token generation:", email);
            userRecord = await adminAuth.getUserByEmail(email);
        } catch (error: any) {
            // Firebase throws a specific error if the user is not found
            if (error.code === 'auth/user-not-found') {
                userRecord = await adminAuth.createUser({ email });
            } else {
                console.error('Firebase Auth Error:', error);
                throw error;
            }
        }

        // Check if the user profile exists in Firestore
        const userProfileRef = adminDb.collection('users').doc(userRecord.uid);
        const userProfileDoc = await userProfileRef.get();

        // Determine whether they are new (need onboarding)
        const isNewUser = !userProfileDoc.exists || !userProfileDoc.data()?.intent;

        // Mint a custom token using Firebase Admin
        const customToken = await adminAuth.createCustomToken(userRecord.uid, {
            isNewUser: isNewUser // Pass this claim so client can decide routing logic initially if needed
        });

        return NextResponse.json({
            success: true,
            token: customToken,
            isNewUser: isNewUser
        });

    } catch (error: any) {
        console.error('Error in verify-otp:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
