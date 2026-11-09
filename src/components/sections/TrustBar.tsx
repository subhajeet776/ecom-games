import { BadgeDollarSign, Zap, ShieldCheck, ThumbsUp } from "lucide-react";

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

export default function TrustBar() {
  return (
    <section className="pt-2 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121418] border border-[#22242b] rounded-xl px-6 py-4 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {trustItems.map((item, idx) => (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 ${
                  idx < trustItems.length - 1 ? "lg:border-r lg:border-[#22242b] lg:pr-4" : ""
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
    </section>
  );
}
