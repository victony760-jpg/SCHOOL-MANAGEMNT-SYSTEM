import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Upload, User, Mail, Key, IdCard } from 'lucide-react';
import { createStudent, getClasses } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '', dob: '', gender: 'Male', classAssigned: '',
    parentName: '', parentEmail: '', parentPhone: '', photo: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getClasses()
      .then((classList) => setClasses(classList))
      .catch(() => toast.error('Unable to load classes'));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files[0]) {
      setFormData({ ...formData, photo: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.dob || !formData.parentName || !formData.parentEmail || !formData.parentPhone) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('classAssigned', formData.classAssigned);
    formDataToSend.append('parentEmail', formData.parentEmail.toLowerCase());
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('parentName', formData.parentName);
    formDataToSend.append('parentPhone', formData.parentPhone);
    if (formData.photo) formDataToSend.append('photo', formData.photo);

    try {
      await createStudent(formDataToSend);
      toast.success('Student created successfully');
      navigate('/admin/students');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register student")
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-blue-900/40 border border-blue-900/60 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none";

  return (
    <main className="bg-blue-950 text-slate-100 min-h-screen">
      <section className="relative pt-32 pb-20 px-6 bg-linear-to-b from-blue-950 to-blue-900/40 border-b border-blue-900/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08)_0,transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-3">Register New Student</h1>
        </div>
      </section>

      <section className="py-12 px-6 max-w-4xl mx-auto">
        <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="p-8 rounded-2xl bg-blue-900/20 border border-blue-900/60 backdrop-blur-xl space-y-8">
          <div>
            <h2 className="text-lg font-serif font-bold text-emerald-400 mb-4 border-b border-blue-900/60 pb-2 flex items-center gap-2"><IdCard />1. Student Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Full Name *</label><input type="text" name="fullName" value={formData.fullName} required onChange={handleChange} className={inputClass} /></div>
              <div><label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Date of Birth *</label><input type="date" name="dob" value={formData.dob} required onChange={handleChange} className={inputClass} /></div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}><option>Male</option><option>Female</option></select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Assigned Class *</label>
                <select name="classAssigned" value={formData.classAssigned} onChange={handleChange} required className={inputClass}>
                  <option value="">Select a class</option>
                  {classes.map((classItem) => <option key={classItem._id} value={classItem._id}>{classItem.fullClassName}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Student Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-900/40 border-2 border-dashed border-blue-900/60 flex items-center justify-center overflow-hidden">
                    {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-slate-500" />}
                  </div>
                  <label className="px-4 py-2 bg-blue-900/60 hover:bg-blue-800/80 rounded-lg text-sm cursor-pointer flex items-center gap-2">
                    <Upload /> Upload Photo<input type="file" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-serif font-bold text-emerald-400 mb-4 border-b border-blue-900/60 pb-2 flex items-center gap-2"><Mail />2. Parent / Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div><label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Parent Name *</label><input type="text" name="parentName" value={formData.parentName} required onChange={handleChange} className={inputClass} /></div>
              <div><label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Login Email *</label><input type="email" name="parentEmail" value={formData.parentEmail} required onChange={handleChange} className={inputClass} /></div>
              <div><label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Phone Number *</label><input type="tel" name="parentPhone" value={formData.parentPhone} required onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <Key className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div><p className="text-sm font-semibold text-emerald-400">On Submit:</p><ul className="text-xs text-slate-300 mt-1 list-disc list-inside"><li>System generates StudentID: `VIS2026XXXX`</li><li>Login details sent to parent email</li></ul></div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-blue-950 font-bold rounded-lg transition flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating Account...' : 'Create Account & Send Login'}
          </button>
        </motion.form>
      </section>
    </main>
  );
};
export default AddStudent;