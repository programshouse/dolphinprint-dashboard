import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { reviewsAPI } from "../../services/api";

export default function ReviewList({ onAdd, onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await reviewsAPI.list(); // expect array
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <PageLayout title="Reviews | ProfMSE">
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
    <PageLayout title="Reviews | ProfMSE">
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

          {items.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
              No reviews yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    {r.image && (
                      <img
                        src={typeof r.image === "string" ? r.image : URL.createObjectURL(r.image)}
                        alt={r.name || "Reviewer"}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{r.name || "Unnamed"}</div>
                    </div>
                    <button
                      onClick={() => onEdit?.(r)}
                      className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-5">{r.description}</p>
                </div>
              ))}
            </div>
          )}
        </PageCard>
      </div>
    </PageLayout>
  );
}
