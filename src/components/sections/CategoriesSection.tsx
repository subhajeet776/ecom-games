import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { categories } from "@/data/categories";

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <SectionHeading title="Shop By Category" viewAllHref="/categories" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3] border border-[#22242b] hover:border-neon/50 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
              <span className="text-white font-bold text-sm sm:text-base font-display uppercase tracking-wider group-hover:text-neon transition-colors">
                {cat.name}
              </span>
              <ArrowRight
                size={16}
                className="text-neon opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
