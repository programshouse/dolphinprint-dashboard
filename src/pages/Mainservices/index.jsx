import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ServiceForm from "./mainservicesform";
import ServiceList from "./mainserviceslist";
import FeatureDetail from "./FeatureDetail";
import { useFeatureStore } from "../../stors/useFeatureStore";

export default function Services() {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingFeature, setViewingFeature] = useState(null);
  const { fetchfeatures } = useFeatureStore();

  const isForm = location.pathname.includes("/form") || showForm;

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleShow = (feature) => {
    setViewingFeature(feature);
  };

  const handleDetailClose = () => {
    setViewingFeature(null);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    // Refresh the features list after successful create/update
    fetchfeatures();
  };

  if (isForm) {
    return (
      <ServiceForm
        serviceId={editingService?.id}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <>
      <ServiceList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
      {viewingFeature && (
        <FeatureDetail 
          feature={viewingFeature}
          onClose={handleDetailClose}
        />
      )}
    </>
  );
}
