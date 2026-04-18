import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import api from "../../lib/api";
import ProductCard from "../../components/ProductCard";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured", value: "featured" },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[3/4] rounded-2xl bg-cream-200 animate-pulse" />
      <div className="h-3 w-2/3 rounded-full bg-cream-200 animate-pulse" />
      <div className="h-3 w-1/3 rounded-full bg-cream-200 animate-pulse" />
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(pRes.data);
        setCategories(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter + sort
  const filtered = products
    .filter((p) => {
      if (activeCategory !== "all" && p.category?._id !== activeCategory) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "featured") return b.isFeatured - a.isFeatured;
      return 0; // newest — keep server order
    });

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      {/* Page header */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10 lg:py-14 border-b border-cream-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-2">
            Explore
          </p>
          <h1 className="font-serif text-display-md text-charcoal">All Products</h1>
        </motion.div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory("all")}
              className={`font-sans text-[12px] tracking-[0.06em] uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-charcoal text-cream"
                  : "border border-cream-300 text-charcoal-muted hover:border-charcoal/40"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(activeCategory === cat._id ? "all" : cat._id)}
                className={`font-sans text-[12px] tracking-[0.06em] uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === cat._id
                    ? "bg-charcoal text-cream"
                    : "border border-cream-300 text-charcoal-muted hover:border-charcoal/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-[12px] text-charcoal-muted hidden sm:block">
              {filtered.length} products
            </span>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none font-sans text-[12px] tracking-[0.06em] uppercase text-charcoal bg-cream border border-cream-300 rounded-full px-4 py-2 pr-8 cursor-pointer focus:outline-none focus:border-charcoal/40"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 font-sans text-[12px] tracking-[0.06em] uppercase text-charcoal border border-cream-300 rounded-full px-4 py-2 lg:hidden"
            >
              <SlidersHorizontal size={12} strokeWidth={1.5} />
              Filter
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-8 relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full font-sans text-[13px] text-charcoal bg-cream-100 border border-cream-200 rounded-full px-5 py-2.5 placeholder-charcoal-muted focus:outline-none focus:border-charcoal/30 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={14} className="text-charcoal-muted" />
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} delay={i * 0.05} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-xl text-charcoal-muted">No products match your filters.</p>
            <button
              onClick={() => { setActiveCategory("all"); setSearch(""); }}
              className="mt-4 font-sans text-[12px] tracking-[0.1em] uppercase text-charcoal border-b border-charcoal/30 hover:border-charcoal transition-colors pb-0.5"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
