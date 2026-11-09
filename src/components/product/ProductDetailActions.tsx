"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Game } from "@/data/games";

interface ProductDetailActionsProps {
  game: Game;
}

export default function ProductDetailActions({ game }: ProductDetailActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleBuyNow = () => {
    addToCart(game);
    router.push("/cart");
  };

  const handleAddToCart = () => {
    addToCart(game);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    setWishlisted((prev) => !prev);
  };

  return (
    <div className="space-y-3 mb-8">
      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buy Now (Add to cart & go to /cart) */}
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2.5 bg-neon text-black font-black text-base py-3.5 px-6 rounded-full hover:bg-neon-dark hover:shadow-[0_0_25px_rgba(0,232,90,0.5)] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,232,90,0.2)]"
        >
          <ShoppingCart size={20} />
          <span>{game.isPreOrder ? "Pre-order Now" : "Buy Now"}</span>
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 font-bold text-base py-3.5 px-6 rounded-full transition-all cursor-pointer border ${
            added
              ? "bg-neon/20 border-neon text-neon"
              : "border-neon/80 text-neon hover:bg-neon/10"
          }`}
        >
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
        </button>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`sm:w-auto px-5 py-3.5 border rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            wishlisted
              ? "bg-red-500/20 border-red-500 text-red-400"
              : "border-[#262b36] text-white/80 hover:text-white hover:border-white/40"
          }`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
          <span>{wishlisted ? "Wishlisted" : "Wishlist"}</span>
        </button>
      </div>
    </div>
  );
}
