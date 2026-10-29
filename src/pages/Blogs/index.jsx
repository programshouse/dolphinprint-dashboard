// src/pages/Blogs/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import BlogDetail from "./BlogDetail";
import { useBlogStore } from "../../stors/useBlogStore";

export default function Blogs() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const { blogs, selectedBlog, loading, getAllBlogs, getBlogById } = useBlogStore();

  const isDetail = !!params.id;
  const isFormRoute = location.pathname.includes("/form");
  const isForm = isFormRoute || showForm;

  // Load blog when on detail page
  useEffect(() => {
    if (isDetail && params.id) {
      getBlogById(params.id).catch((error) => {
        console.error("Error loading blog details:", error);
      });
    }
  }, [isDetail, params.id, getBlogById]);

  // Load blogs list when not on detail page
  useEffect(() => {
    if (!isDetail) {
      getAllBlogs().catch((e) => console.error("Error loading blogs:", e));
    }
  }, [isDetail, getAllBlogs]);

  const handleEdit = async (blog) => {
    setEditingBlog(blog);
    setShowForm(true);

    const id = blog?.id || blog?._id;
    if (id && getBlogById) {
      try {
        await getBlogById(id);
      } catch {}
    }

    navigate("/blogs/form");
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setShowForm(true);
    navigate("/blogs/form");
  };

  const handleShow = (blog) => {
    navigate(`/blogs/${blog.id || blog._id}`);
  };

  const handleDetailClose = () => {
    navigate("/blogs");
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBlog(null);
    getAllBlogs();
    navigate("/blogs");
  };

  // Show Detail Page
  if (isDetail) {
    // If not found in selectedBlog, check in blogs list
    const foundBlog =
      selectedBlog && String(selectedBlog.id || selectedBlog._id) === String(params.id)
        ? selectedBlog
        : blogs?.find((b) => String(b.id || b._id) === String(params.id)) || selectedBlog;

    if (loading && !foundBlog) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600">Loading blog...</p>
          </div>
        </div>
      );
    }

    if (!foundBlog) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Blog post not found</p>
            <button
              onClick={handleDetailClose}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      );
    }

    return (
      <BlogDetail
        blog={foundBlog}
        onClose={handleDetailClose}
      />
    );
  }

  // Show Form Page
  if (isForm) {
    return (
      <BlogForm
        blogId={editingBlog?.id || editingBlog?._id}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingBlog(null);
          navigate("/blogs");
        }}
      />
    );
  }

  // Show List Page
  return (
    <BlogList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
  );
}
