import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { trapDialogFocus } from '../../lib/dialog';
import { siteConfig } from '../../data/site';

export function HeroIntro({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => previous?.focus({ preventScroll: true });
  }, []);
  return (
    <dialog
      ref={dialog}
      className="intro-dialog"
      aria-labelledby="intro-title"
      onClose={onClose}
      onKeyDown={trapDialogFocus}
      data-lenis-prevent
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
    >
      <div className="intro-content">
        <button
          className="modal-close"
          aria-label="Close introduction"
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          <X size={21} />
        </button>
        <p className="eyebrow">A QUICK INTRODUCTION</p>
        <h2 id="intro-title">
          Curious mind.
          <br />
          <em>Builder at heart.</em>
        </h2>
        <p>{siteConfig.introduction}</p>
        <p>
          I’m exploring Generative AI, working on CodeMentor AI, and continuing to learn through
          projects like ResumeIQ and OceanXplore.
        </p>
        <p>{siteConfig.contact}</p>
        <button
          className="text-link"
          onClick={() => {
            dialog.current?.close();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' });
          }}
        >
          Explore my projects <ArrowUpRight size={16} />
        </button>
      </div>
    </dialog>
  );
}
