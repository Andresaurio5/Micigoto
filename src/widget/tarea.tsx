import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { Platform } from 'react-native';
import { DatosWidget, WidgetBebe } from './WidgetBebe';
import { Perfil, estadoEmbarazo } from '../logic';
import { infoSemana } from '../data/semanas';

export const NOMBRE_WIDGET = 'BebeWidget';

export function datosDePerfil(p: Perfil | null | undefined): DatosWidget {
  if (!p) return null;
  const e = estadoEmbarazo(p.fum);
  const sem = Math.max(1, Math.min(40, e.semanasCumplidas));
  const info = infoSemana(sem);
  return {
    nombre: p.nombre,
    bebe: p.bebe,
    semanas: e.semanasCumplidas,
    dias: e.dias,
    mes: e.mes,
    trimestre: e.trimestre,
    fruta: sem < 4 ? info.fruta : `Tamaño de ${info.fruta.toLowerCase()}`,
    emoji: info.emoji,
    diasRestantes: e.diasRestantes,
    progreso: e.progreso,
  };
}

async function leerDatos(): Promise<DatosWidget> {
  try {
    const raw = await AsyncStorage.getItem('micigoto:v1');
    if (!raw) return null;
    const d = JSON.parse(raw) as { perfiles: Perfil[]; activoId: string | null; ultimoId?: string | null };
    const p = d.perfiles.find((x) => x.id === (d.activoId ?? d.ultimoId)) ?? null;
    return datosDePerfil(p);
  } catch {
    return null;
  }
}

/** Lo llama Android al agregar, actualizar o redimensionar el widget. */
export async function tareaWidget(props: WidgetTaskHandlerProps) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK': {
      const datos = await leerDatos();
      props.renderWidget(<WidgetBebe datos={datos} ancho={props.widgetInfo.width} />);
      break;
    }
    default:
      break;
  }
}

/** Refresca el widget desde la app (al cambiar de perfil o editar datos). */
export function refrescarWidget(p: Perfil | null) {
  if (Platform.OS !== 'android') return;
  try {
    requestWidgetUpdate({
      widgetName: NOMBRE_WIDGET,
      renderWidget: (info) => <WidgetBebe datos={datosDePerfil(p)} ancho={info.width} />,
    }).catch(() => {});
  } catch {}
}
