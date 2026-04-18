import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId;

  if (!orderId) { navigate("/"); return null; }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={36} strokeWidth={1.2} className="text-charcoal" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <h1 className="font-serif text-display-md text-charcoal mb-3">Order Placed!</h1>
          <p className="font-sans text-[14px] leading-relaxed text-charcoal-muted mb-2">
            Thank you for your order. We'll send you a confirmation once your items are on their way.
          </p>
          <p className="font-sans text-[12px] text-charcoal-muted">
            Order ID:{" "}
            <span className="font-medium text-charcoal">
              #{orderId.slice(-10).toUpperCase()}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-3 mt-10"
        >
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 bg-charcoal text-cream font-sans text-[13px] tracking-[0.08em] uppercase py-4 rounded-full hover:bg-charcoal/80 transition-colors"
          >
            <Package size={14} strokeWidth={1.5} />
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 text-charcoal font-sans text-[13px] tracking-[0.08em] uppercase py-4 rounded-full border border-cream-300 hover:border-charcoal/40 transition-colors"
          >
            Continue Shopping
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
