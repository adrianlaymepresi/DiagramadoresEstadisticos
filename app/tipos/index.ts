export interface ConfiguracionColumnas {
  nombreX: string;
  nombreY: string;
  nombreTamanio: string;
  nombreColor?: string;
}

export interface FilaDatos {
  x: number;
  y: number;
  tamanio: number;
  color?: string;
}

export interface ConfiguracionDiagrama {
  numeroFilas: number;
  configuracionColumnas: ConfiguracionColumnas;
  datos: FilaDatos[];
}

export interface DiagramaGuardado {
  id: string;
  fechaCreacion: Date;
  configuracion: ConfiguracionDiagrama;
}

export type FormatoExportacion = 'excel' | 'pdf' | 'imagen';
