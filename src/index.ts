import { AulaEmocional } from './domain/entities/AulaEmocional';
import { PresupuestoDopamina } from './domain/entities/PresupuestoDopamina';
import { MockAffectiveAIAdapter } from './adapters/ia/MockAffectiveAIAdapter';
import { MockReporteAIAdapter } from './adapters/ia/MockReporteAIAdapter';
import { InMemoryAulaRepository } from './adapters/repositories/InMemoryAulaRepository';
import { InMemoryTelemetriaRepository } from './adapters/persistence/InMemoryTelemetriaRepository';
import { TelemetryPresenter } from './adapters/presenters/TelemetryPresenter';
import { MitigarSobreestimulacion } from './application/use-cases/MitigarSobreestimulacion';
import { GenerarReporteSemanalAula } from './application/use-cases/GenerarReporteSemanalAula';

async function ejecutarSimulacion() {
  console.log('===========================================================');
  console.log('   CLASSROOM CALM TECH MVP - 3 REGLAS DE ORO UX CONSCIENTE  ');
  console.log('===========================================================\n');

  // 1. Instanciación de Adaptadores
  const aiAffectiveAdapter = new MockAffectiveAIAdapter();
  const aiReporteAdapter = new MockReporteAIAdapter();
  const aulaRepository = new InMemoryAulaRepository();
  const telemetriaRepository = new InMemoryTelemetriaRepository();
  const telemetryPresenter = new TelemetryPresenter();

  // 2. Instanciación de Casos de Uso
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

  // 3. Estado Inicial: Aula en 'Calma' (#F4F7F5)
  const aulaId = 'aula-4a';
  const aulaSimulada = new AulaEmocional(aulaId, '4° Grado Primaria', 'Calma');
  await aulaRepository.guardar(aulaSimulada);

  const presupuestoEstudiante = new PresupuestoDopamina('estudiante-001', 40);

  console.log('🖥️  [ESTADO DE UI 1: AULA EN CALMA]');
  let uiState = telemetryPresenter.presentarEstadoAula(aulaSimulada);
  imprimirEstadoUI(uiState);

  // 4. Transición a 'Hiperestimulacion' (#FDF2F2)
  console.log('\n⚡ [CAMBIO DE ESTADO: Transición de #F4F7F5 (Calma) a #FDF2F2 (Saturada)]');
  aulaSimulada.cambiarNivelEnergia('Hiperestimulacion');
  await aulaRepository.guardar(aulaSimulada);

  const resultadoIntervencion = await mitigarSobreestimulacionUseCase.ejecutar({
    aulaId: aulaId,
    descripcionProfesor: 'Los alumnos están hiperestimulados tras la actividad interactiva.'
  });

  console.log('\n🖥️  [ESTADO DE UI 2: MONITOR REACCIONANDO BAJO REGLAS DE ORO UX]');
  uiState = telemetryPresenter.presentarEstadoAula(aulaSimulada, resultadoIntervencion.pausaMindfulness);
  imprimirEstadoUI(uiState);

  // 5. Demostración de Presupuesto Dopamina
  presupuestoEstudiante.registrarTiempoPantalla(40);

  // 6. Generación de Reporte Semanal
  console.log('\n===========================================================');
  console.log('             REPORTE PSICOPEDAGÓGICO GENERADO              ');
  console.log('===========================================================');

  const reporteSemanal = await generarReporteSemanalUseCase.ejecutar({
    aulaId: aulaId,
    observacionesDocente: ['Los niños se autorregularon rápidamente tras la pausa de 120s.']
  });

  console.log(`\n📌 RESUMEN: ${reporteSemanal.resumenEjecutivo}`);
}

function imprimirEstadoUI(ui: ReturnToUIState) {
  console.log(`┌──────────────────────────────────────────────────────────────────────────────────────────────┐`);
  console.log(`│ 🎨 REGLA 1 (Transición Orgánica): ${ui.paleta.nombrePaleta.padEnd(55)} │`);
  console.log(`│    - Color Fondo: ${ui.paleta.colorFondoHex} | Texto: ${ui.paleta.colorTextoHex}                                   │`);
  console.log(`│    - CSS Spec: ${ui.paleta.transitionCss.padEnd(76)} │`);
  console.log(`├──────────────────────────────────────────────────────────────────────────────────────────────┤`);
  console.log(`│ 🔊 REGLA 2 (Audio No Agresivo):                                                              │`);
  if (ui.audioGuide.reproducirTono) {
    console.log(`│    - Instrumento: ${ui.audioGuide.instrumentoOrganico?.padEnd(74)} │`);
    console.log(`│    - Envolvente: Fade-In: ${ui.audioGuide.fadeInMs}ms | Fade-Out: ${ui.audioGuide.fadeOutMs}ms (Resonancia ${ui.audioGuide.tipoFrecuenciaHz}Hz)             │`);
  } else {
    console.log(`│    - Silencio Ambiental Orgánico                                                             │`);
  }
  console.log(`├──────────────────────────────────────────────────────────────────────────────────────────────┤`);
  console.log(`│ 🌿 REGLA 3 (Micro-interacciones Lentas):                                                     │`);
  console.log(`│    - Permite Toasts/Popups Emergentes?: ${ui.reglasUx.permitirToastsPopups ? 'SÍ' : 'NO (PROHIBIDO POPUPS ABRUPTOS)'}                               │`);
  console.log(`│    - Estilo de Entrada: ${ui.reglasUx.tipoAnimacionEntrada.padEnd(68)} │`);
  console.log(`├──────────────────────────────────────────────────────────────────────────────────────────────┤`);
  console.log(`│ 💬 Contenido del Aula / Pausa Activa:                                                        │`);
  const lineas = ui.mensajeEmpatico.split('\n');
  lineas.forEach((l) => console.log(`│    ${l.padEnd(88)} │`));
  console.log(`└──────────────────────────────────────────────────────────────────────────────────────────────┘`);
}

type ReturnToUIState = import('./adapters/presenters/IClassroomCalmUIState').ClassroomCalmUIState;

ejecutarSimulacion().catch((error) => {
  console.error('Error durante la simulación:', error);
});
