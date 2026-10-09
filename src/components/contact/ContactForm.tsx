import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { createContactMailto } from '../../lib/contact';
import { Button } from '../ui/Button';
export function ContactForm() {
  const [status, setStatus] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = createContactMailto({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    setStatus('Your email app will open with this message. Please send it from there.');
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            placeholder="Alex Johnson"
            required
            maxLength={100}
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        What’s on your mind?
        <textarea
          name="message"
          rows={3}
          placeholder="An idea, an opportunity, or just a hello…"
          required
          maxLength={5000}
        />
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
