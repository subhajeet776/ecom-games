import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  viewAllHref?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  viewAllHref,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-neon rounded-full shadow-[0_0_8px_rgba(0,232,90,0.6)]" />
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display uppercase">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-neon font-bold tracking-wider uppercase hover:underline transition-all duration-200"
        >
          View All
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}
