import * as React from "react";

export function Table({ className = "", ...props }) {
  return (
    <div className={`w-full overflow-auto ${className}`}>
      <table className="w-full caption-bottom text-sm" {...props} />
    </div>
  );
}

export function TableHeader({ ...props }) {
  return <thead {...props} />;
}

export function TableBody({ ...props }) {
  return <tbody {...props} />;
}

export function TableHead({ className = "", ...props }) {
  return <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />;
}

export function TableRow({ className = "", ...props }) {
  return <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} {...props} />;
}

export function TableCell({ className = "", ...props }) {
  return <td className={`p-4 align-middle ${className}`} {...props} />;
}
