import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';
import { useAuth } from '../context/AuthContext'; // 1. IMPORT CONTEXT
import { toast } from 'sonner';
import loginVideo from '../assets/13342680_3840_2160_30fps.mp4';
import loginImage from '../assets/pexels-expressivestanley-1454360.jpg';

const Login = () => {
  const { login } = useAuth(); // 2. USE CONTEXT HOOK
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.login || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = { login: formData.login, password: formData.password };
      const data = await adminLogin(payload);

      // 3. FIX: Use context login. It handles localStorage vs sessionStorage
      login(data.user, data.token, rememberMe);
      toast.success(`Welcome back, ${data.user.name}`)

      const role = data.user?.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'student') navigate('/student/dashboard');
      else setError('Unauthorized role');

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Student ID/Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* 1. BACKGROUND VIDEO FOR DESKTOP */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      >
        <source src={loginVideo} type="video/mp4" />
      </video>

      {/* 2. BACKGROUND IMAGE FOR MOBILE + FALLBACK */}
      <img
        src={loginImage}
        alt="Students at Victony Preparatory School"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* 3. DARK GRADIENT OVERLAY - makes form readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-10 h-10 text-slate-950" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Victony Portal</h1>
          <p className="text-slate-400">Access Student & Admin Dashboard</p>
          <p className="text-xs text-emerald-400 mt-2">Parents: Use Student ID sent to your email</p>
        </div>

        {/* GLASS CARD */}
        <form onSubmit={handleSubmit} className="bg-slate-900/70 backdrop-blur-xl border-blue-900/60 rounded-2xl p-8 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> {error}
            </motion.div>
          )}

          <div className="space-y-5">
            {/* Email / Student ID */}
            <div>
              <label htmlFor="login" className="block text-sm font-semibold text-slate-300 mb-2">
                Email / Student ID
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  placeholder="VIS2025001 or name@example.com"
                  className="w-full bg-slate-900/60 border border-blue-900/60 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••"
                  className="w-full bg-slate-900/60 border border-blue-900/60 rounded-lg pl-11 pr-11 py-3 text-white placeholder:text-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-blue-900/60 bg-slate-900 accent-emerald-500"
                />
                Remember me
              </label>
              <Link to="/contact" className="text-emerald-400 hover:underline font-medium">
                Need Help?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 py-3.5 rounded-lg font-bold hover:from-emerald-400 hover:to-emerald-500 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>

            {/* Security Note */}
            <div className="flex items-center gap-2 justify-center text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secured with 256-bit SSL Encryption
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 Victony College. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;