import React from "react";

export default function FaqCardMinimal({ question, answer, onShow, onEdit, onDelete, id }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/40">
      <h4 className="font-medium text-gray-900 dark:text-white">{question}</h4>
      <p
        className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-4"
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
  );
}
