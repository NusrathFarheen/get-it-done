import { useState, useRef } from 'react';
import { Star, X, Camera, Upload, Loader, Check } from 'lucide-react';
import { useS3Upload } from '../hooks/useS3Upload';
import './ReviewModal.css';

/**
 * ReviewModal — Post-job review with optional photo upload
 * Props:
 *  worker     - worker object { name, initials, gradient, skill }
 *  jobTitle   - string
 *  onSubmit   - callback({ rating, text, photos })
 *  onClose    - close handler
 */
export default function ReviewModal({ worker, jobTitle, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [previewPhotos, setPreviewPhotos] = useState([]);  // { url, file, id }
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { uploadFiles, uploading } = useS3Upload();

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  const handlePhotos = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 3 - previewPhotos.length);
    const newPreviews = valid.map(f => ({
      id: `rv-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setPreviewPhotos(prev => [...prev, ...newPreviews].slice(0, 3));
  };

  const removePhoto = (id) => {
    setPreviewPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async () => {
    if (!rating) return setError('Please select a star rating.');
    if (text.trim().length < 10) return setError('Please write at least 10 characters.');
    setError('');
    setSubmitting(true);
    try {
      let photoUrls = [];
      if (previewPhotos.length > 0) {
        const files = previewPhotos.map(p => p.file);
        photoUrls = await uploadFiles(files, 'reviews', worker?.id || 'anon');
      }
      await new Promise(r => setTimeout(r, 600)); // simulate DB write
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSubmit?.({ rating, text, photos: photoUrls });
        onClose?.();
      }, 2000);
    } catch (e) {
      setSubmitting(false);
      setError('Failed to submit review. Please try again.');
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="review-overlay" id="review-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="review-modal glass-card" id="review-modal">

        {/* Close */}
        <button className="review__close" id="review-close" onClick={onClose}><X size={18} /></button>

        {submitted ? (
          <div className="review__success">
            <div className="review__success-icon"><Check size={28} /></div>
            <div className="review__success-title">Review submitted! 🎉</div>
            <div className="review__success-sub">Thank you for helping the community.</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="review__header">
              <div className="review__worker-avatar" style={{ background: worker?.gradient }}>
                {worker?.initials}
              </div>
              <div>
                <div className="review__modal-title">Leave a Review</div>
                <div className="review__worker-name">{worker?.name} · {worker?.skill}</div>
                {jobTitle && <div className="review__job-title">📋 {jobTitle}</div>}
              </div>
            </div>

            {/* Stars */}
            <div className="review__stars-wrap">
              <div className="review__stars" id="review-stars" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    id={`review-star-${i}`}
                    className={`review__star ${i <= displayRating ? 'review__star--active' : ''}`}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => { setRating(i); setError(''); }}
                    aria-label={`${i} star${i > 1 ? 's' : ''}`}
                  >
                    <Star size={32} fill={i <= displayRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <div className={`review__stars-label ${displayRating ? 'review__stars-label--visible' : ''}`}>
                {LABELS[displayRating]}
              </div>
            </div>

            {/* Text */}
            <div className="review__field">
              <label className="review__label" htmlFor="review-text">
                Your Review
                <span className="review__label-hint"> — {text.length}/300</span>
              </label>
              <textarea
                id="review-text"
                className="review__textarea"
                placeholder={`How was ${worker?.name?.split(' ')[0]}'s work? What did they do well?`}
                value={text}
                onChange={e => { setText(e.target.value.slice(0, 300)); setError(''); }}
                rows={4}
              />
            </div>

            {/* Photo upload */}
            <div className="review__photos-section">
              <div className="review__photos-label">
                <Camera size={14} /> Add Photos
                <span className="review__label-hint"> (optional, max 3)</span>
              </div>
              <div className="review__photos-grid">
                {previewPhotos.map(p => (
                  <div key={p.id} className="review__photo-thumb" id={`review-photo-${p.id}`}>
                    <img src={p.url} alt="Review" />
                    <button
                      className="review__photo-remove"
                      onClick={() => removePhoto(p.id)}
                      aria-label="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {previewPhotos.length < 3 && (
                  <button
                    className="review__photo-add"
                    id="review-add-photo"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader size={18} className="review__spin" /> : <Upload size={18} />}
                    <span>{uploading ? 'Uploading…' : 'Add Photo'}</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                id="review-file-input"
                onChange={e => handlePhotos(e.target.files)}
              />
              <div className="review__photos-note">
                Photos show on the worker's profile and help other clients make decisions.
              </div>
            </div>

            {error && <div className="review__error" id="review-error">{error}</div>}

            <button
              className="btn btn-primary review__submit"
              id="review-submit-btn"
              onClick={handleSubmit}
              disabled={submitting || uploading || !rating}
            >
              {submitting ? <><span className="review__spinner" /> Submitting…</> : 'Submit Review'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
