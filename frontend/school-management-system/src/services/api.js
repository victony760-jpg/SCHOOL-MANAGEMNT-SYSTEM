import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

// FIX C1: Check both localStorage and sessionStorage
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "";
    const missingStudentProfile =
      error.response?.status === 403 &&
      message.toLowerCase().includes("student profile not found");

    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (
      (error.response?.status === 401 && !isLoginRequest) ||
      missingStudentProfile
    ) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// AUTH
export const adminLogin = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// STUDENT
export const uploadStudentPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await api.patch("/students/me/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// UPDATED: Now accepts search, page, limit, class, status
export const getStudents = async (params = {}) =>
  (await api.get("/students", { params })).data;
export const rejectStudent = async (id) =>
  (await api.patch(`/students/${id}/reject`)).data;
export const toggleStudentActive = async (id) =>
  (await api.patch(`/students/${id}/toggle-active`)).data;
export const getStudentById = async (id) =>
  (await api.get(`/students/${id}`)).data;

export const updateStudent = async (id, data) =>
  (await api.patch(`/students/${id}`, data)).data;

export const deleteStudent = async (id) =>
  (await api.delete(`/students/${id}`)).data;

export const approveStudent = async (id) =>
  (await api.patch(`/students/${id}/approve`)).data;

export const createStudent = async (formData) =>
  (
    await api.post("/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
export const createClass = async (data) =>
  (await api.post("/classes", data)).data;
export const deleteClass = async (id) =>
  (await api.delete(`/classes/${id}`)).data;
export const updateClass = async (id, data) =>
  (await api.patch(`/classes/${id}`, data)).data;
export const deleteInvoice = async (id) =>
  (await api.delete(`/invoices/${id}`)).data;
export const deleteAdmission = async (id) =>
  (await api.delete(`/admissions/${id}`)).data;

export const getAnnouncements = async () => {
  const response = (await api.get("/announcements")).data;
  return Array.isArray(response.data) ? response.data : [];
};
export const createAnnouncement = async ({ title, body, target }) =>
  (
    await api.post("/announcements", {
      title,
      message: body,
      audience: target,
    })
  ).data;
export const deleteAnnouncement = async (id) =>
  (await api.delete(`/announcements/${id}`)).data;

export const getAdmissions = async () => (await api.get("/admissions")).data;
export const submitAdmission = async (formData) =>
  (
    await api.post("/admissions", formData, {
      timeout: 120000,
    })
  ).data;
export const updateAdmissionStatus = async (id, status) =>
  (
    await api.patch(
      `/admissions/${id}/status`,
      { status },
      {
        timeout: 120000,
      },
    )
  ).data;
// CLASSES
export const getClasses = async () => {
  const response = (await api.get("/classes")).data;
  return response.data || response.classes || response || [];
};

// INVOICES
export const getMyInvoices = async () => {
  const response = (await api.get("/invoices/me")).data;
  return Array.isArray(response.data) ? response.data : [];
};

export const initializeInvoicePayment = async (invoiceId) => {
  const response = (await api.post(`/invoices/${invoiceId}/pay`)).data;
  return response.data || {};
};

export const verifyInvoicePayment = async (reference) => {
  const response = (
    await api.get(`/invoices/verify/${encodeURIComponent(reference)}`)
  ).data;
  return response.data || null;
};

export const getInvoices = async () => {
  const response = (await api.get("/invoices")).data;
  return response.data?.invoices || [];
};

export const createInvoice = async (invoice) =>
  (await api.post("/invoices", invoice)).data;

// #7 NEW: DASHBOARD + PORTAL DATA
export const getDashboardStats = async () => {
  const response = (await api.get("/dashboard/stats")).data;
  return response.data || {};
};

export const getAttendance = async (params = {}) => {
  const response = (await api.get("/attendance", { params })).data;
  return response.data?.attendance || response.attendance || [];
};

export const postAttendance = async (data) =>
  (await api.post("/attendance/bulk", data)).data;

export const getMyAttendance = async (params = {}) => {
  const response = (await api.get("/attendance/me", { params })).data;
  return response.data?.attendance || response.attendance || [];
};

export const getGrades = async (params = {}) => {
  const response = (await api.get("/grades", { params })).data;
  return response.data?.grades || response.grades || response || [];
};

export const postGrades = async (data) =>
  (await api.post("/grades/bulk", data)).data;

export const getMyStudentData = async () => {
  const response = (await api.get("/students/me")).data;
  return response.data || response;
};

// CONTACT + VISITS
export const submitContactForm = async (data) =>
  (
    await api.post("/contact", {
      ...data,
      fullName: data.fullName || data.name,
    })
  ).data;

export const getContacts = async () => (await api.get("/contact")).data;

export const submitVisitForm = async (data) =>
  (await api.post("/visits", data)).data;

export const getVisits = async () => {
  const response = (await api.get("/visits")).data;
  return response.data || response.visits || response || [];
};

export const getRecentActivity = async () => {
  const response = (await api.get("/dashboard/recent-activity")).data;
  return Array.isArray(response.data) ? response.data : [];
};
export const updateVisitStatus = async (id, status) =>
  (await api.patch(`/visits/${id}/status`, { status })).data;
export default api;
