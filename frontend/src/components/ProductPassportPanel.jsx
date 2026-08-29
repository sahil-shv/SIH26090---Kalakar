import React, { useState } from 'react';
import { BookOpen, Edit2, Copy, Plus, X, Check } from 'lucide-react';

export default function ProductPassportPanel({
  session,
  onUpdateField,
  onSavePassport,
  isSaving
}) {
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState('hero');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const {
    capturedImages,
    analysis,
    content,
    generatedPhotos,
    photos,
    pricing,
    isSaved
  } = session;

  const photosData = generatedPhotos || photos;

  const hasCaptures = capturedImages && (Array.isArray(capturedImages) ? capturedImages.length > 0 : Object.keys(capturedImages).length > 0);
  const hasAnalysis = analysis && (analysis.product_type || analysis.productType || analysis.materials_observed || analysis.materialsObserved);
  const hasContent = content && (content.title || content.short_description || content.shortDescriptionEn);
  
  const hasPhotos = photosData && Object.values(photosData).some(p => {
    if (!p) return false;
    if (typeof p === 'string') return true;
    return p.status === 'completed' && !!p.dataUrl;
  });

  const handleStartEdit = (fieldKey, currentVal) => {
    setEditingField(fieldKey);
    setFieldValue(currentVal || '');
  };

  const handleSaveField = (fieldKey) => {
    onUpdateField(fieldKey, fieldValue);
    setEditingField(null);
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!content || !content.tags) return;
    const updatedTags = content.tags.filter(t => t !== tagToRemove);
    onUpdateField('tags', updatedTags);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim() || !content) return;
    const currentTags = content.tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      onUpdateField('tags', [...currentTags, newTagInput.trim()]);
    }
    setNewTagInput('');
    setShowAddTag(false);
  };

  const handleCopyJson = () => {
    const dataStr = JSON.stringify({ analysis, content, photos: photosData, pricing }, null, 2);
    navigator.clipboard.writeText(dataStr);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Display field extraction helpers
  const title = content?.title || analysis?.product_type || analysis?.productType || 'Captured Product';
  const shortDesc = content?.short_description || content?.shortDescriptionEn;
  const descEn = content?.description_en || content?.descriptionEn;
  const descHi = content?.description_hi || content?.descriptionHi;
  const seoDesc = content?.seo_description || content?.seoDescriptionEn;
  const tags = content?.tags || [];

  // Helper to get image preview
  const getPreviewImage = () => {
    if (hasPhotos) {
      const selectedObj = photosData[activeGalleryTab] || Object.values(photosData).find(p => typeof p === 'string' ? true : p?.status === 'completed');
      if (typeof selectedObj === 'string') return selectedObj;
      if (selectedObj?.dataUrl) return selectedObj.dataUrl;
    }
    if (capturedImages) {
      if (Array.isArray(capturedImages)) {
        return capturedImages[0]?.dataUrl || capturedImages[0];
      }
      return capturedImages.front?.dataUrl || Object.values(capturedImages)[0]?.dataUrl || Object.values(capturedImages)[0];
    }
    return null;
  };

  // PASSPORT EMPTY STATE
  if (!hasCaptures) {
    return (
      <div className="passport-workspace">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            PRODUCT PASSPORT
          </h2>
        </div>
        <div className="divider" style={{ marginBottom: '32px' }} />

        {/* Empty State Body */}
        <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--text-muted)'
          }}>
            <BookOpen size={24} />
          </div>

          <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Your product passport is empty
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Capture your product and share details. AI will create a professional digital passport for you.
          </p>

          <div style={{
            width: '100%',
            maxWidth: '380px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            textAlign: 'left',
            background: 'var(--bg-app)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              PASSPORT WILL INCLUDE
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--success-main)', fontWeight: 700 }}>✓</span>
                <span>Original & AI photoshoot images (4 views)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--success-main)', fontWeight: 700 }}>✓</span>
                <span>Title, short & full descriptions</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--success-main)', fontWeight: 700 }}>✓</span>
                <span>Hindi listing & SEO metadata</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--success-main)', fontWeight: 700 }}>✓</span>
                <span>Materials, craft & product features</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--success-main)', fontWeight: 700 }}>✓</span>
                <span>Categorized tags</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>○</span>
                <span style={{ color: 'var(--text-muted)' }}>Pricing (Pending Phase)</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="passport-workspace">
      
      {/* Passport Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            PRODUCT PASSPORT
          </h2>
        </div>

        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
          Live Draft
        </span>
      </div>
      <div className="divider" style={{ marginBottom: '24px' }} />

      {/* 1. Main Media Display */}
      <div style={{
        width: '100%',
        height: '280px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#171717',
        marginBottom: '20px'
      }}>
        {getPreviewImage() ? (
          <img
            src={getPreviewImage()}
            alt="Product Passport Media"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
            No Image Available
          </div>
        )}

        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: hasPhotos ? 'rgba(0,0,0,0.75)' : 'rgba(5, 150, 105, 0.9)',
          color: '#FFF',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '4px 8px',
          borderRadius: '4px',
          letterSpacing: '0.04em'
        }}>
          {hasPhotos ? 'AI GENERATED' : 'ORIGINAL PHOTO'}
        </div>
      </div>

      {/* Gallery Selector if AI photos exist */}
      {hasPhotos && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {['hero', 'lifestyle', 'detail', 'context'].map(tab => {
            const pObj = photosData?.[tab];
            const isReady = typeof pObj === 'string' ? !!pObj : pObj?.status === 'completed';

            return (
              <button
                key={tab}
                onClick={() => setActiveGalleryTab(tab)}
                disabled={!isReady}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: activeGalleryTab === tab ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  background: activeGalleryTab === tab ? 'var(--accent-gold-light)' : 'transparent',
                  color: activeGalleryTab === tab ? 'var(--accent-gold)' : isReady ? 'var(--text-secondary)' : 'var(--text-muted)',
                  opacity: isReady ? 1 : 0.5
                }}
              >
                {tab.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Product Title & Price State */}
      <div style={{ marginBottom: '24px' }}>
        {editingField === 'title' ? (
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent-gold)',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingField(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => handleSaveField('title')} className="btn btn-primary btn-sm">Save</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <h1 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.3' }}>
              {title}
            </h1>
            {hasContent && (
              <button onClick={() => handleStartEdit('title', title)} className="btn btn-secondary btn-sm" title="Edit Title">
                <Edit2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* Pricing State — Pending in Phase 6 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          {pricing && pricing.recommendedPrice ? (
            <>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                ₹{pricing.recommendedPrice}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                (Base ₹{pricing.baseCost} + {pricing.desiredMarginPct}% Margin)
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-app)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              Price: To be calculated
            </span>
          )}
        </div>
      </div>

      {/* 3. Product Attributes (Materials, Craft, Features) */}
      {hasAnalysis && (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px', fontSize: '0.85rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            PRODUCT ATTRIBUTES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Product Type</span>
              <strong>{analysis.product_type || analysis.productType || 'Handmade Product'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Category</span>
              <strong>{analysis.category || 'Home & Living'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Material</span>
              <strong>
                {Array.isArray(analysis.materials_observed)
                  ? analysis.materials_observed.map(m => typeof m === 'object' ? m.value : m).join(', ')
                  : Array.isArray(analysis.materialsObserved)
                  ? analysis.materialsObserved.join(', ')
                  : 'Natural Material'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Craft / Technique</span>
              <strong>{analysis.construction || analysis.craft_style || 'Handcrafted'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 4. Generated Content Section */}
      {hasContent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
          
          {/* Short Description */}
          {shortDesc && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Short Description
                </span>
                <button onClick={() => handleStartEdit('short_description', shortDesc)} className="btn btn-secondary btn-sm">
                  <Edit2 size={11} />
                </button>
              </div>
              {editingField === 'short_description' ? (
                <div>
                  <textarea
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', outline: 'none', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingField(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button onClick={() => handleSaveField('short_description')} className="btn btn-primary btn-sm">Save</button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {shortDesc}
                </p>
              )}
            </div>
          )}

          {/* Full Description (English) */}
          {descEn && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Full Description (English)
                </span>
                <button onClick={() => handleStartEdit('description_en', descEn)} className="btn btn-secondary btn-sm">
                  <Edit2 size={11} />
                </button>
              </div>
              {editingField === 'description_en' ? (
                <div>
                  <textarea
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    rows={4}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', outline: 'none', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingField(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button onClick={() => handleSaveField('description_en')} className="btn btn-primary btn-sm">Save</button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {descEn}
                </p>
              )}
            </div>
          )}

          {/* Hindi Description */}
          {descHi && (
            <div style={{ border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  HINDI LISTING (हिंदी विवरण)
                </span>
                <button onClick={() => handleStartEdit('description_hi', descHi)} className="btn btn-secondary btn-sm">
                  <Edit2 size={11} />
                </button>
              </div>
              {editingField === 'description_hi' ? (
                <div>
                  <textarea
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', outline: 'none', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingField(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button onClick={() => handleSaveField('description_hi')} className="btn btn-primary btn-sm">Save</button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  {descHi}
                </p>
              )}
            </div>
          )}

          {/* SEO Description */}
          {seoDesc && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  SEO Meta Description
                </span>
                <button onClick={() => handleStartEdit('seo_description', seoDesc)} className="btn btn-secondary btn-sm">
                  <Edit2 size={11} />
                </button>
              </div>
              {editingField === 'seo_description' ? (
                <div>
                  <textarea
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', outline: 'none', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingField(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button onClick={() => handleSaveField('seo_description')} className="btn btn-primary btn-sm">Save</button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {seoDesc}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                PRODUCT TAGS
              </span>
              {!showAddTag && (
                <button
                  onClick={() => setShowAddTag(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                >
                  <Plus size={11} />
                  <span>Add Tag</span>
                </button>
              )}
            </div>

            {/* Add Tag Inline Form */}
            {showAddTag && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter new tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none' }}
                />
                <button onClick={handleAddTag} className="btn btn-primary btn-sm">Add</button>
                <button onClick={() => setShowAddTag(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: 'var(--accent-gold-light)',
                    color: 'var(--accent-gold)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', padding: '0 2px' }}
                    title="Remove tag"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Commercial & Pricing Section */}
          {session?.pricing ? (
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--accent-gold)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  COMMERCIAL & FAIR PRICING
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--success-main)', fontWeight: 600 }}>
                  ✓ {session.pricing.desiredMarginPct || 35}% Margin
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SELLING PRICE</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    ₹{session.pricing.finalPrice || session.pricing.recommendedPrice}
                  </div>
                  {session.pricing.suggestedMin && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Range: ₹{session.pricing.suggestedMin} – ₹{session.pricing.suggestedMax}
                    </span>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BASE COST</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{session.pricing.baseCost}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--success-main)', fontWeight: 600 }}>
                    +₹{session.pricing.profitMarginAmount || 0} Profit
                  </span>
                </div>
              </div>

              {/* Cost Breakdown Pills */}
              <div style={{ display: 'flex', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '8px', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
                <span>Mat: ₹{session.pricing.materialCost}</span> • 
                <span>Wage: ₹{session.pricing.labourCost}</span> • 
                <span>Pack: ₹{session.pricing.packagingCost}</span> • 
                <span>Overhead: ₹{session.pricing.otherCost}</span>
              </div>

              {session.pricing.pricingStory && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>
                  "{session.pricing.pricingStory}"
                </p>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-app)', border: '1px border-subtle', padding: '14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Pricing Recommendation: Use Guided Pricing Wizard to calculate fair wage & selling price
              </span>
            </div>
          )}

        </div>
      )}

      {/* 5. Save Action */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={onSavePassport}
          disabled={isSaving || isSaved}
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            background: isSaved ? 'var(--success-main)' : 'var(--accent-gold)'
          }}
        >
          <span>{isSaving ? 'Saving Passport...' : isSaved ? '✓ Passport Saved' : 'Save Product Passport'}</span>
        </button>

        {hasContent && (
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleCopyJson} className="btn btn-secondary btn-sm">
              <Copy size={12} />
              <span>{copiedNotification ? '✓ JSON Copied!' : 'Copy JSON'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
