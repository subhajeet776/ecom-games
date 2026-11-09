import { allGames, Game } from "@/data/games";

const LOCAL_STORAGE_GAMES_KEY = "steam_games_99_stored_games";
export const GAMES_UPDATED_EVENT = "steam_games_updated";

/**
 * Helper to dispatch window event when games data changes
 */
function notifyGamesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(GAMES_UPDATED_EVENT));
  }
}

/**
 * Get all stored games from localStorage, or initialize with defaults if key does not exist.
 */
export function getStoredGames(): Game[] {
  if (typeof window === "undefined") return allGames;
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_GAMES_KEY);
    if (!rawData) {
      // First time initialization ONLY
      localStorage.setItem(LOCAL_STORAGE_GAMES_KEY, JSON.stringify(allGames));
      return allGames;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // Fallback if stored key is empty or corrupted
    localStorage.setItem(LOCAL_STORAGE_GAMES_KEY, JSON.stringify(allGames));
    return allGames;
  } catch (e) {
    console.error("Failed to load stored games", e);
    return allGames;
  }
}


/**
 * Get a single game by slug
 */
export function getGameBySlug(slug: string): Game | null {
  const games = getStoredGames();
  return games.find((g) => g.slug === slug) || null;
}

/**
 * Get a single game by ID
 */
export function getGameById(id: string): Game | null {
  const games = getStoredGames();
  return games.find((g) => g.id === id) || null;
}

/**
 * Add a new game or update an existing game.
 */
export function saveGame(gameInput: Partial<Game> & { title: string; price: number }): Game {
  const games = getStoredGames();
  
  // Calculate discount percentage if original price is provided and greater than current price
  let calculatedDiscount = gameInput.discount;
  if (gameInput.originalPrice && gameInput.originalPrice > gameInput.price) {
    calculatedDiscount = Math.round(
      ((gameInput.originalPrice - gameInput.price) / gameInput.originalPrice) * 100
    );
  }

  // Generate slug if not provided
  const slug =
    gameInput.slug?.trim() ||
    gameInput.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const existingIndex = gameInput.id
    ? games.findIndex((g) => g.id === gameInput.id)
    : -1;

  if (existingIndex >= 0) {
    // Update existing game
    const updatedGame: Game = {
      ...games[existingIndex],
      ...gameInput,
      slug,
      discount: calculatedDiscount,
    };
    games[existingIndex] = updatedGame;
    localStorage.setItem(LOCAL_STORAGE_GAMES_KEY, JSON.stringify(games));
    notifyGamesUpdated();
    return updatedGame;
  } else {
    // Create new game
    const newId = gameInput.id || `game-${Date.now()}`;
    const newGame: Game = {
      id: newId,
      title: gameInput.title.trim(),
      slug,
      coverImage: gameInput.coverImage || "/games/gta-v.jpg",
      genre: gameInput.genre || "Action",
      platform: gameInput.platform || "PC",
      price: Number(gameInput.price),
      originalPrice: gameInput.originalPrice ? Number(gameInput.originalPrice) : undefined,
      discount: calculatedDiscount,
      badge: gameInput.badge?.trim() || undefined,
      isPreOrder: Boolean(gameInput.isPreOrder),
      isTrending: Boolean(gameInput.isTrending),
      isDeal: Boolean(gameInput.isDeal),
    };

    const updatedList = [newGame, ...games];
    localStorage.setItem(LOCAL_STORAGE_GAMES_KEY, JSON.stringify(updatedList));
    notifyGamesUpdated();
    return newGame;
  }
}

/**
 * Delete a game by ID
 */
export function deleteGame(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const games = getStoredGames();
    const filtered = games.filter((g) => g.id !== id);
    if (filtered.length !== games.length) {
      localStorage.setItem(LOCAL_STORAGE_GAMES_KEY, JSON.stringify(filtered));
      notifyGamesUpdated();
      return true;
    }
    return false;
  } catch (e) {
    console.error("Failed to delete game", e);
    return false;
  }
}

/**
 * Reset games storage back to initial defaults
 */
export function resetGamesToDefault(): Game[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_GAMES_KEY, JSON.stringify(allGames));
    notifyGamesUpdated();
  }
  return allGames;
}
