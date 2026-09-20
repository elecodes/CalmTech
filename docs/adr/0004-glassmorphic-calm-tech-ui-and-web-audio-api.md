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

1. **Estética Glassmorphic & Variables CSS**:
   - Definir variables CSS para los 4 estados emocionales del aula con una transición suave de `transition: all 2.5s cubic-bezier(0.4, 0, 0.2, 1)`.
   - Utilizar tarjetas de cristal esmerilado con `backdrop-filter: blur(16px)` y sombras de elevación neutras.

2. **Síntesis Sonora Nativa (Web Audio API)**:
   - Crear un oscilador senoidal dual (432 Hz fundamental + 864 Hz armónico superior).
   - Aplicar una envolvente de volumen con *fade-in* lineal de 3s y *fade-out* exponencial de 3s sin depender de librerías de terceros.

3. **Controles de Configuración con Sliders Interactivos**:
   - Sustituir los selectores rígidos por sliders de rango con badges de valor dinámico para calibrar los grupos de neurodiversidad (Estándar, TDAH, PAS, TEA).

4. **Línea de Tiempo Continua e i18n Bilingüe**:
   - Píldoras cromáticas fluidas con tooltips descriptivos.
   - Conmutador directo de idioma (`🇪🇸 ES | 🇬🇧 EN`) que persiste en `localStorage`.

---

## ⚖️ Consecuencias

### Positivas:
- **Reducción de Estrés del Docente**: La interfaz transmite calma visual y sonora, eliminando notificaciones intrusivas.
- **Cero Dependencias Externas**: Carga ultra-rápida en Vanilla JS + CSS nativo.
- **Calidad Certificada**: Aprobación de 0 antipatrones en el escáner de Impeccable (`npx impeccable detect`).
