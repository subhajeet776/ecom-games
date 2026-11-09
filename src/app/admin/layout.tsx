import React from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import DemoNoticeBanner from "@/components/admin/DemoNoticeBanner";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin Dashboard — Steam Games 99",
  description: "Portfolio Demo Store Management Console",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex flex-col text-foreground">
        <DemoNoticeBanner />
        <AdminNav />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
