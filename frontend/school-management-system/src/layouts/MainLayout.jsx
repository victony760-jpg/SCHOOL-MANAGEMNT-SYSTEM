import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import {
  LayoutDashboard, CalendarDays, BookOpen, Receipt, UserPlus,
  LogOut, Menu, X, Bell, User, School, Megaphone, Users,
  ClipboardList, UserRoundCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // your auth

const adminMenu = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Add Student', icon: UserPlus, path: '/admin/add-student' },
  { name: 'Students', icon: Users, path: '/admin/students' },
  { name: 'Classes', icon: School, path: '/admin/classes' },
  { name: 'Admissions', icon: UserRoundCheck, path: '/admin/admissions' },
  { name: 'Attendance', icon: CalendarDays, path: '/admin/attendance' },
  { name: 'Grades', icon: BookOpen, path: '/admin/grades' },
  { name: 'Invoices', icon: Receipt, path: '/admin/invoices' },
  { name: 'Visits', icon: ClipboardList, path: '/admin/visits' },
  { name: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
];

const studentMenu = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { name: 'Report Card', icon: BookOpen, path: '/student/report-card' },
  { name: 'Attendance', icon: CalendarDays, path: '/student/attendance' },
  { name: 'Invoices', icon: Receipt, path: '/student/invoices' },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // 1. ROLE GUARD - same as your old layouts
  const requiredRole = location.pathname.includes('/admin') ? 'admin' : 'student';
  if (!user || user.role?.toLowerCase() !== requiredRole) {
    return <Navigate to="/login" replace />; // kick them out if wrong role
  }

  const menu = requiredRole === 'admin' ? adminMenu : studentMenu;

  return (
    <div className="flex min-h-screen lg:h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-x-hidden">
      <Toaster position="top-right" richColors />

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`fixed lg:relative z-50 w-64 h-dvh lg:h-full bg-slate-900 dark:bg-slate-900 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-serif font-bold text-emerald-400">VICTONY</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X /></button>
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-8 bg-slate-900/50 dark:bg-slate-900/50 light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu /></button>

          <div className="flex items-center gap-4 ml-auto">
            <button><Bell className="w-5 h-5" /></button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><User className="w-4 h-4 text-emerald-400" /></div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}