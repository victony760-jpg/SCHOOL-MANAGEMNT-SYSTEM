import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getClasses } from '../../services/api';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import TableSkeleton from '../../components/ui/TableSkeleton';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', target: 'all' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [annRes, classRes] = await Promise.all([getAnnouncements(), getClasses()]);
      setAnnouncements(annRes);
      setClasses(classRes);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAnnouncement(form);
      toast.success('Announcement posted');
      setForm({ title: '', body: '', target: 'all' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      toast.success('Announcement deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const getTargetName = (target) => {
    if (target === 'all') return 'All Students';
    if (target === 'admin') return 'Administrators';
    return classes.find(c => c._id === target)?.name || target;
  }

  return (
    <div className="p-6 bg-blue-950 min-h-screen text-slate-200">
      <h1 className="text-2xl font-serif font-bold mb-6 text-white">Announcements</h1>

      <form onSubmit={handleCreate} className="bg-blue-900/40 border border-blue-900/50 p-6 rounded-md shadow-lg mb-6">
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-blue-950 border-blue-800 rounded-md p-2 w-full mb-3 focus:border-emerald-400 outline-none" required />
        <textarea placeholder="Message body" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 w-full mb-3 h-24 focus:border-emerald-400 outline-none" required />
        <select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 w-full mb-3 focus:border-emerald-400 outline-none">
          <option value="all">All Students</option>
          <option value="student">Students</option>
          <option value="admin">Administrators</option>
        </select>
        <button disabled={saving} className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 px-4 py-2 rounded-md font-semibold flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Post Announcement
        </button>
      </form>

      <div className="bg-blue-900/40 border-blue-900/50 rounded-md shadow-lg overflow-x-auto">
        {loading ? <TableSkeleton rows={5} cols={4} /> : (
          <table className="w-full text-sm">
            <thead className="bg-blue-900/60 border-b border-blue-800">
              <tr>
                <th className="p-3 text-left font-semibold">Title</th>
                <th className="p-3 text-left font-semibold">Target</th>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-center text-slate-400">No announcements yet</td></tr>
              ) : announcements.map(a => (
                <tr key={a._id} className="border-b border-blue-900/50 hover:bg-blue-900/30">
                  <td className="p-3 font-medium">{a.title}</td>
                  <td className="p-3">{getTargetName(a.audience)}</td>
                  <td className="p-3">{new Date(a.createdAt).toLocaleDateString('en-NG')}</td>
                  <td className="p-3"><button onClick={() => handleDelete(a._id)} className="text-rose-400 hover:text-rose-300"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminAnnouncements;