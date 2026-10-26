export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 3 * 1024 * 1024;
export const MAX_REQUEST_BYTES = 4.25 * 1024 * 1024;
export const FILE_TYPES = { 'application/pdf': ['pdf'], 'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/webp': ['webp'] };
export function fileSelectionError(files) {
  if (files.length > MAX_FILES) return 'Attach up to 3 files.';
  let total = 0;
  for (const file of files) {
    const extension = file.name?.split('.').pop().toLowerCase();
    if (!FILE_TYPES[file.type]?.includes(extension)) return 'Use JPG, PNG, WebP images or PDF files.';
    if (!file.size) return 'Empty files cannot be attached.';
    if (file.size > MAX_FILE_BYTES) return 'Each file must be 2 MB or smaller.';
    total += file.size;
  }
  return total > MAX_TOTAL_BYTES ? 'Combined attachment size must be 3 MB or smaller.' : '';
}
