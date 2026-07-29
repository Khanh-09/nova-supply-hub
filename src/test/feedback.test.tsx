import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackWidget from '../components/FeedbackWidget';
import { ToastProvider } from '../context/ToastContext';

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));

function renderWidget() {
  return render(
    <ToastProvider>
      <FeedbackWidget />
    </ToastProvider>
  );
}

describe('Feedback widget', () => {
  it('opens the feedback form when the FAB is clicked', () => {
    renderWidget();
    fireEvent.click(screen.getByRole('button', { name: /give feedback/i }));
    expect(screen.getByRole('dialog', { name: /share your feedback/i })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('requires a rating before submitting', async () => {
    renderWidget();
    fireEvent.click(screen.getByRole('button', { name: /give feedback/i }));
    fireEvent.click(screen.getByRole('button', { name: /send feedback/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/pick a rating/i);
    });
  });

  it('warns when no feedback endpoint is configured', async () => {
    renderWidget();
    fireEvent.click(screen.getByRole('button', { name: /give feedback/i }));
    fireEvent.click(screen.getByRole('radio', { name: '3 stars' }));
    fireEvent.click(screen.getByRole('button', { name: /send feedback/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/not configured/i);
    });
  });
});
