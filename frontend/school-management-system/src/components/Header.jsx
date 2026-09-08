// src/components/common/Header.jsx
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-blue-950/90 backdrop-blur-md border-b border-blue-900/50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Section: Hamburger + Welcome */}
      <div className="flex items-center gap-4">
        {/* Hamburger - Same as Navbar Menu Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 w-10 h-10 rounded-full text-blue-950 bg-emerald-500 hover:bg-emerald-400 lg:hidden flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all duration-300"
          aria-label="Open Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.3em] text-emerald-400 uppercase hidden sm:block">
            VICTONY INTERNATIONAL ACADEMY
          </p>
        </div>
      </div>

      {/* Right Section: Badge + Notifications */}
      <div className="flex items-center gap-3">
        {/* Term Badge - Glass pill like Navbar */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          FIRST TERM
        </span>

        {/* Notifications - Same circle button as Navbar */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0.538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-blue-950" />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;