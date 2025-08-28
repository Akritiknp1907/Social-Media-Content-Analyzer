import React from 'react';
import { FileText, Image, Clock } from 'lucide-react';

// Shows history of previous uploads
const HistoryList = ({ history }) => (
  history.length > 1 ? (
    <div className="history-card">
      <div className="card-header">
        <Clock size={20} />
        <h3>Your last documents</h3>
      </div>
      <div className="history-list">
        {history.slice(1, 4).map((item, idx) => (
          <div key={idx} className="history-item">
            <div className="history-icon">
              {item.mimetype?.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
            </div>
            <div className="history-details">
              <h4>{item.filename}</h4>
              <p>{item.analysis.metrics.wordCount} words • {item.analysis.metrics.sentenceCount} sentences</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null
);

export default HistoryList;
