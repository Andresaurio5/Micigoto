import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, E, F } from '../tema';
import { Perfil, estadoEmbarazo, fechaLarga, parseFecha } from '../logic';
import { useDatos } from '../store';
import { Boton } from '../components/Piezas';
import { FormPerfil } from './Perfiles';

export default function MiPerfil({ perfil }: { perfil: Perfil }) {
  const ins = useSafeAreaInsets();
  const { elegir, borrarPerfil } = useDatos();
  const [editar, setEditar] = useState(false);
  const e = estadoEmbarazo(perfil.fum);

  if (editar) return <FormPerfil perfil={perfil} onListo={() => setEditar(false)} />;

  const filas: [string, string][] = [
    ['Última menstruación', fechaLarga(parseFecha(perfil.fum))],
    ['Fecha probable de parto', fechaLarga(e.fpp)],
    ['Tiempo de embarazo', `${e.semanasCumplidas} semanas y ${e.dias} días`],
    ['Mes / trimestre', `Mes ${e.mes} · Trimestre ${e.trimestre}`],
    ['Días que faltan', e.diasRestantes > 0 ? `${e.diasRestantes} días` : '¡Ya es tiempo!'],
    ['Citas registradas', String(perfil.citas.length)],
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.fondo }} contentContainerStyle={{ padding: 18, paddingTop: ins.top + 20, paddingBottom: 120 }}>
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: perfil.color, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: F.black, fontSize: 40, color: '#FFF' }}>{perfil.nombre.charAt(0)}</Text>
        </View>
        <Text style={[E.h1, { marginTop: 10 }]}>{perfil.nombre}</Text>
        <Text style={E.chico}>Mamá de {perfil.bebe} 💗{perfil.demo ? ' · perfil de prueba' : ''}</Text>
      </View>

      <View style={E.tarjeta}>
        {filas.map(([k, v], i) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: C.linea }}>
            <Text style={E.chico}>{k}</Text>
            <Text style={[E.chico, { color: C.texto, fontFamily: F.extra, flexShrink: 1, textAlign: 'right', marginLeft: 10 }]}>{v}</Text>
          </View>
        ))}
      </View>

      <Boton texto="✏️  Editar datos" onPress={() => setEditar(true)} />
      <Boton texto="🔄  Cambiar de perfil" claro color={C.lila} onPress={() => elegir(null)} estilo={{ marginTop: 10 }} />
      <Boton
        texto="Eliminar este perfil"
        claro
        color="#D9534F"
        estilo={{ marginTop: 10 }}
        onPress={() =>
          Alert.alert('Eliminar perfil', 'Se borrarán sus citas y su diario. ¿Seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => borrarPerfil(perfil.id) },
          ])
        }
      />
      <Text style={[E.chico, { textAlign: 'center', marginTop: 20, fontSize: 12 }]}>
        Micigoto es una guía informativa y no reemplaza la consulta con tu médico.
      </Text>
    </ScrollView>
  );
}
