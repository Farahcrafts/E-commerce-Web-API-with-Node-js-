import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

const API = "http://localhost:3000/api/v1";

// ─── helpers ─────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const api = axios.create({ baseURL: API });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1], delay },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── sub-components ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="
        aspect-[3/4] rounded-3xl bg-cream-200
        animate-shimmer bg-gradient-to-r
        from-cream-200 via-cream-100 to-cream-200
        bg-[length:200%_100%]
      "
      />
      <div className="h-3 w-2/3 rounded-full bg-cream-200 animate-pulse" />
      <div className="h-3 w-1/3 rounded-full bg-cream-200 animate-pulse" />
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await onAddToCart?.(product);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <motion.article
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Image wrapper */}
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-cream-200">
        <img
          src={
            product.image || "https://placehold.co/600x800/F0EBE1/8A817C?text=."
          }
          alt={product.name}
          className="
            w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-105
          "
          loading="lazy"
        />

        {/* Hover overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-charcoal/8 flex items-end justify-center pb-6"
        >
          <motion.button
            initial={{ y: 12, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            onClick={handleAdd}
            className="
              flex items-center gap-2
              bg-cream/95 backdrop-blur-sm
              text-charcoal font-sans text-[12px] tracking-[0.1em] uppercase
              px-6 py-3 rounded-full shadow-nude
              hover:bg-charcoal hover:text-cream
              transition-colors duration-300
            "
          >
            {adding ? (
              <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
            ) : (
              <ShoppingBag size={13} strokeWidth={1.5} />
            )}
            {adding ? "Added" : "Add to Bag"}
          </motion.button>
        </motion.div>

        {/* Badge */}
        {product.isFeatured && (
          <span
            className="
            absolute top-4 left-4
            bg-cream/90 backdrop-blur-sm
            text-charcoal-muted font-sans text-[10px] tracking-[0.12em] uppercase
            px-3 py-1.5 rounded-full
          "
          >
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-[14px] font-medium text-charcoal leading-snug line-clamp-1">
            {product.name}
          </h3>
          <span className="font-sans text-[14px] font-medium text-charcoal shrink-0">
            ${product.price?.toFixed(2)}
          </span>
        </div>
        <p className="font-sans text-[12px] text-charcoal-muted">
          {product.category?.name ?? "—"}
        </p>
      </div>
    </motion.article>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="flex flex-col gap-3 max-w-lg">
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={0.1}
        className="font-serif text-display-md text-charcoal"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.2}
          className="font-sans text-[14px] leading-relaxed text-charcoal-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────
export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const productsRef = useRef(null);
  const productsInView = useInView(productsRef, {
    once: true,
    margin: "-60px",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category?._id === activeCategory);

  return (
    <main className="bg-cream min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[960px] overflow-hidden">
        {/* Background image */}
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1800&q=85&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          {/* Warm gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-transparent to-cream/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/30 to-transparent" />
        </motion.div>

        {/* Hero content */}
        <div className="relative h-full max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-20 lg:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="font-sans text-[11px] tracking-[0.25em] uppercase text-charcoal/60 mb-4"
          >
            New Collection · SS 2025
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="font-serif text-display-xl text-charcoal max-w-2xl leading-[1.02]"
          >
            Rituals for
            <br />
            <em className="not-italic text-nude-dark">radiant</em> skin.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.95,
              duration: 0.8,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="font-sans text-[15px] leading-relaxed text-charcoal/70 max-w-sm mt-5 mb-8"
          >
            Clean beauty, thoughtfully curated. Formulas your skin will love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-4"
          >
            <a
              href="/shop"
              className="
                inline-flex items-center gap-2
                bg-charcoal text-cream
                font-sans text-[13px] tracking-[0.08em] uppercase
                px-8 py-4 rounded-full
                hover:bg-charcoal/80 transition-colors duration-300
              "
            >
              Shop Now
              <ArrowRight size={14} strokeWidth={1.5} />
            </a>
            <a
              href="/collections"
              className="
                inline-flex items-center gap-2
                text-charcoal font-sans text-[13px] tracking-[0.08em] uppercase
                px-8 py-4 rounded-full border border-charcoal/20
                hover:border-charcoal/50 transition-colors duration-300
              "
            >
              Explore
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 right-8 lg:right-12 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/40 rotate-90 origin-center translate-y-4">
            scroll
          </span>
          <div className="w-px h-12 bg-charcoal/20 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-1/2 bg-charcoal/50"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Marquee strip ────────────────────────────────────────────── */}
      <div className="py-4 border-y border-cream-200 overflow-hidden bg-cream-100">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12"
        >
          {Array(8)
            .fill([
              "Clean Formulas",
              "Cruelty Free",
              "Dermatologist Tested",
              "Sustainable Packaging",
            ])
            .flat()
            .map((item, i) => (
              <span
                key={i}
                className="font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-muted flex items-center gap-12"
              >
                {item}
                <span className="w-1 h-1 rounded-full bg-nude inline-block" />
              </span>
            ))}
        </motion.div>
      </div>

      {/* ── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-20 lg:py-28 max-w-screen-xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="Browse by Category"
            title="Find your ritual."
            subtitle="Every skin deserves its own ceremony."
          />

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat._id ? "all" : cat._id,
                  )
                }
                className={[
                  "group relative aspect-square rounded-3xl overflow-hidden",
                  "flex items-end p-6 text-left",
                  "transition-all duration-500",
                  activeCategory === cat._id ? "ring-2 ring-charcoal/30" : "",
                ].join(" ")}
              >
                {/* Color background using category color or fallback */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundColor: cat.color || "#E3D8CC" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                <div className="relative z-10">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/70 mb-1">
                    {cat.icon || "✦"}
                  </p>
                  <h3 className="font-serif text-xl text-cream">{cat.name}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ── Products Grid ─────────────────────────────────────────────── */}
      <section
        ref={productsRef}
        className="pb-24 lg:pb-32 max-w-screen-xl mx-auto px-6 lg:px-12"
      >
        <div className="flex items-end justify-between mb-12">
          <SectionHeading eyebrow="Our Products" title="Curated for you." />
          {/* Filter pills */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={[
                "font-sans text-[12px] tracking-[0.08em] uppercase px-5 py-2.5 rounded-full",
                "transition-all duration-300",
                activeCategory === "all"
                  ? "bg-charcoal text-cream"
                  : "border border-cream-300 text-charcoal-muted hover:border-charcoal/30",
              ].join(" ")}
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat._id}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat._id ? "all" : cat._id,
                  )
                }
                className={[
                  "font-sans text-[12px] tracking-[0.08em] uppercase px-5 py-2.5 rounded-full",
                  "transition-all duration-300",
                  activeCategory === cat._id
                    ? "bg-charcoal text-cream"
                    : "border border-cream-300 text-charcoal-muted hover:border-charcoal/30",
                ].join(" ")}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={productsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
        >
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="font-serif text-xl text-charcoal-muted">
                No products found.
              </p>
            </div>
          )}
        </motion.div>

        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="mt-16 flex justify-center"
          >
            <a
              href="/shop"
              className="
                inline-flex items-center gap-2
                font-sans text-[13px] tracking-[0.1em] uppercase text-charcoal
                border border-cream-400 px-10 py-4 rounded-full
                hover:bg-charcoal hover:text-cream hover:border-charcoal
                transition-all duration-400
              "
            >
              View All Products
              <ArrowRight size={13} strokeWidth={1.5} />
            </a>
          </motion.div>
        )}
      </section>

      {/* ── Editorial Banner ──────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="
            relative rounded-4xl overflow-hidden
            aspect-[21/9] lg:aspect-[3/1]
            bg-cream-300
          "
        >
          <img
            src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&q=80&fit=crop"
            alt="Clean beauty"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-10 lg:px-16">
            <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-cream/60 mb-3">
              Our Philosophy
            </p>
            <h2 className="font-serif text-display-lg text-cream max-w-md leading-tight">
              Beauty rooted in nature.
            </h2>
            <a
              href="/about"
              className="
                mt-6 self-start
                inline-flex items-center gap-2
                font-sans text-[12px] tracking-[0.1em] uppercase text-cream
                border-b border-cream/40 pb-0.5
                hover:border-cream transition-colors duration-300
              "
            >
              Our Story
              <ArrowRight size={12} strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="pb-24 lg:pb-32 max-w-screen-xl mx-auto px-6 lg:px-12">
        <SectionHeading eyebrow="Reviews" title="What they say." />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              text: "The most luxurious skincare experience I've had. My skin glows.",
              name: "Amina R.",
              stars: 5,
            },
            {
              text: "Clean ingredients, beautiful packaging, and it actually works.",
              name: "Leila K.",
              stars: 5,
            },
            {
              text: "I finally found a routine that feels like self-care, not a chore.",
              name: "Yasmine B.",
              stars: 5,
            },
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="bg-cream-100 rounded-3xl p-8 flex flex-col gap-4"
            >
              <div className="flex gap-1">
                {Array(review.stars)
                  .fill(0)
                  .map((_, s) => (
                    <Star
                      key={s}
                      size={12}
                      className="fill-nude-dark text-nude-dark"
                    />
                  ))}
              </div>
              <p className="font-sans text-[14px] leading-relaxed text-charcoal/80 flex-1">
                "{review.text}"
              </p>
              <p className="font-sans text-[12px] tracking-wide text-charcoal-muted">
                — {review.name}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
