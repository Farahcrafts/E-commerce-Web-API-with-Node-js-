// import { Instagram, Twitter } from "lucide-react";

const LINKS = {
  Shop: ["New Arrivals", "Best Sellers", "All Products", "Sale"],
  Help: ["FAQ", "Shipping & Returns", "Order Tracking", "Contact Us"],
  Company: ["About", "Journal", "Careers", "Press"],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream mt-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-16 pb-10">
        {/* Top */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cream/10">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="font-serif text-2xl tracking-wide text-cream mb-4">
              Lumière
            </h3>
            <p className="font-sans text-[13px] leading-relaxed text-cream/50 max-w-xs">
              Curated essentials for the modern home. Quality over quantity,
              beauty in the everyday.
            </p>
            {/* <div className="flex gap-4 mt-6">
              {[Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-cream/40 hover:text-cream transition-colors">
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div> */}
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-[11px] tracking-[0.18em] uppercase text-cream/40 mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-sans text-[13px] text-cream/60 hover:text-cream transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[12px] text-cream/30">
            © {new Date().getFullYear()} Lumière. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="font-sans text-[12px] text-cream/30 hover:text-cream/60 transition-colors"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
