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

  const { getAllReviews, clearReview, getReviewById } = useReviewStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const isDetail = Boolean(id);
  const isFormRoute = location.pathname.includes("/form");
  const isForm = isFormRoute || showForm;

  useEffect(() => {
    if (!isDetail) {
      getAllReviews().catch((e) => console.error("Error loading reviews:", e));
    }
  }, [isDetail, getAllReviews]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
    clearReview();
    navigate("/reviews/form");
  };

  const handleEdit = (review) => {
    setEditing(review);
    setShowForm(true);

    const rid = review?.id || review?._id;
    if (rid) {
      getReviewById(rid).catch((e) =>
        console.error("Error loading review for edit:", e)
      );
    }

    navigate("/reviews/form");
  };

  const handleShow = (review) => {
    const rid = review?.id || review?._id;
    if (!rid) return;
    navigate(`/reviews/${rid}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
    clearReview();
    getAllReviews();
    navigate("/reviews");
  };

  if (isDetail) return <ReviewDetail />;

  if (isForm) {
    return (
      <ReviewForm
        reviewId={editing?.id || editing?._id}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
          clearReview();
          navigate("/reviews");
        }}
      />
    );
  }

  return <ReviewList onAdd={handleAdd} onEdit={handleEdit} onShow={handleShow} />;
}
