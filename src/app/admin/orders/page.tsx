"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { getOrders, updateOrderStatus, ORDERS_UPDATED_EVENT } from "@/lib/orders";
import { Order } from "@/types/order";

const ORDER_STATUS_OPTIONS = ["Processing", "Completed", "Cancelled"];
const PAYMENT_STATUS_OPTIONS = ["Demo Payment", "Paid", "Pending", "Refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("All");

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();

    const handleUpdate = () => loadOrders();
    window.addEventListener(ORDERS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = ord.id.toLowerCase().includes(q);
        const matchesName = ord.customer.fullName.toLowerCase().includes(q);
        const matchesEmail = ord.customer.email.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesEmail) return false;
      }
      if (
        selectedOrderStatus !== "All" &&
        ord.orderStatus.toLowerCase() !== selectedOrderStatus.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [orders, searchQuery, selectedOrderStatus]);

  const handleStatusChange = (
    orderId: string,
    newOrderStatus: string,
    newPaymentStatus: string
  ) => {
    updateOrderStatus(orderId, newOrderStatus, newPaymentStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neon text-xs font-bold uppercase tracking-widest mb-1">
            <ShoppingBag size={16} />
            <span>Order Fulfillment Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Customer Orders ({filteredOrders.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Monitor and manage customer purchases and order fulfillment statuses.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#121418] border border-[#22242b] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between shadow-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181c24] border border-[#262b36] rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted focus:outline-none focus:border-neon"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium">Filter Status:</span>
          <select
            value={selectedOrderStatus}
            onChange={(e) => setSelectedOrderStatus(e.target.value)}
            className="bg-[#181c24] border border-[#262b36] text-white text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-neon cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#181c24] border-b border-[#22242b] text-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e222c]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Order ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-neon text-sm">
                    {ord.id}
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <p className="font-extrabold text-white">{ord.customer.fullName}</p>
                    <p className="text-[10px] text-muted">{ord.customer.email}</p>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-muted">
                    {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">
                      {ord.items.length} {ord.items.length === 1 ? "Product" : "Products"}
                    </p>
                    <p className="text-[10px] text-muted truncate max-w-[180px]">
                      {ord.items.map((i) => i.title).join(", ")}
                    </p>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-black text-white text-sm">
                    ₹{ord.total}
                  </td>

                  {/* Payment Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) =>
                        handleStatusChange(ord.id, ord.orderStatus, e.target.value)
                      }
                      className="bg-[#181c24] border border-[#262b36] text-emerald-400 font-bold text-[11px] rounded-lg px-2.5 py-1 focus:outline-none focus:border-neon cursor-pointer"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#121418] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Order Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(ord.id, e.target.value, ord.paymentStatus)
                      }
                      className={`font-bold text-[11px] rounded-lg px-2.5 py-1 focus:outline-none border cursor-pointer ${
                        ord.orderStatus === "Completed"
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : ord.orderStatus === "Cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {ORDER_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#121418] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-neon bg-[#181c24] border border-[#262b36] hover:border-neon/40 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <span>View</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-muted text-xs">
            No orders match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
