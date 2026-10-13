import { useCallback, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';

const EXIT_MS = 260;
let openCount = 0;

function lockScroll(lock: boolean) {
  const root = document.documentElement;
  const wasLocked = openCount > 0;
  openCount = Math.max(0, openCount + (lock ? 1 : -1));
  if (openCount > 0 && !wasLocked) {
    // Compensa a barra de rolagem que some, evitando que o conteúdo "pule"
    root.style.paddingRight = `${window.innerWidth - root.clientWidth}px`;
    root.classList.add('scroll-locked');
  } else if (openCount === 0) {
    root.style.paddingRight = '';
    root.classList.remove('scroll-locked');
  }
}

/**
 * Controla um <dialog> nativo (foco preso, Escape, camada superior) com animação de saída.
 * `open` é a fonte da verdade; `onClose` é chamado quando o usuário pede para fechar.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.classList.remove('is-closing');
      dialog.showModal();
      lockScroll(true);
    } else if (!open && dialog.open) {
      const finish = () => {
        dialog.classList.remove('is-closing');
        dialog.close();
        lockScroll(false);
        returnFocus.current?.focus({ preventScroll: true });
      };
      if (prefersReducedMotion()) finish();
      else {
        dialog.classList.add('is-closing');
        const t = window.setTimeout(finish, EXIT_MS);
        return () => window.clearTimeout(t);
      }
    }
  }, [open]);

  // Garante liberação do scroll se o componente desmontar aberto
  useEffect(
    () => () => {
      if (ref.current?.open) lockScroll(false);
    },
    [],
  );

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Escape dispara "cancel": interceptamos para animar a saída
    const onCancel = (e: Event) => {
      e.preventDefault();
      onCloseRef.current();
    };
    // Clique no backdrop (fora do conteúdo) fecha
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) onCloseRef.current();
    };
    dialog.addEventListener('cancel', onCancel);
    dialog.addEventListener('click', onClick);
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      dialog.removeEventListener('click', onClick);
    };
  }, []);

  const requestClose = useCallback(() => onCloseRef.current(), []);
  return { ref, requestClose };
}
