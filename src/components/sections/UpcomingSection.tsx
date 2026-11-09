"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GameCard from "@/components/ui/GameCard";
import { ArrowRight } from "lucide-react";
import { getStoredGames, GAMES_UPDATED_EVENT } from "@/lib/games";
import { preOrderGames, Game } from "@/data/games";

export default function UpcomingSection() {
  const [games, setGames] = useState<Game[]>(preOrderGames);


  const loadGames = () => {
    const all = getStoredGames();
    const upcoming = all.filter((g) => g.isPreOrder);
    setGames(upcoming.length > 0 ? upcoming : all.slice(0, 4));
  };

  useEffect(() => {
    loadGames();
    const handleUpdate = () => loadGames();
    window.addEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return (
    <section className="bg-[#121418]/60 border-y border-[#22242b] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-neon rounded-full shadow-[0_0_8px_rgba(0,232,90,0.6)]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display uppercase">
              Upcoming Releases
            </h2>
          </div>
          <Link
            href="/games?priceRange=200-499"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-neon font-bold tracking-wider uppercase border border-neon/30 px-3.5 py-1.5 rounded-lg hover:bg-neon/10 transition-all cursor-pointer"
          >
            View All
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
        <p className="text-muted text-xs sm:text-sm mb-6 pl-4 font-medium">
          Be the first to play. Pre-order now at the best prices.
        </p>

        {/* Pre-order Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {games.map((game) => (
            <GameCard key={game.id} game={game} variant="preorder" />
          ))}
        </div>
      </div>
    </section>
  );
}
