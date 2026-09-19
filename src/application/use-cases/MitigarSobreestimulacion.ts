import { IAnafectivaService, OpcionesPausa } from '../ports/IAnafectivaService';
import { IAulaRepository } from '../ports/IAulaRepository';
import { ITelemetriaRepository } from '../ports/ITelemetriaRepository';

export interface MitigarSobreestimulacionEntrada {
  aulaId: string;
  descripcionProfesor: string;
}

export interface MitigarSobreestimulacionSalida {
  intervencionRequerida: boolean;
  pausaMindfulness?: string;
  mensaje: string;
}

export class MitigarSobreestimulacion {
  constructor(
    private readonly afectiveAIService: IAnafectivaService,
    private readonly aulaRepository: IAulaRepository,
    private readonly telemetriaRepository: ITelemetriaRepository
  ) {}

  public async ejecutar(entrada: MitigarSobreestimulacionEntrada): Promise<MitigarSobreestimulacionSalida> {
    const aula = await this.aulaRepository.obtenerPorId(entrada.aulaId);

    if (!aula) {
      throw new Error(`Aula con ID '${entrada.aulaId}' no encontrada.`);
    }

    if (!aula.requierePausaActiva()) {
      return {
        intervencionRequerida: false,
        mensaje: `El aula está en estado '${aula.nivelEnergia}'. No se requiere pausa activa.`
      };
    }

    // Registrar evento de telemetría: ALERTA_SOBREESTIMULACION
    await this.telemetriaRepository.registrarEvento({
      tipo: 'ALERTA_SOBREESTIMULACION',
      aulaId: aula.id,
      detalles: {
        nivelEnergia: aula.nivelEnergia,
        gradoEscolar: aula.gradoEscolar,
        descripcionProfesor: entrada.descripcionProfesor
      }
    });

    const opciones: OpcionesPausa = {
      gradoEscolar: aula.gradoEscolar,
      duracionMaximaSegundos: 120,
      descripcionProfesor: entrada.descripcionProfesor,
      nivelEnergiaActual: aula.nivelEnergia
    };

    const pausa = await this.afectiveAIService.generarPausaMindfulness(opciones);

    // Registrar evento de telemetría: PAUSA_ACTIVADA
    await this.telemetriaRepository.registrarEvento({
      tipo: 'PAUSA_ACTIVADA',
      aulaId: aula.id,
      detalles: {
        duracionMaximaSegundos: opciones.duracionMaximaSegundos,
        longitudRespuestaCaracteres: pausa.length
      }
    });

    return {
      intervencionRequerida: true,
      pausaMindfulness: pausa,
      mensaje: `Pausa activa generada exitosamente para mitigar el estado de ${aula.nivelEnergia.toLowerCase()}.`
    };
  }
}
