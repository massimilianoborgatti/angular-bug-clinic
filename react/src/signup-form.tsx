'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
type Field = 'name' | 'email' | 'terms';
const fields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
] as const;
const messages: Record<Field, string> = {
  name: 'Enter your name.',
  email: 'Enter a valid email address.',
  terms: 'Accept the terms to continue.',
};
export function SignupForm({ fixed }: { fixed: boolean }) {
  const [values, setValues] = useState({ name: '', email: '', terms: false });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [success, setSuccess] = useState('');
  const summary = useRef<HTMLElement>(null);
  const brokenSubmit = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (fixed && Object.keys(errors).length) summary.current?.focus();
  }, [errors, fixed]);
  function submit(event?: FormEvent) {
    event?.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = messages.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = messages.email;
    if (!values.terms) next.terms = messages.terms;
    setErrors(next);
    setSuccess(Object.keys(next).length ? '' : 'You are subscribed to the demo newsletter.');
    if (!fixed) brokenSubmit.current?.focus();
  }
  return (
    <section
      className={'signup-demo' + (fixed ? ' signup-fixed' : '')}
      aria-label="Newsletter sign-up"
    >
      <h2>Newsletter sign-up</h2>
      <p className="signup-intro">
        Occasional notes about the task library. This form stores nothing.
      </p>
      {fixed && Object.keys(errors).length > 0 && (
        <section
          role="region"
          className="error-summary"
          tabIndex={-1}
          ref={summary}
          aria-labelledby="signup-error-title"
        >
          <h3 id="signup-error-title">
            There{' '}
            {Object.keys(errors).length === 1
              ? 'is 1 error'
              : 'are ' + Object.keys(errors).length + ' errors'}
          </h3>
          <p>Correct the following fields:</p>
          <ul>
            {(Object.keys(errors) as Field[]).map((key) => (
              <li key={key}>
                <a
                  href={'#signup-' + key}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById('signup-' + key)?.focus();
                  }}
                >
                  {messages[key]}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <form noValidate onSubmit={submit}>
        {fixed && <p className="required-note">All fields are required.</p>}
        {fields.map((field) => (
          <div className="signup-field" key={field.key}>
            {fixed && <label htmlFor={'signup-' + field.key}>{field.label} (required)</label>}
            <input
              id={'signup-' + field.key}
              data-testid={'signup-' + field.key}
              type={field.type}
              placeholder={fixed ? undefined : field.label}
              required={fixed}
              value={values[field.key]}
              aria-invalid={fixed ? Boolean(errors[field.key]) : undefined}
              aria-describedby={
                fixed && errors[field.key] ? 'signup-' + field.key + '-error' : undefined
              }
              className={errors[field.key] ? 'invalid' : ''}
              onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
            />
            {errors[field.key] && (
              <p className="field-error" id={fixed ? 'signup-' + field.key + '-error' : undefined}>
                {fixed ? 'Error: ' : ''}
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
        <div className="signup-field">
          <div className="terms-row">
            <input
              id="signup-terms"
              data-testid="signup-terms"
              type="checkbox"
              required={fixed}
              checked={values.terms}
              aria-invalid={fixed ? Boolean(errors.terms) : undefined}
              aria-describedby={fixed && errors.terms ? 'signup-terms-error' : undefined}
              onChange={(event) => setValues({ ...values, terms: event.target.checked })}
            />
            {fixed ? (
              <label htmlFor="signup-terms">I accept the terms (required)</label>
            ) : (
              <span>I accept the terms</span>
            )}
          </div>
          {errors.terms && (
            <p className="field-error" id={fixed ? 'signup-terms-error' : undefined}>
              {fixed ? 'Error: ' : ''}
              {errors.terms}
            </p>
          )}
        </div>
        {fixed ? (
          <button type="submit" className="primary" data-testid="signup-submit">
            Subscribe
          </button>
        ) : (
          // Broken deliberately uses a focusable div without button semantics or keyboard activation.
          <div
            ref={brokenSubmit}
            tabIndex={0}
            className="broken-submit"
            data-testid="signup-submit"
            onClick={() => submit()}
          >
            Subscribe
          </div>
        )}
      </form>
      {fixed ? (
        <p role="status" className="signup-success">
          {success}
        </p>
      ) : (
        success && <p className="signup-success">{success}</p>
      )}
    </section>
  );
}
