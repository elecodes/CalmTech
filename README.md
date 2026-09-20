# Classroom Calm Tech - EdTech MVP 🌿

Un MVP de tecnología educativa basado en **Calm Technology**, **Bienestar Digital** y **EdTech Inclusivo / Neurodiversidad** infantil, desarrollado bajo los principios estrictos de **Clean Architecture** (Arquitectura Limpia) en TypeScript, Node.js, Express, Groq AI SDK y MongoDB.

---

## 🏛️ Arquitectura del Sistema (Clean Architecture)

El proyecto sigue la regla de dependencia unidireccional hacia adentro:

```
+-----------------------------------------------------------------------+
|  INFRAESTRUCTURA (Express HTTP, Mongoose MongoDB, HTML/CSS Web UI)    |
|   +---------------------------------------------------------------+   |
|   |  ADAPTADORES DE INTERFAZ (Presenters UX, Repositorios, Groq)  |   |
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
- **`src/application/`**: Casos de uso ([ConfigurarComposicionAula.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/ConfigurarComposicionAula.ts), [MitigarSobreestimulacion.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/MitigarSobreestimulacion.ts), [GenerarReporteSemanalAula.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/GenerarReporteSemanalAula.ts), [ValidarYConcederPremioConsciente.ts](file:///Users/elena/Developer/Caml_Tech/src/application/use-cases/ValidarYConcederPremioConsciente.ts)) y puertos.
- **`src/adapters/`**: Adaptadores de interfaz ([TimelinePresenter.ts](file:///Users/elena/Developer/Caml_Tech/src/adapters/presenters/TimelinePresenter.ts), [TelemetryPresenter.ts](file:///Users/elena/Developer/Caml_Tech/src/adapters/presenters/TelemetryPresenter.ts), adaptadores reales de IA con Groq y repositorios MongoDB).
- **`src/infrastructure/`**: Servidor HTTP Express ([server.ts](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/web/server.ts)), persistencia Mongoose, script seeder ([seed.ts](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/database/mongo/seed.ts)) y frontend web accesible de dos columnas ([index.html](file:///Users/elena/Developer/Caml_Tech/src/infrastructure/web/index.html)).

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

## 🤖 Integración Real con Groq SDK (IA Generativa)

El sistema utiliza la API oficial de **Groq** (`groq-sdk`) impulsada por modelos de lenguaje de baja latencia (`groq/compound-mini` y `qwen/qwen3.8-27b`):
- **IA Afectiva (`GroqAffectiveAIAdapter`)**: Generación en vivo de pausas activas socráticas de 4 momentos (`max_tokens: 350`).
- **IA Psicopedagógica (`GroqReporteAIAdapter`)**: Generación de reportes semanales en formato `json_object` estructurado (`max_tokens: 500`).
- **Resiliencia y Fallback**: Modo de contingencia automático si no se configura la variable `GROQ_API_KEY`.

---

## 🎨 3 Reglas de Oro de UX Consciente (Calm Tech)

1. **Transiciones Orgánicas (2s)**: Cambios cromáticos progresivos (`transition: background-color 2s ease-in-out`) que evitan micro-alertas de estrés en el educador.
2. **Audio No Agresivo (Motor Neuroacústico 432 Hz + Binaural Alfa)**: Frecuencia de Resonancia Armónica de 432 Hz con estimulación binaural Alfa (4 Hz de diferencial estéreo: 430 Hz canal izquierdo / 434 Hz canal derecho) y armónico superior (864 Hz) con envolvente maestra de *fade-in* (800ms) y *fade-out* exponencial (4s) simulando un cuenco tibetano sin clics ni tonos bruscamente interrumpidos.
3. **Micro-interacciones Lentas (Sin Popups/Toasts)**: Eliminación de banners emergentes e interrupciones abruptas. La UI respira al ritmo del aula.

---

## 🚀 Instalación y Comandos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (crear .env a partir de .env.example)
cp .env.example .env
# Agregar tu GROQ_API_KEY en .env

# 3. Ejecutar suite de pruebas unitarias (Jest)
npm test

# 4. Poblado inicial de datos semilla en MongoDB (opcional)
npm run db:seed

# 5. Iniciar el servidor HTTP Express
npm start
```

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio y estado de MongoDB |
| `GET` | `/api/aula/estado` | DTO de estado de UI para el aula por defecto (`aula-4a`) |
| `GET` | `/api/aula/linea-tiempo` | Histórico visual de bloques de tiempo en tonos pastel |
| `GET` | `/api/aula/reporte` | Reporte psicopedagógico semanal generado por IA |
| `GET` | `/api/aulas/:id/ui` | Estado visual y cromático Calm Tech de un aula por ID |
| `POST` | `/api/aula/configurar` | Registra la composición de alumnos por perfil cognitivo |
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
