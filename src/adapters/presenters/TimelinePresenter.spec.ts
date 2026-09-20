import { TimelinePresenter } from './TimelinePresenter';
import { EventoTelemetria } from '../../application/ports/ITelemetriaRepository';

describe('TimelinePresenter', () => {
  let presenter: TimelinePresenter;

  beforeEach(() => {
    presenter = new TimelinePresenter();
  });

  it('debe transformar correctamente los eventos de telemetría a bloques de tiempo UI con colores pastel', () => {
    const eventos: EventoTelemetria[] = [
      {
        id: 'ev-1',
        tipo: 'ALERTA_SOBREESTIMULACION',
        aulaId: 'aula-4a',
        timestamp: new Date('2026-09-20T10:00:00Z'),
        detalles: { descripcionProfesor: 'Griterío tras dinámica digital' }
      },
      {
        id: 'ev-2',
        tipo: 'PAUSA_ACTIVADA',
        aulaId: 'aula-4a',
        timestamp: new Date('2026-09-20T10:05:00Z'),
        detalles: { duracionMaximaSegundos: 120 }
      },
      {
        id: 'ev-3',
        tipo: 'RECOMPENSA_CONSCIENTE_CONCEDIDA',
        aulaId: 'aula-4a',
        timestamp: new Date('2026-09-20T10:20:00Z'),
        detalles: {}
      }
    ];

    const resultado = presenter.presentarLineaTiempo(eventos);

    expect(resultado).toHaveLength(3);
    expect(resultado[0].etiquetaVisual).toContain('Alerta');
    expect(resultado[0].colorFondoPastel).toBe('#FFEBEE');
    expect(resultado[1].colorFondoPastel).toBe('#FFF8E1');
    expect(resultado[2].colorFondoPastel).toBe('#E8F5E9');
  });

  it('debe manejar una lista vacía de eventos sin fallar', () => {
    const resultado = presenter.presentarLineaTiempo([]);
    expect(resultado).toEqual([]);
  });
});
