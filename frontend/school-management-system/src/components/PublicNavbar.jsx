
import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { title: 'About Us', path: '/about' },
    { title: 'Academics', path: '/academics' },
    { title: 'Admissions', path: '/admissions' },
    { title: 'Campus Life', path: '/campus-life' },
    { title: 'Contact', path: '/contact' },
  ];

  const mobileMenuContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const mobileMenuItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <Fragment>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 transition-all duration-500 ease-out ${scrolled
          ? 'py-4 bg-blue-950/90 backdrop-blur-md border-b border-blue-900/50 shadow-xl'
          : 'py-6 bg-gradient-to-b from-blue-950/80 via-blue-950/30 to-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex flex-col justify-center group z-50">
            <span className="font-serif font-bold text-2xl sm:text-3xl tracking-wider text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-emerald-400">
              THE VICTONY
            </span>
            <span className="font-serif text-[10px] sm:text-xs tracking-[0.3em] text-emerald-400 font-medium uppercase leading-tight mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              PREPARATORY SCHOOL
            </span>
            <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-serif tracking-widest uppercase px-3 py-1 rounded-sm mt-2">
              FOUNDED IN 2015
            </span>
          </Link>

          {!mobileMenuOpen && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              className={`relative z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-emerald-500 hover:bg-emerald-400 text-blue-950`}
              aria-label="Open Navigation Menu"
            >
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => <div key={i} className="w-1 h-1 bg-blue-950 rounded-full" />)}
              </div>
            </motion.button>
          )}
        </div>
      </header>

      {/* MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-blue-950 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-blue-950/95 backdrop-blur-xl" />

            {/* CLOSE BUTTON - FIXED POSITION + SAFE AREA */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(false)}
              // KEY FIX: pt-[env(safe-area-inset-top)] + right-4 for spacing
              className="absolute top-0 right-4 pt-[env(safe-area-inset-top)] mt-4 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-400 text-blue-950"
              aria-label="Close Navigation Menu"
            >
              {/* CENTERED X USING FLEX */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <motion.div
              variants={mobileMenuContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 text-center px-6 w-full pt-[env(safe-area-inset-top)]" // push content down on iphone
            >
              <ul className="space-y-6">
                {navLinks.map((item) => (
                  <motion.li key={item.path} variants={mobileMenuItem}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-slate-100 hover:text-emerald-400 transition-colors duration-300"
                    >
                      {item.title}
                    </button>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={mobileMenuItem} className="mt-12 pt-8 border-t border-blue-900/60">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4 items-center">
                    <button onClick={() => handleNavClick(user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')} className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold px-8 py-3 rounded-sm text-sm tracking-wider uppercase">
                      Portal ({user?.role})
                    </button>
                    <button onClick={handleLogout} className="text-slate-300 hover:text-emerald-400 text-sm">Logout</button>
                  </div>
                ) : (
                  <button onClick={() => handleNavClick('/login')} className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold px-8 py-3 rounded-sm text-sm tracking-wider uppercase">
                    Portal Sign In
                  </button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default Navbar;