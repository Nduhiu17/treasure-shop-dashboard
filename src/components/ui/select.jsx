import * as React from "react";

export const Select = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`flex h-9 w-full rounded-xl border border-input bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-yellow-50 px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ${className}`}
      {...props}
    />
  );
});
Select.displayName = "Select";
