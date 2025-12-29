import React from "react";

export default function FaqCardMinimal({ question, answer }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/40">
      <h4 className="font-medium text-gray-900 dark:text-white">{question}</h4>
      <p
        className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-4"
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    </div>
  );
}
