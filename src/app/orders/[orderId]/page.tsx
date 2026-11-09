"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  Clock,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoaded } = useAuth();

  const rawOrderId = params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace(`/login?redirect=/orders/${orderId}`);
      return;
    }

    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
      setLoading(false);
    }
  }, [orderId, isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated || loading) {
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
              We couldn&apos;t find an order matching ID{" "}
              <span className="text-white font-mono font-bold">{orderId}</span>.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-neon text-black font-bold px-6 py-3 rounded-full hover:bg-neon-dark transition-all text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to My Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Nav Header */}
        <div className="flex items-center justify-between border-b border-[#1e222c] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-neon rounded-full shadow-[0_0_10px_rgba(0,232,90,0.6)]" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Order Details
            </h1>
          </div>

          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neon font-bold uppercase tracking-wider hover:underline"
          >
            <ArrowLeft size={16} />
            <span>Back to Orders</span>
          </Link>
        </div>

        {/* Order Header Summary Card */}
        <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neon text-xs font-bold uppercase tracking-wider">
              <CheckCircle size={16} />
              <span>Order Details &amp; Receipt</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted font-medium">Order ID:</span>
              <span className="text-lg font-mono font-bold text-neon tracking-wider">
                {order.id}
              </span>
            </div>

            <p className="text-xs text-muted">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 border-t sm:border-t-0 border-[#22242b] pt-3 sm:pt-0">
            <span className="text-xs text-muted block font-medium">Total Amount</span>
            <span className="text-2xl font-black text-neon font-display text-glow-neon block">
              ₹{order.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Metadata Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status */}
          <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <Clock size={16} className="text-neon" />
              <span>Order Status</span>
            </div>
            <div className="text-white font-bold text-base font-sans">
              {order.orderStatus}
            </div>
            <span className="inline-block bg-amber-500/15 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-amber-500/30">
              {order.orderStatus}
            </span>
          </div>

          {/* Payment Method */}
          <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <CreditCard size={16} className="text-neon" />
              <span>Payment Status</span>
            </div>
            <div className="text-white font-bold text-base font-sans">
              {order.paymentMethod}
            </div>
            <span className="inline-block bg-neon/15 text-neon text-[10px] font-black px-2 py-0.5 rounded uppercase border border-neon/30">
              {order.paymentStatus}
            </span>
          </div>

          {/* Customer */}
          <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <User size={16} className="text-neon" />
              <span>Customer</span>
            </div>
            <div className="text-white font-bold text-sm truncate font-sans">
              {order.customer.fullName}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted truncate">
              <Mail size={12} className="shrink-0 text-neon" />
              <span className="truncate">{order.customer.email}</span>
            </div>
          </div>
        </div>

        {/* Purchased Games List */}
        <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#22242b] pb-4">
            <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
              <ShoppingBag size={20} className="text-neon" />
              Purchased Games ({order.items.length})
            </h2>
          </div>

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

          {/* Pricing Breakdown */}
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
      </div>
    </div>
  );
}
