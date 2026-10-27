/*
  `link` action — Svelte 5 runes replacement for svelte-routing's link.

  Usage: <a use:link href="/collections"> or <a use:link={href}>
  Clicking pushes the href into history and dispatches a popstate event so the
  Router re-matches the current path. Modifier/middle clicks fall through to
  default browser behaviour.
*/
export function link(
  node: HTMLAnchorElement,
  arg?: string | { href?: string } | undefined
): { destroy(): void } {
  const resolveHref = (): string => {
    if (typeof arg === 'string') return arg;
    if (arg && typeof arg === 'object') return arg.href ?? '';
    return node.getAttribute('href') ?? '';
  };

  function onClick(e: MouseEvent): void {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    const to = resolveHref();
    if (!to || to === '#') return;

    e.preventDefault();
    history.pushState(null, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  node.addEventListener('click', onClick);
  return {
    destroy(): void {
      node.removeEventListener('click', onClick);
    },
  };
}
