import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const schoolLinks = [
    { title: 'About Victony', path: '/about' },
    { title: 'Academics', path: '/academics' },
    { title: 'Admissions', path: '/admissions' },
    { title: 'Campus Life', path: '/campus-life' },
    { title: 'Contact', path: '/contact' },
  ];

  const quickLinks = [
    { title: 'Portal Login', path: '/login' },
    { title: 'Home', path: '/' },
    { title: 'Contact', path: '/contact' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-blue-900/60">

      {/* MAIN FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* COL 1: BRANDING + CONTACT - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl text-white leading-none group-hover:text-emerald-400 transition">
                  VICTONY
                </span>
                <span className="font-sans text-[10px] tracking-[0.18em] text-emerald-400 font-semibold uppercase">
                  PREPARATORY SCHOOL
                </span>
              </div>
            </Link>

            <p className="text-slate-400 font-sans text-sm leading-relaxed">
              Nurturing excellence, character, and leadership for the next generation of victors.
              Est. 2015 in Lagos ikeja, Nigeria.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 pt-2">
              <a href="tel:08038445230" className="flex items-center gap-3 text-sm hover:text-emerald-400 transition group">
                <Phone className="w-4 h-4 text-emerald-400" /> 08038445230
              </a>
              <a href="mailto:victony760@gmail.com" className="flex items-center gap-3 text-sm hover:text-emerald-400 transition group">
                <Mail className="w-4 h-4 text-emerald-400" /> victony760@gmail.com
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                No 15 Allen Avenue, Ikeja, Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* COL 2: SCHOOL - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif font-bold text-white text-sm tracking-[0.15em] uppercase">
              School
            </h3>
            <ul className="space-y-3">
              {schoolLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-emerald-400 transition text-sm">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: QUICK ACCESS - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif font-bold text-white text-sm tracking-[0.15em] uppercase">
              Quick Access
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-emerald-400 transition text-sm">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4: NEWSLETTER + SOCIAL - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-serif font-bold text-white text-sm tracking-[0.15em] uppercase">
              Stay Updated
            </h3>
            <p className="text-slate-400 text-sm">
              Get admission news, events, and announcements.
            </p>

            {/* Newsletter */}
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-slate-900 border-blue-900/60 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2.5 rounded-lg transition">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Socials */}
            <div>
              <p className="text-sm text-slate-500 mb-3">Explore</p>
              <div className="flex gap-4">
                <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition text-sm">About</Link>
                <Link to="/academics" className="text-slate-400 hover:text-emerald-400 transition text-sm">Academics</Link>
                <Link to="/admissions" className="text-slate-400 hover:text-emerald-400 transition text-sm">Admissions</Link>
                <Link to="/campus-life" className="text-slate-400 hover:text-emerald-400 transition text-sm">Campus Life</Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-blue-900/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {currentYear} The Victony Preparatory School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-emerald-400 transition">Terms of Service</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;