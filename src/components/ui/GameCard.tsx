"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Game } from "@/data/games";

interface GameCardProps {
  game: Game;
  variant?: "default" | "deal" | "preorder";
}

export default function GameCard({ game, variant = "default" }: GameCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-[#121418] border border-[#22242b] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-neon/40 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex flex-col justify-between h-full">
      {/* Top Media Block + Title wrapped in Link */}
      <Link href={`/games/${game.slug}`} className="block flex-1 cursor-pointer">
        {/* Cover Image — 2:3 portrait aspect ratio */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
          />
          {/* Platform Badge Overlay */}
          <span className="absolute top-2 right-2 bg-neon text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide shadow-md uppercase">
            {game.platform}
          </span>
          {/* Optional Discount Tag */}
          {game.discount && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide">
              -{game.discount}%
            </span>
          )}
        </div>

        {/* Info Content */}
        <div className="px-3 pt-2.5 pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-white truncate leading-snug mb-1 font-sans group-hover:text-neon transition-colors">
            {game.title}
          </h3>

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-neon font-black text-sm sm:text-base leading-none tracking-tight">
              ₹{game.price}
            </span>
            {game.originalPrice && (
              <span className="text-muted text-[11px] line-through leading-none font-medium">
                ₹{game.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Button Row — pinned to bottom */}
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-1.5 py-1.5 border text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
            added
              ? "bg-neon text-black border-neon shadow-[0_0_15px_rgba(0,232,90,0.4)]"
              : "border-neon/80 text-neon hover:bg-neon hover:text-black shadow-[0_0_10px_rgba(0,232,90,0.1)]"
          }`}
        >
          {added ? <Check size={13} strokeWidth={3} /> : <ShoppingCart size={13} />}
          <span>
            {added
              ? "Added!"
              : variant === "preorder"
              ? "Pre-order"
              : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
}
