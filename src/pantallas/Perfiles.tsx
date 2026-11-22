import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, E, F, sombra } from '../tema';
import { useDatos } from '../store';
import { COLORES, Perfil, aISO, estadoEmbarazo, fechaLarga, hoy0, parseFecha, sumarDias, uid } from '../logic';
import { infoSemana } from '../data/semanas';
import { Boton, Campo, SelectorFecha, toque } from '../components/Piezas';
import Bebe from '../components/Bebe';

export default function Perfiles() {
  const { perfiles, elegir, restaurarDemo, borrarPerfil } = useDatos();
  const [creando, setCreando] = useState(false);
  const ins = useSafeAreaInsets();

  const ordenados = useMemo(
    () => [...perfiles].sort((a, b) => (a.demo === b.demo ? parseFecha(b.fum).getTime() - parseFecha(a.fum).getTime() : a.demo ? 1 : -1)),
    [perfiles],
  );

  if (creando) return <FormPerfil onListo={() => setCreando(false)} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.fondo }} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={['#FFD1DC', '#E3D5FF']} style={{ paddingTop: ins.top + 24, paddingBottom: 36, paddingHorizontal: 22, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, alignItems: 'center' }}>
        <Bebe semana={22} tam={150} />
        <Text style={[E.h1, { fontSize: 34, marginTop: 8 }]}>Micigoto</Text>
        <Text style={[E.p, { textAlign: 'center', color: '#6E5563' }]}>Sigue el crecimiento de tu bebé semana a semana 💗</Text>
      </LinearGradient>

      <View style={{ padding: 20 }}>
        <Text style={[E.h2, { marginBottom: 12 }]}>¿Quién eres?</Text>
        {ordenados.map((p) => (
          <TarjetaPerfil
            key={p.id}
            p={p}
            onPress={() => {
              toque();
              elegir(p.id);
            }}
            onLargo={() =>
              Alert.alert('Eliminar perfil', `¿Borrar el perfil de ${p.nombre}?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Borrar', style: 'destructive', onPress: () => borrarPerfil(p.id) },
              ])
            }
          />
        ))}
        <Boton texto="＋  Crear mi perfil" onPress={() => setCreando(true)} estilo={{ marginTop: 6 }} />
        <Boton texto="Restablecer perfiles de prueba" claro color={C.lila} onPress={restaurarDemo} estilo={{ marginTop: 10 }} />
        <Text style={[E.chico, { textAlign: 'center', marginTop: 14 }]}>Mantén presionado un perfil para borrarlo.</Text>
      </View>
    </ScrollView>
  );
}

function TarjetaPerfil({ p, onPress, onLargo }: { p: Perfil; onPress: () => void; onLargo: () => void }) {
  const e = estadoEmbarazo(p.fum);
  const info = infoSemana(Math.max(1, e.semanasCumplidas));
  return (
    <Pressable onPress={onPress} onLongPress={onLargo} style={({ pressed }) => [{ backgroundColor: '#FFF', borderRadius: 22, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', transform: [{ scale: pressed ? 0.98 : 1 }] }, sombra]}>
      <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: p.color, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
        <Text style={{ fontFamily: F.black, fontSize: 22, color: '#FFF' }}>{p.nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={E.h3}>{p.nombre}</Text>
          {p.demo && (
            <View style={{ backgroundColor: C.lilaSuave, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 }}>
              <Text style={{ fontFamily: F.extra, fontSize: 10, color: C.lila }}>PRUEBA</Text>
            </View>
          )}
        </View>
        <Text style={E.chico}>
          Mes {e.mes} · Semana {e.semanasCumplidas} + {e.dias} días
        </Text>
        <Text style={[E.chico, { color: p.color, fontFamily: F.negrita }]}>Bebé: {p.bebe}</Text>
      </View>
      <Text style={{ fontSize: 34 }}>{info.emoji}</Text>
    </Pressable>
  );
}

/** Crear o editar un perfil. */
export function FormPerfil({ perfil, onListo }: { perfil?: Perfil; onListo: () => void }) {
  const { guardarPerfil, perfiles } = useDatos();
  const ins = useSafeAreaInsets();
  const [nombre, setNombre] = useState(perfil?.nombre ?? '');
  const [bebe, setBebe] = useState(perfil?.bebe ?? '');
  const [modo, setModo] = useState<'fum' | 'fpp'>('fum');
  const [fum, setFum] = useState<Date>(perfil ? parseFecha(perfil.fum) : sumarDias(hoy0(), -56));
  const [selector, setSelector] = useState(false);
  const h = hoy0();
  const e = estadoEmbarazo(aISO(fum));
  const fechaMostrada = modo === 'fum' ? fum : e.fpp;

  const guardar = () => {
    if (!nombre.trim()) {
      Alert.alert('Falta tu nombre', 'Escribe tu nombre para crear el perfil.');
      return;
    }
    guardarPerfil({
      id: perfil?.id ?? uid(),
      nombre: nombre.trim(),
      bebe: bebe.trim() || 'Mi bebé',
      fum: aISO(fum),
      color: perfil?.color ?? COLORES[perfiles.length % COLORES.length],
      demo: perfil?.demo,
      citas: perfil?.citas ?? [],
      pesos: perfil?.pesos ?? [],
      patadas: perfil?.patadas ?? [],
      notas: perfil?.notas ?? [],
    });
    onListo();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.fondo }} contentContainerStyle={{ padding: 20, paddingTop: ins.top + 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Pressable onPress={onListo}>
        <Text style={[E.h3, { color: C.rosa }]}>‹ Volver</Text>
      </Pressable>
      <Text style={[E.h1, { marginVertical: 12 }]}>{perfil ? 'Editar perfil' : 'Nuevo perfil'}</Text>

      <Campo etiqueta="Tu nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. María" />
      <Campo etiqueta="Nombre o apodo del bebé (opcional)" value={bebe} onChangeText={setBebe} placeholder="Ej. Frijolito" />

      <Text style={[E.etiqueta, { marginBottom: 6 }]}>¿Qué fecha conoces?</Text>
      <View style={{ flexDirection: 'row', backgroundColor: C.rosaSuave, borderRadius: 16, padding: 4, marginBottom: 12 }}>
        {(['fum', 'fpp'] as const).map((m) => (
          <Pressable key={m} onPress={() => { toque(); setModo(m); }} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: modo === m ? '#FFF' : 'transparent', alignItems: 'center' }}>
            <Text style={{ fontFamily: F.extra, color: modo === m ? C.rosa : C.suave, fontSize: 13 }}>{m === 'fum' ? 'Última menstruación' : 'Fecha de parto'}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={() => setSelector(true)} style={[{ backgroundColor: '#FFF', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.linea }]}>
        <Text style={{ fontSize: 26, marginRight: 12 }}>📅</Text>
        <View style={{ flex: 1 }}>
          <Text style={E.chico}>{modo === 'fum' ? 'Primer día de tu última menstruación' : 'Fecha probable de parto'}</Text>
          <Text style={E.h3}>{fechaLarga(fechaMostrada)}</Text>
        </View>
        <Text style={[E.h3, { color: C.rosa }]}>Cambiar</Text>
      </Pressable>

      <LinearGradient colors={['#FFE4EA', '#EEE8FF']} style={{ borderRadius: 22, padding: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Bebe semana={Math.max(1, e.semanasCumplidas)} tam={90} latido={false} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={E.h3}>Semana {e.semanasCumplidas} + {e.dias} días</Text>
          <Text style={E.chico}>Mes {e.mes} · Trimestre {e.trimestre}</Text>
          <Text style={E.chico}>{modo === 'fum' ? `Parto estimado: ${fechaLarga(e.fpp)}` : `Última menstruación: ${fechaLarga(fum)}`}</Text>
        </View>
      </LinearGradient>

      <Boton texto={perfil ? 'Guardar cambios' : 'Crear perfil'} onPress={guardar} estilo={{ marginTop: 20 }} />

      <SelectorFecha
        visible={selector}
        titulo={modo === 'fum' ? 'Última menstruación' : 'Fecha probable de parto'}
        valor={fechaMostrada}
        min={modo === 'fum' ? sumarDias(h, -300) : h}
        max={modo === 'fum' ? h : sumarDias(h, 280)}
        onCerrar={() => setSelector(false)}
        onElegir={(d) => {
          setFum(modo === 'fum' ? d : sumarDias(d, -280));
          setSelector(false);
        }}
      />
    </ScrollView>
  );
}
