import React from 'react';
import { Check } from 'lucide-react';

export default function CaptureProgress({
  steps,
  currentStepIndex,
  capturedImagesMap,
  onSelectStep
}) {
  return (
    <div style={{
      width: '105px',
      backgroundColor: '#0A0A0A',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      padding: '20px 10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Vertical Connector Line */}
      <div style={{
        position: 'absolute',
        top: '40px',
        bottom: '40px',
        left: '21px',
        width: '1px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        zIndex: 1
      }} />

      {steps.map((step, idx) => {
        const isCaptured = !!capturedImagesMap[step.id];
        const isCurrent = idx === currentStepIndex;

        return (
          <div
            key={step.id}
            onClick={() => onSelectStep && onSelectStep(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: idx === steps.length - 1 ? 0 : '22px',
              zIndex: 2,
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isCaptured
                ? 'var(--accent-gold)'
                : isCurrent
                ? '#FFFFFF'
                : '#262626',
              color: isCaptured
                ? '#FFFFFF'
                : isCurrent
                ? '#0A0A0A'
                : '#737373',
              border: isCurrent ? '2px solid var(--accent-gold)' : 'none'
            }}>
              {isCaptured ? <Check size={12} /> : idx + 1}
            </div>

            <span style={{
              fontSize: '0.75rem',
              fontWeight: isCurrent ? 700 : 500,
              color: isCurrent
                ? 'var(--accent-gold)'
                : isCaptured
                ? '#F5F5F5'
                : '#737373'
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
