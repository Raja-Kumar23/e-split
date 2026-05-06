/**
 * Bottom Navigation Component.
 * Provides mobile-friendly tab switching and integrates an interactive QR scanner modal.
 */
'use client';
import { useState } from 'react';

export default function BottomNav({ activePage, onNav }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const tabs = [
    { id: 'dashboard', icon: '', label: 'Dashboard' },
    { id: 'esplit',    icon: '', label: 'E-Split' },
    { id: 'connections', icon: '', label: 'People' },
    { id: 'gifts',     icon: '', label: 'Gifts' },
  ];

  const handleScanDemo = () => {
    setScanning(true);
    setScanned(false);
    setScanResult(null);

    // Add a short delay to simulate scanning
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setScanResult({
        merchant: 'College Canteen',
        amount: '450.00',
        method: 'eSewa',
        ref: 'TXN' + Math.floor(100000 + Math.random() * 900000),
      });
    }, 2000);
  };

  // Reset scanner state when payment is confirmed
  const handleConfirmPayment = () => {
    setShowScanner(false);
    setScanned(false);
    setScanResult(null);
  };

  return (
    <>
      {/* ── BOTTOM NAV BAR ── */}
      <div className="bottom-nav">
        {/* Left two tabs */}
        {tabs.slice(0, 2).map(t => (
          <button
            key={t.id}
            className={`bottom-nav-tab${activePage === t.id ? ' active' : ''}`}
            onClick={() => onNav(t.id)}
          >
            <span className="bottom-nav-icon">{t.icon}</span>
            <span className="bottom-nav-label">{t.label}</span>
          </button>
        ))}

        {/* Center scanner button */}
        <div className="bottom-nav-scanner-wrap">
          <button className="bottom-nav-scanner-btn" onClick={() => setShowScanner(true)}>
            <span className="scanner-btn-icon">
              {/* QR scan icon */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M21 14v2"/>
              </svg>
            </span>
            <span className="bottom-nav-label" style={{ color: '#fff', marginTop: 2 }}>Scan</span>
          </button>
        </div>

        {/* Right two tabs */}
        {tabs.slice(2).map(t => (
          <button
            key={t.id}
            className={`bottom-nav-tab${activePage === t.id ? ' active' : ''}`}
            onClick={() => onNav(t.id)}
          >
            <span className="bottom-nav-icon">{t.icon}</span>
            <span className="bottom-nav-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── SCANNER MODAL ── */}
      {showScanner && (
        <div className="scanner-overlay" onClick={e => { if (e.target === e.currentTarget && !scanning) setShowScanner(false); }}>
          <div className="scanner-sheet">
            {/* handle bar */}
            <div className="scanner-handle" />

            <div className="scanner-header">
              <div className="scanner-title"> QR Payment Scanner</div>
              <div className="scanner-sub">Scan an eSewa or bank QR code to pay</div>
            </div>

            {/* camera viewport */}
            {!scanned ? (
              <div className="scanner-viewport">
                {/* simulated camera feed */}
                <div className="scanner-camera-bg">
                  {/* animated scan grid */}
                  <div className="scan-grid">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="scan-cell" />
                    ))}
                  </div>
                  {/* corner brackets */}
                  <div className="scan-corner tl" />
                  <div className="scan-corner tr" />
                  <div className="scan-corner bl" />
                  <div className="scan-corner br" />
                  {/* scan line animation */}
                  {scanning && <div className="scan-line" />}
                  {/* center QR demo placeholder */}
                  {!scanning && (
                    <div className="scan-placeholder">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M21 14v2"/>
                      </svg>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 8 }}>Position QR code here</div>
                    </div>
                  )}
                  {scanning && (
                    <div className="scan-status">
                      <div className="scan-status-dot" />
                      Scanning…
                    </div>
                  )}
                </div>

                {/* demo trigger */}
                {!scanning && (
                  <button className="scan-demo-btn" onClick={handleScanDemo}>
                     Tap to Simulate Scan (Demo)
                  </button>
                )}
              </div>
            ) : (
              /* ── scan result ── */
              <div className="scan-result">
                <div className="scan-result-icon"></div>
                <div className="scan-result-title">QR Code Scanned!</div>
                <div className="scan-result-merchant">{scanResult.merchant}</div>

                <div className="scan-result-box">
                  <div className="scan-result-row">
                    <span>Amount</span>
                    <span className="scan-result-amount">NPR {scanResult.amount}</span>
                  </div>
                  <div className="scan-result-row">
                    <span>Method</span>
                    <span>{scanResult.method}</span>
                  </div>
                  <div className="scan-result-row">
                    <span>Reference</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{scanResult.ref}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="scan-confirm-btn" onClick={handleConfirmPayment}>
                     Confirm Payment
                  </button>
                  <button className="scan-retry-btn" onClick={() => { setScanned(false); setScanResult(null); }}>
                    Rescan
                  </button>
                </div>
              </div>
            )}

            {/* supported methods */}
            <div className="scanner-methods">
              <div className="scanner-methods-label">Supported</div>
              <div className="scanner-methods-list">
                {['eSewa', 'Khalti', 'Connect IPS', 'QR Pay'].map(m => (
                  <span key={m} className="scanner-method-chip">{m}</span>
                ))}
              </div>
            </div>

            <button className="scanner-close" onClick={() => { setShowScanner(false); setScanning(false); setScanned(false); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
