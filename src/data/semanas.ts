// Datos semana a semana del embarazo (aprox. promedio; cada bebé crece a su ritmo).
// cm: hasta la semana 19 es largo cabeza-nalga; desde la 20, cabeza-talón.

export type InfoSemana = {
  semana: number;
  fruta: string;
  emoji: string;
  cm: number;
  gramos: number;
  bebe: string;
};

export const SEMANAS: InfoSemana[] = [
  { semana: 1, fruta: 'Aún sin bebé', emoji: '🌸', cm: 0, gramos: 0, bebe: 'Tu cuerpo se prepara: esta semana cuenta desde tu última menstruación, todavía no hay embarazo.' },
  { semana: 2, fruta: 'Aún sin bebé', emoji: '🌸', cm: 0, gramos: 0, bebe: 'Se acerca la ovulación. Si hay fecundación, aquí empieza todo.' },
  { semana: 3, fruta: 'Una sola célula', emoji: '✨', cm: 0.01, gramos: 0, bebe: 'El óvulo fecundado se divide una y otra vez mientras viaja hacia el útero.' },
  { semana: 4, fruta: 'Semilla de kiwi', emoji: '🥝', cm: 0.1, gramos: 0, bebe: 'Se implanta en el útero. Empiezan a formarse la placenta y el saco amniótico.' },
  { semana: 5, fruta: 'Pepita de naranja', emoji: '🍊', cm: 0.2, gramos: 0, bebe: 'Se forma el tubo neural, que será el cerebro y la médula espinal.' },
  { semana: 6, fruta: 'Arándano pequeño', emoji: '🫐', cm: 0.5, gramos: 0, bebe: '¡Su corazoncito empieza a latir! Aparecen los brotes de brazos y piernas.' },
  { semana: 7, fruta: 'Arándano', emoji: '🫐', cm: 1.0, gramos: 0.5, bebe: 'Su cerebro crece muy rápido y se forman los ojos, la nariz y la boca.' },
  { semana: 8, fruta: 'Cereza', emoji: '🍒', cm: 1.6, gramos: 1, bebe: 'Ya tiene deditos unidos como aletas y empieza a moverse, aunque no lo sientas.' },
  { semana: 9, fruta: 'Uva', emoji: '🍇', cm: 2.3, gramos: 2, bebe: 'Desaparece la colita embrionaria y se forman los párpados y las orejas.' },
  { semana: 10, fruta: 'Frutilla', emoji: '🍓', cm: 3.1, gramos: 4, bebe: 'Termina la etapa embrionaria: ya es un feto con todos sus órganos formados.' },
  { semana: 11, fruta: 'Aceituna grande', emoji: '🫒', cm: 4.1, gramos: 7, bebe: 'Sus dedos se separan, empiezan las uñas y puede abrir y cerrar las manos.' },
  { semana: 12, fruta: 'Limón', emoji: '🍋', cm: 5.4, gramos: 14, bebe: 'Sus reflejos se activan: si te tocas la panza, puede moverse en respuesta.' },
  { semana: 13, fruta: 'Durazno pequeño', emoji: '🍑', cm: 7.4, gramos: 23, bebe: 'Se forman sus huellas dactilares y las cuerdas vocales.' },
  { semana: 14, fruta: 'Manzana verde', emoji: '🍏', cm: 8.7, gramos: 43, bebe: 'Puede fruncir el ceño, hacer muecas y chuparse el dedo.' },
  { semana: 15, fruta: 'Manzana', emoji: '🍎', cm: 10.1, gramos: 70, bebe: 'Percibe la luz a través de los párpados y sus huesos se endurecen.' },
  { semana: 16, fruta: 'Palta', emoji: '🥑', cm: 11.6, gramos: 100, bebe: 'Su corazón bombea unos 25 litros de sangre al día. Sus ojitos se mueven.' },
  { semana: 17, fruta: 'Pera', emoji: '🍐', cm: 13, gramos: 140, bebe: 'Empieza a acumular grasita bajo la piel para mantenerse calientito.' },
  { semana: 18, fruta: 'Mango', emoji: '🥭', cm: 14.2, gramos: 190, bebe: 'Ya puede oír: tu voz y los latidos de tu corazón son su música favorita.' },
  { semana: 19, fruta: 'Tomate', emoji: '🍅', cm: 15.3, gramos: 240, bebe: 'Lo cubre una capa protectora llamada vérnix. Quizás sientas las primeras pataditas.' },
  { semana: 20, fruta: 'Plátano', emoji: '🍌', cm: 25.6, gramos: 300, bebe: '¡Mitad del camino! En la ecografía ya se puede ver si es niño o niña.' },
  { semana: 21, fruta: 'Plátano grande', emoji: '🍌', cm: 26.7, gramos: 360, bebe: 'Traga líquido amniótico y practica la digestión. Sus pataditas son más fuertes.' },
  { semana: 22, fruta: 'Mango grande', emoji: '🥭', cm: 27.8, gramos: 430, bebe: 'Se forman sus cejas y pestañas. Su sentido del tacto se desarrolla.' },
  { semana: 23, fruta: 'Melón pequeño', emoji: '🍈', cm: 28.9, gramos: 500, bebe: 'Reconoce sonidos fuertes y puede asustarse con ellos.' },
  { semana: 24, fruta: 'Coco', emoji: '🥥', cm: 30, gramos: 600, bebe: 'Sus pulmones empiezan a producir surfactante, clave para respirar al nacer.' },
  { semana: 25, fruta: 'Berenjena', emoji: '🍆', cm: 34.6, gramos: 660, bebe: 'Responde a tu voz y su cabello empieza a tomar color.' },
  { semana: 26, fruta: 'Piña pequeña', emoji: '🍍', cm: 35.6, gramos: 760, bebe: 'Abre los ojos por primera vez y practica respirar con el líquido amniótico.' },
  { semana: 27, fruta: 'Melón', emoji: '🍈', cm: 36.6, gramos: 875, bebe: 'Duerme y despierta en ciclos regulares. ¡Hasta puede tener hipo!' },
  { semana: 28, fruta: 'Berenjena grande', emoji: '🍆', cm: 37.6, gramos: 1000, bebe: 'Empieza el tercer trimestre. Parpadea y quizás ya sueña.' },
  { semana: 29, fruta: 'Piña', emoji: '🍍', cm: 38.6, gramos: 1150, bebe: 'Sus músculos y pulmones maduran. Patea, se estira y da vueltas.' },
  { semana: 30, fruta: 'Coco grande', emoji: '🥥', cm: 39.9, gramos: 1320, bebe: 'Su cerebro crece a toda velocidad y aparecen más pliegues.' },
  { semana: 31, fruta: 'Melón grande', emoji: '🍈', cm: 41.1, gramos: 1500, bebe: 'Puede girar la cabeza de lado a lado y sus cinco sentidos funcionan.' },
  { semana: 32, fruta: 'Piña grande', emoji: '🍍', cm: 42.4, gramos: 1700, bebe: 'Sus uñitas ya llegan a la punta de los dedos. Practica respirar y tragar.' },
  { semana: 33, fruta: 'Calabaza', emoji: '🎃', cm: 43.7, gramos: 1920, bebe: 'Sus huesos se endurecen, menos los del cráneo, que siguen flexibles para el parto.' },
  { semana: 34, fruta: 'Melón cantalupo', emoji: '🍈', cm: 45, gramos: 2150, bebe: 'Su sistema nervioso central y sus pulmones siguen madurando.' },
  { semana: 35, fruta: 'Sandía pequeña', emoji: '🍉', cm: 46.2, gramos: 2380, bebe: 'Ya casi no le queda espacio: sentirás más empujones que pataditas.' },
  { semana: 36, fruta: 'Zapallo', emoji: '🎃', cm: 47.4, gramos: 2620, bebe: 'Probablemente ya está de cabeza, listo para nacer.' },
  { semana: 37, fruta: 'Sandía mediana', emoji: '🍉', cm: 48.6, gramos: 2860, bebe: 'Se considera a término temprano. Practica succionar y agarrar.' },
  { semana: 38, fruta: 'Sandía', emoji: '🍉', cm: 49.8, gramos: 3080, bebe: 'Sus órganos están listos para funcionar fuera de la pancita.' },
  { semana: 39, fruta: 'Sandía grande', emoji: '🍉', cm: 50.7, gramos: 3290, bebe: 'Sigue acumulando grasita. ¡Pronto se conocerán!' },
  { semana: 40, fruta: 'Sandía gigante', emoji: '🍉', cm: 51.2, gramos: 3460, bebe: '¡Llegó la fecha probable de parto! Solo un 5% nace justo hoy, así que paciencia.' },
];

