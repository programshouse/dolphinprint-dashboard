import React, { useState } from "react";

export default function FaqCard({ question, answer, category, updatedAt }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {question}
            </h3>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-sm px-3 py-1 rounded-md border border-brand-600 text-brand-600 hover:bg-brand-50"
            >
              {open ? "Hide" : "Show"}
            </button>
          </div>
          {category && (
            <div className="mt-1 text-xs text-gray-500">{category}</div>
          )}
          <div
            className={`mt-3 text-sm text-gray-700 dark:text-gray-300 transition-all ${
              open ? "line-clamp-none" : "line-clamp-3"
            }`}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
          {updatedAt && (
            <div className="mt-3 text-xs text-gray-400">
              Updated: {new Date(updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
