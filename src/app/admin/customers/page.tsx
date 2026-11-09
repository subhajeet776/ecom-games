"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, Search, UserCheck, Shield, ShoppingBag } from "lucide-react";
import { getRegisteredUsers } from "@/lib/auth";
import { getOrders } from "@/lib/orders";
import { User } from "@/types/user";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orderCountsMap, setOrderCountsMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const regUsers = getRegisteredUsers();
    setUsers(regUsers);

    // Compute order count per user
    const orders = getOrders();
    const map: Record<string, number> = {};
    orders.forEach((ord) => {
      if (ord.userId) {
        map[ord.userId] = (map[ord.userId] || 0) + 1;
      }
      if (ord.customer?.email) {
        const lowerEmail = ord.customer.email.toLowerCase();
        map[lowerEmail] = (map[lowerEmail] || 0) + 1;
      }
    });
    setOrderCountsMap(map);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = u.fullName.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail) return false;
      }
      return true;
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neon text-xs font-bold uppercase tracking-widest mb-1">
            <Users size={16} />
            <span>Customer Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Registered Customers ({filteredUsers.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Overview of registered user accounts and customer purchase activity.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121418] border border-[#22242b] rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search customer by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181c24] border border-[#262b36] rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted focus:outline-none focus:border-neon"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#121418] border border-[#22242b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#181c24] border-b border-[#22242b] text-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-right">Orders Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e222c]">
              {filteredUsers.map((u) => {
                const count =
                  orderCountsMap[u.id] ||
                  orderCountsMap[u.email.toLowerCase()] ||
                  0;

                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neon">
                      {u.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-black text-xs">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-white">{u.fullName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-white/80">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4 text-muted">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === "admin" ? (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase inline-flex items-center gap-1">
                          <Shield size={10} /> Admin
                        </span>
                      ) : (
                        <span className="bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded uppercase inline-flex items-center gap-1">
                          <UserCheck size={10} /> Customer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 bg-[#181c24] border border-[#262b36] px-3 py-1 rounded-lg text-white font-extrabold text-xs">
                        <ShoppingBag size={12} className="text-neon" />
                        <span>{count} {count === 1 ? "order" : "orders"}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-muted text-xs">
            No customer accounts found.
          </div>
        )}
      </div>
    </div>
  );
}
