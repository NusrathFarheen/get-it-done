import { useState, useRef } from 'react';
import { Camera, X, ZoomIn, Upload, Plus, Loader } from 'lucide-react';
import { useS3Upload } from '../hooks/useS3Upload';
import { isS3Configured } from '../amplify-config';
import './PortfolioGallery.css';

/**
 * PortfolioGallery
 * Props:
 *   photos     - array of { id, url, caption, uploadedAt }
 *   workerId   - for S3 path scoping
 *   isOwner    - show upload button if true
 *   onUpload   - callback(newPhotos) when new photos added
 */
export default function PortfolioGallery({ photos = [], workerId = '', isOwner = false, onUpload }) {
  const [lightbox, setLightbox] = useState(null); // index of open photo
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadFiles, uploading, uploadError } = useS3Upload();

  const handleFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 6);
    if (!valid.length) return;
    try {
      const urls = await uploadFiles(valid, 'portfolio', workerId);
      const newPhotos = urls.map((url, i) => ({
        id: `p${Date.now()}-${i}`,
        url,
        caption: valid[i].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        uploadedAt: 'Just now',
      }));
      const merged = [...localPhotos, ...newPhotos];
      setLocalPhotos(merged);
      onUpload?.(merged);
    } catch (e) {
      console.error('Upload failed', e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (id) => {
    setLocalPhotos(prev => prev.filter(p => p.id !== id));
  };

  const prev = () => setLightbox(i => (i > 0 ? i - 1 : localPhotos.length - 1));
  const next = () => setLightbox(i => (i < localPhotos.length - 1 ? i + 1 : 0));

  return (
    <div className="portfolio" id="portfolio-gallery">
      {/* Header */}
      <div className="portfolio__header">
        <div>
          <h3 className="portfolio__title">Portfolio</h3>
          <p className="portfolio__sub">{localPhotos.length} work{localPhotos.length !== 1 ? 's' : ''} showcased</p>
        </div>
        {isOwner && (
          <button
            className="btn btn-secondary portfolio__upload-btn"
            id="portfolio-upload-trigger"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader size={14} className="portfolio__spin" /> : <Plus size={14} />}
            {uploading ? 'Uploading…' : 'Add Photos'}
          </button>
        )}
      </div>

      {uploadError && (
        <div className="portfolio__error">{uploadError}</div>
      )}

      {/* S3 mode indicator */}
      {isOwner && (
        <div className="portfolio__storage-note">
          {isS3Configured()
            ? '☁️ Storing in your S3 bucket'
            : '🔄 Mock mode — photos stored locally. Set up S3 to persist.'}
        </div>
      )}

      {/* Grid */}
      {localPhotos.length > 0 ? (
        <div className="portfolio__grid" id="portfolio-grid">
          {localPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              className={`portfolio__item portfolio__item--${(idx % 5 === 0 || idx % 5 === 3) ? 'wide' : 'normal'}`}
              id={`portfolio-item-${photo.id}`}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="portfolio__img"
                loading="lazy"
                onClick={() => setLightbox(idx)}
              />
              <div className="portfolio__overlay" onClick={() => setLightbox(idx)}>
                <ZoomIn size={20} />
                {photo.caption && <span className="portfolio__caption">{photo.caption}</span>}
              </div>
              {isOwner && (
                <button
                  className="portfolio__remove"
                  onClick={e => { e.stopPropagation(); removePhoto(photo.id); }}
                  aria-label="Remove photo"
                  id={`remove-photo-${photo.id}`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}

          {/* Upload drop zone tile */}
          {isOwner && (
            <div
              className={`portfolio__drop-tile ${dragOver ? 'portfolio__drop-tile--over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="portfolio-drop-tile"
            >
              <Upload size={22} />
              <span>Drop photos<br />or click</span>
            </div>
          )}
        </div>
      ) : (
        /* Empty state / full drop zone */
        <div
          className={`portfolio__empty ${dragOver ? 'portfolio__empty--over' : ''} ${isOwner ? 'portfolio__empty--clickable' : ''}`}
          onDragOver={e => { if (isOwner) { e.preventDefault(); setDragOver(true); } }}
          onDragLeave={() => setDragOver(false)}
          onDrop={isOwner ? handleDrop : undefined}
          onClick={isOwner ? () => fileInputRef.current?.click() : undefined}
          id="portfolio-empty"
        >
          <Camera size={36} className="portfolio__empty-icon" />
          <div className="portfolio__empty-title">
            {isOwner ? 'Showcase your work' : 'No portfolio yet'}
          </div>
          <div className="portfolio__empty-sub">
            {isOwner
              ? 'Drag & drop photos here, or click to browse. Supported: JPG, PNG, WEBP'
              : 'This worker hasn\'t added portfolio photos yet.'}
          </div>
          {isOwner && <div className="portfolio__empty-hint">Stored in AWS S3 when configured</div>}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        id="portfolio-file-input"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Lightbox */}
      {lightbox !== null && localPhotos[lightbox] && (
        <div className="portfolio__lightbox" id="portfolio-lightbox" onClick={() => setLightbox(null)}>
          <button className="portfolio__lb-close" id="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <button className="portfolio__lb-nav portfolio__lb-prev" id="lightbox-prev"
            onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
          <div className="portfolio__lb-content" onClick={e => e.stopPropagation()}>
            <img
              src={localPhotos[lightbox].url}
              alt={localPhotos[lightbox].caption}
              className="portfolio__lb-img"
            />
            {localPhotos[lightbox].caption && (
              <div className="portfolio__lb-caption">{localPhotos[lightbox].caption}</div>
            )}
            <div className="portfolio__lb-counter">
              {lightbox + 1} / {localPhotos.length}
            </div>
          </div>
          <button className="portfolio__lb-nav portfolio__lb-next" id="lightbox-next"
            onClick={e => { e.stopPropagation(); next(); }}>›</button>
        </div>
      )}
    </div>
  );
}
