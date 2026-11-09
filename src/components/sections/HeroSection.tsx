import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BadgeDollarSign,
  Zap,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";

const trustItems = [
  {
    icon: BadgeDollarSign,
    title: "Affordable Prices",
    desc: "Top games from ₹69",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Get your game quickly",
  },
  {
    icon: ShieldCheck,
    title: "Offline Activation",
    desc: "Safe & easy process",
  },
  {
    icon: ThumbsUp,
    title: "Trusted Service",
    desc: "1000+ happy gamers",
  },
];

export default function HeroSection() {
  return (
    <section className="pt-4 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card Container */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#1d222c] shadow-2xl bg-[#090b0e]">
          {/* Top Banner Content Area */}
          <div className="relative w-full h-[420px] sm:h-[460px] md:h-[490px] lg:h-[520px] overflow-hidden">
            {/* Background Artwork */}
            <Image
              src="/images/hero-bg.png"
              alt="Ghost of Yotei Gaming Hero"
              fill
              className="object-cover object-right lg:object-center"
              priority
              quality={90}
            />

            {/* Dark Gradient Overlay — heavy on left for high contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e] via-[#090b0e]/95 to-transparent/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-transparent opacity-95" />

            {/* Left Navigation Arrow Button */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white hover:text-neon hover:border-neon transition-all z-30 cursor-pointer backdrop-blur-md shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right Navigation Arrow Button */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white hover:text-neon hover:border-neon transition-all z-30 cursor-pointer backdrop-blur-md shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight size={22} />
            </button>

            {/* Text & Content Block — Explicit 110px inline padding to guarantee 70px+ clearance from arrow */}
            <div
              className="relative z-10 h-full flex flex-col justify-center pr-8 py-6"
              style={{ paddingLeft: "110px" }}
            >
              <div className="max-w-2xl lg:max-w-3xl">
                {/* Subtitle Top */}
                <p className="text-white/80 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-2 font-sans">
                  PLAY MORE. SPEND LESS.
                </p>

                {/* Main 2-Line Headline */}
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl uppercase tracking-tight leading-[0.95] text-white mb-1">
                  PREMIUM GAMES
                </h1>
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl uppercase tracking-tight leading-[0.95] mb-4">
                  <span className="text-white">AT </span>
                  <span className="text-neon text-glow-neon">UNBEATABLE PRICES</span>
                </h1>

                {/* Tagline */}
                <p className="text-white/70 text-xs sm:text-sm md:text-base font-medium mb-6 tracking-wide">
                  AAA Titles &nbsp;|&nbsp; Fast Delivery &nbsp;|&nbsp; Offline Activation &nbsp;|&nbsp; Trusted by Gamers
                </p>

                {/* Green Pill CTA Button — Matching reference image */}
                <div>
                  <Link
                    href="/games"
                    className="inline-flex items-center gap-2.5 bg-[#34d34a] hover:bg-[#2cc042] text-black font-bold text-base sm:text-[17px] px-10 sm:px-12 py-3.5 sm:py-4 rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(52,211,74,0.3)] hover:shadow-[0_0_30px_rgba(52,211,74,0.5)] hover:scale-[1.02]"
                  >
                    <span>Browse Games</span>
                    <ArrowRight size={19} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Game Title Artwork Text (Bottom Right) */}
            <div className="absolute bottom-14 right-10 z-10 hidden sm:flex flex-col items-end opacity-85">
              <span className="font-display text-2xl lg:text-3xl font-black text-white/90 tracking-[0.2em] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                GHOST OF YOTEI
              </span>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              <span className="w-7 h-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,232,90,0.6)]" />
              <span className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-colors cursor-pointer" />
              <span className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-colors cursor-pointer" />
              <span className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Integrated Trust Bar at Bottom of Hero Card */}
          <div className="relative z-10 bg-[#0c0f14]/90 backdrop-blur-md border-t border-[#1d222c] px-6 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              {trustItems.map((item, idx) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-3.5 ${
                    idx < trustItems.length - 1 ? "lg:border-r lg:border-[#1d222c] lg:pr-4" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center shrink-0 text-neon shadow-[0_0_12px_rgba(0,232,90,0.15)]">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight font-display tracking-wide">
                      {item.title}
                    </p>
                    <p className="text-muted text-xs font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
