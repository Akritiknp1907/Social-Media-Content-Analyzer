import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// Import custom components
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
  const [summaryType, setSummaryType] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const filePreviewUrl = useRef(null);

  
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(f.type)) {
      setError('File type not supported. Please upload PDF, JPG, or PNG.');
      setFile(null);
      filePreviewUrl.current = null;
      return;
    }
    setError('');
    setFile(f);
    if (f.type.startsWith('image/')) {
      filePreviewUrl.current = URL.createObjectURL(f);
    } else {
      filePreviewUrl.current = null;
    }
  };

  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!file) {
      setError('Please select a PDF, JPG, or PNG file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyze`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResult(data);
      setSummaryType('');

      setHistory(prev => [data, ...prev]); 
    } catch (err) {
      console.error(err);
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!result?.summaries || !summaryType) return;
    const text = result.summaries[summaryType];
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${summaryType}_summary.txt`;
    link.click();
  };

  const handleCopy = () => {
    if (!result?.summaries || !summaryType) return;
    navigator.clipboard.writeText(result.summaries[summaryType]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCopyText = () => {
    if (!result?.extractedText) return;
    navigator.clipboard.writeText(result.extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleShare = () => {
    if (navigator.share && result?.summaries && summaryType) {
      navigator.share({
        title: 'Social Media Content Summary',
        text: result.summaries[summaryType],
      });
    } else {
      alert('Sharing not supported on this browser.');
    }
  };
  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="background-pattern"></div>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo-text">TextMate</h1>
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
          <h2 className="hero-title">Your Personal Content Assistant</h2>
          <p className="hero-subtitle">
            Upload a pdf or image — I’ll help you read it, simplify it, and give you quick insights you can actually use.
          </p>
        </div>
        
        <div className="upload-card">
          <FileUpload
            file={file}
            onFileChange={handleFileChange}
            onSubmit={onSubmit}
            dragActive={dragActive}
            handleDragOver={e => { e.preventDefault(); setDragActive(true); }}
            handleDragLeave={e => { e.preventDefault(); setDragActive(false); }}
            handleDrop={e => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange({ target: { files: e.dataTransfer.files } });
              }
            }}
            loading={loading}
          />
          <div className="action-buttons">
            <button
              type="button"
              disabled={loading || !file}
              className="main-action-btn"
              onClick={onSubmit}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Analyzing...
                </>
              ) : (
                <>Analyze Content</>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setFile(null);
                setSummaryType('');
                setError('');
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
        {result && (
          <ResultCard
            result={result}
            summaryType={summaryType}
            setSummaryType={setSummaryType}
            handleCopyText={() => {
              if (!result?.extractedText) return;
              navigator.clipboard.writeText(result.extractedText);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            copied={copied}
            handleCopy={() => {
              if (!result?.summaries || !summaryType) return;
              navigator.clipboard.writeText(result.summaries[summaryType]);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            handleDownload={() => {
              if (!result?.summaries || !summaryType) return;
              const text = result.summaries[summaryType];
              const blob = new Blob([text], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `${summaryType}_summary.txt`;
              link.click();
            }}
            handleShare={() => {
              if (navigator.share && result?.summaries && summaryType) {
                navigator.share({
                  title: 'Social Media Content Summary',
                  text: result.summaries[summaryType],
                });
              } else {
                alert('Sharing not supported on this browser.');
              }
            }}
          />
        )}
        {/* History */}
        <HistoryList history={history} />
      </main>
    </div>
  );
}

export default App;
