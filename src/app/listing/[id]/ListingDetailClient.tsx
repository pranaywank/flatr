"use client";

import { motion } from "framer-motion";
import { ImagesSlider } from "@/components/aceternity/images-slider";
import { MovingBorderButton } from "@/components/aceternity/moving-border";
import { ThreeDCardEffect } from "@/components/aceternity/three-d-card";
import { AnimatedTooltip } from "@/components/aceternity/animated-tooltip";
import { AppHeader } from "@/components/ui/AppHeader";

interface ListingData {
    city: string;
    neighborhood: string;
    flatSize: string;
    roomsAvailable: number;
    rent: number;
    availableFrom: string;
    description: string;
    photos: string[];
    whatsapp: string;
}

export function ListingDetailClient({ listing }: { listing: ListingData }) {
    const message = encodeURIComponent(
        `Hi, I found your listing on Flatr for ${listing.neighborhood}. Is it still available?`
    );
    const whatsappUrl = `https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${message}`;

    const availableDate = new Date(listing.availableFrom).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <>
            <AppHeader backHref="/dashboard" backLabel="All listings" />

            {/* Full-width photo gallery */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full"
            >
                <ImagesSlider images={listing.photos} className="max-h-[70vh]" />
            </motion.div>

            {/* Main content */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left: listing info */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="border-b pb-6"
                        >
                            <h1 className="text-4xl font-black tracking-tight mb-1">{listing.neighborhood}</h1>
                            <p className="text-gray-500 text-lg">
                                {listing.flatSize} · {listing.roomsAvailable} room{listing.roomsAvailable !== 1 ? 's' : ''} available · {listing.city}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-b pb-6"
                        >
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Rent per room</p>
                                <AnimatedTooltip content="Per room per month, excluding maintenance charges">
                                    <p className="text-2xl font-black cursor-help border-b border-dashed border-gray-300 inline-block">
                                        ₹{listing.rent.toLocaleString('en-IN')}
                                    </p>
                                </AnimatedTooltip>
                                <p className="text-xs text-gray-400 mt-1">per month</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Available</p>
                                <p className="text-lg font-semibold">{availableDate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Rooms</p>
                                <p className="text-lg font-semibold">{listing.roomsAvailable} available</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h2 className="text-xl font-bold mb-4">About this flat</h2>
                            <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{listing.description}</p>
                        </motion.div>
                    </div>

                    {/* Right: sticky 3D contact card (desktop only) */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <ThreeDCardEffect className="sticky top-24">
                                <div className="border border-gray-200 p-6 space-y-5 bg-white">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Rent</p>
                                        <p className="text-3xl font-black">₹{listing.rent.toLocaleString('en-IN')}</p>
                                        <p className="text-sm text-gray-400">per room / month</p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Available from</p>
                                        <p className="font-semibold">{availableDate}</p>
                                    </div>

                                    <motion.a
                                        whileTap={{ scale: 0.97 }}
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <MovingBorderButton
                                            className="bg-black text-white font-bold text-sm w-full justify-center"
                                            containerClassName="w-full h-12 rounded-none"
                                        >
                                            Chat on WhatsApp
                                        </MovingBorderButton>
                                    </motion.a>

                                    <p className="text-xs text-gray-400 text-center">Never send money before visiting in person.</p>
                                </div>
                            </ThreeDCardEffect>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile sticky bottom bar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between lg:hidden z-50"
            >
                <div>
                    <p className="font-black text-xl">₹{listing.rent.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">per room / month</p>
                </div>
                <motion.a
                    whileTap={{ scale: 0.97 }}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-6 py-3 font-bold text-sm hover:bg-gray-900 transition-colors"
                >
                    Chat on WhatsApp
                </motion.a>
            </motion.div>

            <div className="h-24 lg:hidden" />
        </>
    );
}
