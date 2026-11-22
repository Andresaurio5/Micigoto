import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, E, F } from '../tema';
import { Cita, Perfil, diaSemana, estadoEmbarazo, fechaCorta, fechaLarga, hora, hoy0, parseFecha, sumarDias, uid } from '../logic';
import { PLAN_CONTROLES } from '../data/semanas';
import { useDatos } from '../store';
import { Boton, Campo, SelectorFecha, est, toque } from '../components/Piezas';
import { cancelarAvisos, programarCita } from '../notificaciones';

const TIPOS: { id: Cita['tipo']; nombre: string; emoji: string; color: string }[] = [
  { id: 'ginecologo', nombre: 'Ginecólogo', emoji: '👩‍⚕️', color: '#F07A93' },
  { id: 'prenatal', nombre: 'Control prenatal', emoji: '🩺', color: '#9B7FE6' },
  { id: 'ecografia', nombre: 'Ecografía', emoji: '🖥️', color: '#5DBBA9' },
  { id: 'laboratorio', nombre: 'Laboratorio', emoji: '🧪', color: '#F7A86B' },
  { id: 'otro', nombre: 'Otro', emoji: '📌', color: '#8FB8F2' },
];
const tipo = (id: Cita['tipo']) => TIPOS.find((t) => t.id === id) ?? TIPOS[4];

