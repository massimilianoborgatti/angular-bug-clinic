import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SignupForm } from './signup-form';
for (const fixed of [false, true])
  describe('09 ' + (fixed ? 'Fixed' : 'Broken'), () => {
    const invariant = fixed ? it : it.fails;
    invariant('names every field with an explicit label', () => {
      render(<SignupForm fixed={fixed} />);
      expect(screen.getByRole('textbox', { name: /Name/ })).toBeVisible();
      expect(screen.getByRole('textbox', { name: /Email/ })).toBeVisible();
      expect(screen.getByRole('checkbox', { name: /I accept the terms/ })).toBeVisible();
    });
    invariant('links invalid fields to errors and focuses the summary', async () => {
      render(<SignupForm fixed={fixed} />);
      fireEvent.click(screen.getByTestId('signup-submit'));
      await waitFor(() => {
        const summary = document.querySelector('.error-summary');
        expect(summary).not.toBeNull();
        expect(summary).toHaveFocus();
      });
      for (const id of ['name', 'email', 'terms']) {
        const field = screen.getByTestId('signup-' + id);
        expect(field).toHaveAttribute('aria-invalid', 'true');
        expect(field).toHaveAccessibleDescription(/Enter|Accept/);
      }
    });
    invariant('announces successful subscription', async () => {
      render(<SignupForm fixed={fixed} />);
      fireEvent.change(screen.getByTestId('signup-name'), { target: { value: 'Demo contact' } });
      fireEvent.change(screen.getByTestId('signup-email'), {
        target: { value: 'contact@example.test' },
      });
      fireEvent.click(screen.getByTestId('signup-terms'));
      fireEvent.click(screen.getByTestId('signup-submit'));
      expect(await screen.findByRole('status')).toHaveTextContent('You are subscribed');
    });
  });
it('Broken visibly shows errors without labels, descriptions, status or a keyboard button', () => {
  render(<SignupForm fixed={false} />);
  fireEvent.click(screen.getByTestId('signup-submit'));
  expect(screen.getByText('Enter your name.')).toBeVisible();
  expect(screen.getByTestId('signup-name')).not.toHaveAttribute('aria-describedby');
  expect(screen.getByTestId('signup-terms')).not.toHaveAccessibleName();
  expect(screen.queryByRole('button', { name: 'Subscribe' })).not.toBeInTheDocument();
  expect(screen.getByTestId('signup-submit')).toHaveFocus();
});
it('Fixed summary links focus the field and repeated invalid submits return to the summary', async () => {
  render(<SignupForm fixed />);
  fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
  await waitFor(() => expect(document.querySelector('.error-summary')).toHaveFocus());
  fireEvent.click(screen.getByRole('link', { name: 'Enter your name.' }));
  expect(screen.getByRole('textbox', { name: /Name/ })).toHaveFocus();
  fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), {
    target: { value: 'Demo contact' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
  await waitFor(() => expect(document.querySelector('.error-summary')).toHaveFocus());
  expect(screen.getByRole('heading', { name: 'There are 2 errors' })).toBeVisible();
  expect(screen.getByTestId('signup-name')).toHaveAttribute('aria-invalid', 'false');
});
