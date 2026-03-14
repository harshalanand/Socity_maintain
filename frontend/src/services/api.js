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
