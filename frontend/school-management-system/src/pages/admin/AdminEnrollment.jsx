import { useState } from 'react';
import { CLASSES, STUDENTS } from '../../data/SchoolData';

const AdminEnrollment = () => {
  const [classes] = useState(CLASSES);
  const [students, setStudents] = useState(STUDENTS);
  const [selectedClassId, setSelectedClassId] = useState('');

  const selectedClass = classes.find(c => c._id === selectedClassId);
  const enrolledStudents = students.filter(s => s.classId === selectedClassId);
  const availableStudents = students.filter(s => !s.classId);

  const handleEnroll = (studentId) => setStudents(students.map(s => s._id === studentId ? { ...s, classId: selectedClassId } : s));
  const handleUnenroll = (studentId) => setStudents(students.map(s => s._id === studentId ? { ...s, classId: null } : s));

  return (
    <div className="p-6 bg-blue-950 min-h-screen text-slate-200">
      <h1 className="text-2xl font-serif font-bold mb-6 text-white">Class Enrollment</h1>

      <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="bg-blue-900/40 border-blue-800 rounded-md p-3 w-full mb-6 focus:border-emerald-400 outline-none">
        <option value="">Select a Class</option>
        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      {selectedClassId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-900/40 border-blue-900/50 p-4 rounded-md shadow-lg">
            <h2 className="font-semibold mb-3 text-emerald-400">Available Students</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableStudents.map(s => (
                <div key={s._id} className="flex justify-between items-center border-b border-blue-900/50 py-2">
                  <span>{s.name}</span>
                  <button onClick={() => handleEnroll(s._id)} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold">Enroll {'>>'}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/40 border-blue-900/50 p-4 rounded-md shadow-lg">
            <h2 className="font-semibold mb-3 text-emerald-400">Enrolled in {selectedClass?.name}</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {enrolledStudents.map(s => (
                <div key={s._id} className="flex justify-between items-center border-b border-blue-900/50 py-2">
                  <span>{s.name}</span>
                  <button onClick={() => handleUnenroll(s._id)} className="text-rose-400 hover:text-rose-300 text-sm font-semibold">{'<<'} Unenroll</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminEnrollment;