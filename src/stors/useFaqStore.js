import { create } from "zustand";
import { toast } from "react-toastify";
import { createApiInstance, API_CONFIG } from "../config/api";

const api = createApiInstance();

const extractData = (json) => {
  // Handle different response structures
  if (json?.data) return json.data;
  if (json?.data?.data) return json.data.data;
  return json;
};

export const useFaqStore = create((set) => ({
  faqs: [],
  loading: false,
  error: null,
  currentFaq: null,

  // Get all FAQs
  getFaqs: async () => {
    try {
      set({ loading: true, error: null });
      
      const res = await api.get("/faqs");
      set({ faqs: Array.isArray(res.data.data) ? res.data.data : res.data, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch FAQs",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to fetch FAQs");
      throw err;
    }
  },

  // Get FAQ by ID
  getFaqById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const res = await api.get(`/faqs/${id}`);
      
      const faqData = extractData(res.data);
      console.log("FAQ data received:", faqData); // Debug log
      set({ currentFaq: faqData, loading: false });
      return res.data;
    } catch (err) {
      console.error("Error fetching FAQ:", err); // Debug log
      set({
        error: err.response?.data?.message || "Failed to fetch FAQ",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to fetch FAQ");
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

      const res = await api.post("/faqs", formData, {
        headers: { 
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
      formData.append('_method', 'PUT'); // Laravel style: POST + _method=PUT

      const res = await api.post(`/faqs/${id}`, formData, {
        headers: { 
          // Don't set Content-Type for FormData, let axios set it with boundary
        },
      });

      const updatedFaq = res.data.data || res.data;
      set(state => ({
        faqs: state.faqs.map(faq => 
          String(faq.id || faq._id) === String(id) ? updatedFaq : faq
        ),
        currentFaq: state.currentFaq && String(state.currentFaq.id || state.currentFaq._id) === String(id) 
          ? updatedFaq 
          : state.currentFaq,
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
      
      await api.delete(`/faqs/${id}`);
      
      set(state => ({
        faqs: state.faqs.filter(faq => String(faq.id || faq._id) !== String(id)),
        currentFaq: state.currentFaq && String(state.currentFaq.id || state.currentFaq._id) === String(id)
          ? null
          : state.currentFaq,
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
