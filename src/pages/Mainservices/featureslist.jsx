import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminTable from "../../components/ui/AdminTable";
import { useFeatureStore } from "../../stors/useFeatureStore";

export default function ServiceList({ onEdit, onAdd, onShow }) {
  const { featuresList, loading, fetchfeatures, deletefeatures } = useFeatureStore();

  useEffect(() => { 
    fetchfeatures().catch(e => console.error("Error loading features:", e));
  }, [fetchfeatures]);

  const handleShow = (feature) => {
    if (onShow) onShow(feature);
  };

  const handleDelete = async (feature) => {
    console.log("Delete feature called with:", feature);
    const featureId = feature.id || feature._id;
    console.log("Feature ID to delete:", featureId);
    
    if (!window.confirm(`Delete "${feature.title_en || feature.title || "feature"}?`))
      return;
    try {
      await deletefeatures(featureId);
      console.log("Feature deleted successfully");
    } catch (e) {
      console.error("Error deleting feature:", e);
    }
  };

  const columns = [
    {
      key: "title_en",
      header: "Title (EN)",
      render: (s) => s.title_en || s.title || <span className="text-gray-400">—</span>,
    },
    // {
    //   key: "title_ar",
    //   header: "العنوان (AR)",
    //   render: (s) => s.title_ar || <span className="text-gray-400">—</span>,
    // },
    {
      key: "description_en",
      header: "Description (EN)",
      render: (s) => (
        <div className="max-w-xs truncate" title={s.description_en || s.description || ""}>
          {s.description_en || s.description || "—"}
        </div>
      ),
    },
    // {
    //   key: "description_ar",
    //   header: "الوصف (AR)",
    //   render: (s) => (
    //     <div className="max-w-xs truncate" title={s.description_ar || ""}>
    //       {s.description_ar || "—"}
    //     </div>
    //   ),
    // },
    {
      key: "image",
      header: "Image",
      render: (s) =>
        s.image ? (
          <img
            src={typeof s.image === "string" ? s.image : URL.createObjectURL(s.image)}
            alt={s.title_en || s.title || "feature"}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        ),
    },
  ];

  if (loading) {
    return (
      <PageLayout title="Features Management | Dolphin Print">
        <PageHeader
          title="Features Management"
          description="Manage features that appear on website"
        />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading features...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Features Management | Dolphin Print">
      <PageHeader
        title="Features Management"
        description="Manage features that appear on website"
      />
      <div className="col-span-12">
        <AdminTable
          title="Features"
          data={featuresList || []}
          columns={columns}
          onEdit={onEdit}
          onShow={onShow ? handleShow : undefined}
          onDelete={handleDelete}
          onAdd={onAdd}
          addText="Add New Feature"
        />
      </div>
    </PageLayout>
  );
}
