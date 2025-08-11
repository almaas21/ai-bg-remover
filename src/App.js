import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Using inline SVGs for icons to keep the component self-contained.
// These are replacements for lucide-react icons.
const Sparkles = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2" />
    <path d="M6.6 17.4l-1.4 1.4" />
    <path d="M2 12h2" />
    <path d="M17.4 17.4l1.4 1.4" />
    <path d="M17.4 6.6l1.4-1.4" />
    <path d="M6.6 6.6l-1.4-1.4" />
    <path d="M12 20v2" />
    <path d="M20 12h2" />
    <path d="M14.86 5.56l-2.03 2.03L9.6 9.6l2.03 2.03L14.86 14.86l2.03-2.03L19 9.6l-2.03-2.03-2.03 2.03L12 12l-2.03-2.03L9.6 9.6l2.03-2.03L14.86 5.56z" />
  </svg>
);

const Wand2 = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 7L13 15" />
    <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
    <path d="M15 6v10h10v-10z" />
    <path d="M9 13l2 2" />
    <path d="M9 17l2-2" />
    <path d="M5 13l2-2" />
    <path d="M5 17l2-2" />
  </svg>
);

const Download = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

// The main application component.
// It handles state, simulates the AI process, and renders the appropriate UI.
export default function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, processing, completed
  const [selectedImage, setSelectedImage] = useState(null);
  const [processing, setProcessing] = useState({ progress: 0, stage: 'uploading' });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showError, setShowError] = useState(false);

  // A simulated URL for the processed image.
  // In a real app, this would be returned by the AI service.
  const SIMULATED_PROCESSED_IMAGE_URL = 'https://placehold.co/500x500/A0B9C6/fff?text=No+Background';

  // Component to display an error message instead of an alert.
  const ErrorModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm text-center">
        <h3 className="text-xl font-bold text-red-600 mb-4">Processing Failed</h3>
        <p className="text-gray-700 mb-6">Sorry, something went wrong while removing the background. Please try another image.</p>
        <button
          onClick={() => {
            setShowError(false);
            handleNewImage();
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );

  // Simulates the API calls and processing time.
  const handleImageSelect = async (file) => {
    setSelectedImage(URL.createObjectURL(file));
    setCurrentStep('processing');

    const startTime = Date.now();
    try {
      // Stage 1: Simulate uploading
      setProcessing({ progress: 25, stage: 'Uploading image...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 2: Simulate AI processing
      setProcessing({ progress: 75, stage: 'AI is removing the background...' });
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Simulate a random failure for demonstration
      // if (Math.random() < 0.2) {
      //   throw new Error('Simulated AI failure.');
      // }

      setProcessing({ progress: 100, stage: 'Finalizing...' });
      const processingTime = (Date.now() - startTime) / 1000;

      // Create a result object and save to history
      const newResult = {
        id: crypto.randomUUID(),
        originalUrl: URL.createObjectURL(file),
        processedUrl: SIMULATED_PROCESSED_IMAGE_URL,
        filename: file.name,
        processing_time: processingTime,
        status: 'completed',
        created_date: new Date().toISOString()
      };

      setResult(newResult);
      setHistory(prevHistory => [newResult, ...prevHistory.slice(0, 9)]); // Keep history to last 10
      setCurrentStep('completed');
    } catch (error) {
      console.error('Processing failed:', error);
      setShowError(true);
    }
  };

  // Handles the download of the processed image.
  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `processed_image.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Resets the state to allow for a new image upload.
  const handleNewImage = () => {
    setCurrentStep('upload');
    setSelectedImage(null);
    setResult(null);
    setProcessing({ progress: 0, stage: 'uploading' });
  };

  // Sub-component: Image Uploader UI
  const ImageUploader = ({ onImageSelect }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 flex flex-col items-center justify-center text-center"
    >
      <div className="w-24 h-24 p-4 bg-purple-100 rounded-full mb-6 flex items-center justify-center">
        <Wand2 className="w-12 h-12 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Drag & drop an image</h2>
      <p className="text-gray-500 mb-6">or click to browse your files</p>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
          }
        }}
      />
      <button
        onClick={() => document.getElementById('fileInput').click()}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
      >
        Upload an Image
      </button>
      <p className="mt-4 text-sm text-gray-400">PNG, JPG, HEIC, and WebP are supported.</p>
    </motion.div>
  );

  // Sub-component: Image Processor UI
  const ImageProcessor = ({ progress, stage }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200 flex flex-col items-center justify-center text-center"
    >
      <div className="w-24 h-24 p-4 bg-blue-100 rounded-full mb-6 flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-blue-600 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing your image...</h2>
      <p className="text-gray-500 mb-6">{stage}</p>
      <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </motion.div>
  );

  // Sub-component: Image Comparison UI
  const ImageComparison = ({ originalUrl, processedUrl, onDownload, onNewImage }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Result is Ready!</h2>
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6">
        <div className="relative overflow-hidden rounded-xl group">
          <img src={originalUrl} alt="Original" className="w-full h-full object-contain rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-semibold">Original</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl group">
          <img src={processedUrl} alt="Processed" className="w-full h-full object-contain rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-semibold">Processed</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => onDownload(processedUrl)}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Download className="w-5 h-5" /> Download
        </button>
        <button
          onClick={onNewImage}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Process New Image
        </button>
      </div>
    </motion.div>
  );
  
  // Sub-component: Processing History UI
  const ProcessingHistory = ({ images, onDownload }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 sticky top-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent History</h2>
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {images.length > 0 ? (
          images.map((img) => (
            <div key={img.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 relative bg-gray-200 rounded-md overflow-hidden">
                <img src={img.processedUrl} alt="Processed result" className="object-cover w-full h-full" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800 truncate">{img.filename}</p>
                <p className="text-xs text-gray-500 mt-1">{`Processed in ${img.processing_time.toFixed(2)}s`}</p>
              </div>
              <button
                onClick={() => onDownload(img.processedUrl)}
                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                aria-label={`Download ${img.filename}`}
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No processing history yet.</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-sans">
      {showError && <ErrorModal />}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-700">AI Background Remover</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Remove Backgrounds
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Instantly
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload any image and our AI will automatically remove the background in seconds. 
            Perfect for product photos, portraits, and creative projects.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Processing Area */}
            <div className="lg:col-span-2">
              {currentStep === 'upload' && (
                <ImageUploader 
                  onImageSelect={handleImageSelect}
                />
              )}

              {currentStep === 'processing' && (
                <ImageProcessor 
                  progress={processing.progress}
                  stage={processing.stage}
                />
              )}

              {currentStep === 'completed' && result && (
                <ImageComparison
                  originalUrl={selectedImage}
                  processedUrl={result.processedUrl}
                  filename={result.filename}
                  onDownload={handleDownload}
                  onNewImage={handleNewImage}
                />
              )}
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <ProcessingHistory 
                images={history}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 text-gray-500"
        >
          <p className="text-sm">
            Powered by advanced AI technology • Fast • Secure • High Quality
          </p>
        </motion.div>
      </div>
    </div>
  );
}
