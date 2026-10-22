import { DIAS_INACTIVIDAD } from './resumen.mapper';

export const MIN_DIAS = 1;
export const MAX_DIAS = 365;
const CLAVE = 'apexfit.panel.dias-inactividad';

/** Lo escrito en el campo → un número entero entre MIN_DIAS y MAX_DIAS (si no es un número, el valor por defecto). */
export function normalizarDias(valor: unknown): number {
  const n = Math.trunc(Number(valor));
  if (!Number.isFinite(n) || valor === '' || valor === null) return DIAS_INACTIVIDAD;
  return Math.min(MAX_DIAS, Math.max(MIN_DIAS, n));
}

/** Los días guardados en este navegador (o el valor por defecto). */
export function leerDias(): number {
  try {
    return normalizarDias(localStorage.getItem(CLAVE));
  } catch {
    return DIAS_INACTIVIDAD;
  }
}

export function guardarDias(dias: number): void {
  try {
    localStorage.setItem(CLAVE, String(dias));
  } catch {
    // Sin almacenamiento disponible: el valor solo dura mientras la pantalla está abierta.
  }
}
