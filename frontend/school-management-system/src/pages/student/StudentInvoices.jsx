import { useEffect, useState } from 'react';
import { getMyInvoices, initializeInvoicePayment } from '../../services/api';
import { toast } from 'sonner';
import { CreditCard, Loader2, FileText, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

const StudentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const invoiceList = await getMyInvoices();
      setInvoices(invoiceList);
    } catch (err) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      const res = await initializeInvoicePayment(id);
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl; // Redirect to Paystack
      } else {
        toast.error('No payment link returned');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setPayingId(null);
    }
  }

  const downloadPDF = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("VICTONY PREPARATORY SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`INVOICE`, 105, 30, { align: "center" });
    doc.text(`Invoice ID: ${inv.invoiceNumber}`, 14, 50);
    doc.text(`Student: ${inv.student?.fullName || 'Me'}`, 14, 58);
    doc.text(`Amount: ₦${inv.amount.toLocaleString()}`, 14, 66);
    doc.text(`Status: ${inv.status}`, 14, 74);
    doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 14, 82);
    doc.save(`${inv.invoiceNumber}.pdf`);
    toast.success(`Invoice ${inv.invoiceNumber} downloaded`);
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-400" /></div>

  const totalDue = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-emerald-400 font-mono tracking-widest uppercase text-xs">Student Portal</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">My Invoices</h1>
          <p className="text-slate-400 text-sm mt-1">Total Outstanding: ₦{totalDue.toLocaleString()}</p>
        </motion.div>

        <div className="space-y-4 mt-6">
          {invoices.length === 0 ? (
            <div className="text-center p-12 bg-blue-900/20 border-blue-900/60 rounded-xl">
              <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-400">No invoices found</p>
              <p className="text-slate-500 text-sm mt-2">Your school administrator must issue an invoice before payment is available.</p>
            </div>
          ) : invoices.map((inv, i) => (
            <motion.div
              key={inv._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-blue-900/20 border border-blue-900/60 rounded-xl p-5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-mono text-amber-400 text-sm">{inv.invoiceNumber}</p>
                  <p className="font-semibold text-white">{inv.description}</p>
                  <p className="text-sm text-slate-400">Class: {inv.student?.classAssigned?.fullClassName || 'Not assigned'}</p>
                  <p className="text-lg font-bold text-white mt-1">₦{inv.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                    {inv.status}
                  </span>
                  <button onClick={() => downloadPDF(inv)} className="p-2 hover:bg-blue-900/40 rounded-lg">
                    <Download size={16} />
                  </button>
                  {inv.status === 'Pending' && (
                    <button
                      onClick={() => handlePay(inv._id)}
                      disabled={payingId === inv._id}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 transition"
                    >
                      {payingId === inv._id ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
export default StudentInvoices;