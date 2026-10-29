// src/components/ui/TinyEditor.jsx
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({
  label = "Content",
  value = "",
  onChange,
  height = 420,
  required = false,
  placeholder = "Write your blog post content here...",
  className = "",
  direction = "ltr",
  apiKey,
}) {
  const editorRef = useRef(null);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
        <Editor
          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
          apiKey={apiKey || "no-api-key"}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={(newContent) => {
            onChange?.(newContent);
          }}
          init={{
            height,
            directionality: direction,
            menubar: "file edit view insert format tools table help",
            placeholder,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "wordcount",
              "directionality",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | " +
              "bold italic underline strikethrough forecolor backcolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | " +
              "link table image media | removeformat | ltr rtl | fullscreen code",
            content_style: `body { font-family: Outfit, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b; padding: 12px; direction: ${direction}; text-align: ${direction === "rtl" ? "right" : "left"}; }`,
            branding: false,
            promotion: false,
            statusbar: true,
            elementpath: false,
          }}
        />
      </div>
    </div>
  );
}
