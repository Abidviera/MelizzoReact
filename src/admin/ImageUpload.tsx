import { useState, useRef, useCallback } from 'react';
import { uploadImage, deleteImage } from '../services/uploadService';

export interface ImageEntry {
  url: string;
  alt: string;
}

interface Props {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 10 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (images.length + files.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed.`);
        return;
      }

      setUploading(true);
      setError(null);

      for (const file of Array.from(files)) {
        const result = await uploadImage(file, setUploadProgress);
        if (result.success) {
          onChange([...images, { url: result.data.url, alt: file.name }]);
        } else {
          setError(result.error);
        }
      }

      setUploading(false);
      setUploadProgress(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, maxImages, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    async (idx: number) => {
      const img = images[idx];
      // Extract filename from URL to delete from server
      const parts = img.url.split('/');
      const fileName = parts[parts.length - 1];
      // Don't await — delete in background
      deleteImage(fileName).catch(() => {/* ignore */});

      const updated = images.filter((_, i) => i !== idx);
      onChange(updated);
    },
    [images, onChange],
  );

  return (
    <div className="image-upload">
      {/* Drop Zone */}
      <div
        className={`image-upload__dropzone${dragOver ? ' image-upload__dropzone--over' : ''}${uploading ? ' image-upload__dropzone--uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload product images"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <div className="image-upload__spinner" />
            <span className="image-upload__hint">Uploading… {uploadProgress}%</span>
          </>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="image-upload__hint">
              Drop images here or <strong>click to browse</strong>
            </span>
            <span className="image-upload__subhint">JPEG, PNG, WebP, BMP — max 10 MB each</span>
          </>
        )}
      </div>

      {error && <p className="image-upload__error">{error}</p>}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="image-upload__grid">
          {images.map((img, idx) => (
            <div key={`${img.url}-${idx}`} className="image-upload__thumb">
              <img
                src={img.url}
                alt={img.alt || `Product image ${idx + 1}`}
                className="image-upload__thumb-img"
              />
              <button
                type="button"
                className="image-upload__remove"
                onClick={() => handleRemove(idx)}
                aria-label={`Remove image ${idx + 1}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {idx === 0 && <span className="image-upload__primary-badge">Cover</span>}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .image-upload__dropzone {
          border: 2px dashed #c8a064;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s;
          color: #c8a064;
          text-align: center;
        }
        .image-upload__dropzone:hover,
        .image-upload__dropzone--over {
          background: rgba(200, 160, 100, 0.08);
          border-color: #a07830;
        }
        .image-upload__dropzone--uploading {
          cursor: default;
          opacity: 0.7;
        }
        .image-upload__hint { font-size: 14px; color: #555; }
        .image-upload__hint strong { color: #c8a064; }
        .image-upload__subhint { font-size: 12px; color: #999; }
        .image-upload__spinner {
          width: 28px; height: 28px;
          border: 3px solid rgba(200, 160, 100, 0.3);
          border-top-color: #c8a064;
          border-radius: 50%;
          animation: image-upload-spin 0.8s linear infinite;
        }
        @keyframes image-upload-spin { to { transform: rotate(360deg); } }
        .image-upload__error { color: #d32f2f; font-size: 13px; margin-top: 4px; }
        .image-upload__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
          margin-top: 12px;
        }
        .image-upload__thumb {
          position: relative;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }
        .image-upload__thumb-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .image-upload__remove {
          position: absolute; top: 4px; right: 4px;
          background: rgba(0,0,0,0.55);
          color: white;
          border: none; border-radius: 50%;
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .image-upload__remove:hover { background: rgba(211,47,47,0.85); }
        .image-upload__primary-badge {
          position: absolute; bottom: 4px; left: 4px;
          background: #3A6E5F;
          color: white;
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
