"use client";

import { useEffect, useState } from "react";
import GameCard from "@/components/ui/GameCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getStoredGames, GAMES_UPDATED_EVENT } from "@/lib/games";
import { trendingGames, Game } from "@/data/games";

export default function TrendingGames() {
  const [games, setGames] = useState<Game[]>(trendingGames);


  const loadGames = () => {
    const all = getStoredGames();
    const trending = all.filter((g) => g.isTrending);
    setGames(trending.length > 0 ? trending : all.slice(0, 6));
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <SectionHeading title="Trending Games" viewAllHref="/games" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
