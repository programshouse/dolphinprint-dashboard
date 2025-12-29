import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import Toaster from "../../components/ui/Toaster/Toaster";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewList({ onAdd, onEdit, onShow }) {
  const { reviews, loading, error, getAllReviews, deleteReview } = useReviewStore();

  useEffect(() => { 
    getAllReviews().catch(e => console.error("Error loading reviews:", e));
  }, [getAllReviews]);

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete review from "${review.user_name || "Unnamed"}"?`)) return;
    try {
      await deleteReview(review.id);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleShow = (review) => {
    if (onShow) onShow(review);
  };

  if (loading) {
    return (
      <PageLayout title="Reviews | Dolphin Print">
        <PageHeader title="Reviews" description="What people say about you" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading reviews...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Reviews | Dolphin Print">
      <Toaster position="bottom-right" />
      <PageHeader title="Reviews" description="What people say about you" />
      <div className="col-span-12">
        <PageCard title="All Reviews">
          <div className="flex justify-end mb-4">
            <button
              onClick={onAdd}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              + Add Review
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
              No reviews yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    {r.user_image && (
                      <img
                        src={typeof r.user_image === "string" ? r.user_image : URL.createObjectURL(r.user_image)}
                        alt={r.user_name || "Reviewer"}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{r.user_name || "Unnamed"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShow(r)}
                        className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit?.(r)}
                        className="px-3 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="px-3 py-1 rounded-md border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-5">{r.review_en || r.review_ar}</p>
                </div>
              ))}
            </div>
          )}
        </PageCard>
      </div>
    </PageLayout>
  );
}
