export type TipoEventoTelemetria = 
  | 'ALERTA_SOBREESTIMULACION' 
  | 'PAUSA_ACTIVADA'
  | 'BLOQUEO_DOPAMINA_SALUD_DIGITAL'
  | 'RECOMPENSA_CONSCIENTE_CONCEDIDA';

export interface EventoTelemetria {
  id: string;
  tipo: TipoEventoTelemetria;
  aulaId: string;
  timestamp: Date;
  detalles?: Record<string, unknown>;
}

export interface ITelemetriaRepository {
  registrarEvento(evento: Omit<EventoTelemetria, 'id' | 'timestamp'>): Promise<void>;
  obtenerEventos(): Promise<EventoTelemetria[]>;
  obtenerEventosPorAula(aulaId: string): Promise<EventoTelemetria[]>;
}
