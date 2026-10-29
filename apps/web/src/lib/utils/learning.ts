export function getProgressPercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export function getLevelFromXp(xp: number) {
  if (xp >= 2500) return 'Developer';
  if (xp >= 1000) return 'Coder';
  if (xp >= 300) return 'Learner';
  return 'Beginner';
}
