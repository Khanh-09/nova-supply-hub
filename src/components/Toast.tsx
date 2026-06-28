import type { ToastMessage } from '../context/ToastContext';

const ICONS: Record<ToastMessage['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

interface ToastProps {
  toast: ToastMessage;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span className="toast-icon" aria-hidden="true">
        {ICONS[toast.type]}
      </span>
      <div className="toast-body">
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>
      <button type="button" className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
