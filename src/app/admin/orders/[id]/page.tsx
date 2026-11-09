"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  User as UserIcon,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Check,
} from "lucide-react";
import { getOrderById, updateOrderStatus } from "@/lib/orders";
import { Order } from "@/types/order";

const ORDER_STATUS_OPTIONS = ["Processing", "Completed", "Cancelled"];
const PAYMENT_STATUS_OPTIONS = ["Demo Payment", "Paid", "Pending", "Refunded"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetched = getOrderById(id);
    if (fetched) {
      setOrder(fetched);
      setOrderStatus(fetched.orderStatus);
      setPaymentStatus(fetched.paymentStatus);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs text-neon font-bold uppercase hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Back to All Orders</span>
        </Link>

        <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-12 text-center text-muted">
          <p className="text-sm font-semibold">Order "{id}" not found.</p>
        </div>
      </div>
    );
  }

  const handleSaveStatus = () => {
    updateOrderStatus(order.id, orderStatus, paymentStatus);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs text-neon font-bold uppercase tracking-wider hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Back to Order Management</span>
        </Link>
      </div>

      {/* Title & Status Controls */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon mb-1">
            <ShoppingBag size={16} />
            <span>ORDER #{order.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Order Details Management
          </h1>
          <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
            <Calendar size={13} />
            <span>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </p>
        </div>

        {/* Status Editors */}
        <div className="bg-[#181c24] border border-[#262b36] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase mb-1">
              Order Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="bg-[#121418] border border-[#262b36] text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-neon cursor-pointer"
            >
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted uppercase mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="bg-[#121418] border border-[#262b36] text-emerald-400 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-neon cursor-pointer"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveStatus}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer self-end ${
              isSaved
                ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                : "bg-neon text-black hover:bg-neon-dark shadow-[0_0_15px_rgba(0,232,90,0.3)]"
            }`}
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? "Saved!" : "Update"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Products & Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Products List & Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white font-display uppercase tracking-wide border-b border-[#22242b] pb-3">
              Purchased Game Products ({order.items.length})
            </h3>

            <div className="divide-y divide-[#1e222c]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <div className="relative aspect-[2/3] w-14 rounded-lg overflow-hidden border border-[#262b36] bg-black shrink-0">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-neon uppercase bg-neon/10 border border-neon/30 px-1.5 py-0.5 rounded">
                      {item.platform}
                    </span>
                    <h4 className="font-extrabold text-white text-base leading-tight mt-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted">
                      Quantity: <strong className="text-white">{item.quantity}</strong> × ₹
                      {item.price}
                    </p>
                  </div>
                  <div className="text-right font-black text-neon text-base">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Financial Summary */}
            <div className="pt-4 border-t border-[#22242b] space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Platform Processing Fee</span>
                <span className="text-white font-semibold">₹{order.fee}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#1e222c]">
                <span>Total Amount Paid</span>
                <span className="text-neon font-display text-lg">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Shipping/Delivery */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white font-display uppercase tracking-wide border-b border-[#22242b] pb-3 flex items-center gap-2">
              <UserIcon size={18} className="text-neon" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-bold text-muted uppercase">Full Name</p>
                <p className="font-extrabold text-white text-sm">{order.customer.fullName}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted uppercase">Email Address</p>
                <p className="text-neon font-mono">{order.customer.email}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted uppercase">Phone Number</p>
                <p className="text-white/80 font-medium">{order.customer.phone || "—"}</p>
              </div>

              <div className="pt-2 border-t border-[#1e222c]">
                <p className="text-[10px] font-bold text-muted uppercase flex items-center gap-1 mb-1">
                  <MapPin size={12} className="text-neon" /> Location / Region
                </p>
                <p className="text-white font-medium">
                  {order.customer.city}, {order.customer.state}, {order.customer.country}
                </p>
              </div>

              {order.customer.notes && (
                <div className="pt-2 border-t border-[#1e222c]">
                  <p className="text-[10px] font-bold text-muted uppercase">Customer Notes</p>
                  <p className="text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg mt-1">
                    "{order.customer.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} className="text-neon" />
              <span>Payment Details</span>
            </h3>
            <p className="text-sm font-bold text-white">{order.paymentMethod}</p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e222c]">
              <span className="text-muted">Payment Status:</span>
              <span className="text-emerald-400 font-extrabold">{paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
