import { motion } from 'framer-motion';
import { ShieldX, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <ShieldX className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-white mb-3">403 - Unauthorized</h1>
        <p className="text-slate-300 mb-8">You do not have permission to access this page.</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition">
          <LogIn className="w-5 h-5" /> Back to Login
        </Link>
      </motion.div>
    </div>
  );
};
export default Unauthorized;