import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { reviews } from "@/data/reviews";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="section-bar" />
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Trusted by Gamers
          </h2>
        </div>
        <button className="flex items-center gap-1 text-sm text-neon font-medium border border-neon/30 px-3 py-1.5 rounded hover:bg-neon/10 transition-all cursor-pointer">
          View All Reviews
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-surface border border-border rounded-lg p-5 card-hover"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {review.name}
                </p>
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Comment */}
            <p className="text-muted text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Demo notice */}
      <p className="text-center text-muted/40 text-xs mt-4">
        Demo testimonials for illustration purposes.
      </p>
    </section>
  );
}
