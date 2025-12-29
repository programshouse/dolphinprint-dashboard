import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://www.programshouse.com/dashboards/dolphin/api";

export const useFaqStore = create((set) => ({
  faqs: [],
  loading: false,
  error: null,
  currentFaq: null,

  // Get all FAQs
  getFaqs: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/faqs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      set({ faqs: Array.isArray(res.data.data) ? res.data.data : res.data, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch FAQs",
        loading: false,
      });
      throw err;
    }
  },

  // Get FAQ by ID
  getFaqById: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/faqs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      set({ currentFaq: res.data.data, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch FAQ",
        loading: false,
      });
      throw err;
    }
  },

  // Create FAQ
  createFaq: async (faqData) => {
    try {
      set({ loading: true, error: null });
      
      const formData = new FormData();
      formData.append('question_en', faqData.question_en);
      formData.append('question_ar', faqData.question_ar);
      formData.append('answer_en', faqData.answer_en);
      formData.append('answer_ar', faqData.answer_ar);

      const res = await axios.post(`${API_URL}/faqs`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const newFaq = res.data.data || res.data;
      set(state => ({ 
        faqs: [...state.faqs, newFaq], 
        loading: false 
      }));
      
      toast.success("FAQ created successfully!");
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create FAQ",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to create FAQ");
      throw err;
    }
  },

  // Update FAQ
  updateFaq: async (id, faqData) => {
    try {
      set({ loading: true, error: null });
      
      const formData = new FormData();
      formData.append('question_en', faqData.question_en);
      formData.append('question_ar', faqData.question_ar);
      formData.append('answer_en', faqData.answer_en);
      formData.append('answer_ar', faqData.answer_ar);

      const res = await axios.patch(`${API_URL}/faqs/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const updatedFaq = res.data.data || res.data;
      set(state => ({
        faqs: state.faqs.map(faq => 
          (faq.id || faq._id) === id ? updatedFaq : faq
        ),
        loading: false
      }));
      
      toast.success("FAQ updated successfully!");
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update FAQ",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to update FAQ");
      throw err;
    }
  },

  // Delete FAQ
  deleteFaq: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/faqs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      
      set(state => ({
        faqs: state.faqs.filter(faq => (faq.id || faq._id) !== id),
        loading: false
      }));
      
      toast.success("FAQ deleted successfully!");
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete FAQ",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to delete FAQ");
      throw err;
    }
  },

  // Clear current FAQ
  clearCurrentFaq: () => set({ currentFaq: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));
