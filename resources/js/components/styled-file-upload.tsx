import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface StyledFileUploadProps {
  id: string;
  label?: string;
  required?: boolean;
  accept?: string;
  onChange?: (file: File | null) => void; // Changed here
  value?: File | null;
  error?: string;
  description?: string;
  maxSize?: string;
  supportedFormats?: string;
  className?: string;
}

const StyledFileUpload: React.FC<StyledFileUploadProps> = ({
  id,
  label,
  required = false,
  accept = 'image/*',
  onChange,
  value,
  error,
  description = 'Upload a clear screenshot or photo of your payment receipt',
  maxSize = '10MB',
  supportedFormats = 'JPG, PNG, GIF',
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileChange = (file: File | null): void => {
    setSelectedFile(file);
    if (onChange) {
      onChange(file); // pass file directly
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.match(accept.replace('*', '.*'))) {
      handleFileChange(file);
    }
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    handleFileChange(null);
  };

  const getBorderColor = (): string => {
    if (error) return 'border-red-400 bg-red-50';
    if (isDragOver) return 'border-blue-500 bg-blue-50';
    if (selectedFile) return 'border-green-400 bg-green-50';
    return 'border-gray-300 bg-gray-50';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${getBorderColor()}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          className={`
            absolute inset-0 w-full h-full opacity-0 cursor-pointer
            ${selectedFile ? 'hidden' : ''}
          `}
          onChange={handleInputChange}
        />

        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
              <p className="text-xs text-green-600">File selected successfully</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="bg-amber-200 hover:bg-amber-200/90 p-2 rounded inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <Upload className={`w-12 h-12 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${error ? 'text-red-700' : 'text-gray-700'}`}>
                Click to upload or drag and drop
              </p>
              <p className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>{description}</p>
            </div>
          </div>
        )}
      </div>

      {!selectedFile && !error && (
        <p className="text-xs text-gray-500 text-center">
          Supported formats: {supportedFormats} (Max {maxSize})
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default StyledFileUpload;
