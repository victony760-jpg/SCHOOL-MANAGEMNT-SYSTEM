import { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMyAttendance } from '../../services/api';
import { toast } from 'sonner';
import TableSkeleton from '../../components/ui/TableSkeleton';

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term] = useState('Third Term 2025/2026');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getMyAttendance({ term });
        setAttendanceData(res);
      } catch {
        toast.error('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [term]);

  const presentCount = attendanceData.filter(d => d.status === 'Present').length;
  const absentCount = attendanceData.length - presentCount;
  const rate = attendanceData.length > 0 ? ((presentCount / attendanceData.length) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div className="border-b border-slate-800/80 pb-6">
        <span className="text-emerald-400 text-xs font-mono uppercase">Personal Log</span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">My Attendance Record</h1>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80"><div className="text-slate-400 text-sm">Total Days</div><div className="text-2xl font-bold text-white mt-1">{attendanceData.length}</div></div>
        <div className="p-5 rounded-xl bg-slate-900/70 border-slate-800/80"><div className="text-emerald-400 text-sm">Present</div><div className="text-2xl font-bold text-emerald-400 mt-1">{presentCount}</div></div>
        <div className="p-5 rounded-xl bg-slate-900/70 border-slate-800/80"><div className="text-rose-400 text-sm">Rate</div><div className="text-2xl font-bold text-rose-400 mt-1">{rate}%</div></div>
      </div>

      <div className="rounded-xl bg-slate-900/70 border-slate-800/80 overflow-hidden">
        <div className="p-6 border-b border-slate-800/80"><h2 className="text-lg font-serif font-bold text-white">Term Breakdown: {term}</h2></div>
        {loading ? <TableSkeleton rows={5} cols={2} /> : (
          <div className="p-6 space-y-3">
            {attendanceData.map((item) => (
              <div key={item._id} className="flex justify-between items-center p-4 rounded-lg bg-slate-950/60 border-slate-800/60">
                <div>
                  <span className="text-sm font-mono text-white">{new Date(item.date).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{item.remark}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${item.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentAttendance;