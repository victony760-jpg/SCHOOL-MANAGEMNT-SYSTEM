// src/pages/Home.jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import campusVideo from '../assets/8198506-hd_1920_1080_25fps.mp4';
import geraImg from '../assets/pexels-gera-cejas-3616330-37762503.jpg';
import daveImg from '../assets/pexels-davegarcia-31039051.jpg';
import sunImg from '../assets/pexels-sun-286671774-30562665.jpg';

// Cloudinary URL for your hero video
const HERO_VIDEO_URL = "https://res.cloudinary.com/dyg6tlb2r/video/upload/v1788177407/Video_Project_1_1_uayoeq.mp4";

const heroMediaSequence = [
  { type: 'image', src: geraImg },
  { type: 'image', src: daveImg },
  { type: 'image', src: sunImg },
  { type: 'video', src: HERO_VIDEO_URL }
];

const Home = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const [heroMediaIndex, setHeroMediaIndex] = useState(0);
  const heroVideoRef = useRef(null);
  const campusVideoRef = useRef(null);

  useEffect(() => {
    const activeMedia = heroMediaSequence[heroMediaIndex];

    if (activeMedia.type === 'video') {
      const video = heroVideoRef.current;
      if (!video) return;

      const playVideo = async () => {
        try {
          video.currentTime = 0;
          await video.play();
        } catch {
          // Ignore autoplay restrictions and continue the cycle when the user interacts.
        }
      };

      playVideo();
      return;
    }

    const timer = window.setTimeout(() => {
      setHeroMediaIndex((prevIndex) => (prevIndex + 1) % heroMediaSequence.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [heroMediaIndex]);

  useEffect(() => {
    const video = campusVideoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch {
        // Ignore autoplay restrictions; the video still renders and can play on interaction.
      }
    };

    playVideo();
  }, []);

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen overflow-hidden">

      {/* 1. HERO VIDEO SECTION */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {heroMediaSequence[heroMediaIndex].type === 'video' ? (
          <video
            ref={heroVideoRef}
            key="hero-video-loop"
            src={heroMediaSequence[heroMediaIndex].src}
            autoPlay
            muted
            playsInline
            onEnded={() => setHeroMediaIndex((prevIndex) => (prevIndex + 1) % heroMediaSequence.length)}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            data-hero-image
            src={heroMediaSequence[heroMediaIndex].src}
            alt="Victony campus"
            className="absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-700"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/50 to-blue-950/80" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-emerald-400 font-serif tracking-[0.3em] uppercase text-xs sm:text-sm font-semibold block mb-4"
          >
            Welcome to Excellence
          </motion.span>

          {/* STACKED LOGO - MATCHES NAVBAR/FOOTER */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-white leading-tight drop-shadow-xl"
          >
            THE VICTONY
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-sm sm:text-base md:text-lg tracking-[0.4em] text-emerald-400 font-medium uppercase block mt-2 drop-shadow-xl"
          >
            PREPARATORY SCHOOL
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed"
          >
            A premier co-educational institution nurturing character, intellect, and leadership for tomorrow's pioneers.
          </motion.p>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 bg-white/70 rounded-full mt-2" />
        </motion.div>
      </section>

      {/* 2. CO-EDUCATIONAL & FOUNDING HERITAGE SECTION */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="lg:col-span-6 flex-col sm:flex-row gap-6 items-start sm:items-center"
          >
            <div className="relative w-full sm:w-1/2 h-80 rounded-sm overflow-hidden border-blue-900/60 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
                alt="Students on campus"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-blue-950/20" />
            </div>

            <div className="sm:w-1/2 space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase leading-snug">
                CULTIVATING LIVES OF PURPOSE
              </h2>
              <span className="inline-block bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-serif tracking-widest px-3 py-1 rounded-sm uppercase">
                FOUNDED IN 2015
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="lg:col-span-6 space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-serif text-emerald-400 font-semibold">
              A Co-Educational Environment Built for Balanced Growth
            </h3>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
              The Victony Preparatory School provides an inclusive co-educational community for all genders. We foster dynamic collaboration, mutual respect, and healthy competition, preparing young men and women to lead with confidence and integrity.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 3. OUR EDUCATIONAL SYSTEM */}
      <section className="py-24 bg-blue-900/20 border-y border-blue-900/50 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <h2 className="text-xs font-serif tracking-[0.3em] uppercase text-emerald-400 font-semibold">
              Academic Philosophy
            </h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              Our Educational System
            </h3>
            <p className="text-slate-300 mt-4 leading-relaxed text-base sm:text-lg">
              Our rigorous curriculum blends global academic standards with experiential learning, prioritizing critical inquiry, STEM innovation, and creative expression.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { num: '01', title: 'Holistic Curriculum', desc: 'Integrating sciences, arts, humanities, and ethics into a balanced framework.' },
              { num: '02', title: 'Mentorship First', desc: 'Small class ratios ensure personalized guidance from world-class educators.' },
              { num: '03', title: 'Future Readiness', desc: 'Equipping students with tech proficiency, leadership traits, and global awareness.' }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="bg-blue-950/60 border-blue-900/60 p-8 rounded-sm hover:border-emerald-500/40 transition-all duration-300"
              >
                <span className="text-emerald-400 font-serif text-2xl font-bold">{pillar.num}</span>
                <h4 className="font-serif text-xl font-bold text-white mt-3">{pillar.title}</h4>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. IDYLLIC LOCATION SECTION */}
      <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">
              Environment & Campus
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              An Idyllic Location for Focused Learning
            </h2>
            <div className="w-16 h-1 bg-emerald-400" />

            <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-light">
              Situated on acres of serene, green surroundings, our campus provides a quiet sanctuary away from city distractions. Modern architectural facilities blend seamlessly into lush landscapes, giving students an inspiring space for deep focus, research, and collaborative outdoor study.
            </p>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-light">
              From state-of-the-art science laboratories and digital libraries to expansive athletic fields, our location is thoughtfully engineered to nurture both mind and physical well-being in a safe, tranquil environment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 h-96 sm:h-[450px] rounded-sm overflow-hidden border-blue-900/60 shadow-2xl relative group"
          >
            <video
              ref={campusVideoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            >
              <source src={campusVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-blue-950/80 backdrop-blur-md border-blue-900/60 rounded-sm">
              <p className="text-emerald-400 font-serif text-sm font-semibold tracking-wider uppercase">
                Victony Main Campus
              </p>
              <p className="text-slate-300 text-xs mt-1">
                A serene green sanctuary engineered for holistic student development.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 5. OPPORTUNITIES SECTION */}
      <section className="py-28 bg-blue-900/20 border-y border-blue-900/50 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-16">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">
              Beyond The Classroom
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Endless Opportunities to Excel
            </h2>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-light">
              At The Victony Preparatory School, education extends far beyond textbooks. We empower students to explore their unique talents through diverse extracurricular pathways.
            </p>
          </motion.div>

          {/* OPPORTUNITIES GRID */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'STEM & Robotics Innovation',
                desc: 'State-of-the-art coding labs, engineering competitions, and robotics clubs designed to foster future innovators.',
                badge: 'Technology'
              },
              {
                title: 'Arts & Performing Ensembles',
                desc: 'Comprehensive music programs, drama productions, and visual arts exhibitions that nurture creative expression.',
                badge: 'Creativity'
              },
              {
                title: 'Athletics & Leadership',
                desc: 'Competitive team sports, physical training, and student council leadership roles that build discipline and team spirit.',
                badge: 'Leadership'
              }
            ].map((opp, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-blue-950/80 border border-blue-900/60 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="inline-block bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-serif tracking-widest px-3 py-1 rounded-sm uppercase">
                    {opp.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {opp.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    {opp.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-blue-900/40">

                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 6. WORDS FROM OUR STUDENTS */}
      <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">
            Student Voices
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-2">
            Words From Our Students
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Hear directly from the young minds who call The Victony Preparatory School their academic home.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-blue-900/20 border border-blue-900/60 p-8 sm:p-10 rounded-sm relative flex-col justify-between"
          >
            <p className="text-slate-300 text-base sm:text-lg italic leading-relaxed font-light">
              "When I arrived at Victony in 2021, I was unsure of my path. The teachers didn't just instruct—they challenged me to analyze, debate, and lead. Between heading the robotics club and performing in the spring orchestra, I discovered that academic rigor and creative freedom truly go hand in hand here."
            </p>
            <div className="mt-8 pt-6 border-t border-blue-900/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-serif font-bold text-emerald-400">
                DT
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-lg">David T.</h4>
                <p className="text-emerald-400 text-xs tracking-wider uppercase font-medium">Head Boy • Class of 2025</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-blue-900/20 border-blue-900/60 p-8 sm:p-10 rounded-sm relative flex flex-col justify-between"
          >
            <p className="text-slate-300 text-base sm:text-lg italic leading-relaxed font-light">
              "Being part of a co-educational environment at Victony taught me mutual respect and real-world collaboration. We aren't taught to memorize for tests; we are taught to solve genuine problems. The faculty supports our ambitions relentlessly—whether competing nationally or preparing for university."
            </p>
            <div className="mt-8 pt-6 border-t border-blue-900/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-emerald-400 flex items-center justify-center font-serif font-bold text-emerald-400">
                SO
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-lg">Sophia O.</h4>
                <p className="text-emerald-400 text-xs tracking-wider uppercase font-medium">STEM Scholar • Class of 2026</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. WHAT WE SAY ABOUT OUR STUDENTS */}
      <section className="py-28 bg-blue-900/20 border-t border-blue-900/50 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="lg:col-span-5 space-y-4"
          >
            <span className="text-emerald-400 font-serif text-xs tracking-[0.3em] uppercase font-semibold">
              Our Pride & Purpose
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              What We Say About Our Students
            </h2>
            <div className="w-16 h-1 bg-emerald-400 mt-2" />
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="lg:col-span-7 space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-light"
          >
            <p>
              At The Victony Preparatory School, our students are not passive recipients of knowledge—they are dynamic thinkers, compassionate leaders, and resilient creators. From the moment they step onto our campus, we observe an inspiring capacity for curiosity and intellectual bravery.
            </p>
            <p>
              We describe our student body as a vibrant tapestry of talents: scholars who question assumptions, athletes who champion teamwork, artists who reframe perspectives, and citizens who serve their communities with empathy. They embody the foundational spirit of 2015—pushing boundaries while remaining rooted in moral integrity.
            </p>
            <blockquote className="border-l-2 border-emerald-400 pl-6 text-white font-serif italic text-xl">
              "We do not merely prepare our students for examinations; we prepare them to step into the world as confident, honorable architects of the future."
            </blockquote>
          </motion.div>

        </div>
      </section>

      {/* 8. FINAL SECTION: LET'S BEGIN (CALL TO ACTION) */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-b from-blue-950 via-blue-900/40 to-blue-950 border-t border-blue-900/60 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_70%)] pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto space-y-8 relative z-10"
        >
          <span className="text-emerald-400 font-serif text-xs sm:text-sm tracking-[0.4em] uppercase font-bold">
            Start Your Journey
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-wide">
            LET'S BEGIN
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Take the first step toward becoming part of The Victony legacy. Connect with our admissions team, apply online, or schedule a campus visit today.
          </p>

          {/* ACTION BUTTONS: INQUIRIES, APPLY, TOUR */}
          <div className="pt-6 flex-col sm:flex-row gap-5 justify-center items-center">

            {/* Make Inquiries */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-block border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-blue-950 font-bold px-8 py-4 rounded-sm text-sm tracking-widest uppercase transition-all duration-300 shadow-md"
              >
                Make Inquiries
              </Link>
            </motion.div>

            {/* Apply Now */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/admissions"
                className="w-full sm:w-auto inline-block bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold px-9 py-4 rounded-sm text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-emerald-500/20"
              >
                Apply Now
              </Link>
            </motion.div>

            {/* Book A Tour */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/campus-tour"
                className="w-full sm:w-auto inline-block bg-blue-900/60 hover:bg-blue-800/80 text-white border border-blue-700/60 px-8 py-4 rounded-sm text-sm tracking-widest uppercase transition-all duration-300 shadow-md"
              >
                Book A Tour
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </section>

    </main>
  );
};

export default Home;