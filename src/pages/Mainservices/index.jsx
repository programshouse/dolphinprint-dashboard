import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ServiceForm from "./featuresform";
import ServiceList from "./featureslist";
import FeatureDetail from "./FeatureDetail";
import { useFeatureStore } from "../../stors/useFeatureStore";

export default function Services() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { fetchfeatures } = useFeatureStore();

  const isForm = location.pathname.includes("/form") || showForm;
  const isDetail = !!params.id;

  // Load features on component mount
  useEffect(() => {
    if (!isDetail) {
      fetchfeatures().catch(e => console.error("Error loading features:", e));
    }
  }, [isDetail, fetchfeatures]);

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleShow = (feature) => {
    navigate(`/mainservices/${feature.id || feature._id}`);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    fetchfeatures();
    // Always navigate back to features list after successful operation
    navigate("/mainservices");
  };

  // Show detail page
  if (isDetail) {
    return <FeatureDetail />;
  }

  if (isForm) {
    return (
      <ServiceForm
        serviceId={editingService?.id}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <ServiceList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
  );
}
