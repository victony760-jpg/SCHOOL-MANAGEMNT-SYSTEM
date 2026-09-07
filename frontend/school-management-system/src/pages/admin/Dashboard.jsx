import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRecentActivity } from '../../services/api';
import { toast } from 'sonner';
import { Users, DollarSign, CheckCircle, Clock, UserPlus, CalendarDays, BookOpen, Receipt, Loader2, FileText, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsData, activityData] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ]);
        setStats(statsData);
        setRecentActivities(activityData);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount || 0);

  if (loading) return <div className="flex justify-center items-center min-h-[70vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-emerald-400 text-xs tracking-[0.2em] font-mono uppercase">System Overview</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">Admin Portal Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/students" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2"><Users className="w-4 h-4" /> Manage Students</Link>
          <Link to="/admin/add-student" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-lg flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add New Student</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80"><div className="flex items-center justify-between mb-4"><span className="text-sm text-slate-400">Total Students</span><Users className="w-6 h-6 text-emerald-400" /></div><div className="text-3xl font-bold text-white">{stats.totalStudents?.toLocaleString() || 0}</div></motion.div>
        <motion.div className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80"><div className="flex items-center justify-between mb-4"><span className="text-sm text-slate-400">Term Revenue</span><DollarSign className="w-6 h-6 text-amber-400" /></div><div className="text-3xl font-bold text-white">{formatCurrency(stats.revenueThisMonth)}</div></motion.div>
        <motion.div className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80"><div className="flex items-center justify-between mb-4"><span className="text-sm text-slate-400">Attendance Rate</span><CheckCircle className="w-6 h-6 text-blue-400" /></div><div className="text-3xl font-bold text-white">{stats.attendanceRate || 0}%</div></motion.div>
        <motion.div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800/80"><div className="flex items-center justify-between mb-4"><span className="text-sm text-slate-400">Pending Fees</span><Clock className="w-6 h-6 text-rose-400" /></div><div className="text-3xl font-bold text-white">{formatCurrency(stats.pendingFees)}</div></motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link to="/admin/attendance" className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/30 text-center"><CalendarDays className="w-6 h-6 mx-auto text-emerald-400" /><p className="text-sm mt-2 text-slate-300">Attendance</p></Link>
        <Link to="/admin/grades" className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/30 text-center"><BookOpen className="w-6 h-6 mx-auto text-emerald-400" /><p className="text-sm mt-2 text-slate-300">Grades</p></Link>
        <Link to="/admin/invoices" className="p-4 rounded-lg bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/30 text-center"><Receipt className="w-6 h-6 mx-auto text-emerald-400" /><p className="text-sm mt-2 text-slate-300">Bursary</p></Link>
        <Link to="/admin/admissions" className="p-4 rounded-lg bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/30 text-center"><FileText className="w-6 h-6 mx-auto text-emerald-400" /><p className="text-sm mt-2 text-slate-300">Admissions</p></Link>
        <Link to="/admin/visits" className="p-4 rounded-lg bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/30 text-center"><Calendar className="w-6 h-6 mx-auto text-emerald-400" /><p className="text-sm mt-2 text-slate-300">Visits</p></Link>
      </div>

      <div className="rounded-xl bg-slate-900/70 border border-slate-800/80">
        <div className="p-6 border-b border-slate-800/80"><h2 className="text-lg font-serif font-bold text-white">Recent Portal Activity</h2></div>
        <div className="p-6 space-y-3">
          {recentActivities.length === 0 ? <p className="text-slate-400 text-sm">No recent activity</p> :
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                <div><p className="font-medium text-white">{activity.name}</p><p className="text-xs text-slate-400">{activity.type} - {activity.class}</p></div>
                <span className="text-xs text-slate-500">{activity.date}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;