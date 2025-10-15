import React, { useEffect, useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface StyledFileUploadProps {
  id: string;
  label?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  onChange?: (file: File | File[] | null) => void;
  value?: File | File[] | null;
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
  multiple = false, // default false
  onChange,
  value,
  error,
  description = 'Upload a clear screenshot or photo of your payment receipt',
  maxSize = '10MB',
  supportedFormats = 'JPG, PNG, GIF',
  className = '',
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(Array.isArray(value) ? value : value ? [value] : []);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setSelectedFiles(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
    if (onChange) {
      if (multiple) {
        onChange(files);
      } else {
        onChange(files[0] || null);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (multiple) {
      handleFilesChange([...selectedFiles, ...files]);
    } else {
      handleFilesChange(files.slice(0, 1));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    const filteredFiles = files.filter(f => f.type.match(accept.replace('*', '.*')));
    if (multiple) {
      handleFilesChange([...selectedFiles, ...filteredFiles]);
    } else {
      handleFilesChange(filteredFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    handleFilesChange(newFiles);
  };

  const getBorderColor = () => {
    if (error) return 'border-red-400 bg-red-50';
    if (isDragOver) return 'border-blue-500 bg-blue-50';
    if (selectedFiles.length > 0) return 'border-green-400 bg-green-50';
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
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleInputChange}
        />

        {selectedFiles.length > 0 ? (
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between border p-2 rounded-md bg-white">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="bg-amber-200 hover:bg-amber-200/90 p-1 rounded inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
            ))}
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

      {!selectedFiles.length && !error && (
        <p className="text-xs text-gray-500 text-center">
          Supported formats: {supportedFormats} (Max {maxSize})
        </p>
      )}

      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default StyledFileUpload;
