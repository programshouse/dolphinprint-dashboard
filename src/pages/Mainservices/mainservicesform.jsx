import React, { useEffect, useMemo, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { servicesAPI } from "../../services/api";

const MAX_TITLE = 140;
const MAX_DESC = 2000;

export default function ServiceForm({ serviceId, onSuccess }) {
  const [loading, setLoading] = useState(!!serviceId);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [titleEN, setTitleEN] = useState("");
  const [titleAR, setTitleAR] = useState("");
  const [descEN, setDescEN] = useState("");
  const [descAR, setDescAR] = useState("");
  const [image, setImage] = useState(null); // File | URL string | null
  const [activeTab, setActiveTab] = useState("en");

  useEffect(() => {
    if (!serviceId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await servicesAPI.getById(serviceId);
        // Be defensive: accept either single-lang fields or bilingual ones
        setTitleEN(data?.title_en ?? data?.title ?? "");
        setTitleAR(data?.title_ar ?? "");
        setDescEN(data?.description_en ?? data?.description ?? "");
        setDescAR(data?.description_ar ?? "");
        setImage(data?.image ?? null);
      } catch (e) {
        setErr("Failed to load service.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId]);

  const vErr = useMemo(() => {
    const m = {};
    if (!titleEN.trim()) m.titleEN = "Required";
    if (!titleAR.trim()) m.titleAR = "مطلوب";
    if (!descEN.trim()) m.descEN = "Required";
    if (!descAR.trim()) m.descAR = "مطلوب";
    if (titleEN.length > MAX_TITLE) m.titleEN = `Max ${MAX_TITLE} chars`;
    if (titleAR.length > MAX_TITLE) m.titleAR = `بحد أقصى ${MAX_TITLE} حرفًا`;
    if (descEN.length > MAX_DESC) m.descEN = `Max ${MAX_DESC} chars`;
    if (descAR.length > MAX_DESC) m.descAR = `بحد أقصى ${MAX_DESC} حرفًا`;
    return m;
  }, [titleEN, titleAR, descEN, descAR]);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Object.keys(vErr).length) return;

    try {
      setSaving(true);
      setErr("");

      // Build FormData so we can send bilingual fields and file
      const fd = new FormData();
      fd.append("title_en", titleEN.trim());
      fd.append("title_ar", titleAR.trim());
      fd.append("description_en", descEN.trim());
      fd.append("description_ar", descAR.trim());
      if (image instanceof File) fd.append("image", image);

      if (serviceId) await servicesAPI.update(serviceId, fd);
      else await servicesAPI.create(fd);

      onSuccess && onSuccess();
    } catch (e) {
      console.error(e);
      setErr("Error saving service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => onSuccess && onSuccess();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading service…
        </p>
      </div>
    );
  }

  return (
    <AdminForm
      title={serviceId ? "Edit Service" : "Add New Service"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
      submitDisabled={saving || Object.keys(vErr).length > 0}
    >
      {err && (
        <div className="mb-3 text-sm px-3 py-2 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
          {err}
        </div>
      )}

      {/* Image */}
      <div className="mb-6">
        <FileUpload
          label="Service Image"
          name="image"
          value={image}
          onChange={onFile}
          accept="image/*"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("en")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "en"
              ? "border-b-2 border-brand-600 text-brand-600"
              : "text-gray-600"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ar")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "ar"
              ? "border-b-2 border-brand-600 text-brand-600"
              : "text-gray-600"
          }`}
        >
          العربية
        </button>
      </div>

      {/* EN */}
      {activeTab === "en" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title (EN) *
            </label>
            <input
              value={titleEN}
              onChange={(e) => setTitleEN(e.target.value)}
              maxLength={MAX_TITLE}
              placeholder="Service title in English…"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{vErr.titleEN || "\u00A0"}</span>
              <span>{titleEN.length}/{MAX_TITLE}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (EN) *
            </label>
            <textarea
              value={descEN}
              onChange={(e) => setDescEN(e.target.value)}
              rows={5}
              maxLength={MAX_DESC}
              placeholder="Describe the service in English…"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{vErr.descEN || "\u00A0"}</span>
              <span>{descEN.length}/{MAX_DESC}</span>
            </div>
          </div>
        </div>
      )}

      {/* AR */}
      {activeTab === "ar" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              العنوان (AR) *
            </label>
            <input
              dir="auto"
              value={titleAR}
              onChange={(e) => setTitleAR(e.target.value)}
              maxLength={MAX_TITLE}
              placeholder="عنوان الخدمة باللغة العربية…"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
              required
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span className="invisible">.</span>
              <span>{titleAR.length}/{MAX_TITLE}</span>
            </div>
            {vErr.titleAR && (
              <p className="text-xs text-red-600 mt-1">{vErr.titleAR}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الوصف (AR) *
            </label>
            <textarea
              dir="auto"
              value={descAR}
              onChange={(e) => setDescAR(e.target.value)}
              rows={5}
              maxLength={MAX_DESC}
              placeholder="صف الخدمة باللغة العربية…"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
              required
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span className="invisible">.</span>
              <span>{descAR.length}/{MAX_DESC}</span>
            </div>
            {vErr.descAR && (
              <p className="text-xs text-red-600 mt-1">{vErr.descAR}</p>
            )}
          </div>
        </div>
      )}
    </AdminForm>
  );
}
