'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingNav } from '@/components/aceternity/floating-navbar';
import { HoverEffect } from '@/components/aceternity/card-hover-effect';
import { Input } from '@/components/ui/Input';

interface Listing {
    id: string;
    city: string;
    neighborhood: string;
    flatSize: string;
    roomsAvailable: number;
    rent: number;
    availableFrom: string;
    photos: string[];
}

const CITIES = ['All Cities', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
const FLAT_SIZES = ['All Sizes', '1 BHK', '2 BHK', '3 BHK', '4 BHK'];

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);

    // Filter States
    const [filterCity, setFilterCity] = useState('All Cities');
    const [filterMinRent, setFilterMinRent] = useState('');
    const [filterMaxRent, setFilterMaxRent] = useState('');
    const [filterSize, setFilterSize] = useState('All Sizes');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        if (!user && !loading) {
            router.push('/auth');
            return;
        }
        const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedListings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Listing[];
            setListings(fetchedListings);
        });
        return () => unsubscribe();
    }, [user, loading, router]);

    const filteredListings = useMemo(() => {
        return listings.filter((listing) => {
            if (filterCity !== 'All Cities' && listing.city !== filterCity) return false;
            if (filterSize !== 'All Sizes' && listing.flatSize !== filterSize) return false;
            const min = parseInt(filterMinRent, 10);
            const max = parseInt(filterMaxRent, 10);
            if (!isNaN(min) && listing.rent < min) return false;
            if (!isNaN(max) && listing.rent > max) return false;
            if (filterDate) {
                const queryDate = new Date(filterDate).getTime();
                const listDate = new Date(listing.availableFrom).getTime();
                if (listDate < queryDate) return false;
            }
            return true;
        });
    }, [listings, filterCity, filterSize, filterMinRent, filterMaxRent, filterDate]);

    const clearFilters = () => {
        setFilterCity('All Cities');
        setFilterSize('All Sizes');
        setFilterMinRent('');
        setFilterMaxRent('');
        setFilterDate('');
    };

    const hasActiveFilters =
        filterCity !== 'All Cities' ||
        filterSize !== 'All Sizes' ||
        filterMinRent !== '' ||
        filterMaxRent !== '' ||
        filterDate !== '';

    if (loading) {
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

    const addListingButton = (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/list')}
            className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-gray-900 transition-colors"
        >
            + Add Listing
        </motion.button>
    );

    // Map to HoverEffect card format
    const cardItems = filteredListings.map((listing) => ({
        id: listing.id,
        title: `${listing.flatSize} in ${listing.neighborhood}`,
        subtitle: `₹${listing.rent.toLocaleString('en-IN')} · Avail: ${new Date(listing.availableFrom).toLocaleDateString()} · ${listing.city}`,
        image: listing.photos[0],
        onClick: () => router.push(`/listing/${listing.id}`),
    }));

    return (
        <div className="min-h-screen bg-white">
            {/* Floating Nav */}
            <FloatingNav
                rightSlot={addListingButton}
                logo={<span className="cursor-pointer" onClick={() => router.push('/dashboard')}>Flatr</span>}
            />

            {/* Filter Bar — below nav with top padding */}
            <div className="pt-[72px] bg-white border-b border-gray-200">
                <div className="bg-gray-50 py-4 px-6">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">City</label>
                            <select
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="w-full text-sm px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:border-black transition-colors appearance-none"
                            >
                                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Size</label>
                            <select
                                value={filterSize}
                                onChange={(e) => setFilterSize(e.target.value)}
                                className="w-full text-sm px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:border-black transition-colors appearance-none"
                            >
                                {FLAT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Min Rent (₹)</label>
                            <Input type="number" placeholder="0" value={filterMinRent} onChange={(e) => setFilterMinRent(e.target.value)} className="py-2 text-sm" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Max Rent (₹)</label>
                            <Input type="number" placeholder="No Limit" value={filterMaxRent} onChange={(e) => setFilterMaxRent(e.target.value)} className="py-2 text-sm" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Available After</label>
                            <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="py-2 text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Feed */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <motion.p
                        key={filteredListings.length}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-400"
                    >
                        {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
                    </motion.p>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs font-medium hover:underline text-gray-400">
                            Clear filters
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {filteredListings.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-center py-24 border border-dashed border-gray-200"
                        >
                            <p className="text-gray-400 mb-4">No flats match your filters.</p>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={clearFilters}
                                className="border border-black text-black text-sm font-medium px-5 py-2.5 hover:bg-black hover:text-white transition-colors"
                            >
                                Reset Filters
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <HoverEffect
                                items={cardItems.map((item, idx) => ({
                                    ...item,
                                    title: (
                                        <motion.span
                                            key={item.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.floor(idx / 3) * 0.08 + (idx % 3) * 0.05, duration: 0.4 }}
                                        >
                                            {item.title}
                                        </motion.span>
                                    ) as any,
                                }))}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
