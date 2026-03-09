'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
    photos: string[];
    alt: string;
}

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prev = () => setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
    const next = () => setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

    if (!photos || photos.length === 0) return null;

    return (
        <div className="w-full">
            {/* Main Photo */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={photos[currentIndex]}
                    alt={`${alt} - Photo ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-200"
                />

                {/* Navigation Arrows (only if multiple photos) */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-2 hover:border-black transition-colors focus:outline-none"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-2 hover:border-black transition-colors focus:outline-none"
                            aria-label="Next photo"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Counter Badge */}
                        <div className="absolute bottom-4 right-4 bg-white border border-gray-300 px-3 py-1 text-xs font-medium">
                            {currentIndex + 1} / {photos.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {photos.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors focus:outline-none ${i === currentIndex ? 'border-black' : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
