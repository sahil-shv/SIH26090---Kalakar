import React, { useState } from 'react';
import { Check, Edit2 } from 'lucide-react';

const WORKFLOW_STEPS = [
  { id: 'photos', label: 'Photos Captured' },
  { id: 'analysis', label: 'Product Profile' },
  { id: 'artisan', label: 'Artisan Input' },
  { id: 'content', label: 'Product Content' },
  { id: 'photoshoot_plan', label: 'Photoshoot Plan' },
  { id: 'image_gen', label: 'AI Product Photos' },
  { id: 'pricing', label: 'Pricing' }
];

export default function AiStatusConsole({
  hasCapturedImages,
  analysisState, // 'idle' | 'analyzing' | 'done' | 'error'
  analysisError,
  productProfile,
  artisanInput,
  contentState, // 'idle' | 'generating' | 'done' | 'error'
  contentError,
  photoshootState, // 'idle' | 'planning' | 'done' | 'error' | 'stale'
  photoshootError,
  generatedPhotos = {}, // { hero, lifestyle, detail, context }
  onUpdateProfile,
  onRetryContent,
  onRetryAnalysis,
  onRetryPhotoshoot
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(productProfile || {});

  const photoList = Object.values(generatedPhotos);
  const completedPhotosCount = photoList.filter(p => p && p.status === 'completed').length;
  const isGeneratingPhotos = photoList.some(p => p && p.status === 'generating');
  const hasFailedPhotos = photoList.some(p => p && p.status === 'failed');

  // Determine stage statuses
  const getStepStatus = (stepId) => {
    if (stepId === 'photos') {
      return hasCapturedImages ? 'completed' : 'pending';
    }
    if (stepId === 'analysis') {
      if (analysisState === 'analyzing') return 'active';
      if (analysisState === 'done') return 'completed';
      if (analysisState === 'error') return 'error';
      return 'pending';
    }
    if (stepId === 'artisan') {
      if (artisanInput) return 'completed';
      if (analysisState === 'done') return 'pending';
      return 'pending';
    }
    if (stepId === 'content') {
      if (contentState === 'generating') return 'active';
      if (contentState === 'done') return 'completed';
      if (contentState === 'error') return 'error';
      return 'pending';
    }
    if (stepId === 'photoshoot_plan') {
      if (photoshootState === 'planning') return 'active';
      if (photoshootState === 'done') return 'completed';
      if (photoshootState === 'stale') return 'warning';
      if (photoshootState === 'error') return 'error';
      return 'pending';
    }
    if (stepId === 'image_gen') {
      if (completedPhotosCount === 4) return 'completed';
      if (isGeneratingPhotos) return 'active';
      if (hasFailedPhotos) return 'error';
      if (completedPhotosCount > 0) return 'active';
      return 'pending';
    }
    if (stepId === 'pricing') {
      return 'pending'; // Phase 7
    }
    return 'pending';
  };

  const handleSaveProfileEdit = () => {
    if (onUpdateProfile) {
      onUpdateProfile(profileForm);
    }
    setIsEditingProfile(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Heading */}
      <div className="heading-section">AI WORKFLOW STATUS</div>

      {/* Progressive Checklist Console */}
      <div style={{
        background: 'var(--bg-app)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {WORKFLOW_STEPS.map((step) => {
          const status = getStepStatus(step.id);

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.825rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {status === 'completed' && (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--accent-gold)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem'
                  }}>
                    <Check size={11} />
                  </div>
                )}
                {status === 'active' && (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--accent-gold)',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    ⟳
                  </div>
                )}
                {status === 'warning' && (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}>
                    !
                  </div>
                )}
                {status === 'error' && (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#dc2626',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}>
                    ✕
                  </div>
                )}
                {status === 'pending' && (
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem'
                  }}>
                    ○
                  </div>
                )}

                <span style={{
                  fontWeight: status === 'active' ? 700 : status === 'completed' ? 600 : 400,
                  color: status === 'active'
                    ? 'var(--accent-gold)'
                    : status === 'completed'
                    ? 'var(--text-primary)'
                    : status === 'warning'
                    ? '#d97706'
                    : status === 'error'
                    ? '#dc2626'
                    : 'var(--text-muted)'
                }}>
                  {step.label}
                </span>
              </div>

              {/* Status Action / Hint */}
              <div style={{ fontSize: '0.75rem' }}>
                {step.id === 'photos' && hasCapturedImages && (
                  <span style={{ color: 'var(--text-muted)' }}>5 views captured</span>
                )}
                {step.id === 'analysis' && analysisState === 'analyzing' && (
                  <span style={{ color: 'var(--accent-gold)' }}>Analyzing with Gemini...</span>
                )}
                {step.id === 'analysis' && analysisState === 'done' && (
                  <span style={{ color: 'var(--success-main)', fontWeight: 600 }}>Identified</span>
                )}
                {step.id === 'analysis' && analysisState === 'error' && (
                  <button onClick={onRetryAnalysis} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    Retry
                  </button>
                )}
                {step.id === 'artisan' && artisanInput && (
                  <span style={{ color: 'var(--success-main)', fontWeight: 600 }}>Received</span>
                )}
                {step.id === 'content' && contentState === 'generating' && (
                  <span style={{ color: 'var(--accent-gold)' }}>Writing listing...</span>
                )}
                {step.id === 'content' && contentState === 'done' && (
                  <span style={{ color: 'var(--success-main)', fontWeight: 600 }}>Ready</span>
                )}
                {step.id === 'content' && contentState === 'error' && (
                  <button onClick={onRetryContent} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    Retry
                  </button>
                )}
                {step.id === 'photoshoot_plan' && photoshootState === 'planning' && (
                  <span style={{ color: 'var(--accent-gold)' }}>Planning 4 prompts...</span>
                )}
                {step.id === 'photoshoot_plan' && photoshootState === 'done' && (
                  <span style={{ color: 'var(--success-main)', fontWeight: 600 }}>4 Prompts Ready</span>
                )}
                {step.id === 'photoshoot_plan' && photoshootState === 'stale' && (
                  <button onClick={onRetryPhotoshoot} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 6px', color: '#d97706', borderColor: '#fcd34d' }}>
                    Update
                  </button>
                )}
                {step.id === 'photoshoot_plan' && photoshootState === 'error' && (
                  <button onClick={onRetryPhotoshoot} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    Retry
                  </button>
                )}
                {step.id === 'image_gen' && isGeneratingPhotos && (
                  <span style={{ color: 'var(--accent-gold)' }}>Rendering {completedPhotosCount}/4 photos...</span>
                )}
                {step.id === 'image_gen' && completedPhotosCount === 4 && (
                  <span style={{ color: 'var(--success-main)', fontWeight: 600 }}>4 Photos Ready</span>
                )}
                {step.id === 'image_gen' && completedPhotosCount > 0 && completedPhotosCount < 4 && !isGeneratingPhotos && (
                  <span style={{ color: 'var(--accent-gold)' }}>{completedPhotosCount}/4 Ready</span>
                )}
                {step.id === 'pricing' && (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending Phase</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Alert Box if Analysis Fails */}
      {analysisState === 'error' && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#991b1b' }}>
              Product Analysis Failed
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
              {analysisError || 'We couldn\'t analyze your product photos. Please check network/connection and try again.'}
            </span>
          </div>
          <button
            onClick={onRetryAnalysis}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: '#fca5a5', color: '#991b1b', flexShrink: 0, marginLeft: '12px' }}
          >
            Retry Analysis
          </button>
        </div>
      )}

      {/* Error Alert Box if Content Generation Fails */}
      {contentState === 'error' && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#991b1b' }}>
              Product Content Generation Failed
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
              {contentError || 'We couldn\'t create your product description and details. Please try again.'}
            </span>
          </div>
          <button
            onClick={onRetryContent}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: '#fca5a5', color: '#991b1b', flexShrink: 0, marginLeft: '12px' }}
          >
            Retry Content
          </button>
        </div>
      )}

      {/* Error Alert Box if Photoshoot Planning Fails */}
      {photoshootState === 'error' && photoshootError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#991b1b' }}>
              Photoshoot Planning Failed
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
              {photoshootError}
            </span>
          </div>
          <button
            onClick={onRetryPhotoshoot}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: '#fca5a5', color: '#991b1b', flexShrink: 0, marginLeft: '12px' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Product Profile Confirmation & Inline Editing Box */}
      {analysisState === 'done' && productProfile && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px'
        }}>
          {!isEditingProfile ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AI Visual Understanding Profile
                </h4>
                <button
                  onClick={() => { setProfileForm(productProfile); setIsEditingProfile(true); }}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit2 size={11} />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Product Type</span>
                  <strong>{productProfile.product_type || productProfile.productType || 'Product'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Category</span>
                  <strong>{productProfile.category || 'Handicrafts'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Observed Materials</span>
                  <strong>
                    {Array.isArray(productProfile.materials_observed)
                      ? productProfile.materials_observed.map(m => typeof m === 'object' ? m.value : m).join(', ')
                      : Array.isArray(productProfile.materialsObserved)
                      ? productProfile.materialsObserved.join(', ')
                      : 'Natural Fiber'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Craft / Construction</span>
                  <strong>{productProfile.construction || productProfile.craft_style || 'Handcrafted'}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '10px' }}>
                EDIT DERIVED VISUAL ATTRIBUTES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Product Type</label>
                  <input
                    type="text"
                    value={profileForm.product_type || profileForm.productType || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, product_type: e.target.value, productType: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Category</label>
                  <input
                    type="text"
                    value={profileForm.category || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsEditingProfile(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button onClick={handleSaveProfileEdit} className="btn btn-primary btn-sm">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
