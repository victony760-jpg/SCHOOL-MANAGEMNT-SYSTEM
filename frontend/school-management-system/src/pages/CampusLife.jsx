import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Utensils, Bus, Shield, Heart, Camera, Quote, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import campusVideo from '../assets/8499700-hd_1920_1080_30fps.mp4';
import gal1 from '../assets/pexels-cottonbro-5158945.jpg';
import gal2 from '../assets/pexels-cottonbro-7395467.jpg';
import gal3 from '../assets/pexels-franco-monsalvo-252430633-38455235.jpg';
import gal4 from '../assets/pexels-karola-g-6958537.jpg';
import gal5 from '../assets/pexels-gera-cejas-3616330-37758623.jpg';
import gal6 from '../assets/pexels-ketut-subiyanto-4560076.jpg';
import gal7 from '../assets/pexels-sun-286671774-30562665.jpg';
import gal8 from '../assets/pexels-safari-consoler-3290243-19501079.jpg';

const CampusLife = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const videoRef = useRef(null);

  const heroSlides = [
    { type: 'video', src: campusVideo },
    { type: 'image', src: gal1 }, { type: 'image', src: gal2 }, { type: 'image', src: gal3 }, { type: 'image', src: gal4 },
    { type: 'image', src: gal5 }, { type: 'image', src: gal6 }, { type: 'image', src: gal7 }, { type: 'image', src: gal8 },
  ];

  useEffect(() => {
    let timer;
    const current = heroSlides[heroIndex];
    if (current.type === 'video' && videoRef.current) {
      videoRef.currentTime = 0;
      videoRef.current.play().catch(() => { });
      timer = setTimeout(() => setHeroIndex(1), 20000);
    } else {
      timer = setTimeout(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 5000);
    }
    return () => clearTimeout(timer);
  }, [heroIndex]);

  const facilities = [
    { icon: Home, title: 'Boarding Houses', desc: 'Male and Female hostels with 24/7 house tutors, power backup, and WiFi.' },
    { icon: Utensils, title: 'Cafeteria', desc: 'Nutritious 4-meal daily menu prepared by certified dieticians.' },
    { icon: Bus, title: 'School Transport', desc: 'Air-conditioned buses covering Lagos mainland, island, and Ikeja routes.' },
    { icon: Shield, title: '24/7 Security', desc: 'CCTV, perimeter fencing, and on-site security personnel.' },
    { icon: Heart, title: 'Clinic', desc: 'Full-time nurse and visiting doctor. Emergency response team available.' },
    { icon: Camera, title: 'Recreation', desc: 'Basketball court, football pitch, table tennis, and indoor games room.' },
  ];

  const gallery = [
    { src: gal1 }, { src: gal2 }, { src: gal3 }, { src: gal4 }, { src: gal5 }, { src: gal6 }, { src: gal7 }, { src: gal8 },
  ];

  const testimonials = [
    { name: 'Aisha Bello', role: 'SSS 3 Student', quote: 'The boarding house felt like home. The mentors pushed me to get 8A1s in WAEC.' },
    { name: 'Mr. Tunde Adeleke', role: 'Parent', quote: 'From day 1, I saw the difference. My son now codes in Python and loves STEM.' },
    { name: 'Chinedu Okoro', role: 'Alumnus, MIT', quote: 'Victony prepared me for global competition. The British curriculum gave me an edge.' },
  ];

  const schedule = [
    { time: '6:00 AM', activity: 'Wake Up & Morning Devotion' }, { time: '7:00 AM', activity: 'Breakfast & Assembly' },
    { time: '8:00 AM', activity: 'Classes Begin' }, { time: '1:00 PM', activity: 'Lunch Break' },
    { time: '2:00 PM', activity: 'Classes / Labs' }, { time: '4:30 PM', activity: 'Clubs & Sports' },
    { time: '6:30 PM', activity: 'Prep / Study Hour' }, { time: '9:30 PM', activity: 'Lights Out' },
  ];

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const nextImage = () => { const currentIndex = gallery.findIndex(img => img.src === selectedImage.src); setSelectedImage(gallery[(currentIndex + 1) % gallery.length]); };
  const prevImage = () => { const currentIndex = gallery.findIndex(img => img.src === selectedImage.src); setSelectedImage(gallery[(currentIndex - 1 + gallery.length) % gallery.length]); };

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* 1. HERO CAROUSEL */}
      <section className="relative pt-32 pb-20 px-6 text-center bg-gradient-to-b from-blue-950/60 via-blue-900/20 to-slate-950 border-b border-blue-900/40">
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-emerald-400 font-serif tracking-[0.2em] uppercase text-xs font-semibold bg-emerald-500/10 px-4 py-1.5 rounded-full border-emerald-500/20 mb-4">

          </span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Campus Life at Victony
          </motion.h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            More than academics. A home where students grow, lead, and create lifelong memories.
          </p>

          <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border-blue-900/60 group">
            <AnimatePresence mode="wait">
              {heroSlides[heroIndex].type === 'video' ? (
                <motion.video key="video" ref={videoRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} src={heroSlides[heroIndex].src} autoPlay muted playsInline className="w-full h-80 object-cover cursor-pointer" onClick={() => setPlayVideo(true)} />
              ) : (
                <motion.img key={heroIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} src={heroSlides[heroIndex].src} alt="Campus" className="w-full h-80 object-cover" />
              )}
            </AnimatePresence>
            <button onClick={prevHero} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 opacity-0 group-hover:opacity-100 transition"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={nextHero} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 opacity-0 group-hover:opacity-100 transition"><ChevronRight className="w-6 h-6" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, i) => (<button key={i} onClick={() => setHeroIndex(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === heroIndex ? 'bg-emerald-400 w-6' : 'bg-white/40'}`} />))}
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS VIDEO MODAL */}
      <AnimatePresence>
        {playVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setPlayVideo(false)}>
            <button onClick={() => setPlayVideo(false)} className="absolute top-6 right-6 text-white hover:text-emerald-400 z-10"><X className="w-10 h-10" /></button>
            <video key="modal" src={campusVideo} controls autoPlay loop muted playsInline className="max-w-4xl w-full rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FACILITIES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">World-Class Facilities</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((item, i) => (<motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-blue-900/20 border-blue-900/40 p-8 rounded-2xl hover:border-emerald-400/50 transition duration-300 group"><div className="w-14 h-14 bg-emerald-500/10 border-emerald-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300"><item.icon className="w-7 h-7 text-emerald-400" /></div><h3 className="font-serif text-xl font-bold text-white mb-2">{item.title}</h3><p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p></motion.div>))}
        </div>
      </section>

      {/* 3. DAILY SCHEDULE */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-blue-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">A Day in Victony</h2>
          <div className="bg-blue-950/60 border-blue-900/60 rounded-2xl p-8">
            <div className="space-y-4">{schedule.map((item, i) => (<motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-6 border-b border-blue-900/30 pb-4 last:border-0"><div className="text-emerald-400 font-bold text-lg w-24 flex-shrink-0">{item.time}</div><div className="text-slate-200">{item.activity}</div></motion.div>))}</div>
          </div>
        </div>
      </section>

      {/* 4. GALLERY - NO HOVER CAPTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">Life in Pictures</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((img, i) => (<motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedImage(img)} className="relative overflow-hidden rounded-xl cursor-pointer"><img src={img.src} alt="Gallery" className="w-full h-64 object-cover hover:scale-110 transition duration-500" /></motion.div>))}
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 text-white hover:text-emerald-400"><ChevronLeft className="w-10 h-10" /></button>
            <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full"><img src={selectedImage.src} alt="Gallery" className="w-full h-auto rounded-xl" /><button onClick={() => setSelectedImage(null)} className="absolute -top-10 right-0 text-white hover:text-emerald-400"><X className="w-8 h-8" /></button></div>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 text-white hover:text-emerald-400"><ChevronRight className="w-10 h-10" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 px-6 bg-slate-900/40 border-t border-blue-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-8">{testimonials.map((testi, i) => (<motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-blue-950/60 border border-blue-900/60 p-8 rounded-2xl"><Quote className="w-8 h-8 text-emerald-400 mb-4 opacity-70" /><p className="text-slate-300 italic mb-6 leading-relaxed">"{testi.quote}"</p><div><p className="font-bold text-white">{testi.name}</p><p className="text-emerald-400 text-sm">{testi.role}</p></div></motion.div>))}</div>
        </div>
      </section>
    </div>
  );
};

export default CampusLife;