export function infoSemana(semana: number): InfoSemana {
  const s = Math.max(1, Math.min(40, Math.floor(semana)));
  return SEMANAS[s - 1];
}

/** Cómo te sientes tú, por rangos de semanas. */
export function infoMama(semana: number): { sintomas: string; consejo: string } {
  if (semana < 4) return {
    sintomas: 'Quizás aún no notas nada. Algunas mujeres sienten un leve cólico o ven un pequeño sangrado de implantación.',
    consejo: 'Empieza a tomar ácido fólico: ayuda a prevenir defectos del tubo neural.',
  };
  if (semana < 9) return {
    sintomas: 'Náuseas, cansancio, pechos sensibles y ganas de orinar seguido. ¡Todo normal!',
    consejo: 'Come porciones pequeñas varias veces al día y ten galletas a mano para las náuseas.',
  };
  if (semana < 14) return {
    sintomas: 'Las náuseas empiezan a calmarse y quizás notes la pancita un poco más firme.',
    consejo: 'Es buen momento para la ecografía del primer trimestre (semanas 11 a 14).',
  };
  if (semana < 20) return {
    sintomas: 'Más energía, más apetito y puede aparecer congestión nasal o encías sensibles.',
    consejo: 'Hidrátate bien y empieza a dormir de lado, idealmente sobre el lado izquierdo.',
  };
  if (semana < 28) return {
    sintomas: 'Sientes las pataditas, puede doler la espalda y aparecer acidez o calambres.',
    consejo: 'Entre las semanas 24 y 28 toca la prueba de glucosa. Camina un poco cada día.',
  };
  if (semana < 36) return {
    sintomas: 'Falta de aire, hinchazón de pies y contracciones de práctica (Braxton Hicks).',
    consejo: 'Cuenta las pataditas a diario y empieza a preparar la maleta para el hospital.',
  };
  return {
    sintomas: 'Presión en la pelvis, insomnio y muchas ganas de conocer a tu bebé.',
    consejo: 'Ten listo el plan de parto. Ve al hospital si rompes fuente o tienes contracciones regulares.',
  };
}

