import { IAulaRepository } from '../ports/IAulaRepository';
import { ITelemetriaRepository } from '../ports/ITelemetriaRepository';
import { IReportePedagogicoService, ReportePedagogicoSemanal } from '../ports/IReportePedagogicoService';

export interface GenerarReporteSemanalAulaEntrada {
  aulaId: string;
  observacionesDocente: string[];
}

export class GenerarReporteSemanalAula {
  constructor(
    private readonly aulaRepository: IAulaRepository,
    private readonly telemetriaRepository: ITelemetriaRepository,
    private readonly reportePedagogicoService: IReportePedagogicoService
  ) {}

  public async ejecutar(entrada: GenerarReporteSemanalAulaEntrada): Promise<ReportePedagogicoSemanal> {
    const aula = await this.aulaRepository.obtenerPorId(entrada.aulaId);
    if (!aula) {
      throw new Error(`Aula con ID '${entrada.aulaId}' no encontrada.`);
    }

    const eventosSemana = await this.telemetriaRepository.obtenerEventosPorAula(entrada.aulaId);

    const reporte = await this.reportePedagogicoService.generarReporteSemanal({
      aulaId: aula.id,
      gradoEscolar: aula.gradoEscolar,
      eventosSemana,
      observacionesDocente: entrada.observacionesDocente
    });

    return reporte;
  }
}
