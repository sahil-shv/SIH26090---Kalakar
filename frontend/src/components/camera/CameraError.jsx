import React from 'react';
import { CameraOff, RotateCcw } from 'lucide-react';

export default function CameraError({ errorMsg, onRetry }) {
  return (
    <div style={{
      background: 'var(--bg-app)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px 24px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--error-light)',
        color: 'var(--error-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <CameraOff size={22} />
      </div>

      <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Camera access is required
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px', maxWidth: '360px', margin: '0 auto 20px', lineHeight: '1.5' }}>
        {errorMsg || 'Allow camera access in your browser settings and try again.'}
      </p>

      <button onClick={onRetry} className="btn btn-primary btn-sm">
        <RotateCcw size={12} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
