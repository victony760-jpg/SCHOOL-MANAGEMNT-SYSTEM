import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { submitContactForm } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // CRITICAL FIX: Map to backend fields
      await submitContactForm({
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      toast.success("Message sent! We will get back to you within 24 hours.");
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen">
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-blue-950 to-blue-900/40 border-b border-blue-900/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08)_0,transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 font-serif tracking-[0.3em] uppercase text-xs font-semibold">Get In Touch</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-3">Contact <span className="text-emerald-400">Victony</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-300 mt-4 max-w-2xl mx-auto">Have questions about admissions, campus tours, or partnerships? Our team is here to help.</motion.p>
        </div>
      </section>

      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:col-span-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">Send Us a Message</h2>
            {submitted && (<div className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 p-4 rounded-lg mb-6">Message sent! We will get back to you within 24 hours.</div>)}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full bg-blue-900/40 border border-blue-900/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" />
              </div>
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="w-full bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="6" required className="w-full bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-blue-950 font-bold px-8 py-4 rounded-lg text-sm tracking-widest uppercase transition flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
            {[{ icon: <MapPin className="w-6 h-6" />, title: 'Visit Our Campus', text: 'No 15 Allen Avenue, Ikeja, Lagos, Nigeria' }, { icon: <Phone className="w-6 h-6" />, title: 'Call Us', text: '08038445230' }, { icon: <Mail className="w-6 h-6" />, title: 'Email Us', text: 'victony760@gmail.com' }, { icon: <Clock className="w-6 h-6" />, title: 'Office Hours', text: 'Mon - Fri: 8:00 AM - 4:00 PM\nSat: 9:00 AM - 1:00 PM' }].map((item, idx) => (
              <div key={idx} className="bg-blue-900/20 border border-blue-900/60 p-6 rounded-lg hover:border-emerald-500/30 transition">
                <div className="flex items-start gap-4"><div className="text-emerald-400 mt-1">{item.icon}</div><div><h3 className="font-serif text-lg font-bold text-white">{item.title}</h3><p className="text-slate-300 text-sm whitespace-pre-line mt-1">{item.text}</p></div></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 sm:px-12 pb-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="h-[450px] rounded-2xl overflow-hidden border-blue-900/60 shadow-2xl">
          <iframe src="https://www.google.com/maps?q=No%2015%20Allen%20Avenue%2C%20Ikeja%2C%20Lagos%2C%20Nigeria&z=15&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Victony Location"></iframe>
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-blue-900/20 border-t border-blue-900/60 text-center">
        <h2 className="font-serif text-3xl font-bold text-white mb-4">Looking for Something Specific?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link to="/admissions" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold rounded-lg transition">Admissions</Link>
          <Link to="/campus-life" className="px-6 py-3 bg-blue-900/60 hover:bg-blue-800/80 text-white border border-slate-600 rounded-lg transition">Campus Tour</Link>
        </div>
      </section>
    </main >
  );
};
export default Contact;