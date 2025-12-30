import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useServicesStore } from "../../stors/useServicesStore";
import { toast } from "react-toastify";

export default function ServiceForm({ serviceId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    image: null, // existing string OR File
  });

  const {
    service,
    loading,
    getServiceById,
    createService,
    updateService,
    clearService,
  } = useServicesStore();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await getServiceById(serviceId);
      } catch (e) {
        console.error("Error loading service:", e);
      }
    };

    if (serviceId) load();

    return () => {
      clearService();
    };
  }, [serviceId, getServiceById, clearService]);

  useEffect(() => {
    if (serviceId && service) {
      setFormData({
        title_en: service.title_en || "",
        title_ar: service.title_ar || "",
        description_en: service.description_en || "",
        description_ar: service.description_ar || "",
        image: service.image || null,
      });
    }
  }, [serviceId, service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIX: get file from e.target.files[0]
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (serviceId) {
        await updateService(serviceId, formData);
        toast.success("Service updated successfully!");
      } else {
        await createService(formData);
        toast.success("Service created successfully!");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onSuccess?.(); // fallback to go back
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading service...
        </p>
      </div>
    );
  }

  return (
    <AdminForm
      title={serviceId ? "Edit Service" : "Add New Service"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitText={saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
      submitDisabled={
        saving ||
        !formData.title_en.trim() ||
        !formData.title_ar.trim() ||
        !formData.description_en.trim() ||
        !formData.description_ar.trim()
      }
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Title (English) *
        </label>
        <input
          type="text"
          name="title_en"
          value={formData.title_en}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Title (Arabic) *
        </label>
        <input
          type="text"
          name="title_ar"
          value={formData.title_ar}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (English) *
        </label>
        <textarea
          name="description_en"
          value={formData.description_en}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Arabic) *
        </label>
        <textarea
          name="description_ar"
          value={formData.description_ar}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <FileUpload
          label="Image"
          name="image"
          value={formData.image}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </AdminForm>
  );
}
