import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, delay = 0 }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    addItem(product, 1);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/products/${product._id}`)}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden bg-cream-200">
        <img
          src={product.image || "https://placehold.co/600x800/F0EBE1/8A817C?text=."}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Stock badge */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-cream/60 backdrop-blur-xs flex items-center justify-center">
            <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal-muted bg-cream px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {product.isFeatured && product.countInStock > 0 && (
          <span className="absolute top-3 left-3 bg-charcoal text-cream font-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">
            Featured
          </span>
        )}

        {/* Hover actions */}
        {product.countInStock > 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-charcoal/5 flex items-end justify-center gap-2 pb-5"
          >
            <motion.button
              animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-cream/95 backdrop-blur-sm text-charcoal font-sans text-[11px] tracking-[0.1em] uppercase px-5 py-2.5 rounded-full shadow-nude hover:bg-charcoal hover:text-cream transition-colors duration-300"
            >
              {adding ? (
                <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
              ) : (
                <ShoppingBag size={12} strokeWidth={1.5} />
              )}
              {adding ? "Added!" : "Add to Bag"}
            </motion.button>

            <motion.button
              animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.04, ease: [0.19, 1, 0.22, 1] }}
              onClick={(e) => { e.stopPropagation(); navigate(`/products/${product._id}`); }}
              className="flex items-center justify-center bg-cream/95 backdrop-blur-sm text-charcoal w-10 h-10 rounded-full shadow-nude hover:bg-charcoal hover:text-cream transition-colors duration-300"
            >
              <Eye size={14} strokeWidth={1.5} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-[13px] lg:text-[14px] font-medium text-charcoal leading-snug line-clamp-1">
            {product.name}
          </h3>
          <span className="font-sans text-[13px] lg:text-[14px] font-medium text-charcoal shrink-0">
            ${product.price?.toFixed(2)}
          </span>
        </div>
        <p className="font-sans text-[11px] text-charcoal-muted">
          {product.category?.name ?? "—"}
        </p>
      </div>
    </motion.article>
  );
}
