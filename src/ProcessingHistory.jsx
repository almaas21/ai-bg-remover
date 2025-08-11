import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Using inline SVGs for icons to keep the component self-contained.
const CheckCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.66" />
    <path d="M12 2v10l3-3" />
  </svg>
);

const Download = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const Clock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);


export default function ProcessingHistory({ images, onDownload }) {
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-50 border-dashed rounded-3xl p-8 text-center border-2 border-gray-200">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images processed yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent History</h3>
      
      <AnimatePresence>
        {images.slice(0, 5).map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={image.processedUrl}
                      alt={image.filename}
                      className="w-12 h-12 object-cover rounded-lg border-2 border-gray-100"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-48">
                      {image.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {`Processed in ${image.processing_time.toFixed(2)}s`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                    Completed
                  </span>
                  
                  <button
                    onClick={() => onDownload(image.processedUrl)}
                    className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
