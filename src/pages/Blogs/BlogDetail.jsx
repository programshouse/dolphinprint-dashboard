// src/pages/Blogs/BlogDetail.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogStore } from "../../stors/useBlogStore";

export default function BlogDetail({ blog, onClose }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBlog, getBlogById, loading } = useBlogStore();

  const handleClose = onClose || (() => navigate("/blogs"));

  useEffect(() => {
    if (!blog && id) {
      getBlogById(id).catch((e) => console.error("Error loading blog:", e));
    }
  }, [blog, id, getBlogById]);

  const currentBlog = blog || selectedBlog;

  if (loading && !currentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading Blog...</p>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Blog not found</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Blog Details
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Author & Cover (if available) */}
          {(currentBlog.image || currentBlog.user_name || currentBlog.user_image) && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {currentBlog.user_image ? (
                  <img
                    src={
                      typeof currentBlog.user_image === "string"
                        ? currentBlog.user_image
                        : URL.createObjectURL(currentBlog.user_image)
                    }
                    alt={currentBlog.user_name || "Author"}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    {(currentBlog.user_name || "A")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {currentBlog.user_name || "Admin"}
                  </div>
                  <div className="text-xs text-gray-500">Author</div>
                </div>
              </div>

              {currentBlog.image && (
                <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                  <img
                    src={
                      typeof currentBlog.image === "string"
                        ? currentBlog.image
                        : URL.createObjectURL(currentBlog.image)
                    }
                    alt={currentBlog.title_en || currentBlog.title_ar || "Cover"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* English Version */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              English
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Title:
              </h4>
              <p className="text-gray-700 mb-4">
                {currentBlog.title_en || currentBlog.title || "—"}
              </p>

              <h4 className="font-medium text-gray-900 mb-3">
                Category:
              </h4>
              <p className="text-gray-700 mb-4">
                {currentBlog.category_en || currentBlog.category || "—"}
              </p>

              <h4 className="font-medium text-gray-900 mb-3">
                Content:
              </h4>
              <div
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: currentBlog.content_en || currentBlog.content || "—",
                }}
              />
            </div>
          </div>

          {/* Arabic Version */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              العربية
            </h3>
            <div className="bg-gray-50 rounded-lg p-4" dir="rtl">
              <h4 className="font-medium text-gray-900 mb-3">
                العنوان:
              </h4>
              <p className="text-gray-700 mb-4">
                {currentBlog.title_ar || "—"}
              </p>

              <h4 className="font-medium text-gray-900 mb-3">
                القسم:
              </h4>
              <p className="text-gray-700 mb-4">
                {currentBlog.category_ar || "—"}
              </p>

              <h4 className="font-medium text-gray-900 mb-3">
                المحتوى:
              </h4>
              <div
                className="text-gray-700 prose prose-sm max-w-none font-sans"
                dangerouslySetInnerHTML={{
                  __html: currentBlog.content_ar || "—",
                }}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {currentBlog.created_at && (
                <div>
                  Created: {new Date(currentBlog.created_at).toLocaleDateString()}
                </div>
              )}
              {currentBlog.updated_at && (
                <div>
                  Updated: {new Date(currentBlog.updated_at).toLocaleDateString()}
                </div>
              )}
              {currentBlog.id && (
                <div>
                  ID: {currentBlog.id}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
