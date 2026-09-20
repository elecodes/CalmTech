/**
 * Error de dominio para representar sobrepaso de cuotas o límites de velocidad (429 Rate Limit) de las APIs de IA (Groq).
 * Incluye soporte para mensaje de contingencia socrática adaptado a Calm Technology.
 */
export class RateLimitError extends Error {
  public readonly status: number = 429;
  public readonly pausaActivaContenido: string;

  constructor(
    message: string = 'Límite de peticiones a la API de IA alcanzado (Rate Limit 429). Se activó el modo de contingencia socrática.',
    pausaActivaContenido?: string
  ) {
    super(message);
    this.name = 'RateLimitError';

    this.pausaActivaContenido = pausaActivaContenido || `
[PAUSA CALM TECH - CONTINGENCIA SOCRÁTICA RATE LIMIT 429]

1. ANCLAJE CORPORAL:
   "Deslicemos suavemente las manos fuera de las pantallas y apoyemos ambos pies con firmeza en el suelo."

2. RESPIRACIÓN CONSCIENTE:
   "Inhalamos profundo en 1, 2, 3... retenemos la serenidad... y exhalamos despacio en 4, 3, 2, 1."

3. REFLEXIÓN SOCRÁTICA:
   "Cuando la tecnología requiere una pausa, ¿cómo podemos nosotros cultivar nuestra propia tranquilidad y foco interior?"

4. RETORNO AMABLE:
   "Con esa claridad y serenidad, retomamos nuestras actividades con ritmo consciente."
`.trim();

    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
