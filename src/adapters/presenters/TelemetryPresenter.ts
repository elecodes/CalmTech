import { AulaEmocional, NivelEnergia } from '../../domain/entities/AulaEmocional';
import { ClassroomCalmUIState, PaletaCalmTech, IndicadorAudioPausado, ReglasMicrointeraccionUX } from './IClassroomCalmUIState';

/**
 * Presentador (Interface Adapter) que integra las 3 Reglas de Oro de Diseño UX Consciente:
 * 1. Transiciones Orgánicas (CSS transition: background-color 2s ease-in-out).
 * 2. Audio No Agresivo (Fade-in / Fade-out progresivo con instrumentos orgánicos).
 * 3. Micro-interacciones Lentas (Eliminación total de toasts/popups emergentes abruptos).
 */
export class TelemetryPresenter {
  public presentarEstadoAula(aula: AulaEmocional, mensajePausa?: string): ClassroomCalmUIState {
    const paleta = this.obtenerPaletaCalmTech(aula.nivelEnergia);
    const audio = this.obtenerAudioGuia(aula.nivelEnergia);
    const reglasUx = this.obtenerReglasMicrointeraccion();
    const mensajeEmpatico = this.obtenerMensajeEmpatico(aula.nivelEnergia, mensajePausa);

    return {
      aulaId: aula.id,
      estadoEmocionalTexto: `Nivel del Aula: ${aula.nivelEnergia}`,
      paleta,
      audioGuide: audio,
      reglasUx,
      mensajeEmpatico,
      mostrarModoFullFocus: aula.nivelEnergia === 'Enfoque'
    };
  }

  /**
   * REGLA 1: Transiciones Orgánicas
   * Cambios suaves de color para evitar micro-alertas de estrés en el sistema nervioso.
   */
  private obtenerPaletaCalmTech(nivel: NivelEnergia): PaletaCalmTech {
    const transitionCss = 'background-color 2s ease-in-out, color 1.5s ease-in-out';

    switch (nivel) {
      case 'Calma':
        return {
          nombrePaleta: 'Verde Orgánico Calma',
          colorFondoHex: '#F4F7F5',
          colorTextoHex: '#1B5E20',
          colorAcentoHex: '#A5D6A7',
          transitionCss
        };
      case 'Enfoque':
        return {
          nombrePaleta: 'Azul Sereno Enfoque',
          colorFondoHex: '#E3F2FD',
          colorTextoHex: '#0D47A1',
          colorAcentoHex: '#90CAF9',
          transitionCss
        };
      case 'Inquietud':
        return {
          nombrePaleta: 'Ámbar Cálido Transición',
          colorFondoHex: '#FFF8E1',
          colorTextoHex: '#E65100',
          colorAcentoHex: '#FFE082',
          transitionCss
        };
      case 'Hiperestimulacion':
        return {
          nombrePaleta: 'Terracota Suave / Saturada Consciente',
          colorFondoHex: '#FDF2F2',
          colorTextoHex: '#BF360C',
          colorAcentoHex: '#FFAB91',
          transitionCss
        };
    }
  }

  /**
   * REGLA 2: Audio No Agresivo
   * Fade-in y Fade-out progresivo de 1500ms utilizando instrumentos orgánicos (Cuenco Tibetano).
   */
  private obtenerAudioGuia(nivel: NivelEnergia): IndicadorAudioPausado {
    if (nivel === 'Hiperestimulacion' || nivel === 'Inquietud') {
      return {
        reproducirTono: true,
        tipoFrecuenciaHz: 432,
        nombreFrecuencia: 'Resonancia Armónica 432Hz',
        instrumentoOrganico: 'Cuenco Tibetano de Bronce Artesanal (Acoustic Sine Wave)',
        fadeInMs: 1500,
        fadeOutMs: 1500
      };
    }

    return {
      reproducirTono: false
    };
  }

  /**
   * REGLA 3: Micro-interacciones Lentas
   * Cero banners emergentes (toasts). Toda la interfaz integra la información
   * dentro del flujo natural con transiciones suaves (In-Flow Smooth Fade).
   */
  private obtenerReglasMicrointeraccion(): ReglasMicrointeraccionUX {
    return {
      permitirToastsPopups: false, // Estrictamente prohibido irrumpir con avisos emergentes
      tipoAnimacionEntrada: 'In-Flow Smooth Fade (opacity 0->1 en 1.8s)',
      ritmoRespiracionInterfaz: 'Respiración Armónica Sincronizada (4s inhalación - 7s retención - 8s exhalación)'
    };
  }

  private obtenerMensajeEmpatico(nivel: NivelEnergia, mensajePausa?: string): string {
    if (mensajePausa) {
      return mensajePausa;
    }

    switch (nivel) {
      case 'Calma':
        return 'El grupo se encuentra en un estado de equilibrio y serenidad.';
      case 'Enfoque':
        return 'El aula mantiene una atención fluida y concentrada en la actividad.';
      case 'Inquietud':
        return 'Se percibe cierta agitación. Un momento para respirar juntos ayudará al grupo.';
      case 'Hiperestimulacion':
        return 'Sugerencia Calm Tech: Invita al aula a una pausa activa de respiración consciente.';
    }
  }
}
