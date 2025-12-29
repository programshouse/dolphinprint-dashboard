// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

/* ======================
   Reviews API
   name, description, image (optional)
   ====================== */
export const reviewsAPI = {
  list: () => api.get('/reviews'),

  getById: (id) => api.get(`/reviews/${id}`),

  create: (data) => {
    // Accept either FormData or a plain object
    if (data instanceof FormData) {
      return api.post('/reviews', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    return api.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id, data) => {
    // If your backend needs method override, switch to:
    // return api.post(`/reviews/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    if (data instanceof FormData) {
      return api.put(`/reviews/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image); // only if replacing the image
    return api.put(`/reviews/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id) => api.delete(`/reviews/${id}`),
};

/* ======================
   Profile API
   ====================== */
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

/* ======================
   Workshops API
   ====================== */
export const workshopsAPI = {
  getAll: () => api.get('/workshops'),
  getById: (id) => api.get(`/workshops/${id}`),
  create: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('duration', data.duration);
    if (data.video) formData.append('video', data.video);
    if (data.image) formData.append('image', data.image);
    return api.post('/workshops', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('duration', data.duration);
    if (data.video) formData.append('video', data.video);
    if (data.image) formData.append('image', data.image);
    return api.put(`/workshops/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/workshops/${id}`),
};

/* ======================
   Services API (single-language)
   ====================== */
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    return api.post('/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    return api.put(`/services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/services/${id}`),
};

/* ======================
   Main Services API (bilingual)  ← NEW
   Fields: title_en, title_ar, description_en, description_ar, image (optional)
   Base path: /main-services
   ====================== */
export const mainServicesAPI = {
  list: () => api.get('/main-services'),
  getById: (id) => api.get(`/main-services/${id}`),

  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/main-services', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    const form = new FormData();
    form.append('title_en', data.title_en ?? '');
    form.append('title_ar', data.title_ar ?? '');
    form.append('description_en', data.description_en ?? '');
    form.append('description_ar', data.description_ar ?? '');
    if (data.image) form.append('image', data.image);
    return api.post('/main-services', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/main-services/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    const form = new FormData();
    form.append('title_en', data.title_en ?? '');
    form.append('title_ar', data.title_ar ?? '');
    form.append('description_en', data.description_en ?? '');
    form.append('description_ar', data.description_ar ?? '');
    if (data.image) form.append('image', data.image);
    return api.put(`/main-services/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id) => api.delete(`/main-services/${id}`),
};

/* ======================
   Blogs API
   ====================== */
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.image) formData.append('image', data.image);
    return api.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.image) formData.append('image', data.image);
    return api.put(`/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/blogs/${id}`),
};
/* ======================
   FAQs API
   Fields: question, answer (HTML/text), category (optional)
   ====================== */
export const faqsAPI = {
  getAll: () => api.get('/faqs'),
  getById: (id) => api.get(`/faqs/${id}`),
  create: (data) => {
    const formData = new FormData();
    formData.append('question', data.question);
    formData.append('answer', data.answer); // can be HTML
    if (data.category) formData.append('category', data.category);
    return api.post('/faqs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    formData.append('question', data.question);
    formData.append('answer', data.answer);
    if (data.category) formData.append('category', data.category);
    return api.put(`/faqs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/faqs/${id}`),
};

/* ======================
   Contact API (JSON)
   ====================== */
export const contactAPI = {
  getAll: () => api.get('/contacts'),
  create: (data) => api.post('/contacts', data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

export default api;

