import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, ChevronRight } from "lucide-react";
import api from "../../lib/api";

// eslint-disable-next-line no-unused-vars
function StatCard({ icon: Icon, label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="bg-cream-100 rounded-2xl p-6 flex flex-col gap-3"
    >
      <div className="w-9 h-9 rounded-xl bg-cream-200 flex items-center justify-center">
        <Icon size={16} strokeWidth={1.5} className="text-charcoal-muted" />
      </div>
      <div>
        <p className="font-serif text-3xl text-charcoal">{value ?? "—"}</p>
        <p className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal-muted mt-0.5">{label}</p>
        {sub && <p className="font-sans text-[11px] text-charcoal-muted/60 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, orders, sales] = await Promise.all([
          api.get("/users/get/count"),
          api.get("/products/get/count"),
          api.get("/orders/get/count"),
          api.get("/orders/get/totalsales"),
        ]);
        const recent = await api.get("/orders");
        setStats({
          users: users.data.userCount,
          products: products.data.productCount,
          orders: orders.data.orderCount,
          sales: sales.data.totalsales,
        });
        setRecentOrders(recent.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STATUS_COLOR = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-1">Admin</p>
          <h1 className="font-serif text-display-md text-charcoal">Dashboard</h1>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={DollarSign} label="Total Sales" value={loading ? "—" : `$${stats.sales?.toFixed(0)}`} delay={0} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={loading ? "—" : stats.orders} delay={0.06} />
          <StatCard icon={Package} label="Products" value={loading ? "—" : stats.products} delay={0.12} />
          <StatCard icon={Users} label="Customers" value={loading ? "—" : stats.users} delay={0.18} />
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { label: "Manage Products", sub: "Add, edit or remove products", href: "/admin/products", icon: Package },
            { label: "Manage Orders", sub: "View and update order statuses", href: "/admin/orders", icon: ShoppingBag },
// eslint-disable-next-line no-unused-vars
          ].map(({ label, sub, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="bg-charcoal text-cream rounded-2xl p-6 flex items-center justify-between group hover:bg-charcoal/90 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cream/10 flex items-center justify-center">
                  <Icon size={18} strokeWidth={1.5} className="text-cream" />
                </div>
                <div>
                  <p className="font-sans text-[14px] font-medium text-cream">{label}</p>
                  <p className="font-sans text-[12px] text-cream/50">{sub}</p>
                </div>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="text-cream/40 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-muted">Recent Orders</h2>
            <Link to="/admin/orders" className="font-sans text-[12px] tracking-[0.08em] uppercase text-charcoal border-b border-charcoal/30 hover:border-charcoal transition-colors pb-0.5">
              View All
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-cream-200">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-14 animate-pulse bg-cream-200 rounded-xl mb-2" />)
            ) : recentOrders.map((order) => (
              <div key={order._id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-[13px] font-medium text-charcoal">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-sans text-[11px] text-charcoal-muted">
                    {order.user?.name || "Guest"} · {new Date(order.dateOrdered).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-sans text-[10px] tracking-[0.1em] uppercase px-3 py-1 rounded-full ${STATUS_COLOR[order.status] || "bg-cream-200 text-charcoal-muted"}`}>
                    {order.status}
                  </span>
                  <span className="font-serif text-base text-charcoal">${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
