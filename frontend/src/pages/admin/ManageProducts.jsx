import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload, Search } from "lucide-react";
import api from "../../lib/api";

const EMPTY_FORM = {
  name: "", description: "", richDescription: "", brand: "",
  price: "", category: "", countInStock: "", isFeatured: false,
};

const INPUT = "w-full bg-cream border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-[13px] text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:border-charcoal/40 transition-colors";
const LABEL = "font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-muted mb-1 block";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // product being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef();

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([api.get("/products"), api.get("/categories")]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || product.desciption || "",
      richDescription: product.richDescription || "",
      brand: product.brand || "",
      price: product.price,
      category: product.category?._id || "",
      countInStock: product.countInStock,
      isFeatured: product.isFeatured || false,
    });
    setImagePreview(product.image || "");
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append("image", imageFile);

      if (editing) {
        await api.put(`/products/${editing._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-muted mb-1">Admin</p>
            <h1 className="font-serif text-display-md text-charcoal">Products</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-charcoal text-cream font-sans text-[12px] tracking-[0.08em] uppercase px-5 py-3 rounded-full hover:bg-charcoal/80 transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-cream-200 rounded-full font-sans text-[13px] text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:border-charcoal/40 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-cream-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100">
                {["Product", "Category", "Price", "Stock", "Featured", ""].map((h) => (
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
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-8 bg-cream-200 animate-pulse rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filtered.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-cream-200 hover:bg-cream-100/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-sans text-[13px] text-charcoal font-medium line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-sans text-[12px] text-charcoal-muted">{product.category?.name || "—"}</td>
                  <td className="px-5 py-3.5 font-sans text-[13px] text-charcoal">${product.price?.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-sans text-[11px] px-2.5 py-1 rounded-full ${product.countInStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {product.isFeatured && (
                      <span className="font-sans text-[10px] tracking-[0.1em] uppercase bg-cream-200 text-charcoal-muted px-2.5 py-1 rounded-full">Yes</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-cream-200 transition-colors text-charcoal-muted hover:text-charcoal">
                        <Pencil size={13} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-charcoal-muted hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-nude-xl">
                {/* Modal header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-cream-200">
                  <h2 className="font-serif text-lg text-charcoal">
                    {editing ? "Edit Product" : "New Product"}
                  </h2>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-full hover:bg-cream-200 transition-colors">
                    <X size={16} strokeWidth={1.5} className="text-charcoal-muted" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="p-8 flex flex-col gap-5">
                  {/* Image upload */}
                  <div>
                    <label className={LABEL}>Product Image</label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="aspect-[3/2] w-full rounded-2xl border-2 border-dashed border-cream-300 overflow-hidden cursor-pointer hover:border-charcoal/30 transition-colors flex items-center justify-center bg-cream-100"
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-charcoal-muted">
                          <Upload size={20} strokeWidth={1.5} />
                          <span className="font-sans text-[12px]">Click to upload image</span>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>

                  {/* Name */}
                  <div>
                    <label className={LABEL}>Product Name *</label>
                    <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" className={INPUT} />
                  </div>

                  {/* Category */}
                  <div>
                    <label className={LABEL}>Category *</label>
                    <select required value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className={INPUT + " cursor-pointer"}>
                      <option value="">Select a category</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Price + Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Price ($) *</label>
                      <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Count in Stock *</label>
                      <input required type="number" min="0" value={form.countInStock} onChange={(e) => setForm(f => ({ ...f, countInStock: e.target.value }))} placeholder="0" className={INPUT} />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={LABEL}>Description *</label>
                    <textarea required rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description…" className={INPUT + " resize-none"} />
                  </div>

                  {/* Brand + featured */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Brand</label>
                      <input value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand name" className={INPUT} />
                    </div>
                    <div className="flex items-end pb-0.5">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <div
                          onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}
                          className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${form.isFeatured ? "bg-charcoal" : "bg-cream-300"}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-cream transition-all duration-300 ${form.isFeatured ? "left-5" : "left-0.5"}`} />
                        </div>
                        <span className="font-sans text-[12px] text-charcoal-muted">Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-full border border-cream-300 font-sans text-[12px] tracking-[0.08em] uppercase text-charcoal-muted hover:border-charcoal/40 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-charcoal text-cream font-sans text-[12px] tracking-[0.08em] uppercase hover:bg-charcoal/80 transition-colors disabled:opacity-50 flex items-center justify-center">
                      {saving ? <span className="w-4 h-4 rounded-full border-2 border-cream border-t-transparent animate-spin" /> : (editing ? "Save Changes" : "Create Product")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
