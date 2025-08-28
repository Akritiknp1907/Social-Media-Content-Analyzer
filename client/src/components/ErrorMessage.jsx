import React from 'react';

// Simple error message display
const ErrorMessage = ({ error }) => (
  error ? (
    <div className="error-card">
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
    </div>
  ) : null
);

export default ErrorMessage;
