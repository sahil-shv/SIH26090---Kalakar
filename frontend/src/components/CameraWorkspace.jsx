import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCcw, ArrowRight, Check } from 'lucide-react';
import CameraPreview from './camera/CameraPreview';
import CaptureProgress from './camera/CaptureProgress';
import CaptureReview from './camera/CaptureReview';
import CameraError from './camera/CameraError';

const CAPTURE_STEPS = [
  {
    id: "front",
    type: "front",
    label: "Front",
    instruction: "Show the front of your product."
  },
  {
    id: "back",
    type: "back",
    label: "Back",
    instruction: "Now show the back of your product."
  },
  {
    id: "left",
    type: "left",
    label: "Left",
    instruction: "Now show the left side of your product."
  },
  {
    id: "right",
    type: "right",
    label: "Right",
    instruction: "Now show the right side of your product."
  },
  {
    id: "detail",
    type: "detail",
    label: "Detail",
    instruction: "Now move closer and show an important detail."
  }
];

export default function CameraWorkspace({
  onImagesCaptured
}) {
  // Workflow States: 'idle' | 'requesting_permission' | 'active' | 'capturing' | 'review' | 'completed' | 'error'
  const [cameraState, setCameraState] = useState('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedImagesMap, setCapturedImagesMap] = useState({});
  const [shutterFlash, setShutterFlash] = useState(false);
  const [btnScale, setBtnScale] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up media tracks on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraState('requesting_permission');
    setErrorMessage('');

    try {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false
        });
      } catch (e) {
        // Fallback to any video source
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setCameraState('active');

      // Bind to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);

    } catch (err) {
      console.error('Camera permission or access error:', err);
      setCameraState('error');
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera access was blocked. Please allow camera permissions in your browser settings and try again.'
          : 'Camera is currently unavailable on this device.'
      );
    }
  };

  const captureCurrentAngle = () => {
    if (cameraState !== 'active') return;

    // Button press animation (1 -> 0.96 -> 1)
    setBtnScale(0.96);
    setTimeout(() => setBtnScale(1), 120);

    // Shutter flash animation (150-250ms)
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    setCameraState('capturing');

    const currentStep = CAPTURE_STEPS[currentStepIndex];

    setTimeout(() => {
      let dataUrl = '';
      if (videoRef.current && videoRef.current.videoWidth) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      }

      const imageObject = {
        id: currentStep.id,
        type: currentStep.type,
        label: currentStep.label,
        dataUrl,
        capturedAt: new Date().toISOString(),
        status: 'captured'
      };

      const updatedMap = {
        ...capturedImagesMap,
        [currentStep.id]: imageObject
      };

      setCapturedImagesMap(updatedMap);

      // Check if all 5 angles captured
      const allCaptured = CAPTURE_STEPS.every(step => updatedMap[step.id]);

      if (allCaptured) {
        // Move to review mode
        setCameraState('review');
      } else {
        // Advance to next uncaptured angle
        const nextIndex = CAPTURE_STEPS.findIndex((step, idx) => idx > currentStepIndex && !updatedMap[step.id]);
        if (nextIndex !== -1) {
          setCurrentStepIndex(nextIndex);
        } else {
          // Fall back to next logical index
          setCurrentStepIndex((prev) => Math.min(prev + 1, CAPTURE_STEPS.length - 1));
        }
        setCameraState('active');
      }
    }, 220);
  };

  const handleRetakeStep = (stepId) => {
    const stepIdx = CAPTURE_STEPS.findIndex(s => s.id === stepId);
    if (stepIdx !== -1) {
      setCurrentStepIndex(stepIdx);
      setCameraState('active');

      // Reactivate camera stream if stopped
      if (!streamRef.current) {
        startCamera();
      }
    }
  };

  const handleContinueFromReview = () => {
    stopCameraStream();
    setCameraState('completed');

    // Return final 5 images collection to parent
    const imageList = CAPTURE_STEPS.map(step => capturedImagesMap[step.id]);
    if (onImagesCaptured) {
      onImagesCaptured(imageList, capturedImagesMap);
    }
  };

  const currentStep = CAPTURE_STEPS[currentStepIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Editorial Section Heading */}
      <div className="heading-section">CAPTURE YOUR PRODUCT</div>

      {/* 1. IDLE STATE */}
      {cameraState === 'idle' && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--text-secondary)'
          }}>
            <Camera size={22} />
          </div>

          <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Product Viewfinder
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Show your product to begin. Guided camera capture takes 5 angles for catalog generation.
          </p>

          <button onClick={startCamera} className="btn btn-primary btn-lg">
            <span>Start Camera</span>
          </button>
        </div>
      )}

      {/* 2. REQUESTING PERMISSION STATE */}
      {cameraState === 'requesting_permission' && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Starting camera...
          </span>
        </div>
      )}

      {/* 3. ERROR STATE */}
      {cameraState === 'error' && (
        <CameraError
          errorMsg={errorMessage}
          onRetry={startCamera}
        />
      )}

      {/* 4. ACTIVE & CAPTURING CAMERA STATES */}
      {(cameraState === 'active' || cameraState === 'capturing') && (
        <div>
          {/* Main Viewfinder Frame + Narrow Vertical Steps Indicator */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            backgroundColor: '#171717',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex'
          }}>
            {/* Live Video Preview */}
            <CameraPreview
              videoRef={videoRef}
              isCapturing={cameraState === 'capturing'}
              shutterFlash={shutterFlash}
              activeInstruction={currentStep.instruction}
            />

            {/* Vertical Steps Indicator */}
            <CaptureProgress
              steps={CAPTURE_STEPS}
              currentStepIndex={currentStepIndex}
              capturedImagesMap={capturedImagesMap}
              onSelectStep={(idx) => {
                setCurrentStepIndex(idx);
              }}
            />
          </div>

          {/* Camera Controls Below Viewfinder */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}>
            {/* Retake Action */}
            <button
              onClick={() => handleRetakeStep(currentStep.id)}
              disabled={!capturedImagesMap[currentStep.id]}
              className="btn btn-secondary btn-sm"
              style={{ opacity: capturedImagesMap[currentStep.id] ? 1 : 0.5 }}
            >
              <RotateCcw size={12} />
              <span>Retake</span>
            </button>

            {/* Physical Gold Ring Capture Button */}
            <button
              onClick={captureCurrentAngle}
              className="capture-btn-outer"
              style={{ transform: `scale(${btnScale})` }}
              title={`Capture ${currentStep.label}`}
            >
              <div className="capture-btn-inner" />
            </button>

            {/* Step Count Feedback */}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Step {currentStepIndex + 1} of 5
            </span>
          </div>
        </div>
      )}

      {/* 5. CAMERA REVIEW STATE */}
      {cameraState === 'review' && (
        <CaptureReview
          steps={CAPTURE_STEPS}
          capturedImagesMap={capturedImagesMap}
          onRetakeStep={handleRetakeStep}
          onContinue={handleContinueFromReview}
        />
      )}

      {/* 6. COMPLETED STATE */}
      {cameraState === 'completed' && (
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              color: 'var(--success-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={14} />
            </div>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>
                Product Photos Captured
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                All 5 product views captured successfully.
              </span>
            </div>
          </div>

          <button
            onClick={() => setCameraState('review')}
            className="btn btn-secondary btn-sm"
          >
            <span>Review Photos</span>
          </button>
        </div>
      )}

    </div>
  );
}
