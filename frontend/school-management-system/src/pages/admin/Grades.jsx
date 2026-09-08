import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { getGrades, postGrades, getClasses, getStudents } from '../../services/api';
import TableSkeleton from '../../components/ui/TableSkeleton';

const getGrade = (total) => {
  if (total >= 75) return { grade: 'A' };
  if (total >= 70) return { grade: 'B' };
  if (total >= 60) return { grade: 'C' };
  if (total >= 50) return { grade: 'D' };
  if (total >= 40) return { grade: 'E' };
  return { grade: 'F' };
}

const AdminGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [term, setTerm] = useState('Third Term');
  const [session, setSession] = useState('2025/2026');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const loadClasses = async () => {
      const classList = await getClasses();
      setClasses(classList);
      if (classList.length > 0) setSelectedClass(classList[0].fullClassName || classList[0].name);
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadGrades = async () => {
      if (!selectedClass || !selectedSubject) return;
      setLoading(true);
      try {
        const selectedClassRecord = classes.find(c => (c.fullClassName || c.name) === selectedClass);
        const className = selectedClassRecord?.fullClassName || selectedClass;
        const [studentList, gradeRes] = await Promise.all([
          getStudents({ classId: selectedClassRecord?._id, className }),
          getGrades({ className, subject: selectedSubject, term, session })
        ]);
        const students = studentList.data?.students || studentList.students || studentList || [];
        const gradeData = gradeRes;

        const merged = students.map(s => {
          const record = gradeData.find(g => String(g.student?._id) === String(s._id));
          return { id: s._id, student: s.fullName, caScore: record?.caScore || 0, examScore: record?.examScore || 0 };
        });
        setGrades(merged);
      } catch {
        toast.error('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(loadGrades, 300);
    return () => clearTimeout(timer);
  }, [selectedClass, selectedSubject, term, session]);

  const updateScore = (id, field, val) => {
    const max = field === 'caScore' ? 40 : 60;
    const numVal = Math.min(max, Math.max(0, Number(val) || 0));
    setGrades(grades.map(g => g.id === id ? { ...g, [field]: numVal } : g));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const records = grades.map(g => ({ studentId: g.id, caScore: g.caScore, examScore: g.examScore }));
      const selectedClassRecord = classes.find(c => (c.fullClassName || c.name) === selectedClass);
      const className = selectedClassRecord?.fullClassName || selectedClass;
      await postGrades({ className, subject: selectedSubject, term, session, records });
      toast.success(`Grades saved successfully`);
    } catch {
      toast.error('Failed to save grades');
    } finally {
      setSaving(false);
    }
  }

  const classAverage = useMemo(() => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, g) => sum + g.caScore + g.examScore, 0);
    return (total / grades.length).toFixed(1);
  }, [grades]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-emerald-400 text-xs font-mono uppercase">Academic Assessment</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Gradebook & Assessment Entry</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full sm:w-auto min-w-0 bg-slate-900/50 border-slate-800 rounded-lg px-4 py-2 text-sm text-white">
          {classes.map(c => <option key={c._id} value={c.fullClassName || c.name}>{c.fullClassName || c.name}</option>)}
        </select>
        <input placeholder="Subject e.g Mathematics" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full sm:flex-1 sm:min-w-48 bg-slate-900/50 border-slate-800 rounded-lg px-4 py-2 text-sm text-white" />
        <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full sm:w-auto bg-slate-900/50 border-slate-800 rounded-lg px-4 py-2 text-sm text-white">
          {['First Term', 'Second Term', 'Third Term'].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full sm:w-auto bg-slate-900/50 border-slate-800 rounded-lg px-4 py-2 text-sm text-white">
          {['2025/2026', '2024/2025'].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <button onClick={handleSaveAll} disabled={saving || !selectedSubject} className="w-full sm:w-auto justify-center px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg flex items-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All</button>
      </div>

      <div className="p-5 rounded-xl bg-slate-900/70 border-slate-800/80">
        <p className="text-sm text-slate-400">Class Average</p>
        <p className="text-3xl font-bold text-emerald-400">{classAverage} / 100</p>
      </div>

      <div className="rounded-xl bg-slate-900/70 border-slate-800/80 overflow-x-auto">
        {loading ? <TableSkeleton rows={8} cols={6} /> : (
          <table className="w-full min-w-[640px] text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 font-mono text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr><th className="p-4">S/N</th><th className="p-4">Student</th><th className="p-4">C.A (40)</th><th className="p-4">Exam (60)</th><th className="p-4">Total</th><th className="p-4">Grade</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {grades.map((row, idx) => {
                const total = row.caScore + row.examScore;
                const { grade } = getGrade(total);
                return (
                  <tr key={row.id} className="hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-4 font-medium text-white">{row.student}</td>
                    <td className="p-4"><input type="number" value={row.caScore} onChange={(e) => updateScore(row.id, 'caScore', e.target.value)} className="w-20 bg-slate-950 border border-slate-800 rounded p-1 text-center text-white" /></td>
                    <td className="p-4"><input type="number" value={row.examScore} onChange={(e) => updateScore(row.id, 'examScore', e.target.value)} className="w-20 bg-slate-950 border border-slate-800 rounded p-1 text-center text-white" /></td>
                    <td className="p-4 font-mono font-bold text-emerald-400">{total}</td>
                    <td className="p-4 font-mono font-bold">{grade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminGrades;