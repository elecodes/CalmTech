import { EventoTelemetria } from '../../application/ports/ITelemetriaRepository';

export interface BloqueTiempoUI {
  id: string;
  timestamp: Date;
  horaFormateada: string;
  tipoEvento: string;
  etiquetaVisual: string;
  colorFondoPastel: string;
  colorTextoPastel: string;
  descripcion: string;
}

/**
 * Presentador de Línea de Tiempo Visual de Energía (Fase 1 - Opción 2)
 * Mapea el histórico de eventos de telemetría de MongoDB a la interfaz 'BloqueTiempoUI[]'
 * aplicando colores pastel suaves alineados con la filosofía de baja estimulación cognitiva de Calm Tech.
 */
export class TimelinePresenter {
  public presentarLineaTiempo(eventos: EventoTelemetria[]): BloqueTiempoUI[] {
    return eventos.map((evento) => this.mapearABloqueTiempo(evento));
  }

  private mapearABloqueTiempo(evento: EventoTelemetria): BloqueTiempoUI {
    const fecha = new Date(evento.timestamp);
    const horaFormateada = fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const infoVisual = this.obtenerEstiloPastel(evento);

    return {
      id: evento.id,
      timestamp: evento.timestamp,
      horaFormateada,
      tipoEvento: evento.tipo,
      etiquetaVisual: infoVisual.etiquetaVisual,
      colorFondoPastel: infoVisual.colorFondoPastel,
      colorTextoPastel: infoVisual.colorTextoPastel,
      descripcion: infoVisual.descripcion
    };
  }

  private obtenerEstiloPastel(evento: EventoTelemetria): {
    etiquetaVisual: string;
    colorFondoPastel: string;
    colorTextoPastel: string;
    descripcion: string;
  } {
    const detalles = evento.detalles || {};

    switch (evento.tipo) {
      case 'ALERTA_SOBREESTIMULACION':
        return {
          etiquetaVisual: '⚡ Alerta Sobreestimulación',
          colorFondoPastel: '#FFEBEE', // Terracota / Rosa Pastel
          colorTextoPastel: '#C62828',
          descripcion: (detalles.descripcionProfesor as string) || 'Nivel de agitación elevado detectado en el aula.'
        };

      case 'PAUSA_ACTIVADA':
        return {
          etiquetaVisual: '🧘 Pausa Consciente Activada',
          colorFondoPastel: '#FFF8E1', // Ámbar Pastel Suave
          colorTextoPastel: '#F57F17',
          descripcion: `Pausa mindfulness de ${detalles.duracionMaximaSegundos || 120}s iniciada.`
        };

      case 'BLOQUEO_DOPAMINA_SALUD_DIGITAL':
        return {
          etiquetaVisual: '🛡️ Límite Salud Digital',
          colorFondoPastel: '#F3E5F5', // Lavanda Pastel Suave
          colorTextoPastel: '#6A1B9A',
          descripcion: (detalles.motivo as string) || 'Protección de tiempo máximo de pantalla y balance dopaminérgico.'
        };

      case 'RECOMPENSA_CONSCIENTE_CONCEDIDA':
        return {
          etiquetaVisual: '🌱 Estímulo Consciente',
          colorFondoPastel: '#E8F5E9', // Verde Pastel
          colorTextoPastel: '#2E7D32',
          descripcion: 'Recompensa saludable aprobada bajo el presupuesto del perfil cognitivo.'
        };

      case 'CONFIGURACION_COMPOSICION_AULA':
        return {
          etiquetaVisual: '⚙️ Configuración del Aula',
          colorFondoPastel: '#E3F2FD', // Azul Pastel
          colorTextoPastel: '#1565C0',
          descripcion: `Composición ajustada: ${detalles.totalAlumnos || 0} alumnos (${detalles.porcentajeNeurodivergencia || 0}% neurodivergentes).`
        };

      default:
        return {
          etiquetaVisual: '📌 Evento de Aula',
          colorFondoPastel: '#F5F5F5',
          colorTextoPastel: '#424242',
          descripcion: 'Registro de actividad del sistema Calm Tech.'
        };
    }
  }
}
