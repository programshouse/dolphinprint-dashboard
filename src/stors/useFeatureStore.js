// src/stors/useFeatureStore.js
import { create } from "zustand";
import { toast } from "react-toastify";
import { createApiInstance } from "../config/api";

const api = createApiInstance();

export const useFeatureStore = create((set) => ({
  // State
  featuresList: [],
  selectedfeatures: null,
  loading: false,
  error: null,
  createdfeatures: null,
  updatedfeatures: null,

  // Fetch all
  fetchfeatures: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/features");
      const list = response.data?.data || response.data || [];
      set({ featuresList: list, loading: false });
      return list;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch features";
      set({ error: errorMsg, loading: false });
      toast.error("Failed to load features");
      throw err;
    }
  },

  // Fetch one
  fetchfeaturesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/features/${id}`);
      const item = response.data?.data || response.data;
      set({ selectedfeatures: item, loading: false });
      return item;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch features";
      set({ error: errorMsg, loading: false });
      toast.error("Failed to load features");
      throw err;
    }
  },

  // Create (FormData same as blog)
  createfeatures: async (data) => {
    set({ loading: true, error: null, createdfeatures: null });
    try {
      const isFormData = data instanceof FormData;

      const response = await api.post("/features", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });

      const created = response.data?.data || response.data;

      set((state) => ({
        featuresList: [created, ...(state.featuresList || [])],
        createdfeatures: created,
        loading: false,
      }));

      toast.success("features created successfully!");
      return created;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create features";
      set({ error: errorMsg, loading: false });
      toast.error(err?.response?.data?.message || "Failed to create features");
      throw err;
    }
  },

  /**
   * Update
   * - JSON: PATCH /features/:id
   * - FormData: POST /features/:id with _method=PATCH  (Laravel safe)
   */
  updatefeatures: async (idOrObj, maybeBody) => {
    const id =
      typeof idOrObj === "string" || typeof idOrObj === "number"
        ? idOrObj
        : idOrObj?.id;

    const body = maybeBody ?? (typeof idOrObj === "object" ? idOrObj : {});
    if (!id) throw new Error("updatefeatures: missing id");

    set({ loading: true, error: null, updatedfeatures: null });

    try {
      const isFormData = body instanceof FormData;
      let response;

      if (isFormData) {
        if (!body.has("_method")) body.append("_method", "PATCH");

        response = await api.post(`/features/${id}`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.patch(`/features/${id}`, body, {
          headers: { "Content-Type": "application/json" },
        });
      }

      const updated = response.data?.data ?? response.data;

      set((state) => ({
        updatedfeatures: updated,
        featuresList: (state.featuresList || []).map((x) =>
          x.id === id ? updated : x
        ),
        selectedfeatures:
          state.selectedfeatures?.id === id ? updated : state.selectedfeatures,
        loading: false,
      }));

      toast.success("features updated successfully!");
      return updated;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update features";
      set({ error: errorMsg, loading: false });
      toast.error(err?.response?.data?.message || "Failed to update features");
      throw err;
    }
  },

  // Delete
  deletefeatures: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/features/${id}`);

      set((state) => ({
        featuresList: (state.featuresList || []).filter((x) => x.id !== id),
        selectedfeatures:
          state.selectedfeatures?.id === id ? null : state.selectedfeatures,
        loading: false,
      }));

      toast.success("features deleted successfully!");
      return true;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete features";
      set({ error: errorMsg, loading: false });
      toast.error(err?.response?.data?.message || "Failed to delete features");
      throw err;
    }
  },

  clearSelectedfeatures: () => set({ selectedfeatures: null }),
  clearError: () => set({ error: null }),
  clearCreatedfeatures: () => set({ createdfeatures: null }),
  clearUpdatedfeatures: () => set({ updatedfeatures: null }),
}));
