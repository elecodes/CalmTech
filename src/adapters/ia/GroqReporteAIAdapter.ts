import Groq from 'groq-sdk';
import {
  IReportePedagogicoService,
  OpcionesReporteSemanal,
  ReportePedagogicoSemanal
} from '../../application/ports/IReportePedagogicoService';
import { RateLimitError } from '../../application/errors/RateLimitError';

/**
 * Adaptador real para la generación de reportes psicopedagógicos empáticos mediante Groq SDK (Modelo groq/compound-mini).
 * Retorna JSON estructurado y respeta límites de tokens para la Free Tier.
 */
export class GroqReporteAIAdapter implements IReportePedagogicoService {
  private groq: Groq | null = null;
  private readonly primaryModel = 'groq/compound-mini';
  private readonly fallbackModel = 'qwen/qwen3.8-27b';

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      this.groq = new Groq({ apiKey });
    } else {
      console.warn('⚠️ GROQ_API_KEY no encontrada. GroqReporteAIAdapter funcionará en modo de contingencia (fallback).');
    }
  }

  public async generarReporteSemanal(opciones: OpcionesReporteSemanal): Promise<ReportePedagogicoSemanal> {
    if (!this.groq) {
      return this.generarReporteFallback(opciones);
    }

    try {
      return await this.solicitarReporteGroq(this.primaryModel, opciones);
    } catch (primaryError: any) {
      if (this.esRateLimitError(primaryError)) {
        throw new RateLimitError(
          `Límite de peticiones de Groq API rebasado (429 Rate Limit) al generar reporte con modelo primario (${this.primaryModel}).`
        );
      }
      console.warn(`⚠️ Error en modelo primario de reporte (${this.primaryModel}): ${primaryError.message}. Intentando modelo de respaldo...`);
      try {
        return await this.solicitarReporteGroq(this.fallbackModel, opciones);
      } catch (fallbackError: any) {
        if (this.esRateLimitError(fallbackError)) {
          throw new RateLimitError(
            `Límite de peticiones de Groq API rebasado (429 Rate Limit) al generar reporte con modelo de respaldo (${this.fallbackModel}).`
          );
        }
        console.error(`⚠️ Error al generar reporte desde Groq API:`, fallbackError.message);
        return this.generarReporteFallback(opciones);
      }
    }
  }

  private esRateLimitError(error: any): boolean {
    return (
      error?.status === 429 ||
      error?.statusCode === 429 ||
      (typeof error?.message === 'string' && error.message.includes('429')) ||
      (typeof error?.code === 'string' && error.code === 'rate_limit_exceeded')
    );
  }

  private async solicitarReporteGroq(modelo: string, opciones: OpcionesReporteSemanal): Promise<ReportePedagogicoSemanal> {
    const totalAlertas = opciones.eventosSemana.filter((e) => e.tipo === 'ALERTA_SOBREESTIMULACION').length;
    const totalPausas = opciones.eventosSemana.filter((e) => e.tipo === 'PAUSA_ACTIVADA').length;

    const completion = await this.groq!.chat.completions.create({
      model: modelo,
      max_tokens: 500,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Actúas como una IA especialista en Psicopedagogía Inclusiva y Calm Technology.
Debes analizar los eventos de telemetría y observaciones del docente para generar un reporte semanal en formato JSON estricto con las siguientes claves:
{
  "resumenEjecutivo": "string (resumen conciso de la semana)",
  "patronesDetectados": ["string", "string"],
  "recomendacionesCalmTech": ["string", "string"]
}`
        },
        {
          role: 'user',
          content: `Genera el reporte psicopedagógico para:
- Grado Escolar: ${opciones.gradoEscolar}
- Total Alertas de Sobreestimulación: ${totalAlertas}
- Total Pausas Mindfulness Ejecutadas: ${totalPausas}
- Observaciones Docente: ${opciones.observacionesDocente.join(' | ') || 'Sin observaciones registradas'}`
        }
      ]
    });

    const contenidoRaw = completion.choices[0]?.message?.content;
    if (contenidoRaw) {
      const datosParseados = JSON.parse(contenidoRaw);
      return {
        aulaId: opciones.aulaId,
        fechaGeneracion: new Date(),
        resumenEjecutivo: datosParseados.resumenEjecutivo || this.generarResumenPorDefecto(opciones, totalAlertas, totalPausas),
        patronesDetectados: Array.isArray(datosParseados.patronesDetectados) && datosParseados.patronesDetectados.length > 0
          ? datosParseados.patronesDetectados
          : this.generarPatronesPorDefecto(opciones),
        recomendacionesCalmTech: Array.isArray(datosParseados.recomendacionesCalmTech) && datosParseados.recomendacionesCalmTech.length > 0
          ? datosParseados.recomendacionesCalmTech
          : this.generarRecomendacionesPorDefecto()
      };
    }

    throw new Error('Respuesta de reporte vacía desde Groq API');
  }

  private generarReporteFallback(opciones: OpcionesReporteSemanal): ReportePedagogicoSemanal {
    const totalAlertas = opciones.eventosSemana.filter((e) => e.tipo === 'ALERTA_SOBREESTIMULACION').length;
    const totalPausas = opciones.eventosSemana.filter((e) => e.tipo === 'PAUSA_ACTIVADA').length;

    return {
      aulaId: opciones.aulaId,
      fechaGeneracion: new Date(),
      resumenEjecutivo: this.generarResumenPorDefecto(opciones, totalAlertas, totalPausas),
      patronesDetectados: this.generarPatronesPorDefecto(opciones),
      recomendacionesCalmTech: this.generarRecomendacionesPorDefecto()
    };
  }

  private generarResumenPorDefecto(opciones: OpcionesReporteSemanal, totalAlertas: number, totalPausas: number): string {
    return `En ${opciones.gradoEscolar} se registraron ${totalAlertas} evento(s) de sobreestimulación y se aplicaron ${totalPausas} pausa(s) mindfulness socráticas para recuperar el balance atencional del grupo.`;
  }

  private generarPatronesPorDefecto(opciones: OpcionesReporteSemanal): string[] {
    return [
      'Fluctuaciones en el nivel de agitación atencional tras dinámicas digitales intensas.',
      `Notas registradas por el docente: "${opciones.observacionesDocente.join(' | ') || 'Sin observaciones'}".`,
      'Respuesta positiva y rápida restauración de serenidad ante pausas socráticas sin estímulos visuales agresivos.'
    ];
  }

  private generarRecomendacionesPorDefecto(): string[] {
    return [
      'Establecer micro-pausas preventivas de 30 segundos antes de comenzar actividades de alta exigencia.',
      'Sustituir sistemas de puntos competitivos por retos colaborativos de ritmo sereno.',
      'Mantener la regulación activa del Presupuesto de Dopamina digital por perfil neurodivergente.'
    ];
  }
}
