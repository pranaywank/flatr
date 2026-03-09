"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
    navItems,
    className,
    rightSlot,
    logo,
}: {
    navItems?: { name: string; link: string }[];
    className?: string;
    rightSlot?: React.ReactNode;
    logo?: React.ReactNode;
}) => {
    const [visible, setVisible] = useState(true);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={cn(
                    "flex max-w-fit md:max-w-none w-full fixed top-0 inset-x-0 mx-auto z-[5000] border border-black/10 bg-white shadow-sm py-4 px-6 items-center justify-between",
                    className
                )}
            >
                {/* Logo */}
                <div className="font-bold text-xl tracking-tight text-black">
                    {logo || "Flatr"}
                </div>

                {/* Center Nav Items */}
                {navItems && navItems.length > 0 && (
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link}
                                className="text-sm font-medium text-black/70 hover:text-black transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                )}

                {/* Right Slot */}
                {rightSlot && <div>{rightSlot}</div>}
            </motion.div>
        </AnimatePresence>
    );
};
