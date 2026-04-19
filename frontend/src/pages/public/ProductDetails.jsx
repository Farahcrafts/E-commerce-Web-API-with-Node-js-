import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import { Minus, Plus, ShoppingBag, ArrowLeft, Star, Package, RotateCcw } from "lucide-react";
import api from "../../lib/api";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
// eslint-disable-next-line no-unused-vars
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        // fetch related by category
        if (data.category?._id) {
          const rel = await api.get(`/products?categories=${data.category._id}`);
          setRelated(rel.data.filter((p) => p._id !== id).slice(0, 4));
        }
      } catch {
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };
    fetch();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAdd = () => {
    setAdding(true);
    addItem(product, quantity);
    setTimeout(() => setAdding(false), 900);
  };

  if (loading) return (
    <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-nude border-t-charcoal animate-spin" />
    </div>
  );

  if (!product) return null;

  const images = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-cream pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-sans text-[12px] tracking-[0.08em] uppercase text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">

          {/* Image gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-16 shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-charcoal" : "border-transparent opacity-50"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-cream-200"
            >
              <img
                src={images[activeImage] || "https://placehold.co/800x1067/F0EBE1/8A817C?text=."}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Product info */}
          <div className="flex flex-col justify-center lg:py-8">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Category + title */}
              <div>
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-2">
                  {product.category?.name}
                </p>
                <h1 className="font-serif text-display-md text-charcoal leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating mock */}
              {product.numReviews > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.round(product.rating) ? "fill-nude-dark text-nude-dark" : "text-cream-300 fill-cream-300"}
                      />
                    ))}
                  </div>
                  <span className="font-sans text-[12px] text-charcoal-muted">
                    {product.rating?.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <p className="font-serif text-3xl text-charcoal">
                ${product.price?.toFixed(2)}
              </p>

              {/* Description */}
              <p className="font-sans text-[14px] leading-relaxed text-charcoal/70 border-t border-cream-200 pt-6">
                {product.description || product.desciption}
              </p>

              {/* Rich description */}
              {product.richDescription && (
                <p className="font-sans text-[13px] leading-relaxed text-charcoal-muted">
                  {product.richDescription}
                </p>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${product.countInStock > 0 ? "bg-green-500" : "bg-red-400"}`} />
                <span className="font-sans text-[12px] text-charcoal-muted">
                  {product.countInStock > 0
                    ? product.countInStock < 5
                      ? `Only ${product.countInStock} left`
                      : "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity + Add */}
              {product.countInStock > 0 && (
                <div className="flex flex-col gap-3 pt-2">
                  {/* Qty selector */}
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[12px] tracking-[0.08em] uppercase text-charcoal-muted">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 border border-cream-300 rounded-full px-4 py-2">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="text-charcoal-muted hover:text-charcoal transition-colors"
                      >
                        <Minus size={13} strokeWidth={1.5} />
                      </button>
                      <span className="font-sans text-[14px] font-medium text-charcoal w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                        className="text-charcoal-muted hover:text-charcoal transition-colors"
                      >
                        <Plus size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 bg-charcoal text-cream font-sans text-[13px] tracking-[0.1em] uppercase py-4 rounded-full hover:bg-charcoal/80 transition-colors duration-300"
                  >
                    {adding ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-cream border-t-transparent animate-spin" />
                        Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} strokeWidth={1.5} />
                        Add to Bag — ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Perks */}
              <div className="flex flex-col gap-2.5 border-t border-cream-200 pt-5">
                {[
                  { icon: Package, text: "Free shipping on orders over $75" },
                  { icon: RotateCcw, text: "Free returns within 30 days" },
// eslint-disable-next-line no-unused-vars
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon size={14} strokeWidth={1.5} className="text-charcoal-muted shrink-0" />
                    <span className="font-sans text-[12px] text-charcoal-muted">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
