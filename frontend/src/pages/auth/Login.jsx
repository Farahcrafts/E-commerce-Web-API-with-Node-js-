import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left — decorative */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-cream-300">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/30 to-transparent" />
        <div className="absolute bottom-16 left-12">
          <h2 className="font-serif text-4xl text-cream leading-tight">Welcome<br />back.</h2>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="font-serif text-2xl tracking-wide text-charcoal block mb-10">
            Lumière
          </Link>

          <h1 className="font-serif text-display-md text-charcoal mb-1">Sign in</h1>
          <p className="font-sans text-[13px] text-charcoal-muted mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-charcoal underline underline-offset-2 hover:text-nude-dark transition-colors">
              Register
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 font-sans text-[12px] rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-muted">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="bg-cream-100 border border-cream-200 rounded-2xl px-4 py-3 font-sans text-[14px] text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:border-charcoal/40 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-muted">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-cream-100 border border-cream-200 rounded-2xl px-4 py-3 pr-11 font-sans text-[14px] text-charcoal placeholder-charcoal-muted/50 focus:outline-none focus:border-charcoal/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-muted"
                >
                  {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-charcoal text-cream font-sans text-[13px] tracking-[0.1em] uppercase py-4 rounded-full hover:bg-charcoal/80 transition-colors duration-300 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-cream border-t-transparent animate-spin" />
              ) : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
