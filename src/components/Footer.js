import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
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
      { name: "Craftsmanship", path: "/about" },
      { name: "Sustainability", path: "/about" },
      { name: "Press", path: "/about" },
      { name: "Careers", path: "/about" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ]},
  ];

  const socialLinks = [
    { label: "Facebook", icon: Facebook, url: "https://facebook.com/jewelsandyou" },
    { label: "Twitter", icon: Twitter, url: "https://twitter.com/jewelsandyou" },
    { label: "Instagram", icon: Instagram, url: "https://instagram.com/jewelsandyou" },
    { label: "YouTube", icon: Youtube, url: "https://youtube.com/@jewelsandyou" },
    { label: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/jewelsandyou" },
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
    <footer className="bg-brand-tealDark text-white pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Company info */}
          <div className="md:col-span-4">
            <div className="mb-3">
              <div className="text-3xl font-bold mb-2  ">JewelsAndYou</div>
              <p className="text-sm opacity-80 leading-relaxed">
                Crafting timeless jewelry pieces that tell your unique story. From classic diamonds to contemporary designs, we bring you the finest quality jewelry that celebrates life's precious moments.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4  " /><span>123 Jewelry Street, Luxury District, NY 10001</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4  " /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4  " /><span>info@jewelsandyou.com</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4  " /><span>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</span></div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 inline-flex items-center justify-center rounded border border-white/20 hover:bg-brand-gold hover:text-brand-tealDark hover:border-brand-gold transition-all duration-200"
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
            <div key={section.title} className="md:col-span-2">
              <div className="text-lg font-bold mb-2  ">{section.title}</div>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-white/80 hover:  transition"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-3">
            <div className="text-lg font-bold mb-2  ">Newsletter</div>
            <p className="text-sm opacity-80 mb-3">Subscribe to get special offers, free giveaways, and updates on new collections.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md px-3 py-2 bg-transparent border border-white/30 placeholder-white/70 focus:outline-none"
              />
              <button type="submit" className="rounded-md bg-brand-gold px-4 py-2 font-semibold text-black">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="my-6 h-px  bg-brand-tealDark/20" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm opacity-80">
          <div>© 2024 JewelsAndYou. All rights reserved.</div>
          <div className="flex gap-4 flex-wrap">
            <button className="hover: ">Privacy Policy</button>
            <button className="hover: ">Terms of Service</button>
            <button className="hover: ">Cookie Policy</button>
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
