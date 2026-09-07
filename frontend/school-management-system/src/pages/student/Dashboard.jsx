import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, CreditCard, Loader2, Bell, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { getAnnouncements, getMyStudentData, uploadStudentPhoto } from '../../services/api';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [data, announcementList] = await Promise.all([
          getMyStudentData(),
          getAnnouncements(),
        ]);
        setStudent({
          ...data,
          name: data.name || data.fullName,
          class: data.class || data.classAssigned?.fullClassName || data.classAssigned?.name || '-',
          feeStatus: data.feeStatus || 'Pending',
        });
        setAnnouncements(announcementList);
      } catch {
        toast.error('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const result = await uploadStudentPhoto(file);
      setStudent((current) => ({ ...current, photoUrl: result.photoUrl }));
      toast.success('Photo updated');
    } catch {
      toast.error('Photo upload failed');
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  if (loading || !student) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>

  return (
    <div className="space-y-8">
      <motion.div className="p-8 rounded-2xl bg-linear-to-r from-slate-900 to-emerald-950/40 border-slate-800/80">
        <span className="text-emerald-400 text-xs font-mono uppercase">{student.term}</span>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-emerald-500/20">{student.photoUrl ? <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-emerald-400 m-4" />}</div>
          <div><h1 className="text-3xl font-serif font-bold text-white">Welcome back, {student.name}</h1></div>
        </div>
        <p className="text-slate-400 text-sm mt-2">Class: {student.class} | Attendance: {student.attendanceRate}%</p>
        <Link to="/student/invoices" className="inline-flex mt-3 text-emerald-400 hover:text-emerald-300 text-sm font-semibold">Fee status: {student.feeStatus || 'Pending'} · View invoices</Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/student/report-card" className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80"><BookOpen className="w-6 h-6 text-emerald-400 mb-3" /><h3 className="font-bold text-white">View Report Card</h3></Link>
        <Link to="/student/attendance" className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80"><CalendarDays className="w-6 h-6 text-emerald-400 mb-3" /><h3 className="font-bold text-white">Attendance Log</h3></Link>
        <Link to="/student/invoices" className="p-6 rounded-xl bg-slate-900/70 border-slate-800/80"><CreditCard className="w-6 h-6 text-emerald-400 mb-3" /><h3 className="font-bold text-white">Fee Status</h3></Link>
      </div>

      <section className="rounded-xl bg-slate-900/70 border border-slate-800/80 p-6">
        <h2 className="text-lg font-serif font-bold text-white">School Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-sm text-slate-400 mt-3">No announcements available.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {announcements.slice(0, 5).map((announcement) => (
              <article key={announcement._id} className="border-b border-slate-800 pb-3 last:border-0">
                <h3 className="font-semibold text-white">{announcement.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{announcement.message}</p>
                <time className="text-xs text-slate-500">{new Date(announcement.createdAt).toLocaleDateString()}</time>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default StudentDashboard;