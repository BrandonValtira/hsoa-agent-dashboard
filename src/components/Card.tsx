import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border border-[#e8e8e8] bg-white overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[#e8e8e8] bg-white">
          <h2 className="text-sm font-semibold text-[#3e4543]">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
