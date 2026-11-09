import { Order } from "@/types/order";

const LOCAL_STORAGE_ORDERS_KEY = "steam_games_99_orders";
export const ORDERS_UPDATED_EVENT = "steam_orders_updated";

function notifyOrdersUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
  }
}

// Initial demo seed orders (ONLY loaded when key is missing in localStorage)
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: "ORD-948210",
    userId: "USR-101",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      fullName: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      notes: "Please send instant key via email.",
    },
    items: [
      {
        id: "1",
        title: "Grand Theft Auto V",
        slug: "grand-theft-auto-v",
        coverImage: "/games/gta-v.jpg",
        platform: "PC",
        price: 99,
        quantity: 1,
      },
      {
        id: "3",
        title: "Elden Ring",
        slug: "elden-ring",
        coverImage: "/games/elden-ring.jpg",
        platform: "PC",
        price: 199,
        quantity: 1,
      },
    ],
    subtotal: 298,
    fee: 0,
    total: 298,
    paymentMethod: "UPI / QR Code",
    paymentStatus: "Paid",
    orderStatus: "Completed",
  },
  {
    id: "ORD-839102",
    userId: "USR-102",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customer: {
      fullName: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 98123 45678",
      country: "India",
      state: "Gujarat",
      city: "Ahmedabad",
    },
    items: [
      {
        id: "4",
        title: "God of War Ragnarök",
        slug: "god-of-war-ragnarok",
        coverImage: "/games/gow.jpg",
        platform: "PlayStation",
        price: 199,
        quantity: 1,
      },
    ],
    subtotal: 199,
    fee: 0,
    total: 199,
    paymentMethod: "Credit / Debit Card",
    paymentStatus: "Paid",
    orderStatus: "Processing",
  },
  {
    id: "ORD-712390",
    userId: "USR-103",
    createdAt: new Date().toISOString(),
    customer: {
      fullName: "Aman Gupta",
      email: "aman.g@example.com",
      phone: "+91 99887 76655",
      country: "India",
      state: "Delhi",
      city: "New Delhi",
    },
    items: [
      {
        id: "12",
        title: "GTA VI (Pre-order)",
        slug: "gta-vi",
        coverImage: "/games/gta-vi.jpg",
        platform: "PlayStation",
        price: 499,
        quantity: 1,
      },
    ],
    subtotal: 499,
    fee: 0,
    total: 499,
    paymentMethod: "Net Banking",
    paymentStatus: "Demo Payment",
    orderStatus: "Processing",
  },
];

/**
 * Retrieve all saved orders from localStorage.
 * Seeds ONLY when localStorage key is completely absent.
 */
export function getOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_DEMO_ORDERS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (data === null) {
      // Key does NOT exist at all -> seed initial demo orders
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    // Key exists (could be empty array if user deleted all) -> parse & return as-is
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load orders from localStorage", e);
    return [];
  }
}

/**
 * Get a specific order by ID
 */
export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
}

/**
 * Retrieve orders associated with a given userId or email
 */
export function getOrdersByUserId(userId: string, email?: string): Order[] {
  const allOrders = getOrders();
  const normalizedEmail = email?.trim().toLowerCase();

  const userOrders = allOrders.filter(
    (o) =>
      o.userId === userId ||
      (normalizedEmail && o.customer.email.toLowerCase() === normalizedEmail)
  );

  return userOrders;
}

/**
 * Save a new order to localStorage
 */
export function saveOrder(order: Order): boolean {
  if (typeof window === "undefined") return false;
  try {
    const orders = getOrders();
    const updatedOrders = [order, ...orders.filter((o) => o.id !== order.id)];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updatedOrders));
    notifyOrdersUpdated();
    return true;
  } catch (e) {
    console.error("Failed to save order to localStorage", e);
    return false;
  }
}

/**
 * Update an order's status and payment status in localStorage
 */
export function updateOrderStatus(
  orderId: string,
  orderStatus: string,
  paymentStatus: string
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const orders = getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex < 0) return false;

    orders[orderIndex] = {
      ...orders[orderIndex],
      orderStatus,
      paymentStatus,
    };

    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    notifyOrdersUpdated();
    return true;
  } catch (e) {
    console.error("Failed to update order status", e);
    return false;
  }
}

/**
 * Generate a unique demo order ID
 */
export function generateOrderId(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${randomDigits}`;
}