export default function Citas({ perfil }: { perfil: Perfil }) {
  const ins = useSafeAreaInsets();
  const { actualizar } = useDatos();
  const [editando, setEditando] = useState<Partial<Cita> | null>(null);
  const e = estadoEmbarazo(perfil.fum);
  const ahora = Date.now();
  const proximas = perfil.citas.filter((c) => !c.hecha && new Date(c.fecha).getTime() >= ahora - 3600000).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pasadas = perfil.citas.filter((c) => !proximas.includes(c)).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const guardar = async (c: Cita) => {
    const vieja = perfil.citas.find((x) => x.id === c.id);
    await cancelarAvisos(vieja?.notifIds);
    const notifIds = c.hecha ? [] : await programarCita(c, perfil.bebe);
    const final = { ...c, notifIds };
    actualizar(perfil.id, (p) => ({ ...p, citas: vieja ? p.citas.map((x) => (x.id === c.id ? final : x)) : [...p.citas, final] }));
    setEditando(null);
  };

  const borrar = (c: Cita) =>
    Alert.alert('Borrar cita', `¿Borrar "${c.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: () => {
          cancelarAvisos(c.notifIds);
          actualizar(perfil.id, (p) => ({ ...p, citas: p.citas.filter((x) => x.id !== c.id) }));
        },
      },
    ]);

  const marcar = (c: Cita) => {
    toque();
    cancelarAvisos(c.notifIds);
    actualizar(perfil.id, (p) => ({ ...p, citas: p.citas.map((x) => (x.id === c.id ? { ...x, hecha: !x.hecha, notifIds: [] } : x)) }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.fondo }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: ins.top + 14, paddingBottom: 130 }}>
        <Text style={E.h1}>Mis citas</Text>
        <Text style={[E.chico, { marginBottom: 16 }]}>Ginecólogo, controles prenatales y ecografías. Te aviso un día antes y 2 horas antes.</Text>

        {proximas.length === 0 && (
          <View style={[E.tarjeta, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 40 }}>🗓️</Text>
            <Text style={[E.p, { textAlign: 'center', color: C.suave }]}>No tienes citas próximas.</Text>
          </View>
        )}
        {proximas.map((c) => (
          <TarjetaCita key={c.id} c={c} onPress={() => setEditando(c)} onMarcar={() => marcar(c)} onLargo={() => borrar(c)} />
        ))}

        <Text style={[E.h2, { marginTop: 10, marginBottom: 4 }]}>Plan de controles sugerido</Text>
        <Text style={[E.chico, { marginBottom: 12 }]}>Toca uno para agendarlo. Confirma las fechas con tu médico.</Text>
        {PLAN_CONTROLES.map((pc) => {
          const fecha = sumarDias(parseFecha(perfil.fum), pc.semana * 7);
          const pasado = e.semanasCumplidas > pc.semana;
          const actual = !pasado && e.semanasCumplidas >= pc.semana - 2;
          return (
            <Pressable
              key={pc.semana}
              onPress={() => {
                toque();
                const f = fecha < hoy0() ? sumarDias(hoy0(), 1) : fecha;
                f.setHours(9, 0, 0, 0);
                setEditando({ titulo: pc.titulo, tipo: pc.titulo.includes('Ecograf') ? 'ecografia' : pc.titulo.includes('glucosa') ? 'laboratorio' : 'prenatal', fecha: f.toISOString(), notas: pc.detalle });
              }}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, opacity: pasado ? 0.5 : 1 }}
            >
              <View style={{ width: 46, alignItems: 'center' }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: actual ? C.rosa : pasado ? '#E8DDE0' : C.rosaSuave, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: F.black, color: actual ? '#FFF' : C.rosa, fontSize: 13 }}>{pc.semana}</Text>
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginLeft: 6 }}>
                <Text style={E.h3}>{pasado ? '✓ ' : ''}{pc.titulo}</Text>
                <Text style={E.chico}>Semana {pc.semana} · aprox. {fechaCorta(fecha)}</Text>
                <Text style={[E.chico, { fontSize: 12 }]}>{pc.detalle}</Text>
              </View>
            </Pressable>
          );
        })}

        {pasadas.length > 0 && (
          <>
            <Text style={[E.h2, { marginTop: 16, marginBottom: 10 }]}>Historial</Text>
            {pasadas.map((c) => (
              <TarjetaCita key={c.id} c={c} pasada onPress={() => setEditando(c)} onMarcar={() => marcar(c)} onLargo={() => borrar(c)} />
            ))}
          </>
        )}
      </ScrollView>

      <Pressable
        onPress={() => {
          toque();
          const f = sumarDias(hoy0(), 1);
          f.setHours(9, 0, 0, 0);
          setEditando({ tipo: 'ginecologo', titulo: '', fecha: f.toISOString() });
        }}
        style={{ position: 'absolute', right: 20, bottom: 100, backgroundColor: C.rosa, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 16, elevation: 6 }}
      >
        <Text style={{ fontFamily: F.black, color: '#FFF', fontSize: 16 }}>＋ Nueva cita</Text>
      </Pressable>

      {editando && <FormCita inicial={editando} onCerrar={() => setEditando(null)} onGuardar={guardar} />}
    </View>
  );
}

function TarjetaCita({ c, pasada, onPress, onMarcar, onLargo }: { c: Cita; pasada?: boolean; onPress: () => void; onMarcar: () => void; onLargo: () => void }) {
  const t = tipo(c.tipo);
  const f = new Date(c.fecha);
  const diasReal = Math.round((new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime() - hoy0().getTime()) / 86400000);
  const cuando = diasReal === 0 ? 'Hoy' : diasReal === 1 ? 'Mañana' : diasReal > 1 ? `En ${diasReal} días` : '';
  return (
    <Pressable onPress={onPress} onLongPress={onLargo} style={[E.tarjeta, { flexDirection: 'row', alignItems: 'center', padding: 14, opacity: pasada ? 0.7 : 1, borderLeftWidth: 6, borderLeftColor: t.color }]}>
      <Text style={{ fontSize: 30, marginRight: 12 }}>{t.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[E.h3, c.hecha && { textDecorationLine: 'line-through' }]}>{c.titulo}</Text>
        <Text style={E.chico}>
          {diaSemana(f)} {fechaCorta(f)} · {hora(f)}
        </Text>
        {c.lugar ? <Text style={E.chico}>📍 {c.lugar}</Text> : null}
        {!pasada && cuando ? <Text style={{ fontFamily: F.extra, color: t.color, fontSize: 12, marginTop: 2 }}>{cuando}</Text> : null}
      </View>
      <Pressable onPress={onMarcar} hitSlop={10} style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: t.color, backgroundColor: c.hecha ? t.color : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {c.hecha && <Text style={{ color: '#FFF', fontFamily: F.black }}>✓</Text>}
      </Pressable>
    </Pressable>
  );
}

function FormCita({ inicial, onCerrar, onGuardar }: { inicial: Partial<Cita>; onCerrar: () => void; onGuardar: (c: Cita) => void }) {
  const [t, setT] = useState<Cita['tipo']>(inicial.tipo ?? 'ginecologo');
  const [titulo, setTitulo] = useState(inicial.titulo ?? '');
  const [fecha, setFecha] = useState(new Date(inicial.fecha ?? Date.now()));
  const [lugar, setLugar] = useState(inicial.lugar ?? '');
  const [notas, setNotas] = useState(inicial.notas ?? '');
  const [sel, setSel] = useState(false);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onCerrar}>
      <View style={[est.velo, { justifyContent: 'flex-end', padding: 0 }]}>
        <ScrollView style={[est.hoja, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, maxHeight: '92%' }]} keyboardShouldPersistTaps="handled">
          <Text style={[E.h2, { marginBottom: 14 }]}>{inicial.id ? 'Editar cita' : 'Nueva cita'}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
            {TIPOS.map((x) => (
              <Pressable key={x.id} onPress={() => { toque(); setT(x.id); if (!titulo || TIPOS.some((y) => y.nombre === titulo)) setTitulo(x.nombre); }} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t === x.id ? x.color : '#FFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8 }}>
                <Text>{x.emoji} </Text>
                <Text style={{ fontFamily: F.extra, color: t === x.id ? '#FFF' : C.texto, fontSize: 13 }}>{x.nombre}</Text>
              </Pressable>
            ))}
          </View>
          <Campo etiqueta="Título" value={titulo} onChangeText={setTitulo} placeholder="Ej. Control con la Dra. Rojas" />
          <Text style={[E.etiqueta, { marginBottom: 6 }]}>Fecha y hora</Text>
          <Pressable onPress={() => setSel(true)} style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: C.linea }}>
            <Text style={E.h3}>📅 {fechaLarga(fecha)} · {hora(fecha)}</Text>
          </Pressable>
          <Campo etiqueta="Lugar (opcional)" value={lugar} onChangeText={setLugar} placeholder="Clínica, consultorio..." />
          <Campo etiqueta="Notas (opcional)" value={notas} onChangeText={setNotas} placeholder="Qué llevar, preguntas para el médico..." multiline style={{ minHeight: 70, textAlignVertical: 'top' }} />
          <View style={{ flexDirection: 'row', marginBottom: 30 }}>
            <Boton texto="Cancelar" claro onPress={onCerrar} estilo={{ flex: 1, marginRight: 8 }} />
            <Boton
              texto="Guardar"
              onPress={() => {
                if (!titulo.trim()) return Alert.alert('Falta el título', 'Ponle un nombre a la cita.');
                onGuardar({ id: inicial.id ?? uid(), tipo: t, titulo: titulo.trim(), fecha: fecha.toISOString(), lugar: lugar.trim(), notas: notas.trim(), hecha: inicial.hecha, notifIds: inicial.notifIds });
              }}
              estilo={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </View>
      <SelectorFecha visible={sel} conHora titulo="¿Cuándo es la cita?" valor={fecha} onCerrar={() => setSel(false)} onElegir={(d) => { setFecha(d); setSel(false); }} />
    </Modal>
  );
}
