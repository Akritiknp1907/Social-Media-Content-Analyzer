import React from 'react';

// Shows a loading spinner and message
const LoadingSpinner = () => (
  <div className="loading-card">
    <div className="loading-spinner"></div>
    <h3>Analyzing your content</h3>
    <p>This might take a few moments</p>
  </div>
);

export default LoadingSpinner;
