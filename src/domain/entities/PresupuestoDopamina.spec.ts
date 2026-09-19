import { PresupuestoDopamina } from './PresupuestoDopamina';
import { PerfilCognitivo } from '../value-objects/PerfilCognitivo';

describe('PresupuestoDopamina Entity (Reglas Biológicas y Neurodiversidad)', () => {
  const estudianteId = 'est-test-01';

  describe('Perfil Estándar', () => {
    it('debe aprobar la recompensa si el tiempo de sesión es menor al límite saludable (20 min < 30 min)', () => {
      const presupuesto = new PresupuestoDopamina(estudianteId, PerfilCognitivo.crear('Estandar'));
      const resultado = presupuesto.evaluarYSolicitarRecompensa(20);

      expect(resultado.concedida).toBe(true);
      expect(resultado.bloqueadoPorSaludDigital).toBe(false);
      expect(resultado.tiempoTotalAcumuladoMinutos).toBe(20);
      expect(resultado.tipoPerfil).toBe('Estandar');
      expect(resultado.mensajeEmpatico).toContain('Recompensa adaptada (Estandar) aprobada');
    });

    it('debe bloquear la recompensa si el tiempo de sesión es >= 30 min', () => {
      const presupuesto = new PresupuestoDopamina(estudianteId, PerfilCognitivo.crear('Estandar'));
      const resultado = presupuesto.evaluarYSolicitarRecompensa(35);

      expect(resultado.concedida).toBe(false);
      expect(resultado.bloqueadoPorSaludDigital).toBe(true);
      expect(resultado.limiteMaximoMinutos).toBe(30);
      expect(presupuesto.estaBloqueado).toBe(true);
    });
  });

  describe('Perfil Adaptativo TDAH', () => {
    it('debe reducir dinámicamente el tiempo máximo a 20 min y bloquear si se alcanzan 20 min de pantalla', () => {
      const perfilTdah = PerfilCognitivo.crear('TDAH');
      const presupuesto = new PresupuestoDopamina(estudianteId, perfilTdah);

      // Solicitud de 20 min (en estándar pasaría, pero en TDAH alcanza el límite adaptado)
      const resultado = presupuesto.evaluarYSolicitarRecompensa(20);

      expect(resultado.concedida).toBe(false);
      expect(resultado.bloqueadoPorSaludDigital).toBe(true);
      expect(resultado.limiteMaximoMinutos).toBe(20);
      expect(resultado.tipoPerfil).toBe('TDAH');
      expect(resultado.mensajeEmpatico).toContain('Pausa de Salud Digital adaptada (TDAH)');
    });
  });

  describe('Perfil Adaptativo Alta Sensibilidad (PAS)', () => {
    it('debe limitar automáticamente a máximo 1 recompensa por sesión para evitar sobreestimulación sensorial', () => {
      const perfilPAS = PerfilCognitivo.crear('AltaSensibilidad');
      const presupuesto = new PresupuestoDopamina(estudianteId, perfilPAS);

      // Primera recompensa (10 min) -> Debe concederse
      const resultado1 = presupuesto.evaluarYSolicitarRecompensa(10);
      expect(resultado1.concedida).toBe(true);
      expect(resultado1.recompensasOtorgadas).toBe(1);

      // Segunda recompensa (5 min adicionales, total 15 min < 25 min límite de tiempo) -> Debe bloquearse por límite de premios
      const resultado2 = presupuesto.evaluarYSolicitarRecompensa(5);
      expect(resultado2.concedida).toBe(false);
      expect(resultado2.bloqueadoPorSaludDigital).toBe(true);
      expect(resultado2.tipoPerfil).toBe('AltaSensibilidad');
      expect(resultado2.mensajeEmpatico).toContain('Protección Sensorial (AltaSensibilidad)');
    });
  });

  describe('Manejo de Errores', () => {
    it('debe lanzar un error si se intenta registrar un tiempo de sesión negativo', () => {
      const presupuesto = new PresupuestoDopamina(estudianteId);
      expect(() => {
        presupuesto.evaluarYSolicitarRecompensa(-5);
      }).toThrow('El tiempo de sesión no puede ser negativo.');
    });
  });
});
