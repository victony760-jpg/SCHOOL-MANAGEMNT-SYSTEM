import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getStudents, approveStudent, rejectStudent, toggleStudentActive, deleteStudent, updateStudent } from '../../services/api';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2, UserPlus, Search, Edit, Trash2, TrendingUp, Ban, ShieldOff, Shield } from 'lucide-react';
import EditStudentModal from './EditStudentModal';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace('/api', '');

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionId, setActionId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents({ search, className: classFilter, admissionStatus: statusFilter, isActive: activeFilter, page, limit: 15 });
      const resData = response.data?.data || response.data || response;
      setStudents(resData.students || []);
      setTotalPages(resData.pagination?.pages || 1);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [search, classFilter, statusFilter, activeFilter, page]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await approveStudent(id);
      toast.success('Student Approved');
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this student application?')) return;
    setActionId(id);
    try {
      await rejectStudent(id);
      toast.success('Student Rejected');
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reject failed');
    } finally {
      setActionId(null);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    const action = currentStatus ? 'Deactivate' : 'Activate';
    if (!confirm(`${action} this student?`)) return;
    setActionId(id);
    try {
      await toggleStudentActive(id);
      toast.success(`Student ${action}d`);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone`)) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted');
      fetchStudents();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handlePromote = async (id) => {
    try {
      await updateStudent(id, { promote: true });
      toast.success('Student promoted');
      fetchStudents();
    } catch {
      toast.error('Promotion failed');
    }
  };

  const getPhoto = (s) => {
    if (!s.photoUrl) return null;
    return s.photoUrl.startsWith('http') ? s.photoUrl : `${API_URL}${s.photoUrl}`;
  };

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'ST';

  const getStatusBadge = (status, isActive) => {
    if (!isActive) return <span className="text-slate-400 flex items-center gap-1.5 text-xs font-semibold"><Ban size={14} />Inactive</span>
    if (status === 'approved') return <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-semibold"><CheckCircle size={14} />Approved</span>
    if (status === 'rejected') return <span className="text-rose-400 flex items-center gap-1.5 text-xs font-semibold"><XCircle size={14} />Rejected</span>
    return <span className="text-amber-400 flex items-center gap-1.5 text-xs font-semibold"><XCircle size={14} />Pending</span>
  }

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen">
      <section className="pt-24 pb-8 px-6 border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">Student Management</h1>
            <p className="text-slate-400 text-sm mt-2">Manage all student accounts, classes and approvals</p>
          </div>
          <Link to="/admin/add-student" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-semibold rounded-lg flex items-center gap-2 text-sm">
            <UserPlus size={16} /> Add Student
          </Link>
        </div>
      </section>

      <section className="py-6 px-6 max-w-7xl mx-auto">
        <div className="bg-blue-900/20 border-blue-900/60 rounded-xl p-4 flex-col md:flex-row gap-4 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by name, ID, parent email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full bg-blue-950/60 border border-blue-900/60 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 outline-none" />
          </div>
          <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setPage(1); }} className="bg-blue-950/60 border-blue-900/60 rounded-lg px-4 py-2 text-sm text-white">
            <option value="">All Classes</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-blue-950/60 border-blue-900/60 rounded-lg px-4 py-2 text-sm text-white">
            <option value="">All Admission</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={activeFilter} onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }} className="bg-blue-950/60 border-blue-900/60 rounded-lg px-4 py-2 text-sm text-white">
            <option value="">All Accounts</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-10">
        <motion.div className="bg-blue-900/20 border-blue-900/60 rounded-xl overflow-x-auto">
          {loading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-400" /></div> : (
            <table className="w-full text-left">
              <thead className="border-b border-blue-900/60 bg-blue-900/20">
                <tr className="text-slate-400 text-xs">
                  <th className="p-4 font-mono uppercase">Student</th>
                  <th className="p-4 font-mono uppercase">ID</th>
                  <th className="p-4 font-mono uppercase">Class</th>
                  <th className="p-4 font-mono uppercase">Parent</th>
                  <th className="p-4 font-mono uppercase">Status</th>
                  <th className="p-4 font-mono uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-10 text-slate-400">No students found</td></tr>
                ) : students.map((s) => (
                  <tr key={s._id} className={`border-b border-blue-900/40 hover:bg-blue-900/30 transition ${!s.user?.isActive ? 'opacity-50' : ''}`}>
                    <td className="p-4 flex items-center gap-3">
                      {getPhoto(s) ? (
                        <img src={getPhoto(s)} alt={s.fullName} className="w-9 h-9 rounded-md object-cover border border-blue-900/60" />
                      ) : (
                        <span className="w-9 h-9 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold">
                          {getInitials(s.fullName)}
                        </span>
                      )}
                      <div>
                        <span className="font-semibold text-sm">{s.fullName}</span>
                        <p className="text-xs text-slate-400">{s.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-emerald-400 text-sm">{s.studentID}</td>
                    <td className="p-4 text-sm">{s.classAssigned?.fullClassName || 'Unassigned'}</td>
                    <td className="p-4 text-sm">{s.parentName}<p className="text-xs text-slate-400">{s.parentPhone}</p></td>
                    <td className="p-4">{getStatusBadge(s.admissionStatus, s.user?.isActive)}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        {s.admissionStatus === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(s._id)} disabled={actionId === s._id} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg">
                              {actionId === s._id ? <Loader2 size={14} className="animate-spin text-emerald-400" /> : <CheckCircle size={14} className="text-emerald-400" />}
                            </button>
                            <button onClick={() => handleReject(s._id)} disabled={actionId === s._id} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg">
                              <XCircle size={14} className="text-rose-400" />
                            </button>
                          </>
                        )}
                        <button onClick={() => handleToggleActive(s.user?._id, s.user?.isActive)} disabled={actionId === s.user?._id} className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg">
                          {s.user?.isActive ? <ShieldOff size={14} className="text-amber-400" /> : <Shield size={14} className="text-emerald-400" />}
                        </button>
                        <button onClick={() => setEditingStudent(s)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg"><Edit size={14} className="text-blue-400" /></button>
                        <button onClick={() => handlePromote(s._id)} className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg"><TrendingUp size={14} className="text-amber-400" /></button>
                        <button onClick={() => handleDelete(s._id, s.fullName)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg"><Trash2 size={14} className="text-rose-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 bg-slate-800 disabled:opacity-50 rounded-lg text-sm">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 bg-slate-800 disabled:opacity-50 rounded-lg text-sm">Next</button>
          </div>
        </div>
      </section>

      {editingStudent && <EditStudentModal student={editingStudent} onClose={() => setEditingStudent(null)} onSave={fetchStudents} />}
    </main>
  );
};
export default AdminStudents;