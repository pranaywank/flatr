"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function AuthForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "";

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");
            const verifyUrl = `/auth/verify?email=${encodeURIComponent(email)}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`;
            router.push(verifyUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
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
                    <h1 className="text-4xl font-black tracking-tight">Welcome back.</h1>
                    <p className="text-black/50 text-lg">Enter your email and we'll send you a login code.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-black/40">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full px-4 py-4 bg-white border-2 border-gray-200 focus:outline-none focus:border-black transition-colors text-lg placeholder:text-gray-300"
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
                                Sending code...
                            </span>
                        ) : "Continue →"}
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <AuthForm />
        </Suspense>
    );
}
