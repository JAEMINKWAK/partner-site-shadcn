import { useState } from "react";

export function Dialog({ children }) {
  return <div>{children}</div>;
}

export function DialogTrigger({ asChild, children }) {
  return children;
}

export function DialogContent({ children }) {
  return (
    <div className="border p-4 rounded bg-white shadow-md">
      {children}
    </div>
  );
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold mb-2">{children}</h2>;
}
