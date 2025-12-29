import React, { useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useFaqStore } from "../../stors/useFaqStore";

export default function FaqList({ onEdit, onAdd, onShow }) {
  const { faqs, loading, getFaqs, deleteFaq } = useFaqStore();

  useEffect(() => {
    getFaqs();
  }, [getFaqs]);

  const handleDelete = async (faq) => {
    if (!window.confirm(`Delete this FAQ?\n\n${faq.question_en || ""}`)) return;
    try {
      await deleteFaq(faq.id || faq._id);
    } catch (e) {
      console.error("Error deleting FAQ:", e);
    }
  };

  const Card = ({ item }) => (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-3 w-3 rounded-full bg-brand-600" />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {item.question_en}
          </h3>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {item.answer_en}
          </p>

          <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900/40">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white" dir="rtl">
              {item.question_ar}
            </h4>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300" dir="rtl">
              {item.answer_ar}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onShow && onShow(item)}
              className="px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              View
            </button>
            <button
              onClick={() => onEdit(item)}
              className="px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageLayout title="FAQs | Dolphin Print">
        <PageHeader title="FAQs" description="Manage your frequently asked questions" />
        <div className="col-span-12">
          <div className="flex justify-end mb-4">
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-brand-600 text-white opacity-50"
            >
              + Add FAQ
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 animate-pulse"
              />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="FAQs | Dolphin Print">
      <PageHeader title="FAQs" description="Manage your frequently asked questions" />
      <div className="col-span-12">
        <div className="flex justify-end mb-4">
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
          >
            + Add FAQ
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">
            No FAQs yet. Click <strong>+ Add FAQ</strong> to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {faqs.map((f) => (
              <Card key={f.id || f._id} item={f} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
