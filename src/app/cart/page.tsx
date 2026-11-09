"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    total,
    isLoaded,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16 flex items-center justify-center">
        <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
          Loading Cart...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-10 sm:p-16 text-center flex flex-col items-center justify-center shadow-2xl my-8">
            <div className="w-20 h-20 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-5 shadow-[0_0_20px_rgba(0,232,90,0.15)]">
              <ShoppingCart size={40} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide mb-3">
              Your Cart is Empty
            </h1>

            <p className="text-muted text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Looks like you haven't added any games to your cart yet. Explore our catalogue to find top AAA titles at unbeatable prices.
            </p>

            <Link
              href="/games"
              className="inline-flex items-center gap-2.5 bg-[#34d34a] hover:bg-[#2cc042] text-black font-bold text-base px-10 py-3.5 rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(52,211,74,0.3)] hover:shadow-[0_0_30px_rgba(52,211,74,0.5)] hover:scale-[1.02]"
            >
              <span>Browse Games</span>
              <ArrowRight size={19} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1e222c]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-neon rounded-full shadow-[0_0_10px_rgba(0,232,90,0.6)]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
                Your Shopping Cart
              </h1>
              <span className="bg-neon/10 border border-neon/30 text-neon text-xs font-bold px-2.5 py-1 rounded-full ml-2">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-muted text-xs sm:text-sm pl-4">
              Review your items and proceed to checkout for instant delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neon font-bold uppercase tracking-wider hover:underline"
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>

            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold uppercase border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer ml-2"
            >
              <Trash2 size={14} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Cart Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List Column */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ game, quantity }) => (
              <div
                key={game.id}
                className="bg-[#121418] border border-[#22242b] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#2a2f3a] shadow-lg"
              >
                {/* Image + Title */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-16 h-24 sm:w-20 sm:h-28 shrink-0 rounded-lg overflow-hidden border border-[#262b36] bg-black">
                    <Image
                      src={game.coverImage}
                      alt={game.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block bg-neon text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                      {game.platform}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-sans hover:text-neon transition-colors">
                      <Link href={`/games/${game.slug}`}>{game.title}</Link>
                    </h3>
                    <p className="text-xs text-muted font-medium">{game.genre}</p>
                    <p className="text-neon font-black text-sm sm:text-base">
                      ₹{game.price}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls + Item Subtotal + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[#1f2430] pt-3 sm:pt-0">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#181c24] border border-[#262b36] rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(game.id, quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-neon hover:bg-white/5 rounded transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(game.id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-neon hover:bg-white/5 rounded transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-xs text-muted block">Subtotal</span>
                    <span className="text-neon font-black text-base font-display">
                      ₹{(game.price * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(game.id)}
                    className="p-2 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4">
            <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl sticky top-28 space-y-6">
              <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide border-b border-[#22242b] pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Items ({totalItems})</span>
                  <span className="text-white font-semibold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Digital Activation Fee</span>
                  <span className="text-neon font-bold uppercase text-xs">FREE</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Instant Delivery</span>
                  <span className="text-neon font-bold uppercase text-xs">FREE</span>
                </div>
              </div>

              <div className="border-t border-[#22242b] pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-white font-display uppercase">
                  Total Amount
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-neon font-display text-glow-neon block">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted font-medium">Taxes included</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-neon text-black font-black text-base py-3.5 rounded-full hover:bg-neon-dark hover:shadow-[0_0_25px_rgba(0,232,90,0.5)] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,232,90,0.2)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>

              {/* Security Badges */}
              <div className="pt-4 border-t border-[#22242b] space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <Zap size={16} className="text-neon shrink-0" />
                  <span>Instant digital activation code delivered to email</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <ShieldCheck size={16} className="text-neon shrink-0" />
                  <span>100% Genuine license & Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
