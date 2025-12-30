import React from "react";

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
}) => {
  const hasActions = Boolean(onShow || onEdit || onDelete);

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
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {addText}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}

              {hasActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item?.id || item?._id || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
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
                            className="px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            View
                          </button>
                        )}

                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit?.(item)}
                            className="px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                          >
                            Edit
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item)}
                            className="px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
    </div>
  );
};

export default AdminTable;
