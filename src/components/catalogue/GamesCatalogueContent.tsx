"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  Gamepad2,
} from "lucide-react";
import GameCard from "@/components/ui/GameCard";
import { allGames, type Game } from "@/data/games";
import { getStoredGames, GAMES_UPDATED_EVENT } from "@/lib/games";

const PLATFORMS = ["All", "PC", "PlayStation", "Xbox"];
const GENRES = [
  "All",
  "Action",
  "Adventure",
  "RPG",
  "Racing",
  "Shooter",
  "Sports",
  "Horror",
];
const PRICE_RANGES = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹99", value: "under-99" },
  { label: "₹99 – ₹199", value: "99-199" },
  { label: "₹200 – ₹499", value: "200-499" },
  { label: "₹500+", value: "500-plus" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A–Z", value: "name-asc" },
  { label: "Newest", value: "newest" },
];

export default function GamesCatalogueContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [storedGames, setStoredGames] = useState<Game[]>(allGames);


  useEffect(() => {
    setStoredGames(getStoredGames());
    const handleUpdate = () => setStoredGames(getStoredGames());
    window.addEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  // Parse state from URL search params
  const currentSearch = searchParams.get("search") || "";
  const currentPlatform = searchParams.get("platform") || "All";
  const currentGenre = searchParams.get("genre") || "All";
  const currentPriceRange = searchParams.get("priceRange") || "all";
  const currentSort = searchParams.get("sort") || "featured";

  // Helper to update URL params
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value || value === "all" || value === "All" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleClearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Filter & Sort Logic
  const filteredGames = useMemo(() => {
    return storedGames
      .filter((game) => {

        // Search Filter (title, genre, platform)
        if (currentSearch.trim()) {
          const query = currentSearch.toLowerCase().trim();
          const matchesTitle = game.title.toLowerCase().includes(query);
          const matchesGenre = game.genre.toLowerCase().includes(query);
          const matchesPlatform = game.platform.toLowerCase().includes(query);
          if (!matchesTitle && !matchesGenre && !matchesPlatform) {
            return false;
          }
        }

        // Platform Filter
        if (
          currentPlatform !== "All" &&
          game.platform.toLowerCase() !== currentPlatform.toLowerCase()
        ) {
          return false;
        }

        // Genre Filter
        if (
          currentGenre !== "All" &&
          !game.genre.toLowerCase().includes(currentGenre.toLowerCase())
        ) {
          return false;
        }

        // Price Filter
        if (currentPriceRange !== "all") {
          if (currentPriceRange === "under-99" && game.price >= 99) {
            return false;
          }
          if (
            currentPriceRange === "99-199" &&
            (game.price < 99 || game.price > 199)
          ) {
            return false;
          }
          if (
            currentPriceRange === "200-499" &&
            (game.price < 200 || game.price > 499)
          ) {
            return false;
          }
          if (currentPriceRange === "500-plus" && game.price < 500) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (currentSort) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name-asc":
            return a.title.localeCompare(b.title);
          case "newest":
            return Number(b.id) - Number(a.id);
          case "featured":
          default:
            return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        }
      });
  }, [
    currentSearch,
    currentPlatform,
    currentGenre,
    currentPriceRange,
    currentSort,
  ]);

  const hasActiveFilters =
    Boolean(currentSearch) ||
    currentPlatform !== "All" ||
    currentGenre !== "All" ||
    currentPriceRange !== "all" ||
    currentSort !== "featured";

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title + Stats */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 bg-neon rounded-full shadow-[0_0_10px_rgba(0,232,90,0.6)]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display tracking-wide">
              Game Catalogue
            </h1>
          </div>
          <p className="text-muted text-sm pl-4">
            Browse our entire collection of premium PC & console games at unbeatable prices.
          </p>
        </div>

        {/* Top Control Bar: Search + Sort + Mobile Filter Toggle */}
        <div className="bg-[#121418] border border-[#22242b] rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-lg">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search games by title, genre, platform..."
              value={currentSearch}
              onChange={(e) => updateParams({ search: e.target.value })}
              className="w-full bg-[#181c24] border border-[#262b36] rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-muted/70 focus:outline-none focus:border-neon transition-colors"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            {currentSearch && (
              <button
                onClick={() => updateParams({ search: null })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Results Counter */}
            <span className="text-xs sm:text-sm font-semibold text-white/80 shrink-0">
              Showing <span className="text-neon font-bold">{filteredGames.length}</span> games
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-medium hidden sm:inline">
                Sort:
              </span>
              <select
                value={currentSort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="bg-[#181c24] border border-[#262b36] text-white text-xs sm:text-sm font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-neon cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#121418] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Sheet Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 bg-neon/10 border border-neon/30 text-neon px-3 py-2 rounded-lg text-xs font-bold"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-[#121418]/60 p-3 rounded-lg border border-[#1e222c]">
            <span className="text-xs text-muted font-medium">Active Filters:</span>

            {currentSearch && (
              <span className="inline-flex items-center gap-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold px-2.5 py-1 rounded-full">
                "{currentSearch}"
                <button onClick={() => updateParams({ search: null })}>
                  <X size={12} />
                </button>
              </span>
            )}

            {currentPlatform !== "All" && (
              <span className="inline-flex items-center gap-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold px-2.5 py-1 rounded-full">
                Platform: {currentPlatform}
                <button onClick={() => updateParams({ platform: null })}>
                  <X size={12} />
                </button>
              </span>
            )}

            {currentGenre !== "All" && (
              <span className="inline-flex items-center gap-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold px-2.5 py-1 rounded-full">
                Genre: {currentGenre}
                <button onClick={() => updateParams({ genre: null })}>
                  <X size={12} />
                </button>
              </span>
            )}

            {currentPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1 bg-neon/10 border border-neon/30 text-neon text-xs font-bold px-2.5 py-1 rounded-full">
                Price: {PRICE_RANGES.find((p) => p.value === currentPriceRange)?.label}
                <button onClick={() => updateParams({ priceRange: null })}>
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-neon underline ml-auto font-medium cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Main Grid + Desktop Sidebar Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 space-y-6">
            <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 shadow-lg space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-[#22242b] pb-3">
                <div className="flex items-center gap-2 text-white font-bold font-display uppercase tracking-wide">
                  <Filter size={16} className="text-neon" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-neon hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Platform Filter */}
              <div>
                <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-3">
                  Platform
                </h3>
                <div className="space-y-1.5">
                  {PLATFORMS.map((plat) => (
                    <button
                      key={plat}
                      onClick={() => updateParams({ platform: plat })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentPlatform === plat
                          ? "bg-neon text-black font-extrabold shadow-[0_0_10px_rgba(0,232,90,0.3)]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-3">
                  Genre
                </h3>
                <div className="space-y-1.5">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => updateParams({ genre: g })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentGenre === g
                          ? "bg-neon text-black font-extrabold shadow-[0_0_10px_rgba(0,232,90,0.3)]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => updateParams({ priceRange: pr.value })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentPriceRange === pr.value
                          ? "bg-neon text-black font-extrabold shadow-[0_0_10px_rgba(0,232,90,0.3)]"
                          : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              /* Polished Empty State */
              <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-12 text-center flex flex-col items-center justify-center my-8 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-4">
                  <Gamepad2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide mb-2">
                  No Games Found
                </h3>
                <p className="text-muted text-sm max-w-md mb-6">
                  We couldn't find any games matching your current search or filter criteria. Try adjusting your filters or clear all parameters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 bg-neon text-black font-bold text-sm px-6 py-2.5 rounded-full hover:bg-neon-dark transition-all cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sheet/Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm md:hidden">
          <div className="w-full max-w-xs bg-[#121418] h-full p-6 border-l border-[#22242b] flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-[#22242b] pb-4 mb-6">
                <div className="flex items-center gap-2 text-white font-bold font-display uppercase">
                  <Filter size={18} className="text-neon" />
                  <span>Filter Games</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-muted hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Filter Sections */}
              <div className="space-y-6">
                {/* Platform */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase mb-2">
                    Platform
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map((plat) => (
                      <button
                        key={plat}
                        onClick={() => updateParams({ platform: plat })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                          currentPlatform === plat
                            ? "bg-neon text-black border-neon"
                            : "bg-[#181c24] text-white border-[#262b36]"
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase mb-2">
                    Genre
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.map((g) => (
                      <button
                        key={g}
                        onClick={() => updateParams({ genre: g })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                          currentGenre === g
                            ? "bg-neon text-black border-neon"
                            : "bg-[#181c24] text-white border-[#262b36]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase mb-2">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((pr) => (
                      <button
                        key={pr.value}
                        onClick={() => updateParams({ priceRange: pr.value })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border ${
                          currentPriceRange === pr.value
                            ? "bg-neon text-black border-neon"
                            : "bg-[#181c24] text-white border-[#262b36]"
                        }`}
                      >
                        {pr.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#22242b] space-y-3">
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 border border-white/20 text-white text-xs font-bold rounded-lg hover:bg-white/10"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-neon text-black text-xs font-bold rounded-lg hover:bg-neon-dark"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
