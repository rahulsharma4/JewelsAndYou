import React from "react";
import { motion } from "framer-motion";
import { Gem, Heart, Users, Star, Trophy, Building } from "lucide-react";

const AboutPage = () => {
  /*
  const teamMembers = [
    { name: "Sarah Johnson", position: "Founder & CEO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face", bio: "With over 15 years in the jewelry industry, Sarah founded JewelsAndYou with a vision to make luxury jewelry accessible to everyone." },
    { name: "Michael Chen", position: "Head Designer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", bio: "A master craftsman with a passion for creating unique pieces that tell stories and capture emotions." },
    { name: "Emma Davis", position: "Quality Assurance", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", bio: "Ensuring every piece meets our exacting standards for quality, craftsmanship, and beauty." },
  ];

  const milestones = [
    { year: "2010", title: "Company Founded", description: "Started with a small workshop and big dreams" },
    { year: "2015", title: "First Collection", description: "Launched our signature diamond collection" },
    { year: "2018", title: "Online Platform", description: "Expanded to e-commerce with our website" },
    { year: "2020", title: "International Reach", description: "Started shipping to customers worldwide" },
    { year: "2024", title: "Innovation Leader", description: "Pioneering sustainable luxury jewelry" },
  ];
  */

  const values = [
    { icon: Gem, title: "Excellence", description: "We never compromise on quality, ensuring every piece meets the highest standards." },
    { icon: Heart, title: "Passion", description: "Our love for jewelry drives us to create pieces that inspire and delight." },
    { icon: Users, title: "Community", description: "Building lasting relationships with our customers and craftsmen." },
    { icon: Star, title: "Innovation", description: "Continuously evolving our designs and techniques to stay ahead." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-white text-center py-20 border-b border-brand-gold/10">
        <motion.div className="max-w-4xl mx-auto px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-heading text-brand-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>About Jewels And You</motion.h1>
          <motion.p className="text-lg text-brand-dark/70 font-medium max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>Crafting timeless beauty with passion, precision, and purpose since 2010.</motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark">Our Story</h2>
            <div className="w-20 h-1 bg-brand-gold rounded-full" />
            <div className="space-y-4 text-brand-dark/70 font-medium leading-relaxed">
              <p>Founded in 2010, Jewels And You began as a small family workshop with a simple mission: to create beautiful jewelry that tells stories and captures emotions. What started as a passion project has grown into a beloved brand trusted by customers worldwide.</p>
              <p>Our journey has been guided by the belief that every piece of jewelry should be more than just an accessory – it should be a reflection of the wearer's personality, a celebration of life's special moments, and a treasure to be passed down through generations.</p>
              <p>Today, we continue to blend traditional craftsmanship with modern innovation, creating pieces that are both timeless and contemporary, luxurious and accessible.</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-brand-gold/10 relative">
              <img src="/api/placeholder/800/600" alt="Jewelry Crafting" className="object-cover w-full h-full opacity-60 mix-blend-overlay" />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-10 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-brand-gold/20 text-center max-w-xs"
            >
              <div className="flex justify-center mb-4"><Gem className="w-12 h-12 text-brand-gold" /></div>
              <div className="text-4xl font-bold font-heading text-brand-dark mb-1">14+ Years</div>
              <div className="text-brand-dark/60 font-semibold uppercase tracking-widest text-xs">of crafting excellence</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark">Our Values</h2>
            <div className="w-20 h-1 bg-brand-gold rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <motion.div 
                  key={v.title} 
                  className="h-full text-center p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-brand-gold/15" 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.4, delay: index * 0.1 }} 
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgb(0,0,0,0.1)" }}
                >
                  <div className="w-16 h-16 mx-auto bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 shadow-inner border border-brand-gold/10">
                    <Icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  <div className="font-bold font-heading text-xl text-brand-dark mb-3">{v.title}</div>
                  <div className="text-sm text-brand-dark/70 font-medium leading-relaxed">{v.description}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Awards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark">Awards & Recognition</h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="p-8 md:p-10 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/20 space-y-4" 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-brand-gold/15 shadow-inner">
                <Trophy className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="text-xl font-bold font-heading text-brand-dark">Excellence in Craftsmanship</div>
            </div>
            <div className="text-brand-dark/70 font-medium leading-relaxed">Recognized by the International Jewelry Design Association for our commitment to quality and innovative design techniques.</div>
          </motion.div>
          
          <motion.div 
            className="p-8 md:p-10 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/20 space-y-4"
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-brand-gold/15 shadow-inner">
                <Building className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="text-xl font-bold font-heading text-brand-dark">Customer Satisfaction</div>
            </div>
            <div className="text-brand-dark/70 font-medium leading-relaxed">Awarded the highest customer satisfaction rating in the luxury jewelry category for three consecutive years.</div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-brand-gold/10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-brand-gold/5 blur-3xl rounded-full" />
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-brand-dark">Join Our Story</h2>
          <p className="text-brand-gold font-bold uppercase tracking-widest text-sm">Discover the perfect piece</p>
          <p className="text-brand-dark/70 font-medium text-lg max-w-xl mx-auto leading-relaxed">Every piece we create is crafted with love, precision, and the hope that it will become a cherished part of your life's journey.</p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
