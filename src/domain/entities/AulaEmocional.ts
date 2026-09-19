export type NivelEnergia = 'Calma' | 'Enfoque' | 'Inquietud' | 'Hiperestimulacion';

export class AulaEmocional {
  constructor(
    public readonly id: string,
    public readonly gradoEscolar: string,
    private _nivelEnergia: NivelEnergia
  ) {}

  get nivelEnergia(): NivelEnergia {
    return this._nivelEnergia;
  }

  public cambiarNivelEnergia(nuevoNivel: NivelEnergia): void {
    this._nivelEnergia = nuevoNivel;
  }

  public requierePausaActiva(): boolean {
    return this._nivelEnergia === 'Hiperestimulacion' || this._nivelEnergia === 'Inquietud';
  }
}
