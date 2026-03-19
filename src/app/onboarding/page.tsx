"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const cards = [
    {
        intent: "seeker" as const,
        title: "I'm looking for a place",
        subtitle: "Browse flats and connect with listers",
        emoji: "🏠",
    },
    {
        intent: "lister" as const,
        title: "I have a place to offer",
        subtitle: "Post your room or flat for seekers",
        emoji: "🗝️",
    },
];

function OnboardingContent() {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) router.push("/auth");
        });
        return () => unsubscribe();
    }, [router]);

    const handleSelection = async (intent: "seeker" | "lister") => {
        if (!auth.currentUser || loading) return;
        setSelected(intent);
        setLoading(true);
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, {
                intent,
                email: auth.currentUser.email,
                createdAt: new Date(),
            }, { merge: true });
            if (intent === "seeker") {
                router.push(redirect);
            } else {
                router.push("/list");
            }
        } catch (error) {
            console.error("Error saving user profile:", error);
            setLoading(false);
            setSelected(null);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6 overflow-hidden">
            {/* Logo */}
            <div className="absolute top-6 left-8">
                <span className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => router.push("/dashboard")}>Flatr</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl text-center"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-16">
                    What brings you to Flatr?
                </h1>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    {cards.map((card, idx) => (
                        <motion.button
                            key={card.intent}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelection(card.intent)}
                            disabled={loading}
                            className={`
                relative flex-1 border-2 p-10 text-left transition-all duration-200 focus:outline-none
                ${selected === card.intent
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-gray-200 hover:border-black"
                                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
                        >
                            <div className="text-4xl mb-6">{card.emoji}</div>
                            <p className="text-2xl font-bold mb-2 leading-tight">{card.title}</p>
                            <p className={`text-sm ${selected === card.intent ? "text-white/60" : "text-black/50"}`}>
                                {card.subtitle}
                            </p>
                            {selected === card.intent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute top-4 right-4"
                                >
                                    <div className="w-6 h-6 bg-white flex items-center justify-center">
                                        <span className="text-black text-xs font-bold">✓</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <OnboardingContent />
        </Suspense>
    );
}
