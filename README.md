# Classroom Calm Tech - EdTech MVP 🌿

Un MVP de tecnología educativa basado en **Calm Technology**, **Bienestar Digital** y **EdTech Inclusivo / Neurodiversidad** infantil, desarrollado bajo los principios estrictos de **Clean Architecture** (Arquitectura Limpia) en TypeScript, Node.js, Express y MongoDB.

## 🏛️ Arquitectura del Sistema (Clean Architecture)

El proyecto sigue la regla de dependencia unidireccional hacia adentro:

```
+-----------------------------------------------------------------------+
|  INFRAESTRUCTURA (Express HTTP, Mongoose MongoDB, HTML/CSS Web UI)    |
|   +---------------------------------------------------------------+   |
|   |  ADAPTADORES DE INTERFAZ (Presenters UX, Repositorios Mongo)  |   |
|   |   +-------------------------------------------------------+   |   |
|   |   |  CAPA DE APLICACIÓN (Use Cases & Ports)               |   |   |
|   |   |   +-------------------------------+                   |   |   |
|   |   |   | CAPA DE DOMINIO (Entities)    |                   |   |   |
|   |   |   | - AulaEmocional               |                   |   |   |
|   |   |   | - PresupuestoDopamina         |                   |   |   |
|   |   |   | - PerfilCognitivo (VO)        |                   |   |   |
|   |   |   +-------------------------------+                   |   |   |
|   |   +-------------------------------------------------------+   |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

### Capas del Proyecto:
- **`src/domain/`**: Entidades del modelo de negocio ([AulaEmocional.ts](file:///Users/elena/Developer/Caml_Tech/src/domain/entities/AulaEmocional.ts), [PresupuestoDopamina.ts](file:///Users/elena/Developer/Caml_Tech/src/domain/entities/PresupuestoDopamina.ts)) y Value Objects ([PerfilCognitivo.ts](file:///Users/elena/Developer/Caml_Tech/src/domain/value-objects/PerfilCognitivo.ts)). Sin dependencias de frameworks.
- **`src/application/`**: Casos de uso ([MitigarSobreestimulacion.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/MitigarSobreestimulacion.ts), [GenerarReporteSemanalAula.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/GenerarReporteSemanalAula.ts), [ValidarYConcederPremioConsciente.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/ValidarYConcederPremioConsciente.ts)) y contratos/puertos.
- **`src/adapters/`**: Adaptadores de interfaz ([TelemetryPresenter.ts](file:///Users/elena/Developer/Caml_Tech/src/adapters/presenters/TelemetryPresenter.ts), adaptadores Mock de IA y repositorios).
- **`src/infrastructure/`**: Punto de entrada HTTP con Express ([server.ts](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/web/server.ts)), modelo de base de datos MongoDB Mongoose, script seeder ([seed.ts](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/database/mongo/seed.ts)) y frontend Web accesible ([index.html](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/web/index.html)).

---

## 🧩 Adaptabilidad y Neurodiversidad (`PerfilCognitivo`)

El sistema ajusta dinámicamente los límites biológicos de exposición y recompensas según la neurodiversidad del estudiante:

| Perfil | Tiempo Máx. Pantalla | Límite Recompensas / Sesión | Objetivo de Salud Digital |
| :--- | :--- | :--- | :--- |
| **`Estandar`** | 30 min | 3 | Uso equilibrado habitual |
| **`TDAH`** | 20 min | 2 | Evita hiperfoco extenuante y caída dopaminérgica |
| **`AltaSensibilidad` (PAS)** | 25 min | 1 | Previene la sobreestimulación sensorial por premios |
| **`TEA`** | 20 min | 1 | Estructura predecible con pausas acotadas |

---

## 🎨 3 Reglas de Oro de UX Consciente (Calm Tech)

1. **Transiciones Orgánicas (2s)**: Cambios cromáticos progresivos (`transition: background-color 2s ease-in-out`) que evitan micro-alertas de estrés en el educador.
2. **Audio No Agresivo**: Frecuencia binaural armónica de 432 Hz con envolvente *fade-in/fade-out* progresiva (1500ms) ejecutada mediante instrumentos orgánicos (cuenco tibetano).
3. **Micro-interacciones Lentas (Sin Popups/Toasts)**: Eliminación de banners emergentes e interrupciones abruptas. La UI respira al ritmo del aula.

---

## 🚀 Instalación y Comandos

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar suite de pruebas unitarias (Jest)
npm test

# 3. Poblado inicial de datos semilla en MongoDB (5 días lectivos)
npm run db:seed

# 4. Iniciar el servidor HTTP Express
npm start
```

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio y estado de MongoDB |
| `GET` | `/api/aula/estado` | DTO de estado de UI para el aula por defecto (`aula-4a`) |
| `GET` | `/api/aula/reporte` | Reporte psicopedagógico semanal del aula por defecto |
| `GET` | `/api/aulas/:id/ui` | Estado visual y cromático Calm Tech de un aula por ID |
| `POST` | `/api/aulas` | Crea o actualiza el nivel de energía de un aula |
| `POST` | `/api/aulas/:id/mitigar` | Ejecuta la pausa activa socrática/mindfulness de IA |
| `POST` | `/api/aulas/:id/reporte-semanal` | Genera un reporte psicopedagógico semanal con IA |
| `POST` | `/api/estudiante/solicitar-premio` | Regulador adaptativo del Presupuesto de Dopamina |
| `GET` | `/api/telemetria` | Historial de eventos de telemetría consciente |

---

## 💻 Interfaz de Usuario (Dashboard Frontend)

Una vez iniciado el servidor (`npm start`), podés acceder al Dashboard visual desde:
- **[http://localhost:3000](http://localhost:3000)**
- O abriendo directamente [src/infrastructure/web/index.html](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/web/index.html) en tu navegador.
