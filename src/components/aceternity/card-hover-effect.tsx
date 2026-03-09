"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        id: string;
        title: string;
        subtitle?: string;
        description?: string;
        image?: string;
        badge?: string;
        onClick?: () => void;
    }[];
    className?: string;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className="relative group block p-0 h-full w-full cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={item.onClick}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-black/5 block"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
                            />
                        )}
                    </AnimatePresence>
                    <Card image={item.image} badge={item.badge}>
                        <CardTitle>{item.title}</CardTitle>
                        {item.subtitle && <CardSubtitle>{item.subtitle}</CardSubtitle>}
                        {item.description && <CardDescription>{item.description}</CardDescription>}
                    </Card>
                </div>
            ))}
        </div>
    );
};

const Card = ({
    children,
    image,
    badge,
}: {
    children: React.ReactNode;
    image?: string;
    badge?: string;
}) => {
    return (
        <div className="relative z-20 w-full border border-gray-200 group-hover:border-black transition-colors duration-200 bg-white h-full overflow-hidden">
            {image && (
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
            <div className="p-5 space-y-1">{children}</div>
        </div>
    );
};

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h4 className={cn("text-black font-bold text-lg leading-tight", className)}>{children}</h4>
);

const CardSubtitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={cn("text-gray-500 text-sm leading-snug", className)}>{children}</p>
);

const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={cn("text-gray-500 text-sm", className)}>{children}</p>
);
