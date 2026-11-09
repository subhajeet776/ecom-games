"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Zap, ArrowLeft, Star, Gamepad2 } from "lucide-react";
import { Game } from "@/data/games";
import { getGameBySlug, GAMES_UPDATED_EVENT } from "@/lib/games";
import ProductDetailActions from "@/components/product/ProductDetailActions";

interface GameDetailContentProps {
  initialGame: Game;
  slug: string;
}

export default function GameDetailContent({ initialGame, slug }: GameDetailContentProps) {
  const [game, setGame] = useState<Game>(initialGame);

  useEffect(() => {
    const fresh = getGameBySlug(slug);
    if (fresh) {
      setGame(fresh);
    }

    const handleUpdate = () => {
      const updated = getGameBySlug(slug);
      if (updated) setGame(updated);
    };

    window.addEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-neon font-bold uppercase tracking-wider hover:underline"
          >
            <ArrowLeft size={16} />
            <span>Back to Game Catalogue</span>
          </Link>
        </div>

        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Left Media Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[2/3] w-full max-w-sm rounded-xl overflow-hidden border border-[#262b36] shadow-xl bg-black">
              <Image
                src={game.coverImage}
                alt={game.title}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
                priority
              />
              <span className="absolute top-3 right-3 bg-neon text-black text-xs font-black px-2 py-1 rounded tracking-wide shadow-md uppercase">
                {game.platform}
              </span>
              {game.discount && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2 py-1 rounded tracking-wide">
                  -{game.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Right Product Details Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neon uppercase tracking-widest mb-2 font-display">
                <Gamepad2 size={16} />
                <span>{game.genre} &nbsp;|&nbsp; {game.platform}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-wide leading-tight mb-3">
                {game.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 text-yellow-400 text-sm font-semibold">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-white font-bold">4.9 / 5.0</span>
                <span className="text-muted text-xs font-normal">(120+ Verified Reviews)</span>
              </div>

              {/* Price Box */}
              <div className="bg-[#181c24] border border-[#262b36] rounded-xl p-5 mb-6">
                <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                  Special Price
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-neon font-black text-3xl sm:text-4xl font-display text-glow-neon">
                    ₹{game.price}
                  </span>
                  {game.originalPrice && (
                    <span className="text-muted text-lg line-through font-medium">
                      ₹{game.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {game.discount && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-2 py-0.5 rounded">
                      Save ₹{(game.originalPrice! - game.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/70">
                  Instant Digital Code / Account Access • Offline Activation • 100% Guaranteed
                </p>
              </div>

              {/* Action Buttons */}
              <ProductDetailActions game={game} />

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#262b36]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Instant Delivery</p>
                    <p className="text-[11px] text-muted">Delivered in under 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">100% Safe</p>
                    <p className="text-[11px] text-muted">Genuine activation code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
