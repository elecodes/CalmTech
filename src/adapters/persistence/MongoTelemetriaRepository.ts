import { EventoTelemetria, ITelemetriaRepository } from '../../application/ports/ITelemetriaRepository';
import { TelemetriaModel, ITelemetriaDocument } from '../../infrastructure/database/mongo/TelemetriaModel';

export class MongoTelemetriaRepository implements ITelemetriaRepository {
  public async registrarEvento(eventoInput: Omit<EventoTelemetria, 'id' | 'timestamp'>): Promise<void> {
    const nuevoDoc = new TelemetriaModel({
      tipo: eventoInput.tipo,
      aulaId: eventoInput.aulaId,
      timestamp: new Date(),
      detalles: eventoInput.detalles
    });

    await nuevoDoc.save();
  }

  public async obtenerEventos(): Promise<EventoTelemetria[]> {
    const docs = await TelemetriaModel.find().sort({ timestamp: -1 }).exec();
    return docs.map((doc) => this.mapearAEntidad(doc));
  }

  public async obtenerEventosPorAula(aulaId: string): Promise<EventoTelemetria[]> {
    const docs = await TelemetriaModel.find({ aulaId }).sort({ timestamp: -1 }).exec();
    return docs.map((doc) => this.mapearAEntidad(doc));
  }

  private mapearAEntidad(doc: ITelemetriaDocument): EventoTelemetria {
    return {
      id: doc._id.toString(),
      tipo: doc.tipo,
      aulaId: doc.aulaId,
      timestamp: doc.timestamp,
      detalles: doc.detalles
    };
  }
}
