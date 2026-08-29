import React, { useState } from 'react';
import { Camera, Sparkles, Copy, Check, ShieldCheck, RefreshCw, Maximize2, X, AlertCircle } from 'lucide-react';

const SHOT_TYPES = [
  { key: 'hero', title: 'Hero', fullTitle: '1. Hero Shot', badge: 'Studio', desc: 'Primary e-commerce product visual' },
  { key: 'lifestyle', title: 'Lifestyle', fullTitle: '2. Lifestyle', badge: 'Interior', desc: 'Complementary real-world environment' },
  { key: 'detail', title: 'Detail', fullTitle: '3. Craft Detail', badge: 'Macro', desc: 'Craftsmanship & material close-up' },
  { key: 'context', title: 'Context', fullTitle: '4. Use Case', badge: 'Practical', desc: 'Realistic practical scenario' }
];

export default function PhotoshootGallery({
  photoshootState,      // 'idle' | 'planning' | 'done' | 'error' | 'stale'
  photoshootPlan,       // { hero: { purpose, prompt }, lifestyle, detail, context }
  generatedPhotos = {}, // { hero: { status, dataUrl, error }, lifestyle: ... }
  onGenerateAllPhotos,
  onGenerateSinglePhoto,
  onRegeneratePlan,
  isDisabled = false
}) {
  const [selectedTab, setSelectedTab] = useState('hero');
  const [copiedTab, setCopiedTab] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState('photos'); // 'photos' | 'prompts'

  if (photoshootState === 'idle') {
    return null;
  }

  const activeShotInfo = SHOT_TYPES.find(s => s.key === selectedTab) || SHOT_TYPES[0];
  const activePromptData = photoshootPlan?.[selectedTab];
  const activePhotoData = generatedPhotos?.[selectedTab] || { status: 'idle' };

  const hasAnyPhotos = Object.values(generatedPhotos).some(p => p && p.status === 'completed');
  const isGeneratingAny = Object.values(generatedPhotos).some(p => p && p.status === 'generating');

  const handleCopyPrompt = (promptText) => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopiedTab(selectedTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Editorial Section Heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="heading-section">COMMERCIAL PRODUCT PHOTOSHOOT</div>
        
        {/* Toggle between Photos View and Prompts View */}
        {hasAnyPhotos && (
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button
              onClick={() => setActiveViewMode('photos')}
              style={{
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeViewMode === 'photos' ? 'var(--accent-gold)' : 'transparent',
                color: activeViewMode === 'photos' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              AI Photos
            </button>
            <button
              onClick={() => setActiveViewMode('prompts')}
              style={{
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeViewMode === 'prompts' ? 'var(--accent-gold)' : 'transparent',
                color: activeViewMode === 'prompts' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Prompts
            </button>
          </div>
        )}
      </div>

      {/* 1. PLANNING PROMPTS STATE */}
      {photoshootState === 'planning' && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-gold)', marginBottom: '8px', fontWeight: 600 }}>
            <Sparkles size={18} />
            <span>Planning 4 product-specific photoshoot prompts...</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Gemini is creating photography prompts tailored to your product identity.
          </p>
        </div>
      )}

      {/* 2. PROMPTS READY / GENERATE PHOTOS TRIGGER BOX */}
      {(photoshootState === 'done' || photoshootState === 'stale') && photoshootPlan && !hasAnyPhotos && !isGeneratingAny && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                4 Photoshoot Prompts Ready
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Generates Hero, Lifestyle, Detail, and Context photos using Nano Banana (Imagen 3).
              </span>
            </div>

            <button
              onClick={onGenerateAllPhotos}
              disabled={isDisabled || isGeneratingAny}
              className="btn btn-primary"
              style={{ flexShrink: 0, padding: '10px 18px' }}
            >
              <Camera size={15} />
              <span>Create Product Photos</span>
            </button>
          </div>

          {/* Stale Warning Banner */}
          {photoshootState === 'stale' && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>⚠️ Product attributes changed. Prompts can be updated.</span>
              <button onClick={onRegeneratePlan} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem' }}>
                Update Prompts
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. MAIN GALLERY VIEW (PHOTOS & PROMPTS) */}
      {(photoshootState === 'done' || photoshootState === 'stale') && photoshootPlan && (hasAnyPhotos || isGeneratingAny || activeViewMode === 'prompts') && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          
          {/* Shot Tabs */}
          <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '16px' }}>
            {SHOT_TYPES.map(shot => {
              const isActive = selectedTab === shot.key;
              const photoData = generatedPhotos[shot.key];
              const isComp = photoData?.status === 'completed';
              const isGen = photoData?.status === 'generating';
              const isErr = photoData?.status === 'failed';

              return (
                <button
                  key={shot.key}
                  onClick={() => setSelectedTab(shot.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: isActive ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: isActive ? 'var(--accent-gold-light)' : 'transparent',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{shot.title}</span>
                  {isComp && <Check size={11} style={{ color: 'var(--success-main)' }} />}
                  {isGen && <span style={{ fontSize: '0.7rem' }}>⟳</span>}
                  {isErr && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>✕</span>}
                </button>
              );
            })}
          </div>

          {/* VIEW MODE: AI PHOTOS */}
          {activeViewMode === 'photos' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {activeShotInfo.fullTitle}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    ({activeShotInfo.desc})
                  </span>
                </div>

                <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '4px' }}>
                  {activeShotInfo.badge.toUpperCase()}
                </span>
              </div>

              {/* Main Photo Frame */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#171717',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                {activePhotoData.status === 'completed' && activePhotoData.dataUrl ? (
                  <>
                    <img
                      src={activePhotoData.dataUrl}
                      alt={activeShotInfo.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeIn 350ms ease-out' }}
                    />

                    {/* EDITED FROM ORIGINAL PHOTO Disclosure Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.85)',
                      color: 'var(--accent-gold)',
                      border: '1px solid var(--accent-gold)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em'
                    }}>
                      EDITED FROM ORIGINAL PHOTO
                    </div>

                    {/* Original Source Reference Inset Thumbnail */}
                    {activePhotoData.originalImage && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        width: '54px',
                        height: '54px',
                        borderRadius: '6px',
                        border: '2px solid rgba(255,255,255,0.8)',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        background: '#000'
                      }} title="Original Captured Photo Reference">
                        <img
                          src={activePhotoData.originalImage}
                          alt="Original Captured Source"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 0, insetHorizontal: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.5rem', textAlign: 'center', fontWeight: 700 }}>
                          ORIGINAL
                        </div>
                      </div>
                    )}

                    {/* Expand Lightbox Button */}
                    <button
                      onClick={() => setLightboxImage(activePhotoData.dataUrl)}
                      className="btn btn-secondary btn-sm"
                      style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '6px' }}
                      title="View full size"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </>
                ) : activePhotoData.status === 'generating' ? (
                  <div style={{ textAlign: 'center', color: 'var(--accent-gold)', padding: '20px' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>⟳</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Creating {activeShotInfo.title}...</div>
                    <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginTop: '4px' }}>Qwen/Qwen-Image-Edit-2511 image editing</div>
                  </div>
                ) : activePhotoData.status === 'failed' ? (
                  <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>
                    <AlertCircle size={24} style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Failed to create {activeShotInfo.title}</div>
                    <span style={{ fontSize: '0.75rem', color: '#a3a3a3', display: 'block', marginTop: '4px' }}>
                      {activePhotoData.error || 'Generation timeout or service response issue.'}
                    </span>
                    <button
                      onClick={() => onGenerateSinglePhoto(selectedTab)}
                      disabled={isDisabled}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '12px', borderColor: '#ef4444', color: '#ef4444' }}
                    >
                      Retry {activeShotInfo.title}
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Photo not generated yet</div>
                    <button
                      onClick={() => onGenerateSinglePhoto(selectedTab)}
                      disabled={isDisabled || isGeneratingAny}
                      className="btn btn-primary btn-sm"
                    >
                      Generate {activeShotInfo.title}
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Actions Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success-main)' }}>
                  <ShieldCheck size={14} />
                  <span>Real Product Identity Preserved</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activePhotoData.status === 'completed' && (
                    <button
                      onClick={() => onGenerateSinglePhoto(selectedTab)}
                      disabled={isDisabled || isGeneratingAny}
                      className="btn btn-secondary btn-sm"
                    >
                      <RefreshCw size={11} />
                      <span>Regenerate {activeShotInfo.title}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* VIEW MODE: PROMPTS DETAIL */
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                Purpose: {activePromptData?.purpose || activeShotInfo.desc}
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontSize: '0.825rem',
                color: 'var(--text-primary)',
                lineHeight: '1.6',
                marginBottom: '12px'
              }}>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {activePromptData?.prompt || 'No prompt text available.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => handleCopyPrompt(activePromptData?.prompt)}
                  disabled={!activePromptData?.prompt}
                  className="btn btn-secondary btn-sm"
                >
                  <Copy size={12} />
                  <span>{copiedTab === selectedTab ? '✓ Copied Prompt' : 'Copy Prompt'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button
            onClick={() => setLightboxImage(null)}
            style={{ position: 'absolute', top: '20px', right: '20px', color: '#FFF', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Expanded View"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 'var(--radius-md)' }}
          />
        </div>
      )}

    </div>
  );
}
