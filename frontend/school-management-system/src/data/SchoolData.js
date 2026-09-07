export let STUDENTS = [
  {
    id: 1,
    studentID: "VIS2024001",
    name: "Chidubem Okonkwo",
    class: "SSS 1 - 3", // matched to FEES array
    email: "chidi@victony.edu.ng",
    dob: "2007-02-10",
    gender: "Male",
    parentName: "Mr Okonkwo",
    parentPhone: "+2348010001",
    password: "password123",
    role: "student",
    feeStatus: "Paid", // Paid, Owing, Pending
  },
  {
    id: 2,
    studentID: "VIS2024002",
    name: "Amina Yusuf",
    class: "JSS 1 - 3",
    email: "amina@victony.edu.ng",
    dob: "2012-08-15",
    gender: "Female",
    parentName: "Mrs Yusuf",
    parentPhone: "+2348010000002",
    password: "password123",
    role: "student",
    feeStatus: "Owing", // Changed from "Active"
  },
  {
    id: 3,
    studentID: "VIS2024003",
    name: "Tunde Adebayo",
    class: "SSS 1 - 3",
    email: "tunde@victony.edu.ng",
    dob: "2008-11-22",
    gender: "Male",
    parentName: "Mr Adebayo",
    parentPhone: "+2348010000003",
    password: "password123",
    role: "student",
    feeStatus: "Owing", // Changed from "Updated"
  },
  {
    id: 4,
    studentID: "VIS2024004",
    name: "Grace Ezekiel",
    class: "Primary 4 - 6",
    email: "grace@victony.edu.ng",
    dob: "2013-04-05",
    gender: "Female",
    parentName: "Mrs Ezekiel",
    parentPhone: "+2348010004",
    password: "password123",
    role: "student",
    feeStatus: "Pending",
  },
];

export const FEES = [
  {
    grade: "Nursery - KG",
    tuition: "₦450,000",
    admission: "₦100,000",
    total: "₦550,000",
  },
  {
    grade: "Primary 1 - 3",
    tuition: "₦500,000",
    admission: "₦100,000",
    total: "₦600,000",
  },
  {
    grade: "Primary 4 - 6",
    tuition: "₦550,000",
    admission: "₦100,000",
    total: "₦650,000",
  },
  {
    grade: "JSS 1 - 3",
    tuition: "₦650,000",
    admission: "₦150,000",
    total: "₦800,000",
  },
  {
    grade: "SSS 1 - 3",
    tuition: "₦700,000",
    admission: "₦150,000",
    total: "₦850,000",
  },
];

export const USERS = [
  { _id: "teacher-1", name: "Ada Okafor", role: "teacher" },
  { _id: "teacher-2", name: "Emeka Nwosu", role: "teacher" },
];

export const CLASSES = [
  {
    _id: "class-jss1",
    name: "JSS 1",
    session: "2025/2026",
    capacity: 40,
    enrolledCount: 0,
    homeroomTeacherId: "",
    subjects: [],
  },
  {
    _id: "class-jss2",
    name: "JSS 2",
    session: "2025/2026",
    capacity: 40,
    enrolledCount: 0,
    homeroomTeacherId: "",
    subjects: [],
  },
  {
    _id: "class-sss1-science",
    name: "SSS 1 Science",
    session: "2025/2026",
    capacity: 40,
    enrolledCount: 0,
    homeroomTeacherId: "",
    subjects: [],
  },
];

export const ANNOUNCEMENTS = [
  {
    _id: "announcement-1",
    title: "Welcome back",
    body: "Welcome to the new school term.",
    target: "All",
    createdAt: "2026-01-05",
  },
];
