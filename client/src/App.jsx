import { useState } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [analysisLevel, setAnalysisLevel] = useState('medium'); // ✅ default is medium now

  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedInsights, setCopiedInsights] = useState(false);
  const [copiedSuggestions, setCopiedSuggestions] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(f.type)) {
      setError('File type not supported. Please upload PDF, JPG, or PNG.');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a PDF, JPG, or PNG file.');
      return;
    }
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(
        `${API_URL}/api/analyze`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log("✅ API Response:", data);
      setResult(data);
      setAnalysisLevel('medium'); // ✅ default after API response
      setHistory(prev => [data, ...prev]);
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDownload = (textToDownload, fileName = 'insights.txt') => {
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const copyWithFeedback = (text, setFlag, ms = 1500) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), ms);
  };

  const handleCopyContent = () =>
    copyWithFeedback(result?.extractedText, setCopiedContent, 1200);

  const handleCopyInsights = (text) =>
    copyWithFeedback(text, setCopiedInsights, 1500);

  const handleCopySuggestions = (text) =>
    copyWithFeedback(text, setCopiedSuggestions, 1500);

  const handleShare = (textToShare) => {
    if (navigator.share && textToShare) {
      navigator.share({
        title: 'Social Media Post Insights',
        text: textToShare,
      });
    } else {
      alert('Sharing not supported on this browser.');
    }
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="background-pattern"></div>

      <header className="app-header">
        <div className="header-content">
          <h1 className="logo-text">PostMate</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main-container">
        <div className="hero-section">
          <h2 className="hero-title">Your Social Media Post Assistant</h2>
          <p className="hero-subtitle">
            Upload a PDF or image of a post — I’ll extract the content, analyze it, and suggest improvements to boost engagement.
          </p>
        </div>

        <div className="upload-card">
          <FileUpload
            file={file}
            onFileChange={handleFileChange}
            dragActive={dragActive}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            loading={loading}
          />

          <div className="action-buttons">
            <button
              type="button"
              disabled={loading}
              className="main-action-btn"
              onClick={onSubmit}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Analyzing...
                </>
              ) : (
                <>Analyze Post</>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setFile(null);
                setAnalysisLevel('medium'); // ✅ reset to medium
                setError('');
                setCopiedContent(false);
                setCopiedInsights(false);
                setCopiedSuggestions(false);
              }}
              className="main-action-btn"
            >
              Start Over
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {/* Error message */}
        <ErrorMessage error={error} />

        {/* Results */}
        {result?.postInsights && (
          <ResultCard
            result={result}
            analysisLevel={analysisLevel}
            setAnalysisLevel={setAnalysisLevel}
            onCopyContent={handleCopyContent}
            onCopyInsights={handleCopyInsights}
            onCopySuggestions={handleCopySuggestions}
            copiedContent={copiedContent}
            copiedInsights={copiedInsights}
            copiedSuggestions={copiedSuggestions}
            handleDownload={handleDownload}
            handleShare={handleShare}
          />
        )}

        {/* History */}
        <HistoryList history={history} />
      </main>
    </div>
  );
}

export default App;
