import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Send } from 'lucide-react';
import aboutVideoOne from '../assets/7945183-hd_1920_1080_25fps.mp4';
import aboutVideoTwo from '../assets/7945188-hd_1920_1080_25fps.mp4';
import oacthecreatorImg from '../assets/pexels-oacthecreator-10604063.jpg';
import safariImg from '../assets/pexels-safari-consoler-3290243-19501079.jpg';

const aboutMediaSequence = [
  { type: 'video', src: aboutVideoOne },
  { type: 'video', src: aboutVideoTwo },
  { type: 'image', src: oacthecreatorImg },
  { type: 'image', src: safariImg },
];

const About = () => {
  const [aboutMediaIndex, setAboutMediaIndex] = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const mainVideoRef = useRef(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } } };

  useEffect(() => {
    const activeMedia = aboutMediaSequence[aboutMediaIndex];
    if (activeMedia.type === 'video') {
      const video = mainVideoRef.current;
      if (!video) return;
      const playVideo = async () => { try { video.currentTime = 0; await video.play(); } catch { } };
      playVideo();
      return;
    }
    const timer = setTimeout(() => { setAboutMediaIndex((prev) => (prev + 1) % aboutMediaSequence.length); }, 4000);
    return () => clearTimeout(timer);
  }, [aboutMediaIndex]);

  const activeMedia = aboutMediaSequence[aboutMediaIndex];

  const facilities = [
    { img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800', title: 'STEM & Robotics Lab' },
    { img: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800', title: 'Modern Library' },
    { img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800', title: 'Sports Complex' },
    { img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800', title: 'Student Hostels' },
  ];

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen overflow-hidden">

      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[50vh] min-h-[420px] flex items-end justify-start overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={activeMedia.src} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className="absolute inset-0">
            {activeMedia.type === 'video' ? (
              <video ref={mainVideoRef} autoPlay muted playsInline onEnded={() => setAboutMediaIndex((prev) => (prev + 1) % aboutMediaSequence.length)} className="w-full h-full object-cover brightness-75">
                <source src={activeMedia.src} type="video/mp4" />
              </video>
            ) : (<img src={activeMedia.src} alt="About Victony" className="w-full h-full object-cover brightness-75" />)}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 pb-16 text-left">
          <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-emerald-400 font-serif tracking-[0.3em] uppercase text-xs sm:text-sm font-semibold block mb-4">Established 2015</motion.span>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white leading-tight">About <span className="text-emerald-400">Victony</span></motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-4 text-base sm:text-lg text-slate-300 font-light max-w-xl">Raising total children for global impact through academic distinction, character, and leadership.</motion.p>
        </div>
      </section>

      {/* 2. OUR FOUNDING STORY & VISION */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">A History of Character and Intellectual Rigor</h2>
            <div className="w-16 h-1 bg-emerald-400" />
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-light">Founded in 2015, The Victony Preparatory School was established with a singular focus: to create an environment where academic ambition and moral integrity grow side by side.</p>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-light">Over the past decade, we have expanded into a thriving co-educational institution empowering students to become empathetic global leaders.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-6 h-96 rounded-lg overflow-hidden border-blue-900/60 shadow-2xl relative group">
            <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop" alt="Victony Library" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* 3. MISSION, VISION & CORE VALUES */}
      <section className="py-24 bg-blue-900/20 border-y border-blue-900/50 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-3xl mx-auto">
            <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">Guiding Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">Mission, Vision & Principles</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ title: 'Our Mission', desc: 'To cultivate dynamic thinkers and compassionate leaders by pairing a rigorous STEM-infused curriculum with moral grounding.', badge: 'Purpose' }, { title: 'Our Vision', desc: 'To set the benchmark for co-educational prep schools globally, producing graduates equipped to solve high-stakes challenges.', badge: 'Aspiration' }, { title: 'Core Values', desc: 'Integrity in action, continuous intellectual curiosity, global responsibility, and unwavering mutual respect.', badge: 'Foundation' }].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -6 }} className="bg-blue-950/80 border-blue-900/60 p-8 rounded-lg hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
                <span className="inline-block bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-serif tracking-widest px-3 py-1 rounded-md uppercase mb-4">{item.badge}</span>
                <h3 className="font-serif text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. ACCREDITATION & AWARDS */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-serif text-2xl sm:text-3xl text-white mb-10">Recognized & Accredited</motion.h3>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-90">
            {['WAEC', 'NECO', 'Cambridge', 'Ministry of Education'].map((name) => (
              <motion.div key={name} variants={fadeInUp} className="p-4 bg-blue-900/30 rounded-lg border-blue-900/60 hover:border-emerald-500/30 transition"><p className="text-emerald-400 font-serif font-bold text-lg">{name}</p></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. SCHOOL LEADERSHIP */}
      <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">Institutional Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">Meet Our Leadership</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Dr. Eleanor Vance', role: 'Head of School', bio: 'Former Ivy League researcher with 20+ years of leadership in secondary education.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
            { name: 'Marcus Sterling', role: 'Dean of Academics', bio: 'Pioneered our integrated STEM & Humanities framework, focusing on critical inquiry.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
            { name: 'Dr. Sarah Jenkins', role: 'Director of Student Welfare', bio: 'Dedicated to fostering an inclusive co-educational culture built around mentorship.', img: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=600&auto=format&fit=crop' }
          ].map((leader, idx) => (
            <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -6 }} className="bg-blue-900/20 border-blue-900/60 rounded-lg overflow-hidden group">
              <div className="h-80 overflow-hidden relative border-b border-blue-900/60">
                <img src={leader.img} alt={leader.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl font-bold text-white">{leader.name}</h3>
                <p className="text-emerald-400 text-xs font-serif tracking-widest uppercase font-semibold">{leader.role}</p>
                <p className="text-slate-300 text-sm font-light pt-2 leading-relaxed">{leader.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. CAMPUS FACILITIES GALLERY */}
      <section className="py-24 bg-blue-900/20 border-y border-blue-900/50 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">Our Environment</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">World-Class Campus Facilities</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group relative h-72 rounded-lg overflow-hidden border border-blue-900/60">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 to-transparent" />
                <p className="absolute bottom-4 left-4 font-serif text-lg font-bold text-white">{item.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. CALL TO ACTION - BUTTON UPDATED */}
      <section className="py-28 px-6 sm:px-12 bg-gradient-to-b from-blue-950 via-blue-900/40 to-blue-950 border-t border-blue-900/60 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_70%)] pointer-events-none" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-4xl mx-auto space-y-8 relative z-10">
          <span className="text-emerald-400 font-serif text-xs tracking-[0.4em] uppercase font-bold">Become Part of Our Tradition</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-wide">JOIN THE VICTONY COMMUNITY</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">Whether you are a prospective student, parent, or educator, we invite you to experience our campus firsthand.</p>
          <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/admissions" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold px-9 py-4 rounded-lg text-sm tracking-widest uppercase transition">Apply for Admission</Link>
            <button onClick={() => setShowVisitModal(true)} className="inline-block bg-blue-900/60 hover:bg-blue-800/80 text-white border border-slate-600 px-8 py-4 rounded-lg text-sm tracking-widest uppercase transition">Schedule A Visit</button>
          </div>
        </motion.div>
      </section>

      {showVisitModal && <VisitModal onClose={() => setShowVisitModal(false)} />}
    </main>
  );
};

// VISIT MODAL COMPONENT
const VisitModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', date: '', class: '' });
  const handleSubmit = (e) => { e.preventDefault(); console.log("Visit Request:", form); alert("Visit scheduled! We will call you."); onClose(); }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 p-8 rounded-xl max-w-lg w-full border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold text-white">Schedule a Campus Visit</h3>
          <button onClick={onClose}><X className="text-white hover:text-emerald-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Parent Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" />
          <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white" />
          <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-800 border-slate-700 p-3 rounded-lg text-white" />
          <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full bg-slate-800 border-slate-700 p-3 rounded-lg text-white">
            <option value="">Class Interested In</option><option>Nursery</option><option>Primary</option><option>JSS</option><option>SSS</option>
          </select>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2"><Send className="w-4 h-4" />Submit Request</button>
        </form>
      </motion.div>
    </div>
  )
}
export default About;