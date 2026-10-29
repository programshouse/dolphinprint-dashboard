import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { useReviewStore } from "../../stors/useReviewStore";
import { useServicesStore } from "../../stors/useServicesStore";
import { useFaqStore } from "../../stors/useFaqStore";
import { useBlogStore } from "../../stors/useBlogStore";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { reviews, getAllReviews } = useReviewStore();
  const { services, getAllServices } = useServicesStore();
  const { faqs, getFaqs } = useFaqStore();
  const { blogs, getAllBlogs } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllReviews().catch(e => console.error("Error loading reviews:", e));
    getAllServices().catch(e => console.error("Error loading services:", e));
    getFaqs().catch(e => console.error("Error loading FAQs:", e));
    getAllBlogs().catch(e => console.error("Error loading blogs:", e));
  }, [getAllReviews, getAllServices, getFaqs, getAllBlogs]);

  const recentReviews = reviews.slice(0, 3);

  return (
    <PageLayout title="Dashboard | Dolphin Print">
      <PageHeader 
        title="Dolphin Dashboard"
      />

      <div className="col-span-12 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <PageCard title="Total Reviews">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-600">
                    {reviews.length}
                  </div>
                  <p className="text-sm text-gray-500">
                    Customer reviews
                  </p>
                </div>
              </div>
            </div>
          </PageCard>
          
          <PageCard title="Total Services">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-600">
                    {services.length}
                  </div>
                  <p className="text-sm text-gray-500">
                    Available services
                  </p>
                </div>
              </div>
            </div>
          </PageCard>
          
          <PageCard title="Total FAQs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-600">
                    {faqs.length}
                  </div>
                  <p className="text-sm text-gray-500">
                    Frequently asked questions
                  </p>
                </div>
              </div>
            </div>
          </PageCard>

          <PageCard title="Total Blogs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-600">
                    {blogs.length}
                  </div>
                  <p className="text-sm text-gray-500">
                    Published articles
                  </p>
                </div>
              </div>
            </div>
          </PageCard>
        </div>

        {/* Recent Reviews Table */}
        <PageCard title="Recent Reviews">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Latest Customer Reviews</h3>
            <button
              onClick={() => navigate('/reviews')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Reviews
            </button>
          </div>
          {recentReviews.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No reviews yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Review</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {review.user_image && (
                            <img
                              src={typeof review.user_image === "string" ? review.user_image : URL.createObjectURL(review.user_image)}
                              alt={review.user_name || "Reviewer"}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          )}
                          <span className="font-medium text-gray-900">
                            {review.user_name || "Unnamed"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {review.review_en || review.review_ar}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate(`/reviews/${review.id}`)}
                          className="px-3 py-1 rounded-md border border-brand-600 text-brand-600 hover:bg-blue-50 text-sm transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PageCard>
      </div>
    </PageLayout>
  );
}
