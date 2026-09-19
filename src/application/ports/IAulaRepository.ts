import { AulaEmocional } from '../../domain/entities/AulaEmocional';

export interface IAulaRepository {
  obtenerPorId(id: string): Promise<AulaEmocional | null>;
  guardar(aula: AulaEmocional): Promise<void>;
}
