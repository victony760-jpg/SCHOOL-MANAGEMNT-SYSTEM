import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { updateStudent } from '../../services/api';
import { toast } from 'sonner';

const EditStudentModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      fullName: student.fullName || '',
      parentName: student.parentName || '',
      parentEmail: student.parentEmail || '',
      parentPhone: student.parentPhone || '',
      feeStatus: student.feeStatus || 'Pending',
      admissionStatus: student.admissionStatus || 'pending'
    });
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudent(student._id, form);
      toast.success('Student updated');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-blue-950 border border-blue-900/60 rounded-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-blue-900/60">
          <h2 className="font-serif text-xl font-bold text-white">Edit Student: {student.fullName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-900/40 rounded-lg"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full Name" className="bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white" />
            <input name="parentName" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Parent Name" className="bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="parentEmail" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} placeholder="Parent Email" className="bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white" />
            <input name="parentPhone" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} placeholder="Parent Phone" className="bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <select value={form.feeStatus} onChange={(e) => setForm({ ...form, feeStatus: e.target.value })} className="bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white">
              <option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Owing">Owing</option>
            </select>
            <select value={form.admissionStatus} onChange={(e) => setForm({ ...form, admissionStatus: e.target.value })} className="bg-blue-900/40 border-blue-900/60 rounded-lg px-4 py-3 text-white">
              <option value="pending">Pending</option><option value="approved">Approved</option><option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-800 rounded-lg text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-blue-950 rounded-lg text-sm font-bold flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditStudentModal;