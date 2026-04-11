import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  themeColor?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  themeColor = '#10B981'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-md bg-slate-900 border-2 rounded-[32px] p-8 shadow-2xl overflow-hidden"
            style={{ borderColor: themeColor }}
          >
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: themeColor }} />
            
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

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-slate-700"
                >
                  {cancelText}
                </button>
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
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
