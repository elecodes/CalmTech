export interface OpcionesPausa {
  gradoEscolar: string;
  duracionMaximaSegundos: number;
  descripcionProfesor: string;
  nivelEnergiaActual: string;
}

export interface IAnafectivaService {
  generarPausaMindfulness(opciones: OpcionesPausa): Promise<string>;
}
