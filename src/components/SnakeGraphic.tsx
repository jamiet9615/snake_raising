import React from 'react';
import { SnakeType, SnakeStage, getSnakeImageFileName, getSnakeSilhouetteFileName } from '../types';
import { AssetImage } from './AssetImage';

interface SnakeGraphicProps {
  type: SnakeType;
  stage: SnakeStage;
  isPetting?: boolean;
  isSilhouette?: boolean;
  size?: number; // width/height in px
  className?: string;
  onClick?: () => void;
}

export const SnakeGraphic: React.FC<SnakeGraphicProps> = ({
  type,
  stage,
  isPetting = false,
  isSilhouette = false,
  size = 120,
  className = '',
  onClick,
}) => {
  // Determine image filename
  const fileName = isSilhouette
    ? getSnakeSilhouetteFileName(type)
    : getSnakeImageFileName(type, stage, isPetting);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Petting heart particles */}
      {isPetting && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 animate-bounce z-20 pointer-events-none">
          <span className="text-xl animate-pulse">💖</span>
          <span className="text-sm animate-ping">✨</span>
          <span className="text-lg animate-bounce">💕</span>
        </div>
      )}

      {/* Snake PNG Image from Assets (Scaled up 1.35x for plump, detailed visual) */}
      <AssetImage
        name={fileName}
        alt={fileName}
        className={`w-full h-full object-contain filter drop-shadow-xl transition-transform duration-300 transform scale-135 md:scale-140 ${
          isPetting ? 'scale-150 rotate-3' : ''
        }`}
      />
    </div>
  );
};
