import React, { useState, useRef, useLayoutEffect } from 'react';

interface FittingTextProps {
  text: string;
  className?: string;
  maxFontSize?: number;
  minFontSize?: number;
  vertical?: boolean;
  style?: React.CSSProperties;
  fontSize?: number;
  onFontSizeCalculated?: (size: number) => void;
}

export const FittingText: React.FC<FittingTextProps> = ({ 
  text, 
  className = "", 
  maxFontSize = 32, 
  minFontSize = 8,
  vertical = false,
  style = {},
  fontSize: forcedFontSize,
  onFontSizeCalculated
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [internalFontSize, setInternalFontSize] = useState(maxFontSize);

  // The size we actually use for rendering is the forced one (sync) or our own best fit
  const currentFontSize = forcedFontSize !== undefined ? forcedFontSize : internalFontSize;

  const onFontSizeCalculatedRef = useRef(onFontSizeCalculated);
  onFontSizeCalculatedRef.current = onFontSizeCalculated;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const adjustFontSize = () => {
      const cW = container.clientWidth;
      const cH = container.clientHeight;
      
      if (cW === 0 || cH === 0) return;

      const measureEl = document.createElement('span');
      measureEl.style.visibility = 'hidden';
      measureEl.style.position = 'absolute';
      measureEl.style.whiteSpace = 'nowrap';
      measureEl.style.textTransform = 'uppercase';
      measureEl.className = className;
      if (vertical) measureEl.classList.add('vertical-text');
      measureEl.textContent = text;
      document.body.appendChild(measureEl);

      let low = minFontSize;
      let high = maxFontSize;
      let bestSize = minFontSize;

      const checkOverflow = (size: number) => {
        // Measure using pixels to be precise and avoid Vh calculation delays
        const pxSize = size * 0.0925 * (window.innerHeight / 100);
        measureEl.style.fontSize = `${pxSize}px`;
        measureEl.style.lineHeight = '1';
        const rect = measureEl.getBoundingClientRect();
        return rect.width > (cW + 0.1) || rect.height > (cH + 0.1);
      };

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (checkOverflow(mid)) {
          high = mid - 1;
        } else {
          bestSize = mid;
          low = mid + 1;
        }
      }

      document.body.removeChild(measureEl);
      
      setInternalFontSize(bestSize);
      if (onFontSizeCalculatedRef.current) {
        onFontSizeCalculatedRef.current(bestSize);
      }
    };

    const resizeObserver = new ResizeObserver(adjustFontSize);
    resizeObserver.observe(container);
    
    // Initial calculation
    adjustFontSize();
    
    // Extra checks for hydration/layout shifts
    const timer1 = setTimeout(adjustFontSize, 100);
    const timer2 = setTimeout(adjustFontSize, 500);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [text, maxFontSize, minFontSize, vertical, className]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={style}
    >
      <span 
        ref={textRef} 
        className="whitespace-nowrap transition-all duration-300 text-center"
        style={{ 
          fontSize: `${currentFontSize * 0.0925}vh`,
          lineHeight: '1'
        }}
      >
        {text}
      </span>
    </div>
  );
};
