import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewDetail from "./ReviewDetail";
import { useReviewStore } from "../../stors/useReviewStore";
import Toaster from "../../components/ui/Toaster/Toaster";
import { toast } from "react-toastify";

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

  // Load list when not in detail
  useEffect(() => {
    if (!isDetail) {
      getAllReviews().catch((e) => console.error("Error loading reviews:", e));
    }
  }, [isDetail, getAllReviews]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
    clearReview();
    // optional: if you want URL to reflect the form
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

    // optional: if you want URL to reflect the form
    navigate("/reviews/form");
  };

  const handleShow = (review) => {
    const rid = review?.id || review?._id;
    if (!rid) return;
    navigate(`/reviews/${rid}`);
  };

  // ✅ called from ReviewForm after create/update
  const handleFormSuccess = (mode) => {
    setShowForm(false);
    setEditing(null);
    clearReview();

    if (mode === "update") toast.success("Review updated successfully!");
    else toast.success("Review created successfully!");

    // refresh list then go back to list
    getAllReviews();

    // ✅ navigate immediately (no timeout) so form disappears right away
    navigate("/reviews");
  };

  // Detail view (route /reviews/:id)
  if (isDetail) {
    return (
      <>
        <Toaster position="bottom-right" />
        <ReviewDetail />
      </>
    );
  }

  // Form view (route /reviews/form OR local showForm)
  if (isForm) {
    return (
      <>
        <Toaster position="bottom-right" />
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
      </>
    );
  }

  // List view
  return (
    <>
      <Toaster position="bottom-right" />
      <ReviewList onAdd={handleAdd} onEdit={handleEdit} onShow={handleShow} />
    </>
  );
}
