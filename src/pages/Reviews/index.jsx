import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewDetail from "./ReviewDetail";
import { useReviewStore } from "../../stors/useReviewStore";

export default function Reviews() {
  const { id } = useParams();
  const location = useLocation();
  const { getReviewById } = useReviewStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const isForm = location.pathname.includes("/form") || showForm;
  const isDetailView = id && !isForm;

  useEffect(() => {
    if (id && !isForm) {
      const loadReview = async () => {
        try {
          const review = await getReviewById(id);
          setViewing(review);
        } catch (error) {
          console.error("Error loading review:", error);
        }
      };
      loadReview();
    }
  }, [id, isForm, getReviewById]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (review) => {
    setEditing(review);
    setShowForm(true);
  };

  const handleShow = (review) => {
    setViewing(review);
  };

  const handleDetailClose = () => {
    setViewing(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (isForm) {
    return <ReviewForm reviewId={editing?.id} onSuccess={handleFormSuccess} />;
  }

  if (isDetailView) {
    return (
      <ReviewDetail 
        review={viewing}
        onClose={() => window.history.back()}
      />
    );
  }

  return (
    <>
      <ReviewList onAdd={handleAdd} onEdit={handleEdit} onShow={handleShow} />
      {viewing && (
        <ReviewDetail 
          review={viewing}
          onClose={handleDetailClose}
        />
      )}
    </>
  );
}
