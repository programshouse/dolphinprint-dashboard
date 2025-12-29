// src/pages/FAQ/index.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FaqForm from "./faqform";
import FaqList from "./faqlist";
import FaqDetail from "./FaqDetail";

export default function FaqPage() {   // <- renamed from FAQ
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [viewingFaq, setViewingFaq] = useState(null);

  const isForm = location.pathname.includes("/form") || showForm;

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  const handleShow = (faq) => {
    setViewingFaq(faq);
  };

  const handleDetailClose = () => {
    setViewingFaq(null);
  };

  const handleAdd = () => {
    setEditingFaq(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFaq(null);
  };

  if (isForm) {
    return (
      <FaqForm
        faqId={editingFaq?.id || editingFaq?._id}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <>
      <FaqList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
      {viewingFaq && (
        <FaqDetail 
          faq={viewingFaq}
          onClose={handleDetailClose}
        />
      )}
    </>
  );
}
