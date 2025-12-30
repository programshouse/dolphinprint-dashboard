import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewDetail from "./ReviewDetail";
import { useReviewStore } from "../../stors/useReviewStore";

export default function Reviews() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllReviews } = useReviewStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const isForm = location.pathname.includes("/form") || showForm;
  const isDetail = !!id;

  // Load reviews on component mount
  useEffect(() => {
    if (!isDetail) {
      getAllReviews().catch(e => console.error("Error loading reviews:", e));
    }
  }, [isDetail, getAllReviews]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (review) => {
    setEditing(review);
    setShowForm(true);
  };

  const handleShow = (review) => {
    navigate(`/reviews/${review.id || review._id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
    getAllReviews();
    // If we're on a detail page, navigate back to list
    if (isDetail) {
      navigate("/reviews");
    }
  };

  // Show detail page
  if (isDetail) {
    return <ReviewDetail />;
  }

  if (isForm) {
    return <ReviewForm reviewId={editing?.id} onSuccess={handleFormSuccess} />;
  }

  return (
    <ReviewList onAdd={handleAdd} onEdit={handleEdit} onShow={handleShow} />
  );
}
