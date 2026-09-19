import { EventoTelemetria } from './ITelemetriaRepository';

export interface OpcionesReporteSemanal {
  aulaId: string;
  gradoEscolar: string;
  eventosSemana: EventoTelemetria[];
  observacionesDocente: string[];
}

export interface ReportePedagogicoSemanal {
  aulaId: string;
  resumenEjecutivo: string;
  patronesDetectados: string[];
  recomendacionesCalmTech: string[];
  fechaGeneracion: Date;
}

export interface IReportePedagogicoService {
  generarReporteSemanal(opciones: OpcionesReporteSemanal): Promise<ReportePedagogicoSemanal>;
}
