/** Kích thước hiển thị ≤ cap, không bao giờ phóng rộng hơn ảnh gốc → tránh mờ do upscale. */
export function intrinsicDisplaySize(naturalW, naturalH, capW, capH) {
  if (!naturalW || !naturalH) return null;
  let w = Math.min(capW, naturalW);
  let h = Math.round((naturalH / naturalW) * w);
  if (h > capH) {
    h = capH;
    w = Math.round((naturalW / naturalH) * h);
  }
  return { width: w, height: h };
}
