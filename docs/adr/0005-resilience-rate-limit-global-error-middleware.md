# ADR 0005: Resiliencia de Software con Middleware de Control de Errores Globales y Manejo de Rate Limit (HTTP 429)

* **Estado**: Aceptado
* **Fecha**: 2026-09-20
* **Autores**: Equipo de Arquitectura de Backend & Resiliencia de Software

---

## 📄 Contexto

Durante el uso intensivo de los adaptadores reales de IA con Groq SDK (`groq-sdk`), la capa de infraestructura puede alcanzar los límites de velocidad o cuotas gratuitas (**Free Tier Rate Limit - HTTP 429**).

Para garantizar la estabilidad del servicio **Classroom Calm Tech** y prevenir caídas o respuestas de error no estructuradas (500 Internal Server Error) que degraden la experiencia del profesor en el aula, se requería:
1. Una abstracción limpia en la Capa de Aplicación para representar excepciones de límite de peticiones de IA.
2. Interceptación y captura de errores HTTP 429 en los adaptadores de IA de Groq.
3. Un middleware global de control de errores en Express para interceptar `RateLimitError` y entregar respuestas de contingencia socrática estructuradas en JSON.

---

## 🎯 Decisión

1. **Clase de Error de Dominio `RateLimitError`**:
   - Crear `src/application/errors/RateLimitError.ts` extendiendo la clase `Error` nativa con `status = 429`.
   - Incorporar soporte para el atributo `pausaActivaContenido`, que entrega un guión pedagógico socrático de contingencia (anclaje corporal, respiración consciente, reflexión y retorno amable) en caso de agotamiento de cuota.

2. **Captura Resiliente en Adaptadores Groq (`GroqAffectiveAIAdapter` & `GroqReporteAIAdapter`)**:
   - Inspeccionar excepciones capturadas al invocar el modelo primario (`groq/compound-mini`) y el de respaldo (`qwen/qwen3.8-27b`).
   - Relanzar errores con estatus `429` o código `rate_limit_exceeded` como un `RateLimitError` limpio de dominio.

3. **Middleware Global de Errores Express (`server.ts`)**:
   - Inyectar el middleware `app.use((err, req, res, next) => ...)` justo al final de la definición de endpoints HTTP en Express.
   - Retornar un HTTP 429 consistente con un objeto JSON que incluye el mensaje descriptivo y el campo `pausaActivaContenido`, permitiendo que la interfaz web renderice la pausa activa socrática de contingencia sin romper la UX.

---

## ⚖️ Consecuencias

### Positivas:
- **Experiencia de Usuario Ininterrumpida**: El educador nunca recibe errores crudos o pantallas en blanco si se agota la cuota gratuita de la API de IA.
- **Arquitectura Limpia & Resiliencia**: El dominio y el puerto HTTP se comunican mediante tipos de excepción estándar sin acoplarse al SDK de Groq.
- **Cobertura de Pruebas**: Suite de tests unitarios verificada con Jest (`RateLimitError.spec.ts`).
