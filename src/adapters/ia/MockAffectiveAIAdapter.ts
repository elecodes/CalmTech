import { IAnafectivaService, OpcionesPausa } from '../../application/ports/IAnafectivaService';

/**
 * =========================================================================================
 * PROMPT SOCRÁTICO Y DE CALM TECH (Para integración con OpenAI / Anthropic API)
 * =========================================================================================
 * 
 * System / Developer Prompt:
 * -----------------------------------------------------------------------------------------
 * Actúas como una IA Afectiva especializada en "Calm Technology" y Bienestar Digital pedagógico.
 * Tu objetivo es diseñar una pausa activa socrática y guiada de mindfulness para niños/estudiantes
 * respetando estrictamente los principios de salud mental y autorregulación emocional.
 * 
 * REGLAS STRICTAS DE BIENESTAR DIGITAL Y CALM TECH:
 * 1. Duración Máxima: La pausa NO debe exceder los {duracionMaximaSegundos} segundos (máximo 120s).
 * 2. Tonalidad: Serena, empática, pausada y socrática. Utiliza metáforas de la naturaleza o corporales.
 * 3. Cero Estimulación Agresiva: SIN sonidos estruendosos, SIN luces parpadeantes, SIN elementos 
 *    de ludificación tóxica ni recompensas dopaminérgicas (puntos, logros engañosos, rachas).
 * 4. Estructura de la Pausa (4 Momentos):
 *    a) Anclaje Corporal (10s): Invitar suavemente a pausar la pantalla y sentir la postura.
 *    b) Respiración Consciente (40s): Guía ritmada de respiración (ej. inhalar calma, exhalar prisa).
 *    c) Pregunta Socrática (40s): Una sola pregunta abierta e introspectiva adaptada al grado escolar
 *       {gradoEscolar} para reorientar el enfoque sin generar culpa ni juicio.
 *    d) Transición Amable (10s): Retorno gradual y enfocado a la actividad académica.
 * 
 * CONTEXTO DE ENTRADA:
 * - Grado Escolar: {gradoEscolar}
 * - Estado de Energía Actual: {nivelEnergiaActual}
 * - Observación del Docente: {descripcionProfesor}
 * =========================================================================================
 */
export class MockAffectiveAIAdapter implements IAnafectivaService {
  public async generarPausaMindfulness(opciones: OpcionesPausa): Promise<string> {
    // Simulación de latencia asíncrona de un proveedor LLM
    await new Promise((resolve) => setTimeout(resolve, 200));

    return `
[PAUSA CALM TECH - Máximo ${opciones.duracionMaximaSegundos}s | Adaptada para ${opciones.gradoEscolar}]

1. ANCLAJE CORPORAL:
   "Estudiantes de ${opciones.gradoEscolar}, deslicemos suavemente las manos fuera del teclado o la pantalla y apoyemos ambos pies en el suelo. Sintamos la estabilidad de la silla."

2. RESPIRACIÓN CONSCIENTE:
   "Inhalamos profundo contando 1, 2, 3... retenemos un momento la calma... y exhalamos despacio dejando ir la prisa acumulada."

3. REFLEXIÓN SOCRÁTICA:
   "Observando lo que sucede en el aula: '${opciones.descripcionProfesor}'
   ¿Qué pensamiento o respiración podemos usar ahora mismo para volver a sentirnos dueños de nuestra atención?"

4. RETORNO AMABLE:
   "Guardamos esa sensación de control interno y regresamos con mirada fresca a nuestro trabajo."
`.trim();
  }
}
