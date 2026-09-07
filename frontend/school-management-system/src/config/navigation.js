import {
  LayoutDashboard,
  Users,
  School,
  Megaphone,
  UserCheck,
  FileText,
  DollarSign,
  GraduationCap,
  ClipboardList,
  UserPlus,
  Bell,
} from "lucide-react";

export const adminNav = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    path: "/admin/students",
    icon: Users,
  },
  {
    name: "Classes",
    path: "/admin/classes", // #6 NEW
    icon: School,
  },
  {
    name: "Admissions",
    path: "/admin/admissions",
    icon: UserPlus,
  },
  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: UserCheck,
  },
  {
    name: "Grades",
    path: "/admin/grades",
    icon: GraduationCap,
  },
  {
    name: "Invoices",
    path: "/admin/invoices",
    icon: DollarSign,
  },
  {
    name: "Visits",
    path: "/admin/visits",
    icon: ClipboardList,
  },
  {
    name: "Announcements",
    path: "/admin/announcements", // #6 NEW
    icon: Megaphone,
  },
];

export const studentNav = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Attendance",
    path: "/student/attendance",
    icon: UserCheck,
  },
  {
    name: "Report Card",
    path: "/student/report-card",
    icon: FileText,
  },
  {
    name: "Invoices",
    path: "/student/invoices",
    icon: DollarSign,
  },
];
