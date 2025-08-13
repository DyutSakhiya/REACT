import React, { useState, useRef } from 'react';
import { Download, QrCode, Copy } from 'lucide-react';

const QRCodeGenerator = ({ tableNumber = null, showDownload = false, customUrl = null }) => {
  const [websiteUrl, setWebsiteUrl] = useState('https://your-flavoro-foods-website.com');
  const [qrSize, setQrSize] = useState(200);
  const canvasRef = useRef(null);

  // Generate QR code URL using a free QR code API
  const generateQRCodeUrl = (url, size = 200) => {
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&format=png&margin=10`;
  };

  // Build the URL based on table number or custom URL
  const getQRUrl = () => {
    if (customUrl) {
      return customUrl;
    }
    if (tableNumber) {
      return `${websiteUrl}/table/${tableNumber}`;
    }
    return websiteUrl;
  };

  // Download QR code function
  const downloadQRCode = async () => {
    try {
      const qrUrl = generateQRCodeUrl(getQRUrl(), qrSize);
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = tableNumber ? `QR-Table-${tableNumber}.png` : 'QR-Website.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getQRUrl());
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL. Please try manually copying the URL.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 mb-2">
          <QrCode className="text-blue-500" />
          QR Code Generator
        </h2>
        {tableNumber && (
          <p className="text-gray-600">Table {tableNumber}</p>
        )}
      </div>

      {/* URL Input - only show if not table-specific and not custom URL */}
      {!tableNumber && !customUrl && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL:
          </label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://your-website.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* QR Size Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          QR Code Size: {qrSize}px
        </label>
        <input
          type="range"
          min="150"
          max="400"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* QR Code Display */}
      <div className="text-center mb-6">
        <div className="inline-block p-4 bg-gray-100 rounded-lg">
          <img
            src={generateQRCodeUrl(getQRUrl(), qrSize)}
            alt="QR Code"
            className="mx-auto"
            style={{ width: `${qrSize}px`, height: `${qrSize}px` }}
          />
        </div>
      </div>

      {/* URL Display */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">QR Code URL:</p>
        <div className="flex items-center justify-between">
          <code className="text-xs text-blue-600 bg-white px-2 py-1 rounded flex-1 mr-2 overflow-hidden text-ellipsis">
            {getQRUrl()}
          </code>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-blue-500 p-1"
            title="Copy URL"
          >
            <Copy />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={downloadQRCode}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Download />
          Download QR
        </button>
        <button
          onClick={() => window.open(generateQRCodeUrl(getQRUrl(), 400), '_blank')}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          View Large
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Open your phone's camera app</li>
          <li>Point it at the QR code</li>
          <li>Tap the notification to open the website</li>
          {tableNumber && <li>This will take customers to Table {tableNumber} ordering page</li>}
        </ul>
      </div>

      {/* Technical Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <details>
          <summary className="text-sm font-medium text-gray-700 cursor-pointer">
            Technical Details
          </summary>
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p>• QR Code format: PNG</p>
            <p>• Error correction: Medium</p>
            <p>• Margin: 10px</p>
            <p>• Compatible with all QR readers</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default QRCodeGenerator;