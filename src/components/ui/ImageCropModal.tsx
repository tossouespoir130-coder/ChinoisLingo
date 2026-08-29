'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Portal } from '@/components/ui/Portal';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, RefreshCw, Upload } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  onSelectNewImage?: () => void;
}

const MASK_SIZE = 260; // 260px diameter crop circle
const CANVAS_OUTPUT_SIZE = 512; // 512x512 HD avatar export

export function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  onSelectNewImage,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ naturalWidth: 1, naturalHeight: 1 });

  const imageRef = useRef<HTMLImageElement>(null);

  // Load natural dimensions when imageSrc changes
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          naturalWidth: img.naturalWidth || 1,
          naturalHeight: img.naturalHeight || 1,
        });
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // Reset values when opening a new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Mouse dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch dragging handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Compute base cover dimensions for preview
  const aspect = imageDimensions.naturalWidth / imageDimensions.naturalHeight;
  let baseWidth = MASK_SIZE;
  let baseHeight = MASK_SIZE;

  if (aspect >= 1) {
    baseHeight = MASK_SIZE;
    baseWidth = MASK_SIZE * aspect;
  } else {
    baseWidth = MASK_SIZE;
    baseHeight = MASK_SIZE / aspect;
  }

  // Generate pixel-perfect cropped circular image onto high-resolution canvas
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_OUTPUT_SIZE;
    canvas.height = CANVAS_OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 2. Exact Transformation Scale Factor
    const scaleFactor = CANVAS_OUTPUT_SIZE / MASK_SIZE;

    // Move to canvas center
    ctx.translate(CANVAS_OUTPUT_SIZE / 2, CANVAS_OUTPUT_SIZE / 2);

    // Apply translation from user drag
    ctx.translate(position.x * scaleFactor, position.y * scaleFactor);

    // Apply zoom & rotation
    ctx.scale(zoom, zoom);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw image centered
    const drawW = baseWidth * scaleFactor;
    const drawH = baseHeight * scaleFactor;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCropComplete(croppedDataUrl);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5]">
                Ajuster la Photo de Profil
              </h3>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                Glissez l’image et ajustez le zoom pour centrer votre visage dans le cercle.
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Crop Viewport with Ambient Background */}
          <div className="relative w-full h-80 bg-neutral-950 select-none overflow-hidden flex items-center justify-center">
            {/* Ambient Blurred Background (Shows full photo subtly without black void) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Arrière-plan"
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
            />

            {/* Circular Crop Focus Mask */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="relative rounded-full overflow-hidden border-4 border-[#6200EE] shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center bg-neutral-900 z-10"
              style={{
                width: `${MASK_SIZE}px`,
                height: `${MASK_SIZE}px`,
                touchAction: 'none',
              }}
            >
              {/* Inner Transformed Image (Pixel-Perfect with Canvas math) */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${baseWidth}px`,
                  height: `${baseHeight}px`,
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Ajustement photo"
                  className="w-full h-full object-fill pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Subtle visual alignment crosshair */}
              <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                </div>
              </div>
            </div>

            {/* Drag Hint Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/75 text-white/90 text-[10.5px] font-bold backdrop-blur-md border border-white/10 pointer-events-none">
              <Move className="w-3 h-3" />
              <span>Glissez pour ajuster la position</span>
            </div>
          </div>

          {/* Controls Bar (Zoom, Rotate, Reset) */}
          <div className="p-5 space-y-4 bg-white dark:bg-[#1E1E1E]">
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#6200EE]" />
                  <span>Niveau de Zoom</span>
                </span>
                <span className="font-mono text-[#6200EE] dark:text-[#BB86FC]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                  className="w-8 h-8 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white btn-press"
                  title="Dézoomer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#6200EE] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                  className="w-8 h-8 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white btn-press"
                  title="Zoomer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] hover:text-[#212121] dark:hover:text-white text-xs font-bold transition-all btn-press flex items-center gap-1.5"
                  title="Pivoter de 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Pivoter</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] hover:text-[#212121] dark:hover:text-white text-xs font-bold transition-all btn-press flex items-center gap-1.5"
                  title="Recentrer et réinitialiser"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recentrer</span>
                </button>
                {onSelectNewImage && (
                  <button
                    type="button"
                    onClick={onSelectNewImage}
                    className="px-3 py-1.5 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white text-xs font-bold transition-all btn-press flex items-center gap-1.5 border border-[#6200EE]/20"
                    title="Changer de photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Changer de photo</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="px-5 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Valider le cadrage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
