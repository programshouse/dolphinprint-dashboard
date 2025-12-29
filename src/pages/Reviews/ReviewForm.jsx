// src/pages/reviews/ReviewForm.jsx
import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { reviewsAPI } from "../../services/api";

export default function ReviewForm({ reviewId, onSuccess }) {
  const [loading, setLoading] = useState(!!reviewId);
  const [saving, setSaving]   = useState(false);

  // EN / AR fields
  const [nameEn, setNameEn]           = useState("");
  const [nameAr, setNameAr]           = useState("");
  const [descEn, setDescEn]           = useState("");
  const [descAr, setDescAr]           = useState("");
  const [image, setImage]             = useState(null); // File or URL string

  // Load for edit
  useEffect(() => {
    if (!reviewId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await reviewsAPI.getById(reviewId);
        setNameEn(data?.name_en || data?.name || "");
        setNameAr(data?.name_ar || "");
        setDescEn(data?.description_en || data?.description || "");
        setDescAr(data?.description_ar || "");
        setImage(data?.image || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [reviewId]);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!nameEn.trim() || !nameAr.trim() || !descEn.trim() || !descAr.trim()) return;

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name_en", nameEn.trim());
      fd.append("name_ar", nameAr.trim());
      fd.append("description_en", descEn.trim());
      fd.append("description_ar", descAr.trim());
      // only append if replacing/adding a file
      if (image instanceof File) fd.append("image", image);

      if (reviewId) {
        await reviewsAPI.update(reviewId, fd);
      } else {
        await reviewsAPI.create(fd);
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => onSuccess && onSuccess();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading review…</p>
      </div>
    );
  }

  const disabled =
    saving ||
    !nameEn.trim() || !nameAr.trim() ||
    !descEn.trim() || !descAr.trim();

  return (
    <AdminForm
      title={reviewId ? "Edit Review" : "Add New Review"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={saving ? "Saving..." : reviewId ? "Update Review" : "Create Review"}
      submitDisabled={disabled}
    >
      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name (EN) *
          </label>
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            maxLength={120}
            placeholder="Reviewer name in English…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{nameEn.length}/120</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الاسم (AR) *
          </label>
          <input
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            maxLength={120}
            placeholder="اسم المقيّم بالعربية…"
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{nameAr.length}/120</p>
        </div>
      </div>

      {/* Image */}
      <div className="mt-4">
        <FileUpload
          label="Reviewer Image (optional)"
          name="image"
          value={image}
          onChange={onFile}
          accept="image/*"
        />
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Review (EN) *
          </label>
          <textarea
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="What did they say? (English)…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{descEn.length}/1000</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            التقييم (AR) *
          </label>
          <textarea
            value={descAr}
            onChange={(e) => setDescAr(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="ماذا قالوا؟ (بالعربية)…"
            dir="rtl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{descAr.length}/1000</p>
        </div>
      </div>
    </AdminForm>
  );
}
