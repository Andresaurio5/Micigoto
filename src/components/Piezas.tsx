import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { C, E, F, sombra } from '../tema';
import { InfoSemana } from '../data/semanas';
import { aISO, hoy0, nombreMes, parseFecha } from '../logic';

export const toque = () => Haptics.selectionAsync().catch(() => {});

/** Anillo de progreso con degradado. */
export function Anillo({ progreso, tam = 92, grosor = 10, children }: { progreso: number; tam?: number; grosor?: number; children?: React.ReactNode }) {
  const r = (tam - grosor) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: tam, height: tam, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tam} height={tam} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGrad id="anillo" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#FFF1C9" />
          </SvgGrad>
        </Defs>
        <Circle cx={tam / 2} cy={tam / 2} r={r} stroke="rgba(255,255,255,0.35)" strokeWidth={grosor} fill="none" />
        <Circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          stroke="url(#anillo)"
          strokeWidth={grosor}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - Math.max(0.01, progreso))}
          rotation={-90}
          originX={tam / 2}
          originY={tam / 2}
        />
      </Svg>
      {children}
    </View>
  );
}

/** Tarjeta de la fruta: compara el tamaño del bebé con una fruta, con animación. */
export function TarjetaFruta({ info, siguiente, estilo }: { info: InfoSemana; siguiente?: InfoSemana; estilo?: ViewStyle }) {
  const rebote = useRef(new Animated.Value(0)).current;
  const giro = useRef(new Animated.Value(0)).current;
  const [verSig, setVerSig] = useState(false);
  const mostrada = verSig && siguiente ? siguiente : info;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(rebote, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(rebote, { toValue: 0, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, []);

  useEffect(() => setVerSig(false), [info.semana]);

  const voltear = () => {
    if (!siguiente) return;
    toque();
    Animated.sequence([
      Animated.timing(giro, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(giro, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setVerSig((v) => !v), 160);
  };

  // El emoji crece un poco con las semanas para que se sienta el avance
  const tamEmoji = 54 + Math.min(40, mostrada.semana) * 0.9;
  const sinBebe = mostrada.semana < 4;

  return (
    <Pressable onPress={voltear} style={[E.tarjeta, { backgroundColor: C.duraznoSuave, flexDirection: 'row', alignItems: 'center' }, estilo]}>
      <Animated.View
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
          transform: [
            { translateY: rebote.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
            { scaleX: giro.interpolate({ inputRange: [0, 1], outputRange: [1, 0.05] }) },
          ],
        }}
      >
        <Text style={{ fontSize: Math.min(tamEmoji, 88) }}>{mostrada.emoji}</Text>
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={E.etiqueta}>{verSig ? `La próxima semana (${mostrada.semana})` : `Semana ${mostrada.semana}`}</Text>
        <Text style={[E.chico, { marginTop: 4 }]}>{sinBebe ? 'Por ahora es' : 'Tu bebé es del tamaño de'}</Text>
        <Text style={[E.h2, { color: '#C4622D', fontSize: 22 }]}>{articulo(mostrada.fruta)}{mostrada.fruta.toLowerCase()}</Text>
        {!sinBebe && (
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Chip texto={`📏 ${formatoCm(mostrada.cm)}`} />
            <Chip texto={`⚖️ ${formatoPeso(mostrada.gramos)}`} />
          </View>
        )}
        {siguiente && <Text style={[E.chico, { fontSize: 11, marginTop: 8 }]}>{verSig ? 'Toca para volver' : 'Toca para ver la próxima semana →'}</Text>}
      </View>
    </Pressable>
  );
}

function articulo(fruta: string) {
  if (/^(aún|una sola)/i.test(fruta)) return '';
  const f = fruta.toLowerCase();
  const fem = /^(semilla|pepita|uva|frutilla|aceituna|manzana|palta|pera|piña|berenjena|calabaza|sandía|cereza)/.test(f);
  return fem ? 'una ' : 'un ';
}

export function formatoCm(cm: number) {
  if (cm < 1) return `${(cm * 10).toFixed(cm < 0.1 ? 1 : 0)} mm`;
  return `${cm.toFixed(1).replace('.0', '')} cm`;
}
export function formatoPeso(g: number) {
  if (g < 1) return '< 1 g';
  if (g >= 1000) return `${(g / 1000).toFixed(2).replace(/0$/, '')} kg`;
  return `${g} g`;
}

export function Chip({ texto, color = '#FFFFFF', colorTexto = C.texto }: { texto: string; color?: string; colorTexto?: string }) {
  return (
    <View style={{ backgroundColor: color, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6 }}>
      <Text style={{ fontFamily: F.negrita, fontSize: 12, color: colorTexto }}>{texto}</Text>
    </View>
  );
}

export function Boton({ texto, onPress, color = C.rosa, claro, estilo, deshabilitado }: { texto: string; onPress: () => void; color?: string; claro?: boolean; estilo?: ViewStyle; deshabilitado?: boolean }) {
  return (
    <Pressable
      disabled={deshabilitado}
      onPress={() => {
        toque();
        onPress();
      }}
      style={({ pressed }) => [
        {
          backgroundColor: claro ? '#FFFFFF' : color,
          borderRadius: 18,
          paddingVertical: 14,
          paddingHorizontal: 18,
          alignItems: 'center',
          borderWidth: claro ? 2 : 0,
          borderColor: color,
          opacity: deshabilitado ? 0.4 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        estilo,
      ]}
    >
      <Text style={{ fontFamily: F.extra, fontSize: 16, color: claro ? color : '#FFFFFF' }}>{texto}</Text>
    </Pressable>
  );
}

export function Campo({ etiqueta, ...props }: { etiqueta: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[E.etiqueta, { marginBottom: 6 }]}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor="#C3AEB7"
        {...props}
        style={[
          {
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: C.linea,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontFamily: F.medio,
            fontSize: 16,
            color: C.texto,
          },
          props.style,
        ]}
      />
    </View>
  );
}

/** Selector de fecha propio (calendario mensual), sin módulos nativos extra. */
export function SelectorFecha({
  visible,
  valor,
  titulo,
  min,
  max,
  conHora,
  onCerrar,
  onElegir,
}: {
  visible: boolean;
  valor: Date;
  titulo: string;
  min?: Date;
  max?: Date;
  conHora?: boolean;
  onCerrar: () => void;
  onElegir: (d: Date) => void;
}) {
  const [mes, setMes] = useState(new Date(valor.getFullYear(), valor.getMonth(), 1));
  const [sel, setSel] = useState(valor);
  const [h, setH] = useState(valor.getHours() || 9);
  const [m, setM] = useState(valor.getMinutes() - (valor.getMinutes() % 15));

  useEffect(() => {
    if (visible) {
      setMes(new Date(valor.getFullYear(), valor.getMonth(), 1));
      setSel(valor);
      setH(conHora ? valor.getHours() : 9);
      setM(conHora ? valor.getMinutes() - (valor.getMinutes() % 15) : 0);
    }
  }, [visible]);

  const primerDia = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
  const diasMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celdas: (number | null)[] = [...Array(primerDia).fill(null), ...Array.from({ length: diasMes }, (_, i) => i + 1)];
  while (celdas.length % 7) celdas.push(null);
  const hoyISO = aISO(hoy0());

  const fueraRango = (d: Date) => (min && d < parseFecha(aISO(min))) || (max && d > parseFecha(aISO(max)));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <Pressable style={est.velo} onPress={onCerrar}>
        <Pressable style={est.hoja} onPress={() => {}}>
          <Text style={[E.h2, { textAlign: 'center', marginBottom: 12 }]}>{titulo}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Pressable onPress={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} style={est.flecha}>
              <Text style={est.flechaTxt}>‹</Text>
            </Pressable>
            <Text style={[E.h3, { textTransform: 'capitalize' }]}>{nombreMes(mes.getMonth())} {mes.getFullYear()}</Text>
            <Pressable onPress={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} style={est.flecha}>
              <Text style={est.flechaTxt}>›</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
              <Text key={i} style={[est.celda, { fontFamily: F.extra, color: C.suave, fontSize: 12 }]}>{d}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {celdas.map((d, i) => {
              if (!d) return <View key={i} style={est.celda} />;
              const fecha = new Date(mes.getFullYear(), mes.getMonth(), d);
              const iso = aISO(fecha);
              const elegido = iso === aISO(sel);
              const off = fueraRango(fecha);
              return (
                <Pressable key={i} disabled={!!off} onPress={() => { toque(); setSel(fecha); }} style={est.celda}>
                  <View style={[est.dia, elegido && { backgroundColor: C.rosa }, iso === hoyISO && !elegido && { borderWidth: 2, borderColor: C.rosa }]}>
                    <Text style={{ fontFamily: elegido ? F.extra : F.medio, color: elegido ? '#FFF' : off ? '#DDD' : C.texto }}>{d}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          {conHora && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
              <Paso valor={h} onCambio={(v) => setH((v + 24) % 24)} />
              <Text style={[E.h1, { marginHorizontal: 8 }]}>:</Text>
              <Paso valor={m} paso={15} onCambio={(v) => setM((v + 60) % 60)} />
            </View>
          )}
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <Boton texto="Cancelar" claro onPress={onCerrar} estilo={{ flex: 1, marginRight: 8 }} />
            <Boton
              texto="Listo"
              onPress={() => {
                const r = new Date(sel);
                r.setHours(conHora ? h : 0, conHora ? m : 0, 0, 0);
                onElegir(r);
              }}
              estilo={{ flex: 1 }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Paso({ valor, paso = 1, onCambio }: { valor: number; paso?: number; onCambio: (v: number) => void }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable onPress={() => { toque(); onCambio(valor + paso); }} style={est.flecha}><Text style={est.flechaTxt}>▲</Text></Pressable>
      <Text style={[E.h1, { marginVertical: 2 }]}>{String(valor).padStart(2, '0')}</Text>
      <Pressable onPress={() => { toque(); onCambio(valor - paso); }} style={est.flecha}><Text style={est.flechaTxt}>▼</Text></Pressable>
    </View>
  );
}

export const est = StyleSheet.create({
  velo: { flex: 1, backgroundColor: 'rgba(59,42,53,0.45)', justifyContent: 'center', padding: 18 },
  hoja: { backgroundColor: C.fondo, borderRadius: 28, padding: 20, ...sombra },
  flecha: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.rosaSuave, alignItems: 'center', justifyContent: 'center' },
  flechaTxt: { fontFamily: F.black, fontSize: 18, color: C.rosa },
  celda: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 3, textAlign: 'center' },
  dia: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
