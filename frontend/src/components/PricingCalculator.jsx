import React, { useState, useMemo } from 'react';
import { Sliders, Check, ChevronRight, ChevronLeft, DollarSign, Sparkles, HelpCircle, ShieldCheck, RefreshCw } from 'lucide-react';

export default function PricingCalculator({
  pricingData,
  productTitle = 'Handcrafted Artisan Product',
  onUpdatePricing,
  isDisabled = false
}) {
  // Mode: 'summary' | 'wizard'
  const [activeMode, setActiveMode] = useState('summary');
  const [wizardStep, setWizardStep] = useState(1);

  // Form State
  const [materialCost, setMaterialCost] = useState(pricingData?.materialCost ?? 250);
  const [materialCategory, setMaterialCategory] = useState(pricingData?.materialCategory || 'bamboo');
  const [sourcingMode, setSourcingMode] = useState(pricingData?.sourcingMode || 'bulk');

  const [labourMode, setLabourMode] = useState(pricingData?.labourMode || 'days');
  const [labourValue, setLabourValue] = useState(pricingData?.labourValue ?? 2);
  const [dailyRate, setDailyRate] = useState(pricingData?.dailyRate ?? 350);

  const [packagingCost, setPackagingCost] = useState(pricingData?.packagingCost ?? 30);
  const [otherCost, setOtherCost] = useState(pricingData?.otherCost ?? 20);

  const [desiredMarginPct, setDesiredMarginPct] = useState(pricingData?.desiredMarginPct ?? 35);
  const [customPriceOverride, setCustomPriceOverride] = useState(pricingData?.finalPrice || null);

  // Calculated Labour Cost
  const calculatedLabourCost = useMemo(() => {
    if (labourMode === 'days') {
      return Math.round(Number(labourValue) * Number(dailyRate));
    } else {
      // Hours mode (8 hours = 1 day)
      return Math.round((Number(labourValue) / 8) * Number(dailyRate));
    }
  }, [labourMode, labourValue, dailyRate]);

  // Total Base Cost
  const baseCost = useMemo(() => {
    return Number(materialCost) + Number(calculatedLabourCost) + Number(packagingCost) + Number(otherCost);
  }, [materialCost, calculatedLabourCost, packagingCost, otherCost]);

  // Recommended Price
  const marginDecimal = desiredMarginPct / 100;
  const calculatedPrice = Math.round(baseCost / (1 - marginDecimal));
  const finalRecommendedPrice = customPriceOverride !== null ? Number(customPriceOverride) : calculatedPrice;
  const profitMarginAmount = Math.max(0, finalRecommendedPrice - baseCost);

  const suggestedMin = Math.round(finalRecommendedPrice * 0.9);
  const suggestedMax = Math.round(finalRecommendedPrice * 1.1);

  // AI Pricing Story Generator
  const pricingStory = useMemo(() => {
    let text = `This fair-trade price of ₹${finalRecommendedPrice} represents authentic artisan valuation for ${productTitle}. `;
    if (labourMode === 'days') {
      text += `It compensates ${labourValue} day(s) of skilled handcrafting at ₹${dailyRate}/day fair artisan wage (₹${calculatedLabourCost} total labour). `;
    } else {
      text += `It accounts for ${labourValue} hour(s) of manual craftsmanship (₹${calculatedLabourCost} fair wage). `;
    }
    text += `Raw materials add ₹${materialCost}, while protective packaging & logistics require ₹${Number(packagingCost) + Number(otherCost)}. `;
    text += `The ${desiredMarginPct}% margin (₹${profitMarginAmount} net profit) sustains artisan craft heritage.`;
    return text;
  }, [productTitle, finalRecommendedPrice, labourMode, labourValue, dailyRate, calculatedLabourCost, materialCost, packagingCost, otherCost, desiredMarginPct, profitMarginAmount]);

  const handleApplyPricing = () => {
    onUpdatePricing({
      materialCost: Number(materialCost),
      materialCategory,
      sourcingMode,
      labourMode,
      labourValue: Number(labourValue),
      dailyRate: Number(dailyRate),
      labourCost: calculatedLabourCost,
      packagingCost: Number(packagingCost),
      otherCost: Number(otherCost),
      baseCost,
      desiredMarginPct: Number(desiredMarginPct),
      recommendedPrice: calculatedPrice,
      finalPrice: finalRecommendedPrice,
      suggestedMin,
      suggestedMax,
      profitMarginAmount,
      pricingStory
    });
    setActiveMode('summary');
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            PHASE 7 — ARTISAN COMMERCIAL LAYER
          </div>
          <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0' }}>
            Guided Dynamic Pricing Engine
          </h3>
        </div>

        {activeMode === 'summary' ? (
          <button
            onClick={() => { setActiveMode('wizard'); setWizardStep(1); }}
            disabled={isDisabled}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={13} />
            <span>Open Guided Pricing Wizard</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveMode('summary')}
            className="btn btn-secondary btn-sm"
          >
            Close Wizard
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SUMMARY / PRODUCT PASSPORT PREVIEW VIEW                          */}
      {/* ========================================================================= */}
      {activeMode === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Price Recommendation Display Box */}
          <div style={{
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                RECOMMENDED SELLING PRICE
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)', lineHeight: 1.2 }}>
                ₹{finalRecommendedPrice}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Suggested Fair Range: <strong>₹{suggestedMin} – ₹{suggestedMax}</strong>
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TOTAL BASE COST
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹{baseCost}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--success-main)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                +₹{profitMarginAmount} Profit ({desiredMarginPct}% Margin)
              </span>
            </div>
          </div>

          {/* Visual Cost & Margin Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              <span>Base Cost (₹{baseCost})</span>
              <span>Net Profit (₹{profitMarginAmount})</span>
            </div>
            <div style={{ height: '10px', width: '100%', borderRadius: '5px', overflow: 'hidden', display: 'flex', background: 'var(--border-subtle)' }}>
              <div style={{ width: `${(baseCost / finalRecommendedPrice) * 100}%`, background: 'var(--accent-gold-dark, #8a6a24)' }} title={`Base Cost: ₹${baseCost}`} />
              <div style={{ width: `${(profitMarginAmount / finalRecommendedPrice) * 100}%`, background: 'var(--success-main)' }} title={`Net Profit: ₹${profitMarginAmount}`} />
            </div>
          </div>

          {/* Cost Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>MATERIALS</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>₹{materialCost}</strong>
            </div>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>ARTISAN LABOUR</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>₹{calculatedLabourCost}</strong>
            </div>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>PACKAGING</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>₹{packagingCost}</strong>
            </div>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>OVERHEAD/OTHER</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>₹{otherCost}</strong>
            </div>
          </div>

          {/* AI Fair Pricing Story Narrative */}
          <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '6px' }}>
              <Sparkles size={14} />
              <span>AI FAIR TRADE PRICING STORY</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>
              {pricingStory}
            </p>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success-main)' }}>
              <ShieldCheck size={14} />
              <span>Fair Living Wage & Craft Sustainability Certified</span>
            </div>

            <button
              onClick={() => { setActiveMode('wizard'); setWizardStep(1); }}
              disabled={isDisabled}
              className="btn btn-primary btn-sm"
            >
              <Sliders size={12} />
              <span>Customize Cost Inputs</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: GUIDED MULTI-QUESTION WIZARD                                      */}
      {/* ========================================================================= */}
      {activeMode === 'wizard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Step Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                onClick={() => setWizardStep(stepNum)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderBottom: wizardStep === stepNum ? '3px solid var(--accent-gold)' : wizardStep > stepNum ? '3px solid var(--success-main)' : '3px solid var(--border-subtle)',
                  color: wizardStep === stepNum ? 'var(--accent-gold)' : wizardStep > stepNum ? 'var(--success-main)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Q{stepNum}: {stepNum === 1 ? 'Materials' : stepNum === 2 ? 'Labour' : stepNum === 3 ? 'Logistics' : stepNum === 4 ? 'Margin' : 'Summary'}
              </div>
            ))}
          </div>

          {/* QUESTION 1: RAW MATERIALS */}
          {wizardStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-app)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                QUESTION 1: What raw materials were used to create this piece and what did they cost?
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Material Category
                  </label>
                  <select
                    value={materialCategory}
                    onChange={(e) => setMaterialCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="bamboo">Bamboo / Natural Wood</option>
                    <option value="textile">Cotton / Handloom Thread</option>
                    <option value="clay">Clay / Pottery / Terracotta</option>
                    <option value="metal">Brass / Copper / Metal</option>
                    <option value="leather">Leather / Jute</option>
                    <option value="other">Other Natural Material</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Total Material Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
                    placeholder="e.g. 250"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Material Sourcing Method
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSourcingMode('bulk')}
                    className={`btn btn-sm ${sourcingMode === 'bulk' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Bulk Sourcing (Cheaper per piece)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourcingMode('single')}
                    className={`btn btn-sm ${sourcingMode === 'single' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Purchased Per Item Retail
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 2: ARTISAN LABOUR & TIME */}
          {wizardStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-app)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                QUESTION 2: How much time and craft effort went into making this single product?
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={() => setLabourMode('days')}
                  className={`btn btn-sm ${labourMode === 'days' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Measure in Days
                </button>
                <button
                  type="button"
                  onClick={() => setLabourMode('hours')}
                  className={`btn btn-sm ${labourMode === 'hours' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Measure in Hours
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {labourMode === 'days' ? 'Days Spent Crafting' : 'Hours Spent Crafting'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={labourValue}
                    onChange={(e) => setLabourValue(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Target Fair Daily Wage (₹/day)
                  </label>
                  <input
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    placeholder="e.g. 350"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Calculated Fair Artisan Wage:</span>
                <strong style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>₹{calculatedLabourCost}</strong>
              </div>
            </div>
          )}

          {/* QUESTION 3: PACKAGING & LOGISTICS */}
          {wizardStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-app)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                QUESTION 3: What are your packaging, finishing, and transportation costs per item?
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Protective Box / Cloth Wrap (₹)
                  </label>
                  <input
                    type="number"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(e.target.value)}
                    placeholder="e.g. 30"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Freight / Transport / Stall Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={otherCost}
                    onChange={(e) => setOtherCost(e.target.value)}
                    placeholder="e.g. 20"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 4: MARGIN & SALES CHANNEL PRESETS */}
          {wizardStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-app)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                QUESTION 4: What is your sales channel and target profit margin?
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setDesiredMarginPct(25)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: desiredMarginPct === 25 ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: desiredMarginPct === 25 ? 'rgba(212,175,55,0.1)' : 'var(--bg-card)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Local Community Fair Trade (25% Margin)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Best for direct local sales & community haats</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDesiredMarginPct(35)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: desiredMarginPct === 35 ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: desiredMarginPct === 35 ? 'rgba(212,175,55,0.1)' : 'var(--bg-card)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-gold)' }}>★ Sustainable E-Commerce & Craft Exhibition (35% Margin - Recommended)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Balances fair customer price with sustainable workshop reinvestment</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDesiredMarginPct(50)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: desiredMarginPct === 50 ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: desiredMarginPct === 50 ? 'rgba(212,175,55,0.1)' : 'var(--bg-card)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Luxury Gallery & Premium Export (50% Margin)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Targeting high-end boutiques and international craft collectors</div>
                </button>
              </div>

              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Custom Margin Adjustment:</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{desiredMarginPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  step="5"
                  value={desiredMarginPct}
                  onChange={(e) => setDesiredMarginPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>
            </div>
          )}

          {/* QUESTION 5: REVIEW & SUMMARY */}
          {wizardStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-app)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                SUMMARY & FAIR PRICE RECOMMENDATION
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-gold)' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECOMMENDED FAIR PRICE</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>₹{finalRecommendedPrice}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Range: ₹{suggestedMin} – ₹{suggestedMax}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL BASE COST</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹{baseCost}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success-main)', fontWeight: 600 }}>₹{profitMarginAmount} Net Profit ({desiredMarginPct}%)</span>
                </div>
              </div>

              <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '4px' }}>AI FAIR PRICING STORY</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>{pricingStory}</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
            <button
              onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
              disabled={wizardStep === 1}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ChevronLeft size={14} />
              <span>Back</span>
            </button>

            {wizardStep < 5 ? (
              <button
                onClick={() => setWizardStep(prev => Math.min(5, prev + 1))}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Next Question</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleApplyPricing}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--success-main)' }}
              >
                <Check size={14} />
                <span>Save to Product Passport</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
