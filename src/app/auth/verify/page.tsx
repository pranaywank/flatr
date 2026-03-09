"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

function VerifyContent() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const redirect = searchParams.get("redirect") || "/dashboard";

    useEffect(() => {
        if (!email) router.push("/auth");
    }, [email, router]);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter the 6-digit code.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to verify OTP");
            await signInWithCustomToken(auth, data.token);
            if (data.isNewUser) {
                // Pass redirect through onboarding so it persists
                router.push(`/onboarding?redirect=${encodeURIComponent(redirect)}`);
            } else {
                router.push(redirect);
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
        >
            {/* Logo */}
            <div className="mb-12 text-center">
                <span className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => router.push("/")}>Flatr</span>
            </div>

            <div className="space-y-2 mb-10">
                <h1 className="text-4xl font-black tracking-tight">Check your email.</h1>
                <p className="text-black/50 text-lg">
                    We sent a 6-digit code to <span className="text-black font-semibold">{email}</span>.
                </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-black/40">6-Digit Code</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        disabled={loading}
                        required
                        className="w-full px-4 py-4 bg-white border-2 border-gray-200 focus:outline-none focus:border-black transition-colors text-3xl font-mono text-center tracking-[0.7em] placeholder:tracking-[0.5em] placeholder:text-gray-200"
                    />
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm mt-1"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    className="w-full bg-black text-white font-bold text-lg py-4 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent inline-block"
                            />
                            Verifying...
                        </span>
                    ) : "Verify and sign in →"}
                </motion.button>

                <button
                    type="button"
                    onClick={() => router.push("/auth")}
                    className="w-full text-sm text-black/40 hover:text-black transition-colors text-center"
                >
                    ← Back to email
                </button>
            </form>
        </motion.div>
    );
}

export default function VerifyPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
            <Suspense fallback={<div className="font-medium animate-pulse text-black/40">Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </main>
    );
}
