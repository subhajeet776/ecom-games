import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap";

  const variants = {
    primary:
      "bg-neon text-black hover:bg-neon-dark hover:shadow-[0_0_20px_rgba(0,232,90,0.3)]",
    secondary:
      "bg-transparent border border-neon text-neon hover:bg-neon/10 hover:shadow-[0_0_15px_rgba(0,232,90,0.15)]",
    ghost:
      "bg-transparent text-foreground hover:text-neon hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
