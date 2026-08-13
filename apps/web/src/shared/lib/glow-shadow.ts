export function glowShadow(color: string, ringed = false): string {
  const glow = `0 4px 14px ${color}55`;
  return ringed ? `0 0 0 2px var(--color-text), ${glow}` : glow;
}
