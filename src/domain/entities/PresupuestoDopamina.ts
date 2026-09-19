import { PerfilCognitivo, TipoNeurodivergencia } from '../value-objects/PerfilCognitivo';

export interface ResultadoEvaluacionRecompensa {
  concedida: boolean;
  bloqueadoPorSaludDigital: boolean;
  tiempoTotalAcumuladoMinutos: number;
  limiteMaximoMinutos: number;
  recompensasOtorgadas: number;
  limiteRecompensas: number;
  tipoPerfil: TipoNeurodivergencia;
  mensajeEmpatico: string;
}

export class PresupuestoDopamina {
  private tiempoPantallaAcumuladoMinutos: number;
  private interaccionesBloqueadas: boolean = false;
  private recompensasEntregadasSesion: number = 0;
  public readonly perfilCognitivo: PerfilCognitivo;

  constructor(
    public readonly estudianteId: string,
    perfil?: PerfilCognitivo,
    tiempoInicialMinutos: number = 0
  ) {
    this.perfilCognitivo = perfil || PerfilCognitivo.crearDefault();
    this.tiempoPantallaAcumuladoMinutos = tiempoInicialMinutos;

    if (this.tiempoPantallaAcumuladoMinutos >= this.perfilCognitivo.tiempoMaximoPantallaMinutos) {
      this.interaccionesBloqueadas = true;
    }
  }

  /**
   * Evalúa biológicamente si el estudiante puede recibir una recompensa o interacción adicional,
   * adaptando el cálculo dinámicamente según su Perfil Cognitivo.
   */
  public evaluarYSolicitarRecompensa(minutosSesionAdicionales: number): ResultadoEvaluacionRecompensa {
    if (minutosSesionAdicionales < 0) {
      throw new Error('El tiempo de sesión no puede ser negativo.');
    }

    const nuevoTotal = this.tiempoPantallaAcumuladoMinutos + minutosSesionAdicionales;

    // Regla 1: Límite de tiempo máximo adaptado al perfil cognitivo
    if (nuevoTotal >= this.perfilCognitivo.tiempoMaximoPantallaMinutos || minutosSesionAdicionales >= this.perfilCognitivo.tiempoMaximoPantallaMinutos) {
      this.interaccionesBloqueadas = true;
      this.tiempoPantallaAcumuladoMinutos = nuevoTotal;

      return {
        concedida: false,
        bloqueadoPorSaludDigital: true,
        tiempoTotalAcumuladoMinutos: nuevoTotal,
        limiteMaximoMinutos: this.perfilCognitivo.tiempoMaximoPantallaMinutos,
        recompensasOtorgadas: this.recompensasEntregadasSesion,
        limiteRecompensas: this.perfilCognitivo.limiteRecompensasPorSesion,
        tipoPerfil: this.perfilCognitivo.tipo,
        mensajeEmpatico: `Pausa de Salud Digital adaptada (${this.perfilCognitivo.tipo}): Se alcanzaron ${nuevoTotal} min de exposición (límite adaptado: ${this.perfilCognitivo.tiempoMaximoPantallaMinutos} min). Se bloquean recompensas para resguardar la salud atencional.`
      };
    }

    // Regla 2: Límite estricto de recompensas por sesión según profilaxis sensorial
    if (this.recompensasEntregadasSesion >= this.perfilCognitivo.limiteRecompensasPorSesion) {
      return {
        concedida: false,
        bloqueadoPorSaludDigital: true,
        tiempoTotalAcumuladoMinutos: nuevoTotal,
        limiteMaximoMinutos: this.perfilCognitivo.tiempoMaximoPantallaMinutos,
        recompensasOtorgadas: this.recompensasEntregadasSesion,
        limiteRecompensas: this.perfilCognitivo.limiteRecompensasPorSesion,
        tipoPerfil: this.perfilCognitivo.tipo,
        mensajeEmpatico: `Protección Sensorial (${this.perfilCognitivo.tipo}): Se alcanzó el máximo de ${this.perfilCognitivo.limiteRecompensasPorSesion} recompensa(s) permitida(s) por sesión.`
      };
    }

    this.tiempoPantallaAcumuladoMinutos = nuevoTotal;
    this.recompensasEntregadasSesion += 1;

    return {
      concedida: true,
      bloqueadoPorSaludDigital: false,
      tiempoTotalAcumuladoMinutos: nuevoTotal,
      limiteMaximoMinutos: this.perfilCognitivo.tiempoMaximoPantallaMinutos,
      recompensasOtorgadas: this.recompensasEntregadasSesion,
      limiteRecompensas: this.perfilCognitivo.limiteRecompensasPorSesion,
      tipoPerfil: this.perfilCognitivo.tipo,
      mensajeEmpatico: `Recompensa adaptada (${this.perfilCognitivo.tipo}) aprobada (${this.recompensasEntregadasSesion}/${this.perfilCognitivo.limiteRecompensasPorSesion}).`
    };
  }

  public puedeRecibirRecompensaOInteraccion(): boolean {
    return !this.interaccionesBloqueadas && this.recompensasEntregadasSesion < this.perfilCognitivo.limiteRecompensasPorSesion;
  }

  get estaBloqueado(): boolean {
    return this.interaccionesBloqueadas;
  }

  get tiempoUsado(): number {
    return this.tiempoPantallaAcumuladoMinutos;
  }

  get limiteDiarioMinutos(): number {
    return this.perfilCognitivo.tiempoMaximoPantallaMinutos;
  }
}
