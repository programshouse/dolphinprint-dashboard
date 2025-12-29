import React from "react";

const ServiceCard = ({ 
  title_en, 
  title_ar,
  description_en, 
  description_ar,
  image = null,
  className = "",
  onShow,
  onEdit,
  onDelete,
  id
}) => {
  const title = title_en || title_ar || "Untitled Service";
  const description = description_en || description_ar || "No description available";
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {/* Image Section */}
      <div className="w-full h-48">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Action Buttons */}
        {(onShow || onEdit || onDelete) && (
          <div className="flex gap-2 mb-4">
            {onShow && (
              <button
                onClick={() => onShow(id)}
                className="flex-1 px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                View
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(id)}
                className="flex-1 px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="flex-1 px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            )}
          </div>
        )}
        
        <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Get Service
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
