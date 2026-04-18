import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-cream flex flex-col shadow-nude-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} strokeWidth={1.5} className="text-charcoal" />
                <h2 className="font-serif text-lg text-charcoal">Your Bag</h2>
                {count > 0 && (
                  <span className="font-sans text-[11px] text-charcoal-muted">
                    ({count} {count === 1 ? "item" : "items"})
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-cream-200 transition-colors"
              >
                <X size={18} strokeWidth={1.5} className="text-charcoal-muted" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={1} className="text-charcoal-muted" />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-charcoal">Your bag is empty</p>
                    <p className="font-sans text-[13px] text-charcoal-muted mt-1">
                      Add something beautiful.
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); navigate("/shop"); }}
                    className="font-sans text-[12px] tracking-[0.1em] uppercase text-charcoal border-b border-charcoal/30 hover:border-charcoal transition-colors pb-0.5 mt-2"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col divide-y divide-cream-200">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                        className="py-4 flex gap-4 overflow-hidden"
                      >
                        {/* Image */}
                        <div
                          className="w-18 h-24 shrink-0 rounded-xl overflow-hidden bg-cream-200 cursor-pointer"
                          onClick={() => { onClose(); navigate(`/products/${item._id}`); }}
                        >
                          <img
                            src={item.image || "https://placehold.co/200x267/F0EBE1/8A817C?text=."}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <p className="font-sans text-[13px] font-medium text-charcoal line-clamp-1">
                              {item.name}
                            </p>
                            <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                              {item.category?.name}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity */}
                            <div className="flex items-center gap-2 bg-cream-200 rounded-full px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-cream-300 transition-colors"
                              >
                                <Minus size={10} strokeWidth={2} />
                              </button>
                              <span className="font-sans text-[12px] text-charcoal w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-cream-300 transition-colors"
                              >
                                <Plus size={10} strokeWidth={2} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-sans text-[13px] font-medium text-charcoal">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item._id)}
                                className="text-charcoal-muted hover:text-charcoal transition-colors"
                              >
                                <Trash2 size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-200 px-6 py-5 flex flex-col gap-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[13px] text-charcoal-muted">Subtotal</span>
                  <span className="font-serif text-lg text-charcoal">${total.toFixed(2)}</span>
                </div>
                <p className="font-sans text-[11px] text-charcoal-muted -mt-2">
                  Shipping calculated at checkout
                </p>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-charcoal text-cream font-sans text-[13px] tracking-[0.08em] uppercase py-4 rounded-full hover:bg-charcoal/80 transition-colors duration-300"
                >
                  Checkout
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>

                <button
                  onClick={() => { onClose(); navigate("/shop"); }}
                  className="w-full text-center font-sans text-[12px] tracking-[0.08em] uppercase text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
