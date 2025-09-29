import React from 'react';

interface ResultDisplayProps {
  processedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-purple-500 border-gray-600 animate-spin"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-b-pink-500 border-transparent animate-spin" style={{animationDelay: '0.2s'}}></div>
      </div>
      <p className="mt-4 text-gray-300 font-semibold animate-pulse">AI is working its magic...</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ processedImage, isLoading, error }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-xl p-4 flex items-center justify-center h-64 mt-4 md:mt-0">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-400 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 font-semibold">An Error Occurred</p>
          <p className="text-sm break-words">{error}</p>
        </div>
      ) : processedImage ? (
        <img 
          src={`data:image/png;base64,${processedImage}`} 
          alt="Processed" 
          className="object-contain h-full w-full rounded-lg"
        />
      ) : (
        <div className="text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="mt-2 font-semibold">Your enhanced image will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;