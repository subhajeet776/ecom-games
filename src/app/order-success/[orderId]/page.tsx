"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Mail,
  User,
  Clock,
  CreditCard,
} from "lucide-react";
import { getOrderById } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const rawOrderId = params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16 flex items-center justify-center">
        <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
          Loading Order Details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pt-12 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-10 text-center flex flex-col items-center justify-center my-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Package size={32} />
            </div>
            <h1 className="text-2xl font-black text-white font-display uppercase">
              Order Not Found
            </h1>
            <p className="text-muted text-sm max-w-md">
              We couldn't find an order matching ID{" "}
              <span className="text-white font-mono font-bold">{orderId}</span>. It may have been cleared from local storage or the link is invalid.
            </p>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 bg-neon text-black font-bold px-6 py-3 rounded-full hover:bg-neon-dark transition-all text-sm"
            >
              <span>Browse Games</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Banner Card */}
        <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-neon/40 via-neon to-neon/40" />

          {/* Animated Success Icon */}
          <div className="w-20 h-20 rounded-full bg-neon/10 border-2 border-neon flex items-center justify-center text-neon mb-5 shadow-[0_0_30px_rgba(0,232,90,0.3)] animate-bounce-short">
            <CheckCircle size={44} strokeWidth={2.5} />
          </div>

          <span className="text-xs font-bold text-neon tracking-widest uppercase mb-1">
            Order Confirmed!
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-wide mb-2">
            Thank You For Your Order!
          </h1>

          <p className="text-muted text-sm sm:text-base max-w-lg mb-6">
            Your demo order has been placed successfully. Below are your order details and activation status.
          </p>

          {/* Order ID Pill */}
          <div className="inline-flex items-center gap-2 bg-[#181b22] border border-[#262b36] rounded-full px-5 py-2">
            <span className="text-xs text-muted font-medium">Order ID:</span>
            <span className="text-sm font-mono font-bold text-neon tracking-wider">
              {order.id}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Details */}
          <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <Clock size={16} className="text-neon" />
              <span>Order Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white font-bold text-base font-sans">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-[11px] text-muted leading-tight">
              Digital key is being prepared for instant delivery.
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <CreditCard size={16} className="text-neon" />
              <span>Payment Method</span>
            </div>
            <div className="text-white font-bold text-base font-sans">
              {order.paymentMethod}
            </div>
            <span className="inline-block bg-neon/15 text-neon text-[10px] font-black px-2 py-0.5 rounded uppercase border border-neon/30">
              {order.paymentStatus}
            </span>
          </div>

          {/* Customer info */}
          <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <User size={16} className="text-neon" />
              <span>Customer</span>
            </div>
            <div className="text-white font-bold text-sm truncate font-sans">
              {order.customer.fullName}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted truncate">
              <Mail size={12} className="shrink-0" />
              <span className="truncate">{order.customer.email}</span>
            </div>
          </div>
        </div>

        {/* Purchased Items Card */}
        <div id="order-details" className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl scroll-mt-24">
          <div className="flex items-center justify-between border-b border-[#22242b] pb-4">
            <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
              <ShoppingBag size={20} className="text-neon" />
              Purchased Games ({order.items.length})
            </h2>
            <span className="text-xs text-muted font-mono">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-[#181b22] border border-[#262b36] rounded-xl p-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden border border-[#2c3240] bg-black">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="bg-neon text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                      {item.platform}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white truncate font-sans">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted font-medium">
                      Quantity: {item.quantity} &times; ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-muted block">Subtotal</span>
                  <span className="text-neon font-black text-base font-display">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="border-t border-[#22242b] pt-4 space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="text-white font-semibold">
                ₹{order.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Digital Key Fee</span>
              <span className="text-neon font-bold uppercase text-xs">FREE</span>
            </div>
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-[#22242b]">
              <span>Total Paid</span>
              <span className="text-neon font-black font-display text-lg">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#order-details"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#181b22] hover:bg-[#222630] border border-[#2a2f3c] text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer"
          >
            <Package size={18} className="text-neon" />
            <span>View Order</span>
          </a>

          <Link
            href="/games"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#34d34a] hover:bg-[#2cc042] text-black font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(52,211,74,0.3)] hover:scale-[1.02] text-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#181b22] hover:bg-[#222630] border border-[#2a2f3c] text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
