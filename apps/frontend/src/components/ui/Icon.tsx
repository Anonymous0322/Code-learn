import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
}

export function Icon({ icon: Icon, size = 24, className, color }: IconProps) {
  return (
    <Icon
      size={size}
      className={cn('text-current', className)}
      color={color}
    />
  );
}
