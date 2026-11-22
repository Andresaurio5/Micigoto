import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Cita, hora } from './logic';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch {}

async function permiso(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('citas', {
        name: 'Recordatorios de citas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 150, 250],
        lightColor: '#F07A93',
      });
    }
    const actual = await Notifications.getPermissionsAsync();
    if (actual.granted) return true;
    const r = await Notifications.requestPermissionsAsync();
    return r.granted;
  } catch {
    return false;
  }
}

/** Programa avisos un día antes (9:00) y 2 horas antes de la cita. Devuelve los ids. */
export async function programarCita(cita: Cita, nombreBebe: string): Promise<string[]> {
  if (!(await permiso())) return [];
  const fecha = new Date(cita.fecha);
  const ids: string[] = [];
  const avisos: { cuando: Date; titulo: string; cuerpo: string }[] = [];
  const diaAntes = new Date(fecha);
  diaAntes.setDate(diaAntes.getDate() - 1);
  diaAntes.setHours(9, 0, 0, 0);
  avisos.push({ cuando: diaAntes, titulo: `Mañana: ${cita.titulo} 🗓️`, cuerpo: `A las ${hora(fecha)}${cita.lugar ? ' en ' + cita.lugar : ''}. ¡${nombreBebe} te espera!` });
  avisos.push({ cuando: new Date(fecha.getTime() - 2 * 60 * 60 * 1000), titulo: `En 2 horas: ${cita.titulo} 💗`, cuerpo: cita.notas || `Recuerda llevar tu carnet prenatal.` });
  for (const a of avisos) {
    if (a.cuando.getTime() <= Date.now() + 60000) continue;
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: { title: a.titulo, body: a.cuerpo },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: a.cuando, channelId: 'citas' },
      });
      ids.push(id);
    } catch {}
  }
  return ids;
}

export async function cancelarAvisos(ids?: string[]) {
  for (const id of ids ?? []) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {}
  }
}
