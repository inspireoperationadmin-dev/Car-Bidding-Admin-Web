import React, { useEffect, useRef } from 'react';

interface FuzzyTextProps {
  children?: React.ReactNode;
  fontSize?: string | number;
  fontWeight?: number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
  transitionDuration?: number;
  className?: string;
}

interface CleanupCanvas extends HTMLCanvasElement {
  cleanupFuzzyText?: () => void;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = 'clamp(2rem, 10vw, 10rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#6495ED', // Unga Cornflower Blue
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  fps = 60,
  direction = 'horizontal',
  transitionDuration = 0,
  className = ''
}) => {
  const canvasRef = useRef<CleanupCanvas>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const computedFontFamily = fontFamily === 'inherit' 
        ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' 
        : fontFamily;

      const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

      try { await document.fonts.load(fontString); } catch { await document.fonts.ready; }
      if (isCancelled) return;

      const text = React.Children.toArray(children).join('') || "404";

      // Offscreen drawing for the effect
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.font = fontString;
      const metrics = offCtx.measureText(text);
      const textWidth = Math.ceil(metrics.width);
      const textHeight = parseInt(fontSizeStr) * 1.5;

      offscreen.width = textWidth + 40;
      offscreen.height = textHeight;

      offCtx.font = fontString;
      offCtx.fillStyle = color;
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, 20, textHeight / 2);

      canvas.width = offscreen.width + fuzzRange;
      canvas.height = offscreen.height + fuzzRange;

      let currentIntensity = baseIntensity;
      let isHovering = false;

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const targetIntensity = isHovering ? hoverIntensity : baseIntensity;
        currentIntensity += (targetIntensity - currentIntensity) * 0.1;

        for (let j = 0; j < offscreen.height; j++) {
          const dx = (Math.random() - 0.5) * fuzzRange * currentIntensity;
          ctx.drawImage(offscreen, 0, j, offscreen.width, 1, dx + 10, j + 10, offscreen.width, 1);
        }
        animationFrameId = requestAnimationFrame(run);
      };

      run();

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        isHovering = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.cleanupFuzzyText = () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    };

    init();
    return () => {
      isCancelled = true;
      if (canvas?.cleanupFuzzyText) canvas.cleanupFuzzyText();
    };
  }, [children, color, fontSize]);

  return <canvas ref={canvasRef} className={className} />;
};

export default FuzzyText;