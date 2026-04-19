import { useState } from "react";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

const INPUT_CLASS = "w-full bg-transparent border-b border-cream-300 py-3 font-sans text-[14px] text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:border-charcoal transition-colors";
const LABEL_CLASS = "font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-muted mb-1 block";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingAddress1: "",
    shippingAddress2: "",
    city: "",
    zip: "",
    country: "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) { navigate("/login", { state: { from: { pathname: "/checkout" } } }); return null; }
  if (items.length === 0) { navigate("/shop"); return null; }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        orderItems: items.map((item) => ({ product: item._id, quantity: item.quantity })),
        user: user._id,
        ...form,
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate("/order-success", { state: { orderId: data._id } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="max-w-screen-lg mx-auto px-6 lg:px-12 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="font-serif text-display-md text-charcoal mb-10"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-3"
          >
            <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-8">
              Shipping Information
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 font-sans text-[12px] rounded-xl px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Phone */}
              <div>
                <label className={LABEL_CLASS}>Phone Number *</label>
                <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" className={INPUT_CLASS} />
              </div>

              {/* Address 1 */}
              <div>
                <label className={LABEL_CLASS}>Street Address *</label>
                <input name="shippingAddress1" required value={form.shippingAddress1} onChange={handleChange} placeholder="123 Main Street" className={INPUT_CLASS} />
              </div>

              {/* Address 2 */}
              <div>
                <label className={LABEL_CLASS}>Apartment, suite, etc. <span className="text-charcoal-muted/50">(optional)</span></label>
                <input name="shippingAddress2" value={form.shippingAddress2} onChange={handleChange} placeholder="Apt 4B" className={INPUT_CLASS} />
              </div>

              {/* City + Zip */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className={LABEL_CLASS}>City *</label>
                  <input name="city" required value={form.city} onChange={handleChange} placeholder="New York" className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>ZIP / Postal Code *</label>
                  <input name="zip" required value={form.zip} onChange={handleChange} placeholder="10001" className={INPUT_CLASS} />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className={LABEL_CLASS}>Country *</label>
                <input name="country" required value={form.country} onChange={handleChange} placeholder="United States" className={INPUT_CLASS} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-charcoal text-cream font-sans text-[13px] tracking-[0.1em] uppercase py-4 rounded-full hover:bg-charcoal/80 transition-colors duration-300 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-cream border-t-transparent animate-spin" />
                ) : `Place Order · $${total.toFixed(2)}`}
              </button>
            </form>
          </motion.div>

          {/* Order summary — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-2"
          >
            <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-6">
              Order Summary
            </h2>

            <div className="flex flex-col divide-y divide-cream-200">
              {items.map((item) => (
                <div key={item._id} className="py-4 flex items-center gap-4">
                  <div className="w-14 h-18 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[13px] font-medium text-charcoal line-clamp-1">{item.name}</p>
                    <p className="font-sans text-[11px] text-charcoal-muted">Qty {item.quantity}</p>
                  </div>
                  <span className="font-sans text-[13px] text-charcoal shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-200 pt-4 mt-2 flex flex-col gap-2">
              <div className="flex justify-between font-sans text-[13px] text-charcoal-muted">
                <span>Subtotal</span><span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans text-[13px] text-charcoal-muted">
                <span>Shipping</span><span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-charcoal border-t border-cream-200 pt-3 mt-1">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
