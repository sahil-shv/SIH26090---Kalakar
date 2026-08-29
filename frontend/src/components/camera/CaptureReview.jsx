import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Check } from 'lucide-react';

export default function CaptureReview({
  steps,
  capturedImagesMap,
  onRetakeStep,
  onContinue
}) {
  const [selectedAngleId, setSelectedAngleId] = useState('front');

  const selectedImage = capturedImagesMap[selectedAngleId];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Review Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          YOUR PRODUCT PHOTOS
        </h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--success-main)', fontWeight: 600 }}>
          ✓ All 5 views captured
        </span>
      </div>

      {/* Main Selected Image Preview */}
      <div style={{
        width: '100%',
        height: '320px',
        backgroundColor: '#171717',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {selectedImage ? (
          <img
            src={selectedImage.dataUrl || selectedImage}
            alt={selectedAngleId}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ color: '#737373', fontSize: '0.85rem' }}>No image captured for this angle</span>
        )}

        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(0,0,0,0.6)',
          color: '#FFF',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '12px'
        }}>
          {steps.find(s => s.id === selectedAngleId)?.label || selectedAngleId} View
        </div>
      </div>

      {/* 5 View Selector Thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {steps.map(step => {
          const imgObj = capturedImagesMap[step.id];
          const isSelected = selectedAngleId === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setSelectedAngleId(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--accent-gold-light)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '100%', height: '48px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#E5E5E5' }}>
                {imgObj && (
                  <img
                    src={imgObj.dataUrl || imgObj}
                    alt={step.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Review Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <button
          onClick={() => onRetakeStep(selectedAngleId)}
          className="btn btn-secondary btn-sm"
        >
          <RotateCcw size={12} />
          <span>Retake {steps.find(s => s.id === selectedAngleId)?.label}</span>
        </button>

        <button
          onClick={onContinue}
          className="btn btn-primary btn-lg"
          style={{ padding: '10px 24px' }}
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
