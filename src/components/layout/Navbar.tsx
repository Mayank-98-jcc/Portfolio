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
    const scroll = () => setCompact(window.scrollY > 36);
    window.addEventListener('scroll', scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -60% 0px' },
    );
    navigation.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', scroll);
      observer.disconnect();
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
    <header className={`navbar ${compact ? 'is-compact' : ''}`}>
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
