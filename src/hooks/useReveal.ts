import { useEffect, useRef } from 'react';

// Um único IntersectionObserver para todos os elementos que revelam no scroll.
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer!.unobserve(entry.target);
          }
        }
      },
      // Limiar baixo: elementos mais altos que a tela também precisam disparar
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );
  }
  return observer;
}

/** Adiciona `.is-visible` quando o elemento entra no viewport (uma única vez). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const obs = getObserver();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return ref;
}
