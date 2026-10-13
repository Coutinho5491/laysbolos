export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Rola até a seção respeitando o cabeçalho fixo (scroll-margin-top no CSS) e a preferência de movimento. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', id === 'inicio' ? location.pathname : `#${id}`);
}
