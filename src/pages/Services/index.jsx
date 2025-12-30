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

  const { getAllServices, getServiceById } = useServicesStore();

  const isDetail = !!params.id;
  const isFormRoute = location.pathname.includes("/form");
  const isForm = isFormRoute || showForm;

  useEffect(() => {
    if (!isDetail) {
      getAllServices().catch((e) => console.error("Error loading services:", e));
    }
  }, [isDetail, getAllServices]);

  const handleEdit = async (service) => {
    setEditingService(service);
    setShowForm(true);

    // ensure service exists in store if needed
    const id = service?.id || service?._id;
    if (id && getServiceById) {
      try { await getServiceById(id); } catch {}
    }

    navigate("/services/form");
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
    navigate("/services/form");
  };

  const handleShow = (service) => {
    navigate(`/services/${service.id || service._id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    getAllServices();
    navigate("/services");
  };

  if (isDetail) {
    return <ServiceDetail />;
  }

  if (isForm) {
    return (
      <ServiceForm
        serviceId={editingService?.id || editingService?._id}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingService(null);
          navigate("/services");
        }}
      />
    );
  }

  return (
    <ServiceList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
  );
}
