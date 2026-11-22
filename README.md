# Micigoto 🍼

App Android para seguir el embarazo semana a semana.

**Descargar APK:** https://github.com/Andresaurio5/Micigoto/releases/latest/download/Micigoto.apk

## Qué hace
- **Widget principal** con el bebé animado dentro de la pancita: flota, le late el corazón y crece y cambia de forma según la semana (célula → embrión → feto). Muestra semanas + días, mes, trimestre, % del embarazo, días que faltan y fecha probable de parto.
- **Comparación con frutas** de la semana 4 a la 40 (uva, palta, plátano, sandía...), con medidas en cm y peso. Al tocarla te muestra la fruta de la próxima semana.
- **Semana a semana**: explora las 40 semanas y dale a "Ver cómo crece" para ver la animación de todo el embarazo.
- **Fecha de la última menstruación** (o fecha de parto si ya la sabes) para calcular todo.
- **Citas** con el ginecólogo, controles prenatales, ecografías y laboratorio, con recordatorios un día antes y 2 horas antes. Incluye un plan de controles sugerido.
- **Diario**: contador de pataditas con cronómetro, gráfico de peso y notas de cómo te sientes.
- **Widget para la pantalla de inicio** del celular (mantén presionada la pantalla → Widgets → Micigoto): muestra al bebé de la semana, la fruta, la barra de progreso y los días que faltan. Se actualiza solo.
- **9 perfiles de prueba**, uno por cada mes de embarazo, y se pueden crear perfiles propios.

## Tecnología
React Native + Expo (TypeScript). Los datos se guardan en el celular (AsyncStorage). El APK se compila solo con GitHub Actions (`.github/workflows/android.yml`).

```bash
npm install
npx expo start
```
