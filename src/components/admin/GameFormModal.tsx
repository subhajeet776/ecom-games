"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Check, Sparkles, AlertCircle } from "lucide-react";
import { Game } from "@/data/games";
import Image from "next/image";

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gameData: Partial<Game> & { title: string; price: number }) => void;
  initialGame?: Game | null;
}

const PRESET_COVERS = [
  { label: "GTA V", path: "/games/gta-v.jpg" },
  { label: "RDR 2", path: "/games/rdr2.jpg" },
  { label: "Elden Ring", path: "/games/elden-ring.jpg" },
  { label: "God of War", path: "/games/gow.jpg" },
  { label: "Forza 5", path: "/games/forza.jpg" },
  { label: "The Last of Us", path: "/games/tlou.jpg" },
  { label: "Witcher 3", path: "/games/witcher3.jpg" },
  { label: "Cyberpunk", path: "/games/cyberpunk.jpg" },
  { label: "Spider-Man", path: "/games/spiderman.jpg" },
  { label: "GTA VI", path: "/games/gta-vi.jpg" },
];

const GENRE_OPTIONS = ["Action", "Adventure", "RPG", "Racing", "Shooter", "Sports", "Horror"];
const PLATFORM_OPTIONS = ["PC", "PlayStation", "Xbox"];

export default function GameFormModal({
  isOpen,
  onClose,
  onSave,
  initialGame,
}: GameFormModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [genre, setGenre] = useState("Action");
  const [platform, setPlatform] = useState("PC");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [coverImage, setCoverImage] = useState("/games/gta-v.jpg");
  const [badge, setBadge] = useState("");
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isDeal, setIsDeal] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialGame) {
      setTitle(initialGame.title || "");
      setSlug(initialGame.slug || "");
      setGenre(initialGame.genre || "Action");
      setPlatform(initialGame.platform || "PC");
      setPrice(initialGame.price ?? "");
      setOriginalPrice(initialGame.originalPrice ?? "");
      setCoverImage(initialGame.coverImage || "/games/gta-v.jpg");
      setBadge(initialGame.badge || "");
      setIsPreOrder(Boolean(initialGame.isPreOrder));
      setIsTrending(Boolean(initialGame.isTrending));
      setIsDeal(Boolean(initialGame.isDeal));
    } else {
      // Reset form
      setTitle("");
      setSlug("");
      setGenre("Action");
      setPlatform("PC");
      setPrice("");
      setOriginalPrice("");
      setCoverImage("/games/gta-v.jpg");
      setBadge("");
      setIsPreOrder(false);
      setIsTrending(false);
      setIsDeal(false);
    }
    setErrors({});
  }, [initialGame, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialGame) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Game title is required.";
    if (price === "" || Number(price) < 0) errs.price = "Valid price is required.";
    if (!coverImage.trim()) errs.coverImage = "Cover image path or URL is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialGame?.id,
      title: title.trim(),
      slug: slug.trim(),
      genre,
      platform,
      price: Number(price),
      originalPrice: originalPrice !== "" ? Number(originalPrice) : undefined,
      coverImage: coverImage.trim(),
      badge: badge.trim() || undefined,
      isPreOrder,
      isTrending,
      isDeal,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#181c24] border-b border-[#22242b] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-neon" />
            <h3 className="text-lg font-black text-white font-display uppercase tracking-wide">
              {initialGame ? "Edit Game Listing" : "Add New Game"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Image Preview Column */}
            <div className="md:col-span-4 flex flex-col items-center space-y-3">
              <label className="text-xs font-bold text-white/90 uppercase tracking-wider self-start flex items-center gap-1.5">
                <ImageIcon size={14} className="text-neon" />
                <span>Live Image Preview</span>
              </label>

              <div className="relative aspect-[2/3] w-full max-w-[180px] rounded-xl overflow-hidden border border-[#262b36] bg-black shadow-lg">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={title || "Game Preview"}
                    fill
                    sizes="180px"
                    className="object-cover"
                    onError={() => setErrors((prev) => ({ ...prev, coverImage: "Invalid image URL" }))}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted p-4 text-center">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-[11px]">Enter Cover URL to preview</span>
                  </div>
                )}

                <span className="absolute top-2 right-2 bg-neon text-black text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  {platform}
                </span>
              </div>

              {/* Cover Image Input */}
              <div className="w-full space-y-1">
                <input
                  type="text"
                  placeholder="/games/gta-v.jpg or URL"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-neon"
                />
                {errors.coverImage && (
                  <p className="text-[11px] text-red-400">{errors.coverImage}</p>
                )}
              </div>

              {/* Preset Local Covers */}
              <div className="w-full space-y-1.5">
                <p className="text-[10px] text-muted font-bold uppercase tracking-wider">
                  Quick Select Local Assets:
                </p>
                <div className="flex flex-wrap gap-1">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setCoverImage(preset.path)}
                      className={`text-[10px] px-2 py-1 rounded font-semibold border transition-all ${
                        coverImage === preset.path
                          ? "bg-neon text-black border-neon"
                          : "bg-[#181c24] text-white/70 border-[#262b36] hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Fields Column */}
            <div className="md:col-span-8 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">
                  Game Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk Phantom Liberty"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon"
                />
                {errors.title && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">
                  Slug / URL identifier
                </label>
                <input
                  type="text"
                  placeholder="cyberpunk-phantom-liberty"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-neon font-mono"
                />
              </div>

              {/* Genre & Platform */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase mb-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon"
                  >
                    {GENRE_OPTIONS.map((g) => (
                      <option key={g} value={g} className="bg-[#121418]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase mb-1">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p} className="bg-[#121418]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="99"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-sm text-neon font-bold focus:outline-none focus:border-neon"
                  />
                  {errors.price && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="2999"
                    min="0"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon"
                  />
                </div>
              </div>

              {/* Badge Tag */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-1">
                  Custom Badge (e.g. HOT, BESTSELLER)
                </label>
                <input
                  type="text"
                  placeholder="BESTSELLER"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-[#181c24] border border-[#262b36] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon uppercase"
                />
              </div>

              {/* Storefront Feature Toggles */}
              <div>
                <label className="block text-xs font-bold text-white uppercase mb-2">
                  Store Section Visibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 bg-[#181c24] border border-[#262b36] p-2.5 rounded-lg cursor-pointer hover:border-neon/40">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="accent-neon rounded"
                    />
                    <span className="text-xs font-bold text-white">Trending</span>
                  </label>

                  <label className="flex items-center gap-2 bg-[#181c24] border border-[#262b36] p-2.5 rounded-lg cursor-pointer hover:border-neon/40">
                    <input
                      type="checkbox"
                      checked={isDeal}
                      onChange={(e) => setIsDeal(e.target.checked)}
                      className="accent-neon rounded"
                    />
                    <span className="text-xs font-bold text-white">Deals Section</span>
                  </label>

                  <label className="flex items-center gap-2 bg-[#181c24] border border-[#262b36] p-2.5 rounded-lg cursor-pointer hover:border-neon/40">
                    <input
                      type="checkbox"
                      checked={isPreOrder}
                      onChange={(e) => setIsPreOrder(e.target.checked)}
                      className="accent-neon rounded"
                    />
                    <span className="text-xs font-bold text-white">Pre-Order</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#22242b] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#262b36] text-white text-xs font-bold rounded-xl hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-neon text-black text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neon-dark transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,232,90,0.3)] cursor-pointer"
            >
              <Check size={16} />
              <span>{initialGame ? "Save Changes" : "Create Game Listing"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
