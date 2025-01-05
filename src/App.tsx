import React, { useState } from 'react';
import { ImageDropzone } from './components/ImageDropzone';
import { ImageEditor } from './components/ImageEditor';
import { Maximize2 } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesDrop = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Maximize2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Image Resizer</h1>
          <p className="text-lg text-gray-600">
            Resize, optimize, and convert your images right in your browser
          </p>
        </div>

        <ImageDropzone
          onFilesDrop={handleFilesDrop}
          className="mb-8"
        />

        {files.length > 0 && (
          <div className="space-y-6">
            {files.map((file, index) => (
              <ImageEditor
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;