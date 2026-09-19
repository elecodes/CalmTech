import mongoose from 'mongoose';
import { TelemetriaModel } from './TelemetriaModel';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calmtech';

async function ejecutarSeed() {
  console.log('===========================================================');
  console.log('🌱 INICIANDO SCRIPT SEEDER DE TELEMETRÍA (CLASSROOM CALM TECH)');
  console.log('===========================================================\n');

  try {
    console.log(`🔌 Conectando a MongoDB en: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conexión establecida.');

    // 1. Limpieza de datos antiguos para evitar duplicados e itinerarios sucios
    console.log('🧹 Limpiando registros previos de la colección de telemetría...');
    await TelemetriaModel.deleteMany({});
    console.log('✅ Colección vaciada exitosamente.');

    // 2. Generación de datos sintéticos representativos para 5 días lectivos
    const aulas = ['aula-4a', 'aula-5b'];
    const eventosSemilla: any[] = [];
    const ahora = new Date();

    const observaciones = [
      'Alumnos exaltados tras competencia interactiva en pantalla.',
      'Inquietud colectiva por recreo en espacio cerrado debido a lluvia.',
      'Fatiga atencional observada en la última hora lectiva.',
      'Exceso de ruido ambiental y dispersión tras clase de educación física.',
      'Dificultad de autorregulación previa al almuerzo.'
    ];

    for (let diaIndex = 4; diaIndex >= 0; diaIndex--) {
      const fechaBase = new Date(ahora);
      fechaBase.setDate(ahora.getDate() - diaIndex);

      for (const aulaId of aulas) {
        // Evento Mañana (9:30 AM): Alerta de sobreestimulación
        const fechaManana = new Date(fechaBase);
        fechaManana.setHours(9, 30, 0);

        eventosSemilla.push({
          tipo: 'ALERTA_SOBREESTIMULACION',
          aulaId,
          timestamp: fechaManana,
          detalles: {
            nivelEnergia: 'Hiperestimulacion',
            gradoEscolar: aulaId === 'aula-4a' ? '4° Grado Primaria' : '5° Grado Primaria',
            descripcionProfesor: observaciones[diaIndex % observaciones.length]
          }
        });

        // Evento Mañana (9:32 AM): Activación de Pausa Active Calm Tech
        const fechaPausa = new Date(fechaManana.getTime() + 2 * 60 * 1000);
        eventosSemilla.push({
          tipo: 'PAUSA_ACTIVADA',
          aulaId,
          timestamp: fechaPausa,
          detalles: {
            duracionMaximaSegundos: 120,
            longitudRespuestaCaracteres: 780
          }
        });

        // Evento Tarde (14:15 PM): Bloqueo por salud digital (presupuesto dopamina)
        const fechaTarde = new Date(fechaBase);
        fechaTarde.setHours(14, 15, 0);

        eventosSemilla.push({
          tipo: 'BLOQUEO_DOPAMINA_SALUD_DIGITAL',
          aulaId,
          timestamp: fechaTarde,
          detalles: {
            estudianteId: `estudiante-00${(diaIndex % 3) + 1}`,
            tiempoSesionActualMinutos: 35,
            limiteMaximoMinutos: 30,
            motivo: 'Presupuesto de Dopamina excedido (>= 30 min)'
          }
        });
      }
    }

    // 3. Inserción masiva en MongoDB
    console.log(`📦 Insertando ${eventosSemilla.length} eventos históricos de telemetría...`);
    const resultado = await TelemetriaModel.insertMany(eventosSemilla);
    console.log(`✅ ${resultado.length} registros insertados exitosamente en MongoDB.`);

    console.log('\n===========================================================');
    console.log('🎉 SEED COMPLETADO CON ÉXITO. BASE DE DATOS LISTA PARA ANALÍTICA.');
    console.log('===========================================================');
  } catch (error: any) {
    console.error('❌ Error durante la ejecución del seeder:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada.');
  }
}

ejecutarSeed();
