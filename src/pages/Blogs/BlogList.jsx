// src/pages/Blogs/BlogList.jsx
import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminTable from "../../components/ui/AdminTable";
import { useBlogStore } from "../../stors/useBlogStore";

export default function BlogList({ onEdit, onAdd, onShow }) {
  const { blogs, loading, getAllBlogs, deleteBlog } = useBlogStore();

  useEffect(() => {
    getAllBlogs().catch((e) => console.error("Error loading blogs:", e));
  }, [getAllBlogs]);

  const handleShow = (blog) => {
    onShow?.(blog);
  };

  const handleDelete = async (blog) => {
    const blogId = blog?.id || blog?._id;
    if (!blogId) return;

    const title = blog.title_en || blog.title_ar || blog.title || "this blog";
    if (!window.confirm(`Delete "${title}"?`)) return;

    try {
      await deleteBlog(blogId);
    } catch (e) {
      console.error("Error deleting blog:", e);
    }
  };

  const stripHtml = (html = "") => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(String(html), "text/html");
      let text = doc.body.textContent || "";
      return text
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } catch {
      return String(html)
        .replace(/<style[^>]*>.*?<\/style>/gis, "")
        .replace(/<script[^>]*>.*?<\/script>/gis, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  };

  const columns = [
    {
      key: "image",
      header: "Cover",
      render: (b) => {
        return b.image ? (
          <img
            src={typeof b.image === "string" ? b.image : URL.createObjectURL(b.image)}
            alt={b.title_en || b.title_ar || b.title || "Blog cover"}
            className="w-16 h-12 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200">
            No image
          </div>
        );
      },
    },
    {
      key: "title",
      header: "Title",
      render: (b) => {
        const titleEn = b.title_en || b.title;
        const titleAr = b.title_ar;
        return (
          <div className="max-w-xs space-y-1">
            {titleEn && (
              <div
                className="font-medium text-gray-900 truncate"
                title={`EN: ${titleEn}`}
              >
                {titleEn}
              </div>
            )}
            {titleAr && (
              <div
                className={`text-xs truncate ${titleEn ? "text-gray-500 font-normal" : "font-medium text-gray-900"
                  }`}
                dir="rtl"
                title={`AR: ${titleAr}`}
              >
                {titleAr}
              </div>
            )}
            {!titleEn && !titleAr && (
              <span className="text-gray-400 italic">Untitled</span>
            )}
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Category",
      render: (b) => {
        const catEn = b.category_en || b.category;
        const catAr = b.category_ar;
        if (!catEn && !catAr) {
          return <span className="text-gray-400 text-xs">—</span>;
        }
        return (
          <div className="flex flex-col gap-1 items-start">
            {catEn && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                {catEn}
              </span>
            )}
            {catAr && (
              <span
                dir="rtl"
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                {catAr}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "author",
      header: "Author",
      render: (b) => {
        return (
          <div className="flex items-center gap-2">
            {b.user_image ? (
              <img
                src={typeof b.user_image === "string" ? b.user_image : URL.createObjectURL(b.user_image)}
                alt={b.user_name || "Author"}
                className="w-7 h-7 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                {(b.user_name || "A")[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate" title={b.user_name || "Anonymous"}>
              {b.user_name || "Anonymous"}
            </span>
          </div>
        );
      },
    },
    {
      key: "content",
      header: "Content Snippet",
      render: (b) => {
        const textEn = stripHtml(b.content_en || b.content || "");
        const textAr = stripHtml(b.content_ar || "");
        const displayText = textEn || textAr || "—";
        const isRtl = !textEn && !!textAr;
        return (
          <div
            className="max-w-xs text-sm text-gray-500 truncate"
            dir={isRtl ? "rtl" : "ltr"}
            title={displayText}
          >
            {displayText}
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (b) => {
        const dateVal = b.created_at || b.updated_at;
        const formatted = dateVal ? new Date(dateVal).toLocaleDateString() : "—";
        return <span className="text-xs text-gray-500 whitespace-nowrap">{formatted}</span>;
      },
    },
  ];

  if (loading) {
    return (
      <PageLayout title="Blogs Management | Dolphin Print">
        <PageHeader
          title="Blogs Management"
          description="Manage articles and blog posts"
        />
        <div className="col-span-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-3 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Blogs Management | Dolphin Print">
      <PageHeader
        title="Blogs Management"
        description="Create, view, and manage blog posts"
      />
      <div className="col-span-12">
        <AdminTable
          title="All Blogs"
          data={blogs || []}
          columns={columns}
          onEdit={onEdit}
          onShow={onShow ? handleShow : undefined}
          onDelete={handleDelete}
          onAdd={onAdd}
          addText="Add New Blog"
        />
      </div>
    </PageLayout>
  );
}
