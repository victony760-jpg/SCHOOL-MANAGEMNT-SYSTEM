import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-3"
  >
    <h2 className="text-xl font-bold text-white light:text-slate-900">{title}</h2>
    <div className="text-slate-300 light:text-slate-700 space-y-2">{children}</div>
  </motion.div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-white light:text-slate-900 pt-32 pb-20 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl font-bold mb-4"
        >
          Privacy Policy
        </motion.h1>
        <p className="text-slate-400 light:text-slate-600 mb-10">Last updated: August 26, 2026</p>

        <div className="bg-slate-900/60 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-8 md:p-10 space-y-8">

          <Section title="1. Our Commitment">
            <p>
              Victony College "we, our, us" is committed to protecting the privacy and security of personal data
              for our students, parents, staff, and website visitors. This policy explains how we collect, use, and protect your information.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Student Data:</strong> Name, DOB, Class, Admission No, Results, Attendance, Passport</li>
              <li><strong>Parent/Guardian Data:</strong> Name, Phone, Email, Address for communication and billing</li>
              <li><strong>Account Data:</strong> Login email, password, role for portal access</li>
              <li><strong>Payment Data:</strong> Fee records. Note: We do not store card details. Payments go through secure gateways</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="list-disc list-inside space-y-1">
              <li>To provide educational services: results, report cards, attendance</li>
              <li>To manage school fees, invoices, and receipts</li>
              <li>To communicate important updates, newsletters, and announcements</li>
              <li>To comply with Ministry of Education requirements and legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing & Security">
            <p>
              We do not sell, trade, or rent student data to third parties. Data is only shared with authorized staff,
              government agencies when required by law, and trusted service providers who help us run the portal.
            </p>
            <p>
              We use SSL encryption, role-based access, and regular backups to protect your data from unauthorized access.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p>
              Parents and students have the right to request access, correction, or deletion of personal data.
              Contact the school admin to make a request. You can also opt-out of non-essential communications.
            </p>
          </Section>

          <Section title="6. Contact Us">
            <p>
              If you have questions about this policy, contact us at:
            </p>
            <p className="font-semibold text-emerald-400">
              Email: victony760@gmail.com <br />
              Address:No 15 Allen Avenue, Ikeja, Lagos, Nigeria
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;