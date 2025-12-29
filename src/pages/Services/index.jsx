import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import { useServicesStore } from "../../stors/useServicesStore";

export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { getAllServices } = useServicesStore();

  const isForm = location.pathname.includes("/form") || showForm;

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleShow = (service) => {
    navigate(`/services/${service.id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    // Refresh the services list after successful create/update
    getAllServices();
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
    <ServiceList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
  );
}
