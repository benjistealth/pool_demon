import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top',
  delay = 0.3
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`fixed z-[9999] px-3 py-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl pointer-events-none whitespace-nowrap ${getPositionClasses()}`}
            style={{ 
              position: 'absolute',
              zIndex: 10000 
            }}
          >
            <span className="text-[10px] md:text-xs font-bold text-slate-100 tracking-wider uppercase">
              {text}
            </span>
            {/* Arrow */}
            <div 
              className={`absolute w-2 h-2 bg-slate-900 border-r border-b border-slate-700/50 rotate-45 ${
                position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 rotate-[225deg]' :
                position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 rotate-[-45deg]' :
                'left-[-5px] top-1/2 -translate-y-1/2 rotate-[135deg]'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
