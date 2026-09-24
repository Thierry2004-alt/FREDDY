import axios from 'axios';
import { Platform, NativeModules } from 'react-native';

const getHostIP = () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : 'localhost';
  }

  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const address = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
      if (address && address !== 'localhost' && address !== '127.0.0.1') {
        return address;
      }
    }
  } catch (e) {
    // fallback
  }

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return '10.155.242.130';
  }

  return 'localhost';
};

const getBaseUrl = () => {
  const host = getHostIP();
  return `http://${host}:8000/api`;
};

export const API_BASE_URL = getBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (authToken && !authToken.startsWith('demo-')) {
      config.headers.Authorization = `Token ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/token/', credentials),
  register: (userData: any) => api.post('/auth/register/', userData),
  getCurrentUser: () => api.get('/auth/users/me/'),
};

export const produceAPI = {
  list: (params?: any) => api.get('/produce/produce/', { params }),
  search: (params?: any) => api.get('/produce/produce/search/', { params }),
  myListings: () => api.get('/produce/produce/my_listings/'),
  create: (data: any) => api.post('/produce/produce/', data),
  update: (id: number, data: any) => api.put(`/produce/produce/${id}/`, data),
  delete: (id: number) => api.delete(`/produce/produce/${id}/`),
};

export const productAPI = produceAPI;

export const orderAPI = {
  list: () => api.get('/orders/orders/'),
  create: (data: any) => api.post('/orders/orders/', data),
  cancel: (id: number) => api.post(`/orders/orders/${id}/cancel/`),
  confirm: (id: number, payload?: { delivery_agent_id?: number }) => api.post(`/orders/orders/${id}/confirm/`, payload || {}),
  assignTransporter: (id: number, payload: { delivery_agent_id: number }) => api.post(`/orders/orders/${id}/confirm/`, payload),
};

export const deliveryAPI = {
  list: () => api.get('/delivery/deliveries/'),
  updateStatus: (id: number, data: any) => api.post(`/delivery/deliveries/${id}/update_status/`, data),
  transporters: () => api.get('/auth/users/', { params: { role: 'delivery' } }),
};

export const transporterAPI = {
  list: () => deliveryAPI.transporters(),
};

export const paymentAPI = {
  list: () => api.get('/payments/payments/'),
  create: (data: any) => api.post('/payments/payments/', data),
  markCompleted: (id: number) => api.post(`/payments/payments/${id}/mark_completed/`),
  disbursements: () => api.get('/payments/disbursements/'),
};

export const disputeAPI = {
  list: () => api.get('/disputes/disputes/'),
  create: (data: any) => api.post('/disputes/disputes/', data),
  addMessage: (id: number, data: any) => api.post(`/disputes/disputes/${id}/add_message/`, data),
  resolve: (id: number, data: any) => api.post(`/disputes/disputes/${id}/resolve/`, data),
};

export const adminAPI = {
  getStats: () => api.get('/auth/users/stats/'),
};

