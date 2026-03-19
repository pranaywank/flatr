'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { AppHeader } from '@/components/ui/AppHeader';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
const FLAT_SIZES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];

function FormSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="space-y-4"
        >
            {children}
        </motion.section>
    );
}

export default function ListPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [hasListings, setHasListings] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitDone, setSubmitDone] = useState(false);

    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [flatSize, setFlatSize] = useState('');
    const [roomsAvailable, setRoomsAvailable] = useState('');
    const [rent, setRent] = useState('');
    const [availableFrom, setAvailableFrom] = useState('');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [whatsapp, setWhatsapp] = useState('');

    // Check if user already has listings
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'listings'),
            where('userId', '==', user.uid),
            limit(1)
        );
        getDocs(q).then((snapshot) => {
            setHasListings(!snapshot.empty);
        });
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/auth?redirect=/list');
            return;
        }
        if (photos.length < 3) return alert('Please upload at least 3 photos.');
        if (description.length > 1000) return alert('Description must be under 1000 characters.');
        // Validate WhatsApp: 10 digits, optionally with +91 prefix
        const digits = whatsapp.replace(/\D/g, '');
        const isValidWhatsApp = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
        if (!isValidWhatsApp) {
            alert('Please enter a valid 10-digit Indian WhatsApp number (e.g. +91 98765 43210)');
            return;
        }
        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, 'listings'), {
                userId: user.uid,
                city, neighborhood, flatSize,
                roomsAvailable: parseInt(roomsAvailable, 10),
                rent: parseInt(rent, 10),
                availableFrom, description, photos, whatsapp,
                createdAt: serverTimestamp(),
            });
            setSubmitDone(true);
            setTimeout(() => router.push(`/listing/${docRef.id}`), 600);
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to post listing. Please try again.');
            setIsSubmitting(false);
        }
    };

    const selectClass = "w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors appearance-none text-black";
    const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-300";
    const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5";

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-black border-t-transparent" />
        </div>
    );

    return (
        <>
            <AppHeader backHref="/dashboard" backLabel="Browse" showMyListings={hasListings} />
            <div className="max-w-2xl mx-auto px-6 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Post a flat.</h1>
                    <p className="text-black/40 mb-12">Fill out the details to list your available room or flat.</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-12">

                    <FormSection delay={0.05}>
                        <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>City</label>
                                <select required value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                                    <option value="" disabled>Select a city</option>
                                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Neighborhood</label>
                                <input required placeholder="e.g. Indiranagar, Bandra" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection delay={0.1}>
                        <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Flat Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Size</label>
                                <select required value={flatSize} onChange={(e) => setFlatSize(e.target.value)} className={selectClass}>
                                    <option value="" disabled>Select size</option>
                                    {FLAT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Rooms Available</label>
                                <input type="number" min="1" required placeholder="1" value={roomsAvailable} onChange={(e) => setRoomsAvailable(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Rent per room (₹)</label>
                                <input type="number" min="0" required placeholder="20000" value={rent} onChange={(e) => setRent(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection delay={0.15}>
                        <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                            <h2 className="text-lg font-bold">About the flat</h2>
                            <span className={`text-xs ${description.length > 900 ? 'text-black' : 'text-gray-300'}`}>{description.length}/1000</span>
                        </div>
                        <textarea
                            required maxLength={1000}
                            placeholder="Tell us about the amenities, society facilities, maid costs, maintenance charges, and anything else a flatmate should know..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className={`${inputClass} resize-y`}
                        />
                        <div>
                            <label className={labelClass}>Available From</label>
                            <input type="date" required value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className={inputClass} />
                        </div>
                    </FormSection>

                    <FormSection delay={0.2}>
                        <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                            <h2 className="text-lg font-bold">Photos</h2>
                            <span className="text-xs text-gray-300">Min 3, Max 10</span>
                        </div>
                        <ImageUpload value={photos} onChange={setPhotos} minFiles={3} maxFiles={10} />
                    </FormSection>

                    <FormSection delay={0.25}>
                        <h2 className="text-lg font-bold border-b border-gray-100 pb-3">Contact</h2>
                        <div>
                            <label className={labelClass}>WhatsApp Number</label>
                            <p className="text-xs text-gray-400 mb-2">A valid 10-digit Indian mobile number. Seekers will use this to contact you directly.</p>
                            <input
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                pattern="^[+]?[0-9\s\-]{10,15}$"
                                title="Please enter a valid 10-digit Indian mobile number"
                                className={inputClass}
                            />
                        </div>
                    </FormSection>

                    <div className="pt-4">
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.97 }}
                            disabled={isSubmitting || photos.length < 3}
                            className={`w-full py-5 font-bold text-lg transition-all duration-300 ${submitDone ? 'bg-black text-white' : 'bg-black text-white hover:bg-gray-900'} disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                            {submitDone ? '✓ Posted!' : isSubmitting ? 'Posting...' : 'Post Listing'}
                        </motion.button>
                        {photos.length < 3 && (
                            <p className="text-center text-xs text-gray-400 mt-2">Upload at least 3 photos to submit</p>
                        )}
                    </div>

                </form>
            </div>
        </>
    );
}
