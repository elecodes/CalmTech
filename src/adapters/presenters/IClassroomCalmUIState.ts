export interface PaletaCalmTech {
  colorFondoHex: string;
  colorTextoHex: string;
  colorAcentoHex: string;
  nombrePaleta: string;
  transitionCss: string; // Regla 1: Transiciones orgánicas de fondo y color
}

export interface IndicadorAudioPausado {
  reproducirTono: boolean;
  tipoFrecuenciaHz?: number;
  nombreFrecuencia?: string;
  instrumentoOrganico?: string; // Regla 2: Instrumento orgánico (cuenco tibetano, marimba de madera)
  fadeInMs?: number; // Regla 2: Desvanecimiento progresivo de entrada
  fadeOutMs?: number; // Regla 2: Desvanecimiento progresivo de salida
}

export interface ReglasMicrointeraccionUX {
  permitirToastsPopups: boolean; // Regla 3: Sin banners flotantes ni toasts emergentes abruptos
  tipoAnimacionEntrada: string; // Renderizado gradual dentro del flujo (In-Flow Smooth Fade)
  ritmoRespiracionInterfaz: string;
}

export interface ClassroomCalmUIState {
  aulaId: string;
  estadoEmocionalTexto: string;
  paleta: PaletaCalmTech;
  audioGuide: IndicadorAudioPausado;
  reglasUx: ReglasMicrointeraccionUX;
  mensajeEmpatico: string;
  mostrarModoFullFocus: boolean;
}
