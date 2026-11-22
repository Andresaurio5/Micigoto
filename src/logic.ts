// Cálculos de fechas del embarazo y modelo de datos.

export type Cita = {
  id: string;
  tipo: 'ginecologo' | 'prenatal' | 'ecografia' | 'laboratorio' | 'otro';
  titulo: string;
  fecha: string; // ISO con hora
  lugar?: string;
  notas?: string;
  hecha?: boolean;
  notifIds?: string[];
};

export type RegistroPeso = { fecha: string; kg: number };
export type SesionPatadas = { fecha: string; patadas: number; minutos: number };
export type Nota = { fecha: string; texto: string; animo: string };

export type Perfil = {
  id: string;
  nombre: string;
  bebe: string;
  fum: string; // fecha de la última menstruación (YYYY-MM-DD)
  color: string;
  demo?: boolean;
  citas: Cita[];
  pesos: RegistroPeso[];
  patadas: SesionPatadas[];
  notas: Nota[];
};

export const DIA = 24 * 60 * 60 * 1000;

export function hoy0(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseFecha(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function aISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function sumarDias(d: Date, dias: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + dias);
  return r;
}

export type Estado = {
  diasTotales: number;
  semana: number; // semana en curso (1..42)
  semanasCumplidas: number;
  dias: number; // días extra sobre semanas cumplidas
  mes: number; // 1..9
  trimestre: 1 | 2 | 3;
  fpp: Date;
  diasRestantes: number;
  progreso: number; // 0..1
};

/** Mes del embarazo a partir de las semanas cumplidas. */
export function mesDeSemana(semanas: number): number {
  const limites = [4, 8, 13, 17, 22, 27, 31, 35];
  let mes = 1;
  for (const l of limites) if (semanas > l) mes++;
  return Math.min(9, mes);
}

export function estadoEmbarazo(fum: string, ahora: Date = hoy0()): Estado {
  const inicio = parseFecha(fum);
  const diasTotales = Math.max(0, Math.round((ahora.getTime() - inicio.getTime()) / DIA));
  const semanasCumplidas = Math.floor(diasTotales / 7);
  const dias = diasTotales % 7;
  const semana = Math.min(42, semanasCumplidas + 1);
  const fpp = sumarDias(inicio, 280);
  const diasRestantes = Math.round((fpp.getTime() - ahora.getTime()) / DIA);
  const trimestre = semanasCumplidas < 13 ? 1 : semanasCumplidas < 27 ? 2 : 3;
  return {
    diasTotales,
    semana,
    semanasCumplidas,
    dias,
    mes: mesDeSemana(semanasCumplidas),
    trimestre,
    fpp,
    diasRestantes,
    progreso: Math.min(1, diasTotales / 280),
  };
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS_S = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const nombreMes = (m: number) => MESES[m];

export function fechaLarga(d: Date): string {
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}
export function fechaCorta(d: Date): string {
  return `${d.getDate()} ${MESES_C[d.getMonth()]}`;
}
export function diaSemana(d: Date): string {
  return DIAS_S[d.getDay()];
}
export function hora(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export const COLORES = ['#F28B9C', '#B79CF2', '#7CC8C1', '#F5B971', '#8FB8F2', '#E89BD0', '#9DD48F', '#F29D7C', '#A3A8F0'];

/** Perfiles de prueba: una mamá por cada mes de embarazo. */
export function perfilesDemo(): Perfil[] {
  const datos: [string, string, number][] = [
    ['Valeria', 'Semillita', 4],
    ['Camila', 'Frijolito', 7],
    ['Daniela', 'Lucía', 11],
    ['Fernanda', 'Mateo', 16],
    ['Gabriela', 'Sofía', 20],
    ['Mariana', 'Thiago', 25],
    ['Andrea', 'Valentina', 29],
    ['Lucía', 'Santiago', 34],
    ['Paola', 'Emilia', 38],
  ];
  const h = hoy0();
  return datos.map(([nombre, bebe, semanas], i) => {
    const diasExtra = (i * 2) % 6;
    const fum = sumarDias(h, -(semanas * 7 + diasExtra));
    const est = estadoEmbarazo(aISO(fum), h);
    const proxima = new Date(sumarDias(h, 3 + (i % 5)));
    proxima.setHours(9 + (i % 6), i % 2 ? 30 : 0, 0, 0);
    const pasada = new Date(sumarDias(h, -20 - i));
    pasada.setHours(10, 0, 0, 0);
    const citas: Cita[] = [
      { id: uid(), tipo: 'ginecologo', titulo: 'Control con la ginecóloga', fecha: pasada.toISOString(), lugar: 'Clínica Materno Infantil', hecha: true },
      {
        id: uid(),
        tipo: est.semanasCumplidas >= 18 && est.semanasCumplidas <= 22 ? 'ecografia' : 'prenatal',
        titulo: est.semanasCumplidas >= 18 && est.semanasCumplidas <= 22 ? 'Ecografía morfológica' : 'Control prenatal',
        fecha: proxima.toISOString(),
        lugar: 'Consultorio Dra. Rojas',
        notas: 'Llevar carnet prenatal y resultados.',
      },
    ];
    const pesos: RegistroPeso[] = [];
    const base = 56 + (i % 4) * 3;
    for (let k = Math.max(0, semanas - 12); k <= semanas; k += 3) {
      pesos.push({ fecha: aISO(sumarDias(fum, k * 7)), kg: Math.round((base + Math.max(0, k - 12) * 0.42 + k * 0.05) * 10) / 10 });
    }
    return {
      id: 'demo' + (i + 1),
      nombre,
      bebe,
      fum: aISO(fum),
      color: COLORES[i % COLORES.length],
      demo: true,
      citas,
      pesos,
      patadas: semanas >= 20 ? [{ fecha: sumarDias(h, -1).toISOString(), patadas: 10, minutos: 22 + i }] : [],
      notas: [],
    };
  });
}
