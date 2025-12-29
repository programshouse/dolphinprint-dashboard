import React from "react";

export default function FeatureDetail({ feature, onClose }) {
  if (!feature) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feature Details
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

          {/* Feature Image */}
          {feature.image && (
            <div className="mb-6">
              <img
                src={typeof feature.image === "string" ? feature.image : URL.createObjectURL(feature.image)}
                alt={feature.title_en || feature.title || "Feature"}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* English Version */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              English
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Title:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {feature.title_en || feature.title || "No title provided"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Description:
                </h4>
                <div 
                  className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: feature.description_en || feature.description || "No description provided" 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Arabic Version */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              العربية
            </h3>
            <div className="space-y-4" dir="rtl">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  العنوان:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {feature.title_ar || "لا يوجد عنوان"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  الوصف:
                </h4>
                <div 
                  className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: feature.description_ar || "لا يوجد وصف" 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {feature.created_at && (
                <div>
                  Created: {new Date(feature.created_at).toLocaleDateString()}
                </div>
              )}
              {feature.updated_at && (
                <div>
                  Updated: {new Date(feature.updated_at).toLocaleDateString()}
                </div>
              )}
              {feature.id && (
                <div>
                  ID: {feature.id}
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