/** Controles prenatales sugeridos (basado en recomendaciones generales de la OMS). */
export const PLAN_CONTROLES: { semana: number; titulo: string; detalle: string }[] = [
  { semana: 8, titulo: 'Primer control', detalle: 'Confirmación del embarazo, análisis de sangre y orina, ácido fólico.' },
  { semana: 12, titulo: 'Ecografía del 1er trimestre', detalle: 'Translucencia nucal y fecha probable de parto.' },
  { semana: 20, titulo: 'Ecografía morfológica', detalle: 'Revisión detallada de los órganos del bebé.' },
  { semana: 26, titulo: 'Prueba de glucosa', detalle: 'Descarta diabetes gestacional (semanas 24 a 28).' },
  { semana: 30, titulo: 'Control del 3er trimestre', detalle: 'Presión arterial, peso y crecimiento del bebé.' },
  { semana: 34, titulo: 'Ecografía de crecimiento', detalle: 'Posición del bebé y líquido amniótico.' },
  { semana: 36, titulo: 'Control y cultivo', detalle: 'Prueba de estreptococo B y plan de parto.' },
  { semana: 38, titulo: 'Control semanal', detalle: 'Monitoreo de latidos y contracciones.' },
  { semana: 40, titulo: 'Control a término', detalle: 'Evaluación si el bebé aún no nace.' },
];
