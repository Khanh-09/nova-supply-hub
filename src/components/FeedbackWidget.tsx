import { useCallback, useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { useToast } from '../context/ToastContext';

const FEEDBACK_ENDPOINT = (import.meta.env.VITE_FEEDBACK_FORM_ENDPOINT || '').trim();

export default function FeedbackWidget() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const close = useCallback(() => {
    if (submitting) return;
    setOpen(false);
  }, [submitting]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      showToast({ type: 'warning', title: 'Please pick a rating first.' });
      return;
    }
    if (!FEEDBACK_ENDPOINT) {
      showToast({
        type: 'error',
        title: 'Feedback form is not configured',
        message: 'Set VITE_FEEDBACK_FORM_ENDPOINT to a Formspree endpoint URL.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, page: window.location.href }),
      });
      if (!res.ok) throw new Error(`Form submission failed (${res.status})`);

      track('feedback_submitted', { rating });
      showToast({ type: 'success', title: 'Thanks for the feedback!' });
      setRating(0);
      setComment('');
      setOpen(false);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not send feedback',
        message: (err as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-label="Give feedback"
      >
        💬 Feedback
      </button>

      {open && (
        <div
          className="modal-overlay animate-fade"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="modal glass animate-slide-up">
            <button type="button" className="modal-close" onClick={close} aria-label="Close">
              ×
            </button>

            <div className="modal-header">
              <span className="modal-emoji">💬</span>
              <div>
                <h3 id="feedback-modal-title">Share your feedback</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="feedback-rating" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`feedback-star ${n <= rating ? 'active' : ''}`}
                    aria-checked={n === rating}
                    role="radio"
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    onClick={() => setRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="feedback-textarea"
                placeholder="What worked well? What was confusing?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
