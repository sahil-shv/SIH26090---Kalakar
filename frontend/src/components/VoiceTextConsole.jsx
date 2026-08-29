import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Square, Edit2, Check, RotateCcw } from 'lucide-react';

export default function VoiceTextConsole({
  defaultTranscript = '',
  onConfirmVoiceText,
  isDisabled = false,
  isGenerating = false
}) {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        if (currentText) {
          setTranscript(currentText);
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  // Timer effect during recording
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = () => {
    if (isDisabled || isGenerating) return;
    setIsRecording(true);
    setTranscript('');

    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (!transcript) {
      setTranscript(defaultTranscript || 'Ye basket natural bamboo se bana hai aur isme 2 handles hain. 2 din lagte hain banane mein.');
    }
  };

  const handleSendText = () => {
    if (!textInput.trim() || isDisabled || isGenerating) return;
    const val = textInput.trim();
    setTranscript(val);
    setTextInput('');
  };

  const handleConfirmTranscript = () => {
    if (!transcript.trim() || isDisabled || isGenerating) return;
    onConfirmVoiceText(transcript.trim());
  };

  const handleResetInput = () => {
    setTranscript('');
    setIsEditingTranscript(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* Editorial Section Heading */}
      <div className="heading-section">TELL US ABOUT YOUR PRODUCT</div>

      {isRecording ? (
        /* 1. RECORDING STATE */
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              animation: 'pulse 1.2s infinite'
            }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
              Listening...
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {formatTimer(recordSeconds)}
            </span>
          </div>

          <button onClick={stopRecording} className="btn btn-secondary btn-sm">
            <Square size={12} />
            <span>Stop</span>
          </button>
        </div>
      ) : transcript ? (
        /* 2. TRANSCRIPT REVIEW & EDIT STATE */
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ARTISAN STATEMENT
            </span>
            <button
              onClick={handleResetInput}
              disabled={isGenerating}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '2px 6px' }}
              title="Clear & restart input"
            >
              <RotateCcw size={11} />
              <span>Clear</span>
            </button>
          </div>

          {!isEditingTranscript ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '14px', lineHeight: '1.5' }}>
              "{transcript}"
            </p>
          ) : (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.875rem',
                marginBottom: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
            {!isEditingTranscript ? (
              <button
                onClick={() => setIsEditingTranscript(true)}
                disabled={isGenerating}
                className="btn btn-secondary btn-sm"
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingTranscript(false)}
                className="btn btn-secondary btn-sm"
              >
                <span>Done Editing</span>
              </button>
            )}

            <button
              onClick={handleConfirmTranscript}
              disabled={!transcript.trim() || isDisabled || isGenerating}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 14px' }}
            >
              {isGenerating ? (
                <span>Generating Content...</span>
              ) : (
                <>
                  <Check size={13} />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* 3. DEFAULT UNIFIED INPUT STATE (Text input + inner Mic) */
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Tell us about your product..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                disabled={isDisabled || isGenerating}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
              />

              {/* Mic Button inside input */}
              <button
                onClick={startRecording}
                disabled={isDisabled || isGenerating}
                title="Speak in Hindi, English or Hinglish"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--accent-gold)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Mic size={18} />
              </button>
            </div>

            {/* Send Button next to input */}
            <button
              onClick={handleSendText}
              disabled={!textInput.trim() || isDisabled || isGenerating}
              className="btn btn-primary"
              style={{ padding: '12px 16px' }}
            >
              <Send size={16} />
            </button>
          </div>

          {/* Supporting hint */}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            You can type or speak in Hindi, English or Hinglish
          </span>
        </div>
      )}

    </div>
  );
}
