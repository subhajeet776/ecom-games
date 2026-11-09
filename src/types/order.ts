export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  platform: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  fee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}
