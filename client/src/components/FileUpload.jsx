import React from 'react';
import { Upload, FileText, Image } from 'lucide-react';

// Handles file selection, drag/drop, preview, and upload button
const FileUpload = ({ file, onFileChange, onSubmit, dragActive, handleDragOver, handleDragLeave, handleDrop, loading }) => (
  <form
    onSubmit={onSubmit}
    className={`upload-area ${dragActive ? 'drag-active' : ''}`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <div className="upload-icon">
      <Upload size={48} />
    </div>
    <div className="upload-content">
      <h3>Drop your PDF, JPG, or PNG file here</h3>
      <p>or click to browse</p>
    </div>
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={onFileChange}
      className="file-input-hidden"
    />
    <button type="submit" className="upload-btn" disabled={loading}>Upload</button>
    {file && (
      <div className="file-preview-card">
        <div className="file-info">
          <div className="file-icon">
            {file.type.startsWith('image/') ? <Image size={20} /> : <FileText size={20} />}
          </div>
          <div className="file-details">
            <h4>{file.name}</h4>
            <p>{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      </div>
    )}
  </form>
);

export default FileUpload;
