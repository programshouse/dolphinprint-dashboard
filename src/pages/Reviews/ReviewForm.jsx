// src/pages/reviews/ReviewForm.jsx
import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewForm({ reviewId, onSuccess, onCancel }) {
  const { loading, createReview, updateReview, getReviewById, review } =
    useReviewStore();

  const [saving, setSaving] = useState(false);

  // Fields
  const [userName, setUserName] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [rate, setRate] = useState(3);
  const [isActive, setIsActive] = useState("1");

  // ✅ Keep existing image (string URL) separate from new file
  const [userImage, setUserImage] = useState(null); // string (existing) OR null
  const [newImageFile, setNewImageFile] = useState(null); // File OR null

  // Load review for edit
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

  // Fill form when review loaded
  useEffect(() => {
    if (!review) return;

    setUserName(review?.user_name || review?.name_en || review?.name || "");
    setDescEn(review?.review_en || review?.description_en || review?.description || "");
    setDescAr(review?.review_ar || review?.description_ar || "");
    setRate(Number(review?.rate || 3));
    setIsActive(review?.is_active ?? "1");

    // ✅ existing image url/string for preview
    setUserImage(review?.user_image || review?.image || null);

    // ✅ reset new file each time we load a review
    setNewImageFile(null);
  }, [review]);

  // ✅ Keep your FileUpload as-is, just store the selected File separately
  const onFile = (e) => {
    const f = e.target.files?.[0] || null;

    // Optional local validation (doesn't change FileUpload)
    if (f) {
      const okTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      // some browsers use image/jpeg for jpg, "image/jpg" is uncommon but kept
      if (!okTypes.includes(f.type)) {
        alert("Only jpg, jpeg, png, webp allowed.");
        e.target.value = "";
        return;
      }
    }

    setNewImageFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!userName.trim() || !descEn.trim() || !descAr.trim()) return;

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("user_name", userName.trim());
      fd.append("review_en", descEn.trim());
      fd.append("review_ar", descAr.trim());
      fd.append("rate", String(rate));
      fd.append("is_active", String(isActive));

      // ✅ IMPORTANT FIX:
      // Only send user_image when user selected a NEW file
      if (newImageFile instanceof File) {
        fd.append("user_image", newImageFile);
      }

      // Debug
      console.log("Submitting review form:", {
        reviewId,
        userName,
        descEn,
        descAr,
        rate,
        isActive,
        existingImage: userImage,
        newImageFile: newImageFile instanceof File ? newImageFile.name : null,
      });

      if (reviewId) {
        await updateReview(reviewId, fd);
        onSuccess?.("update");
      } else {
        // If API requires image on create, ensure it is provided:
        // if (!newImageFile) { alert("Please upload an image"); return; }

        await createReview(fd);
        onSuccess?.("create");
      }
    } catch (err) {
      console.error("Error submitting review form:", err);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (onCancel) onCancel();
    else onSuccess?.(); // fallback
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading review…</p>
      </div>
    );
  }

  const disabled = saving || !userName.trim() || !descEn.trim() || !descAr.trim();

  // For preview: if user picked a new file, show it, else show existing url
  const previewSrc =
    newImageFile instanceof File
      ? URL.createObjectURL(newImageFile)
      : typeof userImage === "string" && userImage.trim()
      ? userImage
      : null;

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
          <span className="text-lg font-semibold text-brand-600 w-8 text-center">
            {rate}
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRate(star)}
              className={`text-2xl ${
                star <= rate ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
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
        {/* ✅ Preview old or new image without changing FileUpload */}
        {previewSrc && (
          <div className="mb-3">
            <p className="text-sm text-gray-500 mb-2">
              {newImageFile ? "New image preview:" : "Current image:"}
            </p>
            <img
              src={previewSrc}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        <FileUpload
          label="upload new image"
          name="user_image"
          value={newImageFile}
          onChange={onFile}
          accept="image/*"
        />

        <p className="text-xs text-gray-500 mt-2">
          Leave empty to keep the current image (when editing).
        </p>
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
