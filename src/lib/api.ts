import axios from 'axios';

const DEFAULT_BASE_URL = 'https://eminvestment.dpdns.org/api/admin/index.php';

export const getBaseUrl = () => {
  return localStorage.getItem('EM_INVEST_BASE_URL') || DEFAULT_BASE_URL;
};

export const setBaseUrl = (url: string) => {
  localStorage.setItem('EM_INVEST_BASE_URL', url);
};

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('EM_INVEST_ADMIN_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Custom logic to handle the ?endpoint=... pattern
  const baseUrl = getBaseUrl();
  const endpoint = config.params?.endpoint || config.data?.endpoint;
  
  if (endpoint) {
    config.url = `${baseUrl}?endpoint=${endpoint}`;
    // Remove endpoint from params/data to avoid duplication as query params if needed
    if (config.params) delete config.params.endpoint;
  } else {
      config.url = baseUrl;
  }

  return config;
});

export default api;
