// src/pages/Services/ServiceForm.jsx
import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { servicesAPI } from "../../services/api";

export default function ServiceForm({ serviceId, onSuccess }) {
  const [loading, setLoading] = useState(!!serviceId);
  const [saving, setSaving]   = useState(false);

  // bilingual fields + image
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn,  setDescEn]  = useState("");
  const [descAr,  setDescAr]  = useState("");
  const [image,   setImage]   = useState(null); // File or URL string

  useEffect(() => {
    if (!serviceId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await servicesAPI.getById(serviceId);
        // backward-compatible fallback if old records were single-lang
        setTitleEn(data?.title_en || data?.title || "");
        setTitleAr(data?.title_ar || "");
        setDescEn(data?.description_en || data?.description || "");
        setDescAr(data?.description_ar || "");
        setImage(data?.image || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId]);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleAr.trim() || !descEn.trim() || !descAr.trim()) return;

    try {
      setSaving(true);
      // Send as FormData so both langs + optional image are preserved
      const fd = new FormData();
      fd.append("title_en", titleEn.trim());
      fd.append("title_ar", titleAr.trim());
      fd.append("description_en", descEn.trim());
      fd.append("description_ar", descAr.trim());
      if (image instanceof File) fd.append("image", image);

      if (serviceId) {
        await servicesAPI.update(serviceId, fd); // requires small tweak below
      } else {
        await servicesAPI.create(fd);            // requires small tweak below
      }

      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => onSuccess && onSuccess();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading service…</p>
      </div>
    );
  }

  const disabled =
    saving ||
    !titleEn.trim() || !titleAr.trim() ||
    !descEn.trim()  || !descAr.trim();

  return (
    <AdminForm
      title={serviceId ? "Edit Service" : "Add New Service"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
      submitDisabled={disabled}
    >
      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Service Title (EN) *
          </label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="e.g., Leadership Coaching"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عنوان الخدمة (AR) *
          </label>
          <input
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder="مثال: تدريب القيادة"
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (EN) *
          </label>
          <textarea
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            rows={5}
            placeholder="Describe the service in English…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الوصف (AR) *
          </label>
          <textarea
            value={descAr}
            onChange={(e) => setDescAr(e.target.value)}
            rows={5}
            placeholder="صف الخدمة بالعربية…"
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      {/* Image */}
      <div className="mt-4">
        <FileUpload
          label="Service Image (optional)"
          name="image"
          value={image}
          onChange={onFile}
          accept="image/*"
        />
      </div>
    </AdminForm>
  );
}
