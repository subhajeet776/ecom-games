"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Gamepad2,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Check,
  Tag,
  Flame,
  Clock,
  Sparkles,
} from "lucide-react";
import { getStoredGames, saveGame, deleteGame, GAMES_UPDATED_EVENT } from "@/lib/games";
import { Game } from "@/data/games";
import GameFormModal from "@/components/admin/GameFormModal";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // Delete Confirmation States
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);

  const loadGames = () => {
    setGames(getStoredGames());
  };

  useEffect(() => {
    loadGames();

    const handleUpdate = () => loadGames();
    window.addEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesGenre = game.genre.toLowerCase().includes(q);
        const matchesPlatform = game.platform.toLowerCase().includes(q);
        if (!matchesTitle && !matchesGenre && !matchesPlatform) return false;
      }
      if (selectedPlatform !== "All" && game.platform.toLowerCase() !== selectedPlatform.toLowerCase()) {
        return false;
      }
      if (selectedGenre !== "All" && !game.genre.toLowerCase().includes(selectedGenre.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [games, searchQuery, selectedPlatform, selectedGenre]);

  const handleOpenAddModal = () => {
    setEditingGame(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (game: Game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingGame) {
      deleteGame(deletingGame.id);
      setDeletingGame(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-neon text-xs font-bold uppercase tracking-widest mb-1">
            <Gamepad2 size={16} />
            <span>Product Catalogue Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Games Inventory ({filteredGames.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Add, edit, or remove games. Changes sync immediately to customer storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-neon text-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-neon-dark transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,232,90,0.3)] shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Game</span>
        </button>
      </div>

      {/* Control Bar: Search + Filters */}
      <div className="bg-[#121418] border border-[#22242b] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search games by title, genre, platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181c24] border border-[#262b36] rounded-lg py-2 pl-9 pr-9 text-xs text-white placeholder:text-muted focus:outline-none focus:border-neon"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-[#181c24] border border-[#262b36] text-white text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-neon cursor-pointer"
          >
            <option value="All">All Platforms</option>
            <option value="PC">PC</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-[#181c24] border border-[#262b36] text-white text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-neon cursor-pointer"
          >
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="RPG">RPG</option>
            <option value="Racing">Racing</option>
            <option value="Shooter">Shooter</option>
            <option value="Sports">Sports</option>
            <option value="Horror">Horror</option>
          </select>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#181c24] border-b border-[#22242b] text-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Game</th>
                <th className="py-3.5 px-4">Platform & Genre</th>
                <th className="py-3.5 px-4">Current Price</th>
                <th className="py-3.5 px-4">Original Price</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Badges & Flags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e222c]">
              {filteredGames.map((game) => (
                <tr key={game.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Game Cover + Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative aspect-[2/3] w-11 h-16 rounded-lg overflow-hidden border border-[#262b36] bg-black shrink-0">
                        <Image
                          src={game.coverImage}
                          alt={game.title}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-extrabold text-white text-sm leading-tight">
                          {game.title}
                        </p>
                        <p className="text-[10px] text-muted font-mono mt-0.5">
                          slug: {game.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Platform & Genre */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="inline-block bg-neon/10 border border-neon/30 text-neon text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {game.platform}
                      </span>
                      <p className="text-white/80 font-medium text-xs">{game.genre}</p>
                    </div>
                  </td>

                  {/* Current Price */}
                  <td className="py-3.5 px-4 font-black text-neon text-sm">
                    ₹{game.price}
                  </td>

                  {/* Original Price */}
                  <td className="py-3.5 px-4 text-muted font-medium text-xs">
                    {game.originalPrice ? `₹${game.originalPrice.toLocaleString("en-IN")}` : "—"}
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-4">
                    {game.discount ? (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                        -{game.discount}% OFF
                      </span>
                    ) : (
                      <span className="text-muted text-[11px]">—</span>
                    )}
                  </td>

                  {/* Badges & Section Flags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {game.badge && (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                          {game.badge}
                        </span>
                      )}
                      {game.isTrending && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                          <Flame size={10} /> Trending
                        </span>
                      )}
                      {game.isDeal && (
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                          <Tag size={10} /> Deal
                        </span>
                      )}
                      {game.isPreOrder && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                          <Clock size={10} /> Pre-order
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(game)}
                        className="p-2 text-white/80 hover:text-neon bg-[#181c24] border border-[#262b36] hover:border-neon/40 rounded-lg transition-all cursor-pointer"
                        title="Edit Game"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => setDeletingGame(game)}
                        className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all cursor-pointer"
                        title="Delete Game"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGames.length === 0 && (
          <div className="p-12 text-center text-muted text-xs">
            No games found matching your current filter parameters.
          </div>
        )}
      </div>

      {/* Add / Edit Game Modal */}
      <GameFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialGame={editingGame}
        onSave={(data) => {
          saveGame(data);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121418] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display uppercase tracking-wide">
                  Confirm Game Deletion
                </h3>
                <p className="text-xs text-muted">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed bg-[#181c24] border border-[#262b36] p-3 rounded-xl">
              Are you sure you want to delete <strong className="text-white">"{deletingGame.title}"</strong>? It will be permanently removed from the admin inventory and customer storefront.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingGame(null)}
                className="px-4 py-2 border border-[#262b36] text-white text-xs font-bold rounded-xl hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Game</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
