import { IAulaRepository } from '../../application/ports/IAulaRepository';
import { AulaEmocional } from '../../domain/entities/AulaEmocional';

export class InMemoryAulaRepository implements IAulaRepository {
  private aulas: Map<string, AulaEmocional> = new Map();

  public async obtenerPorId(id: string): Promise<AulaEmocional | null> {
    const aula = this.aulas.get(id);
    return aula ? aula : null;
  }

  public async guardar(aula: AulaEmocional): Promise<void> {
    this.aulas.set(aula.id, aula);
  }
}
