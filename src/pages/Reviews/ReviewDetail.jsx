import React from "react";
import Toaster from "../../components/ui/Toaster/Toaster";

export default function ReviewDetail({ review, onClose }) {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Toaster position="bottom-right" />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Reviewer Info */}
          <div className="flex items-center gap-4 mb-6">
            {review.user_image && (
              <img
                src={typeof review.user_image === "string" ? review.user_image : URL.createObjectURL(review.user_image)}
                alt={review.user_name || "Reviewer"}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {review.user_name || "Anonymous"}
              </h3>
              {review.user_job && (
                <p className="text-gray-600 dark:text-gray-400">{review.user_job}</p>
              )}
              {review.rate && (
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rate ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {review.rate}/5
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Review
            </h4>
            
            {/* English Review */}
            {review.review_en && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">English:</h5>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {review.review_en}
                  </p>
                </div>
              </div>
            )}
            
            {/* Arabic Review */}
            {review.review_ar && (
              <div>
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">العربية:</h5>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap" dir="rtl">
                    {review.review_ar}
                  </p>
                </div>
              </div>
            )}
            
            {!review.review_en && !review.review_ar && (
              <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  No review content provided.
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {review.is_active !== undefined && (
                <div>
                  Status: <span className={`font-medium ${review.is_active == "1" ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {review.is_active == "1" ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )}
              {review.created_at && (
                <div>
                  Created: {new Date(review.created_at).toLocaleDateString()}
                </div>
              )}
              {review.updated_at && (
                <div>
                  Updated: {new Date(review.updated_at).toLocaleDateString()}
                </div>
              )}
              {review.id && (
                <div>
                  ID: {review.id}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
