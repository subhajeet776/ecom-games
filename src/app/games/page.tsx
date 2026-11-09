import { Suspense } from "react";
import type { Metadata } from "next";
import GamesCatalogueContent from "@/components/catalogue/GamesCatalogueContent";

export const metadata: Metadata = {
  title: "Game Catalogue — Steam Games 99",
  description:
    "Browse our complete catalogue of premium PC & console games. Filter by platform, genre, and price range at unbeatable prices.",
};

export default function GamesCataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-12 pb-16 flex items-center justify-center">
          <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
            Loading Game Catalogue...
          </div>
        </div>
      }
    >
      <GamesCatalogueContent />
    </Suspense>
  );
}
