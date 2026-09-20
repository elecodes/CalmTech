import Groq from 'groq-sdk';
import { IAnafectivaService, OpcionesPausa } from '../../application/ports/IAnafectivaService';

/**
 * Adaptador real para la IA Afectiva utilizando la API oficial de Groq (Modelo groq/compound-mini).
 * Implementa los principios de Calm Technology y control estricto de consumo de tokens.
 */
export class GroqAffectiveAIAdapter implements IAnafectivaService {
  private groq: Groq | null = null;
  private readonly primaryModel = 'groq/compound-mini';
  private readonly fallbackModel = 'qwen/qwen3.8-27b';

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      this.groq = new Groq({ apiKey });
    } else {
      console.warn('⚠️ GROQ_API_KEY no encontrada. GroqAffectiveAIAdapter funcionará en modo de contingencia (fallback).');
    }
  }

  public async generarPausaMindfulness(opciones: OpcionesPausa): Promise<string> {
    if (!this.groq) {
      return this.generarPausaFallback(opciones);
    }

    try {
      return await this.solicitarCompletadoGroq(this.primaryModel, opciones);
    } catch (primaryError: any) {
      console.warn(`⚠️ Error con modelo primario (${this.primaryModel}): ${primaryError.message}. Intentando modelo de respaldo (${this.fallbackModel})...`);
      try {
        return await this.solicitarCompletadoGroq(this.fallbackModel, opciones);
      } catch (fallbackError: any) {
        console.error(`⚠️ Error al llamar a la API de Groq:`, fallbackError.message);
        return this.generarPausaFallback(opciones);
      }
    }
  }

  private async solicitarCompletadoGroq(modelo: string, opciones: OpcionesPausa): Promise<string> {
    const completion = await this.groq!.chat.completions.create({
      model: modelo,
      max_tokens: 350,
      temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: `Actúas como una IA Afectiva pedagógica especializada en Calm Technology y Bienestar Digital.
Tu objetivo es generar una pausa activa socrática de mindfulness para niños respetando la autorregulación emocional.
REGLAS STRICTAS:
1. Duración Máxima: NO debe exceder los ${opciones.duracionMaximaSegundos} segundos.
2. Tonalidad: Serena, empática, inspiradora y socrática.
3. Cero estimulación agresiva: Sin ludificación tóxica, sin puntos ni alertas de estrés.
4. Estructura requerida en 4 momentos claros:
   1. ANCLAJE CORPORAL
   2. RESPIRACIÓN CONSCIENTE
   3. REFLEXIÓN SOCRÁTICA (una pregunta introspectiva adaptada al grado)
   4. RETORNO AMABLE`
        },
        {
          role: 'user',
          content: `Genera la pausa activa con estos datos:
- Grado Escolar: ${opciones.gradoEscolar}
- Estado de Energía: ${opciones.nivelEnergiaActual}
- Observación del Docente: ${opciones.descripcionProfesor}`
        }
      ]
    });

    const respuestaTexto = completion.choices[0]?.message?.content;
    if (respuestaTexto && respuestaTexto.trim() !== '') {
      return respuestaTexto.trim();
    }

    throw new Error('Respuesta vacía recibida desde Groq API');
  }

  private generarPausaFallback(opciones: OpcionesPausa): string {
    return `
[PAUSA CALM TECH - Máximo ${opciones.duracionMaximaSegundos}s | Adaptada para ${opciones.gradoEscolar}]

1. ANCLAJE CORPORAL:
   "Estudiantes de ${opciones.gradoEscolar}, deslicemos suavemente las manos fuera de la pantalla y apoyemos los pies en el suelo. Sintamos la estabilidad del aula."

2. RESPIRACIÓN CONSCIENTE:
   "Inhalamos profundo en 1, 2, 3... retenemos un instante... y exhalamos suavemente soltando la tensión."

3. REFLEXIÓN SOCRÁTICA:
   "Ante el estado actual: '${opciones.descripcionProfesor}'
   ¿Qué respiración o pensamiento tranquilo nos ayuda a recuperar el foco y la serenidad?"

4. RETORNO AMABLE:
   "Guardamos esa calma interior y volvemos con energía renovada a nuestra actividad."
`.trim();
  }
}
