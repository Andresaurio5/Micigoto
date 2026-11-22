import { StyleSheet } from 'react-native';

export const C = {
  fondo: '#FFF7F3',
  tarjeta: '#FFFFFF',
  texto: '#3B2A35',
  suave: '#8C7682',
  linea: '#F1E3E6',
  rosa: '#F07A93',
  rosaSuave: '#FFE4EA',
  lila: '#9B7FE6',
  lilaSuave: '#EEE8FF',
  menta: '#5DBBA9',
  mentaSuave: '#E0F5F0',
  durazno: '#F7A86B',
  duraznoSuave: '#FFEEDD',
};

export const F = {
  normal: 'Nunito_400Regular',
  medio: 'Nunito_600SemiBold',
  negrita: 'Nunito_700Bold',
  extra: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};

/** Degradados del widget según el trimestre. */
export const DEGRADADOS: Record<1 | 2 | 3, [string, string, string]> = {
  1: ['#FFD1DC', '#FFB3C6', '#F78FAD'],
  2: ['#E3D5FF', '#C7B2FF', '#A58BF0'],
  3: ['#FFE0C2', '#FFC199', '#F59E7A'],
};

export const sombra = {
  shadowColor: '#B0657A',
  shadowOpacity: 0.12,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

export const E = StyleSheet.create({
  tarjeta: {
    backgroundColor: C.tarjeta,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    ...sombra,
  },
  h1: { fontFamily: F.black, fontSize: 28, color: C.texto },
  h2: { fontFamily: F.extra, fontSize: 19, color: C.texto },
  h3: { fontFamily: F.extra, fontSize: 16, color: C.texto },
  p: { fontFamily: F.normal, fontSize: 15, color: C.texto, lineHeight: 22 },
  chico: { fontFamily: F.medio, fontSize: 13, color: C.suave },
  etiqueta: { fontFamily: F.extra, fontSize: 12, color: C.suave, letterSpacing: 1, textTransform: 'uppercase' },
});
