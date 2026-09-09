import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, FileText, Calendar, DollarSign, ChevronDown, Loader2, Quote, Send } from 'lucide-react';
import { toast } from 'sonner';
import admissionsHero from '../assets/pexels-gera-cejas-3616330-37762503.jpg';
import { getClasses, submitAdmission } from '../services/api';

const Admissions = () => {
  const initialFormState = {
    fullName: '', dob: '', gender: 'Male', parentName: '', email: '', phone: '', classApplying: '', previousSchool: '', message: '', documents: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classList = await getClasses();
        setClasses(classList);
      } catch (err) {
        toast.error('Failed to load classes');
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.fullName || !formData.parentName || !formData.email || !formData.dob || !formData.classApplying) {
      toast.error("Please fill all required fields: Student Name, DOB, Parent, Email, Class");
      setIsSubmitting(false);
      return;
    }

    if (!formData.applicantPhoto) {
      toast.error('Please select an applicant photo before submitting.');
      setIsSubmitting(false);
      return;
    }

    const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedPhotoTypes.includes(formData.applicantPhoto.type)) {
      toast.error('Applicant photo must be JPG, PNG, or WEBP.');
      setIsSubmitting(false);
      return;
    }

    if (formData.applicantPhoto.size > 10 * 1024 * 1024) {
      toast.error('Applicant photo must be smaller than 10 MB.');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });

      await submitAdmission(data);
      toast.success('Application Submitted! Admin will review and email you within 48hrs');
      setSubmitted(true);
      setFormData(initialFormState);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Admission submission failed:', err.response?.data || err);
      toast.error(
        err.code === 'ECONNABORTED'
          ? 'The upload is taking too long. Please try again.'
          : err.response?.data?.message || 'Submission failed',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);
  const inputClass = "w-full bg-blue-900/40 border border-blue-900/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition";

  const fees = [
    { grade: 'Nursery - KG', tuition: '₦450,000', admission: '₦100,000', total: '₦550,000' },
    { grade: 'Primary 1 - 3', tuition: '₦500,000', admission: '₦100,000', total: '₦600,000' },
    { grade: 'Primary 4 - 6', tuition: '₦550,000', admission: '₦100,000', total: '₦650,000' },
    { grade: 'JSS 1 - 3', tuition: '₦650,000', admission: '₦150,000', total: '₦800,000' },
    { grade: 'SSS 1 - 3', tuition: '₦700,000', admission: '₦150,000', total: '₦850,000' },
  ];

  const faqs = [
    { q: 'Do you offer boarding facilities?', a: 'Yes. We have both male and female hostels with 24/7 supervision, modern amenities, and dedicated house tutors.' },
    { q: 'What curriculum do you follow?', a: 'We run the Nigerian Curriculum blended with British and STEM programs to ensure balanced global academic exposure.' },
    { q: 'Is there a school bus service?', a: 'Yes, we operate safe and monitored bus routes across major areas. Contact admin for specific pickup points.' },
    { q: 'When is the entrance examination scheduled?', a: 'Entrance exams take place every Saturday from October through December for the upcoming academic session.' },
  ];

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden border-b border-blue-900/60">
        <img src={admissionsHero} alt="Students in class" className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" />
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/80 to-blue-900/90 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-emerald-400 font-serif tracking-[0.3em] uppercase text-xs font-semibold">2026/2027 Session</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-3">Admissions</h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">Join Victony International Academy. Applications are now open for all classes.</p>
          <a href="#apply" className="inline-block mt-6 bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-bold px-8 py-4 rounded-lg text-sm tracking-widest uppercase transition">Apply Now</a>
        </div>
      </section>

      {/* FEES */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-white text-center mb-2 flex justify-center items-center gap-3"><DollarSign className="text-emerald-400" /> Fee Structure 2026/2027</h2>
        <p className="text-slate-400 text-center mb-10">All fees are per academic session. Payment can be made in 3 installments.</p>
        <div className="overflow-x-auto border-blue-900/60 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-blue-900/40"><tr><th className="p-4 font-serif text-white">Grade Level</th><th className="p-4 font-serif text-white">Tuition</th><th className="p-4 font-serif text-white">Admission Fee</th><th className="p-4 font-serif text-white">Total</th></tr></thead>
            <tbody>{classes.some((item) => item.tuitionFee || item.admissionFee) ? classes.map((item) => {
              const tuition = Number(item.tuitionFee || 0);
              const admission = Number(item.admissionFee || 0);
              return <tr key={item._id} className="border-t border-blue-900/60 hover:bg-blue-900/20 transition"><td className="p-4 font-semibold text-slate-200">{item.fullClassName || item.name}</td><td className="p-4 text-slate-300">₦{tuition.toLocaleString()}</td><td className="p-4 text-slate-300">₦{admission.toLocaleString()}</td><td className="p-4 text-emerald-400 font-bold">₦{(tuition + admission).toLocaleString()}</td></tr>;
            }) : fees.map((fee, idx) => (<tr key={idx} className="border-t border-blue-900/60 hover:bg-blue-900/20 transition"><td className="p-4 font-semibold text-slate-200">{fee.grade}</td><td className="p-4 text-slate-300">{fee.tuition}</td><td className="p-4 text-slate-300">{fee.admission}</td><td className="p-4 text-emerald-400 font-bold">{fee.total}</td></tr>))}</tbody>
          </table>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="apply" className="py-20 px-6 bg-blue-900/20 border-t border-blue-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-white text-center mb-8">Application Form</h2>
          {submitted && (<div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg mb-6 text-center font-medium">Application Received! Admin will contact you within 48 hours.</div>)}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-blue-950/60 p-8 rounded-xl border-blue-900/60 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Student Full Name *" required className={inputClass} />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Parent/Guardian Name *" required className={inputClass} />
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="Male">Male</option><option value="Female">Female</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Parent Email Address *" required className={inputClass} />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Applying For Class *</label>
              {loadingClasses ? <div className="flex justify-center p-3"><Loader2 className="animate-spin text-emerald-400" /></div> :
                <select name="classApplying" value={formData.classApplying} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.fullClassName || c.name}</option>)}
                </select>}
            </div>

            <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} placeholder="Previous School" className={inputClass} />

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Applicant Photo *</label>
              <input type="file" name="applicantPhoto" onChange={handleChange} accept=".jpg,.jpeg,.png,.webp" required className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-emerald-500 file:text-blue-950 hover:file:bg-emerald-400" />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Upload Documents: Birth Cert, Last Report Card</label>
              <input type="file" name="documents" onChange={handleChange} accept=".pdf,.jpg,.png" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-emerald-500 file:text-blue-950 hover:file:bg-emerald-400" />
            </div>

            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Any Questions or Additional Information" rows="4" className={`${inputClass} resize-none`} />

            <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-blue-950 font-bold px-8 py-4 rounded-lg text-sm tracking-widest uppercase transition flex items-center justify-center gap-2">
              {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>) : (<><Send className="w-5 h-5" />Submit Application</>)}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 sm:px-12 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-blue-900/20 border-blue-900/60 rounded-lg overflow-hidden">
              <button onClick={() => toggleFaq(i)} className="w-full p-5 text-left font-serif text-lg font-bold text-white flex justify-between items-center transition hover:bg-blue-900/30">
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-blue-900/30 pt-3">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
export default Admissions;