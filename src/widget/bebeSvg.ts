// Versión en texto SVG del dibujo del bebé, para el widget de la pantalla de inicio.
// Mismo dibujo que components/Bebe.tsx (célula → embrión → feto), pero estático.

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const n = (v: number) => Math.round(v * 100) / 100;

function mezcla(c1: string, c2: string, t: number) {
  const a = [1, 3, 5].map((i) => parseInt(c1.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(c2.slice(i, i + 2), 16));
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join('');
}

function dibujo(semana: number): string {
  if (semana < 3) {
    return `<circle cx="120" cy="120" r="16" fill="#FFFFFF" opacity="0.55"/><circle cx="120" cy="120" r="10" fill="#FFC2D1"/>`;
  }
  if (semana < 5) {
    const r = semana < 4 ? 5 : 6.5;
    const pts = [[0, 0], [-1, -0.9], [1, -0.9], [-1.6, 0.3], [1.6, 0.3], [-0.6, 1.2], [0.8, 1.3], [0, -1.8]];
    return `<circle cx="120" cy="120" r="${r * 4}" fill="#FFFFFF" opacity="0.35"/>` +
      pts.map(([x, y], i) => `<circle cx="${n(120 + x * r * 1.4)}" cy="${n(120 + y * r * 1.4)}" r="${r}" fill="${i % 2 ? '#FFB3C4' : '#FF9DB4'}" stroke="#FFFFFF" stroke-width="1"/>`).join('');
  }
  if (semana < 9) {
    const q = clamp((semana - 5) / 4);
    const s = lerp(0.3, 0.55, q);
    const piel = mezcla('#F59AA5', '#F8A99F', q);
    const borde = mezcla('#E07887', '#E58A80', q);
    let g = `<g transform="translate(120 118) scale(${n(s)})">`;
    g += `<path d="M 6 -2 Q 44 28 12 60 Q -6 74 -22 58" stroke="${piel}" stroke-width="${n(lerp(30, 36, q))}" stroke-linecap="round" fill="none"/>`;
    g += `<path d="M -22 58 Q -34 46 -30 34" stroke="${piel}" stroke-width="${n(lerp(12, 6, q))}" stroke-linecap="round" fill="none"/>`;
    g += `<circle cx="-6" cy="-22" r="${n(lerp(30, 36, q))}" fill="${piel}" stroke="${borde}" stroke-width="2"/>`;
    if (semana >= 6) {
      g += `<ellipse cx="-14" cy="22" rx="${n(lerp(5, 9, q))}" ry="${n(lerp(8, 13, q))}" fill="${piel}" stroke="${borde}" stroke-width="2" transform="rotate(30 -14 22)"/>`;
      g += `<ellipse cx="-6" cy="52" rx="${n(lerp(5, 9, q))}" ry="${n(lerp(8, 14, q))}" fill="${piel}" stroke="${borde}" stroke-width="2" transform="rotate(-20 -6 52)"/>`;
    }
    if (semana >= 7) g += `<circle cx="-22" cy="-24" r="5" fill="#5B2E3C" opacity="0.55"/>`;
    g += `<circle cx="4" cy="16" r="7" fill="#E5455E" opacity="0.85"/></g>`;
    return g;
  }
  const p = clamp((semana - 9) / 31);
  const s = lerp(0.5, 1.0, p);
  const piel = mezcla('#F6A9A6', '#FFD2BC', clamp(p * 1.4));
  const borde = mezcla('#E2837F', '#EBA084', p);
  const hr = lerp(36, 29, p);
  const H = { x: -12, y: -40 };
  const bx = 10, by = 16;
  const brx = lerp(22, 31, p), bry = lerp(32, 40, p);
  const muslo = lerp(11, 20, p), pierna = lerp(9, 16, p), brazo = lerp(7, 12, p);
  const linea = (d: string, w: number) =>
    `<path d="${d}" stroke="${borde}" stroke-width="${n(w + 4)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${piel}" stroke-width="${n(w)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const cord = `<path d="M ${n(118 - 16 * s)} ${n(118 + 30 * s)} C 120 210, 170 150, 190 172" stroke="#E58AA0" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.85"/>`;
  let g = cord + `<g transform="translate(118 118) scale(${n(s)})">`;
  g += `<ellipse cx="${bx}" cy="${by}" rx="${n(brx)}" ry="${n(bry)}" fill="${piel}" stroke="${borde}" stroke-width="2.5" transform="rotate(-22 ${bx} ${by})"/>`;
  g += linea(`M ${bx + 14} ${by + 26} L -20 ${by + 20}`, muslo);
  g += linea(`M -20 ${by + 20} L 2 ${by + 46}`, pierna);
  g += `<ellipse cx="-6" cy="${by + 50}" rx="${n(lerp(7, 12, p))}" ry="${n(lerp(4, 6.5, p))}" fill="${piel}" stroke="${borde}" stroke-width="2" transform="rotate(-15 -6 ${by + 50})"/>`;
  g += `<circle cx="${H.x}" cy="${H.y}" r="${n(hr)}" fill="${piel}" stroke="${borde}" stroke-width="2.5"/>`;
  g += `<ellipse cx="${n(H.x + hr * 0.25)}" cy="${n(H.y + hr * 0.1)}" rx="${n(hr * 0.14)}" ry="${n(hr * 0.22)}" fill="${piel}" stroke="${borde}" stroke-width="2"/>`;
  g += `<path d="M ${n(H.x - hr * 0.62)} ${n(H.y - hr * 0.02)} Q ${n(H.x - hr * 0.48)} ${n(H.y + hr * 0.14)} ${n(H.x - hr * 0.32)} ${n(H.y - hr * 0.02)}" stroke="#6E3B48" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
  g += `<circle cx="${n(H.x - hr * 0.97)}" cy="${n(H.y + hr * 0.22)}" r="${n(hr * 0.1)}" fill="${piel}" stroke="${borde}" stroke-width="1.6"/>`;
  g += `<path d="M ${n(H.x - hr * 0.84)} ${n(H.y + hr * 0.5)} Q ${n(H.x - hr * 0.74)} ${n(H.y + hr * 0.58)} ${n(H.x - hr * 0.66)} ${n(H.y + hr * 0.48)}" stroke="#B65C6A" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  g += `<circle cx="${n(H.x - hr * 0.42)}" cy="${n(H.y + hr * 0.36)}" r="${n(hr * 0.2)}" fill="#FF8FA3" opacity="${n(0.35 + p * 0.2)}"/>`;
  if (p > 0.55) {
    g += `<path d="M ${H.x - 6} ${n(H.y - hr + 2)} q 6 -8 12 -2" stroke="#8A5A4A" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M ${H.x + 4} ${n(H.y - hr + 4)} q 7 -7 12 0" stroke="#8A5A4A" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  g += linea(`M ${bx - 8} ${by - 18} L ${H.x - 14} ${by + 2} L ${n(H.x - hr * 0.8)} ${n(H.y + hr * 0.9)}`, brazo);
  g += `<circle cx="${n(H.x - hr * 0.8)}" cy="${n(H.y + hr * 0.9)}" r="${n(lerp(5, 8, p))}" fill="${piel}" stroke="${borde}" stroke-width="2"/></g>`;
  return g;
}

/** SVG completo: pancita + bebé de la semana indicada. */
export function svgBebe(semana: number): string {
  const s = Math.floor(semana);
  const placenta = s >= 9 ? `<ellipse cx="196" cy="176" rx="26" ry="18" fill="#E9879D" opacity="0.55" transform="rotate(-35 196 176)"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
<defs><radialGradient id="u" cx="0.45" cy="0.4" r="0.6"><stop offset="0" stop-color="#FFF4F6"/><stop offset="0.7" stop-color="#FFD3DD"/><stop offset="1" stop-color="#F7A8BB"/></radialGradient></defs>
<circle cx="120" cy="120" r="116" fill="#FFFFFF" opacity="0.45"/>
<circle cx="120" cy="120" r="108" fill="url(#u)"/>
<circle cx="120" cy="120" r="100" stroke="#FFFFFF" stroke-width="2" opacity="0.6" fill="none" stroke-dasharray="4 8"/>
${placenta}${dibujo(s)}
</svg>`;
}
