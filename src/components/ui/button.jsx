import * as React from "react";

export const Button = React.forwardRef(
  ({ className = "", variant = "default", ...props }, ref) => {
    let base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    let variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary"
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant] || variants.default} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
