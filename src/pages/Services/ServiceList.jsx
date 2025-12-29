// src/pages/Services/ServiceList.jsx
import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminTable from "../../components/ui/AdminTable";
import { useServicesStore } from "../../stors/useServicesStore";

export default function ServiceList({ onEdit, onAdd, onShow }) {
  const { services, loading, error, getAllServices, deleteService } = useServicesStore();

  useEffect(() => {
    getAllServices().catch(e => console.error("Error loading services:", e));
  }, [getAllServices]);

  const handleEdit = (item) => {
    if (onEdit) onEdit(item);
  };

  const handleShow = (item) => {
    if (onShow) onShow(item);
  };

  // ✅ AdminTable sends index to onDelete(index)
  const handleDelete = async (index) => {
    const service = services?.[index];
    if (!service) return;

    const title = service.title_en || service.title_ar || "this service";
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteService(service.id);
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const columns = [
    { 
      key: "title", 
      header: "Title",
      render: (service) => {
        const title = service.title_en || service.title_ar || "Untitled";
        return (
          <div className="max-w-xs truncate" title={title}>
            {title}
          </div>
        );
      }
    },
    {
      key: "description",
      header: "Description",
      render: (service) => {
        const description = service.description_en || service.description_ar || "No description";
        return (
          <div className="max-w-xs truncate" title={description}>
            {description}
          </div>
        );
      },
    },
    {
      key: "image",
      header: "Image",
      render: (service) => {
        const title = service.title_en || service.title_ar || "Service";
        return service.image ? (
          <img
            src={service.image}
            alt={title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <PageLayout title="Services Management | Dolphin Print">
        <PageHeader
          title="Services Management"
          description="Manage services that appear on the website"
        />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading services...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Services Management | Dolphin Print">
        <PageHeader
          title="Services Management"
          description="Manage services that appear on the website"
        />
        <div className="col-span-12">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠</div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Failed to Load Services
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => getAllServices()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Services Management | Dolphin Print">
      <PageHeader
        title="Services Management"
        description="Manage services that appear on the website"
      />
      <div className="col-span-12">
        <AdminTable
          title="Services"
          data={services || []}
          columns={columns}
          onEdit={handleEdit}
          onShow={onShow ? handleShow : undefined}
          onDelete={handleDelete}
          onAdd={onAdd}
          addText="Add New Service"
        />
      </div>
    </PageLayout>
  );
}
