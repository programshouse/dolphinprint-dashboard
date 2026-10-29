// src/stors/useBlogStore.js
import { create } from "zustand";
import { toast } from "react-toastify";
import { createApiInstance } from "../config/api";

const api = createApiInstance();

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const extractData = (payload) => payload?.data ?? payload;

export const useBlogStore = create((set, get) => ({
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,

  // Fetch all blogs
  getAllBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/blogs");
      const blogs = extractList(response.data);
      set({ blogs, loading: false });
      return blogs;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to fetch blogs";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw err;
    }
  },

  // Fetch single blog by ID
  getBlogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/blogs/${id}`);
      const blog = extractData(response.data);
      set({ selectedBlog: blog, loading: false });
      return blog;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to fetch blog";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw err;
    }
  },

  // Create blog (multipart/form-data)
  createBlog: async (payload) => {
    set({ loading: true, error: null });
    try {
      let body;
      if (payload instanceof FormData) {
        body = payload;
        if (!body.has("title") && (body.has("title_en") || body.has("title_ar"))) {
          body.append("title", body.get("title_en") || body.get("title_ar") || "");
        }
        if (!body.has("category") && (body.has("category_en") || body.has("category_ar"))) {
          body.append("category", body.get("category_en") || body.get("category_ar") || "");
        }
        if (!body.has("content") && (body.has("content_en") || body.has("content_ar"))) {
          body.append("content", body.get("content_en") || body.get("content_ar") || "");
        }
      } else {
        body = new FormData();
        // Titles
        if (payload.title_en !== undefined) body.append("title_en", payload.title_en ?? "");
        if (payload.title_ar !== undefined) body.append("title_ar", payload.title_ar ?? "");
        body.append("title", payload.title_en || payload.title_ar || payload.title || "");

        // Categories
        if (payload.category_en !== undefined) body.append("category_en", payload.category_en ?? "");
        if (payload.category_ar !== undefined) body.append("category_ar", payload.category_ar ?? "");
        body.append("category", payload.category_en || payload.category_ar || payload.category || "");

        // Contents
        if (payload.content_en !== undefined) body.append("content_en", payload.content_en ?? "");
        if (payload.content_ar !== undefined) body.append("content_ar", payload.content_ar ?? "");
        body.append("content", payload.content_en || payload.content_ar || payload.content || "");

        // Author
        if (payload.user_name !== undefined) body.append("user_name", payload.user_name ?? "");

        // Images
        if (payload.image instanceof File) body.append("image", payload.image);
        if (payload.user_image instanceof File) body.append("user_image", payload.user_image);
      }

      const response = await api.post("/blogs", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = extractData(response.data);
      set((state) => ({
        blogs: [created, ...(state.blogs || [])],
        selectedBlog: created,
        loading: false,
      }));

      toast.success("Blog created successfully!");
      return created;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to create blog";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw err;
    }
  },

  // Update blog (Laravel-friendly POST with _method=PUT)
  updateBlog: async (id, payload) => {
    if (!id) throw new Error("updateBlog: missing id");
    set({ loading: true, error: null });

    try {
      let body;
      if (payload instanceof FormData) {
        body = payload;
        if (!body.has("_method")) body.append("_method", "PUT");
        if (!body.has("title") && (body.has("title_en") || body.has("title_ar"))) {
          body.append("title", body.get("title_en") || body.get("title_ar") || "");
        }
        if (!body.has("category") && (body.has("category_en") || body.has("category_ar"))) {
          body.append("category", body.get("category_en") || body.get("category_ar") || "");
        }
        if (!body.has("content") && (body.has("content_en") || body.has("content_ar"))) {
          body.append("content", body.get("content_en") || body.get("content_ar") || "");
        }
      } else {
        body = new FormData();
        body.append("_method", "PUT");

        // Titles
        if (payload.title_en !== undefined) body.append("title_en", payload.title_en ?? "");
        if (payload.title_ar !== undefined) body.append("title_ar", payload.title_ar ?? "");
        body.append("title", payload.title_en || payload.title_ar || payload.title || "");

        // Categories
        if (payload.category_en !== undefined) body.append("category_en", payload.category_en ?? "");
        if (payload.category_ar !== undefined) body.append("category_ar", payload.category_ar ?? "");
        body.append("category", payload.category_en || payload.category_ar || payload.category || "");

        // Contents
        if (payload.content_en !== undefined) body.append("content_en", payload.content_en ?? "");
        if (payload.content_ar !== undefined) body.append("content_ar", payload.content_ar ?? "");
        body.append("content", payload.content_en || payload.content_ar || payload.content || "");

        // Author
        if (payload.user_name !== undefined) body.append("user_name", payload.user_name ?? "");

        // Images
        if (payload.image instanceof File) body.append("image", payload.image);
        if (payload.user_image instanceof File) body.append("user_image", payload.user_image);
      }

      const response = await api.post(`/blogs/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = extractData(response.data);
      set((state) => ({
        blogs: (state.blogs || []).map((b) =>
          String(b.id || b._id) === String(id) ? updated : b
        ),
        selectedBlog:
          state.selectedBlog && String(state.selectedBlog.id || state.selectedBlog._id) === String(id)
            ? updated
            : state.selectedBlog,
        loading: false,
      }));

      toast.success("Blog updated successfully!");
      return updated;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to update blog";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw err;
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: (state.blogs || []).filter((b) => String(b.id || b._id) !== String(id)),
        selectedBlog:
          state.selectedBlog && String(state.selectedBlog.id || state.selectedBlog._id) === String(id)
            ? null
            : state.selectedBlog,
        loading: false,
      }));

      toast.success("Blog deleted successfully!");
      return true;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to delete blog";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw err;
    }
  },

  clearSelectedBlog: () => set({ selectedBlog: null }),
  clearError: () => set({ error: null }),
}));
