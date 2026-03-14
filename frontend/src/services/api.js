import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const projectsAPI = {
  list: () => api.get('/projects/list'),
  create: (data, userId) => api.post('/projects/create', data, { params: { user_id: userId } }),
  get: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  createWorkItem: (projectId, data) => api.post(`/projects/${projectId}/work-items`, data),
};

export const expensesAPI = {
  list: () => api.get('/expenses/list'),
  create: (data, userId) => api.post('/expenses/create', data, { params: { user_id: userId } }),
  getProjectExpenses: (projectId) => api.get(`/expenses/project/${projectId}`),
  getSummary: () => api.get('/expenses/summary'),
};

export const assetsAPI = {
  list: () => api.get('/assets/list'),
  create: (data) => api.post('/assets/create', data),
  getByCategory: () => api.get('/assets/by-category'),
  update: (id, data) => api.put(`/assets/${id}`, data),
};

export const vendorsAPI = {
  list: () => api.get('/vendors/list'),
  create: (data) => api.post('/vendors/create', data),
  getByType: (type) => api.get(`/vendors/by-type/${type}`),
  get: (id) => api.get(`/vendors/${id}`),
};

export const quotationsAPI = {
  create: (data) => api.post('/quotations/create', data),
  getProjectQuotations: (projectId) => api.get(`/quotations/project/${projectId}`),
  approve: (id) => api.put(`/quotations/${id}/approve`),
};

// ===== NEW API ENDPOINTS =====

export const memberAPI = {
  list: (params) => api.get('/members/list', { params }),
  create: (data) => api.post('/members/create', data),
  get: (id) => api.get(`/members/${id}`),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getByFlat: (flatId) => api.get(`/members/flat/${flatId}/members`),
  getByStatus: (status) => api.get(`/members/status/${status}/list`),
};

export const flatAPI = {
  list: (params) => api.get('/flats/list', { params }),
  create: (data) => api.post('/flats/create', data),
  get: (id) => api.get(`/flats/${id}`),
  update: (id, data) => api.put(`/flats/${id}`, data),
  delete: (id) => api.delete(`/flats/${id}`),
  getByBuilding: (building) => api.get(`/flats/building/${building}/list`),
  getOverview: () => api.get('/flats/summary/overview'),
};

export const maintenanceAPI = {
  listCharges: (params) => api.get('/maintenance/charges/list', { params }),
  createCharge: (data) => api.post('/maintenance/charge/create', data),
  getCharge: (id) => api.get(`/maintenance/charges/${id}`),
  markPaid: (id) => api.put(`/maintenance/charges/${id}/mark-paid`),
  listPayments: (params) => api.get('/maintenance/payments/list', { params }),
  recordPayment: (data) => api.post('/maintenance/payment/create', data),
  getPayment: (id) => api.get(`/maintenance/payments/${id}`),
  getFlatSummary: (flatId) => api.get(`/maintenance/summary/flat/${flatId}`),
  getMemberSummary: (memberId) => api.get(`/maintenance/summary/member/${memberId}`),
  getConfigs: () => api.get('/maintenance/config/list'),
  createConfig: (data) => api.post('/maintenance/config/create', data),
};

export const noticeAPI = {
  listNotices: (params) => api.get('/notices/notices/list', { params }),
  createNotice: (data) => api.post('/notices/notice/create', data),
  getNotice: (id) => api.get(`/notices/notices/${id}`),
  updateNotice: (id, data) => api.put(`/notices/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/notices/notices/${id}`),
  listComplaints: (params) => api.get('/notices/complaints/list', { params }),
  createComplaint: (data) => api.post('/notices/complaint/create', data),
  getComplaint: (id) => api.get(`/notices/complaints/${id}`),
  updateComplaint: (id, data) => api.put(`/notices/complaints/${id}`, data),
  deleteComplaint: (id) => api.delete(`/notices/complaints/${id}`),
  getMemberComplaints: (memberId) => api.get(`/notices/complaints/member/${memberId}`),
  getComplaintsStats: () => api.get('/notices/complaints/summary/statistics'),
};

export const invoicesAPI = {
  list: () => api.get('/invoices/list'),
  create: (data) => api.post('/invoices/create', data),
  get: (id) => api.get(`/invoices/${id}`),
};

export const analyticsAPI = {
  dashboardSummary: () => api.get('/analytics/dashboard-summary'),
  monthlyExpenses: () => api.get('/analytics/monthly-expenses'),
  projectCompletion: () => api.get('/analytics/project-completion'),
  expenseBreakdown: () => api.get('/analytics/expense-breakdown'),
  budgetVsActual: () => api.get('/analytics/monthly-budget-vs-actual'),
  assetValuation: () => api.get('/analytics/asset-valuation'),
};

export default api;
