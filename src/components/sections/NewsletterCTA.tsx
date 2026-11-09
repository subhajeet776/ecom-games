"use client";

import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      <div className="bg-surface border border-neon/20 rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Text */}
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-1">
            Join Our Gaming Community
          </h2>
          <p className="text-muted text-sm">
            Get latest deals, new releases and exclusive offers.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full md:w-auto gap-0"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 md:w-72 bg-background border border-border rounded-l-md px-4 py-3 text-sm text-foreground placeholder-muted focus:outline-none focus:border-neon/50 transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-neon text-black font-semibold px-6 py-3 rounded-r-md hover:bg-neon-dark transition-all duration-200 text-sm cursor-pointer whitespace-nowrap"
          >
            {submitted ? "Subscribed ✓" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
