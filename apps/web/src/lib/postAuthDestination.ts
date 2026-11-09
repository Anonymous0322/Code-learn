export function getPostAuthDestination(fallback: string) {
  const destination = new URLSearchParams(window.location.search).get('next');
  if (!destination?.startsWith('/')) return fallback;

  const url = new URL(destination, window.location.origin);
  if (url.origin !== window.location.origin || url.pathname === '/auth' || url.pathname.startsWith('/auth/')) {
    return fallback;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
