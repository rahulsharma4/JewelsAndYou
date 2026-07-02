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
      <section className="bg-brand-tealDark text-brand-off text-center py-12">
        <motion.div className="max-w-5xl mx-auto px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.h1 className="text-4xl sm:text-5xl font-extrabold mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Contact Us</motion.h1>
          <motion.p className="text-lg opacity-90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>We'd love to hear from you. Get in touch with us for any questions or assistance.</motion.p>
        </motion.div>
      </section>

      {/* Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <motion.div key={info.title} className="bg-brand-tealDark rounded-lg shadow-sm p-6 text-center border border-brand-gold/20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} whileHover={{ y: -6 }}>
                <div className="flex justify-center mb-4">
                  <Icon className="w-8 h-8 text-brand-gold" />
                </div>
                <div className="text-xl font-bold mb-3 text-brand-off">{info.title}</div>
                <ul className="text-brand-off/90 text-sm space-y-1">
                  {info.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="text-brand-off/70 text-sm mt-3">{info.description}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Form + Hours */}
      <section className="py-12 bg-brand-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-lg shadow-sm p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="text-2xl font-bold mb-4 text-brand-tealDark">Send us a Message</div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
                <input className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                <input className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                <input className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
                <textarea className="sm:col-span-2 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Message" name="message" rows={6} value={formData.message} onChange={handleInputChange} required />
                <div className="sm:col-span-2">
                  <motion.button disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} type="submit" className="rounded-md bg-brand-gold text-brand-tealDark px-6 py-3 font-semibold hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
            <motion.div className="bg-white/90 backdrop-blur rounded-lg shadow-sm p-6 h-fit" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
              <div className="text-xl font-bold mb-3 text-brand-tealDark">Business Hours</div>
              <ul className="space-y-2">
                {businessHours.map((s) => (
                  <li key={s.day} className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-brand-gold" />
                    <div>
                      <div className="font-semibold text-brand-teal">{s.day}</div>
                      <div className="text-sm text-slate-600">{s.hours}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 rounded-lg bg-brand-tealDark text-brand-off">
                <div className="text-lg font-bold">Need Immediate Assistance?</div>
                <div className="text-sm opacity-90 mb-1">For urgent inquiries, please call us directly at:</div>
                <div className="font-semibold text-brand-gold">+1 (555) 123-4567</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-brand-off">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-brand-tealDark shadow-sm border border-brand-gold/20">
            <div className="text-lg font-bold mb-1 text-brand-off">How can I track my order?</div>
            <div className="text-sm text-brand-off/80">Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard.</div>
          </div>
          <div className="p-4 rounded-lg bg-brand-tealDark shadow-sm border border-brand-gold/20">
            <div className="text-lg font-bold mb-1 text-brand-off">What is your return policy?</div>
            <div className="text-sm text-brand-off/80">We offer a 30-day return policy for unused items in their original packaging. Returns are free and we provide a full refund.</div>
          </div>
          <div className="p-4 rounded-lg bg-brand-tealDark shadow-sm border border-brand-gold/20">
            <div className="text-lg font-bold mb-1 text-brand-off">Do you offer custom designs?</div>
            <div className="text-sm text-brand-off/80">Yes! We specialize in custom jewelry design. Contact us to discuss your vision and we'll create a unique piece just for you.</div>
          </div>
          <div className="p-4 rounded-lg bg-brand-tealDark shadow-sm border border-brand-gold/20">
            <div className="text-lg font-bold mb-1 text-brand-off">How do I care for my jewelry?</div>
            <div className="text-sm text-brand-off/80">We provide detailed care instructions with every purchase. Generally, store in a cool, dry place and clean with a soft cloth regularly.</div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-12 bg-brand-teal/5">
        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <h2 className="text-3xl font-bold mb-6 text-brand-off">Visit Our Showroom</h2>
          <motion.div className="rounded-lg p-6 bg-brand-tealDark text-brand-off h-80 flex items-center justify-center mb-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
            <div>
              <MapPin className="w-16 h-16 text-brand-gold mx-auto mb-4" />
              <div className="text-xl font-bold mb-1">Interactive Map Coming Soon</div>
              <div>123 Jewelry Street, New York, NY 10001</div>
            </div>
          </motion.div>
          <div className="text-brand-off/80">Our showroom is open by appointment only. Please contact us to schedule a visit.</div>
        </motion.div>
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
