export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Action",
    slug: "action",
    image: "/games/categories/action.jpg",
  },
  {
    id: "2",
    name: "Adventure",
    slug: "adventure",
    image: "/games/categories/adventure.jpg",
  },
  {
    id: "3",
    name: "Racing",
    slug: "racing",
    image: "/games/categories/racing.jpg",
  },
  {
    id: "4",
    name: "RPG",
    slug: "rpg",
    image: "/games/categories/rpg.jpg",
  },
  {
    id: "5",
    name: "Shooter",
    slug: "shooter",
    image: "/games/categories/shooter.jpg",
  },
  {
    id: "6",
    name: "Sports",
    slug: "sports",
    image: "/games/categories/sports.jpg",
  },
];
