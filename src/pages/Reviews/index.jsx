import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default function Reviews() {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const isForm = location.pathname.includes("/form") || showForm;

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (review) => {
    setEditing(review);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (isForm) {
    return <ReviewForm reviewId={editing?.id} onSuccess={handleFormSuccess} />;
  }

  return <ReviewList onAdd={handleAdd} onEdit={handleEdit} />;
}
