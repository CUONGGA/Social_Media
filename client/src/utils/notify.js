import { emitToast } from './toastBus';

export function notifySuccess(message) {
  emitToast('success', message);
}

export function notifyError(message) {
  emitToast('error', message || 'Something went wrong');
}

export function notifyInfo(message) {
  emitToast('info', message);
}

/** Lấy thông báo lỗi từ response axios / Error */
export function axiosErrorMessage(error, fallback = 'Request failed') {
  const status = error?.response?.status;
  const d = error?.response?.data;
  if (typeof d === 'string' && d.trim()) return d;
  if (d && typeof d === 'object' && d.message != null) {
    const m = d.message;
    return Array.isArray(m) ? m.filter(Boolean).join(', ') : String(m);
  }
  if (status === 401) return 'Please sign in to continue.';
  if (status === 404) return 'Resource not found.';
  if (status === 409) return 'Could not complete (conflict).';
  if (error?.message && typeof error.message === 'string') return error.message;
  return fallback;
}
