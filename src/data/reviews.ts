export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

// Demo testimonials — clearly demo content
export const reviews: Review[] = [
  {
    id: "1",
    name: "Aman Verma",
    avatar: "/images/avatars/avatar1.jpg",
    rating: 5,
    comment:
      "Super fast delivery and genuine service. Got GTA V within minutes. Highly recommended!",
  },
  {
    id: "2",
    name: "Riya Mehta",
    avatar: "/images/avatars/avatar2.jpg",
    rating: 5,
    comment:
      "Best prices for AAA games. The process was smooth and easy. Will buy again!",
  },
  {
    id: "3",
    name: "Karan Singh",
    avatar: "/images/avatars/avatar3.jpg",
    rating: 5,
    comment:
      "Very reliable. Got Elden Ring at an amazing price. Great support too!",
  },
];
