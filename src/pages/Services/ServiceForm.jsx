import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useServicesStore } from "../../stors/useServicesStore";

export default function ServiceForm({ serviceId, onSuccess }) {
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    image: null, // can be File OR string url (when editing)
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
        console.log("Loading service with ID:", serviceId);
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
      console.log("Loading service data into form:", service);
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

  const handleFileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (serviceId) {
        await updateService(serviceId, formData);
      } else {
        await createService(formData);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onSuccess) onSuccess();
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
      submitText={
        saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"
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
