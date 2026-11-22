import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { ProveedorDatos, useDatos } from './src/store';
import { C, F } from './src/tema';
import Perfiles from './src/pantallas/Perfiles';
import Inicio from './src/pantallas/Inicio';
import Semanas from './src/pantallas/Semanas';
import Citas from './src/pantallas/Citas';
import Diario from './src/pantallas/Diario';
import MiPerfil from './src/pantallas/MiPerfil';
import { toque } from './src/components/Piezas';

const PESTANAS = [
  { id: 'inicio', nombre: 'Inicio', icono: '🏠' },
  { id: 'semanas', nombre: 'Semanas', icono: '🍼' },
  { id: 'citas', nombre: 'Citas', icono: '🗓️' },
  { id: 'diario', nombre: 'Diario', icono: '📝' },
  { id: 'perfil', nombre: 'Perfil', icono: '👤' },
];

function Contenido() {
  const { listo, activo } = useDatos();
  const [tab, setTab] = useState('inicio');
  const ins = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!activo) setTab('inicio');
  }, [activo?.id]);

  const cambiar = (t: string) => {
    if (t === tab) return;
    toque();
    fade.setValue(0);
    setTab(t);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  if (!listo) return <View style={{ flex: 1, backgroundColor: C.fondo }} />;
  if (!activo) return <Perfiles />;

  return (
    <View style={{ flex: 1, backgroundColor: C.fondo }}>
      <Animated.View style={{ flex: 1, opacity: fade }}>
        {tab === 'inicio' && <Inicio perfil={activo} irA={cambiar} />}
        {tab === 'semanas' && <Semanas perfil={activo} />}
        {tab === 'citas' && <Citas perfil={activo} />}
        {tab === 'diario' && <Diario perfil={activo} />}
        {tab === 'perfil' && <MiPerfil perfil={activo} />}
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: ins.bottom + 10,
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderRadius: 28,
          paddingVertical: 8,
          shadowColor: '#B0657A',
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        }}
      >
        {PESTANAS.map((p) => {
          const sel = p.id === tab;
          return (
            <Pressable key={p.id} onPress={() => cambiar(p.id)} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ backgroundColor: sel ? C.rosaSuave : 'transparent', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontSize: sel ? 22 : 20, opacity: sel ? 1 : 0.6 }}>{p.icono}</Text>
              </View>
              <Text style={{ fontFamily: sel ? F.black : F.negrita, fontSize: 10, color: sel ? C.rosa : C.suave, marginTop: 2 }}>{p.nombre}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const [fuentes] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });
  if (!fuentes) return <View style={{ flex: 1, backgroundColor: C.fondo }} />;
  return (
    <SafeAreaProvider>
      <ProveedorDatos>
        <StatusBar style="dark" />
        <Contenido />
      </ProveedorDatos>
    </SafeAreaProvider>
  );
}
