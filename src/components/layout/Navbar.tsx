import { trapDialogFocus } from '../../lib/dialog';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { navigation } from '../../data/navigation';
export function Navbar() {
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((section) => section !== null);
    const scroll = () => {
      setCompact(window.scrollY > 36);
      // Track the section beneath the actual sticky header. Percentage root margins
      // could collapse the old observer band on wide, short viewports and miss Home.
      const marker = (menu.current?.closest('header')?.getBoundingClientRect().bottom ?? 91) + 40;
      const current = sections
        .filter((section) => section.getBoundingClientRect().top <= marker)
        .at(-1);
      setActive(current?.id ?? 'home');
    };
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    menu.current?.showModal();
    const menuTrigger = trigger.current;
    const resize = () => {
      if (innerWidth > 760) menu.current?.close();
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      menuTrigger?.focus();
    };
  }, [open]);
  return (
    <header
      className={`navbar ${compact ? 'is-compact' : ''}`}
      data-theme={active === 'contact' ? 'dark' : 'light'}
    >
      <a className="wordmark" href="#home" aria-label="Mayank, home">
        Mayank<span>.</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'location' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a href="#contact" className="nav-cta">
        LET’S TALK <ArrowUpRight size={15} />
      </a>
      <button
        ref={trigger}
        className={`menu-toggle ${open ? 'is-open' : ''}`}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
      </button>
      <dialog
        ref={menu}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Mobile navigation"
        onKeyDown={trapDialogFocus}
        onClose={() => setOpen(false)}
        data-lenis-prevent
      >
        <div className="mobile-menu-top">
          <span className="wordmark">Mayank.</span>
          <button
            className="circle-icon"
            aria-label="Close navigation menu"
            onClick={() => menu.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation links">
          {navigation.map((item, i) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => menu.current?.close()}>
              <span>0{i + 1}</span>
              {item.label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
        <p>GOOD THINGS START WITH A CONVERSATION.</p>
      </dialog>
    </header>
  );
}
