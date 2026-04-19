import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Search, X, Menu, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop" },
];

export default function Navbar({ onCartOpen }) {
  const scrolled = useScrolled();
  const { user, token, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

// eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate("/"); setUserMenuOpen(false); };

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className={["fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "bg-cream/95 backdrop-blur-sm shadow-nude border-b border-cream-200" : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Left */}
            <div className="flex items-center gap-8">
              <button onClick={() => setMenuOpen(true)} className="p-1 text-charcoal lg:hidden">
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <nav className="hidden lg:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} to={link.href}
                    className="font-sans text-[13px] tracking-[0.08em] uppercase text-charcoal-muted hover:text-charcoal transition-colors relative group">
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-nude-dark transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
                {token && isAdmin() && (
                  <Link to="/admin"
                    className="font-sans text-[13px] tracking-[0.08em] uppercase text-nude-dark hover:text-charcoal transition-colors relative group">
                    Dashboard
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-charcoal transition-all duration-300 group-hover:w-full" />
                  </Link>
                )}
              </nav>
            </div>

            {/* Center */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-xl lg:text-2xl tracking-[0.06em] text-charcoal select-none">
              Lumière
            </Link>

            {/* Right */}
            <div className="flex items-center gap-4 lg:gap-5">
              <button onClick={() => setSearchOpen((v) => !v)} className="p-1 text-charcoal-muted hover:text-charcoal transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* Auth */}
              {token && user ? (
                <div ref={userMenuRef} className="relative hidden sm:block">
                  <button onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 p-1 text-charcoal-muted hover:text-charcoal transition-colors">
                    <div className="w-7 h-7 rounded-full bg-cream-300 flex items-center justify-center">
                      <span className="font-sans text-[11px] font-medium text-charcoal">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown size={12} strokeWidth={1.5}
                      className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-cream rounded-2xl shadow-nude-lg border border-cream-200 overflow-hidden py-2"
                      >
                        <div className="px-4 py-3 border-b border-cream-200">
                          <p className="font-sans text-[13px] font-medium text-charcoal truncate">{user.name}</p>
                          <p className="font-sans text-[11px] text-charcoal-muted truncate">{user.email}</p>
                          {isAdmin() && (
                            <span className="inline-block mt-1.5 font-sans text-[9px] tracking-[0.12em] uppercase bg-charcoal text-cream px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="py-1">
                          <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[13px] text-charcoal hover:bg-cream-100 transition-colors">
                            <User size={14} strokeWidth={1.5} /> My Profile
                          </Link>
                          {isAdmin() && (
                            <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-[13px] text-charcoal hover:bg-cream-100 transition-colors">
                              <LayoutDashboard size={14} strokeWidth={1.5} /> Admin Dashboard
                            </Link>
                          )}
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 font-sans text-[13px] text-charcoal-muted hover:text-charcoal hover:bg-cream-100 transition-colors">
                            <LogOut size={14} strokeWidth={1.5} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center p-1 text-charcoal-muted hover:text-charcoal transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}

              {/* Cart */}
              <button onClick={onCartOpen} className="relative p-1 text-charcoal-muted hover:text-charcoal transition-colors">
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-charcoal text-cream text-[10px] flex items-center justify-center font-sans font-medium">
                      {count > 9 ? "9+" : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden border-t border-cream-200 bg-cream/98 backdrop-blur-sm"
            >
              <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-4">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                  <Search size={16} className="text-charcoal-muted shrink-0" strokeWidth={1.5} />
                  <input autoFocus type="text" placeholder="Search products…"
                    onKeyDown={(e) => { if (e.key === "Enter" && e.target.value) { navigate(`/shop?q=${e.target.value}`); setSearchOpen(false); } }}
                    className="flex-1 bg-transparent font-sans text-[14px] text-charcoal placeholder-charcoal-muted outline-none" />
                  <button onClick={() => setSearchOpen(false)}>
                    <X size={16} className="text-charcoal-muted" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)} className="fixed inset-0 z-50 bg-charcoal/20 backdrop-blur-xs" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-cream flex flex-col shadow-nude-xl">
              <div className="flex items-center justify-between px-8 py-6 border-b border-cream-200">
                <span className="font-serif text-xl text-charcoal">Lumière</span>
                <button onClick={() => setMenuOpen(false)}><X size={20} strokeWidth={1.5} className="text-charcoal-muted" /></button>
              </div>
              <nav className="flex-1 px-8 pt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} to={link.href}
                    className="block font-serif text-2xl text-charcoal py-3 border-b border-cream-200 hover:text-nude-dark transition-colors">
                    {link.label}
                  </Link>
                ))}
                {token && isAdmin() && (
                  <Link to="/admin" className="block font-serif text-2xl text-nude-dark py-3 border-b border-cream-200 hover:text-charcoal transition-colors">
                    Dashboard
                  </Link>
                )}
              </nav>
              <div className="px-8 py-6 border-t border-cream-200 flex flex-col gap-3">
                {token && user ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-2 text-charcoal font-sans text-sm"><User size={16} strokeWidth={1.5} />{user.name}</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-charcoal-muted font-sans text-sm"><LogOut size={16} strokeWidth={1.5} />Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-charcoal-muted font-sans text-sm"><User size={16} strokeWidth={1.5} />Sign In</Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
