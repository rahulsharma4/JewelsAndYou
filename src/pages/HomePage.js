import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gem, Truck, Undo2, ArrowRight, Heart, Sparkles, ChevronRight, Lock, Instagram, Facebook, Youtube, Star } from "lucide-react";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";
import { CategorySkeleton, TestimonialSkeleton } from "../components/LoadingSpinner";
import api from "../services/api";

/* ───────── tiny reusable shimmer button ───────── */
const ShimmerButton = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className={`relative overflow-hidden rounded-lg font-semibold transition-all ${className}`}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2 justify-center">{children}</span>
    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </motion.button>
);

/* ───────── section heading ───────── */
const SectionHeading = ({ badge, title, subtitle }) => (
  <div className="text-center mb-10">
    {badge && (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold px-3 py-1 mb-3 border border-brand-gold/20"
      >
        <Sparkles className="w-3 h-3" /> {badge}
      </motion.span>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 }}
      className="text-3xl md:text-4xl font-heading font-bold mb-2"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="text-brand-off/70 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const HomePage = ({ products, onAddToCart, onToggleFavorite, favorites = [], loading = false }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSiteSettings(data);
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  /* rotate hero background colour when there are no images */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const featuredProducts = products.slice(0, 8);
  const newArrivals = [...products].reverse().slice(0, 4);
  const spotlightProduct = products[0];

  const features = [
    { icon: Gem, title: "Premium Quality", description: "Handcrafted with the finest materials & gemstones" },
    { icon: Truck, title: "Free Shipping", description: "Complimentary delivery on orders over ₹49,999" },
    { icon: Lock, title: "Secure Payment", description: "100% encrypted checkout & buyer protection" },
    { icon: Undo2, title: "Easy Returns", description: "30-day hassle-free return & exchange policy" },
  ];

  const dynamicCategories = Array.from(
    new Set(
      products
        .map(p => p.category)
        .filter(cat => typeof cat === 'string' && cat.trim() !== '' && /[a-zA-Z0-9]/.test(cat))
    )
  ).sort();

  const categoryCards = dynamicCategories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const repProduct = catProducts.find(p => p.image) || catProducts[0];
    return {
      name: cat,
      count: catProducts.length,
      image: repProduct?.image || null
    };
  });

  const testimonials = [
    { name: "Sarah Johnson", rating: 5, comment: "The diamond ring I purchased exceeded my expectations. Absolutely stunning craftsmanship!", avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff&size=150" },
    { name: "Michael Chen", rating: 5, comment: "Amazing customer service and beautiful jewelry. My wife was thrilled with the necklace!", avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=F59E0B&color=fff&size=150" },
    { name: "Emma Davis", rating: 5, comment: "Perfect anniversary gift. The quality is outstanding and delivery was prompt.", avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=10B981&color=fff&size=150" },
    { name: "Priya Sharma", rating: 5, comment: "I've ordered multiple pieces and every single one has been exquisite. Highly recommend!", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=8B5CF6&color=fff&size=150" },
  ];

  const marqueeItems = [
    "✦ Handcrafted Jewelry",
    "✦ GIA Certified Diamonds",
    "✦ Free Insured Shipping",
    "✦ Lifetime Warranty",
    "✦ Ethical Sourcing",
    "✦ 30-Day Returns",
    "✦ Custom Designs",
    "✦ Expert Craftsmanship",
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await api.subscribeNewsletter(email);
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 3000);
        setEmail("");
      } catch (err) {
        alert(err.message || 'Failed to subscribe.');
      }
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate("/products", { state: { selectedCategory: categoryName } });
  };

  const heroGradients = [
    "from-brand-tealDark via-brand-teal to-brand-tealDark",
    "from-brand-tealDark via-emerald-900 to-brand-tealDark",
    "from-brand-tealDark via-slate-800 to-brand-tealDark",
  ];

  const heroImage = siteSettings?.hero?.image
    ? getImageUrl(siteSettings.hero.image)
    : null;

  return (
    <div className="overflow-hidden">

      {/* ══════════ HERO ══════════ */}
      <section
        className={`relative min-h-[85vh] flex items-center text-brand-off bg-gradient-to-br ${heroGradients[heroIdx]} transition-all duration-[2000ms]`}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-black/50" />}
        {!heroImage && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,106,0.12),transparent_60%)]" />}

        {/* floating sparkle dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-brand-gold/40"
              style={{ top: `${15 + i * 14}%`, left: `${10 + i * 15}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold px-3 py-1 mb-4 border border-brand-gold/30 backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3" /> New Collection 2024
              </motion.span>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                {siteSettings?.hero?.title || (
                  <>Exquisite <span className="text-brand-gold">Jewellery</span> Collection</>
                )}
              </h1>

              <p className="text-lg text-brand-off/80 mb-6 max-w-lg leading-relaxed">
                {siteSettings?.hero?.description || "From classic diamonds to contemporary designs, discover handcrafted pieces that celebrate life's most precious moments."}
              </p>

              <div className="flex flex-wrap gap-3">
                <ShimmerButton
                  onClick={() => navigate("/products")}
                  className="bg-brand-gold text-brand-tealDark px-7 py-3.5 text-base shadow-lg shadow-brand-gold/20"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/about")}
                  className="rounded-lg border border-brand-off/30 px-7 py-3.5 font-semibold text-brand-off hover:bg-white/5 backdrop-blur-sm transition"
                >
                  Our Story
                </motion.button>
              </div>

              {/* trust stats */}
              <div className="mt-8 flex gap-8">
                {[
                  { value: "500+", label: "Products" },
                  { value: "10K+", label: "Happy Customers" },
                  { value: "4.9★", label: "Avg. Rating" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-brand-gold">{s.value}</div>
                    <div className="text-xs text-brand-off/60">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* right side decorative card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/20 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/10 flex items-center justify-center">
                    <div className="text-center">
                      <Gem className="w-16 h-16 text-brand-gold mx-auto mb-3" />
                      <div className="font-heading text-2xl font-bold text-brand-off">JewelsAndYou</div>
                      <div className="text-sm text-brand-off/60 mt-1">Since 2020</div>
                    </div>
                  </div>
                </div>
                {/* orbiting dots */}
                <motion.div
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-lg">💍</span>
                </motion.div>
                <motion.div
                  className="absolute bottom-8 left-0 w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <span className="text-lg">💎</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ TRUST MARQUEE ══════════ */}
      <div className="bg-brand-tealDark border-y border-brand-gold/10 py-3 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-6 text-sm text-brand-gold/70 font-medium tracking-wide">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ CATEGORIES ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          badge="Collections"
          title="Shop by Category"
          subtitle="Browse our curated collections of handcrafted jewelry"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categoryCards.map((cat, i) => (
              <motion.button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative rounded-xl overflow-hidden text-center bg-brand-tealDark border border-brand-gold/10 hover:border-brand-gold/40 transition-all duration-300 h-32 sm:h-40"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(201,168,106,0.15)" }}
              >
                {cat.image ? (
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-tealDark/50 flex items-center justify-center">
                    <Gem className="w-8 h-8 text-brand-gold/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-5">
                  <div className="font-heading font-bold text-lg text-brand-off tracking-wide mb-0.5">{cat.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold">
                    {cat.count > 0 ? `${cat.count} items` : "Explore"}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US ══════════ */}
      <section className="py-16 bg-gradient-to-b from-brand-teal/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Us"
            title="Why Choose JewelsAndYou?"
            subtitle="We bring you the finest jewelry experience"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  className="group text-center p-6 bg-brand-tealDark/90 backdrop-blur rounded-xl border border-brand-gold/10 hover:border-brand-gold/30 transition-all"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-gold/10 mb-4 group-hover:bg-brand-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  <div className="font-semibold text-brand-off mb-1">{f.title}</div>
                  <div className="text-sm text-brand-off/60 leading-relaxed">{f.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED PRODUCTS ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          badge="Bestsellers"
          title="Featured Collections"
          subtitle="Our most loved pieces, handpicked for you"
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-brand-tealDark animate-pulse">
                <div className="h-60 bg-brand-off/10 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-brand-off/10 rounded w-3/4" />
                  <div className="h-3 bg-brand-off/10 rounded w-1/2" />
                  <div className="h-5 bg-brand-off/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-brand-tealDark/50 border border-brand-gold/10">
            <Gem className="w-12 h-12 text-brand-gold/40 mx-auto mb-3" />
            <p className="text-brand-off/60">Products coming soon! Stay tuned for our collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product._id || product.id}
                className="group rounded-xl overflow-hidden bg-brand-tealDark border border-brand-gold/10 hover:border-brand-gold/30 cursor-pointer transition-all"
                onClick={() => navigate(`/product/${product._id || product.id}`)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
              >
                <div className="relative h-60 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* quick actions on hover */}
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                      className="flex-1 bg-brand-gold text-brand-tealDark text-xs font-semibold py-2 rounded-lg backdrop-blur-sm hover:bg-brand-gold/90 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(product._id || product.id); }}
                      className="w-9 h-9 flex items-center justify-center bg-brand-tealDark/80 rounded-lg backdrop-blur-sm border border-brand-off/20 hover:bg-brand-tealDark transition"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(product._id || product.id) ? 'fill-red-500 text-red-500' : 'text-brand-off'}`} />
                    </button>
                  </div>

                  {/* category badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand-tealDark/80 text-brand-gold border border-brand-gold/20 backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-500 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < Math.round(product.rating || 5) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-brand-off/50">({product.rating || 5})</span>
                  </div>
                  <div className="text-brand-gold font-bold">₹{product.price?.toLocaleString('en-IN')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <ShimmerButton
            onClick={() => navigate("/products")}
            className="bg-brand-gold text-brand-tealDark px-8 py-3 shadow-lg shadow-brand-gold/10"
          >
            View All Products <ChevronRight className="w-4 h-4" />
          </ShimmerButton>
        </div>
      </section>

      {/* ══════════ SPOTLIGHT / NEW ARRIVALS ══════════ */}
      {spotlightProduct && (
        <section className="py-16 bg-gradient-to-b from-brand-teal/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="New Arrivals"
              title="Just Landed"
              subtitle="The latest additions to our collection"
            />
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="relative rounded-2xl overflow-hidden h-96 cursor-pointer group"
                onClick={() => navigate(`/product/${spotlightProduct._id || spotlightProduct.id}`)}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <ImageWithFallback
                  src={spotlightProduct.image}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/90 text-brand-tealDark text-xs font-bold px-3 py-1 mb-2">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                  <h3 className="text-2xl font-heading font-bold text-white">{spotlightProduct.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{spotlightProduct.description}</p>
                </div>
              </motion.div>

              <div className="space-y-4">
                {newArrivals.slice(0, 3).map((product, i) => (
                  <motion.div
                    key={product._id || product.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-brand-tealDark border border-brand-gold/10 hover:border-brand-gold/30 cursor-pointer transition-all"
                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-brand-off/50 truncate">{product.description}</p>
                      <div className="text-brand-gold font-bold text-sm mt-1">₹{product.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-off/30 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          badge="Reviews"
          title="What Our Customers Say"
          subtitle="Real stories from happy customers around the world"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <TestimonialSkeleton key={i} />)
          ) : (
            testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="p-6 bg-brand-tealDark rounded-xl border border-brand-gold/10 hover:border-brand-gold/25 transition-all"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full ring-2 ring-brand-gold/20" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="flex text-yellow-500 text-xs">
                      {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-brand-off/70 italic leading-relaxed">"{t.comment}"</p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* ══════════ INSTAGRAM / SOCIAL PROOF ══════════ */}
      <section className="py-16 bg-gradient-to-b from-brand-teal/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Social"
            title="Follow Us @jewelsandyou"
            subtitle="Join our community and get inspired"
          />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[...products.slice(0, 6), ...Array(Math.max(0, 6 - products.length)).fill(null)].slice(0, 6).map((p, i) => {
              const socials = [
                { icon: Instagram, url: "https://instagram.com", color: "hover:text-pink-500" },
                { icon: Facebook, url: "https://facebook.com", color: "hover:text-blue-500" },
                { icon: Youtube, url: "https://youtube.com", color: "hover:text-red-500" },
                { icon: Instagram, url: "https://instagram.com", color: "hover:text-pink-500" },
                { icon: Facebook, url: "https://facebook.com", color: "hover:text-blue-500" },
                { icon: Youtube, url: "https://youtube.com", color: "hover:text-red-500" },
              ];
              const SocialIcon = socials[i].icon;
              return (
              <motion.a
                href={socials[i].url}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-brand-tealDark border border-brand-gold/10 group cursor-pointer relative block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {p && p.image ? (
                  <>
                    <ImageWithFallback src={p.image} alt={p.name || "Jewelry"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-brand-tealDark/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <SocialIcon className={`w-8 h-8 text-white transition-colors duration-300 ${socials[i].color}`} />
                      <span className="text-white text-xs font-semibold tracking-wider uppercase">Follow Us</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-tealDark group-hover:bg-brand-tealDark/80 transition-colors relative">
                    <Gem className="w-8 h-8 text-brand-gold/20" />
                    <div className="absolute inset-0 bg-brand-tealDark/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <SocialIcon className={`w-8 h-8 text-white transition-colors duration-300 ${socials[i].color}`} />
                      <span className="text-white text-xs font-semibold tracking-wider uppercase">Follow Us</span>
                    </div>
                  </div>
                )}
              </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ NEWSLETTER ══════════ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative rounded-2xl p-8 md:p-12 bg-gradient-to-br from-brand-tealDark to-brand-teal border border-brand-gold/15 overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-brand-gold/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-brand-gold/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold px-3 py-1 mb-4 border border-brand-gold/20"
              >
                <Sparkles className="w-3 h-3" /> Exclusive Offers
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Stay in the Sparkle</h2>
              <p className="text-brand-off/70 mb-6 max-w-md mx-auto">Subscribe for exclusive offers, early access to new collections, and styling tips.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-lg border border-brand-off/20 bg-brand-tealDark/50 px-4 py-3 placeholder-brand-off/40 focus:outline-none focus:border-brand-gold/50 backdrop-blur-sm transition"
                />
                <ShimmerButton
                  type="submit"
                  className="bg-brand-gold text-brand-tealDark px-6 py-3"
                >
                  Subscribe
                </ShimmerButton>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-16 bg-gradient-to-b from-brand-teal/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Ready to Find Your Perfect Piece?</h2>
            <p className="text-brand-off/70 mb-6 max-w-xl mx-auto">Explore our collection and discover jewelry that speaks to your soul</p>
            <ShimmerButton
              onClick={() => navigate("/products")}
              className="bg-brand-gold text-brand-tealDark px-10 py-4 text-lg shadow-xl shadow-brand-gold/15"
            >
              Start Shopping <ArrowRight className="w-5 h-5" />
            </ShimmerButton>
          </motion.div>
        </div>
      </section>

      {/* ══════════ SNACKBAR ══════════ */}
      <AnimatePresence>
        {snackbarOpen && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-5 py-3 rounded-xl shadow-2xl text-white bg-emerald-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Thank you for subscribing to our newsletter!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
