// src/pages/FAQ/FaqForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import { faqsAPI } from "../../services/api";

const blankFaq = () => ({
  question_en: "",
  question_ar: "",
  answer_en: "",
  answer_ar: "",
});

export default function FaqForm({ faqId, onSuccess }) {
  const isEditing = !!faqId;

  // In create mode we allow multiple; in edit we only show one
  const [faqs, setFaqs] = useState([blankFaq()]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Load for edit (single item)
  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await faqsAPI.getById(faqId);
        setFaqs([
          {
            question_en: data?.question_en || "",
            question_ar: data?.question_ar || "",
            answer_en: data?.answer_en || "",
            answer_ar: data?.answer_ar || "",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [faqId, isEditing]);

  // Validation
  const errs = useMemo(() => {
    const e = [];
    faqs.forEach((f, i) => {
      const missing =
        !f.question_en.trim() ||
        !f.question_ar.trim() ||
        !f.answer_en.trim() ||
        !f.answer_ar.trim();
      if (missing) e.push(i);
    });
    return e; // array of invalid indexes
  }, [faqs]);

  const disabled = saving || faqs.length === 0 || errs.length > 0;

  // Handlers
  const updateField = (idx, key, val) =>
    setFaqs((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [key]: val } : f))
    );

  const addFaq = () => setFaqs((prev) => [...prev, blankFaq()]);

  const removeFaq = (idx) =>
    setFaqs((prev) => prev.filter((_, i) => i !== idx));

  const move = (idx, dir) =>
    setFaqs((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });

  // Submit
  const submit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      setSaving(true);
      if (isEditing) {
        // Edit only the first (only card)
        const one = { ...faqs[0] };
        await faqsAPI.update(faqId, one);
      } else {
        // Create all valid ones
        const toCreate = faqs
          .map((f) => ({
            question_en: f.question_en.trim(),
            question_ar: f.question_ar.trim(),
            answer_en: f.answer_en.trim(),
            answer_ar: f.answer_ar.trim(),
          }))
          .filter(
            (f) =>
              f.question_en &&
              f.question_ar &&
              f.answer_en &&
              f.answer_ar
          );
        // Send sequentially or in parallel
        await Promise.all(toCreate.map((f) => faqsAPI.create(f)));
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving FAQ(s). Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => onSuccess && onSuccess();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading FAQ…</p>
      </div>
    );
  }

  return (
    <AdminForm
      title={isEditing ? "Edit FAQ" : "Add FAQs"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={
        saving ? "Saving..." : isEditing ? "Update FAQ" : `Create ${faqs.length} FAQ${faqs.length > 1 ? "s" : ""}`
      }
      submitDisabled={disabled}
    >
      {/* Multiple FAQ blocks */}
      <div className="space-y-5">
        {faqs.map((f, i) => {
          const invalid = errs.includes(i);
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 bg-white dark:bg-gray-900 ${
                invalid
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  FAQ #{i + 1}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    disabled={i === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, +1)}
                    className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    disabled={i === faqs.length - 1}
                  >
                    ↓
                  </button>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      className="px-2 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Question (EN) *
                  </label>
                  <input
                    value={f.question_en}
                    onChange={(e) => updateField(i, "question_en", e.target.value)}
                    placeholder="e.g., How do I book a session?"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    السؤال (AR) *
                  </label>
                  <input
                    value={f.question_ar}
                    onChange={(e) => updateField(i, "question_ar", e.target.value)}
                    placeholder="مثال: كيف أحجز جلسة؟"
                    dir="rtl"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Answers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Answer (EN) *
                  </label>
                  <textarea
                    value={f.answer_en}
                    onChange={(e) => updateField(i, "answer_en", e.target.value)}
                    rows={5}
                    placeholder="Provide a clear and helpful answer in English…"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الإجابة (AR) *
                  </label>
                  <textarea
                    value={f.answer_ar}
                    onChange={(e) => updateField(i, "answer_ar", e.target.value)}
                    rows={5}
                    placeholder="أدخل إجابة واضحة ومفيدة بالعربية…"
                    dir="rtl"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              {invalid && (
                <p className="mt-2 text-xs text-red-600">
                  Please fill all fields in this FAQ.
                </p>
              )}
            </div>
          );
        })}

        {/* Add button only in create mode */}
        {!isEditing && (
          <div className="flex">
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 rounded-lg border border-brand-600 text-brand-600 hover:bg-brand-50"
            >
              + Add FAQ
            </button>
          </div>
        )}
      </div>
    </AdminForm>
  );
}
