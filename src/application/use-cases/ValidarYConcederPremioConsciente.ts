import { PresupuestoDopamina, ResultadoEvaluacionRecompensa } from '../../domain/entities/PresupuestoDopamina';
import { PerfilCognitivo, TipoNeurodivergencia } from '../../domain/value-objects/PerfilCognitivo';
import { ITelemetriaRepository } from '../ports/ITelemetriaRepository';

export interface ValidarPremioEntrada {
  estudianteId: string;
  aulaId: string;
  tiempoSesionActualMinutos: number;
  tipoNeurodivergencia?: TipoNeurodivergencia;
}

export class ValidarYConcederPremioConsciente {
  constructor(
    private readonly telemetriaRepository: ITelemetriaRepository
  ) {}

  public async ejecutar(entrada: ValidarPremioEntrada): Promise<ResultadoEvaluacionRecompensa> {
    const perfil = PerfilCognitivo.crear(entrada.tipoNeurodivergencia);
    const presupuesto = new PresupuestoDopamina(entrada.estudianteId, perfil);

    const resultado = presupuesto.evaluarYSolicitarRecompensa(entrada.tiempoSesionActualMinutos);

    if (resultado.bloqueadoPorSaludDigital) {
      await this.telemetriaRepository.registrarEvento({
        tipo: 'BLOQUEO_DOPAMINA_SALUD_DIGITAL',
        aulaId: entrada.aulaId,
        detalles: {
          estudianteId: entrada.estudianteId,
          tipoPerfil: perfil.tipo,
          tiempoSesionActualMinutos: entrada.tiempoSesionActualMinutos,
          limiteMaximoMinutos: resultado.limiteMaximoMinutos,
          recompensasOtorgadas: resultado.recompensasOtorgadas,
          limiteRecompensas: resultado.limiteRecompensas,
          motivo: resultado.mensajeEmpatico
        }
      });
    } else {
      await this.telemetriaRepository.registrarEvento({
        tipo: 'RECOMPENSA_CONSCIENTE_CONCEDIDA',
        aulaId: entrada.aulaId,
        detalles: {
          estudianteId: entrada.estudianteId,
          tipoPerfil: perfil.tipo,
          tiempoSesionActualMinutos: entrada.tiempoSesionActualMinutos,
          recompensasOtorgadas: resultado.recompensasOtorgadas
        }
      });
    }

    return resultado;
  }
}
