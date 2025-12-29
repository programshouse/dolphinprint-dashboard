// src/pages/FAQ/FaqForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import { useFaqStore } from "../../stors/useFaqStore";

const blankFaq = () => ({
  question_en: "",
  question_ar: "",
  answer_en: "",
  answer_ar: "",
});

export default function FaqForm({ faqId, onSuccess }) {
  const isEditing = !!faqId;

  const {
    faqs,            // ✅ list (if your store exposes it; if not, remove this part)
    currentFaq,
    loading,
    getFaqById,
    createFaq,
    updateFaq,
    clearCurrentFaq, // ✅ add in store if exists; optional but recommended
  } = useFaqStore();

  // In create mode we allow multiple; in edit we only show one
  const [faqsForm, setFaqsForm] = useState([blankFaq()]);
  const [saving, setSaving] = useState(false);

  // ✅ If we have list, try to find FAQ locally (instant prefill)
  const localFaq = useMemo(() => {
    if (!isEditing) return null;
    if (!faqs || !Array.isArray(faqs)) return null;
    return faqs.find((f) => String(f.id) === String(faqId)) || null;
  }, [faqs, faqId, isEditing]);

  // ✅ Reset form when switching to create mode (prevents old data sticking)
  useEffect(() => {
    if (!isEditing) {
      setFaqsForm([blankFaq()]);
      return;
    }
  }, [isEditing]);

  // ✅ Prefill from list immediately if available
  useEffect(() => {
    if (!isEditing) return;
    if (!localFaq) return;

    setFaqsForm([
      {
        question_en: localFaq?.question_en || "",
        question_ar: localFaq?.question_ar || "",
        answer_en: localFaq?.answer_en || "",
        answer_ar: localFaq?.answer_ar || "",
      },
    ]);
  }, [isEditing, localFaq]);

  // ✅ Fetch by id if not in list OR to ensure latest data
  useEffect(() => {
    if (!isEditing) return;

    // if we already have localFaq, we can skip fetch to avoid flicker
    // If you want ALWAYS latest from server, remove the `if (localFaq) return;`
    if (localFaq) return;

    (async () => {
      try {
        await getFaqById(faqId);
      } catch (error) {
        console.error("Error loading FAQ:", error);
      }
    })();
  }, [faqId, isEditing, getFaqById, localFaq]);

  // ✅ When currentFaq loads from API, fill the form (edit mode)
  useEffect(() => {
    if (!isEditing) return;
    if (!currentFaq) return;

    setFaqsForm([
      {
        question_en: currentFaq?.question_en || "",
        question_ar: currentFaq?.question_ar || "",
        answer_en: currentFaq?.answer_en || "",
        answer_ar: currentFaq?.answer_ar || "",
      },
    ]);
  }, [currentFaq, isEditing]);

  // ✅ Clear currentFaq on unmount so create mode doesn't show previous edit data
  useEffect(() => {
    return () => {
      if (clearCurrentFaq) clearCurrentFaq();
    };
  }, [clearCurrentFaq]);

  // Validation
  const errs = useMemo(() => {
    const e = [];
    faqsForm.forEach((f, i) => {
      const missing =
        !f.question_en.trim() ||
        !f.question_ar.trim() ||
        !f.answer_en.trim() ||
        !f.answer_ar.trim();
      if (missing) e.push(i);
    });
    return e; // array of invalid indexes
  }, [faqsForm]);

  const disabled = saving || faqsForm.length === 0 || errs.length > 0;

  // Handlers
  const updateField = (idx, key, val) =>
    setFaqsForm((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [key]: val } : f))
    );

  const addFaq = () => setFaqsForm((prev) => [...prev, blankFaq()]);

  const removeFaq = (idx) =>
    setFaqsForm((prev) => prev.filter((_, i) => i !== idx));

  const move = (idx, dir) =>
    setFaqsForm((prev) => {
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
        const one = {
          question_en: faqsForm[0].question_en.trim(),
          question_ar: faqsForm[0].question_ar.trim(),
          answer_en: faqsForm[0].answer_en.trim(),
          answer_ar: faqsForm[0].answer_ar.trim(),
        };
        await updateFaq(faqId, one);
      } else {
        const toCreate = faqsForm
          .map((f) => ({
            question_en: f.question_en.trim(),
            question_ar: f.question_ar.trim(),
            answer_en: f.answer_en.trim(),
            answer_ar: f.answer_ar.trim(),
          }))
          .filter(
            (f) => f.question_en && f.question_ar && f.answer_en && f.answer_ar
          );

        await Promise.all(toCreate.map((f) => createFaq(f)));
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
        saving
          ? "Saving..."
          : isEditing
          ? "Update FAQ"
          : `Create ${faqsForm.length} FAQ${faqsForm.length > 1 ? "s" : ""}`
      }
      submitDisabled={disabled}
    >
      <div className="space-y-5">
        {faqsForm.map((f, i) => {
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
                    disabled={i === faqsForm.length - 1}
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
                    onChange={(e) =>
                      updateField(i, "question_en", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateField(i, "question_ar", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateField(i, "answer_en", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateField(i, "answer_ar", e.target.value)
                    }
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
