import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import logo from '../Assets/LogoLatest.png';
import api from "../services/api";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.getCategories();
        if (Array.isArray(data)) {
          setDynamicCategories(data.filter(cat => 
            typeof cat === 'string' && 
            cat.trim() !== '' && 
            /[a-zA-Z0-9]/.test(cat)
          ));
        }
      } catch (err) {
        console.error('Error fetching categories in footer:', err);
      }
    };
    fetchCats();
  }, []);

  const footerSections = [
    { title: "Shop", links: [
      { name: "All Products", path: "/products" },
      ...dynamicCategories.map(cat => ({
        name: cat,
        path: `/category/${encodeURIComponent(cat)}`
      }))
    ]},
    { title: "Customer Service", links: [
      { name: "Contact Us", path: "/contact" },
      { name: "Shipping Info", path: "/returns-shipping" },
      { name: "Returns & Exchanges", path: "/returns-shipping" },
      { name: "My Orders", path: "/orders" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "FAQ", path: "/contact" },
    ]},
    { title: "About", links: [
      { name: "Our Story", path: "/about" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ]},
  ];

  const socialLinks = [
    { label: "YouTube", icon: Youtube, url: "https://youtube.com/@jewelsandyou?si=mjFfnbMps5rt_kIX" },
    { label: "Instagram (Raw Material)", icon: Instagram, url: "https://www.instagram.com/_jewellery_raw_material?igsh=MTM1dGJ5c2J2ZWNvag==" },
    { label: "Instagram (Jewels & You)", icon: Instagram, url: "https://www.instagram.com/jewels_and_you_?igsh=MTBvZXNrMHlmNmo2cA==" },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await api.subscribeNewsletter(email);
        setSnackbarOpen(true);
        // We can use a proper global notification here if needed, 
        // but since setSnackbarOpen exists locally, we just use it.
        setTimeout(() => setSnackbarOpen(false), 3000);
        setEmail("");
      } catch (err) {
        alert(err.message || 'Failed to subscribe.');
      }
    }
  };

  return (
    <footer className="bg-brand-dark text-white/90 pt-16 pb-12 mt-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-brand-dark to-brand-dark opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Company info */}
          <div className="md:col-span-4">
            <div className="mb-6">
              <div className="inline-block bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 mb-4 shadow-inner">
                <img src={logo} alt="Logo" className="h-16 object-contain" />
              </div>
              <p className="text-sm text-white/60 leading-relaxed font-medium">
                Crafting timeless jewelry pieces that tell your unique story. From classic diamonds to contemporary designs, we bring you the finest quality jewelry that celebrates life's precious moments.
              </p>
            </div>

            <div className="space-y-3 text-sm font-medium text-white/70">
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-brand-gold" /><span>123 Jewelry Street, Luxury District, NY 10001</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-gold" /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-gold" /><span>info@jewelsandyou.com</span></div>
              <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-brand-gold" /><span>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</span></div>
            </div>

            <div className="mt-8 flex gap-3 flex-wrap">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 shadow-sm text-white"
                    aria-label={s.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="md:col-span-2 mt-8 md:mt-0">
              <div className="text-lg font-bold font-heading mb-4 text-white tracking-wide">{section.title}</div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-white/60 hover:text-brand-gold hover:translate-x-1 transition-all font-medium text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-3 mt-8 md:mt-0">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-lg font-bold font-heading mb-2 text-white">Join Our Newsletter</div>
              <p className="text-sm text-white/60 mb-5 font-medium leading-relaxed">Subscribe to get special offers, free giveaways, and updates on new collections.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-gold focus:outline-none focus:bg-white/15 transition-all text-sm font-medium shadow-inner"
                />
                <button type="submit" className="rounded-xl bg-brand-gold hover:bg-brand-gold/90 px-4 py-3 font-bold text-brand-dark text-xs uppercase tracking-widest shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] hover:-translate-y-0.5 transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-white/40 pt-2">
          <div>© {new Date().getFullYear()} Jewels And You. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <span className="hover:text-brand-gold cursor-pointer transition-colors" onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span className="hover:text-brand-gold cursor-pointer transition-colors" onClick={() => navigate('/terms')}>Terms of Service</span>
          </div>
        </div>
      </div>

      {snackbarOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-3 rounded-md shadow-lg text-white bg-emerald-600">Thank you for subscribing to our newsletter!</div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
