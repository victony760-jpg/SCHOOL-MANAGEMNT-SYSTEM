// src/components/common/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { studentNav, adminNav } from '../config/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role?.toLowerCase() === 'admin' ? 'admin' : 'student';
  const currentNav = role === 'admin' ? adminNav : studentNav;

  const isLinkActive = (path) => {
    if (path === '/dashboard' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            aria-hidden="true"
            className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-blue-950 border-r border-blue-900/50 flex-col justify-between transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div>
          {/* Header Branding - Matches Navbar logo */}
          <div className="h-20 flex items-center px-6 border-b border-blue-900/50">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-950 border border-emerald-500/40 rounded-sm flex items-center justify-center font-serif font-bold text-emerald-400 text-xl shadow-lg group-hover:border-emerald-400 transition-colors drop-shadow-md">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm tracking-wider text-white leading-none drop-shadow-md">
                  VICTONY
                </span>
                <span className="font-serif text-[8px] tracking-[0.2em] text-emerald-400/90 font-medium uppercase leading-tight mt-1">
                  {role === 'admin' ? 'ADMIN CONSOLE' : 'ACADEMY PORTAL'}
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links - Scrollable */}
          <div className="px-4 py-6 space-y-1 h-[calc(100vh-11rem)] overflow-y-auto">
            <p className="px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3">
              {role === 'admin' ? 'Administration' : 'Student Navigation'}
            </p>

            {currentNav.map((item) => {
              const active = isLinkActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isOpen && toggleSidebar()}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 border-r-2 ${active
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-blue-900/40 border-transparent'
                    }`}
                >
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-blue-900/50 bg-blue-950">
          <div className="flex items-center justify-between p-2 rounded-md bg-blue-900/40 border-blue-800/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs flex-shrink-0 font-serif">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">{user?.name || 'User Account'}</span>
                <span className="text-[10px] text-slate-500 capitalize">{role}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-md hover:bg-blue-900"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;