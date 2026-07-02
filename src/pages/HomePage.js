import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gem, Truck, Lock, Undo2 } from "lucide-react";
import { ImageWithFallback } from "../utils/imageUtils";
import { CategorySkeleton, TestimonialSkeleton } from "../components/LoadingSpinner";

const HomePage = ({ products, onAddToCart, onToggleFavorite, favorites = [], loading = false }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const featuredProducts = products.slice(0, 6);

  const features = [
    { icon: Gem, title: "Premium Quality", description: "Handcrafted jewelry using the finest materials and gemstones" },
    { icon: Truck, title: "Free Shipping", description: "Complimentary shipping on all orders over $500" },
    { icon: Lock, title: "Secure Payment", description: "100% secure payment processing and buyer protection" },
    { icon: Undo2, title: "Easy Returns", description: "30-day return policy with free return shipping" },
  ];

  const categories = [
    { name: "Rings", image: products.find(p => p.category === "Rings")?.image || "Jevel1.jpg", count: products.filter((p) => p.category === "Rings").length },
    { name: "Necklaces", image: products.find(p => p.category === "Necklaces")?.image || "Jevel2.jpg", count: products.filter((p) => p.category === "Necklaces").length },
    { name: "Earrings", image: products.find(p => p.category === "Earrings")?.image || "Jevel3.jpg", count: products.filter((p) => p.category === "Earrings").length },
    { name: "Watches", image: products.find(p => p.category === "Watches")?.image || "Jevel4.jpg", count: products.filter((p) => p.category === "Watches").length },
  ];

  const testimonials = [
    { name: "Sarah Johnson", rating: 5, comment: "The diamond ring I purchased exceeded my expectations. The quality is exceptional!", image: products[0]?.image || "Jevel5.jpg" },
    { name: "Michael Chen", rating: 5, comment: "Amazing customer service and beautiful jewelry. Highly recommend!", image: products[1]?.image || "Jevel6.jpg" },
    { name: "Emma Davis", rating: 5, comment: "Perfect gift for my anniversary. The craftsmanship is outstanding.", image: products[2]?.image || "Jevel7.jpg" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 3000);
      setEmail("");
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate("/products", { state: { selectedCategory: categoryName } });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center text-brand-off">
        <div className="absolute inset-0 bg-brand-teal" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),rgba(0,0,0,0))]" />
        <motion.div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Exquisite Jewellery Collection</motion.h1>
          <motion.h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 opacity-90" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>Discover our handcrafted pieces of timeless beauty</motion.h2>
          <motion.p className="max-w-2xl mx-auto opacity-90 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            From classic diamonds to contemporary designs, find your perfect piece that tells your unique story
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={() => navigate("/products")} className="rounded-md bg-brand-gold text-brand-tealDark px-6 py-3 font-semibold">
              Shop Now
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={() => navigate("/about")} className="rounded-md border border-brand-off/80 px-6 py-3 font-semibold text-brand-off hover: bg-brand-tealDark/10">
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          ) : (
            categories.map((category) => (
              <motion.button key={category.name} onClick={() => handleCategoryClick(category.name)} className="relative h-72 rounded-lg overflow-hidden shadow-sm group" whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <ImageWithFallback 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{category.name}</div>
                    <div className="text-sm opacity-90">{category.count} items</div>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-brand-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading text-brand-off font-bold text-center mb-8">Why Choose JewelsAndYou?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} className="h-full text-center p-6 bg-brand-tealDark/90 backdrop-blur rounded-lg shadow-sm border border-brand-gold/20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} whileHover={{ y: -8 }}>
                  <div className="flex justify-center mb-2">
                    <Icon className="w-8 h-8 text-brand-gold" />
                  </div>
                    <div className="font-semibold text-brand-off mb-1">{f.title}</div>
                    <div className="text-sm text-brand-off/80">{f.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-full rounded-lg overflow-hidden shadow-sm bg-brand-tealDark animate-pulse">
                <div className="h-64 w-full bg-brand-off/20" />
                <div className="p-4">
                  <div className="h-4 bg-brand-off/20 rounded mb-2" />
                  <div className="h-3 bg-brand-off/20 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-brand-off/20 rounded mb-2 w-1/2" />
                  <div className="h-6 bg-brand-off/20 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <motion.div key={product._id || product.id} className="h-full rounded-lg overflow-hidden shadow-sm  bg-brand-tealDark cursor-pointer" onClick={() => navigate(`/product/${product._id || product.id}`)} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
                <ImageWithFallback 
                  src={product.image} 
                  alt={product.name} 
                  className="h-64 w-full object-cover" 
                />
                <div className="p-4">
                  <div className="font-bold mb-1">{product.name}</div>
                  <div className="text-sm text-slate-600 mb-2">{product.description}</div>
                  <div className="flex items-center mb-2 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i + 1 <= Math.round(product.rating || 5) ? '★' : '☆'}</span>
                    ))}
                    <span className="ml-2 text-xs text-slate-600">({product.rating || 5})</span>
                  </div>
                  <div className="text-lg font-bold text-brand-gold">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div className="text-center mt-6">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={() => navigate("/products")} className="rounded-md bg-brand-gold text-brand-tealDark px-6 py-3 font-semibold">
            View All Products
          </motion.button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-brand-tealDark text-brand-off">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Stay Updated</h2>
          <p className="text-center opacity-90 mb-6">Subscribe to our newsletter for exclusive offers and new arrivals</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-md border border-white/50  bg-brand-tealDark/10 px-3 py-2 placeholder-white/80 focus:outline-none"
            />
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="rounded-md bg-brand-gold text-brand-tealDark font-semibold px-6 py-2">
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TestimonialSkeleton key={index} />
            ))
          ) : (
            testimonials.map((t) => (
              <motion.div key={t.name} className="p-6  bg-brand-tealDark rounded-lg shadow-sm text-center" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} whileHover={{ y: -6 }}>
                <ImageWithFallback 
                  src={t.image} 
                  alt={t.name} 
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3" 
                />
                <div className="text-yellow-500 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i + 1 <= t.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <p className="italic mb-2">"{t.comment}"</p>
                <div className="font-semibold">{t.name}</div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-brand-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Ready to Find Your Perfect Piece?</h2>
          <p className="opacity-80 mb-4">Explore our collection and discover jewelry that speaks to your soul</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={() => navigate("/products")} className="rounded-md bg-brand-gold text-brand-tealDark px-8 py-3 font-semibold">
              Start Shopping
          </motion.button>
        </div>
      </section>

      {/* Snackbar */}
      {snackbarOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-3 rounded-md shadow-lg text-white bg-emerald-600">Thank you for subscribing to our newsletter!</div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
