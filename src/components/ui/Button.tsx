import type { ComponentProps } from 'react';
import { useMagneticEffect } from '../../hooks/useMagneticEffect';
type Variant = 'primary' | 'secondary' | 'ghost';
export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  const magnetic = useMagneticEffect<HTMLButtonElement>();
  return <button className={`button button-${variant} ${className}`} {...magnetic} {...props} />;
}
export function ButtonLink({
  className = '',
  variant = 'primary',
  ...props
}: ComponentProps<'a'> & { variant?: Variant }) {
  const magnetic = useMagneticEffect<HTMLAnchorElement>();
  return <a className={`button button-${variant} ${className}`} {...magnetic} {...props} />;
}
