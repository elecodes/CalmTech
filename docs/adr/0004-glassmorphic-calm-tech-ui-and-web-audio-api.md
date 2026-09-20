# ADR 0004: Rediseño de Interfaz Glassmorphic Calm Tech y Síntesis Sonora con Web Audio API

* **Estado**: Aceptado
* **Fecha**: 2026-09-20
* **Autores**: Equipo de Arquitectura Frontend & UX Consciente

---

## 📄 Contexto

Para elevar la experiencia de usuario del educador en el dashboard de **Classroom Calm Tech** y reducir la carga cognitiva simpática durante jornadas lectivas intensas, se requería:
1. Una interfaz visual moderna con diseño Glassmorphism, esferas ambientadas flotantes en segundo plano y transiciones cromáticas orgánicas lentas.
2. Un anillo indicador circular que "respire" rítmicamente en sustitución de números parpadeantes o badges rígidos.
3. Síntesis sonora nativa de alta fidelidad para el tono binaural de 432 Hz actuando como cuenco tibetano mediante la Web Audio API nativa sin archivos estáticos externos ni zumbidos agresivos.
4. Cumplimiento estricto de los estándares de calidad de diseño comprobados por **Impeccable** (0 antipatrones).

---

## 🎯 Decisión

1. **Estética Heritage & Glassmorphism Matte**:
   - Aplicar las variables cromáticas oficiales del tema Heritage (`google-labs-code/design.md`):
     - `--bg-base: #F7F5F2` (Limestone): Fondo mate cálido.
     - `--text-main: #1A1C1E` (Deep Ink): Contraste periodístico profundo.
     - `--slate-border: #6C7278` (Slate): Bordes refinados y elementos secundarios.
     - `--boston-clay: #B8422E` (Terracota): Único acento orgánico activo para botones e interacción.
   - Definir tarjetas Glassmorphic mate con fondo translúcido (`rgba(255, 255, 255, 0.45)`), `backdrop-filter: blur(12px)`, bordes delgados de `1px solid var(--glass-border)` y bordes pulidos de `8px` (`rounded.md`).
   - Mantener cambios cromáticos fluidos de 2 segundos en transiciones de estado.

2. **Tipografía Estructurada "Calm Modern Tech"**:
   - **`Plus Jakarta Sans`** (Google Fonts): Aplicada con `font-weight: 600` y `letter-spacing: -0.5px` para los titulares principales (`h1`, `h2`, `h3`) y el gran indicador de atmósfera (`.ring-status-text`), logrando un acabado limpio, moderno y espacial.
   - **`Inter`** (Google Fonts): Aplicada con `font-weight: 400`, `letter-spacing: -0.1px` y `line-height: 1.6` para el cuerpo de texto, guiones de IA, etiquetas de sliders, botones y controles.
   - **Marcas de Tiempo de Línea de Tiempo (`.pill-time`) & Etiquetas (`.pill-tag`)**: Uso de la variante `font-weight: 500` de Inter con `letter-spacing: -0.1px` para mantener legibilidad perfecta sin recurrir a fuentes toscas.

3. **Síntesis Sonora Nativa Neuroacústica (Web Audio API)**:
   - Implementar un motor neuroacústico de 3 osciladores senoidales:
     - Oscilador Izquierdo (`430 Hz`, stereo panner `-0.8`).
     - Oscilador Derecho (`434 Hz`, stereo panner `0.8`).
     - La diferencia diferencial de `4 Hz` induce estimulación de ondas cerebrales **Alfa** para atención receptiva y calma profunda.
     - Oscilador Armónico (`864 Hz`, 1er armónico natural) con volumen atenuado (`0.03`) para aportar calidez de cuenco tibetano.
   - Aplicar una envolvente de volumen maestra con *fade-in* lineal suave de `800ms` y *fade-out* exponencial de `4s` (duración total 4.8s) sin depender de librerías de terceros.

4. **Controles de Configuración con Sliders Interactivos**:
   - Sustituir los selectores rígidos por sliders de rango con badges de valor dinámico para calibrar los grupos de neurodiversidad (Estándar, TDAH, PAS, TEA).

5. **Línea de Tiempo Continua e i18n Bilingüe (`ES | EN`)**:
   - Píldoras cromáticas fluidas con tooltips descriptivos.
   - Conmutador directo de idioma (`🇪🇸 ES | 🇬🇧 EN`) que persiste en `localStorage`.
   - Corrección y estandarización de traducciones y ortografía de estados emocionales: `Hiperestimulación` (Español con tilde) y `Overstimulation` (Inglés).

---

## ⚖️ Consecuencias

### Positivas:
- **Reducción de Estrés del Docente & Estimulación Neuroacústica**: La interfaz transmite calma visual, gravitas periodística con elegancia editorial y estimulación alfa sonora no invasiva, eliminando notificaciones intrusivas.
- **Cero Dependencias Externas**: Carga ultra-rápida en Vanilla JS + CSS nativo.
- **Calidad Certificada**: Aprobación de 0 antipatrones en el escáner de Impeccable (`npx impeccable detect`).
