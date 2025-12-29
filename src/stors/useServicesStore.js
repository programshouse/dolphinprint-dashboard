// src/stors/useServicesStore.js
import { create } from "zustand";
import { toast } from "react-toastify";

const API_URL = "https://www.programshouse.com/dashboards/dolphin/api";

const getToken = () => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  // Basic JWT format check
  if (token && token.split(".").length === 3) return token;

  return null;
};

const pickFile = (img) => {
  if (!img) return null;
  if (img instanceof File) return img;
  if (img instanceof FileList) return img[0] ?? null;
  if (Array.isArray(img)) return img[0] ?? null;
  return null;
};

const extractData = (json) => json?.data ?? json;

const extractList = (json) => {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  return [];
};

const cacheBustImage = (service) => {
  if (service?.image && typeof service.image === "string") {
    const sep = service.image.includes("?") ? "&" : "?";
    return { ...service, image: `${service.image}${sep}t=${Date.now()}` };
  }
  return service;
};

export const useServicesStore = create((set, get) => ({
  services: [],
  service: null,
  loading: false,
  error: null,

  // Get all services
  getAllServices: async (retryCount = 0) => {
    try {
      set({ loading: true, error: null });

      const token = getToken();
      if (!token) {
        throw new Error("No valid authentication token found. Please login again.");
      }

      const response = await fetch(`${API_URL}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Backend route error
        if (
          response.status === 500 &&
          errorText.includes("Route [login] not defined")
        ) {
          throw new Error(
            "Backend authentication route missing. Please contact administrator to add login route to API."
          );
        }

        // Retry once on 401
        if (response.status === 401 && retryCount < 1) {
          await new Promise((r) => setTimeout(r, 1000));
          return get().getAllServices(retryCount + 1);
        }

        throw new Error(`Failed to fetch services: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      const services = extractList(json);

      set({ services, loading: false });
      return services;
    } catch (err) {
      set({ error: err.message || "Failed to fetch services", loading: false });
      toast.error(err.message || "Failed to load services");
      throw err;
    }
  },

  // Get service by ID (also updates store.service)
  getServiceById: async (id) => {
    try {
      set({ loading: true, error: null });

      const token = getToken();
      if (!token) throw new Error("No valid authentication token found. Please login again.");

      const response = await fetch(`${API_URL}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch service: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      const service = extractData(json);

      set({ service, loading: false });
      return service;
    } catch (err) {
      set({ error: err.message || "Failed to fetch service", loading: false });
      toast.error(err.message || "Failed to load service");
      throw err;
    }
  },

  // Create service
  createService: async (serviceData) => {
    try {
      set({ loading: true, error: null });

      const token = getToken();
      if (!token) throw new Error("No valid authentication token found. Please login again.");

      const file = pickFile(serviceData?.image);
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("title_en", serviceData?.title_en ?? "");
        formData.append("title_ar", serviceData?.title_ar ?? "");
        formData.append("description_en", serviceData?.description_en ?? "");
        formData.append("description_ar", serviceData?.description_ar ?? "");
        formData.append("image", file); // ✅ image

        response = await fetch(`${API_URL}/services`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // don't set Content-Type for FormData
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/services`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title_en: serviceData?.title_en ?? "",
            title_ar: serviceData?.title_ar ?? "",
            description_en: serviceData?.description_en ?? "",
            description_ar: serviceData?.description_ar ?? "",
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create service: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      let createdService = extractData(json);
      createdService = cacheBustImage(createdService);

      set((state) => ({
        services: [createdService, ...(state.services || [])],
        service: createdService,
        loading: false,
      }));

      toast.success("Service created successfully!");
      return createdService;
    } catch (err) {
      set({ error: err.message || "Failed to create service", loading: false });
      toast.error(err.message || "Failed to create service");
      throw err;
    }
  },

  // Update service
  updateService: async (id, serviceData) => {
    try {
      set({ loading: true, error: null });

      const token = getToken();
      if (!token) throw new Error("No valid authentication token found. Please login again.");

      const file = pickFile(serviceData?.image);
      const isFormData = !!file;

      let response;

      if (isFormData) {
        // Laravel style: POST + _method=PUT
        const formData = new FormData();
        formData.append("title_en", serviceData?.title_en ?? "");
        formData.append("title_ar", serviceData?.title_ar ?? "");
        formData.append("description_en", serviceData?.description_en ?? "");
        formData.append("description_ar", serviceData?.description_ar ?? "");
        formData.append("image", file); // ✅ image (not Image)
        formData.append("_method", "PUT");

        response = await fetch(`${API_URL}/services/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        // text-only update
        response = await fetch(`${API_URL}/services/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title_en: serviceData?.title_en ?? "",
            title_ar: serviceData?.title_ar ?? "",
            description_en: serviceData?.description_en ?? "",
            description_ar: serviceData?.description_ar ?? "",
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update service: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      let updatedService = extractData(json);

      // If backend doesn't return the image on upload, refetch once
      if (isFormData && (!updatedService?.image || updatedService?.image === null)) {
        try {
          const fresh = await get().getServiceById(id);
          updatedService = fresh || updatedService;
        } catch {
          // ignore refetch error
        }
      }

      updatedService = cacheBustImage(updatedService);

      set((state) => ({
        services: (state.services || []).map((s) =>
          String(s.id) === String(id) ? updatedService : s
        ),
        service:
          state.service && String(state.service.id) === String(id)
            ? updatedService
            : state.service,
        loading: false,
      }));

      toast.success("Service updated successfully!");
      return updatedService;
    } catch (err) {
      set({ error: err.message || "Failed to update service", loading: false });
      toast.error(err.message || "Failed to update service");
      throw err;
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      set({ loading: true, error: null });

      const token = getToken();
      if (!token) throw new Error("No valid authentication token found. Please login again.");

      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete service: ${response.status} ${errorText}`);
      }

      set((state) => ({
        services: (state.services || []).filter((s) => String(s.id) !== String(id)),
        // if currently opened service is deleted
        service:
          state.service && String(state.service.id) === String(id)
            ? null
            : state.service,
        loading: false,
      }));

      toast.success("Service deleted successfully!");
      return true;
    } catch (err) {
      set({ error: err.message || "Failed to delete service", loading: false });
      toast.error(err.message || "Failed to delete service");
      throw err;
    }
  },

  clearService: () => set({ service: null }),
  clearError: () => set({ error: null }),
}));
