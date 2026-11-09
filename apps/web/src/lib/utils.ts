export function toModernUzbek(text: string): string {
  return text
    .replace(/[Oo][\u02bb\u02bc\u2018\u2019']/g, match => match[0] === 'O' ? 'Ö' : 'ö')
    .replace(/[Gg][\u02bb\u02bc\u2018\u2019']/g, match => match[0] === 'G' ? 'Ğ' : 'ğ')
    .replace(/sh|ch/gi, match => {
      const letter = match.toLowerCase() === 'sh' ? 'Ş' : 'Ç';
      return match[0] === match[0].toUpperCase() ? letter : letter.toLowerCase();
    });
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
