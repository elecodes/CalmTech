# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y la convención de [Conventional Commits](https://www.conventionalcommits.org/).

## [1.2.0] - 2026-09-20

### 🚀 Added
- **Módulo de Configuración del Aula**: Caso de uso `ConfigurarComposicionAula` para registrar y validar la proporción de estudiantes según perfiles cognitivos (`Estandar`, `TDAH`, `AltaSensibilidad`, `TEA`).
- **Endpoint HTTP de Configuración**: `POST /api/aula/configurar` para recibir composición de alumnos y persistir en telemetría de MongoDB.
- **Línea de Tiempo Visual de Energía**: Presentador `TimelinePresenter` que transforma eventos de telemetría a bloques de tiempo UI (`BloqueTiempoUI[]`) usando paletas pastel de baja estimulación cognitiva.
- **Endpoint HTTP de Línea de Tiempo**: `GET /api/aula/linea-tiempo` para alimentar la vista histórica en vivo.
- **Integración Real con Groq SDK**: Adaptadores `GroqAffectiveAIAdapter` y `GroqReporteAIAdapter` utilizando `groq-sdk` con modelos activos (`groq/compound-mini` y `qwen/qwen3.8-27b`) y soporte para `.env` vía `dotenv`.
- **Estructura Web UI de Dos Columnas**: Rediseño completo de `index.html` organizando la Configuración Adaptativa y el Monitor de Atmósfera lado a lado junto con la sección de Línea de Tiempo horizontal.
- **ADR 0003**: Documentación de decisiones sobre configuración del aula, línea de tiempo e integración con Groq SDK.

## [1.1.0] - 2026-09-19

### 🚀 Added
- **EdTech Inclusivo / Neurodiversidad**: Value Object `PerfilCognitivo` con soporte para perfiles `Estandar`, `TDAH`, `AltaSensibilidad` (PAS) y `TEA`.
- **Regulador Adaptativo de Dopamina**: Entidad `PresupuestoDopamina` actualizada para ajustar dinámicamente el tiempo de pantalla y el tope de recompensas por sesión según el perfil neurológico.
- **Nuevo Caso de Uso**: `ValidarYConcederPremioConsciente` para orquestar aprobaciones/denegaciones éticas con telemetría.
- **Endpoint HTTP**: `POST /api/estudiante/solicitar-premio` con soporte para `tipoNeurodivergencia`.
- **Pruebas Unitarias TDD**: Suite de tests en `PresupuestoDopamina.spec.ts` ejecutables con Jest (`npm test`).
- **Seeder MongoDB**: Script `src/infrastructure/database/mongo/seed.ts` (`npm run db:seed`) para poblar 30 eventos sintéticos de 5 días lectivos de telemetría.
- **ADR 0002**: Decisión de arquitectura sobre adaptabilidad por neurodiversidad.

## [1.0.0] - 2026-09-19

### 🚀 Added
- **Capa de Dominio**: Entidades `AulaEmocional` y `PresupuestoDopamina`.
- **Capa de Aplicación**: Puertos `IAnafectivaService`, `ITelemetriaRepository`, `IReportePedagogicoService`, `IAulaRepository` y casos de uso `MitigarSobreestimulacion` y `GenerarReporteSemanalAula`.
- **Adaptadores de IA**: `MockAffectiveAIAdapter` (Prompt Socrático y de Calm Tech) y `MockReporteAIAdapter`.
- **Presentador UX Calm Tech**: `TelemetryPresenter` con las 3 Reglas de Oro de UX Consciente (transiciones de 2s, audio 432 Hz y cero popups).
- **Infraestructura HTTP y BD**: Servidor Express con CORS, persisistencia Mongoose en MongoDB (`MongoTelemetriaRepository`) y Dashboard Web estático accesible (`index.html`).
- **Documentación**: `README.md` y `ADR 0001`.
