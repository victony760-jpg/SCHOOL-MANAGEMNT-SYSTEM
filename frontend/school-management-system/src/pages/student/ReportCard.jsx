import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Loader2, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

const ReportCard = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [term, setTerm] = useState('First Term');
  const [session, setSession] = useState('2025/2026');

  const terms = ['First Term', 'Second Term', 'Third Term'];
  const sessions = ['2025/2026', '2024/2025'];

  useEffect(() => {
    fetchReportCard();
  }, [term, session]);

  const fetchReportCard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/grades/me/report-card?term=${term}&session=${session}`);
      const data = res.data?.data;

      if (!data) {
        setReport(null);
        toast.info('No grades found for this term');
        return;
      }

      setReport(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load report card');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(18); doc.setFont("helvetica", "bold");
    doc.text("VICTONY INTERNATIONAL ACADEMY", 105, 20, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("Excellence in Character & Learning", 105, 26, { align: "center" });

    doc.setFontSize(12);
    doc.text(`STUDENT REPORT CARD`, 14, 40);
    doc.text(`Term: ${report.term}`, 14, 48);
    doc.text(`Name: ${report.student.fullName}`, 14, 56);
    doc.text(`Class: ${report.class}`, 14, 64);
    doc.text(`Admission No: ${report.studentID}`, 14, 72);

    doc.autoTable({
      startY: 80,
      head: [['Subject', 'CA (40)', 'Exam (60)', 'Total (100)', 'Grade', 'Remark']],
      body: report.subjects.map(s => [s.name, s.ca, s.exam, s.total, s.grade, s.remark]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Average: ${report.average}%`, 14, finalY);
    doc.text(`Position: ${report.position}`, 14, finalY + 8);
    doc.text(`Principal's Remark: ${report.principalRemark}`, 14, finalY + 18, { maxWidth: 180 });

    doc.save(`${report.student.fullName}_ReportCard_${report.term}.pdf`);
    toast.success("Report card downloaded successfully");
  };

  if (loading) return <div className="max-w-4xl mx-auto p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header with Term Selector */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2"><Calendar size={14} />{report?.term || 'Select Term'}</span>
            <h1 className="text-3xl font-serif font-bold text-white mt-1">Terminal Report Card</h1>
          </div>
          <div className="flex gap-2">
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="bg-slate-900 border-slate-800 rounded-lg px-3 py-2 text-sm text-white">
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={session} onChange={(e) => setSession(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white">
              {sessions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {report && <button onClick={downloadPDF} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm font-mono uppercase flex items-center gap-2"><Download className="w-4 h-4" />PDF</button>}
          </div>
        </div>
      </div>

      {!report ? (
        <div className="text-center p-12 bg-slate-900/50 rounded-xl border border-slate-800">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No grades recorded for {term} {session}.</p>
          <p className="text-slate-500 text-sm mt-2">Your teacher or administrator must enter and save grades before they appear here.</p>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900/70 border-slate-800/80 backdrop-blur-xl space-y-8">
          <div className="flex flex-wrap justify-between gap-4 border-b border-slate-800 pb-4 text-sm font-mono">
            <div><span className="text-slate-400">Student:</span> <span className="text-white font-bold">{report.student.fullName}</span></div>
            <div><span className="text-slate-400">Class:</span> <span className="text-amber-400 font-bold">{report.class}</span></div>
            <div><span className="text-slate-400">Admission No:</span> <span className="text-white font-bold">{report.studentID}</span></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 font-mono text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">CA (40)</th>
                  <th className="p-3">Exam (60)</th>
                  <th className="p-3">Total (100)</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {report.subjects.map((sub, i) => (
                  <tr key={i}>
                    <td className="p-3 font-sans font-medium text-white">{sub.name}</td>
                    <td className="p-3 text-slate-400">{sub.ca}</td>
                    <td className="p-3 text-slate-400">{sub.exam}</td>
                    <td className="p-3 text-emerald-400 font-bold">{sub.total}</td>
                    <td className="p-3 text-amber-400 font-bold">{sub.grade}</td>
                    <td className="p-3 text-xs text-slate-400">{sub.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-slate-950/60">
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Average</h4>
              <p className="text-2xl font-bold text-emerald-400">{report.average}%</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-950/60">
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Position</h4>
              <p className="text-2xl font-bold text-amber-400">{report.position}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border-slate-800/80">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Principal's Remarks</h4>
            <p className="text-sm text-slate-200 italic">"{report.principalRemark}"</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReportCard;