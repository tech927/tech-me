// src/pages/Bot.js
import React, { useState } from 'react';
import '../styles/pages.css';

const Bot = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPairingCode('');
    setShowCode(false);

    // Format the phone number
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const response = await fetch('https://mini-inconnu-08d65344eadf.herokuapp.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Generate a random 6-digit pairing code
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        setPairingCode(generatedCode);
        setShowCode(true);
        setPhoneNumber('');
      } else {
        setError(data.message || 'Failed to generate pairing code. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and +
    if (value === '' || /^\+?[0-9]*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairingCode);
    alert('Pairing code copied to clipboard!');
  };

  return (
    <div className="page bot-page">
      <div className="container">
        <div className="bot-header">
          <h1 className="page-title">Connect Your Bot</h1>
          <p className="page-subtitle">
            Get your pairing code to connect Queen Akuma to WhatsApp
          </p>
        </div>

        <div className="bot-content">
          <div className="bot-card">
            <div className="card-header">
              <div className="card-icon">
                <WhatsAppIcon />
              </div>
              <h2>Get Pairing Code</h2>
              <p>Enter your phone number to generate pairing code</p>
            </div>

            <form className="bot-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="phoneNumber">WhatsApp Number</label>
                <div className="input-with-prefix">
                  <span className="prefix">+</span>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber.replace('+', '')}
                    onChange={handlePhoneNumberChange}
                    placeholder="50934171810"
                    required
                    pattern="[0-9]+"
                    title="Please enter only numbers"
                    minLength="10"
                    maxLength="15"
                  />
                </div>
                <small className="input-hint">
                  Enter your WhatsApp number with country code (example: +50934171810)
                </small>
              </div>

              {error && (
                <div className="alert alert-error">
                  <ErrorIcon />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || phoneNumber.length < 10}
              >
                {loading ? (
                  <>
                    <LoadingIcon />
                    Generating Code...
                  </>
                ) : (
                  <>
                    <KeyIcon />
                    Generate Pairing Code
                  </
                )}
              </button>
            </form>

            {showCode && pairingCode && (
              <div className="pairing-code-section">
                <div className="code-header">
                  <SuccessIcon />
                  <h3>Your Pairing Code is Ready!</h3>
                </div>
                
                <div className="pairing-code-display">
                  <div className="code-value">{pairingCode}</div>
                  <button 
                    onClick={copyToClipboard}
                    className="btn btn-secondary copy-btn"
                  >
                    <CopyIcon />
                    Copy Code
                  </button>
                </div>

                <div className="instructions">
                  <h4>How to use this code:</h4>
                  <ol>
                    <li>Open WhatsApp on your phone</li>
                    <li>Go to Settings → Linked Devices</li>
                    <li>Tap on "Link a Device"</li>
                    <li>Enter this pairing code when prompted</li>
                    <li>Queen Akuma bot will be connected automatically</li>
                  </ol>
                </div>
              </div>
            )}

            <div className="bot-info">
              <div className="info-section">
                <h3>How it works:</h3>
                <ol className="steps-list">
                  <li>
                    <NumberIcon number="1" />
                    <span>Enter your WhatsApp number</span>
                  </li>
                  <li>
                    <NumberIcon number="2" />
                    <span>Generate pairing code</span>
                  </li>
                  <li>
                    <NumberIcon number="3" />
                    <span>Copy the code displayed above</span>
                  </li>
                  <li>
                    <NumberIcon number="4" />
                    <span>Use the code in WhatsApp to connect</span>
                  </li>
                </ol>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <SecurityIcon />
                  <h4>Secure Connection</h4>
                  <p>Your number is only used for verification</p>
                </div>
                <div className="info-card">
                  <InstantIcon />
                  <h4>Instant Code</h4>
                  <p>Get pairing code immediately</p>
                </div>
                <div className="info-card">
                  <SupportIcon />
                  <h4>Need Help?</h4>
                  <p>Contact support if you have issues</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG Icons
const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 2l-2 2-1.5-1.5-2 2L17 6l-2 2-2-2-4 4 2 2-6 6 2 2 6-6 2 2 2-2 4-4-2-2 1.5-1.5 2-2L21 2zm-10 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

const LoadingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="loading-spinner">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

const NumberIcon = ({ number }) => (
  <div className="number-icon">{number}</div>
);

const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
  </svg>
);

const InstantIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const SupportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

export default Bot;
