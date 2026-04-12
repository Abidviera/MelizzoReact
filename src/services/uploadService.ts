import apiClient from './apiClient';

export interface UploadResponse {
  url: string;
  thumbnailUrl: string;
  fileName: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ success: true; data: UploadResponse } | { success: false; error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `File type "${file.type}" is not supported. Use JPEG, PNG, WebP, or BMP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds the 10 MB limit.`,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });

    return { success: true, data: response.data };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return {
      success: false,
      error: error.response?.data?.message ?? 'Upload failed. Please try again.',
    };
  }
}

export async function deleteImage(fileName: string): Promise<boolean> {
  try {
    await apiClient.delete(`/upload/image/${fileName}`);
    return true;
  } catch {
    return false;
  }
}
