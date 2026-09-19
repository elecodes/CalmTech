export type TipoNeurodivergencia = 'Estandar' | 'TDAH' | 'AltaSensibilidad' | 'TEA';

/**
 * Value Object que encapsula los parámetros biológicos y sensoriales adaptados a cada perfil neurodivergente.
 */
export class PerfilCognitivo {
  private constructor(
    public readonly tipo: TipoNeurodivergencia,
    public readonly tiempoMaximoPantallaMinutos: number,
    public readonly limiteRecompensasPorSesion: number,
    public readonly requerirTransicionPredecible: boolean
  ) {}

  public static crearDefault(): PerfilCognitivo {
    return new PerfilCognitivo('Estandar', 30, 3, false);
  }

  /**
   * Patrón Factory para instanciar el perfil cognitivo con reglas de salud biológica adaptables.
   */
  public static crear(tipo?: TipoNeurodivergencia): PerfilCognitivo {
    switch (tipo) {
      case 'TDAH':
        // TDAH: Tiempo acotado a 20 min para prevenir hiperfoco extenuante y fatiga atencional severa
        return new PerfilCognitivo('TDAH', 20, 2, true);

      case 'AltaSensibilidad':
        // Alta Sensibilidad (PAS): Límite estricto de 1 premio por sesión para evitar sobreestimulación sensorial
        return new PerfilCognitivo('AltaSensibilidad', 25, 1, true);

      case 'TEA':
        // TEA (Trastorno del Espectro Autista): Estructura altamente predecible y tiempos acotados (20 min)
        return new PerfilCognitivo('TEA', 20, 1, true);

      case 'Estandar':
      default:
        return PerfilCognitivo.crearDefault();
    }
  }
}
