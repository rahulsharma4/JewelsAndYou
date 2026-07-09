import React from "react";
import { motion } from "framer-motion";
import { Gem, Heart, Users, Star, ScrollText, Trophy, Building } from "lucide-react";

const AboutPage = () => {
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

  const values = [
    { icon: Gem, title: "Excellence", description: "We never compromise on quality, ensuring every piece meets the highest standards." },
    { icon: Heart, title: "Passion", description: "Our love for jewelry drives us to create pieces that inspire and delight." },
    { icon: Users, title: "Community", description: "Building lasting relationships with our customers and craftsmen." },
    { icon: Star, title: "Innovation", description: "Continuously evolving our designs and techniques to stay ahead." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-tealDark text-brand-off text-center py-12">
        <motion.div className="max-w-5xl mx-auto px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.h1 className="text-4xl sm:text-5xl font-extrabold mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>About JewelsAndYou</motion.h1>
          <motion.p className="text-lg opacity-90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>Crafting timeless beauty with passion, precision, and purpose</motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-3">Our Story</h2>
            <p className="mb-3 text-brand-off/80">Founded in 2010, JewelsAndYou began as a small family workshop with a simple mission: to create beautiful jewelry that tells stories and captures emotions. What started as a passion project has grown into a beloved brand trusted by customers worldwide.</p>
            <p className="mb-3 text-brand-off/80">Our journey has been guided by the belief that every piece of jewelry should be more than just an accessory – it should be a reflection of the wearer's personality, a celebration of life's special moments, and a treasure to be passed down through generations.</p>
            <p className="text-brand-off/80">Today, we continue to blend traditional craftsmanship with modern innovation, creating pieces that are both timeless and contemporary, luxurious and accessible.</p>
          </div>
          <div>
          <div className="rounded-lg p-6 text-center  bg-brand-tealDark/90 backdrop-blur">
            <div className="flex justify-center mb-2"><Gem className="w-10 h-10 text-brand-gold" /></div>
              <div className="text-3xl font-bold">14+ Years</div>
              <div className="text-slate-600">of crafting excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 bg-brand-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} className="h-full text-center p-6 bg-brand-tealDark/90 backdrop-blur rounded-lg shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} whileHover={{ y: -8 }}>
                  <div className="flex justify-center mb-2"><Icon className="w-8 h-8 text-brand-gold" /></div>
                  <div className="font-semibold text-brand-off mb-1">{v.title}</div>
                  <div className="text-sm text-brand-off/80">{v.description}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Awards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Awards & Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="p-6 rounded-lg bg-brand-tealDark shadow-sm border border-brand-gold/20" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-brand-gold" />
              <div className="text-xl font-bold">Excellence in Craftsmanship</div>
            </div>
            <div className="text-brand-off/80">Recognized by the International Jewelry Design Association for our commitment to quality and innovative design techniques.</div>
          </motion.div>
          <div className="p-6 rounded-lg bg-brand-tealDark shadow-sm border border-brand-gold/20">
            <motion.div className="flex items-center gap-3 mb-2" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <Building className="w-8 h-8 text-brand-gold" />
              <div className="text-xl font-bold">Customer Satisfaction</div>
            </motion.div>
            <div className="text-brand-off/80">Awarded the highest customer satisfaction rating in the luxury jewelry category for three consecutive years.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-brand-teal/5 text-brand-off text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Join Our Story</h2>
          <p className="opacity-90 mb-2">Discover the perfect piece that tells your unique story</p>
          <p className="opacity-80">Every piece we create is crafted with love, precision, and the hope that it will become a cherished part of your life's journey.</p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
