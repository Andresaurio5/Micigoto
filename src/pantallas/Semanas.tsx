import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, DEGRADADOS, E, F, sombra } from '../tema';
import { Perfil, estadoEmbarazo, fechaCorta, mesDeSemana, parseFecha, sumarDias } from '../logic';
import { infoSemana } from '../data/semanas';
import Bebe from '../components/Bebe';
import { Chip, TarjetaFruta, formatoCm, formatoPeso, toque } from '../components/Piezas';

export default function Semanas({ perfil }: { perfil: Perfil }) {
  const ins = useSafeAreaInsets();
  const e = estadoEmbarazo(perfil.fum);
  const actual = Math.min(40, Math.max(1, e.semanasCumplidas));
  const [sem, setSem] = useState(actual);
  const [play, setPlay] = useState(false);
  const lista = useRef<any>(null);
  const info = infoSemana(sem);
  const trimestre = sem <= 13 ? 1 : sem <= 27 ? 2 : 3;
  const inicioSemana = sumarDias(parseFecha(perfil.fum), sem * 7);

  useEffect(() => {
    lista.current?.scrollTo({ x: Math.max(0, (sem - 3) * 58), animated: true });
  }, [sem]);

  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => {
      setSem((s) => {
        if (s >= 40) {
          setPlay(false);
          return 40;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(t);
  }, [play]);

  const ir = (s: number) => {
    toque();
    setPlay(false);
    setSem(Math.max(1, Math.min(40, s)));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.fondo }} contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={DEGRADADOS[trimestre]} style={{ paddingTop: ins.top + 14, paddingBottom: 20, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, alignItems: 'center' }}>
        <Text style={[E.h2, { color: '#FFF' }]}>Semana a semana</Text>
        <Text style={{ fontFamily: F.negrita, color: 'rgba(255,255,255,0.9)' }}>
          Mes {mesDeSemana(sem)} · Trimestre {trimestre} · {fechaCorta(inicioSemana)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Pressable onPress={() => ir(sem - 1)} style={flecha}>
            <Text style={flechaTxt}>‹</Text>
          </Pressable>
          <Bebe semana={sem} tam={240} />
          <Pressable onPress={() => ir(sem + 1)} style={flecha}>
            <Text style={flechaTxt}>›</Text>
          </Pressable>
        </View>
        <Text style={{ fontFamily: F.black, fontSize: 34, color: '#FFF' }}>Semana {sem}</Text>
        {sem >= 4 && (
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <Chip texto={`📏 ${formatoCm(info.cm)}`} />
            <Chip texto={`⚖️ ${formatoPeso(info.gramos)}`} />
            <Chip texto={`${info.emoji} ${info.fruta}`} />
          </View>
        )}
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <Pressable
            onPress={() => {
              toque();
              if (!play && sem >= 40) setSem(1);
              setPlay(!play);
            }}
            style={{ backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 9, marginRight: 8 }}
          >
            <Text style={{ fontFamily: F.extra, color: C.rosa }}>{play ? '⏸ Pausar' : '▶ Ver cómo crece'}</Text>
          </Pressable>
          {sem !== actual && (
            <Pressable onPress={() => ir(actual)} style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 9 }}>
              <Text style={{ fontFamily: F.extra, color: '#FFF' }}>Ir a hoy</Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <ScrollView ref={lista} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 16 }}>
        {Array.from({ length: 40 }, (_, i) => i + 1).map((s) => {
          const sel = s === sem;
          const esHoy = s === actual;
          return (
            <Pressable key={s} onPress={() => ir(s)} style={[{ width: 50, height: 66, marginRight: 8, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? C.rosa : '#FFF', borderWidth: esHoy && !sel ? 2 : 0, borderColor: C.rosa }, sel && sombra]}>
              <Text style={{ fontSize: 18 }}>{infoSemana(s).emoji}</Text>
              <Text style={{ fontFamily: F.black, color: sel ? '#FFF' : C.texto }}>{s}</Text>
              {esHoy && <Text style={{ fontFamily: F.extra, fontSize: 8, color: sel ? '#FFF' : C.rosa }}>HOY</Text>}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ paddingHorizontal: 18 }}>
        <TarjetaFruta info={info} siguiente={sem < 40 ? infoSemana(sem + 1) : undefined} />
        <View style={[E.tarjeta, { backgroundColor: C.lilaSuave }]}>
          <Text style={[E.etiqueta, { color: C.lila }]}>👶 Desarrollo</Text>
          <Text style={[E.p, { marginTop: 6 }]}>{info.bebe}</Text>
        </View>
        <Text style={[E.chico, { textAlign: 'center' }]}>Las medidas son promedios: cada bebé crece a su propio ritmo.</Text>
      </View>
    </ScrollView>
  );
}

const flecha = { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.4)', alignItems: 'center' as const, justifyContent: 'center' as const };
const flechaTxt = { fontFamily: F.black, fontSize: 24, color: '#FFF' };
