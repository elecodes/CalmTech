import { EventoTelemetria, ITelemetriaRepository } from '../../application/ports/ITelemetriaRepository';

export class InMemoryTelemetriaRepository implements ITelemetriaRepository {
  private eventos: EventoTelemetria[] = [];

  public async registrarEvento(eventoInput: Omit<EventoTelemetria, 'id' | 'timestamp'>): Promise<void> {
    const nuevoEvento: EventoTelemetria = {
      id: `telemetria-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      ...eventoInput
    };
    this.eventos.push(nuevoEvento);
  }

  public async obtenerEventos(): Promise<EventoTelemetria[]> {
    return [...this.eventos];
  }

  public async obtenerEventosPorAula(aulaId: string): Promise<EventoTelemetria[]> {
    return this.eventos.filter((e) => e.aulaId === aulaId);
  }
}
