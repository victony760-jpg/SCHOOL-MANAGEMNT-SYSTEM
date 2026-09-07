import { useState, useEffect } from 'react';
import { getClasses, createClass, deleteClass, updateClass } from '../../services/api';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import TableSkeleton from '../../components/ui/TableSkeleton';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', academicSession: '', arm: 'A', section: 'Senior', subjects: '', tuitionFee: 0, admissionFee: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const classRes = await getClasses();
      setClasses(classRes);
    } catch {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        academicSession: form.academicSession,
        arm: form.arm,
        section: form.section,
        tuitionFee: Number(form.tuitionFee) || 0,
        admissionFee: Number(form.admissionFee) || 0,
        subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      };
      await createClass(payload);
      toast.success('Class created successfully');
      setForm({ name: '', academicSession: '', arm: 'A', section: 'Senior', subjects: '', tuitionFee: 0, admissionFee: 0 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await deleteClass(id);
      toast.success('Class deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleUpdateFees = async (classRecord) => {
    const tuitionFee = window.prompt('Tuition fee', classRecord.tuitionFee || 0);
    if (tuitionFee === null) return;
    const admissionFee = window.prompt('Admission fee', classRecord.admissionFee || 0);
    if (admissionFee === null) return;
    try {
      await updateClass(classRecord._id, {
        tuitionFee: Number(tuitionFee),
        admissionFee: Number(admissionFee),
      });
      toast.success('Class fees updated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update fees');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-blue-950 min-h-screen text-slate-200">
      <h1 className="text-2xl font-serif font-bold text-white">Manage Classes & Fees</h1>
      <p className="text-sm text-slate-400 mt-2 mb-6">Create classes, set tuition/admission fees, and use Edit beside a class fee to update it.</p>

      <form onSubmit={handleCreate} className="bg-blue-900/40 border border-blue-900/50 p-6 rounded-md shadow-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Class Name e.g SSS 3 Science" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none" required />
        <input placeholder="Session e.g. 2025/2026" value={form.academicSession} onChange={e => setForm({ ...form, academicSession: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none" required />
        <input placeholder="Arm e.g. A or Science" value={form.arm} onChange={e => setForm({ ...form, arm: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none" required />
        <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none" required>
          <option value="Primary">Primary</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
        <label className="text-sm text-slate-300">Tuition fee (₦)<input type="number" min="0" placeholder="350000" value={form.tuitionFee} onChange={e => setForm({ ...form, tuitionFee: e.target.value })} className="mt-1 w-full bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none" /></label>
        <label className="text-sm text-slate-300">Admission fee (₦)<input type="number" min="0" placeholder="100000" value={form.admissionFee} onChange={e => setForm({ ...form, admissionFee: e.target.value })} className="mt-1 w-full bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none" /></label>
        <input placeholder="Subjects, comma separated" value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} className="bg-blue-950 border border-blue-800 rounded-md p-2 text-sm focus:border-emerald-400 outline-none md:col-span-2" />
        <button disabled={saving} className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 md:col-span-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create Class
        </button>
      </form>

      <div className="bg-blue-900/40 border border-blue-900/50 rounded-md shadow-lg overflow-x-auto">
        {loading ? <TableSkeleton rows={5} cols={5} /> : (
          <table className="w-full text-sm">
            <thead className="bg-blue-900/60 border-b border-blue-800">
              <tr>
                <th className="p-3 text-left font-semibold">Class Name</th>
                <th className="p-3 text-left font-semibold">Session</th>
                <th className="p-3 text-left font-semibold">Arm</th>
                <th className="p-3 text-left font-semibold">Section</th>
                <th className="p-3 text-left font-semibold">Subjects</th>
                <th className="p-3 text-left font-semibold">Fees</th>
                <th className="p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr><td colSpan="7" className="p-6 text-center text-slate-400">No classes found</td></tr>
              ) : classes.map(c => (
                <tr key={c._id} className="border-b border-blue-900/50 hover:bg-blue-900/30">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.academicSession}</td>
                  <td className="p-3">{c.arm}</td>
                  <td className="p-3">{c.section || '-'}</td>
                  <td className="p-3">{c.subjects?.join(', ') || '-'}</td>
                  <td className="p-3 whitespace-nowrap">₦{Number(c.tuitionFee || 0).toLocaleString()} + ₦{Number(c.admissionFee || 0).toLocaleString()} <button onClick={() => handleUpdateFees(c)} className="ml-2 text-emerald-400 text-xs">Edit</button></td>
                  <td className="p-3 whitespace-nowrap"><button onClick={() => handleDelete(c._id)} className="text-rose-400 hover:text-rose-300" title="Delete class"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminClasses