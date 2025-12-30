import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import ServiceDetail from "./ServiceDetail";
import { useServicesStore } from "../../stors/useServicesStore";

export default function Services() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { getAllServices } = useServicesStore();

  const isForm = location.pathname.includes("/form") || showForm;
  const isDetail = !!params.id;

  // Load services on component mount
  useEffect(() => {
    if (!isDetail) {
      getAllServices().catch(e => console.error("Error loading services:", e));
    }
  }, [isDetail, getAllServices]);

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleShow = (service) => {
    navigate(`/services/${service.id || service._id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    getAllServices();
    // If we're on a detail page, navigate back to list
    if (isDetail) {
      navigate("/services");
    }
  };

  // Show detail page
  if (isDetail) {
    return <ServiceDetail />;
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
