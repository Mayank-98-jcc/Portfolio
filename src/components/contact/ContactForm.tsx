import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { createContactMailto } from '../../lib/contact';
import { Button } from '../ui/Button';
export function ContactForm() {
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };
    const next: Record<string, string> = {};
    if (!fields.name) next.name = 'Please enter your name.';
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (!fields.email || emailInput.validity.typeMismatch)
      next.email = 'Please enter a valid email address.';
    if (!fields.message) next.message = 'Please write a message.';
    setErrors(next);
    setStatus('');
    if (Object.keys(next).length) {
      (event.currentTarget.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus();
      return;
    }
    window.location.href = createContactMailto(fields);
    setStatus('Your email app will open with this message. Please send it from there.');
  }
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>
          Your name
          <input
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            name="name"
            autoComplete="name"
            placeholder="Alex Johnson"
            required
            maxLength={100}
          />
          {errors.name && (
            <span className="field-error" id="contact-name-error">
              {errors.name}
            </span>
          )}
        </label>
        <label>
          Email address
          <input
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            required
            maxLength={254}
          />
          {errors.email && (
            <span className="field-error" id="contact-email-error">
              {errors.email}
            </span>
          )}
        </label>
      </div>
      <label>
        What’s on your mind?
        <textarea
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          name="message"
          rows={3}
          placeholder="An idea, an opportunity, or just a hello…"
          required
          maxLength={5000}
        />
        {errors.message && (
          <span className="field-error" id="contact-message-error">
            {errors.message}
          </span>
        )}
      </label>
      <div className="form-bottom">
        <span>
          Opens your email app.
          <br />
          No message is sent automatically.
        </span>
        <Button type="submit">
          Open email draft
          <ArrowUpRight size={16} />
        </Button>
      </div>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
