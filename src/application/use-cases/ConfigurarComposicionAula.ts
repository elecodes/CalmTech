import { ITelemetriaRepository } from '../ports/ITelemetriaRepository';
import { IAulaRepository } from '../ports/IAulaRepository';

export interface ComposicionAlumnos {
  estandar: number;
  tdah: number;
  altaSensibilidad: number;
  tea: number;
}

export interface ConfigurarComposicionAulaEntrada {
  aulaId: string;
  composicion: ComposicionAlumnos;
}

export interface ConfigurarComposicionAulaSalida {
  exito: boolean;
  mensaje: string;
  totalAlumnos: number;
  porcentajeNeurodivergencia: number;
  composicion: ComposicionAlumnos;
}

/**
 * Caso de uso: ConfigurarComposicionAula
 * Valida y registra la composición de alumnos (perfiles cognitivos y neurodiversidad) de un aula.
 */
export class ConfigurarComposicionAula {
  constructor(
    private readonly telemetriaRepository: ITelemetriaRepository,
    private readonly aulaRepository?: IAulaRepository
  ) {}

  public async ejecutar(entrada: ConfigurarComposicionAulaEntrada): Promise<ConfigurarComposicionAulaSalida> {
    const { aulaId, composicion } = entrada;

    if (!aulaId || aulaId.trim() === '') {
      throw new Error('El ID del aula es obligatorio.');
    }

    if (!composicion) {
      throw new Error('La composición de alumnos es obligatoria.');
    }

    const estandar = Number(composicion.estandar) || 0;
    const tdah = Number(composicion.tdah) || 0;
    const altaSensibilidad = Number(composicion.altaSensibilidad) || 0;
    const tea = Number(composicion.tea) || 0;

    if (estandar < 0 || tdah < 0 || altaSensibilidad < 0 || tea < 0) {
      throw new Error('Las cantidades de alumnos no pueden ser negativas.');
    }

    const totalAlumnos = estandar + tdah + altaSensibilidad + tea;

    if (totalAlumnos === 0) {
      throw new Error('El aula debe tener al menos un alumno configurado.');
    }

    const totalNeurodivergentes = tdah + altaSensibilidad + tea;
    const porcentajeNeurodivergencia = Math.round((totalNeurodivergentes / totalAlumnos) * 100);

    // Registrar el evento de configuración en el repositorio de telemetría (MongoDB / In-Memory)
    await this.telemetriaRepository.registrarEvento({
      tipo: 'CONFIGURACION_COMPOSICION_AULA',
      aulaId,
      detalles: {
        totalAlumnos,
        totalNeurodivergentes,
        porcentajeNeurodivergencia,
        composicion: {
          estandar,
          tdah,
          altaSensibilidad,
          tea
        }
      }
    });

    return {
      exito: true,
      mensaje: `Composición del aula '${aulaId}' configurada exitosamente con ${totalAlumnos} alumnos (${porcentajeNeurodivergencia}% neurodivergentes).`,
      totalAlumnos,
      porcentajeNeurodivergencia,
      composicion: {
        estandar,
        tdah,
        altaSensibilidad,
        tea
      }
    };
  }
}
