import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FlaskConical, Globe, X, Check, Star, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum'; // IMPORT SOURCE OF TRUTH
import academicsVideo from '../assets/7092068-hd_1920_1080_30fps.mp4';
import img1 from '../assets/pexels-cottonbro-5158945.jpg';
import img2 from '../assets/pexels-cottonbro-7395467.jpg';
import img3 from '../assets/pexels-franco-monsalvo-252430633-38455235.jpg';
import img4 from '../assets/pexels-karola-g-6958537.jpg';
import img5 from '../assets/pexels-gera-cejas-3616330-37758623.jpg';
import img6 from '../assets/pexels-mikhail-nilov-9242810.jpg';

const Academics = () => {
  const [playVideo, setPlayVideo] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const videoRef = useRef(null);

  const heroSlides = [
    { type: 'video', src: academicsVideo },
    { type: 'image', src: img1 }, { type: 'image', src: img2 }, { type: 'image', src: img3 },
    { type: 'image', src: img4 }, { type: 'image', src: img5 }, { type: 'image', src: img6 },
  ];

  useEffect(() => {
    let timer;
    const current = heroSlides[heroIndex];
    if (current.type === 'video' && videoRef.current) {
      videoRef.currentTime = 0;
      videoRef.current.play().catch(() => { });
      timer = setTimeout(() => setHeroIndex(1), 15000);
    } else {
      timer = setTimeout(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 5000);
    }
    return () => clearTimeout(timer);
  }, [heroIndex]);

  const academicImages = [{ src: img1 }, { src: img2 }, { src: img3 }, { src: img4 }, { src: img5 }, { src: img6 }];

  const pillars = [
    { title: 'Academic Excellence', icon: BookOpen, desc: 'Rigorous British and Nigerian curriculum delivered by certified educators. We maintain a 1:15 teacher-student ratio.', points: ['WAEC, NECO, IGCSE, SAT Preparation', 'Weekly Assessments & CBT Practice', 'After-School Remedial Classes'] },
    { title: 'STEM & Innovation', icon: FlaskConical, desc: 'From Primary 4, students learn coding, robotics, and engineering design thinking.', points: ['Robotics Club & Competitions', 'Computer Science from Age 9', 'Annual Science & Tech Fair'] },
    { title: 'Global Readiness', icon: Globe, desc: 'We prepare students for universities in Nigeria, UK, USA, and Canada through IELTS, TOEFL, and SAT coaching.', points: ['University Counseling from SSS 1', 'Alumni in MIT, Oxford, UNILAG', 'International Exchange Programs'] },
  ];

  // CONVERT CURRICULUM OBJECT TO ARRAY FOR DISPLAY
  const curriculum = Object.entries(CURRICULUM).map(([level, subjects]) => ({
    level,
    subjects: subjects.join(', ')
  }));

  const results = [
    { year: '2025', waec: '99%', jamb: 'Avg 280', note: '3 Students to UK & Canada' },
    { year: '2024', waec: '98%', jamb: 'Avg 275', note: '2 Students to MIT & Oxford' },
    { year: '2023', waec: '97%', jamb: 'Avg 270', note: '5 Students to UNILAG & OAU' },
  ];

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* 1. HERO CAROUSEL */}
      <section className="relative pt-32 pb-20 px-6 text-center bg-gradient-to-b from-blue-950/60 via-blue-900/20 to-slate-950 border-b border-blue-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08)_0,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-emerald-400 font-serif tracking-[0.2em] uppercase text-xs font-semibold bg-emerald-500/10 px-4 py-1.5 rounded-full border-emerald-500/20 mb-4">Academic Excellence</span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">World-Class Academics</motion.h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg mb-8">Preparing leaders for WAEC, JAMB, and global universities through STEM, character, and discipline.</p>

          <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border-blue-900/60 shadow-2xl shadow-emerald-500/10 group">
            <AnimatePresence mode="wait">
              {heroSlides[heroIndex].type === 'video' ? (
                <motion.video key="video" ref={videoRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} src={heroSlides[heroIndex].src} autoPlay muted playsInline className="w-full h-80 object-cover cursor-pointer" onClick={() => setPlayVideo(true)} />
              ) : (<motion.img key={heroIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} src={heroSlides[heroIndex].src} alt="Academics" className="w-full h-80 object-cover" />)}
            </AnimatePresence>
            <button onClick={prevHero} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 opacity-0 group-hover:opacity-100 transition"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={nextHero} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 opacity-0 group-hover:opacity-100 transition"><ChevronRight className="w-6 h-6" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">{heroSlides.map((_, i) => (<button key={i} onClick={() => setHeroIndex(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === heroIndex ? 'bg-emerald-400 w-6' : 'bg-white/40'}`} />))}</div>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      <AnimatePresence>{playVideo && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setPlayVideo(false)}>
          <button onClick={() => setPlayVideo(false)} className="absolute top-6 right-6 text-white hover:text-emerald-400 z-10"><X className="w-10 h-10" /></button>
          <video key="modal" src={academicsVideo} controls autoPlay loop muted playsInline className="max-w-4xl w-full rounded-xl" />
        </motion.div>
      )}</AnimatePresence>

      {/* 2. PILLARS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">The Victony Academic Advantage</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {pillars.map((pillar, i) => (<button key={i} onClick={() => setActivePillar(i)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${activePillar === i ? 'bg-emerald-500 text-slate-950' : 'bg-blue-900/40 text-slate-200 hover:bg-blue-900/60'}`}><pillar.icon className="w-5 h-5" /> {pillar.title}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activePillar} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-blue-950/60 border-blue-900/60 p-10 rounded-2xl">
            <h3 className="font-serif text-2xl font-bold text-white mb-3">{pillars[activePillar].title}</h3>
            <p className="text-slate-300 mb-6">{pillars[activePillar].desc}</p>
            <ul className="space-y-3">{pillars[activePillar].points.map((point, i) => (<li key={i} className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" /><span className="text-slate-200">{point}</span></li>))}</ul>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. CURRICULUM - NOW DYNAMIC FROM curriculum.js */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-blue-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">Our Curriculum Structure</h2>
          <div className="bg-blue-950/60 border-blue-900/60 rounded-2xl overflow-hidden">
            {curriculum.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-6 border-b border-blue-900/40 last:border-0">
                <h4 className="font-bold text-emerald-400 text-lg mb-2">{item.level}</h4>
                <p className="text-slate-300 text-sm">{item.subjects}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">*Note: Primary 4 no longer offers Coding. Subjects above are the official subjects offered at VICTONY.</p>
        </div>
      </section>

      {/* 4. GALLERY */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center text-white mb-12">Learning in Action</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{academicImages.map((img, i) => (<motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative overflow-hidden rounded-xl"><img src={img.src} alt="Gallery" className="w-full h-72 object-cover hover:scale-110 transition duration-500" /></motion.div>))}</div>
      </section>

      {/* 5. RESULTS */}
      <section className="py-20 px-6 bg-slate-900/40 border-t border-blue-900/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Proven Track Record</h2>
          <p className="text-slate-400 mb-10">Results that speak for themselves</p>
          <div className="grid md:grid-cols-3 gap-8">{results.map((res, i) => (<motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-blue-950/60 border border-blue-900/60 p-8 rounded-2xl"><div className="text-5xl font-bold text-emerald-400 font-serif mb-2">{res.waec}</div><p className="text-slate-300 font-semibold mb-1">WAEC Pass Rate {res.year}</p><p className="text-slate-400 text-sm mb-3">JAMB Avg: {res.jamb}</p><div className="flex items-center justify-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-yellow-400" /> <span className="text-slate-300 text-sm">{res.note}</span></div></motion.div>))}</div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <GraduationCap className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="font-serif text-3xl font-bold text-white mb-4">Ready to Join Victony?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm sm:text-base">Admissions for 2026/2027 session is now open. Limited spaces available.</p>
        <a href="/admissions" className="inline-block bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-lg font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">Apply Now</a>
      </section>
    </div>
  );
};
export default Academics;