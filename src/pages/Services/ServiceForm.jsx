// src/pages/Services/ServiceForm.jsx
import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { toastError } from "../../components/ui/Toaster/Toaster";
import { useServicesStore } from "../../stors/useServicesStore";

export default function ServiceForm({ serviceId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    rate: "",
    views: "",
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
        rate: service.rate !== null && service.rate !== undefined ? service.rate : "",
        views: service.views !== null && service.views !== undefined ? service.views : "",
        image: service.image || null,
      });
    }
  }, [serviceId, service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingField = [
      ["title_en", "Service title (English)"],
      ["title_ar", "Service title (Arabic)"],
      ["description_en", "Service description (English)"],
      ["description_ar", "Service description (Arabic)"],
    ].find(([field]) => !formData[field].trim());

    if (missingField) {
      toastError(`Please add ${missingField[1]}.`);
      return;
    }

    try {
      setSaving(true);

      if (serviceId) {
        await updateService(serviceId, formData);
      } else {
        await createService(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving service:", error);
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
        <p className="mt-2 text-gray-600">Loading service...</p>
      </div>
    );
  }

  return (
    <AdminForm
      title={serviceId ? "Edit Service" : "Add New Service"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      noValidate
      submitText={saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
      submitDisabled={saving}
    >
      {/* Title EN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Title (English) *
        </label>
        <input
          type="text"
          name="title_en"
          value={formData.title_en}
          onChange={handleInputChange}
          placeholder="e.g. Digital Printing Services"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          required
        />
      </div>

      {/* Title AR */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Title (Arabic) *
        </label>
        <input
          type="text"
          name="title_ar"
          dir="rtl"
          value={formData.title_ar}
          onChange={handleInputChange}
          placeholder="مثال: خدمات الطباعة الرقمية"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          required
        />
      </div>

      {/* Rate & Views Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate / Rating (0 - 5)
          </label>
          <input
            type="number"
            name="rate"
            min="0"
            max="5"
            step="0.1"
            value={formData.rate}
            onChange={handleInputChange}
            placeholder="e.g. 4.8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Views Count
          </label>
          <input
            type="number"
            name="views"
            min="0"
            value={formData.views}
            onChange={handleInputChange}
            placeholder="e.g. 150"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Description EN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (English) *
        </label>
        <textarea
          name="description_en"
          value={formData.description_en}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe your service in English..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          required
        />
      </div>

      {/* Description AR */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Arabic) *
        </label>
        <textarea
          name="description_ar"
          dir="rtl"
          value={formData.description_ar}
          onChange={handleInputChange}
          rows={4}
          placeholder="اكتب وصف الخدمة باللغة العربية..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          required
        />
      </div>

      {/* Image Upload */}
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
