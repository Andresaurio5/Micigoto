import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, DEGRADADOS, E, F, sombra } from '../tema';
import { Perfil, diaSemana, estadoEmbarazo, fechaCorta, fechaLarga, hora } from '../logic';
import { infoMama, infoSemana } from '../data/semanas';
import Bebe from '../components/Bebe';
import { Anillo, Boton, TarjetaFruta } from '../components/Piezas';

export default function Inicio({ perfil, irA }: { perfil: Perfil; irA: (t: string) => void }) {
  const ins = useSafeAreaInsets();
  const e = estadoEmbarazo(perfil.fum);
  const semActual = Math.max(1, Math.min(40, e.semanasCumplidas));
  const info = infoSemana(semActual);
  const sig = semActual < 40 ? infoSemana(semActual + 1) : undefined;
  const mama = infoMama(e.semanasCumplidas);
  const proxima = perfil.citas
    .filter((c) => !c.hecha && new Date(c.fecha).getTime() > Date.now())
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  const entrada = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    entrada.setValue(0);
    Animated.timing(entrada, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [perfil.id]);

  const aparecer = (i: number) => ({
    opacity: entrada,
    transform: [{ translateY: entrada.interpolate({ inputRange: [0, 1], outputRange: [30 + i * 12, 0] }) }],
  });

  const ahora = new Date();
  const saludo = ahora.getHours() < 12 ? 'Buenos días' : ahora.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches';
  const nacio = e.diasRestantes <= 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.fondo }} contentContainerStyle={{ padding: 18, paddingTop: ins.top + 14, paddingBottom: 120 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <Text style={E.chico}>{saludo},</Text>
          <Text style={E.h1}>{perfil.nombre} 👋</Text>
        </View>
        <Pressable onPress={() => irA('perfil')} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: perfil.color, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: F.black, color: '#FFF', fontSize: 20 }}>{perfil.nombre.charAt(0)}</Text>
        </Pressable>
      </View>

      {/* WIDGET PRINCIPAL */}
      <Animated.View style={aparecer(0)}>
        <Pressable onPress={() => irA('semanas')}>
          <LinearGradient colors={DEGRADADOS[e.trimestre]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: 32, padding: 18, marginBottom: 16 }, sombra]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.45)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontFamily: F.extra, color: '#5A3A48', fontSize: 12 }}>TRIMESTRE {e.trimestre} · MES {e.mes}</Text>
              </View>
              <Text style={{ fontFamily: F.extra, color: '#5A3A48', fontSize: 12 }}>{perfil.bebe} 💗</Text>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 6 }}>
              <Bebe semana={semActual} tam={230} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.black, fontSize: 40, color: '#FFFFFF', lineHeight: 44 }}>
                  {e.semanasCumplidas}
                  <Text style={{ fontSize: 18 }}> sem</Text>
                  {e.dias > 0 && <Text style={{ fontSize: 18 }}> {e.dias} d</Text>}
                </Text>
                <Text style={{ fontFamily: F.negrita, color: '#FFFFFF', fontSize: 14 }}>
                  {nacio ? '¡Ya puede nacer en cualquier momento!' : `Faltan ${e.diasRestantes} días · ${Math.ceil(e.diasRestantes / 7)} semanas`}
                </Text>
                <Text style={{ fontFamily: F.medio, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>Parto estimado: {fechaCorta(e.fpp)} {e.fpp.getFullYear()}</Text>
              </View>
              <Anillo progreso={e.progreso}>
                <Text style={{ fontFamily: F.black, color: '#FFF', fontSize: 20 }}>{Math.round(e.progreso * 100)}%</Text>
              </Anillo>
            </View>
            <BarraMeses mes={e.mes} />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View style={aparecer(1)}>
        <TarjetaFruta info={info} siguiente={sig} />
      </Animated.View>

      <Animated.View style={aparecer(2)}>
        <View style={[E.tarjeta, { backgroundColor: C.lilaSuave }]}>
          <Text style={[E.etiqueta, { color: C.lila }]}>👶 Tu bebé esta semana</Text>
          <Text style={[E.p, { marginTop: 6 }]}>{info.bebe}</Text>
        </View>

        <View style={[E.tarjeta, { backgroundColor: C.mentaSuave }]}>
          <Text style={[E.etiqueta, { color: C.menta }]}>🤰 Cómo te puedes sentir</Text>
          <Text style={[E.p, { marginTop: 6 }]}>{mama.sintomas}</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginTop: 10 }}>
            <Text style={[E.p, { fontFamily: F.negrita }]}>💡 {mama.consejo}</Text>
          </View>
        </View>

        <View style={E.tarjeta}>
          <Text style={E.etiqueta}>🗓️ Próxima cita</Text>
          {proxima ? (
            <Pressable onPress={() => irA('citas')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <View style={{ backgroundColor: C.rosaSuave, borderRadius: 16, padding: 10, alignItems: 'center', width: 64, marginRight: 12 }}>
                <Text style={{ fontFamily: F.black, fontSize: 22, color: C.rosa }}>{new Date(proxima.fecha).getDate()}</Text>
                <Text style={{ fontFamily: F.extra, fontSize: 11, color: C.rosa }}>{fechaCorta(new Date(proxima.fecha)).split(' ')[1].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={E.h3}>{proxima.titulo}</Text>
                <Text style={E.chico}>
                  {diaSemana(new Date(proxima.fecha))} {hora(new Date(proxima.fecha))}
                  {proxima.lugar ? ` · ${proxima.lugar}` : ''}
                </Text>
              </View>
            </Pressable>
          ) : (
            <View style={{ marginTop: 10 }}>
              <Text style={[E.p, { color: C.suave }]}>No tienes citas pendientes.</Text>
              <Boton texto="Agendar una cita" onPress={() => irA('citas')} estilo={{ marginTop: 10 }} />
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Atajo emoji="🦶" titulo="Pataditas" sub={e.semanasCumplidas >= 20 ? 'Contar ahora' : 'Desde la sem. 20'} color={C.duraznoSuave} onPress={() => irA('diario')} />
          <View style={{ width: 12 }} />
          <Atajo emoji="📖" titulo="Semana a semana" sub="Ver su crecimiento" color={C.rosaSuave} onPress={() => irA('semanas')} />
        </View>
        <Text style={[E.chico, { textAlign: 'center', marginTop: 18 }]}>Hoy es {fechaLarga(new Date())}</Text>
      </Animated.View>
    </ScrollView>
  );
}

function BarraMeses({ mes }: { mes: number }) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 14 }}>
      {Array.from({ length: 9 }, (_, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ height: 8, alignSelf: 'stretch', marginHorizontal: 2, borderRadius: 4, backgroundColor: i < mes ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }} />
          <Text style={{ fontFamily: i + 1 === mes ? F.black : F.negrita, fontSize: 10, color: i + 1 === mes ? '#FFF' : 'rgba(255,255,255,0.8)', marginTop: 3 }}>{i + 1}</Text>
        </View>
      ))}
    </View>
  );
}

function Atajo({ emoji, titulo, sub, color, onPress }: { emoji: string; titulo: string; sub: string; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [E.tarjeta, { flex: 1, backgroundColor: color, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
      <Text style={{ fontSize: 30 }}>{emoji}</Text>
      <Text style={[E.h3, { marginTop: 6 }]}>{titulo}</Text>
      <Text style={E.chico}>{sub}</Text>
    </Pressable>
  );
}
