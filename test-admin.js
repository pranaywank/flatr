const admin = require('firebase-admin');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/^'|'$/g, '').trim();
const serviceAccount = JSON.parse(rawKey);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

async function testAuth() {
    try {
        console.log("Checking user...");
        const user = await admin.auth().getUserByEmail("pranaywankhedexj007@gmail.com");
        console.log("User:", user);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.log("User not found, attempting to create...");
            try {
                const newUser = await admin.auth().createUser({ email: "pranaywankhedexj007@gmail.com" });
                console.log("Created user:", newUser);

                const token = await admin.auth().createCustomToken(newUser.uid);
                console.log("Token:", token);
            } catch (e) {
                console.error("Create error:", e);
            }
        } else {
            console.error("Lookup error:", error);
        }
    }
}

testAuth();
