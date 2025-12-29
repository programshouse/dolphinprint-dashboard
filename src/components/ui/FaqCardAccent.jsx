import React from "react";

export default function FaqCardAccent({ question, answer, category }) {
  return (
    <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-brand-600" />
      <div className="pl-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {question}
        </h3>
        {category && (
          <div className="mt-1 text-xs text-gray-500">{category}</div>
        )}
        <div
          className="mt-3 text-sm text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
}
