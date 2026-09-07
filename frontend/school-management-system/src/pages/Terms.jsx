import { motion } from 'framer-motion';

const Section = ({ num, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-3"
  >
    <h2 className="text-xl font-bold text-white light:text-slate-900">{num}. {title}</h2>
    <div className="text-slate-300 light:text-slate-700 space-y-2">{children}</div>
  </motion.div>
);

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-white light:text-slate-900 pt-32 pb-20 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl font-bold mb-4"
        >
          Terms & Conditions
        </motion.h1>
        <p className="text-slate-400 light:text-slate-600 mb-10">Last updated: August 26, 2026</p>

        <div className="bg-slate-900/60 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-8 md:p-10 space-y-8">

          <Section num="1" title="Admission & Fees">
            <p>All school fees must be paid on or before the resumption date for each term.</p>
            <p>Late payment attracts a 10% penalty. Students with outstanding fees may not be allowed to write exams or collect results.</p>
            <p>Fees are non-refundable except in cases approved by the school management.</p>
          </Section>

          <Section num="2" title="Student Conduct & Discipline">
            <p>Students must adhere to the rules and regulations as stated in the student handbook.</p>
            <ul className="list-disc list-inside">
              <li>Respect for teachers, staff, and fellow students is mandatory</li>
              <li>Uniform and appearance must comply with school standards</li>
              <li>Bullying, examination malpractice, and destruction of property will lead to suspension or expulsion</li>
            </ul>
          </Section>

          <Section num="3" title="Academic Policy">
            <p>Promotion to the next class is based on continuous assessment, exams, and minimum attendance of 80% per term.</p>
            <p>Report cards will be published on the portal. Parents are responsible for monitoring their ward's academic progress.</p>
          </Section>

          <Section num="4" title="Use of Portal">
            <p>The Victony Portal login credentials are personal. Do not share your password.</p>
            <p>The school is not liable for data loss due to negligence of login details. We reserve the right to suspend accounts for misuse.</p>
          </Section>

          <Section num="5" title="Health & Safety">
            <p>Parents must inform the school of any medical condition. The school will take reasonable steps in case of emergencies but is not liable for accidents during school activities.</p>
          </Section>

          <Section num="6" title="Amendments">
            <p>Victony College reserves the right to update these terms at any time. Changes will be communicated via the portal and email.</p>
          </Section>

        </div>
      </div>
    </div>
  );
};
export default Terms;