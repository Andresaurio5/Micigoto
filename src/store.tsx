import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Perfil, perfilesDemo } from './logic';
import { refrescarWidget } from './widget/tarea';

const CLAVE = 'micigoto:v1';

type Datos = { perfiles: Perfil[]; activoId: string | null; ultimoId?: string | null };

type Ctx = {
  listo: boolean;
  perfiles: Perfil[];
  activo: Perfil | null;
  elegir: (id: string | null) => void;
  guardarPerfil: (p: Perfil) => void;
  actualizar: (id: string, cambio: (p: Perfil) => Perfil) => void;
  borrarPerfil: (id: string) => void;
  restaurarDemo: () => void;
};

const Contexto = createContext<Ctx | null>(null);

export function ProveedorDatos({ children }: { children: React.ReactNode }) {
  const [datos, setDatos] = useState<Datos>({ perfiles: [], activoId: null });
  const [listo, setListo] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CLAVE);
        if (raw) {
          setDatos(JSON.parse(raw));
        } else {
          setDatos({ perfiles: perfilesDemo(), activoId: null });
        }
      } catch {
        setDatos({ perfiles: perfilesDemo(), activoId: null });
      }
      setListo(true);
    })();
  }, []);

  useEffect(() => {
    if (!listo) return;
    AsyncStorage.setItem(CLAVE, JSON.stringify(datos))
      .catch(() => {})
      .finally(() => refrescarWidget(datos.perfiles.find((p) => p.id === (datos.activoId ?? datos.ultimoId)) ?? null));
  }, [datos, listo]);

  const elegir = useCallback((id: string | null) => setDatos((d) => ({ ...d, activoId: id, ultimoId: id ?? d.ultimoId })), []);

  const guardarPerfil = useCallback((p: Perfil) => {
    setDatos((d) => {
      const existe = d.perfiles.some((x) => x.id === p.id);
      return {
        perfiles: existe ? d.perfiles.map((x) => (x.id === p.id ? p : x)) : [...d.perfiles, p],
        activoId: p.id,
        ultimoId: p.id,
      };
    });
  }, []);

  const actualizar = useCallback((id: string, cambio: (p: Perfil) => Perfil) => {
    setDatos((d) => ({ ...d, perfiles: d.perfiles.map((x) => (x.id === id ? cambio(x) : x)) }));
  }, []);

  const borrarPerfil = useCallback((id: string) => {
    setDatos((d) => ({ perfiles: d.perfiles.filter((x) => x.id !== id), activoId: d.activoId === id ? null : d.activoId }));
  }, []);

  const restaurarDemo = useCallback(() => {
    setDatos((d) => ({ ...d, perfiles: [...d.perfiles.filter((p) => !p.demo), ...perfilesDemo()] }));
  }, []);

  const valor = useMemo<Ctx>(() => ({
    listo,
    perfiles: datos.perfiles,
    activo: datos.perfiles.find((p) => p.id === datos.activoId) ?? null,
    elegir,
    guardarPerfil,
    actualizar,
    borrarPerfil,
    restaurarDemo,
  }), [listo, datos, elegir, guardarPerfil, actualizar, borrarPerfil, restaurarDemo]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDatos(): Ctx {
  const c = useContext(Contexto);
  if (!c) throw new Error('useDatos fuera del proveedor');
  return c;
}
