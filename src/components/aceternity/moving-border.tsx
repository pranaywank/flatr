"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderButtonProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    as?: any;
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
    [key: string]: any;
}

export function MovingBorderButton({
    children,
    className,
    containerClassName,
    borderClassName,
    duration = 2000,
    as: Tag = "button",
    ...otherProps
}: MovingBorderButtonProps) {
    return (
        <Tag
            className={cn(
                "relative inline-flex h-12 overflow-hidden p-[1px] focus:outline-none",
                containerClassName
            )}
            {...otherProps}
        >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#000000_50%,#ffffff_100%)]" />
            <span
                className={cn(
                    "inline-flex h-full w-full cursor-pointer items-center justify-center px-6 py-2 text-sm font-semibold backdrop-blur-3xl",
                    className
                )}
            >
                {children}
            </span>
        </Tag>
    );
}
