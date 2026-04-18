import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Search, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";

// ─── tiny hook ──────────────────────────────────────────────────────────────
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

// ─── nav links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
];

// ─── component ───────────────────────────────────────────────────────────────
export default function Navbar({ cartCount = 0, onCartOpen, onAuthOpen }) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main Bar ─────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-600",
          scrolled
            ? "bg-cream/95 backdrop-blur-sm shadow-nude border-b border-cream-200"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — hamburger + desktop links */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="p-1 text-charcoal hover:text-nude-dark transition-colors lg:hidden"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="
                      font-sans text-[13px] tracking-[0.08em] uppercase
                      text-charcoal-muted hover:text-charcoal
                      transition-colors duration-300 relative group
                    "
                  >
                    {link.label}
                    <span
                      className="
                      absolute -bottom-0.5 left-0 w-0 h-px bg-nude-dark
                      transition-all duration-300 group-hover:w-full
                    "
                    />
                  </a>
                ))}
              </nav>
            </div>

            {/* Center — Logo */}
            <a
              href="/"
              className="
                absolute left-1/2 -translate-x-1/2
                font-serif text-xl lg:text-2xl tracking-[0.06em]
                text-charcoal select-none
              "
            >
              Lumière
            </a>

            {/* Right — icons */}
            <div className="flex items-center gap-4 lg:gap-5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="p-1 text-charcoal-muted hover:text-charcoal transition-colors"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* Auth */}
              {/* <button
                onClick={onAuthOpen}
                aria-label="Account"
                className="p-1 text-charcoal-muted hover:text-charcoal transition-colors hidden sm:block"
              >
                <User size={18} strokeWidth={1.5} />
              </button> */}

              {/* Auth */}
              <Link
                to="/login"
                aria-label="Account"
                className="p-1 text-charcoal-muted hover:text-charcoal transition-colors hidden sm:block"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <button
                onClick={onCartOpen}
                aria-label={`Cart (${cartCount} items)`}
                className="relative p-1 text-charcoal-muted hover:text-charcoal transition-colors"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="
                        absolute -top-1 -right-1
                        w-4 h-4 rounded-full
                        bg-charcoal text-cream text-[10px]
                        flex items-center justify-center font-sans font-medium
                      "
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Bar ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden border-t border-cream-200 bg-cream/98 backdrop-blur-sm"
            >
              <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-4">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                  <Search
                    size={16}
                    className="text-charcoal-muted shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products…"
                    className="
                      flex-1 bg-transparent font-sans text-[14px] text-charcoal
                      placeholder-charcoal-muted outline-none
                    "
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X
                      size={16}
                      className="text-charcoal-muted"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mobile Drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="
                fixed inset-y-0 left-0 z-50
                w-80 bg-cream flex flex-col
                shadow-nude-xl
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-cream-200">
                <span className="font-serif text-xl tracking-wide text-charcoal">
                  Lumière
                </span>
                <button onClick={() => setMenuOpen(false)}>
                  <X
                    size={20}
                    strokeWidth={1.5}
                    className="text-charcoal-muted"
                  />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-8 pt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.06,
                      ease: [0.19, 1, 0.22, 1],
                      duration: 0.5,
                    }}
                    onClick={() => setMenuOpen(false)}
                    className="
                      font-serif text-2xl text-charcoal
                      py-3 border-b border-cream-200
                      hover:text-nude-dark transition-colors duration-300
                    "
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Footer */}
              {/* <div className="px-8 py-6 border-t border-cream-200">
                <button
                  onClick={() => {
                    onAuthOpen?.();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-charcoal-muted font-sans text-sm"
                >
                  <User size={16} strokeWidth={1.5} />
                  My Account
                </button>
              </div> */}

              {/* Footer */}
              <div className="px-8 py-6 border-t border-cream-200">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-charcoal-muted font-sans text-sm"
                >
                  <User size={16} strokeWidth={1.5} />
                  My Account
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
