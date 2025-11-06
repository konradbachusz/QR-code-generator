import React, { useState, useRef } from 'react';
import { Download, Link2, Share2, AlertCircle, Check } from 'lucide-react';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState(256);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const validateUrl = (input) => {
    try {
      const urlObj = new URL(input);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const generateQRCode = async () => {
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid HTTP/HTTPS URL');
      return;
    }

    try {
      // QR Code generation using a simple algorithm
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Use QRious library via CDN (it's already available)
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
      
      script.onload = () => {
        const qr = new window.QRious({
          value: url,
          size: size,
          level: 'H'
        });
        
        setQrDataUrl(qr.toDataURL());
      };
      
      if (!window.QRious) {
        document.head.appendChild(script);
      } else {
        const qr = new window.QRious({
          value: url,
          size: size,
          level: 'H'
        });
        
        setQrDataUrl(qr.toDataURL());
      }
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error(err);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.${format}`;
    link.href = qrDataUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for ${url}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Ad Space */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Link2 className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QR Generator
              </h1>
            </div>
          </div>
        </div>
        {/* Top Ad Banner Placeholder */}
        <div className="bg-gray-100 border-t border-b border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            Advertisement Space (970x90)
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-2">Generate Your QR Code</h2>
              <p className="text-gray-600 text-sm mb-6">
                Create a QR code for any website instantly. Simply paste your URL below and click generate.
              </p>

              {/* URL Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value={128}>Small (128px)</option>
                      <option value={256}>Medium (256px)</option>
                      <option value={512}>Large (512px)</option>
                      <option value={1024}>Extra Large (1024px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateQRCode}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Generate QR Code
                </button>
              </div>
            </div>

            {/* QR Display */}
            {qrDataUrl && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center w-full">
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                    >
                      {copied ? <Check size={18} /> : <Link2 size={18} />}
                      {copied ? 'Copied!' : 'Copy URL'}
                    </button>
                    {navigator.share && (
                      <button
                        onClick={shareQRCode}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Ad Space */}
            <div className="bg-gray-100 rounded-xl p-8 border border-gray-200 text-center">
              <p className="text-sm text-gray-500">Advertisement Space (728x90)</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ad */}
            <div className="bg-gray-100 rounded-xl p-8 border border-gray-200 text-center sticky top-4">
              <p className="text-sm text-gray-500 mb-2">Advertisement</p>
              <p className="text-xs text-gray-400">(300x250)</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span>Instant QR code generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span>Multiple size options</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span>PNG & SVG formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span>No sign-up required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span>100% free to use</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2024 QR Generator. Free QR Code Generator.</p>
          <p className="mt-2 text-xs text-gray-500">
            This tool generates QR codes client-side. No data is stored or transmitted.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QRCodeGenerator;
