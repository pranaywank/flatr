"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
    children,
    content,
    className,
}: {
    children: React.ReactNode;
    content: string;
    className?: string;
}) => {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className={cn("relative inline-flex", className)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {children}
            <AnimatePresence>
                {hovering && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs px-3 py-2 whitespace-nowrap max-w-[220px] text-center leading-snug border border-white/20"
                    >
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
