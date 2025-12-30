import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useReviewStore } from "../../stors/useReviewStore";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import { ArrowLeft, Edit } from "lucide-react";

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reviews, loading } = useReviewStore();

const review = reviews?.find(r => String(r.id || r._id) === String(id));

  const handleEdit = () => {
    navigate(`/reviews/form`, { state: { editingReview: review } });
  };

  if (loading) {
    return (
      <PageLayout title="Review Details | Dolphin Print">
        <PageHeader title="Review Details" description="Loading review information..." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading review details...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!review) {
    return (
      <PageLayout title="Review Not Found | Dolphin Print">
        <PageHeader title="Review Not Found" description="The requested review could not be found." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Review not found.
            </p>
            <Link
              to="/reviews"
              className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reviews
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${review.user_name || "Anonymous"} Review | Dolphin Print`}>
      <div className="col-span-12">
        {/* Header with navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/reviews"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Reviews
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Review Details
              </h1>
            </div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Review
            </button>
          </div>
        </div>

        {/* Review Details Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Reviewer Info Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-6">
              {review.user_image && (
                <img
                  src={typeof review.user_image === "string" ? review.user_image : URL.createObjectURL(review.user_image)}
                  alt={review.user_name || "Reviewer"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {review.user_name || "Anonymous"}
                </h2>
                {review.user_job && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{review.user_job}</p>
                )}
                {review.rate && (
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < review.rate ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-lg font-medium text-gray-600 dark:text-gray-400">
                      {review.rate}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            {/* English Review */}
            {review.review_en && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  English Review
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {review.review_en}
                  </p>
                </div>
              </div>
            )}

            {/* Arabic Review */}
            {review.review_ar && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Arabic Review
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6" dir="rtl">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {review.review_ar}
                  </p>
                </div>
              </div>
            )}

            {!review.review_en && !review.review_ar && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Review Content
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    No review content provided.
                  </p>
                </div>
              </div>
            )}

            {/* Complete Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Review ID
                </h4>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                  {review.id || review._id || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Status
                </h4>
                <p className={`font-medium ${review.is_active == "1" ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {review.is_active == "1" ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Created At
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {review.created_at 
                    ? new Date(review.created_at).toLocaleDateString('en-US', {
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
                  {review.updated_at 
                    ? new Date(review.updated_at).toLocaleDateString('en-US', {
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
            {Object.keys(review).filter(key => 
              !['id', '_id', 'user_name', 'user_job', 'user_image', 'rate', 'review_en', 'review_ar', 'is_active', 'created_at', 'updated_at'].includes(key)
            ).length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {Object.entries(review).map(([key, value]) => {
                    if (['id', '_id', 'user_name', 'user_job', 'user_image', 'rate', 'review_en', 'review_ar', 'is_active', 'created_at', 'updated_at'].includes(key)) {
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
