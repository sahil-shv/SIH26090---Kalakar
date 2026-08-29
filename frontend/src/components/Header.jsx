import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function Header({ isSaving, isSaved, onResetSession }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-mark">
          <span style={{ fontSize: '10px', fontWeight: 800 }}>❖</span>
        </div>
        <span className="brand-title">AI Product Studio</span>
        <span className="brand-label">SIH26090 MVP</span>
      </div>

      <div className="header-actions">
        <span className="status-text">
          {isSaving ? 'Saving...' : isSaved ? 'Draft saved' : 'Draft session'}
        </span>

        <button 
          onClick={onResetSession} 
          className="btn btn-secondary btn-sm"
          title="Start New Product Digitization"
        >
          <RotateCcw size={12} />
          <span>New Product</span>
        </button>
      </div>
    </header>
  );
}
