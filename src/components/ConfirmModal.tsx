import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  themeColor?: string;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean; isLandscape: boolean };
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  themeColor = '#10B981',
  deviceInfo
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ padding: deviceInfo.isPhone ? '1rem' : '1.5rem' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[23.3vw] bg-slate-900 border-0.1vh solid rounded-[1.66vw] p-[1.66vw] shadow-2xl overflow-hidden"
            style={{ borderColor: themeColor, borderWidth: '0.1vh' }}
          >
            <div className="absolute top-0 left-0 w-full h-[0.1vh]" style={{ backgroundColor: themeColor }} />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center border-2"
                style={{ borderColor: themeColor + '33', backgroundColor: themeColor + '11' }}
              >
                <AlertTriangle className="w-8 h-8" style={{ color: themeColor }} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{message}</p>
              </div>

              <div 
                className="flex gap-3 w-full pt-4"
                style={{ flexDirection: deviceInfo.isPhone ? 'column' : 'row' }}
              >
                <Tooltip text="Go Back" position="top">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-slate-700"
                  >
                    {cancelText}
                  </button>
                </Tooltip>
                <Tooltip text="Proceed with Action" position="top">
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="flex-1 px-6 py-4 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg"
                    style={{ backgroundColor: themeColor }}
                  >
                    {confirmText}
                  </button>
                </Tooltip>
              </div>
            </div>

            <Tooltip text="Close" position="left">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </Tooltip>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
