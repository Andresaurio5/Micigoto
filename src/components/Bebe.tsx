import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

function mezclaColor(c1: string, c2: string, t: number) {
  const a = [1, 3, 5].map((i) => parseInt(c1.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(c2.slice(i, i + 2), 16));
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join('');
}

/** Dibujo del bebé (sin el útero), en coordenadas de 240x240 con centro en 120,120. */
function DibujoBebe({ semana }: { semana: number }) {
  if (semana < 3) {
    // Óvulo esperando
    return (
      <G>
        <Circle cx={120} cy={120} r={16} fill="#FFFFFF" opacity={0.55} />
        <Circle cx={120} cy={120} r={10} fill="#FFC2D1" />
        <Circle cx={116} cy={116} r={3} fill="#FFFFFF" opacity={0.8} />
      </G>
    );
  }
  if (semana < 5) {
    // Mórula / blastocisto: racimo de células
    const r = semana < 4 ? 5 : 6.5;
    const pts = [[0, 0], [-1, -0.9], [1, -0.9], [-1.6, 0.3], [1.6, 0.3], [-0.6, 1.2], [0.8, 1.3], [0, -1.8]];
    return (
      <G>
        <Circle cx={120} cy={120} r={r * 4} fill="#FFFFFF" opacity={0.35} />
        {pts.map(([x, y], i) => (
          <Circle key={i} cx={120 + x * r * 1.4} cy={120 + y * r * 1.4} r={r} fill={i % 2 ? '#FFB3C4' : '#FF9DB4'} stroke="#FFFFFF" strokeWidth={1} opacity={0.95} />
        ))}
      </G>
    );
  }
  if (semana < 9) {
    // Embrión con forma de C, cabeza grande y colita
    const q = clamp((semana - 5) / 4);
    const s = lerp(0.3, 0.55, q);
    const piel = mezclaColor('#F59AA5', '#F8A99F', q);
    const borde = mezclaColor('#E07887', '#E58A80', q);
    return (
      <G x={120} y={118} scale={s}>
        <Path d="M 6 -2 Q 44 28 12 60 Q -6 74 -22 58" stroke={piel} strokeWidth={lerp(30, 36, q)} strokeLinecap="round" fill="none" />
        <Path d="M -22 58 Q -34 46 -30 34" stroke={piel} strokeWidth={lerp(12, 6, q)} strokeLinecap="round" fill="none" opacity={1 - q * 0.6} />
        <Circle cx={-6} cy={-22} r={lerp(30, 36, q)} fill={piel} stroke={borde} strokeWidth={2} />
        {semana >= 6 && (
          <>
            <Ellipse cx={-14} cy={22} rx={lerp(5, 9, q)} ry={lerp(8, 13, q)} fill={piel} stroke={borde} strokeWidth={2} rotation={30} originX={-14} originY={22} />
            <Ellipse cx={-6} cy={52} rx={lerp(5, 9, q)} ry={lerp(8, 14, q)} fill={piel} stroke={borde} strokeWidth={2} rotation={-20} originX={-6} originY={52} />
          </>
        )}
        {semana >= 7 && <Circle cx={-22} cy={-24} r={5} fill="#5B2E3C" opacity={0.55} />}
        <Circle cx={4} cy={16} r={7} fill="#E5455E" opacity={0.85} />
      </G>
    );
  }
  // Feto acurrucado
  const p = clamp((semana - 9) / 31);
  const s = lerp(0.5, 1.0, p);
  const piel = mezclaColor('#F6A9A6', '#FFD2BC', clamp(p * 1.4));
  const borde = mezclaColor('#E2837F', '#EBA084', p);
  const hr = lerp(36, 29, p);
  const H = { x: -12, y: -40 };
  const bx = 10, by = 16;
  const brx = lerp(22, 31, p), bry = lerp(32, 40, p);
  const muslo = lerp(11, 20, p), pierna = lerp(9, 16, p), brazo = lerp(7, 12, p);
  return (
    <G x={118} y={118} scale={s}>
      {/* espalda y cuerpo */}
      <Ellipse cx={bx} cy={by} rx={brx} ry={bry} fill={piel} stroke={borde} strokeWidth={2.5} rotation={-22} originX={bx} originY={by} />
      {/* pierna doblada hacia el pecho */}
      <Path d={`M ${bx + 14} ${by + 26} L -20 ${by + 20}`} stroke={borde} strokeWidth={muslo + 4} strokeLinecap="round" />
      <Path d={`M ${bx + 14} ${by + 26} L -20 ${by + 20}`} stroke={piel} strokeWidth={muslo} strokeLinecap="round" />
      <Path d={`M -20 ${by + 20} L 2 ${by + 46}`} stroke={borde} strokeWidth={pierna + 4} strokeLinecap="round" />
      <Path d={`M -20 ${by + 20} L 2 ${by + 46}`} stroke={piel} strokeWidth={pierna} strokeLinecap="round" />
      <Ellipse cx={-6} cy={by + 50} rx={lerp(7, 12, p)} ry={lerp(4, 6.5, p)} fill={piel} stroke={borde} strokeWidth={2} rotation={-15} originX={-6} originY={by + 50} />
      {/* cabeza */}
      <Circle cx={H.x} cy={H.y} r={hr} fill={piel} stroke={borde} strokeWidth={2.5} />
      {/* oreja */}
      <Ellipse cx={H.x + hr * 0.25} cy={H.y + hr * 0.1} rx={hr * 0.14} ry={hr * 0.22} fill={piel} stroke={borde} strokeWidth={2} />
      {/* ojito cerrado */}
      <Path d={`M ${H.x - hr * 0.62} ${H.y - hr * 0.02} Q ${H.x - hr * 0.48} ${H.y + hr * 0.14} ${H.x - hr * 0.32} ${H.y - hr * 0.02}`} stroke="#6E3B48" strokeWidth={2.2} strokeLinecap="round" fill="none" />
      {/* nariz, boca y cachete */}
      <Circle cx={H.x - hr * 0.97} cy={H.y + hr * 0.22} r={hr * 0.1} fill={piel} stroke={borde} strokeWidth={1.6} />
      <Path d={`M ${H.x - hr * 0.84} ${H.y + hr * 0.5} Q ${H.x - hr * 0.74} ${H.y + hr * 0.58} ${H.x - hr * 0.66} ${H.y + hr * 0.48}`} stroke="#B65C6A" strokeWidth={2} strokeLinecap="round" fill="none" />
      <Circle cx={H.x - hr * 0.42} cy={H.y + hr * 0.36} r={hr * 0.2} fill="#FF8FA3" opacity={0.35 + p * 0.2} />
      {p > 0.55 && (
        <G opacity={clamp((p - 0.55) * 3)}>
          <Path d={`M ${H.x - 6} ${H.y - hr + 2} q 6 -8 12 -2`} stroke="#8A5A4A" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d={`M ${H.x + 4} ${H.y - hr + 4} q 7 -7 12 0`} stroke="#8A5A4A" strokeWidth={2} fill="none" strokeLinecap="round" />
        </G>
      )}
      {/* bracito hacia la carita */}
      <Path d={`M ${bx - 8} ${by - 18} L ${H.x - 14} ${by + 2} L ${H.x - hr * 0.8} ${H.y + hr * 0.9}`} stroke={borde} strokeWidth={brazo + 4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d={`M ${bx - 8} ${by - 18} L ${H.x - 14} ${by + 2} L ${H.x - hr * 0.8} ${H.y + hr * 0.9}`} stroke={piel} strokeWidth={brazo} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx={H.x - hr * 0.8} cy={H.y + hr * 0.9} r={lerp(5, 8, p)} fill={piel} stroke={borde} strokeWidth={2} />
    </G>
  );
}

type Props = { semana: number; tam?: number; latido?: boolean };

/** Útero animado con el bebé flotando; crece y cambia de forma según la semana. */
export default function Bebe({ semana, tam = 220, latido = true }: Props) {
  const flotar = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const corazon = useRef(new Animated.Value(0)).current;
  const burbujas = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(flotar, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flotar, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    const c = Animated.loop(
      Animated.sequence([
        Animated.timing(corazon, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.timing(corazon, { toValue: 0, duration: 140, useNativeDriver: true }),
        Animated.timing(corazon, { toValue: 0.7, duration: 120, useNativeDriver: true }),
        Animated.timing(corazon, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.delay(220),
      ]),
    );
    const b = burbujas.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 900),
          Animated.timing(v, { toValue: 1, duration: 4200 + i * 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    a.start();
    c.start();
    b.forEach((x) => x.start());
    return () => {
      a.stop();
      c.stop();
      b.forEach((x) => x.stop());
    };
  }, []);

  const semanaEntera = Math.floor(semana);
  useEffect(() => {
    pop.setValue(0.8);
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
  }, [semanaEntera]);

  const dibujo = useMemo(() => <DibujoBebe semana={semanaEntera} />, [semanaEntera]);
  const k = tam / 240;

  return (
    <View style={{ width: tam, height: tam }}>
      <Svg width={tam} height={tam} viewBox="0 0 240 240" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="utero" cx="45%" cy="40%" r="60%">
            <Stop offset="0" stopColor="#FFF4F6" />
            <Stop offset="0.7" stopColor="#FFD3DD" />
            <Stop offset="1" stopColor="#F7A8BB" />
          </RadialGradient>
          <RadialGradient id="brillo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={120} cy={120} r={116} fill="#FFFFFF" opacity={0.35} />
        <Circle cx={120} cy={120} r={108} fill="url(#utero)" />
        <Circle cx={120} cy={120} r={100} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} fill="none" strokeDasharray="4 8" />
        <Ellipse cx={82} cy={70} rx={40} ry={22} fill="url(#brillo)" opacity={0.6} />
        {semanaEntera >= 9 && <Ellipse cx={196} cy={176} rx={26} ry={18} fill="#E9879D" opacity={0.55} rotation={-35} originX={196} originY={176} />}
        {semanaEntera >= 9 && (
          <Path
            d={`M ${118 + (-16) * (0.5 + 0.5 * clamp((semanaEntera - 9) / 31))} ${118 + 30 * (0.5 + 0.5 * clamp((semanaEntera - 9) / 31))} C 120 210, 170 150, 190 172`}
            stroke="#E58AA0"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.85}
          />
        )}
      </Svg>

      {burbujas.map((v, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: tam * (0.22 + i * 0.13),
            top: tam * 0.72,
            width: 6 + (i % 3) * 3,
            height: 6 + (i % 3) * 3,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.8)',
            opacity: v.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 0.9, 0.6, 0] }),
            transform: [
              { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -tam * 0.5] }) },
              { translateX: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, (i % 2 ? 8 : -8) * k, 0] }) },
            ],
          }}
        />
      ))}

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: flotar.interpolate({ inputRange: [0, 1], outputRange: [-5 * k, 5 * k] }) },
              { rotate: flotar.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] }) },
              { scale: pop },
            ],
          },
        ]}
      >
        <Svg width={tam} height={tam} viewBox="0 0 240 240">
          {dibujo}
        </Svg>
      </Animated.View>

      {latido && semanaEntera >= 6 && (
        <Animated.Text
          style={{
            position: 'absolute',
            right: tam * 0.06,
            top: tam * 0.06,
            fontSize: 18 * Math.max(0.8, k),
            transform: [{ scale: corazon.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) }],
          }}
        >
          💓
        </Animated.Text>
      )}
    </View>
  );
}
