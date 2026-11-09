export interface Game {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  genre: string;
  platform: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  isPreOrder?: boolean;
  isTrending?: boolean;
  isDeal?: boolean;
}

// Trending Games
export const trendingGames: Game[] = [
  {
    id: "1",
    title: "Grand Theft Auto V",
    slug: "grand-theft-auto-v",
    coverImage: "/games/gta-v.jpg",
    genre: "Action",
    platform: "PC",
    price: 99,
    originalPrice: 2999,
    discount: 97,
    isTrending: true,
  },
  {
    id: "2",
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    coverImage: "/games/rdr2.jpg",
    genre: "Adventure",
    platform: "PC",
    price: 99,
    originalPrice: 2999,
    discount: 97,
    isTrending: true,
  },
  {
    id: "3",
    title: "Elden Ring",
    slug: "elden-ring",
    coverImage: "/games/elden-ring.jpg",
    genre: "RPG",
    platform: "PC",
    price: 199,
    originalPrice: 3499,
    discount: 94,
    isTrending: true,
  },
  {
    id: "4",
    title: "God of War Ragnarök",
    slug: "god-of-war-ragnarok",
    coverImage: "/games/gow.jpg",
    genre: "Action",
    platform: "PlayStation",
    price: 199,
    originalPrice: 3999,
    discount: 95,
    isTrending: true,
  },
  {
    id: "5",
    title: "Forza Horizon 5",
    slug: "forza-horizon-5",
    coverImage: "/games/forza.jpg",
    genre: "Racing",
    platform: "Xbox",
    price: 99,
    originalPrice: 2999,
    discount: 97,
    isTrending: true,
  },
  {
    id: "6",
    title: "The Last of Us Part I",
    slug: "the-last-of-us-part-1",
    coverImage: "/games/tlou.jpg",
    genre: "Adventure",
    platform: "PlayStation",
    price: 149,
    originalPrice: 3499,
    discount: 96,
    isTrending: true,
  },
];

// Deal Games - "Deals Under ₹99"
export const dealGames: Game[] = [
  {
    id: "7",
    title: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3",
    coverImage: "/games/witcher3.jpg",
    genre: "RPG",
    platform: "PC",
    price: 69,
    originalPrice: 2999,
    discount: 98,
    isDeal: true,
  },
  {
    id: "8",
    title: "Hogwarts Legacy",
    slug: "hogwarts-legacy",
    coverImage: "/games/hogwarts.jpg",
    genre: "RPG",
    platform: "PC",
    price: 69,
    originalPrice: 2699,
    discount: 97,
    isDeal: true,
  },
  {
    id: "9",
    title: "Assassin's Creed Valhalla",
    slug: "assassins-creed-valhalla",
    coverImage: "/games/acv.jpg",
    genre: "Action",
    platform: "PC",
    price: 69,
    originalPrice: 2999,
    discount: 98,
    isDeal: true,
  },
  {
    id: "10",
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    coverImage: "/games/cyberpunk.jpg",
    genre: "RPG",
    platform: "PC",
    price: 99,
    originalPrice: 2699,
    discount: 96,
    isDeal: true,
  },
  {
    id: "11",
    title: "Marvel's Spider-Man",
    slug: "marvels-spider-man",
    coverImage: "/games/spiderman.jpg",
    genre: "Action",
    platform: "PlayStation",
    price: 99,
    originalPrice: 2699,
    discount: 96,
    isDeal: true,
  },
];

// Pre-order Games - "Upcoming Releases"
export const preOrderGames: Game[] = [
  {
    id: "12",
    title: "GTA VI (Pre-order)",
    slug: "gta-vi",
    coverImage: "/games/gta-vi.jpg",
    genre: "Action",
    platform: "PlayStation",
    price: 499,
    isPreOrder: true,
  },
  {
    id: "13",
    title: "Assassin's Creed Shadows",
    slug: "assassins-creed-shadows",
    coverImage: "/games/ac-shadows.jpg",
    genre: "Action",
    platform: "PC",
    price: 299,
    isPreOrder: true,
  },
  {
    id: "14",
    title: "Monster Hunter Wilds",
    slug: "monster-hunter-wilds",
    coverImage: "/games/mh-wilds.jpg",
    genre: "Action",
    platform: "PC",
    price: 399,
    isPreOrder: true,
  },
  {
    id: "15",
    title: "DOOM: The Dark Ages",
    slug: "doom-dark-ages",
    coverImage: "/games/doom.jpg",
    genre: "Shooter",
    platform: "Xbox",
    price: 299,
    isPreOrder: true,
  },
];

// Additional catalogue demo games for genre & platform coverage
export const extraGames: Game[] = [
  {
    id: "16",
    title: "EA Sports FC 24",
    slug: "ea-sports-fc-24",
    coverImage: "/games/gta-v.jpg",
    genre: "Sports",
    platform: "PlayStation",
    price: 349,
    originalPrice: 4499,
    discount: 92,
  },
  {
    id: "17",
    title: "Resident Evil 4 Remake",
    slug: "resident-evil-4-remake",
    coverImage: "/games/rdr2.jpg",
    genre: "Horror",
    platform: "PC",
    price: 199,
    originalPrice: 3599,
    discount: 94,
  },
  {
    id: "18",
    title: "Halo Infinite",
    slug: "halo-infinite",
    coverImage: "/games/forza.jpg",
    genre: "Shooter",
    platform: "Xbox",
    price: 149,
    originalPrice: 3999,
    discount: 96,
  },
  {
    id: "19",
    title: "Silent Hill 2 Remake",
    slug: "silent-hill-2-remake",
    coverImage: "/games/tlou.jpg",
    genre: "Horror",
    platform: "PC",
    price: 599,
    originalPrice: 4999,
    discount: 88,
  },
  {
    id: "20",
    title: "Demon's Souls",
    slug: "demons-souls",
    coverImage: "/games/gow.jpg",
    genre: "RPG",
    platform: "PlayStation",
    price: 299,
    originalPrice: 4999,
    discount: 94,
  },
];

// All games combined for catalogue
export const allGames: Game[] = [
  ...trendingGames,
  ...dealGames,
  ...preOrderGames,
  ...extraGames,
];
