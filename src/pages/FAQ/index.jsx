// src/pages/FAQ/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import FaqForm from "./faqform";
import FaqList from "./faqlist";
import FaqDetail from "./FaqDetail";
import { useFaqStore } from "../../stors/useFaqStore";
import Toaster from "../../components/ui/Toaster/Toaster";

export default function FaqPage() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const { getFaqs, getFaqById, currentFaq, loading } = useFaqStore();

  const isForm = location.pathname.includes("/form") || showForm;
  const isDetail = !!params.id;

  // Load FAQ data when on detail page
  useEffect(() => {
    if (isDetail && params.id) {
      const loadFaq = async () => {
        try {
          await getFaqById(params.id);
        } catch (error) {
          console.error("Error loading FAQ:", error);
          navigate("/faq");
        }
      };
      loadFaq();
    }
  }, [isDetail, params.id, getFaqById, navigate]);

  // Load FAQs list on component mount
  useEffect(() => {
    if (!isDetail) {
      getFaqs();
    }
  }, [isDetail, getFaqs]);

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  const handleShow = (faq) => {
    navigate(`/faq/${faq.id || faq._id}`);
  };

  const handleDetailClose = () => {
    navigate("/faq");
  };

  const handleAdd = () => {
    setEditingFaq(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFaq(null);
    // Refresh the FAQ list after successful create/update
    getFaqs();
    // Always navigate back to FAQ list after successful operation
    navigate("/faq");
  };

  // Show detail page
  if (isDetail) {
    console.log("Detail page - params.id:", params.id);
    console.log("Detail page - currentFaq:", currentFaq);
    console.log("Detail page - loading:", loading);
    
    if (loading) {
      return (
        <>
          <Toaster position="bottom-right" />
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
              <p className="mt-2 text-gray-600">Loading FAQ...</p>
            </div>
          </div>
        </>
      );
    }

    if (!currentFaq) {
      console.log("FAQ not found - currentFaq is null/undefined");
      return (
        <>
          <Toaster position="bottom-right" />
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">FAQ not found</p>
              <button
                onClick={() => navigate("/faq")}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Back to FAQ List
              </button>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Toaster position="bottom-right" />
        <FaqDetail 
          faq={currentFaq}
          onClose={handleDetailClose}
        />
      </>
    );
  }

  if (isForm) {
    return (
      <>
        <Toaster position="bottom-right" />
        <FaqForm
          faqId={editingFaq?.id || editingFaq?._id}
          onSuccess={handleFormSuccess}
        />
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <FaqList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
    </>
  );
}
