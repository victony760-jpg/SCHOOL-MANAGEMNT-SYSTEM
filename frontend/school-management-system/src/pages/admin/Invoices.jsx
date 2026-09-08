import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { Search, Download, FileSpreadsheet, Plus, Loader2, X } from 'lucide-react';
import TableSkeleton from '../../components/ui/TableSkeleton';
import { createInvoice, getInvoices, getStudents, deleteInvoice } from '../../services/api';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All, Paid, Pending
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [invoiceResult, studentResult] = await Promise.all([getInvoices(), getStudents()]);
        setInvoices(invoiceResult);
        setStudents(studentResult.data?.students || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load invoices');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredInvoices = useMemo(() =>
    invoices.filter(inv =>
      (filter === 'All' || inv.status === filter) &&
      ((inv.student?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (inv.invoiceNumber || '').toLowerCase().includes(search.toLowerCase()))
    ), [invoices, search, filter]);

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  // 1. EXPORT EXCEL
  const exportExcel = () => {
    const data = filteredInvoices.map(i => ({
      invoiceNumber: i.invoiceNumber,
      student: i.student?.fullName || 'Unknown student',
      amount: `₦${i.amount.toLocaleString()}`,
      status: i.status,
      dueDate: i.dueDate,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, `Victony_Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Exported to Excel");
  }

  // 2. DOWNLOAD PDF
  const downloadPDF = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("VICTONY PREPARATORY SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`INVOICE`, 105, 30, { align: "center" });
    doc.text(`Invoice ID: ${inv.invoiceNumber}`, 14, 50);
    doc.text(`Student: ${inv.student?.fullName || 'Unknown student'}`, 14, 58);
    doc.text(`Class: ${inv.student?.classAssigned?.fullClassName || 'Unassigned'}`, 14, 66);
    doc.text(`Amount: ₦${inv.amount.toLocaleString()}`, 14, 74);
    doc.text(`Status: ${inv.status}`, 14, 82);
    doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 14, 90);
    doc.save(`${inv.invoiceNumber}.pdf`);
    toast.success(`Invoice ${inv.invoiceNumber} downloaded`);
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice permanently?')) return;
    try {
      await deleteInvoice(id);
      setInvoices((current) => current.filter((invoice) => invoice._id !== id));
      toast.success('Invoice deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete invoice');
    }
  };

  // 3. ISSUE NEW INVOICE
  const handleIssueInvoice = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const result = await createInvoice({
        studentId: formData.get('student'),
        description: formData.get('description'),
        amount: Number(formData.get('amount')),
        dueDate: formData.get('dueDate'),
        academicSession: formData.get('academicSession'),
      });
      setInvoices([result.data, ...invoices]);
      setShowModal(false);
      toast.success('Invoice issued');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to issue invoice');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">Bursary Management</span>
          <h1 className="text-3xl font-serif font-bold text-white dark:text-white light:text-slate-900 mt-1">Tuition & Invoices</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={exportExcel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-mono uppercase flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm font-mono uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" /> Issue New
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/70 dark:bg-slate-900/70 light:bg-white border-slate-800/80"><p className="text-sm text-slate-400">Total Invoiced</p><p className="text-2xl font-bold text-white">₦{totalAmount.toLocaleString()}</p></div>
        <div className="p-5 rounded-xl bg-slate-900/70 dark:bg-slate-900/70 light:bg-white border-slate-800/80"><p className="text-sm text-emerald-400">Total Paid</p><p className="text-2xl font-bold text-emerald-400">₦{paidAmount.toLocaleString()}</p></div>
        <div className="p-5 rounded-xl bg-slate-900/70 dark:bg-slate-900/70 light:bg-white border-slate-800/80"><p className="text-sm text-amber-400">Outstanding</p><p className="text-2xl font-bold text-amber-400">₦{(totalAmount - paidAmount).toLocaleString()}</p></div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input placeholder="Search Invoice ID or Student..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900/50 dark:bg-slate-900/50 light:bg-white border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm w-full" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-slate-900/50 dark:bg-slate-900/50 light:bg-white border-slate-800 rounded-lg px-4 py-2 text-sm">
          <option>All</option><option>Paid</option><option>Pending</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-slate-900/70 dark:bg-slate-900/70 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 backdrop-blur-xl overflow-x-auto">
        {loading ? <TableSkeleton rows={5} cols={6} /> : (
          <table className="w-full min-w-225 text-left text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
            <thead className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 font-mono text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Invoice ID</th><th className="p-4">Student</th><th className="p-4">Class</th>
                <th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.length === 0 ? <tr><td colSpan="6" className="p-12 text-center text-slate-400">No invoices found</td></tr> :
                filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-amber-400 whitespace-nowrap">{inv.invoiceNumber}</td>
                    <td className="p-4 font-medium text-white dark:text-white light:text-slate-900 whitespace-nowrap">{inv.student?.fullName || 'Unknown student'}</td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">{inv.student?.classAssigned?.fullClassName || 'Unassigned'}</td>
                    <td className="p-4 font-mono text-white whitespace-nowrap">₦{inv.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        } border`}>{inv.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex min-w-35 justify-end gap-3 whitespace-nowrap">
                        <button onClick={() => downloadPDF(inv)} className="text-xs text-emerald-400 hover:underline font-mono flex items-center gap-1"><Download className="w-3 h-3" /> PDF</button>
                        <button onClick={() => handleDelete(inv._id)} className="text-xs text-rose-400 hover:underline font-mono">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ISSUE INVOICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleIssueInvoice} className="w-full max-w-lg rounded-2xl bg-slate-900 dark:bg-slate-900 light:bg-white border-slate-800 p-8 space-y-4">
            <div className="flex justify-between"><h2 className="text-xl font-bold text-white">Issue New Invoice</h2><button type="button" onClick={() => setShowModal(false)}><X /></button></div>
            <select name="student" required className="w-full bg-slate-950 border-slate-800 rounded-lg p-3 text-white"><option value="">Select student</option>{students.map((student) => <option key={student._id} value={student._id}>{student.fullName} ({student.studentID})</option>)}</select>
            <input name="description" placeholder="Description e.g. 2026/2027 Tuition" required className="w-full bg-slate-950 border-slate-800 rounded-lg p-3 text-white" />
            <input name="amount" type="number" placeholder="Amount e.g 350000" required className="w-full bg-slate-950 border-slate-800 rounded-lg p-3 text-white" />
            <input name="academicSession" placeholder="Academic session e.g. 2026/2027" required className="w-full bg-slate-950 border-slate-800 rounded-lg p-3 text-white" />
            <input name="dueDate" type="date" className="w-full bg-slate-950 border-slate-800 rounded-lg p-3 text-white" />
            <button disabled={saving} className="w-full py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg flex justify-center items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Issue Invoice
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;