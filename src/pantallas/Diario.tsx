import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, E, F } from '../tema';
import { Perfil, aISO, estadoEmbarazo, fechaCorta, hora, hoy0, parseFecha } from '../logic';
import { useDatos } from '../store';
import { Boton, Campo, toque } from '../components/Piezas';

export default function Diario({ perfil }: { perfil: Perfil }) {
  const ins = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.fondo }} contentContainerStyle={{ padding: 18, paddingTop: ins.top + 14, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <Text style={E.h1}>Mi diario</Text>
      <Text style={[E.chico, { marginBottom: 16 }]}>Pataditas, peso y cómo te sientes día a día.</Text>
      <ContadorPatadas perfil={perfil} />
      <Peso perfil={perfil} />
      <Animo perfil={perfil} />
    </ScrollView>
  );
}

function ContadorPatadas({ perfil }: { perfil: Perfil }) {
  const { actualizar } = useDatos();
  const e = estadoEmbarazo(perfil.fum);
  const [n, setN] = useState(0);
  const [inicio, setInicio] = useState<number | null>(null);
  const [seg, setSeg] = useState(0);
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!inicio) return;
    const t = setInterval(() => setSeg(Math.floor((Date.now() - inicio) / 1000)), 1000);
    return () => clearInterval(t);
  }, [inicio]);

  const patada = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (!inicio) setInicio(Date.now());
    setN((x) => x + 1);
    pulso.setValue(1.18);
    Animated.spring(pulso, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const terminar = () => {
    if (n > 0) {
      actualizar(perfil.id, (p) => ({ ...p, patadas: [{ fecha: new Date().toISOString(), patadas: n, minutos: Math.max(1, Math.round(seg / 60)) }, ...p.patadas].slice(0, 30) }));
    }
    setN(0);
    setInicio(null);
    setSeg(0);
  };

  const mm = String(Math.floor(seg / 60)).padStart(2, '0');
  const ss = String(seg % 60).padStart(2, '0');

  return (
    <View style={[E.tarjeta, { backgroundColor: C.duraznoSuave }]}>
      <Text style={[E.etiqueta, { color: '#C4622D' }]}>🦶 Contador de pataditas</Text>
      {e.semanasCumplidas < 20 && <Text style={[E.chico, { marginTop: 4 }]}>Normalmente se empiezan a sentir entre las semanas 18 y 22. ¡Ya llegará!</Text>}
      <View style={{ alignItems: 'center', marginVertical: 14 }}>
        <Animated.View style={{ transform: [{ scale: pulso }] }}>
          <Pressable onPress={patada} style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: C.durazno, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
            <Text style={{ fontFamily: F.black, fontSize: 52, color: '#FFF' }}>{n}</Text>
            <Text style={{ fontFamily: F.extra, color: '#FFF' }}>{n ? 'toca en cada patada' : 'toca para empezar'}</Text>
          </Pressable>
        </Animated.View>
        <Text style={[E.h2, { marginTop: 10 }]}>⏱ {mm}:{ss}</Text>
        {n >= 10 && <Text style={[E.p, { color: C.menta, fontFamily: F.extra }]}>¡10 pataditas! Tu bebé está activo 💪</Text>}
      </View>
      {inicio && <Boton texto="Terminar y guardar" color={C.durazno} onPress={terminar} />}
      <Text style={[E.chico, { marginTop: 10, fontSize: 12 }]}>Desde la semana 28 se recomienda sentir unas 10 pataditas en menos de 2 horas. Si notas muchos menos movimientos de lo normal, consulta a tu médico.</Text>
      {perfil.patadas.slice(0, 4).map((s, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginTop: 8 }}>
          <Text style={E.chico}>{fechaCorta(new Date(s.fecha))} · {hora(new Date(s.fecha))}</Text>
          <Text style={[E.chico, { fontFamily: F.extra, color: C.texto }]}>{s.patadas} en {s.minutos} min</Text>
        </View>
      ))}
    </View>
  );
}

