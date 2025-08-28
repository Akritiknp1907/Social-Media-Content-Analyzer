import React from 'react';
import { FileText, BarChart3, Sparkles, Copy, Download, Share2 } from 'lucide-react';

// Shows file info, metrics, extracted text, summaries
const ResultCard = ({ result, summaryType, setSummaryType, handleCopyText, copied, handleCopy, handleDownload, handleShare }) => (
  <div className="results-grid">
    <div className='result-card-box'>
      <div className="result-card file-card">
        <div className="card-header">
          <FileText size={20} />
          <h3>File Information</h3>
        </div>
        <div className="file-info-content">
          <h4>{result.filename}</h4>
          <p className="file-type">{result.mimetype}</p>
        </div>
      </div>
      <div className="result-card metrics-card">
        <div className="card-header">
          <BarChart3 size={20} />
          <h3>Content Metrics</h3>
        </div>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-value">{result.analysis.metrics.charCount.toLocaleString()}</span>
            <span className="metric-label">Character Count</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{result.analysis.metrics.wordCount.toLocaleString()}</span>
            <span className="metric-label">Word Count</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{result.analysis.metrics.sentenceCount}</span>
            <span className="metric-label">Number of Sentences</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">{result.analysis.metrics.avgWordsPerSentence}</span>
            <span className="metric-label">Average Words per Sentence</span>
          </div>
        </div>
        <div className="sentiment-indicator">
          <span className="sentiment-label">Sentiment Score</span>
          <div className="sentiment-bar">
            <div
              className="sentiment-fill"
              style={{
                width: `${Math.max(0, Math.min(100, (result.analysis.metrics.sentimentScore + 5) * 10))}%`
              }}
            ></div>
          </div>
          <span className="sentiment-value">{result.analysis.metrics.sentimentScore}</span>
        </div>
      </div>
    </div>
    <div className="result-card text-card">
      <div className="card-header">
        <FileText size={20} />
        <h3>Extracted Text</h3>
        <button onClick={handleCopyText} className="copy-btn">
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="text-content">
        <p>{result.extractedText}</p>
      </div>
    </div>
    {result.summaries && !result.summaries.error && (
      <div className="result-card summary-card">
        <div className="card-header">
          <Sparkles size={20} />
          <h3>Quick Summaries</h3>
        </div>
        <div className="summary-tabs">
          <button className={`tab-btn ${summaryType === 'short' ? 'active' : ''}`} onClick={() => setSummaryType('short')}>Short</button>
          <button className={`tab-btn ${summaryType === 'medium' ? 'active' : ''}`} onClick={() => setSummaryType('medium')}>Medium</button>
          <button className={`tab-btn ${summaryType === 'long' ? 'active' : ''}`} onClick={() => setSummaryType('long')}>Long</button>
        </div>
        {summaryType && result.summaries[summaryType] && (
          <div className="summary-content">
            <p>{result.summaries[summaryType]}</p>
            <div className="summary-actions">
              <button onClick={handleCopy} className="action-btn"><Copy size={16} />{copied ? 'Copied!' : 'Copy'}</button>
              <button onClick={handleDownload} className="action-btn"><Download size={16} />Download</button>
              <button onClick={handleShare} className="action-btn"><Share2 size={16} />Share</button>
            </div>
          </div>
        )}
      </div>
    )}
    {result.summaries && result.summaries.error && (
      <div className="result-card summary-card">
        <div className="card-header">
          <Sparkles size={20} />
          <h3>AI Summaries</h3>
        </div>
        <p className="error-message">{result.summaries.error}</p>
      </div>
    )}
  </div>
);

export default ResultCard;
