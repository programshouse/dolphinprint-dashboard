import React from "react";

const AdminForm = ({ 
  title, 
  children, 
  onSubmit, 
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  className,
  submitDisabled = false,
  noValidate = false,
}) => {
  return (
    <div className={`bg-white  rounded-lg shadow-sm border border-gray-200  p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900  mb-6">
        {title}
      </h2>
      
      <form onSubmit={onSubmit} className="space-y-6" noValidate={noValidate}>
        {children}
        
        <div className="flex gap-3 pt-4 border-t border-gray-200 ">
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={submitDisabled}
          >
            {submitText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
