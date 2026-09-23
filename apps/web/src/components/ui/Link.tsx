import { ReactNode } from 'react';

interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export function Link({ children, href, className }: LinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
