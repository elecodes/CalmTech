import { IReportePedagogicoService, OpcionesReporteSemanal, ReportePedagogicoSemanal } from '../../application/ports/IReportePedagogicoService';

/**
 * Adaptador Mock para simular la generación de reportes psicopedagógicos empáticos mediante un LLM.
 */
export class MockReporteAIAdapter implements IReportePedagogicoService {
  public async generarReporteSemanal(opciones: OpcionesReporteSemanal): Promise<ReportePedagogicoSemanal> {
    // Simulación de latencia de API LLM
    await new Promise((resolve) => setTimeout(resolve, 300));

    const totalAlertas = opciones.eventosSemana.filter((e) => e.tipo === 'ALERTA_SOBREESTIMULACION').length;
    const totalPausas = opciones.eventosSemana.filter((e) => e.tipo === 'PAUSA_ACTIVADA').length;

    return {
      aulaId: opciones.aulaId,
      fechaGeneracion: new Date(),
      resumenEjecutivo: `Durante la semana en ${opciones.gradoEscolar}, se registraron ${totalAlertas} alerta(s) de sobreestimulación y se ejecutaron exitosamente ${totalPausas} pausa(s) mindfulness socrática(s) para restaurar la calma colectiva.`,
      patronesDetectados: [
        'Incremento de fatiga cognitiva y agitación conductual tras períodos prolongados de lluvia o recreos de espacio cerrado.',
        `Notas cualitativas del equipo docente: "${opciones.observacionesDocente.join(' | ')}".`,
        'Respuesta favorable del alumnado a las pausas socráticas de respiración consciente sin estímulos visuales agresivos.'
      ],
      recomendacionesCalmTech: [
        'Programar micro-pausas preventivas de 30 segundos antes de comenzar bloques lectivos de alta exigencia.',
        'Sustituir dinámicas con tableros de puntos competitivos por desafíos colaborativos de ritmo pausado.',
        'Mantener activa la regulación de Presupuesto de Dopamina digital (máximo 40 minutos diarios por estudiante).'
      ]
    };
  }
}
