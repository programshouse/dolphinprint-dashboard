import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminTable from "../../components/ui/AdminTable";
import { servicesAPI } from "../../services/api";

export default function ServiceList({ onEdit, onAdd }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await servicesAPI.getAll();
      const list = Array.isArray(data) ? data : [];
      setRows(list);
    } catch (e) {
      console.error("Error loading services:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (svc) => {
    if (!window.confirm(`Delete "${svc.title_en || svc.title || "service"}"?`))
      return;
    try {
      await servicesAPI.delete(svc.id);
      load();
    } catch (e) {
      console.error("Error deleting service:", e);
      alert("Error deleting service. Please try again.");
    }
  };

  const columns = [
    {
      key: "title_en",
      header: "Title (EN)",
      render: (s) => s.title_en || s.title || <span className="text-gray-400">—</span>,
    },
    {
      key: "title_ar",
      header: "العنوان (AR)",
      render: (s) => s.title_ar || <span className="text-gray-400">—</span>,
    },
    {
      key: "description_en",
      header: "Description (EN)",
      render: (s) => (
        <div className="max-w-xs truncate" title={s.description_en || s.description || ""}>
          {s.description_en || s.description || "—"}
        </div>
      ),
    },
    {
      key: "description_ar",
      header: "الوصف (AR)",
      render: (s) => (
        <div className="max-w-xs truncate" title={s.description_ar || ""}>
          {s.description_ar || "—"}
        </div>
      ),
    },
    {
      key: "image",
      header: "Image",
      render: (s) =>
        s.image ? (
          <img
            src={typeof s.image === "string" ? s.image : URL.createObjectURL(s.image)}
            alt={s.title_en || s.title || "service"}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        ),
    },
  ];

  if (loading) {
    return (
      <PageLayout title="Services Management | ProfMSE">
        <PageHeader
          title="Services Management"
          description="Manage services that appear on the website"
        />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading services...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Services Management | ProfMSE">
      <PageHeader
        title="Services Management"
        description="Manage services that appear on the website"
      />
      <div className="col-span-12">
        <AdminTable
          title="Services"
          data={rows}
          columns={columns}
          onEdit={onEdit}
          onDelete={handleDelete}
          onAdd={onAdd}
          addText="Add New Service"
        />
      </div>
    </PageLayout>
  );
}
