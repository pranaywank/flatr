"use client";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ImagesSlider = ({
    images,
    className,
    autoplay = true,
    direction = "up",
}: {
    images: string[];
    className?: string;
    autoplay?: boolean;
    direction?: "up" | "down";
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    useEffect(() => {
        // Preload images
        const loadImages = async () => {
            setLoading(true);
            const promises = images.map(
                (src) =>
                    new Promise((res, rej) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => res(src);
                        img.onerror = rej;
                    })
            );
            const loaded = await Promise.all(promises);
            setLoadedImages(loaded as string[]);
            setLoading(false);
        };
        loadImages();
    }, [images]);

    useEffect(() => {
        if (!autoplay) return;
        const interval = setInterval(handleNext, 4000);
        return () => clearInterval(interval);
    }, [autoplay, handleNext]);

    const slideVariants = {
        initial: { scale: 0, opacity: 0, rotateX: 45 },
        visible: { scale: 1, rotateX: 0, opacity: 1, transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1.0] as [number, number, number, number] } },
        exit: { scale: 1, opacity: 0, y: direction === "up" ? -150 : 150, transition: { duration: 0.4 } },
    };

    if (loading) {
        return (
            <div className={cn("w-full aspect-[16/9] bg-gray-100 flex items-center justify-center", className)}>
                <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className={cn("relative w-full aspect-[16/9] overflow-hidden bg-black", className)}>
            <AnimatePresence>
                <motion.img
                    key={currentIndex}
                    src={loadedImages[currentIndex]}
                    initial="initial"
                    animate="visible"
                    exit="exit"
                    variants={slideVariants}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={`Photo ${currentIndex + 1}`}
                />
            </AnimatePresence>

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-white border border-gray-300 px-3 py-1 text-xs font-medium z-10">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-2 hover:border-black transition-colors z-10 focus:outline-none"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-2 hover:border-black transition-colors z-10 focus:outline-none"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Thumbnail dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                            "w-2 h-2 transition-colors focus:outline-none",
                            i === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};
