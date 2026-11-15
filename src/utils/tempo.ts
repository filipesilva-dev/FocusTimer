export type HMS = { h: number; m: number; s: number };

export function segundosParaHMS(total: number): HMS {
  const safe = Math.max(0, Math.floor(total));
  return {
    h: Math.floor(safe / 3600),
    m: Math.floor((safe % 3600) / 60),
    s: safe % 60,
  };
}

export function hmsParaSegundos(h: number, m: number, s: number): number {
  const hh = Math.max(0, Math.floor(h || 0));
  const mm = Math.max(0, Math.floor(m || 0));
  const ss = Math.max(0, Math.floor(s || 0));
  return hh * 3600 + mm * 60 + ss;
}

export function formatarTempoCurto(total: number): string {
  if (!total || total <= 0) return '0s';
  const { h, m, s } = segundosParaHMS(total);
  const partes: string[] = [];
  if (h > 0) partes.push(`${h}h`);
  if (m > 0) partes.push(`${m}min`);
  if (s > 0) partes.push(`${s}s`);
  return partes.join(' ');
}

export function formatarTimer(total: number): string {
  const safe = Math.max(0, Math.floor(total));
  const { h, m, s } = segundosParaHMS(safe);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}
