import React, { useEffect } from 'react';
import { FileText, BarChart3, Sparkles, Copy, Download, Share2 } from 'lucide-react';

const ResultCard = ({
  result,
  analysisLevel,
  setAnalysisLevel,

  onCopyContent,
  onCopyInsights,
  onCopySuggestions,
  copiedContent,
  copiedInsights,
  copiedSuggestions,

  handleDownload,
  handleShare
}) => {
  useEffect(() => {
    if (!analysisLevel) setAnalysisLevel('medium');
  }, [analysisLevel, setAnalysisLevel]);

  return (
    <div className="results-grid">

      {/* Extracted Text */}
      <div className="result-card text-card">
        <div className="card-header">
          <FileText size={20} />
          <h3>Extracted Text</h3>
          <button onClick={onCopyContent} className="copy-btn">
            <Copy size={16} />
            {copiedContent ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="text-content">
          <p>{result.extractedText}</p>
        </div>
      </div>

      {/* Post Insights */}
      {result.postInsights && !result.postInsights.error && (
        <div className="result-card summary-card">
          <div className="card-header">
            <Sparkles size={20} />
            <h3>Post Insights</h3>
          </div>
          <div className="summary-tabs">
            <button
              className={`tab-btn ${analysisLevel === 'short' ? 'active' : ''}`}
              onClick={() => setAnalysisLevel('short')}
            >
              Snapshot
            </button>
            <button
              className={`tab-btn ${analysisLevel === 'medium' ? 'active' : ''}`}
              onClick={() => setAnalysisLevel('medium')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${analysisLevel === 'long' ? 'active' : ''}`}
              onClick={() => setAnalysisLevel('long')}
            >
              Deep Dive
            </button>
          </div>

          {analysisLevel && result.postInsights[analysisLevel] && (
            <div className="summary-content">
              <p>{result.postInsights[analysisLevel].split('---')[0]}</p>
              <div className="summary-actions">
                <button
                  onClick={() => onCopyInsights(result.postInsights[analysisLevel].split('---')[0])}
                  className="action-btn"
                >
                  <Copy size={16} />{copiedInsights ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() =>
                    handleDownload(
                      result.postInsights[analysisLevel].split('---')[0],
                      `${analysisLevel}_insights.txt`
                    )
                  }
                  className="action-btn"
                >
                  <Download size={16} />Download
                </button>
                <button
                  onClick={() => handleShare(result.postInsights[analysisLevel].split('---')[0])}
                  className="action-btn"
                >
                  <Share2 size={16} />Share
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post Improvements */}
      {result.postInsights && !result.postInsights.error && (
        <div className="result-card summary-card">
          <div className="card-header">
            <Sparkles size={20} />
            <h3>Post Improvements</h3>
          </div>

          {analysisLevel && result.postInsights[analysisLevel] && (
            <div className="summary-content">
              <ul className="improvements-list">
                {result.postInsights[analysisLevel]
                  .split('---')[1]
                  .split(/(?=\d+\.\s)/)
                  .filter(item => item.trim() !== '')
                  .map((item, idx) => {
                    const cleaned = item.trim().replace(/^\d+\.\s*/, '');
                    const parts = cleaned.split(/(\*\*.*?\*\*)/);
                    return (
                      <li key={idx}>
                        {parts.map((part, i) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={i}>{part.slice(2, -2)}</strong>
                          ) : (
                            part
                          )
                        )}
                      </li>
                    );
                  })}
              </ul>

              <div className="summary-actions">
                <button
                  onClick={() => onCopySuggestions(result.postInsights[analysisLevel].split('---')[1])}
                  className="action-btn"
                >
                  <Copy size={16} />{copiedSuggestions ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() =>
                    handleDownload(
                      result.postInsights[analysisLevel].split('---')[1],
                      `${analysisLevel}_improvements.txt`
                    )
                  }
                  className="action-btn"
                >
                  <Download size={16} />Download
                </button>
                <button
                  onClick={() => handleShare(result.postInsights[analysisLevel].split('---')[1])}
                  className="action-btn"
                >
                  <Share2 size={16} />Share
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error case */}
      {result.postInsights && result.postInsights.error && (
        <div className="result-card summary-card">
          <div className="card-header">
            <Sparkles size={20} />
            <h3>AI Insights</h3>
          </div>
          <p className="error-message">{result.postInsights.error}</p>
        </div>
      )}

      {/* File info + metrics */}
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
            <h3>Engagement Metrics</h3>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-value">{result.analysis.metrics.hashtagCount}</span>
              <span className="metric-label">Hashtags</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{result.analysis.metrics.emojiCount}</span>
              <span className="metric-label">Emojis</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{result.analysis.metrics.mentionCount}</span>
              <span className="metric-label">Mentions (@)</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{result.analysis.metrics.linkCount}</span>
              <span className="metric-label">Links</span>
            </div>
          </div>
          <div className="sentiment-indicator">
            <span className="sentiment-label">Sentiment Score</span>
            <div className="sentiment-bar">
              <div
                className="sentiment-fill"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, (result.analysis.metrics.sentimentScore + 5) * 10)
                  )}%`
                }}
              ></div>
            </div>
            <span className="sentiment-value">{result.analysis.metrics.sentimentScore}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResultCard;
