import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, CheckCircle, XCircle, School, User, Hash } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getMyInvoices, initializeInvoicePayment, verifyInvoicePayment } from '../../services/api';

const StudentInvoice = () => {
  const [user, setUser] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        const invoices = await getMyInvoices();
        setInvoice(invoices[0] || null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load invoices');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const reference = query.get('trxref') || query.get('reference');
    if (!reference) return;

    verifyInvoicePayment(reference)
      .then((updatedInvoice) => {
        if (updatedInvoice) setInvoice(updatedInvoice);
        toast.success('Payment verified');
      })
      .catch(() => toast.error('Payment verification failed'));
  }, []);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await initializeInvoicePayment(invoice._id);
      const paymentUrl = res.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl; // redirect to paystack
      } else {
        toast.error('Payment URL not received');
        setPaying(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to start payment');
      setPaying(false);
    }
  };

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save(`Victony_Invoice_${invoice.invoiceNumber}.pdf`);
  };

  if (loading) return <div className="p-10 text-center text-white">Loading Invoice...</div>;
  if (!invoice) return <div className="p-10 text-center text-slate-400">No invoices available. Ask the school administrator to issue your invoice.</div>;

  const amountPaid = invoice.amountPaid || 0;
  const balance = Math.max(invoice.amount - amountPaid, 0);
  const studentName = invoice.student?.fullName || user?.name || 'Student';
  const studentId = invoice.student?.studentID || user?.studentID || '';
  const studentClass = invoice.student?.classAssigned?.fullClassName || 'Not assigned';

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-10">
      <style>{`@media print {.no-print { display: none; } body { background: white; }}`}</style>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 no-print">
          <h1 className="font-serif text-3xl font-bold text-white mb-4 sm:mb-0">Fee Invoice</h1>
          <div className="flex flex-col xs:flex-row gap-3">
            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold"><Printer className="w-5 h-5" /> Print</button>
            <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-lg font-semibold"><Download className="w-5 h-5" /> Download PDF</button>
          </div>
        </div>
        <motion.div ref={invoiceRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 bg-white text-slate-800 rounded-2xl shadow-2xl p-4 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-emerald-500 pb-6 mb-6">
            <div className="flex min-w-0 items-center gap-3"><div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-emerald-500 rounded-xl flex items-center justify-center"><School className="w-7 h-7 sm:w-9 sm:h-9 text-white" /></div><div className="min-w-0"><h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 break-words">Victony International Academy</h2><p className="text-sm text-slate-500">Lagos, Nigeria</p></div></div>
            <div className="text-left sm:text-right mt-4 sm:mt-0"><p className="text-sm text-slate-500">Academic Session</p><p className="font-bold text-lg text-slate-900">{invoice.academicSession || 'N/A'}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="min-w-0"><h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Bill To</h3><p className="font-bold text-lg flex items-center gap-2 break-words"><User className="w-4 h-4 shrink-0 text-emerald-500" />{studentName}</p><p className="flex items-center gap-2 break-all"><Hash className="w-4 h-4 shrink-0 text-emerald-500" />{studentId}</p><p className="break-words">Class: {studentClass}</p><p className="break-all">Invoice: {invoice.invoiceNumber}</p></div>
            <div className="sm:text-right"><h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Invoice Details</h3><p>Invoice Date: <span className="font-semibold">{new Date(invoice.createdAt).toLocaleDateString()}</span></p><div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{invoice.status === 'Paid' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}Status: {invoice.status}</div></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[360px] mb-8"><thead className="bg-slate-100"><tr><th className="p-3 text-left">Description</th><th className="p-3 text-right">Amount</th></tr></thead><tbody><tr className="border-b"><td className="p-3 break-words">{invoice.description}</td><td className="p-3 text-right whitespace-nowrap">₦{invoice.amount.toLocaleString()}</td></tr><tr className="border-b"><td className="p-3">Amount paid</td><td className="p-3 text-right whitespace-nowrap">₦{amountPaid.toLocaleString()}</td></tr><tr className="bg-slate-50 font-bold"><td className="p-3 text-right">Balance Due:</td><td className="p-3 text-right text-red-600 whitespace-nowrap">₦{balance.toLocaleString()}</td></tr></tbody></table></div>
          {balance > 0 && <button onClick={handlePayment} disabled={paying} className="no-print w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-semibold py-3 rounded-lg">{paying ? 'Redirecting...' : `Pay balance (₦${balance.toLocaleString()})`}</button>}
          <div className="text-center text-xs text-slate-500 border-t mt-8 pt-4">Thank you for choosing Victony International Academy. For inquiries, contact the Bursary.</div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentInvoice;