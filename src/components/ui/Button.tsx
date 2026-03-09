import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    // The design requires large, confident typography. Here we use text-lg and px-8 py-3.
    const sizeStyles = "px-8 py-4 text-base sm:text-lg";

    const variants = {
        primary: "bg-black text-white hover:bg-black/90",
        secondary: "bg-transparent text-black border-2 border-black hover:bg-black/5",
    };

    return (
        <button
            className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
