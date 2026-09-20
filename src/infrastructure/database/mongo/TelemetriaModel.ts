import mongoose, { Schema, Document } from 'mongoose';
import { TipoEventoTelemetria } from '../../../application/ports/ITelemetriaRepository';

export interface ITelemetriaDocument extends Document {
  tipo: TipoEventoTelemetria;
  aulaId: string;
  timestamp: Date;
  detalles?: Record<string, any>;
}

const TelemetriaSchema: Schema = new Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: [
        'ALERTA_SOBREESTIMULACION',
        'PAUSA_ACTIVADA',
        'BLOQUEO_DOPAMINA_SALUD_DIGITAL',
        'RECOMPENSA_CONSCIENTE_CONCEDIDA',
        'CONFIGURACION_COMPOSICION_AULA'
      ]
    },
    aulaId: {
      type: String,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    detalles: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    versionKey: false
  }
);

export const TelemetriaModel = mongoose.model<ITelemetriaDocument>('Telemetria', TelemetriaSchema);
