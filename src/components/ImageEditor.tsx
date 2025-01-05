import React, { useState } from 'react';
import { Download, Maximize2, Image as ImageIcon, Settings } from 'lucide-react';
import { formatFileSize, resizeImage } from '../lib/utils';

interface ImageEditorProps {
  file: File;
  onRemove: () => void;
}

export function ImageEditor({ file, onRemove }: ImageEditorProps) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState('jpeg');
  const [preview, setPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  React.useEffect(() => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
  }, [file]);

  const handleResize = async () => {
    try {
      setProcessing(true);
      const resizedBlob = await resizeImage(file, width, height, maintainAspectRatio, quality / 100, format);
      setPreview(URL.createObjectURL(resizedBlob));
    } catch (error) {
      console.error('Failed to resize image:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    const link = document.createElement('a');
    link.href = preview;
    link.download = `resized-${file.name.split('.')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ImageIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="font-medium">{file.name}</span>
        </div>
        <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Maintain aspect ratio</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quality ({quality}%)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleResize}
              disabled={processing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : 'Process Image'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!preview}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <img src={URL.createObjectURL(file)} alt="Original" className="w-full h-full object-contain" />
            )}
          </div>
          <div className="mt-2 text-sm text-gray-500 flex justify-between">
            <span>Original: {originalDimensions.width}x{originalDimensions.height}px</span>
            {preview && <span>New: {width}x{height}px</span>}
          </div>
        </div>
      </div>
    </div>
  );
}