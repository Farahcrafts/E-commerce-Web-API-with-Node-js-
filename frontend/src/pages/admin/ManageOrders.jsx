import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { ChevronDown, Search } from "lucide-react";
import api from "../../lib/api";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLOR = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get("/orders")
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: data.status } : o));
    } catch (err) { console.error(err); }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-1">Admin</p>
          <h1 className="font-serif text-display-md text-charcoal">Orders</h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or customer…"
              className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-cream-200 rounded-full font-sans text-[13px] text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:border-charcoal/40 transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none font-sans text-[12px] tracking-[0.06em] text-charcoal bg-cream border border-cream-300 rounded-full px-4 py-2.5 pr-8 cursor-pointer focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
          </div>

          <span className="font-sans text-[12px] text-charcoal-muted ml-auto">
            {filtered.length} orders
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-cream-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100">
                {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-muted px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-cream-200">
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-8 bg-cream-200 animate-pulse rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="font-sans text-[13px] text-charcoal-muted">No orders found.</p>
                  </td>
                </tr>
              ) : filtered.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-cream-200 hover:bg-cream-100/60 transition-colors"
                >
                  <td className="px-5 py-4 font-sans text-[12px] font-medium text-charcoal">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 font-sans text-[12px] text-charcoal">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="px-5 py-4 font-sans text-[12px] text-charcoal-muted">
                    {new Date(order.dateOrdered).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 font-sans text-[12px] text-charcoal-muted">
                    {order.orderItems?.length}
                  </td>
                  <td className="px-5 py-4 font-sans text-[13px] font-medium text-charcoal">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-sans text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full ${STATUS_COLOR[order.status] || "bg-cream-200 text-charcoal-muted"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="appearance-none font-sans text-[11px] tracking-[0.06em] text-charcoal bg-cream border border-cream-200 rounded-lg px-3 py-1.5 pr-6 cursor-pointer focus:outline-none focus:border-charcoal/40 disabled:opacity-50 transition-colors"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {updatingId === order._id ? (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-charcoal border-t-transparent animate-spin" />
                      ) : (
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
