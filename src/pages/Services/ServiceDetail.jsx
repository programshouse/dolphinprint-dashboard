import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useServicesStore } from "../../stors/useServicesStore";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import { ArrowLeft, Edit } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, loading } = useServicesStore();

  const service = services?.find(s => s.id === parseInt(id));

  const handleEdit = () => {
    navigate(`/services/form`, { state: { editingService: service } });
  };

  if (loading) {
    return (
      <PageLayout title="Service Details | Dolphin Print">
        <PageHeader title="Service Details" description="Loading service information..." />
        <div className="col-span-12">
          <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600 ">
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
          <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6 text-center">
            <p className="text-gray-600  mb-4">
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
    <PageLayout title={`${service.title} | Dolphin Print`}>
      <div className="col-span-12">
        {/* Header with navigation */}
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/services"
                className="inline-flex items-center text-gray-600 hover:text-gray-900   transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
              <div className="h-6 w-px bg-gray-300 " />
              <h1 className="text-2xl font-semibold text-gray-900 ">
                Service Details
              </h1>
            </div>
            
          </div>
        </div>

        {/* Service Details Content */}
        <div className="bg-white  rounded-lg shadow-sm border border-gray-200  overflow-hidden">
          {/* Title Section */}
          <div className="p-6 border-b border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-900  mb-2">
              {service.title_en || service.title}
            </h2>
            {service.title_ar && (
              <h3 className="text-lg font-medium text-gray-600 " dir="rtl">
                {service.title_ar}
              </h3>
            )}
          </div>

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            {/* English Version */}
            <div>
              <h3 className="text-lg font-medium text-gray-900  mb-3">
                English Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500  mb-2">
                    Title (English)
                  </h4>
                  <p className="text-gray-700 ">
                    {service.title_en || service.title || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500  mb-2">
                    Description (English)
                  </h4>
                  <div className="prose prose-gray  max-w-none">
                    <p className="text-gray-700  whitespace-pre-wrap leading-relaxed">
                      {service.description_en || service.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arabic Version */}
            {(service.title_ar || service.description_ar) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900  mb-3">
                  Arabic Details
                </h3>
                <div className="space-y-4" dir="rtl">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500  mb-2">
                      العنوان (العربية)
                    </h4>
                    <p className="text-gray-700 ">
                      {service.title_ar || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500  mb-2">
                      الوصف (العربية)
                    </h4>
                    <div className="prose prose-gray  max-w-none">
                      <p className="text-gray-700  whitespace-pre-wrap leading-relaxed">
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
                <h3 className="text-lg font-medium text-gray-900  mb-3">
                  Service Image
                </h3>
                <div className="border border-gray-200  rounded-lg overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title_en || service.title}
                    className="w-full max-w-2xl h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* Complete Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200 ">
              <div className="bg-gray-50  rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500  mb-2">
                  Service ID
                </h4>
                <p className="text-gray-700  font-mono text-sm">
                  {service.id || service._id || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50  rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500  mb-2">
                  Created At
                </h4>
                <p className="text-gray-700 ">
                  {service.created_at 
                    ? new Date(service.created_at).toLocaleDateString('en-US', {
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
              <div className="bg-gray-50  rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500  mb-2">
                  Updated At
                </h4>
                <p className="text-gray-700 ">
                  {service.updated_at 
                    ? new Date(service.updated_at).toLocaleDateString('en-US', {
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
            {Object.keys(service).filter(key => 
              !['id', '_id', 'title_en', 'title_ar', 'title', 'description_en', 'description_ar', 'description', 'image', 'created_at', 'updated_at'].includes(key)
            ).length > 0 && (
              <div>

              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
