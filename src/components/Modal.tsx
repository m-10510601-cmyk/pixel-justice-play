import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
}

const Modal = ({ open, onClose, title, children, dismissible = true }: ModalProps) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={() => dismissible && onClose?.()}
    >
      <div
        className="pixel-frame w-full max-w-sm max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="pixel text-[11px] text-primary text-glow text-center px-3 py-3 border-b-4 border-primary/60">
            {title}
          </div>
        )}
        <div className="overflow-y-auto p-4 flex-1">{children}</div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-secondary text-[10px] m-3"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;