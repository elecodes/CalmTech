# ADR 0002: Modelado de Adaptabilidad por Perfiles Neurodivergentes en el Dominio

* **Estado**: Aceptado
* **Fecha**: 2026-09-19
* **Autores**: Equipo de Arquitectura de Software & EdTech Inclusivo

---

## 📄 Contexto

Los modelos tradicionales de EdTech aplican reglas homogéneas de gamificación (puntos, rachas, recompensas infinitas) que afectan de manera desproporcionada a estudiantes neurodivergentes.
Niños con **TDAH** sufren colapsos por fatiga atencional post-hiperfoco, mientras que perfiles de **Alta Sensibilidad (PAS)** o **TEA** experimentan sobrecargas sensoriales cuando se les bombardea con micro-recompensas continuas.

---

## 🎯 Decisión

1. **Crear el Value Object `PerfilCognitivo`**:
   - Encapsular las variaciones neurológicas (`Estandar`, `TDAH`, `AltaSensibilidad`, `TEA`) mediante el patrón Factory.
   - Definir dinámicamente el `tiempoMaximoPantallaMinutos` (20 min para TDAH vs 30 min estándar) y el `limiteRecompensasPorSesion` (1 premio máximo para Alta Sensibilidad).

2. **Inyectar `PerfilCognitivo` en `PresupuestoDopamina`**:
   - La entidad pura de dominio evalúa biológicamente el estado del menor antes de conceder cualquier estímulo o interacción digital adicional.

3. **Telemetría Consciente de Salud Digital**:
   - Registrar eventos específicos (`BLOQUEO_DOPAMINA_SALUD_DIGITAL` y `RECOMPENSA_CONSCIENTE_CONCEDIDA`) en MongoDB para analítica psicopedagógica.

---

## ⚖️ Consecuencias

### Positivas:
- **Protección Biológica**: Previene la fatiga atencional y el crash dopaminérgico adaptando el software a la biología del niño.
- **Inclusión por Diseño**: El sistema se ajusta a la neurodiversidad sin estigmatizar ni requerir cambios en el flujo principal.
- **Cobertura de Pruebas**: Verificado mediante suite de pruebas TDD con Jest (`npm test`).
