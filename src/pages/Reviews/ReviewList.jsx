import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import Pagination, { RowsPerPageSelect } from "../../components/ui/Pagination";
import { useReviewStore } from "../../stors/useReviewStore";
import { toast } from "react-toastify";

export default function ReviewList({ onAdd, onEdit, onShow }) {
  const { reviews, loading, error, getAllReviews, deleteReview } = useReviewStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAllReviews().catch((e) => console.error("Error loading reviews:", e));
  }, [getAllReviews]);

  const totalItems = reviews?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const displayedReviews = (reviews || []).slice(startIndex, endIndex);

  const handleDelete = async (review) => {
    const rid = review?.id || review?._id;
    if (!rid) return;

    if (!window.confirm(`Delete review from "${review.user_name || "Unnamed"}"?`)) return;

    try {
      await deleteReview(rid);
      toast.success("Review deleted successfully!");
    } catch (e) {
      console.error("Error deleting review:", e);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  if (loading) {
    return (
      <PageLayout title="Reviews | Dolphin Print">
        <PageHeader title="Reviews" description="What people say about you" />
        <div className="col-span-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Reviews | Dolphin Print">
      <PageHeader title="Reviews" description="What people say about you" />
      <div className="col-span-12">
        <PageCard title="All Reviews">
          {/* Top Bar: Rows per page selector ON TOP and + Add Review button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <RowsPerPageSelect
              value={pageSize}
              onChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              options={[10, 20, 30, 50]}
            />

            <button
              type="button"
              onClick={onAdd}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors self-end sm:self-auto"
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
            <div className="text-center text-gray-600 py-10">
              No reviews yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedReviews.map((r) => (
                  <div
                    key={r.id || r._id}
                    className="rounded-xl border border-gray-200 p-4 bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        {r.user_image && (
                          <img
                            src={typeof r.user_image === "string" ? r.user_image : URL.createObjectURL(r.user_image)}
                            alt={r.user_name || "Reviewer"}
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {r.user_name || "Unnamed"}
                          </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onShow?.(r)}
                            className="px-2.5 py-1 text-xs sm:text-sm rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit?.(r)}
                            className="px-2.5 py-1 text-xs sm:text-sm rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(r)}
                            className="px-2.5 py-1 text-xs sm:text-sm rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-700 line-clamp-5">
                        {r.review_en || r.review_ar}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Bar: Page Navigation only (Rows per page is on top) */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  showRowsPerPage={false}
                />
              </div>
            </>
          )}
        </PageCard>
      </div>
    </PageLayout>
  );
}
