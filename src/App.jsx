// =============================================================================
// IMPORTS
// =============================================================================

// Import React and hooks from the React library
// - React: The core React library
// - useState: A hook that lets us add state (data that can change) to our component
// - useRef: A hook that lets us reference DOM elements or persist values across renders
import React, { useState, useRef } from 'react';

// Import icon components from lucide-react library
// These are pre-made icon components we can use in our UI
import { Download, Link2, Share2, AlertCircle, Check } from 'lucide-react';

// Import the AdSense component for displaying ads
import AdSense from './AdSense';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

// This is our main component - a functional component that returns JSX (HTML-like code)
// Components are reusable pieces of UI. This one generates QR codes.
const QRCodeGenerator = () => {

  // ===========================================================================
  // STATE VARIABLES (using useState hook)
  // ===========================================================================

  // State is data that can change over time. When state changes, React re-renders the component.
  // useState returns two things: [currentValue, functionToUpdateValue]

  // Stores the URL entered by the user (starts as empty string '')
  const [url, setUrl] = useState('');

  // Stores the generated QR code as a data URL (image data in text format)
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Stores the selected format (png or svg), default is 'png'
  const [format, setFormat] = useState('png');

  // Stores the selected size in pixels, default is 256
  const [size, setSize] = useState(256);

  // Stores any error messages to show to the user
  const [error, setError] = useState('');

  // Tracks whether the URL was successfully copied to clipboard
  const [copied, setCopied] = useState(false);

  // useRef creates a reference to a DOM element (not currently used but available)
  const canvasRef = useRef(null);

  // ===========================================================================
  // HELPER FUNCTIONS
  // ===========================================================================

  /**
   * Validates if the input string is a valid HTTP/HTTPS URL
   * @param {string} input - The URL string to validate
   * @returns {boolean} - true if valid, false if invalid
   */
  const validateUrl = (input) => {
    try {
      // The URL constructor throws an error if the string is not a valid URL
      const urlObj = new URL(input);

      // Check if the protocol (http: or https:) is allowed
      // We only accept secure web URLs, not file:, ftp:, etc.
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      return true;
    } catch {
      // If URL constructor throws an error, the URL is invalid
      return false;
    }
  };

  // ===========================================================================
  // QR CODE GENERATION
  // ===========================================================================

  /**
   * Main function that generates the QR code
   * This is an async function because it may need to load external libraries
   */
  const generateQRCode = async () => {
    // Clear any previous error messages
    setError('');

    // Validation: Check if URL field is empty
    // .trim() removes whitespace from both ends
    if (!url.trim()) {
      setError('Please enter a URL');
      return; // Stop execution here
    }

    // Validation: Check if URL is valid using our helper function
    if (!validateUrl(url)) {
      setError('Please enter a valid HTTP/HTTPS URL');
      return; // Stop execution here
    }

    try {
      // Dynamically load the QRious library from a CDN (Content Delivery Network)
      // We create a script tag programmatically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';

      /**
       * This function actually creates the QR code
       * It's called after the QRious library is loaded
       */
      const generateQR = () => {
        // Create a new QRious instance with our settings
        // window.QRious is available after the script loads
        const qr = new window.QRious({
          value: url,      // The URL to encode in the QR code
          size: size,      // Size in pixels (128, 256, or 512)
          level: 'H'       // Error correction level: 'H' = High (can recover from 30% damage)
        });

        // Check which format the user selected
        if (format === 'svg') {
          // SVG FORMAT: Vector graphics (scalable without quality loss)

          // Get the canvas element that QRious created
          const canvas = qr.canvas;

          // Get the 2D drawing context (allows us to read pixel data)
          const ctx = canvas.getContext('2d');

          // Extract pixel data from the canvas
          // getImageData returns RGBA data for every pixel
          const imageData = ctx.getImageData(0, 0, size, size);

          // Convert the pixel data to SVG format
          const svg = canvasToSVG(imageData, size);

          // Update state with the SVG data URL
          setQrDataUrl(svg);
        } else {
          // PNG FORMAT: Raster graphics (made of pixels)

          // toDataURL() converts the canvas to a base64-encoded PNG image
          // Returns something like: "data:image/png;base64,iVBORw0KG..."
          setQrDataUrl(qr.toDataURL());
        }
      };

      // Set up the callback: when script loads, run generateQR
      script.onload = generateQR;

      // Check if QRious library is already loaded
      if (!window.QRious) {
        // If not loaded, add the script tag to the page to load it
        document.head.appendChild(script);
      } else {
        // If already loaded, just generate the QR code
        generateQR();
      }
    } catch (err) {
      // If anything goes wrong, show an error message
      setError('Failed to generate QR code. Please try again.');
      console.error(err); // Log error to browser console for debugging
    }
  };

  // ===========================================================================
  // SVG CONVERSION
  // ===========================================================================

  /**
   * Converts canvas pixel data to SVG format
   * SVG is a text-based vector graphics format
   *
   * @param {ImageData} imageData - Pixel data from the canvas
   * @param {number} size - Width/height of the QR code
   * @returns {string} - A data URL containing the SVG
   */
  const canvasToSVG = (imageData, size) => {
    // imageData.data is a flat array of RGBA values
    // Format: [R, G, B, A, R, G, B, A, ...]
    // Each pixel has 4 values (Red, Green, Blue, Alpha)
    const data = imageData.data;

    // Each QR module (square) is 1 pixel in our SVG
    const moduleSize = 1;

    // Start building the SVG as a string
    // Template literals (backticks) allow us to embed variables with ${}
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  <path d="`;

    // Build the SVG path for all black pixels
    let path = '';

    // Loop through every pixel (y = rows, x = columns)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Calculate the index in the flat array
        // Each pixel takes 4 array positions (RGBA)
        const idx = (y * size + x) * 4;

        // Extract RGB values (we ignore Alpha channel)
        const r = data[idx];     // Red
        const g = data[idx + 1]; // Green
        const b = data[idx + 2]; // Blue

        // Check if pixel is black (or dark enough to be part of QR code)
        // QR codes are black and white, so we check if RGB values are low (dark)
        if (r < 128 && g < 128 && b < 128) {
          // Add a small square (path) for this black pixel
          // SVG path commands:
          // M = Move to (x,y)
          // h = horizontal line (relative)
          // v = vertical line (relative)
          // z = close path
          path += `M${x},${y}h${moduleSize}v${moduleSize}h-${moduleSize}z`;
        }
      }
    }

    // Complete the SVG by closing the path tag and svg tag
    svg += path + `" fill="#000000"/>
</svg>`;

    // Convert SVG string to a data URL that can be used in <img> src
    // encodeURIComponent makes the SVG safe to use in a URL
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  // ===========================================================================
  // ACTION HANDLERS
  // ===========================================================================

  /**
   * Downloads the generated QR code to the user's computer
   */
  const downloadQRCode = () => {
    // If no QR code is generated yet, do nothing
    if (!qrDataUrl) return;

    // Create an invisible link element
    const link = document.createElement('a');

    // Set the filename with current timestamp to make it unique
    // Date.now() returns milliseconds since 1970
    link.download = `qrcode-${Date.now()}.${format}`;

    // Set the link to point to our QR code data URL
    link.href = qrDataUrl;

    // Programmatically click the link to trigger download
    link.click();
  };

  /**
   * Copies the URL to the user's clipboard
   * This is an async function because clipboard API returns a Promise
   */
  const copyToClipboard = async () => {
    try {
      // Modern clipboard API (requires HTTPS or localhost)
      await navigator.clipboard.writeText(url);

      // Show success feedback
      setCopied(true);

      // Reset the "Copied!" feedback after 2 seconds (2000 milliseconds)
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // If clipboard access fails, log the error
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Opens the native share dialog on supported devices (mobile mostly)
   */
  const shareQRCode = async () => {
    // Check if Web Share API is available (not all browsers support it)
    if (navigator.share) {
      try {
        // Open the native share sheet
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for ${url}`,
          url: window.location.href // Current page URL
        });
      } catch (err) {
        // User probably cancelled the share, or it failed
        console.error('Error sharing:', err);
      }
    }
  };

  // ===========================================================================
  // JSX RETURN (UI/RENDERING)
  // ===========================================================================

  // This is what gets displayed on the screen
  // JSX looks like HTML but it's actually JavaScript
  // className is used instead of class (because 'class' is a JavaScript keyword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">


      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo icon container */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                {/* Link2 is an icon component from lucide-react */}
                <Link2 className="text-white" size={24} />
              </div>
              {/* Title with gradient text */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QR Generator
              </h1>
            </div>
          </div>
        </div>

        {/* Top Banner Ad */}
        <div className="bg-gray-100 border-t border-b border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-center">
            <AdSense
              adSlot="1234567890"
              adFormat="horizontal"
              adResponsive={true}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid layout: 2 columns on medium+ screens, 1 column on mobile */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT COLUMN - Main content (spans 2 columns) */}
          <div className="md:col-span-2 space-y-6">

            {/* Input Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-2">Generate Your QR Code</h2>
              <p className="text-gray-600 text-sm mb-6">
                Create a QR code for any website instantly. Simply paste your URL below and click generate.
              </p>

              <div className="space-y-4">
                {/* URL Input Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter URL
                  </label>
                  {/* Controlled input: value comes from state, updates via onChange */}
                  <input
                    type="url"
                    value={url}
                    // Event handler: e.target.value is the current input value
                    onChange={(e) => setUrl(e.target.value)}
                    // Allow Enter key to trigger generation
                    onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Size and Format Options */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Size Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={size}
                      // Convert string value to number
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value={128}>Small (128px)</option>
                      <option value={256}>Medium (256px)</option>
                      <option value={512}>Large (512px)</option>
                    </select>
                  </div>

                  {/* Format Selector */}
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

                {/* Conditional Rendering: Only show error if there is one */}
                {/* In JSX, {condition && <element>} means "if condition is true, render element" */}
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

            {/* QR Code Display - Only shows if qrDataUrl has a value */}
            {qrDataUrl && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>
                <div className="flex flex-col items-center gap-4">
                  {/* QR Code Image */}
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                      style={{ imageRendering: 'pixelated' }} // Keep pixels sharp
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center w-full">
                    {/* Download Button */}
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      <Download size={18} />
                      Download
                    </button>

                    {/* Copy URL Button - Changes appearance when copied */}
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                    >
                      {/* Ternary operator: condition ? ifTrue : ifFalse */}
                      {copied ? <Check size={18} /> : <Link2 size={18} />}
                      {copied ? 'Copied!' : 'Copy URL'}
                    </button>

                    {/* Share Button - Only shows if browser supports sharing */}
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

            {/* Content Banner Ad */}
            <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex justify-center">
              <AdSense
                adSlot="0987654321"
                adFormat="horizontal"
                adResponsive={true}
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ad - Sticky means it stays in place while scrolling */}
            <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex justify-center sticky top-4">
              <AdSense
                adSlot="5555555555"
                adFormat="rectangle"
                adResponsive={true}
              />
            </div>

            {/* Features List */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {/* Each feature item */}
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

// Export the component so it can be imported in other files
export default QRCodeGenerator;
