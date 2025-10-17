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
  multiple = false,
  onChange,
  value,
  error,
  description = 'Upload a clear screenshot or photo of your payment receipt',
  maxSize = '10MB',
  supportedFormats = 'JPG, PNG, GIF',
  className = '',
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(Array.isArray(value) ? value : value ? [value] : []);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setSelectedFiles(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);

  useEffect(() => {
    // Generate image preview URLs
    if (selectedFiles.length > 0) {
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(urls);
      
      // Cleanup URLs when component unmounts or files change
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [selectedFiles]);

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
    // Reset input value to allow selecting the same file again
    event.target.value = '';
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

        {selectedFiles.length === 0 ? (
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
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
              </span>
            </div>
            <p className="text-xs text-gray-500">Click or drag to add more files</p>
          </div>
        )}
      </div>

      {/* Image Previews with Remove Button */}
      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {imagePreviews.map((url, index) => (
            <div key={index} className="relative w-40 h-40 group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full rounded-lg border border-gray-300 object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="cursor-pointer absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

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