import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import api, { deleteAdmission } from '../../services/api';

const AdminAdmissions = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admissions');
      setApplications(res.data?.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admissions/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${status.toLowerCase()}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application permanently?')) return;
    try {
      await deleteAdmission(id);
      setApplications((current) => current.filter((application) => application._id !== id));
      toast.success('Application deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete application');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>

  return (
    <div className="p-4 sm:p-6 space-y-8 min-w-0">
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">Admissions Queue</span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">Review Applications</h1>
        <p className="text-xs text-slate-500">Approving marks application as approved for onboarding</p>
      </div>

      <div className="rounded-xl bg-slate-900/70 border-slate-800/80 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 font-mono text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Photo</th>
                <th className="p-4">Class</th>
                <th className="p-4">Parent</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.length === 0 && (
                <tr><td colSpan="9" className="p-8 text-center text-slate-500">No applications yet</td></tr>
              )}
              {applications.map((app) => (
                <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-800/30">
                  <td className="p-4 font-medium text-white">{app.fullName}</td>
                  <td className="p-4">{app.applicantPhoto ? <a href={app.applicantPhoto} target="_blank" rel="noreferrer"><img src={app.applicantPhoto} alt={app.fullName} className="w-10 h-10 rounded-full object-cover" /></a> : '-'}</td>
                  <td className="p-4 text-amber-400">{app.classApplying?.fullClassName || app.classApplying?.name || '-'}</td>
                  <td className="p-4">{app.parentName}</td>
                  <td className="p-4 text-xs"><div>{app.email}</div><div>{app.phone}</div></td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                      {app.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-xs text-slate-400 max-w-xs">
                    <div>{app.message || '-'}</div>
                    <div>Previous: {app.previousSchool || '-'}</div>
                    {app.documents && <a href={app.documents} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">View document</a>}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex gap-2 justify-end min-w-37.5">
                      {(!app.status || app.status === "New" || app.status === "Pending") && (
                        <>
                          <button onClick={() => updateStatus(app._id, 'Approved')} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg" title="Approve">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button onClick={() => updateStatus(app._id, 'Rejected')} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg" title="Reject">
                            <XCircle className="w-4 h-4 text-rose-400" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(app._id)} className="p-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg" title="Delete">Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminAdmissions;