import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CameraWorkspace from './components/CameraWorkspace';
import AiStatusConsole from './components/AiStatusConsole';
import VoiceTextConsole from './components/VoiceTextConsole';
import PhotoshootGallery from './components/PhotoshootGallery';
import PricingCalculator from './components/PricingCalculator';
import ProductPassportPanel from './components/ProductPassportPanel';
import { analyzeProductPhotos, generateProductListing, generatePhotoshootPrompts, generateProductImage } from './services/aiPipeline';

export default function App() {
  const [capturedImages, setCapturedImages] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Phase 3: Analysis state
  const [analysisState, setAnalysisState] = useState('idle'); // idle | analyzing | done | error
  const [productProfile, setProductProfile] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Phase 4: Artisan input + Product Content state
  const [artisanInput, setArtisanInput] = useState('');
  const [contentState, setContentState] = useState('idle'); // idle | generating | done | error
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentError, setContentError] = useState(null);

  // Phase 5: Photoshoot Prompt Engine state (Prompts ONLY)
  const [photoshootState, setPhotoshootState] = useState('idle'); // idle | planning | done | error | stale
  const [photoshootPlan, setPhotoshootPlan] = useState(null);
  const [photoshootError, setPhotoshootError] = useState(null);

  // Phase 6: Real AI Product Photoshoot with Nano Banana (Imagen 3)
  const [generatedPhotos, setGeneratedPhotos] = useState({
    hero: { status: 'idle', dataUrl: null, error: null },
    lifestyle: { status: 'idle', dataUrl: null, error: null },
    detail: { status: 'idle', dataUrl: null, error: null },
    context: { status: 'idle', dataUrl: null, error: null }
  });

  // Phase 7: Dynamic Pricing state
  const [pricingData, setPricingData] = useState(null);

  // Phase 2 Capture Handler → triggers Phase 3 analysis automatically
  const handleImagesCaptured = useCallback(async (imageList, imagesMap) => {
    const images = imagesMap || imageList;
    setCapturedImages(images);

    // Automatically start Gemini visual analysis
    setAnalysisState('analyzing');
    setProductProfile(null);
    setAnalysisError(null);

    try {
      const imageArray = Array.isArray(images)
        ? images
        : Object.values(images);

      const result = await analyzeProductPhotos(imageArray);
      setProductProfile(result.profile);
      setAnalysisState('done');
    } catch (err) {
      console.error('Product analysis failed:', err);
      setAnalysisError(err.message || 'Analysis failed. Please try again.');
      setAnalysisState('error');
    }
  }, []);

  // Retry visual analysis
  const handleRetryAnalysis = useCallback(async () => {
    if (!capturedImages) return;

    setAnalysisState('analyzing');
    setAnalysisError(null);

    try {
      const imageArray = Array.isArray(capturedImages)
        ? capturedImages
        : Object.values(capturedImages);

      const result = await analyzeProductPhotos(imageArray);
      setProductProfile(result.profile);
      setAnalysisState('done');
    } catch (err) {
      console.error('Retry analysis failed:', err);
      setAnalysisError(err.message || 'Analysis failed. Please try again.');
      setAnalysisState('error');
    }
  }, [capturedImages]);

  // Helper to map captured photo view to mockup shot type
  const resolveOriginalPhoto = useCallback((imageType) => {
    if (!capturedImages) return null;

    if (Array.isArray(capturedImages)) {
      if (imageType === 'detail' && capturedImages[4]) return capturedImages[4].dataUrl || capturedImages[4];
      if (imageType === 'context' && capturedImages[3]) return capturedImages[3].dataUrl || capturedImages[3];
      if (imageType === 'lifestyle' && capturedImages[2]) return capturedImages[2].dataUrl || capturedImages[2];
      return capturedImages[0]?.dataUrl || capturedImages[0] || null;
    }

    if (typeof capturedImages === 'object') {
      if (imageType === 'detail' && capturedImages.detail) return capturedImages.detail.dataUrl || capturedImages.detail;
      if (imageType === 'context' && capturedImages.right) return capturedImages.right.dataUrl || capturedImages.right;
      if (imageType === 'lifestyle' && capturedImages.left) return capturedImages.left.dataUrl || capturedImages.left;
      if (capturedImages.front) return capturedImages.front.dataUrl || capturedImages.front;
      const firstVal = Object.values(capturedImages)[0];
      return firstVal?.dataUrl || firstVal || null;
    }

    return null;
  }, [capturedImages]);

  // Phase 6: Single Image Editing & Mockup Handler
  const handleGenerateSinglePhoto = useCallback(async (imageType, customPlan) => {
    const activePlan = customPlan || photoshootPlan;
    if (!activePlan || !activePlan[imageType]?.prompt) return;

    const sourceImage = resolveOriginalPhoto(imageType);

    setGeneratedPhotos(prev => ({
      ...prev,
      [imageType]: { status: 'generating', dataUrl: prev[imageType]?.dataUrl || null, error: null }
    }));

    try {
      const result = await generateProductImage({
        imageType,
        promptText: activePlan[imageType].prompt,
        originalImages: capturedImages,
        originalImage: sourceImage
      });

      setGeneratedPhotos(prev => ({
        ...prev,
        [imageType]: {
          status: 'completed',
          dataUrl: result.image.dataUrl,
          error: null,
          generatedAt: result.image.generatedAt,
          source: result.image.source,
          originalImage: sourceImage
        }
      }));
    } catch (err) {
      console.error(`Image editing/generation failed for '${imageType}':`, err);
      setGeneratedPhotos(prev => ({
        ...prev,
        [imageType]: {
          status: 'failed',
          dataUrl: prev[imageType]?.dataUrl || null,
          error: err.message || `Failed to generate ${imageType} image.`
        }
      }));
    }
  }, [photoshootPlan, resolveOriginalPhoto]);

  // Phase 6: Generate All 4 Images Sequentially (Hero -> Lifestyle -> Detail -> Context)
  const handleGenerateAllPhotos = useCallback(async (planToUse) => {
    const activePlan = planToUse || photoshootPlan;
    if (!activePlan) return;

    const shotTypes = ['hero', 'lifestyle', 'detail', 'context'];
    for (const type of shotTypes) {
      if (activePlan[type]?.prompt) {
        await handleGenerateSinglePhoto(type, activePlan);
      }
    }
  }, [photoshootPlan, handleGenerateSinglePhoto]);

  // Phase 5 Photoshoot Prompt Generation Helper → Automatically triggers Image Generation
  const handlePlanPhotoshoot = useCallback(async (prof, input, cont) => {
    setPhotoshootState('planning');
    setPhotoshootError(null);

    try {
      const result = await generatePhotoshootPrompts({
        profile: prof || productProfile || {},
        artisanInput: input || artisanInput || '',
        content: cont || generatedContent || {}
      });

      const plan = result.photoshoot || result;
      setPhotoshootPlan(plan);
      setPhotoshootState('done');

      // AUTOMATIC: Trigger sequential mockup image generation immediately once plan is ready!
      console.log('Photoshoot plan generated. Automatically launching 4 mockup image generations...');
      handleGenerateAllPhotos(plan);

    } catch (err) {
      console.error('Photoshoot planning failed:', err);
      setPhotoshootError(err.message || 'Failed to plan photoshoot prompts.');
      setPhotoshootState('error');
    }
  }, [productProfile, artisanInput, generatedContent, handleGenerateAllPhotos]);

  // Phase 4: Artisan Statement Submit Handler → triggers Content Generation & Phase 5 Automatic Pipeline
  const handleConfirmVoiceText = useCallback(async (statementText) => {
    if (!statementText || !statementText.trim()) return;

    const trimmedStatement = statementText.trim();
    setArtisanInput(trimmedStatement);

    setContentState('generating');
    setContentError(null);

    try {
      const result = await generateProductListing({
        profile: productProfile || {},
        artisanInput: trimmedStatement
      });

      setGeneratedContent(result.content);
      setContentState('done');

      // AUTOMATIC: Trigger Phase 5 Mockup Planning & Image Generation
      handlePlanPhotoshoot(productProfile, trimmedStatement, result.content);

    } catch (err) {
      console.error('Content generation failed:', err);
      setContentError(err.message || 'Failed to generate product content. Please try again.');
      setContentState('error');
    }
  }, [productProfile, handlePlanPhotoshoot]);

  // Phase 4: Retry Content Generation Handler
  const handleRetryContent = useCallback(async () => {
    if (!artisanInput) return;

    setContentState('generating');
    setContentError(null);

    try {
      const result = await generateProductListing({
        profile: productProfile || {},
        artisanInput
      });

      setGeneratedContent(result.content);
      setContentState('done');

      // Re-trigger automatic mockup planning & image generation
      handlePlanPhotoshoot(productProfile, artisanInput, result.content);

    } catch (err) {
      console.error('Retry content generation failed:', err);
      setContentError(err.message || 'Failed to generate product content. Please try again.');
      setContentState('error');
    }
  }, [productProfile, artisanInput, handlePlanPhotoshoot]);

  // Inline field editing handler for ProductPassportPanel
  const handleUpdateField = useCallback((fieldKey, newValue) => {
    setGeneratedContent(prev => {
      if (!prev) return { [fieldKey]: newValue };
      return {
        ...prev,
        [fieldKey]: newValue
      };
    });
  }, []);

  // Inline profile editing handler for AiStatusConsole
  const handleUpdateProfile = useCallback((updatedProfile) => {
    setProductProfile(prev => ({
      ...prev,
      ...updatedProfile,
      source: 'user_correction'
    }));

    // Mark photoshoot plan as stale if attributes changed
    if (photoshootState === 'done') {
      setPhotoshootState('stale');
    }
  }, [photoshootState]);

  // Phase 7: Pricing Update Handler
  const handleUpdatePricing = useCallback((newPricing) => {
    setPricingData(newPricing);
  }, []);

  // Reset Session Handler
  const handleResetSession = () => {
    setCapturedImages(null);
    setIsSaved(false);
    setAnalysisState('idle');
    setProductProfile(null);
    setAnalysisError(null);
    setArtisanInput('');
    setContentState('idle');
    setGeneratedContent(null);
    setContentError(null);
    setPhotoshootState('idle');
    setPhotoshootPlan(null);
    setPhotoshootError(null);
    setGeneratedPhotos({
      hero: { status: 'idle', dataUrl: null, error: null },
      lifestyle: { status: 'idle', dataUrl: null, error: null },
      detail: { status: 'idle', dataUrl: null, error: null },
      context: { status: 'idle', dataUrl: null, error: null }
    });
    setPricingData(null);
  };

  const currentPassportSession = {
    capturedImages,
    analysis: productProfile,
    artisanInput,
    content: generatedContent,
    photoshootPlan,
    generatedPhotos,
    pricing: pricingData,
    isSaved
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        isSaving={isSaving}
        isSaved={isSaved}
        onResetSession={handleResetSession}
      />

      {/* Main Split Studio Workspace */}
      <main className="studio-main">
        
        {/* Left Column: Creation Area */}
        <div className="creation-workspace">
          
          {/* 1. Camera Workspace (Phase 2 Real Camera) */}
          <CameraWorkspace
            onImagesCaptured={handleImagesCaptured}
          />

          {/* 2. AI Workflow Status Console */}
          <AiStatusConsole
            hasCapturedImages={!!capturedImages}
            analysisState={analysisState}
            analysisError={analysisError}
            productProfile={productProfile}
            artisanInput={artisanInput}
            contentState={contentState}
            contentError={contentError}
            photoshootState={photoshootState}
            photoshootError={photoshootError}
            generatedPhotos={generatedPhotos}
            onUpdateProfile={handleUpdateProfile}
            onRetryContent={handleRetryContent}
            onRetryAnalysis={handleRetryAnalysis}
            onRetryPhotoshoot={() => handlePlanPhotoshoot(productProfile, artisanInput, generatedContent)}
          />

          {/* 3. Voice & Text Console (Phase 4 Artisan Input) */}
          {capturedImages && (
            <VoiceTextConsole
              onConfirmVoiceText={handleConfirmVoiceText}
              isDisabled={contentState === 'generating' || photoshootState === 'planning'}
              isGenerating={contentState === 'generating' || photoshootState === 'planning'}
            />
          )}

          {/* 4. Photoshoot Prompt Plan & Image Generation Gallery (Phase 5 & 6) */}
          {(photoshootState === 'planning' || photoshootState === 'done' || photoshootState === 'stale') && (
            <PhotoshootGallery
              photoshootState={photoshootState}
              photoshootPlan={photoshootPlan}
              generatedPhotos={generatedPhotos}
              onGenerateAllPhotos={handleGenerateAllPhotos}
              onGenerateSinglePhoto={handleGenerateSinglePhoto}
              onRegeneratePlan={() => handlePlanPhotoshoot(productProfile, artisanInput, generatedContent)}
              isDisabled={photoshootState === 'planning'}
            />
          )}

          {/* 5. Guided Multi-Question Pricing Engine (Phase 7) */}
          {capturedImages && (
            <PricingCalculator
              pricingData={pricingData}
              productTitle={generatedContent?.title || productProfile?.product_type || 'Handcrafted Artisan Product'}
              onUpdatePricing={handleUpdatePricing}
            />
          )}

        </div>

        {/* Right Column: Live Product Passport */}
        <ProductPassportPanel
          session={currentPassportSession}
          onUpdateField={handleUpdateField}
          onSavePassport={() => {
            setIsSaving(true);
            setTimeout(() => {
              setIsSaving(false);
              setIsSaved(true);
            }, 500);
          }}
          isSaving={isSaving}
        />

      </main>
    </div>
  );
}
