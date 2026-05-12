let notifier = null;

/** Gọi từ ToastProvider khi mount; fn(severity, payload). Truyền null khi unmount. */
export function registerToastNotifier(fn) {
  notifier = typeof fn === 'function' ? fn : null;
}

/**
 * severity: 'success' | 'error' | 'info' | 'warning'
 * payload: string hoặc { title?: string, body?: string, message?: string }
 */
export function emitToast(severity, payload) {
  if (typeof notifier === 'function') notifier(severity, payload);
}
