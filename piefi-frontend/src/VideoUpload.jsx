import React, { useState, useRef } from 'react';

const VideoUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file');
      return;
    }
    setError(null);
    uploadVideo(file);
  };

  const uploadVideo = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/upload-video', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      
    } catch (err) {
      setError(`Failed to process video: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
      <div
        className={`border-3 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
          ${dragOver 
            ? 'border-green-500 bg-green-50' 
            : 'border-indigo-400 bg-indigo-50/50 hover:border-purple-500 hover:bg-purple-50/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-1'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <div className="text-5xl mb-5">🎥</div>
        <h3 className="text-xl font-bold mb-2">Upload Project Video</h3>
        <p className="text-gray-600 mb-4">
          {dragOver ? 'Drop your video here!' : 'Drop your video here or click to select'}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />
        
        <button
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            !uploading && fileInputRef.current?.click();
          }}
          disabled={uploading}
        >
          {uploading ? 'Processing...' : 'Choose Video File'}
        </button>
      </div>

      {uploading && (
        <div className="mt-5 text-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-indigo-600 font-medium">Processing video... This may take a few moments.</p>
        </div>
      )}

      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;