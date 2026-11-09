"use client";

import { AlertTriangle, Info } from "lucide-react";

export default function DemoNoticeBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs font-semibold">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-400 shrink-0" />
          <span>
            <strong className="font-extrabold uppercase tracking-wide">Portfolio Demo Admin Mode:</strong> Data is persisted locally via browser <code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-200">localStorage</code>. This is a frontend demo and not a production-secure auth system.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-400/80 shrink-0">
          <Info size={13} />
          <span>Changes affect this browser state</span>
        </div>
      </div>
    </div>
  );
}
