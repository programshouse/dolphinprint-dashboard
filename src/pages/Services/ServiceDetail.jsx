// src/pages/Services/ServiceDetail.jsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useServicesStore } from "../../stors/useServicesStore";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import { ArrowLeft, Edit, Eye, Star } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, loading } = useServicesStore();

  const service = services?.find(s => String(s.id) === String(id));

  const handleEdit = () => {
    navigate(`/services/form`, { state: { editingService: service } });
  };

  if (loading) {
    return (
      <PageLayout title="Service Details | Dolphin Print">
        <PageHeader title="Service Details" description="Loading service information..." />
        <div className="col-span-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600">
              Loading service details...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!service) {
    return (
      <PageLayout title="Service Not Found | Dolphin Print">
        <PageHeader title="Service Not Found" description="The requested service could not be found." />
        <div className="col-span-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-600 mb-4">
              Service not found.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${service.title_en || service.title || "Service"} | Dolphin Print`}>
      <div className="col-span-12">
        {/* Header with navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/services"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Service Details
              </h1>
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Service
            </button>
          </div>
        </div>

        {/* Service Details Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Title & Stats Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {service.title_en || service.title}
                </h2>
                {service.title_ar && (
                  <h3 className="text-lg font-medium text-gray-600" dir="rtl">
                    {service.title_ar}
                  </h3>
                )}
              </div>

              {/* Rate & Views Badges */}
              <div className="flex items-center gap-3">
                {service.rate != null && service.rate !== "" && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200 text-sm font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{service.rate}</span>
                  </div>
                )}
                {service.views != null && service.views !== "" && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>{Number(service.views).toLocaleString()} views</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            {/* English Version */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                English Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Title (English)
                  </h4>
                  <p className="text-gray-700">
                    {service.title_en || service.title || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Description (English)
                  </h4>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {service.description_en || service.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arabic Version */}
            {(service.title_ar || service.description_ar) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Arabic Details
                </h3>
                <div className="space-y-4" dir="rtl">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      العنوان (العربية)
                    </h4>
                    <p className="text-gray-700">
                      {service.title_ar || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      الوصف (العربية)
                    </h4>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {service.description_ar || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image */}
            {service.image && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Service Image
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden max-w-2xl">
                  <img
                    src={service.image}
                    alt={service.title_en || service.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* Complete Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Service ID
                </h4>
                <p className="text-gray-700 font-mono text-sm">
                  {service.id || service._id || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Rating
                </h4>
                <p className="text-gray-700 font-semibold text-sm flex items-center gap-1">
                  {service.rate != null && service.rate !== "" ? (
                    <>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.rate} / 5</span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Views
                </h4>
                <p className="text-gray-700 font-semibold text-sm flex items-center gap-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>
                    {service.views != null && service.views !== ""
                      ? Number(service.views).toLocaleString()
                      : "0"}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Created At
                </h4>
                <p className="text-gray-700 text-sm">
                  {service.created_at
                    ? new Date(service.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Updated At
                </h4>
                <p className="text-gray-700 text-sm">
                  {service.updated_at
                    ? new Date(service.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
