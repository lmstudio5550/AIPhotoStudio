import React, { useState, useCallback } from 'react';
import { Feature } from './types';
import { fileToBase64, base64ToFile } from './utils/imageUtils';
import { editImage } from './services/geminiService';
import Header from './components/Header';
import FeatureTabs from './components/FeatureTabs';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import ActionButton from './components/ActionButton';
import ImageCropper from './components/ImageCropper';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.RemoveBackground);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageBase64, setOriginalImageBase64] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);


  const handleImageUpload = useCallback(async (file: File) => {
    setOriginalImageFile(file);
    setProcessedImage(null);
    setError(null);
    setIsCropping(false);
    try {
      const base64 = await fileToBase64(file);
      setOriginalImageBase64(base64);
    } catch (err) {
      setError('Could not process the uploaded file.');
      setOriginalImageBase64(null);
    }
  }, []);

  const handleFeatureChange = (feature: Feature) => {
    setActiveFeature(feature);
    setOriginalImageFile(null);
    setOriginalImageBase64(null);
    setProcessedImage(null);
    setError(null);
    setIsCropping(false);
  };

  const handleCropStart = () => {
    if (originalImageBase64) {
      setIsCropping(true);
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
  };

  const handleCropComplete = async (croppedBase64: string) => {
    if (originalImageFile) {
        setOriginalImageBase64(croppedBase64);
        const newFile = base64ToFile(croppedBase64, originalImageFile.name, 'image/jpeg');
        setOriginalImageFile(newFile);
    }
    setIsCropping(false);
  };
  
  const getPromptForFeature = (feature: Feature): string => {
      switch(feature) {
          case Feature.RemoveBackground:
              return "Please remove the background from this image. The new background should be solid, pure white (#FFFFFF). Ensure the main object has clean edges and no lingering shadows on the white background.";
          case Feature.RestoreImage:
              return "Please restore this old photo. Enhance its quality by fixing any scratches, tears, or discoloration. Improve the focus, clarity, and color balance to make it look as if it were taken recently.";
          default:
              return "Edit this image.";
      }
  }

  const handleSubmit = async () => {
    if (!originalImageFile || !originalImageBase64) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    const prompt = getPromptForFeature(activeFeature);

    try {
      const resultBase64 = await editImage(originalImageBase64, originalImageFile.type, prompt);
      setProcessedImage(resultBase64);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const getButtonText = () => {
      if (isLoading) return 'Processing...';
      switch(activeFeature) {
          case Feature.RemoveBackground:
              return 'Remove Background';
          case Feature.RestoreImage:
              return 'Restore Photo';
          default:
              return 'Generate';
      }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
       {isCropping && originalImageBase64 && (
        <ImageCropper
          imageSrc={`data:image/jpeg;base64,${originalImageBase64}`}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FeatureTabs activeFeature={activeFeature} onFeatureChange={handleFeatureChange} />
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-300">Original Image</h2>
                <ImageUploader 
                    onImageUpload={handleImageUpload} 
                    originalImageBase64={originalImageBase64} 
                    onCropStart={handleCropStart}
                />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-300">AI Result</h2>
                <ResultDisplay processedImage={processedImage} isLoading={isLoading} error={error} />
              </div>
            </div>
            <ActionButton onClick={handleSubmit} disabled={!originalImageFile || isLoading}>
              {getButtonText()}
            </ActionButton>
        </div>
      </main>
    </div>
  );
};

export default App;
