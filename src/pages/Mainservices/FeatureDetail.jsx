import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFeatureStore } from "../../stors/useFeatureStore";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import { ArrowLeft, Edit } from "lucide-react";

export default function FeatureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { featuresList, loading } = useFeatureStore();

  const feature = featuresList?.find(f => f.id === parseInt(id));

  const handleEdit = () => {
    navigate(`/mainservices/form`, { state: { editingFeature: feature } });
  };

  if (loading) {
    return (
      <PageLayout title="Feature Details | Dolphin Print">
        <PageHeader title="Feature Details" description="Loading feature information..." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading feature details...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!feature) {
    return (
      <PageLayout title="Feature Not Found | Dolphin Print">
        <PageHeader title="Feature Not Found" description="The requested feature could not be found." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Feature not found.
            </p>
            <Link
              to="/mainservices"
              className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Features
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${feature.title_en || feature.title || "Feature"} | Dolphin Print`}>
      <div className="col-span-12">
        {/* Header with navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/mainservices"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Features
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Feature Details
              </h1>
            </div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Feature
            </button>
          </div>
        </div>

        {/* Feature Details Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Feature Image */}
          {feature.image && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <img
                src={typeof feature.image === "string" ? feature.image : URL.createObjectURL(feature.image)}
                alt={feature.title_en || feature.title || "Feature"}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            {/* English Version */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                English Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Title (English)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {feature.title_en || feature.title || "No title provided"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Description (English)
                  </h4>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: feature.description_en || feature.description || "No description provided" 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Arabic Version */}
            {(feature.title_ar || feature.description_ar) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Arabic Details
                </h3>
                <div className="space-y-4" dir="rtl">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      العنوان (العربية)
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {feature.title_ar || "لا يوجد عنوان"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      الوصف (العربية)
                    </h4>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div 
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: feature.description_ar || "لا يوجد وصف" 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Feature ID
                </h4>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                  {feature.id || feature._id || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Created At
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {feature.created_at 
                    ? new Date(feature.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Updated At
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {feature.updated_at 
                    ? new Date(feature.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            {/* Additional Fields (if any) */}
            {Object.keys(feature).filter(key => 
              !['id', '_id', 'title_en', 'title_ar', 'title', 'description_en', 'description_ar', 'description', 'image', 'created_at', 'updated_at'].includes(key)
            ).length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {Object.entries(feature).map(([key, value]) => {
                    if (['id', '_id', 'title_en', 'title_ar', 'title', 'description_en', 'description_ar', 'description', 'image', 'created_at', 'updated_at'].includes(key)) {
                      return null;
                    }
                    return (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
