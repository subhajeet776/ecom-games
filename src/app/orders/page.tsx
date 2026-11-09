"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Clock, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByUserId } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoaded } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace("/login?redirect=/orders");
      return;
    }

    if (isLoaded && user) {
      const fetchedOrders = getOrdersByUserId(user.id, user.email);
      setOrders(fetchedOrders);
      setLoadingOrders(false);
    }
  }, [isLoaded, isAuthenticated, user, router]);

  if (!isLoaded || !isAuthenticated || loadingOrders) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16 flex items-center justify-center">
        <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
          Loading Orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e222c]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-neon rounded-full shadow-[0_0_10px_rgba(0,232,90,0.6)]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
                My Orders
              </h1>
            </div>
            <p className="text-muted text-xs sm:text-sm pl-4">
              View your order history and access activation keys.
            </p>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neon font-bold uppercase tracking-wider hover:underline"
          >
            <ArrowLeft size={16} />
            <span>Back to Account</span>
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-10 text-center flex flex-col items-center justify-center shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
              <Package size={32} />
            </div>
            <h2 className="text-xl font-bold text-white font-display uppercase">
              No Orders Found
            </h2>
            <p className="text-xs text-muted max-w-sm">
              You haven&apos;t placed any game orders yet. Browse our catalogue to get instant digital keys!
            </p>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 bg-[#34d34a] hover:bg-[#2cc042] text-black font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-[0_0_15px_rgba(52,211,74,0.3)]"
            >
              <span>Explore Games</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-[#121418] hover:bg-[#161920] border border-[#22242b] hover:border-neon/40 rounded-2xl p-5 sm:p-6 transition-all shadow-xl group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22242b] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-mono text-xs font-bold shrink-0">
                      <Package size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted font-medium block">Order ID</span>
                      <span className="text-sm font-mono font-bold text-neon tracking-wider">
                        {order.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-neon" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <span className="bg-neon/15 text-neon text-[10px] font-black px-2 py-0.5 rounded uppercase border border-neon/30">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <ShoppingBag size={16} className="text-neon shrink-0" />
                    <span className="font-semibold">
                      {order.items.map((i) => i.title).join(", ")}
                    </span>
                    <span className="text-muted">
                      ({order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.length === 1 ? "item" : "items"})
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-muted block">Total Paid</span>
                      <span className="text-neon font-black text-base font-display">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-muted group-hover:text-neon group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
