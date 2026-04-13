import React, { useState, useRef, useEffect } from 'react';

interface FittingTextProps {
  text: string;
  className?: string;
  maxFontSize?: number;
  minFontSize?: number;
  vertical?: boolean;
  style?: React.CSSProperties;
}

export const FittingText: React.FC<FittingTextProps> = ({ 
  text, 
  className = "", 
  maxFontSize = 32, 
  minFontSize = 8,
  vertical = false,
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    if (!container || !textElement) return;

    const adjustFontSize = () => {
      let currentSize = maxFontSize;
      setFontSize(currentSize);
      
      requestAnimationFrame(() => {
        if (!textRef.current || !containerRef.current) return;
        
        const isOverflowing = vertical 
          ? textRef.current.scrollHeight > containerRef.current.clientHeight
          : textRef.current.scrollWidth > containerRef.current.clientWidth;

        while (
          (vertical 
            ? textRef.current.scrollHeight > containerRef.current.clientHeight 
            : textRef.current.scrollWidth > containerRef.current.clientWidth) && 
          currentSize > minFontSize
        ) {
          currentSize -= 1;
          textRef.current.style.fontSize = `${currentSize}px`;
        }
        setFontSize(currentSize);
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      adjustFontSize();
    });

    resizeObserver.observe(container);
    adjustFontSize(); // Initial adjustment

    return () => {
      resizeObserver.disconnect();
    };
  }, [text, maxFontSize, minFontSize]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full flex items-center overflow-hidden ${className}`}
      style={style}
    >
      <span 
        ref={textRef} 
        className="whitespace-nowrap transition-[font-size] duration-200"
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </span>
    </div>
  );
};
