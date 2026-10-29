// src/pages/Blogs/BlogForm.jsx
import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import TinyEditor from "../../components/ui/TinyEditor";
import { toastError } from "../../components/ui/Toaster/Toaster";
import { useBlogStore } from "../../stors/useBlogStore";

export default function BlogForm({ blogId, onSuccess, onCancel }) {
  const {
    selectedBlog,
    getBlogById,
    createBlog,
    updateBlog,
    clearSelectedBlog,
  } = useBlogStore();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    category_en: "",
    category_ar: "",
    user_name: "",
    content_en: "",
    content_ar: "",
    image: null,
    user_image: null,
  });

  // Load blog when editing
  useEffect(() => {
    if (blogId) {
      getBlogById(blogId).catch((e) => console.error("Error loading blog:", e));
    }
    return () => {
      clearSelectedBlog();
    };
  }, [blogId, getBlogById, clearSelectedBlog]);

  // Populate form with existing blog data
  useEffect(() => {
    if (blogId && selectedBlog) {
      setFormData({
        title_en:
          selectedBlog.title_en ||
          (!selectedBlog.title_ar ? selectedBlog.title : "") ||
          "",
        title_ar: selectedBlog.title_ar || "",
        category_en:
          selectedBlog.category_en ||
          (!selectedBlog.category_ar ? selectedBlog.category : "") ||
          "",
        category_ar: selectedBlog.category_ar || "",
        user_name: selectedBlog.user_name || "",
        content_en:
          selectedBlog.content_en ||
          (!selectedBlog.content_ar ? selectedBlog.content : "") ||
          "",
        content_ar: selectedBlog.content_ar || "",
        image: selectedBlog.image || null,
        user_image: selectedBlog.user_image || null,
      });
    }
  }, [blogId, selectedBlog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (field, content) => {
    setFormData((prev) => ({ ...prev, [field]: content }));
  };

  const handleFileChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0] || value || null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleEn = formData.title_en.trim();
    const titleAr = formData.title_ar.trim();
    if (!titleEn && !titleAr) {
      toastError("Please enter blog title in English or Arabic.");
      return;
    }

    const catEn = formData.category_en.trim();
    const catAr = formData.category_ar.trim();
    if (!catEn && !catAr) {
      toastError("Please enter blog category in English or Arabic.");
      return;
    }

    const textEn = (formData.content_en || "").replace(/<[^>]*>/g, "").trim();
    const textAr = (formData.content_ar || "").replace(/<[^>]*>/g, "").trim();
    const hasMediaEn =
      formData.content_en?.includes("<img") ||
      formData.content_en?.includes("<iframe");
    const hasMediaAr =
      formData.content_ar?.includes("<img") ||
      formData.content_ar?.includes("<iframe");

    if (!textEn && !textAr && !hasMediaEn && !hasMediaAr) {
      toastError("Please write blog content in English or Arabic.");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title_en", titleEn);
      fd.append("title_ar", titleAr);
      fd.append("title", titleEn || titleAr);

      fd.append("category_en", catEn);
      fd.append("category_ar", catAr);
      fd.append("category", catEn || catAr);

      fd.append("content_en", (formData.content_en || "").trim());
      fd.append("content_ar", (formData.content_ar || "").trim());
      fd.append(
        "content",
        (formData.content_en || formData.content_ar || "").trim()
      );

      fd.append("user_name", (formData.user_name || "Admin").trim());

      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }
      if (formData.user_image instanceof File) {
        fd.append("user_image", formData.user_image);
      }

      if (blogId) {
        await updateBlog(blogId, fd);
      } else {
        await createBlog(fd);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminForm
      title={blogId ? "Edit Blog" : "Add New Blog"}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitText={saving ? "Saving..." : blogId ? "Update Blog" : "Create Blog"}
      submitDisabled={saving}
    >
      {/* SECTION 1: Titles (English & Arabic) */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Blog Titles / عناوين المقال
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleInputChange}
              placeholder="e.g. 10 Digital Printing Tips for High-Quality Output"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان المقال (بالعربية) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title_ar"
              dir="rtl"
              value={formData.title_ar}
              onChange={handleInputChange}
              placeholder="مثال: أهم نصائح الطباعة الرقمية بجودة عالية"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Categories (English & Arabic) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Categories / الأقسام والتصنيفات
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category_en"
              value={formData.category_en}
              onChange={handleInputChange}
              placeholder="e.g. Technology, Printing, Design"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              القسم / التصنيف (بالعربية) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category_ar"
              dir="rtl"
              value={formData.category_ar}
              onChange={handleInputChange}
              placeholder="مثال: طباعة، تصميم، تكنولوجيا"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Author Name */}
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author Name / اسم الكاتب
        </label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleInputChange}
          placeholder="e.g. John Doe, Admin"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900"
        />
      </div>

      {/* SECTION 4: Dual TinyMCE Rich Text Editors */}
      <div className="space-y-6 pt-2">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Blog Content (TinyMCE) / محتوى المقال
        </h3>

        {/* English Content Editor */}
        <div>
          <TinyEditor
            label="Content (English) - المحتوى بالإنجليزية"
            value={formData.content_en}
            onChange={(val) => handleContentChange("content_en", val)}
            direction="ltr"
            height={380}
            placeholder="Write your rich blog post in English with headings, lists, tables, links..."
          />
        </div>

        {/* Arabic Content Editor */}
        <div>
          <TinyEditor
            label="محتوى المقال (بالعربية) - Content (Arabic)"
            value={formData.content_ar}
            onChange={(val) => handleContentChange("content_ar", val)}
            direction="rtl"
            height={380}
            placeholder="اكتب محتوى المقال باللغة العربية مع العناوين، القوائم، الجداول والروابط..."
          />
        </div>
      </div>

      {/* SECTION 5: Images Upload */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Images / الصور
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cover Image */}
          <div>
            <FileUpload
              label="Cover Image / صورة الغلاف"
              name="image"
              value={formData.image}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {/* Author Avatar Image */}
          <div>
            <FileUpload
              label="Author Avatar / صورة الكاتب (user_image)"
              name="user_image"
              value={formData.user_image}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
