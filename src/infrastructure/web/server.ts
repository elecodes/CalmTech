import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';

import { AulaEmocional, NivelEnergia } from '../../domain/entities/AulaEmocional';
import { PresupuestoDopamina } from '../../domain/entities/PresupuestoDopamina';
import { TipoNeurodivergencia } from '../../domain/value-objects/PerfilCognitivo';
import { MockAffectiveAIAdapter } from '../../adapters/ia/MockAffectiveAIAdapter';
import { MockReporteAIAdapter } from '../../adapters/ia/MockReporteAIAdapter';
import { InMemoryAulaRepository } from '../../adapters/repositories/InMemoryAulaRepository';
import { InMemoryTelemetriaRepository } from '../../adapters/persistence/InMemoryTelemetriaRepository';
import { MongoTelemetriaRepository } from '../../adapters/persistence/MongoTelemetriaRepository';
import { ITelemetriaRepository } from '../../application/ports/ITelemetriaRepository';
import { TelemetryPresenter } from '../../adapters/presenters/TelemetryPresenter';
import { TimelinePresenter } from '../../adapters/presenters/TimelinePresenter';
import { MitigarSobreestimulacion } from '../../application/use-cases/MitigarSobreestimulacion';
import { GenerarReporteSemanalAula } from '../../application/use-cases/GenerarReporteSemanalAula';
import { ValidarYConcederPremioConsciente } from '../../application/use-cases/ValidarYConcederPremioConsciente';
import { ConfigurarComposicionAula } from '../../application/use-cases/ConfigurarComposicionAula';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calmtech';

// =========================================================================================
// MIDDLEWARES DE INFRAESTRUCTURA
// =========================================================================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../../src/infrastructure/web')));

