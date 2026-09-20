# ADR 0003: Módulo de Configuración del Aula, Línea de Tiempo de Energía e Integración Real con Groq SDK

* **Estado**: Aceptado
* **Fecha**: 2026-09-20
* **Autores**: Equipo de Arquitectura Fullstack & EdTech Inclusivo

---

## 📄 Contexto

En el proceso de evolución de **Classroom Calm Tech**, se requerían tres capacidades clave:
1. Permitir a los docentes registrar y validar la composición de alumnos por perfiles cognitivos (Estándar, TDAH, PAS, TEA) para calibrar el presupuesto de salud digital.
2. Visualizar históricamente los eventos de energía y regulación emocional en el dashboard mediante una línea de tiempo no invasiva de baja carga cognitiva.
3. Migrar las integraciones de IA simuladas (Mocks) hacia proveedores reales impulsados por el SDK oficial de Groq (`groq-sdk`) con soporte de modelos activos (`groq/compound-mini` / `qwen/qwen3.8-27b`) y contingencia resiliente (fallback).

---

## 🎯 Decisión

1. **Caso de Uso `ConfigurarComposicionAula`**:
   - Encapsular la lógica de validación (enteros no negativos, total de estudiantes > 0) y cálculo de porcentajes de neurodiversidad.
   - Registrar el evento `CONFIGURACION_COMPOSICION_AULA` en la telemetría persistida en MongoDB.

2. **Presentador `TimelinePresenter` (Línea de Tiempo Visual de Energía)**:
   - Mapear el historial de eventos a la interfaz `BloqueTiempoUI[]`.
   - Aplicar paletas pastel suaves de baja estimulación cognitiva (Terracota pastel, Ámbar suave, Lavanda, Verde orgánico y Azul pastel).
   - Renderizado en un contenedor horizontal accesible con scroll suave (`#timelineContainer`).

3. **Adaptadores de IA con Groq SDK (`GroqAffectiveAIAdapter` y `GroqReporteAIAdapter`)**:
   - Inyectar la API oficial de Groq leyendo la clave `GROQ_API_KEY` vía `dotenv`.
   - Utilizar el modelo de alta velocidad `groq/compound-mini` (con respaldo automático a `qwen/qwen3.8-27b`).
   - Implementar un patrón de contingencia resiliente que deriva al fallback en caso de falta de credenciales o indisponibilidad de red.

---

## ⚖️ Consecuencias

### Positivas:
- **Mayor Flexibilidad Pedagógica**: El docente puede ajustar la composición del grupo y consultar la línea de tiempo sin saturación visual.
- **IA Generativa Nativa en Tiempo Real**: Generación en vivo de pausas activas socráticas y reportes psicopedagógicos empáticos en formato JSON estructurado.
- **Alta Resiliencia**: Si la API key falla o no se configura, el sistema continúa funcionando sin interrumpir el flujo del usuario.

### Trade-offs:
- Requiere mantenimiento de la clave `GROQ_API_KEY` en el archivo `.env`.
