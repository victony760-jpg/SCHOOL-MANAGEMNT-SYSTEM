import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, User, CheckCircle, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { getVisits, updateVisitStatus } from '../../services/api';

const AdminVisits = () => {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        const res = await getVisits();
        setVisits(res.data || res || []);
      } catch {
        toast.error('Failed to load visits');
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateVisitStatus(id, status);
      setVisits(visits.map(v => v._id === id ? { ...v, status } : v))
      toast.success(`Visit marked as ${status}`)
    } catch {
      toast.error('Failed to update visit');
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">Campus Tours</span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">Scheduled Visits</h1>
        <p className="text-sm text-slate-400 mt-1">Parents who requested to visit the school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits.length === 0 ? <p className="text-slate-400">No scheduled visits</p> :
          visits.map((visit) => (
            <motion.div key={visit._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/30 transition">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${visit.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : visit.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : visit.status === 'Rejected' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>{visit.status}</span>
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">{visit.fullName}</h3>
              <div className="space-y-2 mt-3 text-sm">
                <p className="flex items-center gap-2 text-slate-400"><User className="w-4 h-4" /> Interested in: <span className="text-amber-400">{visit.classInterested}</span></p>
                <p className="flex items-center gap-2 text-slate-400"><Phone className="w-4 h-4" /> {visit.phone}</p>
                <p className="flex items-center gap-2 text-slate-400"><Calendar className="w-4 h-4" /> {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
              {visit.status === "Pending" && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleStatus(visit._id, 'Approved')} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleStatus(visit._id, 'Rejected')} className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg text-sm flex items-center justify-center gap-2">
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))
        }
      </div>
    </div>
  );
};
export default AdminVisits;