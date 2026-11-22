import React from 'react';
import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { svgBebe } from './bebeSvg';

export type DatosWidget = {
  nombre: string;
  bebe: string;
  semanas: number;
  dias: number;
  mes: number;
  trimestre: number;
  fruta: string;
  emoji: string;
  diasRestantes: number;
  progreso: number;
} | null;

const FONDOS: Record<number, { from: `#${string}`; to: `#${string}` }> = {
  1: { from: '#FFC3D3', to: '#F78FAD' },
  2: { from: '#D9C8FF', to: '#A58BF0' },
  3: { from: '#FFD3AE', to: '#F59E7A' },
};

export function WidgetBebe({ datos, ancho = 320 }: { datos: DatosWidget; ancho?: number }) {
  if (!datos) {
    return (
      <FlexWidget
        clickAction="OPEN_APP"
        style={{ height: 'match_parent', width: 'match_parent', borderRadius: 24, backgroundGradient: { ...FONDOS[1], orientation: 'TL_BR' }, alignItems: 'center', justifyContent: 'center', padding: 12 }}
      >
        <TextWidget text="🍼 Micigoto" style={{ fontSize: 18, color: '#FFFFFF', fontWeight: '800' }} />
        <TextWidget text="Abre la app y elige tu perfil" style={{ fontSize: 13, color: '#FFFFFF', marginTop: 4 }} />
      </FlexWidget>
    );
  }
  const compacto = ancho < 250;
  const tamBebe = compacto ? 96 : 124;
  const barra = Math.max(4, Math.round((compacto ? 90 : 150) * datos.progreso));
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{ height: 'match_parent', width: 'match_parent', borderRadius: 24, backgroundGradient: { ...(FONDOS[datos.trimestre] ?? FONDOS[1]), orientation: 'TL_BR' }, flexDirection: 'row', alignItems: 'center', padding: 10 }}
    >
      <SvgWidget svg={svgBebe(Math.max(1, Math.min(40, datos.semanas)))} style={{ height: tamBebe, width: tamBebe }} />
      <FlexWidget style={{ flex: 1, marginLeft: 8, flexDirection: 'column', justifyContent: 'center' }}>
        <TextWidget text={`MES ${datos.mes} · TRIMESTRE ${datos.trimestre}`} style={{ fontSize: 10, color: '#5A3A48', fontWeight: '700' }} />
        <TextWidget text={`${datos.semanas} sem${datos.dias ? ` ${datos.dias} d` : ''}`} style={{ fontSize: compacto ? 24 : 30, color: '#FFFFFF', fontWeight: '900' }} />
        <TextWidget text={`${datos.emoji} ${datos.fruta}`} maxLines={1} truncate="END" style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '700' }} />
        <FlexWidget style={{ marginTop: 6, height: 6, width: compacto ? 90 : 150, borderRadius: 3, backgroundColor: '#FFFFFF66' }}>
          <FlexWidget style={{ height: 6, width: barra, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
        </FlexWidget>
        <TextWidget
          text={datos.diasRestantes > 0 ? `Faltan ${datos.diasRestantes} días · ${datos.bebe}` : `¡Ya llega ${datos.bebe}! 💗`}
          maxLines={1}
          truncate="END"
          style={{ fontSize: 11, color: '#FFFFFF', marginTop: 4 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
