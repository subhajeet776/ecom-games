"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { getStoredGames, GAMES_UPDATED_EVENT } from "@/lib/games";
import { getOrders, ORDERS_UPDATED_EVENT } from "@/lib/orders";
import { getRegisteredUsers } from "@/lib/auth";
import { Order } from "@/types/order";
import GameFormModal from "@/components/admin/GameFormModal";
import { saveGame } from "@/lib/games";

export default function AdminDashboardPage() {
  const [gamesCount, setGamesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);

  const loadMetrics = () => {
    const games = getStoredGames();
    const orders = getOrders();
    const customers = getRegisteredUsers();

    setGamesCount(games.length);
    setOrdersCount(orders.length);
    setCustomersCount(customers.length);

    const revenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    setTotalRevenue(revenue);

    // Latest 5 orders
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecentOrders(sorted.slice(0, 5));
  };

  useEffect(() => {
    loadMetrics();

    const handleUpdate = () => loadMetrics();
    window.addEventListener(GAMES_UPDATED_EVENT, handleUpdate);
    window.addEventListener(ORDERS_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(GAMES_UPDATED_EVENT, handleUpdate);
      window.removeEventListener(ORDERS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-neon text-xs font-bold uppercase tracking-widest mb-1">
            <TrendingUp size={16} />
            <span>Store Performance Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Real-time analytics dynamically computed from browser state.
          </p>
        </div>

        <button
          onClick={() => setIsAddGameOpen(true)}
          className="bg-neon text-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-neon-dark transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,232,90,0.3)] shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Game</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Games */}
        <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-neon/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Games
            </span>
            <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
              <Gamepad2 size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-display mt-3">
            {gamesCount}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
            <span>In Store Catalogue</span>
            <Link
              href="/admin/games"
              className="text-neon hover:underline font-bold flex items-center gap-1"
            >
              Manage <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-neon/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-display mt-3">
            {ordersCount}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
            <span>Processed Orders</span>
            <Link
              href="/admin/orders"
              className="text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-neon/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-display mt-3">
            {customersCount}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
            <span>Registered Users</span>
            <Link
              href="/admin/customers"
              className="text-purple-400 hover:underline font-bold flex items-center gap-1"
            >
              View List <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Demo Revenue */}
        <div className="bg-[#121418] border border-[#22242b] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-neon/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Demo Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <IndianRupee size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-neon font-display mt-3">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
            <span>Sum of Demo Orders</span>
            <span className="text-emerald-400 font-semibold">100% Calculated</span>
          </div>
        </div>
      </div>

      {/* Dashboard Recent Orders Section */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#22242b] pb-4">
          <div>
            <h2 className="text-lg font-black text-white font-display uppercase tracking-wide">
              Recent Store Activity
            </h2>
            <p className="text-xs text-muted">
              Latest order transactions placed in the demo store.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-neon hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#22242b] text-muted font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e222c]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-neon">
                      {ord.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-white">{ord.customer.fullName}</p>
                      <p className="text-[10px] text-muted">{ord.customer.email}</p>
                    </td>
                    <td className="py-3.5 px-3 text-muted">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-3 text-white font-semibold">
                      {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      ₹{ord.total}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                          ord.orderStatus === "Completed"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : ord.orderStatus === "Cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {ord.orderStatus === "Completed" ? (
                          <CheckCircle2 size={10} />
                        ) : ord.orderStatus === "Cancelled" ? (
                          <AlertCircle size={10} />
                        ) : (
                          <Clock size={10} />
                        )}
                        <span>{ord.orderStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-bold text-white hover:text-neon bg-[#181c24] border border-[#262b36] hover:border-neon/40 px-3 py-1.5 rounded-lg transition-all inline-block"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-muted text-xs">
            No orders found in local storage state.
          </div>
        )}
      </div>

      {/* Add Game Form Modal */}
      <GameFormModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onSave={(gameData) => {
          saveGame(gameData);
        }}
      />
    </div>
  );
}