// =========================================================================================
// INICIALIZACIÓN Y CONEXIÓN DE INFRAESTRUCTURA DE BD (MONGOOSE)
// =========================================================================================
async function iniciarServidor() {
  let telemetriaRepository: ITelemetriaRepository;

  try {
    console.log(`🔌 Conectando a MongoDB en: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Conexión exitosa a MongoDB. Usando MongoTelemetriaRepository.');
    telemetriaRepository = new MongoTelemetriaRepository();
  } catch (error: any) {
    console.warn(`⚠️ No se pudo conectar a MongoDB (${error.message}).`);
    console.warn('💡 Usando InMemoryTelemetriaRepository como fallback seguro para pruebas locales.');
    telemetriaRepository = new InMemoryTelemetriaRepository();
  }

  // =========================================================================================
  // COMPOSITION ROOT - INYECCIÓN DE DEPENDENCIAS (CLEAN ARCHITECTURE)
  // =========================================================================================
  const aiAffectiveAdapter = new MockAffectiveAIAdapter();
  const aiReporteAdapter = new MockReporteAIAdapter();
  const aulaRepository = new InMemoryAulaRepository();
  const telemetryPresenter = new TelemetryPresenter();
  const timelinePresenter = new TimelinePresenter();

  const mitigarSobreestimulacionUseCase = new MitigarSobreestimulacion(
    aiAffectiveAdapter,
    aulaRepository,
    telemetriaRepository
  );

  const generarReporteSemanalUseCase = new GenerarReporteSemanalAula(
    aulaRepository,
    telemetriaRepository,
    aiReporteAdapter
  );

  const validarYConcederPremioUseCase = new ValidarYConcederPremioConsciente(
    telemetriaRepository
  );

  const configurarComposicionUseCase = new ConfigurarComposicionAula(
    telemetriaRepository,
    aulaRepository
  );

  // Inicializar aula demo por defecto
  const aulaDemo = new AulaEmocional('aula-4a', '4° Grado Primaria', 'Hiperestimulacion');
  await aulaRepository.guardar(aulaDemo);

  // =========================================================================================
  // RUTAS / ENDPOINTS DE LA API REST (HTTP PORT ADAPTER)
  // =========================================================================================

  /**
   * POST /api/aula/configurar
   * Módulo de Configuración del Aula (Opción A): Registra y valida la composición de alumnos según perfiles cognitivos.
   */
  app.post('/api/aula/configurar', async (req: Request, res: Response) => {
    try {
      const { aulaId, composicion } = req.body as {
        aulaId?: string;
        composicion: {
          estandar: number;
          tdah: number;
          altaSensibilidad: number;
          tea: number;
        };
      };

      const resultado = await configurarComposicionUseCase.ejecutar({
        aulaId: aulaId || 'aula-4a',
        composicion
      });

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  /**
   * GET /api/aula/linea-tiempo
   * Línea de Tiempo Visual de Energía (Fase 1 - Opción 2)
   * Obtiene el histórico de eventos del aula desde el repositorio y los formatea a 'BloqueTiempoUI[]'.
   */
  app.get('/api/aula/linea-tiempo', async (req: Request, res: Response) => {
    try {
      const aulaId = (req.query.aulaId as string) || 'aula-4a';
      const eventos = await telemetriaRepository.obtenerEventosPorAula(aulaId);
      const bloquesUI = timelinePresenter.presentarLineaTiempo(eventos);
      return res.json(bloquesUI);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Classroom Calm Tech API',
      database: mongoose.connection.readyState === 1 ? 'MongoDB Conectado' : 'Modo En Memoria (Fallback)',
      timestamp: new Date()
    });
  });

  app.get('/api/aula/estado', async (_req: Request, res: Response) => {
    try {
      const aula = await aulaRepository.obtenerPorId('aula-4a');
      if (!aula) {
        return res.status(404).json({ error: 'Aula demo no encontrada.' });
      }
      const uiState = telemetryPresenter.presentarEstadoAula(aula);
      return res.json(uiState);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get(['/api/aula/reporte', '/api/aula/reporte-semanal'], async (_req: Request, res: Response) => {
    try {
      const reporte = await generarReporteSemanalUseCase.ejecutar({
        aulaId: 'aula-4a',
        observacionesDocente: [
          'Los niños estuvieron hiperestimulados tras la actividad interactiva.',
          'La pausa mindfulness de 120s ayudó a recuperar la calma en el grupo.'
        ]
      });
      return res.json(reporte);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/aulas/:id/ui', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const aula = await aulaRepository.obtenerPorId(id);

      if (!aula) {
        return res.status(404).json({ error: `Aula con ID '${id}' no encontrada.` });
      }

      const uiState = telemetryPresenter.presentarEstadoAula(aula);
      return res.json(uiState);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/aulas', async (req: Request, res: Response) => {
    try {
      const { id, gradoEscolar, nivelEnergia } = req.body as {
        id: string;
        gradoEscolar: string;
        nivelEnergia: NivelEnergia;
      };

      if (!id || !gradoEscolar || !nivelEnergia) {
        return res.status(400).json({ error: 'Faltan campos requeridos: id, gradoEscolar, nivelEnergia' });
      }

      let aula = await aulaRepository.obtenerPorId(id);
      if (aula) {
        aula.cambiarNivelEnergia(nivelEnergia);
      } else {
        aula = new AulaEmocional(id, gradoEscolar, nivelEnergia);
      }

      await aulaRepository.guardar(aula);
      const uiState = telemetryPresenter.presentarEstadoAula(aula);

      return res.status(201).json({ mensaje: 'Estado del aula actualizado', aula, uiState });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/aulas/:id/mitigar', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { descripcionProfesor } = req.body as { descripcionProfesor: string };

      if (!descripcionProfesor) {
        return res.status(400).json({ error: 'Se requiere el campo "descripcionProfesor".' });
      }

      const resultado = await mitigarSobreestimulacionUseCase.ejecutar({
        aulaId: id,
        descripcionProfesor
      });

      const aulaActualizada = await aulaRepository.obtenerPorId(id);
      const uiState = aulaActualizada
        ? telemetryPresenter.presentarEstadoAula(aulaActualizada, resultado.pausaMindfulness)
        : null;

      return res.json({
        resultado,
        uiState
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/aulas/:id/reporte-semanal', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { observacionesDocente } = req.body as { observacionesDocente: string[] };

      const reporte = await generarReporteSemanalUseCase.ejecutar({
        aulaId: id,
        observacionesDocente: observacionesDocente || []
      });

      return res.json(reporte);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/estudiante/solicitar-premio
   * Regulador del Presupuesto de Dopamina con soporte adaptativo para neurodiversidad.
   */
  app.post('/api/estudiante/solicitar-premio', async (req: Request, res: Response) => {
    try {
      const { estudianteId, aulaId, tiempoSesionActualMinutos, tipoNeurodivergencia } = req.body as {
        estudianteId: string;
        aulaId: string;
        tiempoSesionActualMinutos: number;
        tipoNeurodivergencia?: TipoNeurodivergencia;
      };

      if (!estudianteId || !aulaId || tiempoSesionActualMinutos === undefined) {
        return res.status(400).json({
          error: 'Faltan parámetros en el body: estudianteId, aulaId, tiempoSesionActualMinutos.'
        });
      }

      const resultado = await validarYConcederPremioUseCase.ejecutar({
        estudianteId,
        aulaId,
        tiempoSesionActualMinutos,
        tipoNeurodivergencia
      });

      return res.json(resultado);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/telemetria', async (_req: Request, res: Response) => {
    try {
      const eventos = await telemetriaRepository.obtenerEventos();
      return res.json(eventos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // =========================================================================================
  // ARRANQUE DEL SERVIDOR HTTP
  // =========================================================================================
  app.listen(PORT, () => {
    console.log('===========================================================');
    console.log(`🚀 SERVIDOR CLASSROOM CALM TECH ESCUCHANDO EN PUERTO ${PORT}`);
    console.log(`🌐 Base API URL: http://localhost:${PORT}`);
    console.log(`💻 DASHBOARD UI DISPONIBLE EN: http://localhost:${PORT}`);
    console.log(`🧠 PRESUPUESTO DOPAMINA (NEURODIVERSIDAD): POST http://localhost:${PORT}/api/estudiante/solicitar-premio`);
    console.log('===========================================================');
  });
}

iniciarServidor().catch((err) => {
  console.error('Error crítico al iniciar el servidor:', err);
});
