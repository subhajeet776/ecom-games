"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { saveOrder, generateOrderId } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, clearCart, isLoaded } = useCart();
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    notes: "",
  });

  // Auto-fill user details when authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  // Redirect if cart is empty after hydration (unless an order has been successfully placed)
  useEffect(() => {
    if (isLoaded && items.length === 0 && !isSubmitting && !isOrderCompleted) {
      router.replace("/cart");
    }
  }, [isLoaded, items, router, isSubmitting, isOrderCompleted]);

  if (!isLoaded || (items.length === 0 && !isOrderCompleted)) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16 flex items-center justify-center">
        <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
          Loading Checkout...
        </div>
      </div>
    );
  }

  if (isOrderCompleted) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16 flex items-center justify-center">
        <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
          Processing &amp; Redirecting to Order Confirmation...
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field when user types
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        delete copy.form;
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (
      !/^\+?[0-9\s\-()]{8,18}$/.test(formData.phone.trim()) ||
      formData.phone.trim().replace(/\D/g, "").length < 8
    ) {
      newErrors.phone = "Please enter a valid phone number (at least 8-10 digits)";
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.form = "Please fix the highlighted errors below before placing your order.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (items.length === 0) {
      setErrors({ form: "Your cart is empty. Please add games before checkout." });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const newOrder: Order = {
        id: orderId,
        userId: user?.id || undefined,
        createdAt: new Date().toISOString(),
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          country: formData.country.trim() || "India",
          state: formData.state.trim() || "N/A",
          city: formData.city.trim() || "N/A",
          notes: formData.notes.trim() || undefined,
        },
        items: items.map((item) => ({
          id: item.game.id,
          title: item.game.title,
          slug: item.game.slug,
          coverImage: item.game.coverImage,
          platform: item.game.platform,
          price: item.game.price,
          quantity: item.quantity,
        })),
        subtotal,
        fee: 0,
        total,
        paymentMethod: "Demo Payment",
        paymentStatus: "Demo Payment",
        orderStatus: "Processing",
      };

      // Save order to localStorage defensively
      const isSaved = saveOrder(newOrder);
      if (!isSaved) {
        throw new Error("Failed to save order to localStorage.");
      }

      // Mark order as completed so useEffect does not redirect to /cart
      setIsOrderCompleted(true);

      // Clear the cart AFTER order is saved
      clearCart();

      // Navigate to order success page
      router.push(`/order-success/${orderId}`);
    } catch (err) {
      console.error("Order processing error:", err);
      setErrors({ form: "An error occurred while processing your order. Please check your storage settings and try again." });
      setIsSubmitting(false);
      setIsOrderCompleted(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1e222c]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-neon rounded-full shadow-[0_0_10px_rgba(0,232,90,0.6)]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
                Checkout
              </h1>
            </div>
            <p className="text-muted text-xs sm:text-sm pl-4">
              Enter your details to complete your order and receive instant activation.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neon font-bold uppercase tracking-wider hover:underline"
          >
            <ArrowLeft size={16} />
            <span>Return to Cart</span>
          </Link>
        </div>

        {/* Form Error Banner */}
        {errors.form && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Customer Information & Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Details Card */}
              <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#22242b] pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <User className="text-neon" size={20} />
                    <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                      Customer Information
                    </h2>
                  </div>
                  <span className="text-xs text-muted font-medium">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name (Required) */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="fullName" className="block text-xs font-bold text-white uppercase tracking-wide">
                      Full Name <span className="text-neon">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full bg-[#181b22] border ${
                          errors.fullName ? "border-red-500" : "border-[#282d38]"
                        } rounded-lg py-3 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-400 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email (Required) */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-bold text-white uppercase tracking-wide">
                      Email Address <span className="text-neon">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@example.com"
                        className={`w-full bg-[#181b22] border ${
                          errors.email ? "border-red-500" : "border-[#282d38]"
                        } rounded-lg py-3 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-400 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone (Required) */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-bold text-white uppercase tracking-wide">
                      Phone Number <span className="text-neon">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-[#181b22] border ${
                          errors.phone ? "border-red-500" : "border-[#282d38]"
                        } rounded-lg py-3 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
                      />
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-400 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label htmlFor="country" className="block text-xs font-bold text-white uppercase tracking-wide">
                      Country
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="India"
                        className="w-full bg-[#181b22] border border-[#282d38] rounded-lg py-3 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors"
                      />
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label htmlFor="state" className="block text-xs font-bold text-white uppercase tracking-wide">
                      State / Region
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-[#181b22] border border-[#282d38] rounded-lg py-3 px-4 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label htmlFor="city" className="block text-xs font-bold text-white uppercase tracking-wide">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#181b22] border border-[#282d38] rounded-lg py-3 px-4 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors"
                    />
                  </div>

                  {/* Order Notes (Optional) */}
                  <div className="sm:col-span-2 space-y-1.5 pt-2">
                    <label htmlFor="notes" className="block text-xs font-bold text-white uppercase tracking-wide">
                      Order Notes <span className="text-muted font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions or activation requests..."
                        className="w-full bg-[#181b22] border border-[#282d38] rounded-lg py-3 px-4 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Card (Demo Mode) */}
              <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#22242b] pb-4">
                  <CreditCard className="text-neon" size={20} />
                  <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                    Payment Method
                  </h2>
                </div>

                {/* Demo Payment Option Card */}
                <div className="bg-[#181b22] border-2 border-neon/60 rounded-xl p-4 flex items-start gap-4 relative shadow-[0_0_15px_rgba(0,232,90,0.1)]">
                  <div className="w-5 h-5 rounded-full border-2 border-neon flex items-center justify-center mt-0.5 shrink-0 bg-neon">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base font-sans">
                        Demo Payment (Test Checkout Mode)
                      </h3>
                      <span className="bg-neon/20 border border-neon/50 text-neon text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                        DEMO MODE
                      </span>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed">
                      Instant simulated checkout for testing purposes. No real payment credentials or credit cards required.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3 text-amber-300 text-xs">
                  <Lock size={18} className="shrink-0" />
                  <span>
                    This is a functional demonstration checkout. Real payment gateways will be integrated in the backend phase.
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl sticky top-24 space-y-6">
                <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide border-b border-[#22242b] pb-3">
                  Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} {items.length === 1 ? "item" : "items"})
                </h2>

                {/* Purchased Games List */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {items.map(({ game, quantity }) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between gap-3 bg-[#181b22] border border-[#262b36] rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden border border-[#2c3240] bg-black">
                          <Image
                            src={game.coverImage}
                            alt={game.title}
                            fill
                            sizes="50px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                            {game.title}
                          </h4>
                          <span className="text-[10px] text-muted font-medium block">
                            Qty: {quantity} &times; ₹{game.price}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-neon font-extrabold text-sm font-display">
                          ₹{(game.price * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Fees */}
                <div className="space-y-3 text-sm border-t border-[#22242b] pt-4">
                  <div className="flex justify-between text-muted">
                    <span>Cart Subtotal</span>
                    <span className="text-white font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Digital Activation</span>
                    <span className="text-neon font-bold uppercase text-xs">FREE</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Instant Email Delivery</span>
                    <span className="text-neon font-bold uppercase text-xs">FREE</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="border-t border-[#22242b] pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-white font-display uppercase">
                    Total Amount
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-neon font-display text-glow-neon block">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-muted font-medium">Taxes & fees included</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#34d34a] hover:bg-[#2cc042] disabled:opacity-50 text-black font-bold text-base py-4 rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(52,211,74,0.3)] hover:shadow-[0_0_30px_rgba(52,211,74,0.5)] hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing Order...</span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-[#22242b] space-y-2 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-neon shrink-0" />
                    <span>Instant digital access sent upon placing order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-neon shrink-0" />
                    <span>100% Guaranteed Genuine Steam / PC Keys</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
