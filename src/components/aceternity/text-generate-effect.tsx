"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
    words,
    className,
    filter = true,
    duration = 0.5,
}: {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}) => {
    const wordsArray = words.split(" ");
    return (
        <div className={cn("font-bold", className)}>
            <div className="mt-4">
                <div className="leading-snug tracking-wide">
                    {wordsArray.map((word, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ opacity: 0, filter: filter ? "blur(10px)" : "none" }}
                            animate={{ opacity: 1, filter: filter ? "blur(0px)" : "none" }}
                            transition={{ delay: idx * 0.2, duration }}
                            className="inline-block mr-2"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </div>
        </div>
    );
};
