
const { useState, useEffect } = React;
const { motion } = window['framer-motion'];

function BackgroundRemover() {
  const [currentStep, setCurrentStep] = useState('upload');
  const [selectedImage, setSelectedImage] = useState(null);
  const [processing, setProcessing] = useState({ progress: 0, stage: 'uploading' });
  const [result, setResult] = useState(null);

  const API_BASE = "https://ai-background-remover-production-f3ac.up.railway.app";

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setCurrentStep('processing');
    setProcessing({ progress: 25, stage: 'uploading' });

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(API_BASE + '/upload', { method: 'POST', body: formData });
      const { file_url } = await uploadRes.json();

      setProcessing({ progress: 50, stage: 'processing' });

      // Call AI processing
      const processRes = await fetch(API_BASE + '/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: file_url })
      });
      const { processed_url } = await processRes.json();

      setProcessing({ progress: 100, stage: 'finalizing' });
      setResult({ originalUrl: file_url, processedUrl: processed_url });
      setCurrentStep('completed');

    } catch (error) {
      alert("Error processing image.");
      setCurrentStep('upload');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.processedUrl;
    link.download = 'no_bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    React.createElement('div', { className: 'container mx-auto p-6 text-center' },
      React.createElement('h1', { className: 'text-3xl font-bold mb-6' }, 'AI Background Remover'),
      currentStep === 'upload' && React.createElement('input', { type: 'file', accept: 'image/*', onChange: handleImageSelect }),
      currentStep === 'processing' && React.createElement('p', null, `Processing... ${processing.progress}%`),
      currentStep === 'completed' && result &&
        React.createElement('div', null,
          React.createElement('img', { src: result.processedUrl, alt: 'Processed', className: 'mx-auto mb-4' }),
          React.createElement('button', { onClick: handleDownload, className: 'px-4 py-2 bg-blue-500 text-white rounded' }, 'Download')
        )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(BackgroundRemover));
