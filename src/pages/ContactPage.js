import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

import api from "../services/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    { icon: Mail, title: "Email Us", details: ["info@jewelsandyou.com", "support@jewelsandyou.com"], description: "We typically respond within 24 hours" },
    { icon: Phone, title: "Call Us", details: ["+1 (555) 123-4567", "+1 (555) 987-6543"], description: "Monday - Friday, 9 AM - 6 PM EST" },
    { icon: MapPin, title: "Visit Us", details: ["123 Jewelry Street", "New York, NY 10001"], description: "By appointment only" },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact(formData);
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 3000);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-white text-center py-20 border-b border-brand-gold/10">
        <motion.div className="max-w-4xl mx-auto px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-heading text-brand-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Contact Us</motion.h1>
          <motion.p className="text-lg text-brand-dark/70 font-medium max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>We'd love to hear from you. Get in touch with us for any questions or assistance.</motion.p>
        </motion.div>
      </section>

      {/* Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div 
                key={info.title} 
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 text-center border border-brand-gold/15" 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.4, delay: index * 0.1 }} 
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgb(0,0,0,0.1)" }}
              >
                <div className="w-16 h-16 mx-auto bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 shadow-inner border border-brand-gold/10">
                  <Icon className="w-7 h-7 text-brand-gold" />
                </div>
                <div className="text-xl font-bold font-heading mb-3 text-brand-dark">{info.title}</div>
                <ul className="text-brand-dark/80 font-medium text-sm space-y-1 mb-4">
                  {info.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="text-brand-dark/50 text-xs font-bold uppercase tracking-wider">{info.description}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Form + Hours */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            <motion.div 
              className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/20 p-8 md:p-12" 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.45 }}
            >
              <div className="text-2xl font-bold font-heading mb-6 text-brand-dark">Send us a Message</div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Full Name</label>
                  <input className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" placeholder="Enter your full name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Email Address</label>
                  <input className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Phone Number</label>
                  <input className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" placeholder="Enter your phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Subject</label>
                  <input className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" placeholder="What is this regarding?" name="subject" value={formData.subject} onChange={handleInputChange} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Message</label>
                  <textarea className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" placeholder="How can we help you?" name="message" rows={5} value={formData.message} onChange={handleInputChange} required />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <motion.button 
                    disabled={isSubmitting} 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="w-full sm:w-auto px-10 py-4 rounded-xl bg-brand-gold text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            <motion.div 
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/20 p-8 md:p-10 h-fit" 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="text-xl font-bold font-heading mb-6 text-brand-dark">Business Hours</div>
              <ul className="space-y-4">
                {businessHours.map((s) => (
                  <li key={s.day} className="flex items-start gap-4">
                    <div className="p-2 bg-[#FDFBF7] rounded-lg border border-brand-dark/10 mt-0.5">
                      <Clock className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark text-sm">{s.day}</div>
                      <div className="text-sm font-medium text-brand-dark/60 mt-0.5">{s.hours}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-6 rounded-2xl bg-[#FDFBF7] border border-brand-dark/10 shadow-inner">
                <div className="text-sm font-bold uppercase tracking-wider text-brand-dark mb-2">Need Immediate Help?</div>
                <div className="text-xs font-medium text-brand-dark/60 mb-2 leading-relaxed">For urgent inquiries, please call us directly during business hours at:</div>
                <div className="font-bold font-heading text-lg text-brand-gold">+1 (555) 123-4567</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-brand-gold/15 hover:border-brand-gold/30 hover:shadow-md transition-all">
            <div className="text-lg font-bold font-heading mb-2 text-brand-dark">How can I track my order?</div>
            <div className="text-sm font-medium text-brand-dark/70 leading-relaxed">Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard.</div>
          </div>
          <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-brand-gold/15 hover:border-brand-gold/30 hover:shadow-md transition-all">
            <div className="text-lg font-bold font-heading mb-2 text-brand-dark">What is your return policy?</div>
            <div className="text-sm font-medium text-brand-dark/70 leading-relaxed">We offer a 30-day return policy for unused items in their original packaging. Returns are free and we provide a full refund.</div>
          </div>
          <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-brand-gold/15 hover:border-brand-gold/30 hover:shadow-md transition-all">
            <div className="text-lg font-bold font-heading mb-2 text-brand-dark">Do you offer custom designs?</div>
            <div className="text-sm font-medium text-brand-dark/70 leading-relaxed">Yes! We specialize in custom jewelry design. Contact us to discuss your vision and we'll create a unique piece just for you.</div>
          </div>
          <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-brand-gold/15 hover:border-brand-gold/30 hover:shadow-md transition-all">
            <div className="text-lg font-bold font-heading mb-2 text-brand-dark">How do I care for my jewelry?</div>
            <div className="text-sm font-medium text-brand-dark/70 leading-relaxed">We provide detailed care instructions with every purchase. Generally, store in a cool, dry place and clean with a soft cloth regularly.</div>
          </div>
        </div>
      </section>



      {snackbarOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-3 rounded-md shadow-lg text-white bg-emerald-600">Thank you for your message! We will get back to you soon.</div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
