import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-white mb-3">Submitted Successfully!</h1>
        <p className="text-slate-300 mb-8">We have received your message. Our team will reach out within 24-48 hours.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition">
          <Home className="w-5 h-5" /> Go Home
        </Link>
      </motion.div>
    </div>
  );
};
export default Success;