import React from 'react';

export default function CameraPreview({
  videoRef,
  isCapturing,
  shutterFlash,
  activeInstruction,
  previewImage
}) {
  return (
    <div style={{
      position: 'relative',
      flex: 1,
      height: '100%',
      backgroundColor: '#171717',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      
      {/* Top Instruction Guidance Banner */}
      {activeInstruction && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}>
          <span style={{
            color: '#F5F5F5',
            fontSize: '0.825rem',
            fontWeight: 600,
            background: 'rgba(0,0,0,0.6)',
            padding: '6px 14px',
            borderRadius: '16px',
            letterSpacing: '0.01em'
          }}>
            {activeInstruction}
          </span>
        </div>
      )}

      {/* Minimal Framing Guide Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        bottom: '20px',
        border: '1px dashed rgba(255,255,255,0.2)',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: 10
      }} />

      {/* Corner Brackets */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', width: '16px', height: '16px', borderTop: '1.5px solid rgba(255,255,255,0.4)', borderLeft: '1.5px solid rgba(255,255,255,0.4)', pointerEvents: 'none', zIndex: 11 }} />
      <div style={{ position: 'absolute', top: '16px', right: '16px', width: '16px', height: '16px', borderTop: '1.5px solid rgba(255,255,255,0.4)', borderRight: '1.5px solid rgba(255,255,255,0.4)', pointerEvents: 'none', zIndex: 11 }} />
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '16px', height: '16px', borderBottom: '1.5px solid rgba(255,255,255,0.4)', borderLeft: '1.5px solid rgba(255,255,255,0.4)', pointerEvents: 'none', zIndex: 11 }} />
      <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '16px', height: '16px', borderBottom: '1.5px solid rgba(255,255,255,0.4)', borderRight: '1.5px solid rgba(255,255,255,0.4)', pointerEvents: 'none', zIndex: 11 }} />

      {/* White Shutter Flash Overlay (150-250ms) */}
      {shutterFlash && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 30,
          opacity: 0.9,
          transition: 'opacity 150ms ease-out'
        }} />
      )}

      {/* Live Video or Image Preview */}
      {previewImage ? (
        <img
          src={previewImage}
          alt="Preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
