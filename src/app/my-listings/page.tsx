"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/ui/AppHeader";
import { AnimatedModal } from "@/components/aceternity/animated-modal";
import { Trash2 } from "lucide-react";

interface Listing {
    id: string;
    city: string;
    neighborhood: string;
    flatSize: string;
    rent: number;
    availableFrom: string;
    photos: string[];
}

export default function MyListingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!user && !loading) {
            router.push("/auth?redirect=/my-listings");
            return;
        }
        if (!user) return;

        const q = query(
            collection(db, "listings"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Listing[];
            setListings(fetched);
            setListingsLoading(false);
        });

        return () => unsubscribe();
    }, [user, loading, router]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "listings", deleteTarget));
        } catch (err) {
            console.error("Failed to delete listing:", err);
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    if (loading || listingsLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-black border-t-transparent"
                />
            </div>
        );
    }

    return (
        <>
            <AppHeader backHref="/dashboard" backLabel="Browse" />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-4xl font-black tracking-tight mb-2">My Listings</h1>
                    <p className="text-gray-400 mb-10">{listings.length} {listings.length === 1 ? "listing" : "listings"} posted by you.</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {listings.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-center py-24 border border-dashed border-gray-200"
                        >
                            <p className="text-gray-400 mb-6">You haven't posted any listings yet.</p>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => router.push("/list")}
                                className="bg-black text-white font-semibold px-6 py-3 hover:bg-gray-900 transition-colors"
                            >
                                + Post a Listing
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {listings.map((listing, idx) => (
                                <motion.div
                                    key={listing.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.06, duration: 0.4 }}
                                    className="flex items-center gap-4 border border-gray-200 hover:border-black transition-colors p-4"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100 border border-gray-100">
                                        {listing.photos[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => router.push(`/listing/${listing.id}`)}
                                    >
                                        <p className="font-bold text-lg leading-tight">{listing.neighborhood}</p>
                                        <p className="text-sm text-gray-400">
                                            {listing.flatSize} · ₹{listing.rent.toLocaleString("en-IN")}/mo · {listing.city}
                                        </p>
                                        <p className="text-xs text-gray-300 mt-1">
                                            Available from {new Date(listing.availableFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => router.push(`/listing/${listing.id}`)}
                                            className="text-xs font-semibold border border-gray-200 px-3 py-2 hover:border-black transition-colors"
                                        >
                                            View
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setDeleteTarget(listing.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-2 border border-gray-200 hover:border-red-300"
                                            aria-label="Delete listing"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatedModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="space-y-5">
                    <div>
                        <h2 className="text-2xl font-black mb-2">Delete this listing?</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            This will permanently remove the listing from Flatr. Seekers who have the link will see a "Not found" page. This cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setDeleteTarget(null)}
                            className="flex-1 border border-gray-200 py-3 font-semibold text-sm hover:border-black transition-colors"
                            disabled={deleting}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 bg-black text-white py-3 font-semibold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Yes, delete it"}
                        </motion.button>
                    </div>
                </div>
            </AnimatedModal>
        </>
    );
}
