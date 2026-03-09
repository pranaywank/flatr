'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { AppHeader } from '@/components/ui/AppHeader';

interface Listing {
    city: string;
    neighborhood: string;
    flatSize: string;
    roomsAvailable: number;
    rent: number;
    availableFrom: string;
    description: string;
    photos: string[];
    whatsapp: string;
    createdAt: any;
}

export default function FlatDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListing() {
            if (!id || typeof id !== 'string') return;
            try {
                const docRef = doc(db, 'listings', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setListing(docSnap.data() as Listing);
                } else {
                    console.error("No such listing!");
                }
            } catch (err) {
                console.error("Error fetching listing:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchListing();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-sm">Loading flat details...</div>;
    if (!listing) return <div className="p-8 text-center text-sm">Flat not found.</div>;

    const whatsappMessage = encodeURIComponent(`Hi! I saw your ${listing.flatSize} listing in ${listing.neighborhood} on Flatr. Is it still available?`);
    const whatsappUrl = `https://wa.me/${listing.whatsapp}?text=${whatsappMessage}`;

    return (
        <>
            <AppHeader />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-sm font-medium hover:underline mb-4 inline-block text-gray-500"
                    >
                        &larr; Back to listings
                    </button>
                    <h1 className="text-3xl font-bold mb-2">
                        {listing.flatSize} in {listing.neighborhood}, {listing.city}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm border-b pb-6">
                        <p className="font-semibold text-xl">₹{listing.rent.toLocaleString('en-IN')}</p>
                        <span className="text-gray-300">|</span>
                        <p>Available on: {new Date(listing.availableFrom).toLocaleDateString()}</p>
                        <span className="text-gray-300">|</span>
                        <p>{listing.roomsAvailable} room(s) available</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Photo */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={listing.photos[0]}
                            alt="Main Flat Photo"
                            className="w-full aspect-video object-cover border border-gray-200"
                        />

                        {/* Gallery */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {listing.photos.slice(1).map((url, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={i}
                                    src={url}
                                    alt={`Flat Photo ${i + 2}`}
                                    className="w-full aspect-square object-cover border border-gray-200"
                                />
                            ))}
                        </div>

                        {/* Description */}
                        <div className="whitespace-pre-wrap border bg-gray-50 p-6 leading-relaxed">
                            <h2 className="text-lg font-bold mb-4">About this property</h2>
                            {listing.description}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border p-6 sticky top-8 space-y-6">
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Rent</p>
                                <p className="text-2xl font-bold">₹{listing.rent.toLocaleString('en-IN')}<span className="text-sm font-normal"> / mo</span></p>
                            </div>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button className="w-full">
                                    Contact via WhatsApp
                                </Button>
                            </a>

                            <div className="text-xs text-gray-500 text-center">
                                Never transfer money before seeing a property.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
