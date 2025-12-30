// src/pages/Services/ServiceList.jsx
import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminTable from "../../components/ui/AdminTable";
import { useServicesStore } from "../../stors/useServicesStore";

export default function ServiceList({ onEdit, onAdd, onShow }) {
  const { services, loading, error, getAllServices, deleteService } =
    useServicesStore();

  useEffect(() => {
    getAllServices().catch((e) => console.error("Error loading services:", e));
  }, [getAllServices]);

  const handleShow = (service) => {
    onShow?.(service);
  };

  const handleDelete = async (service) => {
    const serviceId = service?.id || service?._id;
    if (!serviceId) {
      return;
    }

    const title = service.title_en || service.title_ar || "service";
    if (!window.confirm(`Delete "${title}"?`)) return;

    try {
      await deleteService(serviceId);
      // If store doesn't remove it automatically:
      // await getAllServices();
    } catch (e) {
      console.error("Error deleting service:", e);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (s) => {
        const title = s.title_en || s.title_ar || "Untitled";
        return (
          <div className="max-w-xs truncate" title={title}>
            {title}
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      render: (s) => {
        const description =
          s.description_en || s.description_ar || "No description";
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
      render: (s) => {
        const title = s.title_en || s.title_ar || "Service";
        return s.image ? (
          <img
            src={typeof s.image === "string" ? s.image : URL.createObjectURL(s.image)}
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
          onEdit={onEdit}
          onShow={onShow ? handleShow : undefined}
          onDelete={handleDelete}
          onAdd={onAdd}
          addText="Add New Service"
        />
      </div>
    </PageLayout>
  );
}
