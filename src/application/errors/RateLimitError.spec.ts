import { RateLimitError } from './RateLimitError';

describe('RateLimitError', () => {
  it('debe instanciarse con estatus 429 y mensaje de contingencia socrática por defecto', () => {
    const error = new RateLimitError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.name).toBe('RateLimitError');
    expect(error.status).toBe(429);
    expect(error.message).toContain('Límite de peticiones a la API de IA alcanzado');
    expect(error.pausaActivaContenido).toContain('PAUSA CALM TECH');
    expect(error.pausaActivaContenido).toContain('ANCLAJE CORPORAL');
    expect(error.pausaActivaContenido).toContain('RESPIRACIÓN CONSCIENTE');
    expect(error.pausaActivaContenido).toContain('REFLEXIÓN SOCRÁTICA');
  });

  it('debe permitir mensajes personalizados y contenido de pausa a medida', () => {
    const customMessage = 'Quota exceeded for model groq/compound-mini';
    const customPausa = 'Contenido personalizado de emergencia';

    const error = new RateLimitError(customMessage, customPausa);

    expect(error.message).toBe(customMessage);
    expect(error.pausaActivaContenido).toBe(customPausa);
    expect(error.status).toBe(429);
  });
});
