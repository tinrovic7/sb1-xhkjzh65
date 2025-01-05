import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  className?: string;
}

export function ImageDropzone({ onFilesDrop, className }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    onDrop: (acceptedFiles) => {
      onFilesDrop(acceptedFiles);
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
        className
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag & drop images here, or click to select files
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports JPG, PNG, GIF, WebP up to 25MB
      </p>
    </div>
  );
}