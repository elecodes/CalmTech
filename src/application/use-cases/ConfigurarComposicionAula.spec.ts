import { ConfigurarComposicionAula } from './ConfigurarComposicionAula';
import { InMemoryTelemetriaRepository } from '../../adapters/persistence/InMemoryTelemetriaRepository';

describe('ConfigurarComposicionAula Use Case', () => {
  let telemetriaRepository: InMemoryTelemetriaRepository;
  let useCase: ConfigurarComposicionAula;

  beforeEach(() => {
    telemetriaRepository = new InMemoryTelemetriaRepository();
    useCase = new ConfigurarComposicionAula(telemetriaRepository);
  });

  it('debe registrar exitosamente una composición válida de alumnos', async () => {
    const entrada = {
      aulaId: 'aula-4a',
      composicion: {
        estandar: 15,
        tdah: 5,
        altaSensibilidad: 3,
        tea: 2
      }
    };

    const resultado = await useCase.ejecutar(entrada);

    expect(resultado.exito).toBe(true);
    expect(resultado.totalAlumnos).toBe(25);
    expect(resultado.porcentajeNeurodivergencia).toBe(40); // 10 / 25 = 40%
    expect(resultado.mensaje).toContain("Composición del aula 'aula-4a' configurada exitosamente");

    const eventos = await telemetriaRepository.obtenerEventosPorAula('aula-4a');
    expect(eventos).toHaveLength(1);
    expect(eventos[0].tipo).toBe('CONFIGURACION_COMPOSICION_AULA');
    expect(eventos[0].detalles).toEqual({
      totalAlumnos: 25,
      totalNeurodivergentes: 10,
      porcentajeNeurodivergencia: 40,
      composicion: {
        estandar: 15,
        tdah: 5,
        altaSensibilidad: 3,
        tea: 2
      }
    });
  });

  it('debe lanzar error si el aulaId está vacío', async () => {
    await expect(
      useCase.ejecutar({
        aulaId: '',
        composicion: { estandar: 10, tdah: 2, altaSensibilidad: 1, tea: 1 }
      })
    ).rejects.toThrow('El ID del aula es obligatorio.');
  });

  it('debe lanzar error si las cantidades son negativas', async () => {
    await expect(
      useCase.ejecutar({
        aulaId: 'aula-4a',
        composicion: { estandar: -1, tdah: 2, altaSensibilidad: 0, tea: 0 }
      })
    ).rejects.toThrow('Las cantidades de alumnos no pueden ser negativas.');
  });

  it('debe lanzar error si la suma total de alumnos es 0', async () => {
    await expect(
      useCase.ejecutar({
        aulaId: 'aula-4a',
        composicion: { estandar: 0, tdah: 0, altaSensibilidad: 0, tea: 0 }
      })
    ).rejects.toThrow('El aula debe tener al menos un alumno configurado.');
  });
});
