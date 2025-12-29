// src/stors/useReviewStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://www.programshouse.com/dashboards/dolphin/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

// Token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 interceptor
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

const extractData = (payload) => payload?.data ?? payload;

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

export const useReviewStore = create((set) => ({
  reviews: [],
  review: null,
  loading: false,
  error: null,
  createdReview: null,
  updatedReview: null,

  // Get all
  getAllReviews: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/reviews");
      const reviews = extractList(res.data);
      set({ reviews, loading: false });
      return reviews;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to fetch reviews";
      set({ error: msg, loading: false });
      toast.error("Failed to load reviews");
      throw err;
    }
  },

  // Get by id
  getReviewById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/reviews/${id}`);
      const review = extractData(res.data);
      set({ review, loading: false });
      return review;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to fetch review";
      set({ error: msg, loading: false });
      toast.error("Failed to load review");
      throw err;
    }
  },

  /**
   * Create review
   * - FormData: POST /reviews (multipart)
   * - JSON: POST /reviews
   */
  createReview: async (data) => {
    set({ loading: true, error: null, createdReview: null });
    try {
      const isFormData = data instanceof FormData;

      const res = await api.post("/reviews", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });

      const created = extractData(res.data);

      set((state) => ({
        reviews: [created, ...(state.reviews || [])],
        review: created,
        createdReview: created,
        loading: false,
      }));

      toast.success("Review created successfully!");
      return created;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create review";
      set({ error: msg, loading: false });
      toast.error(err?.response?.data?.message || "Failed to create review");
      throw err;
    }
  },

  /**
   * Update review
   * - JSON: PATCH /reviews/:id
   * - FormData: POST /reviews/:id with _method=PATCH (Laravel safe)
   * Refetch once if backend response returns null image.
   */
  updateReview: async (id, data) => {
    if (!id) throw new Error("updateReview: missing id");

    set({ loading: true, error: null, updatedReview: null });

    try {
      const isFormData = data instanceof FormData;
      let res;

      if (isFormData) {
        if (!data.has("_method")) data.append("_method", "PATCH");

        res = await api.post(`/reviews/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.patch(`/reviews/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        });
      }

      let updated = extractData(res.data);

      // If we uploaded an image but response doesn't include it, refetch once
      if (isFormData && (!updated?.user_image || updated?.user_image === null)) {
        const show = await api.get(`/reviews/${id}`);
        updated = extractData(show.data) || updated;
      }

      // Cache-bust image (optional)
      if (updated?.user_image && typeof updated.user_image === "string") {
        const ts = Date.now();
        const sep = updated.user_image.includes("?") ? "&" : "?";
        updated = { ...updated, user_image: `${updated.user_image}${sep}t=${ts}` };
      }

      set((state) => ({
        reviews: (state.reviews || []).map((r) =>
          String(r.id) === String(id) ? updated : r
        ),
        review: String(state.review?.id) === String(id) ? updated : state.review,
        updatedReview: updated,
        loading: false,
      }));

      toast.success("Review updated successfully!");
      return updated;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update review";
      set({ error: msg, loading: false });
      toast.error(err?.response?.data?.message || "Failed to update review");
      throw err;
    }
  },

  // Delete
  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/reviews/${id}`);

      set((state) => ({
        reviews: (state.reviews || []).filter((r) => String(r.id) !== String(id)),
        review: String(state.review?.id) === String(id) ? null : state.review,
        loading: false,
      }));

      toast.success("Review deleted successfully!");
      return true;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete review";
      set({ error: msg, loading: false });
      toast.error(err?.response?.data?.message || "Failed to delete review");
      throw err;
    }
  },

  clearReview: () => set({ review: null }),
  clearError: () => set({ error: null }),
  clearCreatedReview: () => set({ createdReview: null }),
  clearUpdatedReview: () => set({ updatedReview: null }),
}));
