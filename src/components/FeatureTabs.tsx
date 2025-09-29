import React from 'react';
import { Feature } from '../types';

interface FeatureTabsProps {
  activeFeature: Feature;
  onFeatureChange: (feature: Feature) => void;
}

const FeatureTabs: React.FC<FeatureTabsProps> = ({ activeFeature, onFeatureChange }) => {
  const features = [
    { id: Feature.RemoveBackground, label: 'Remove Background', icon: '✂️' },
    { id: Feature.RestoreImage, label: 'Restore Old Photo', icon: '🕰️' },
  ];

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
      {features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => onFeatureChange(feature.id)}
          className={`flex items-center justify-center px-4 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            activeFeature === feature.id
              ? 'bg-purple-600 text-white shadow-lg transform scale-105'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span className="mr-2 hidden sm:inline">{feature.icon}</span>
          {feature.label}
        </button>
      ))}
    </div>
  );
};

export default FeatureTabs;