function Peso({ perfil }: { perfil: Perfil }) {
  const { actualizar } = useDatos();
  const [kg, setKg] = useState('');
  const datos = [...perfil.pesos].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(-10);

  const agregar = () => {
    const v = parseFloat(kg.replace(',', '.'));
    if (!v || v < 30 || v > 200) return Alert.alert('Peso no válido', 'Escribe tu peso en kilos, por ejemplo 62.5');
    toque();
    const hoy = aISO(hoy0());
    actualizar(perfil.id, (p) => ({ ...p, pesos: [...p.pesos.filter((x) => x.fecha !== hoy), { fecha: hoy, kg: v }] }));
    setKg('');
  };

  const W = 300, H = 130, pad = 22;
  let grafico: React.ReactNode = null;
  if (datos.length >= 2) {
    const min = Math.min(...datos.map((d) => d.kg)) - 1;
    const max = Math.max(...datos.map((d) => d.kg)) + 1;
    const x = (i: number) => pad + (i * (W - pad * 2)) / (datos.length - 1);
    const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
    const d = datos.map((p, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(p.kg)}`).join(' ');
    grafico = (
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Path d={`${d} L ${x(datos.length - 1)} ${H - 6} L ${x(0)} ${H - 6} Z`} fill={C.lilaSuave} />
        <Path d={d} stroke={C.lila} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {datos.map((p, i) => (
          <Circle key={i} cx={x(i)} cy={y(p.kg)} r={4.5} fill="#FFF" stroke={C.lila} strokeWidth={2.5} />
        ))}
        <SvgText x={x(0)} y={y(datos[0].kg) - 10} fontSize={11} fill={C.suave} textAnchor="start">{datos[0].kg}</SvgText>
        <SvgText x={x(datos.length - 1)} y={y(datos[datos.length - 1].kg) - 10} fontSize={12} fontWeight="bold" fill={C.lila} textAnchor="end">{datos[datos.length - 1].kg} kg</SvgText>
      </Svg>
    );
  }
  const subida = datos.length >= 2 ? Math.round((datos[datos.length - 1].kg - datos[0].kg) * 10) / 10 : 0;

  return (
    <View style={[E.tarjeta, { backgroundColor: C.lilaSuave }]}>
      <Text style={[E.etiqueta, { color: C.lila }]}>⚖️ Mi peso</Text>
      {grafico ?? <Text style={[E.chico, { marginVertical: 8 }]}>Registra tu peso para ver cómo va cambiando.</Text>}
      {datos.length >= 2 && (
        <Text style={[E.chico, { marginBottom: 8 }]}>
          {subida >= 0 ? '+' : ''}{subida} kg desde el {fechaCorta(parseFecha(datos[0].fecha))}
        </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Campo etiqueta="Peso de hoy (kg)" value={kg} onChangeText={setKg} keyboardType="decimal-pad" placeholder="62.5" style={{ marginBottom: 0 }} />
        </View>
        <Boton texto="Guardar" color={C.lila} onPress={agregar} estilo={{ marginBottom: 14 }} />
      </View>
    </View>
  );
}

const ANIMOS = ['😊', '🥰', '😴', '🤢', '😣', '😢', '🤩'];

function Animo({ perfil }: { perfil: Perfil }) {
  const { actualizar } = useDatos();
  const [animo, setAnimo] = useState('😊');
  const [texto, setTexto] = useState('');
  const guardar = () => {
    if (!texto.trim()) return;
    toque();
    actualizar(perfil.id, (p) => ({ ...p, notas: [{ fecha: new Date().toISOString(), texto: texto.trim(), animo }, ...p.notas].slice(0, 50) }));
    setTexto('');
  };
  return (
    <View style={[E.tarjeta, { backgroundColor: C.mentaSuave }]}>
      <Text style={[E.etiqueta, { color: C.menta }]}>📝 ¿Cómo te sientes hoy?</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
        {ANIMOS.map((a) => (
          <Pressable key={a} onPress={() => { toque(); setAnimo(a); }} style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: animo === a ? '#FFF' : 'transparent', transform: [{ scale: animo === a ? 1.15 : 1 }] }}>
            <Text style={{ fontSize: 24 }}>{a}</Text>
          </Pressable>
        ))}
      </View>
      <Campo etiqueta="Escribe algo" value={texto} onChangeText={setTexto} placeholder="Hoy sentí que se movió mucho..." multiline style={{ minHeight: 70, textAlignVertical: 'top' }} />
      <Boton texto="Guardar en el diario" color={C.menta} onPress={guardar} />
      {perfil.notas.slice(0, 5).map((nt, i) => (
        <View key={i} style={{ backgroundColor: '#FFF', borderRadius: 14, padding: 12, marginTop: 10, flexDirection: 'row' }}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>{nt.animo}</Text>
          <View style={{ flex: 1 }}>
            <Text style={E.chico}>{fechaCorta(new Date(nt.fecha))} · {hora(new Date(nt.fecha))}</Text>
            <Text style={E.p}>{nt.texto}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
