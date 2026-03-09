import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col w-full gap-2">
                {label && (
                    <label className="text-sm font-semibold text-black">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-4 text-base bg-transparent border-2 border-black
            placeholder:text-black/40 
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
                    {...props}
                />
                {error && <span className="text-sm font-medium text-red-500">{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";
