import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Save, Loader2, CheckCircle, XCircle, Users } from 'lucide-react';
import { getAttendance, postAttendance, getStudents, getClasses } from '../../services/api';
import TableSkeleton from '../../components/ui/TableSkeleton';

const AdminAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const classList = await getClasses();
        setClasses(classList);
        const effectiveClass = selectedClass || classList[0]?._id;
        if (!effectiveClass) {
          setStudents([]);
          return;
        }
        if (!selectedClass) {
          setSelectedClass(effectiveClass);
          return;
        }

        const selectedClassRecord = classList.find(c => c._id === selectedClass);
        const className = selectedClassRecord?.fullClassName || effectiveClass;
        const studentList = await getStudents({ classId: selectedClass, className });
        const studentsData = studentList.data?.students || studentList.students || studentList || [];

        const attendanceRes = await getAttendance({ className, date });
        const attendanceData = attendanceRes;

        const merged = studentsData.map(s => {
          const record = attendanceData.find(a => String(a.student?._id) === String(s._id));
          return { id: s._id, name: s.fullName, status: record?.status || 'Present' };
        });
        setStudents(merged);
      } catch {
        toast.error('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedClass, date]);

  const filteredStudents = useMemo(() =>
    students.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
    [students, search]
  );

  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.length - presentCount;
  const rate = students.length > 0 ? ((presentCount / students.length) * 100).toFixed(1) : 0;

  const toggleStatus = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s));
  };

  const markAll = (status) => setStudents(students.map(s => ({ ...s, status })));

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({ studentId: s.id, status: s.status }));
      const selectedClassRecord = classes.find(c => c._id === selectedClass);
      const className = selectedClassRecord?.fullClassName || selectedClassRecord?.name || selectedClass;
      await postAttendance({ className, date, term: "Third Term 2025/2026", records });
      toast.success(`Attendance for ${date} saved`);
    } catch {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800/80 pb-6 flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">Class Registers</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Daily Attendance Management</h1>
        </div>
        <div className="flex gap-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white" />
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white">
            {classes.map(c => <option key={c._id} value={c._id}>{c.fullClassName || c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80"><div className="text-slate-400 text-sm">Total</div><div className="text-2xl font-bold text-white mt-1">{students.length}</div></div>
        <div className="p-5 rounded-xl bg-slate-900/70 border-slate-800/80"><div className="text-emerald-400 text-sm">Present</div><div className="text-2xl font-bold text-emerald-400 mt-1">{presentCount}</div></div>
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80"><div className="text-rose-400 text-sm">Absent</div><div className="text-2xl font-bold text-rose-400 mt-1">{absentCount}</div></div>
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80"><div className="text-amber-400 text-sm">Rate</div><div className="text-2xl font-bold text-amber-400 mt-1">{rate}%</div></div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-900/50 border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm w-full" /></div>
        <button onClick={() => markAll('Present')} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 rounded-lg text-sm">Mark All Present</button>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg flex items-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
      </div>

      <div className="rounded-xl bg-slate-900/70 border-slate-800/80 overflow-hidden">
        {loading ? <TableSkeleton rows={6} cols={4} /> : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 font-mono text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr><th className="p-4">S/N</th><th className="p-4">Student Name</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-800/30">
                  <td className="p-4 font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-4 font-medium text-white">{st.name}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${st.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>{st.status}</span></td>
                  <td className="p-4 text-right"><button onClick={() => toggleStatus(st.id)} className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200">Toggle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminAttendance;