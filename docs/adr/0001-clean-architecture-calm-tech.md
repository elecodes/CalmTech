# ADR 0001: Adopción de Clean Architecture y Principios de Calm Technology

* **Estado**: Aceptado
* **Fecha**: 2026-09-19
* **Autores**: Equipo de Arquitectura de Software & UX

---

## 📄 Contexto

El proyecto **Classroom Calm Tech** busca mitigar la sobreestimulación digital y apoyar la autorregulación emocional en entornos escolares (EdTech). 
Requeríamos una arquitectura de software desacoplada que permitiera evolucionar los proveedores de IA (OpenAI, Anthropic), los motores de persistencia (Memory, MongoDB) y los canales de entrega (Console, Express, Web SPA) sin alterar el núcleo de reglas de negocio ni sobrecargar sensorialmente al usuario docente.

---

## 🎯 Decisión

1. **Adoptar Clean Architecture (Arquitectura Limpia)**:
   - **Dominio**: Entidades puras (`AulaEmocional`, `PresupuestoDopamina`) encapsulando invariantes de negocio sin dependencias de frameworks.
   - **Aplicación**: Casos de uso (`MitigarSobreestimulacion`, `GenerarReporteSemanalAula`) interactuando con contratos abstractos (puertos).
   - **Adaptadores**: Implementaciones concretas (`MockAffectiveAIAdapter`, `MongoTelemetriaRepository`, `TelemetryPresenter`).
   - **Infraestructura**: Servidor Express HTTP y frontend estático accesible.

2. **Implementar 3 Reglas de Oro de Calm Technology en la Capa de Presentación**:
   - **Transiciones Orgánicas (2s)**: Transiciones cromáticas suaves (`transition: background-color 2s ease-in-out`).
   - **Audio No Agresivo**: Frecuencias armónicas de 432 Hz con envolventes de desvanecimiento progresivo (*fade-in/fade-out* de 1500ms).
   - **Micro-interacciones Lentas (Sin Popups/Toasts)**: Renderizado armónico en el flujo continuo de la UI.

---

## ⚖️ Consecuencias y Trade-offs

### Positivas:
- **Desacoplamiento Total**: Cambiar la persistencia de memoria a MongoDB requirió 0 cambios en el caso de uso y en los controladores HTTP.
- **Testabilidad y Flexibilidad**: Los adaptadores de IA y repositorios pueden mockearse fácilmente en pruebas unitarias.
- **Salud Digital y Bienestar**: La interfaz reduce la fatiga cognitiva y previene la respuesta de estrés simpático en el aula.

### Trade-offs:
- **Mayor Indirección Inicial**: Crear puertos, interfaces y adaptadores añade archivos adicionales comparado con un script monolítico.
- **Curva de Aprendizaje**: Requiere disciplina de equipo para no violentar la regla de dependencia hacia adentro.
