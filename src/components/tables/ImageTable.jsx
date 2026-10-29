// src/components/ImageTable.jsx
import React, { useState, useEffect } from "react";
import Pagination, { RowsPerPageSelect } from "../ui/Pagination";

export default function ImageTable({ rows = [], onDelete, onEdit, pageSize: initialPageSize = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = rows?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (!rows.length) {
    return (
      <div className="mt-6">
        <div className="rounded-2xl border bg-white p-6 text-center text-gray-500">
          No images uploaded yet.
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const displayedRows = rows.slice(startIndex, endIndex);

  return (
    <div className="mt-6">
      {/* Top Bar: Rows per page selector ON TOP */}
      <div className="flex items-center justify-between mb-3 px-1">
        <RowsPerPageSelect
          value={pageSize}
          onChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          options={[5, 10, 20, 50]}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Section Name</th>
              <th className="px-4 py-3 text-left">File Name</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Uploaded At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {displayedRows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={row.url}
                      alt={row.fileName || "image"}
                      className="h-14 w-14 rounded-lg object-cover border"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{row.section || "-"}</td>
                <td className="px-4 py-3">{row.fileName || "-"}</td>
                <td className="px-4 py-3">{row.sizeReadable || "-"}</td>
                <td className="px-4 py-3">{row.createdAt || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(row)}
                      className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(row)}
                      className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Bar: Page Navigation only (Rows per page is on top) */}
        {totalItems > 0 && (
          <div className="border-t border-gray-100 px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              showRowsPerPage={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
