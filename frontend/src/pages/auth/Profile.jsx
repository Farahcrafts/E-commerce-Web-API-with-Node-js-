import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    if (!user) return;
    api.get(`/orders/get/userorders/${user._id}`)
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleLogout = () => { logout(); navigate("/"); };

  const STATUS_COLOR = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="max-w-screen-lg mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cream-300 flex items-center justify-center">
              <User size={20} strokeWidth={1.5} className="text-charcoal-muted" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-charcoal">{user?.name}</h1>
              <p className="font-sans text-[12px] text-charcoal-muted">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-sans text-[12px] tracking-[0.08em] uppercase text-charcoal-muted hover:text-charcoal transition-colors border border-cream-300 rounded-full px-4 py-2"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sign Out
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-cream-200 mb-8">
          {[
            { id: "orders", label: "My Orders", icon: Package },
            { id: "profile", label: "Profile Details", icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 font-sans text-[12px] tracking-[0.08em] uppercase pb-3 border-b-2 transition-all ${
                tab === id ? "border-charcoal text-charcoal" : "border-transparent text-charcoal-muted hover:text-charcoal"
              }`}
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="flex flex-col gap-4">
            {loadingOrders ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-cream-200 animate-pulse" />
              ))
            ) : orders.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={32} strokeWidth={1} className="text-charcoal-muted mx-auto mb-3" />
                <p className="font-serif text-lg text-charcoal-muted">No orders yet.</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-4 font-sans text-[12px] tracking-[0.1em] uppercase text-charcoal border-b border-charcoal/30 hover:border-charcoal transition-colors pb-0.5"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-cream-100 rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-sans text-[12px] text-charcoal font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`font-sans text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status] || "bg-cream-200 text-charcoal-muted"}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-charcoal-muted">
                      {new Date(order.dateOrdered).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                      {" · "}
                      {order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-charcoal">${order.totalPrice?.toFixed(2)}</span>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-charcoal-muted" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Profile details tab */}
        {tab === "profile" && (
          <div className="bg-cream-100 rounded-2xl p-6 grid sm:grid-cols-2 gap-5">
            {[
              { label: "Full Name", value: user?.name },
              { label: "Email", value: user?.email },
              { label: "Phone", value: user?.phone || "—" },
              { label: "City", value: user?.city || "—" },
              { label: "Country", value: user?.country || "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-muted mb-1">
                  {label}
                </p>
                <p className="font-sans text-[14px] text-charcoal">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
