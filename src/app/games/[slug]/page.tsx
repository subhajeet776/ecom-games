import { notFound } from "next/navigation";
import { allGames } from "@/data/games";
import GameDetailContent from "@/components/product/GameDetailContent";

interface GameDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const game = allGames.find((g) => g.slug === slug);
  if (!game) return { title: "Game Details — Steam Games 99" };
  return {
    title: `${game.title} — Steam Games 99`,
    description: `Buy ${game.title} at unbeatable prices. Fast digital delivery guaranteed.`,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const game = allGames.find((g) => g.slug === slug);

  // Fallback initial game structure if not found in static list (e.g. newly added game slug)
  const initialGame = game || {
    id: `game-${slug}`,
    title: slug.replace(/-/g, " ").toUpperCase(),
    slug: slug,
    coverImage: "/games/gta-v.jpg",
    genre: "Action",
    platform: "PC",
    price: 99,
  };

  return <GameDetailContent initialGame={initialGame} slug={slug} />;
}
