'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface AppHeaderProps {
    backHref?: string;
    backLabel?: string;
    showMyListings?: boolean;
}

export function AppHeader({ backHref, backLabel, showMyListings = true }: AppHeaderProps) {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div
                    className="font-bold text-xl tracking-tight cursor-pointer"
                    onClick={() => router.push('/dashboard')}
                >
                    Flatr
                </div>
                <div className="flex items-center gap-4">
                    {backHref && backLabel && (
                        <button
                            onClick={() => router.push(backHref)}
                            className="text-sm text-gray-400 hover:text-black transition-colors"
                        >
                            ← {backLabel}
                        </button>
                    )}
                    {showMyListings && (
                        <button
                            onClick={() => router.push('/my-listings')}
                            className="text-sm text-gray-500 hover:text-black transition-colors font-medium"
                        >
                            My Listings
                        </button>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push('/list')}
                        className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-gray-900 transition-colors"
                    >
                        + Add Listing
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
