import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gem, Truck, Undo2, ArrowRight, Heart, Sparkles, ChevronRight, Lock, Instagram, Facebook, Youtube, Star } from "lucide-react";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";
import { CategorySkeleton, TestimonialSkeleton } from "../components/LoadingSpinner";
import api from "../services/api";
import slideImg1 from '../Assets/Jevel1.jpg';
import slideImg2 from '../Assets/Jevel2.jpg';
import slideImg3 from '../Assets/Jevel3.jpg';
import ProductCard from '../components/ProductCard';

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
        className="text-brand-dark/70 max-w-2xl mx-auto"
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

  const heroSlides = [
    {
      title: "Timeless",
      highlight: "Elegance",
      subtitle: "Collection",
      description: "Discover handcrafted pieces that celebrate life's most precious moments with breathtaking brilliance.",
      image: slideImg1,
      gradient: "from-brand-light via-brand-cream to-brand-light"
    },
    {
      title: "Exquisite",
      highlight: "Bridal",
      subtitle: "Sets",
      description: "Make your special day unforgettable with our premium bespoke bridal collections.",
      image: slideImg2,
      gradient: "from-[#FDFBF7] via-[#F4EDE4] to-[#FDFBF7]"
    },
    {
      title: "Modern",
      highlight: "Luxury",
      subtitle: "Essentials",
      description: "Elevate your everyday style with our chic and contemporary gold and diamond essentials.",
      image: slideImg3,
      gradient: "from-[#FCF9F2] via-[#F9F0E5] to-[#FCF9F2]"
    }
  ];

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

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

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

  const activeSlide = heroSlides[heroIdx];

  return (
    <div className="overflow-hidden">

      {/* ══════════ PREMIUM STATIC HERO SLIDER ══════════ */}
      <section
        className={`relative min-h-[85vh] flex items-center text-brand-dark bg-gradient-to-br ${activeSlide.gradient} transition-all duration-[2000ms]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(203,132,60,0.08),transparent_60%)]" />

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={heroIdx}
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold px-3 py-1 mb-4 border border-brand-gold/30 backdrop-blur-sm"
                >
                  <Sparkles className="w-3 h-3" /> New Collection 2024
                </motion.span>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-[#523c2d]">
                  {activeSlide.title} <span className="text-brand-gold">{activeSlide.highlight}</span> <br/>
                  {activeSlide.subtitle}
                </h1>

                <p className="text-lg text-brand-dark/80 mb-6 max-w-lg leading-relaxed">
                  {activeSlide.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <ShimmerButton
                    onClick={() => navigate("/products")}
                    className="bg-brand-gold text-white px-7 py-3.5 text-base shadow-lg shadow-brand-gold/30 hover:bg-brand-gold/90"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </ShimmerButton>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/about")}
                    className="rounded-lg border-2 border-brand-dark/20 px-7 py-3.5 font-semibold text-brand-dark hover:bg-white/50 backdrop-blur-sm transition"
                  >
                    Our Story
                  </motion.button>
                </div>

                {/* trust stats */}
                <div className="mt-10 flex gap-8">
                  {[
                    { value: "500+", label: "Premium Designs" },
                    { value: "10K+", label: "Happy Customers" },
                    { value: "4.9★", label: "Avg. Rating" },
                  ].map((s, i) => (
                    <div key={s.label}>
                      <div className="text-2xl font-bold text-brand-gold">{s.value}</div>
                      <div className="text-xs text-brand-dark/70 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* right side beautiful image presentation */}
              <div className="hidden md:flex justify-center relative">
                <div className="relative w-[380px] h-[480px] rounded-[2rem] p-3 bg-white/40 backdrop-blur-md shadow-2xl border border-white/60">
                  <img 
                    src={activeSlide.image} 
                    alt={activeSlide.title} 
                    className="w-full h-full object-cover rounded-[1.5rem] shadow-inner"
                  />
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-brand-gold/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/15 flex items-center justify-center">
                        <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-brand-dark">Premium Quality</div>
                        <div className="text-[10px] text-brand-dark/60">Certified Diamonds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIdx(idx)}
                className={`transition-all duration-300 rounded-full ${
                  heroIdx === idx ? "w-8 h-2 bg-brand-gold" : "w-2 h-2 bg-brand-gold/30 hover:bg-brand-gold/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ TRUST MARQUEE ══════════ */}
      <div className="bg-brand-light border-y border-brand-gold/10 py-3 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-6 text-sm text-brand-gold/70 font-medium tracking-wide">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ CATEGORIES ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <SectionHeading
          badge="Collections"
          title="Shop by Category"
          subtitle="Browse our curated collections of handcrafted jewelry"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categoryCards.map((cat, i) => (
              <motion.button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative rounded-[2rem] overflow-hidden text-center bg-white border border-brand-gold/15 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-brand-gold/30 transition-all duration-500 h-40 sm:h-52"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
              >
                {cat.image ? (
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#FDFBF7] flex items-center justify-center">
                    <Gem className="w-8 h-8 text-brand-gold/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-5 pb-6">
                  <div className="font-heading font-bold text-lg md:text-xl text-white tracking-wide mb-1 group-hover:text-brand-gold transition-colors">{cat.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/80 font-semibold group-hover:text-white transition-colors">
                    {cat.count > 0 ? `${cat.count} items` : "Explore"}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US ══════════ */}
      <section className="py-20 md:py-24 bg-white border-y border-brand-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Why Us"
            title="Why Choose JewelsAndYou?"
            subtitle="We bring you the finest jewelry experience"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  className="group text-center p-8 bg-[#FDFBF7] rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/10 hover:border-brand-gold/20 transition-all duration-500"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-inner border border-brand-gold/15 mb-6 group-hover:bg-brand-gold transition-colors duration-500">
                    <Icon className="w-8 h-8 text-brand-gold group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="font-bold font-heading text-lg text-brand-dark mb-2">{f.title}</div>
                  <div className="text-sm font-medium text-brand-dark/60 leading-relaxed">{f.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED PRODUCTS ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <SectionHeading
          badge="Bestsellers"
          title="Featured Collections"
          subtitle="Our most loved pieces, handpicked for you"
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[2rem] bg-white border border-brand-gold/10 animate-pulse">
                <div className="h-60 bg-[#FDFBF7] rounded-t-[2rem]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-brand-dark/5 rounded w-3/4" />
                  <div className="h-3 bg-brand-dark/5 rounded w-1/2" />
                  <div className="h-5 bg-brand-dark/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-[2rem] bg-[#FDFBF7] border border-brand-gold/15 shadow-inner">
            <Gem className="w-16 h-16 text-brand-gold/30 mx-auto mb-4" />
            <p className="text-brand-dark/60 font-medium">Products coming soon! Stay tuned for our collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onToggleFavorite={onToggleFavorite} 
                  isFavorite={favorites.includes(product._id || product.id)} 
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <ShimmerButton
            onClick={() => navigate("/products")}
            className="bg-brand-gold text-white px-8 py-3.5 shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)] hover:-translate-y-1 transition-all text-sm uppercase tracking-widest"
          >
            View All Products
          </ShimmerButton>
        </div>
      </section>

      {/* ══════════ SPOTLIGHT / NEW ARRIVALS ══════════ */}
      {spotlightProduct && (
        <section className="py-20 bg-[#FDFBF7] relative overflow-hidden border-t border-brand-gold/10">
          <div className="absolute -left-40 top-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              badge="New Arrivals"
              title="Just Landed"
              subtitle="The latest additions to our collection"
            />
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                className="relative rounded-[2.5rem] overflow-hidden h-[450px] cursor-pointer group shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-white"
                onClick={() => navigate(`/product/${spotlightProduct._id || spotlightProduct.id}`)}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <ImageWithFallback
                  src={spotlightProduct.image}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 mb-3 shadow-sm">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">{spotlightProduct.name}</h3>
                  <p className="text-white/80 text-sm font-medium">{spotlightProduct.description}</p>
                </div>
              </motion.div>

              <div className="space-y-5">
                {newArrivals.slice(0, 3).map((product, i) => (
                  <motion.div
                    key={product._id || product.id}
                    className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-brand-gold/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.06)] hover:border-brand-gold/30 cursor-pointer transition-all duration-300"
                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 6 }}
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FDFBF7]">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-bold font-heading text-brand-dark text-base truncate mb-1">{product.name}</h4>
                      <p className="text-xs text-brand-dark/50 font-medium truncate mb-2">{product.description}</p>
                      <div className="text-brand-gold font-bold">₹{product.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FDFBF7] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5 text-brand-gold" />
                    </div>
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
                className="p-8 bg-white rounded-[2rem] border border-brand-gold/15 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-brand-gold/30 transition-all duration-500"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full ring-2 ring-brand-gold/20 shadow-sm" />
                  <div>
                    <div className="font-bold font-heading text-brand-dark">{t.name}</div>
                    <div className="flex text-brand-gold text-xs mt-1">
                      {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-brand-dark/70 italic leading-relaxed">"{t.comment}"</p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* ══════════ INSTAGRAM / SOCIAL PROOF ══════════ */}
      <section className="py-20 bg-[#FDFBF7] relative overflow-hidden border-y border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Social"
            title="Follow Us @jewelsandyou"
            subtitle="Join our community and get inspired"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...products.slice(0, 3), ...Array(Math.max(0, 3 - products.length)).fill(null)].slice(0, 3).map((p, i) => {
              const socials = [
                { icon: Youtube, url: "https://youtube.com/@jewelsandyou?si=mjFfnbMps5rt_kIX", color: "text-brand-dark hover:text-red-500" },
                { icon: Instagram, url: "https://www.instagram.com/_jewellery_raw_material?igsh=MTM1dGJ5c2J2ZWNvag==", color: "text-brand-dark hover:text-pink-500" },
                { icon: Instagram, url: "https://www.instagram.com/jewels_and_you_?igsh=MTBvZXNrMHlmNmo2cA==", color: "text-brand-dark hover:text-pink-500" },
              ];
              const SocialIcon = socials[i].icon;
              return (
              <motion.a
                href={socials[i].url}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.05)] group cursor-pointer relative block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {p && p.image ? (
                  <>
                    <ImageWithFallback src={p.image} alt={p.name || "Jewelry"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-brand-gold/20 flex items-center justify-center">
                        <SocialIcon className={`w-8 h-8 transition-colors duration-300 ${socials[i].color}`} />
                      </div>
                      <span className="text-brand-dark font-bold tracking-widest uppercase text-xs">Follow Us</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FDFBF7] relative">
                    <Gem className="w-12 h-12 text-brand-gold/20" />
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-brand-gold/20 flex items-center justify-center">
                        <SocialIcon className={`w-8 h-8 transition-colors duration-300 ${socials[i].color}`} />
                      </div>
                      <span className="text-brand-dark font-bold tracking-widest uppercase text-xs">Follow Us</span>
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
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative rounded-[3rem] p-10 md:p-16 bg-white border border-brand-gold/15 shadow-[0_20px_60px_rgb(0,0,0,0.06)] overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-gold/5 -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-gold/5 translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative z-10 text-center">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FDFBF7] text-brand-gold text-xs font-bold uppercase tracking-widest px-4 py-2 mb-6 border border-brand-gold/20 shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Exclusive Offers
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-brand-dark">Stay in the Sparkle</h2>
              <p className="text-brand-dark/70 font-medium mb-10 max-w-lg mx-auto leading-relaxed">Subscribe for exclusive offers, early access to new collections, and styling tips.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-2xl border border-brand-dark/10 bg-[#FDFBF7] px-6 py-4 placeholder-brand-dark/40 focus:outline-none focus:border-brand-gold/50 focus:bg-white shadow-inner transition-all font-medium text-brand-dark"
                />
                <ShimmerButton
                  type="submit"
                  className="bg-brand-gold text-white px-8 py-4 rounded-2xl shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)] text-sm font-bold tracking-widest uppercase"
                >
                  Subscribe
                </ShimmerButton>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-20 md:py-24 bg-white border-t border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-brand-dark">Ready to Find Your Perfect Piece?</h2>
            <p className="text-brand-dark/70 font-medium mb-10 max-w-xl mx-auto leading-relaxed">Explore our collection and discover jewelry that speaks to your soul.</p>
            <ShimmerButton
              onClick={() => navigate("/products")}
              className="bg-brand-dark text-white px-10 py-5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 text-sm font-bold tracking-widest uppercase"
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
