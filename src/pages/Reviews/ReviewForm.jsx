// src/pages/reviews/ReviewForm.jsx
import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewForm({ reviewId, onSuccess }) {
  const { loading, createReview, updateReview, getReviewById, review } = useReviewStore();
  const [saving, setSaving] = useState(false);

  // EN / AR fields
  const [userName, setUserName]       = useState("test 1 user_name");
  const [descEn, setDescEn]           = useState("test 1 review");
  const [descAr, setDescAr]           = useState("test 1 review");
  const [rate, setRate]               = useState(3);
  const [userImage, setUserImage]             = useState("https://www.programshouse.com/dashboards/dolphin/public/assets/reviews/image/1767012272.png");
  const [isActive, setIsActive]       = useState("1");

  // Load for edit
  useEffect(() => {
    if (!reviewId) return;
    (async () => {
      try {
        await getReviewById(reviewId);
      } catch (error) {
        console.error("Error loading review:", error);
      }
    })();
  }, [reviewId, getReviewById]);

  // Update form fields when review data changes
  useEffect(() => {
    if (!review) return;
    setUserName(review?.user_name || review?.name_en || review?.name || "test 1 user_name");
    setDescEn(review?.review_en || review?.description_en || review?.description || "test 1 review");
    setDescAr(review?.review_ar || review?.description_ar || "test 1 review");
    setRate(review?.rate || 3);
    setUserImage(review?.user_image || review?.image || "https://www.programshouse.com/dashboards/dolphin/public/assets/reviews/image/1767012272.png");
    setIsActive(review?.is_active || "1");
  }, [review]);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setUserImage(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !descEn.trim() || !descAr.trim()) return;

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("user_name", userName.trim()); // API expects user_name
      fd.append("review_en", descEn.trim()); // API expects review_en
      fd.append("review_ar", descAr.trim()); // API expects review_ar
      fd.append("rate", rate); // Add rating field
      fd.append("is_active", isActive); // Add is_active field
      
      // Handle image field - append if it's a File or if it's a URL string
      if (userImage instanceof File) {
        fd.append("user_image", userImage);
      } else if (typeof userImage === "string" && userImage.trim()) {
        fd.append("user_image", userImage.trim());
      }

      if (reviewId) {
        await updateReview(reviewId, fd);
      } else {
        await createReview(fd);
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      // Toast is already handled by the store
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
    !userName.trim() ||
    !descEn.trim() ||
    !descAr.trim();

  return (
    <AdminForm
      title={reviewId ? "Edit Review" : "Add New Review"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={saving ? "Saving..." : reviewId ? "Update Review" : "Create Review"}
      submitDisabled={disabled}
    >
      {/* User Name */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reviewer Name *
        </label>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          maxLength={120}
          placeholder="Reviewer name…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{userName.length}/120</p>
      </div>

      {/* Rating */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating *
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-lg font-semibold text-brand-600 w-8 text-center">{rate}</span>
        </div>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRate(star)}
              className={`text-2xl ${star <= rate ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Active Status */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status *
        </label>
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

      {/* Image */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reviewer Image URL (optional)
        </label>
        <input
          type="url"
          value={typeof userImage === 'string' ? userImage : ''}
          onChange={(e) => setUserImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
        />
        
        <FileUpload
          label="Or upload new image"
          name="user_image"
          value={userImage}
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
