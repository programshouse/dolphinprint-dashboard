import React from "react";

export default function FaqCardAccent({ question, answer, category, onShow, onEdit, onDelete, id }) {
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
        
        {/* Action Buttons */}
        {(onShow || onEdit || onDelete) && (
          <div className="mt-4 flex gap-2">
            {onShow && (
              <button
                onClick={() => onShow(id)}
                className="px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                View
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(id)}
                className="px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
