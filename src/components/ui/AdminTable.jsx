import React, { useState, useEffect, useCallback } from "react";
import Pagination, { RowsPerPageSelect } from "./Pagination";

const AdminTable = ({
  title,
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onShow,
  onAdd,
  addText = "Add New",
  className = "",
  // ✅ if true: call onDelete with (item.id || item._id)
  // ✅ if false: call onDelete with the entire item
  deleteById = false,
  // ✅ confirm popup before deleting
  confirmDelete = true,
  // ✅ customize confirm message
  confirmDeleteText = (item) =>
    `Delete this item?\n\n${item?.name || item?.title || item?.question_en || ""}`,
  // 📄 Pagination configuration
  pagination = true,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSizeSelector = true,
  currentPage: externalCurrentPage,
  onPageChange: externalOnPageChange,
}) => {
  const hasActions = Boolean(onShow || onEdit || onDelete);

  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const currentPage =
    externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const totalItems = data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handlePageChange = useCallback(
    (newPage) => {
      if (externalOnPageChange) {
        externalOnPageChange(newPage);
      }
      setInternalCurrentPage(newPage);
    },
    [externalOnPageChange]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [totalPages, currentPage, handlePageChange]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const displayedData = pagination ? data.slice(startIndex, endIndex) : data;

  const handleDeleteClick = (item) => {
    if (!onDelete) return;

    if (confirmDelete) {
      const ok = window.confirm(confirmDeleteText(item));
      if (!ok) return;
    }

    if (deleteById) {
      const id = item?.id || item?._id;
      if (!id) {
        console.error("Delete failed: item has no id/_id", item);
        return;
      }
      onDelete(id);
    } else {
      onDelete(item);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Top Header: Title, Rows per page selector on TOP, and Add button */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>

            {pagination && showPageSizeSelector && (
              <RowsPerPageSelect
                value={pageSize}
                onChange={(newSize) => {
                  setPageSize(newSize);
                  handlePageChange(1);
                }}
                options={pageSizeOptions}
              />
            )}
          </div>

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shrink-0"
            >
              {addText}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}

              {hasActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              displayedData.map((item, index) => (
                <tr
                  key={item?.id || item?._id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render ? column.render(item) : item?.[column.key]}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {onShow && (
                          <button
                            type="button"
                            onClick={() => onShow?.(item)}
                            className="px-3 py-2 rounded-md border border-brand-600 text-brand-600 hover:bg-blue-50 transition-colors"
                          >
                            View
                          </button>
                        )}

                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit?.(item)}
                            className="px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                          >
                            Edit
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item)}
                            className="px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Footer: Page Navigation only (Rows per page is on top) */}
      {pagination && data.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
            showRowsPerPage={false}
          />
        </div>
      )}
    </div>
  );
};

export default AdminTable;
