import { Gamepad2, ShoppingCart, FileCheck, Play, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Gamepad2,
    title: "1. Choose a Game",
    desc: "Browse our collection",
  },
  {
    icon: ShoppingCart,
    title: "2. Place Order",
    desc: "Secure payment",
  },
  {
    icon: FileCheck,
    title: "3. Get Details",
    desc: "Receive activation info",
  },
  {
    icon: Play,
    title: "4. Start Playing",
    desc: "Enjoy your game!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface/30 border-y border-border/50 py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">
            How It Works?
          </h2>
          <button className="flex items-center gap-1 text-sm text-neon font-medium border border-neon/30 px-3 py-1.5 rounded hover:bg-neon/10 transition-all cursor-pointer">
            Learn More
            <ArrowRight size={14} />
          </button>
        </div>
        <p className="text-muted text-sm mb-8">
          Get your game in 4 simple steps.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mb-4 group-hover:border-neon/30 group-hover:shadow-[0_0_15px_rgba(0,232,90,0.1)] transition-all duration-300">
                <step.icon size={28} className="text-neon" />
              </div>
              <h3 className="text-foreground text-sm font-semibold mb-1">
                {step.title}
              </h3>
              <p className="text-muted text-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
