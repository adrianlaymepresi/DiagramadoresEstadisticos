import { FilaDatos, ConfiguracionColumnas } from '../tipos';

interface RangosEscala {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minTamanio: number;
  maxTamanio: number;
}

export const calcularRangos = (datos: FilaDatos[]): RangosEscala => {
  const valoresX = datos.map((d) => d.x);
  const valoresY = datos.map((d) => d.y);
  const valoresTamanio = datos.map((d) => d.tamanio);

  let minX = Math.min(...valoresX);
  let maxX = Math.max(...valoresX);
  let minY = Math.min(...valoresY);
  let maxY = Math.max(...valoresY);
  let minTamanio = Math.min(...valoresTamanio);
  let maxTamanio = Math.max(...valoresTamanio);

  if (maxX === minX) {
    minX = minX - 5;
    maxX = maxX + 5;
  }
  if (maxY === minY) {
    minY = minY - 5;
    maxY = maxY + 5;
  }
  if (maxTamanio === minTamanio) {
    minTamanio = Math.max(1, minTamanio - 1);
    maxTamanio = maxTamanio + 1;
  }

  const rangoX = maxX - minX;
  const rangoY = maxY - minY;
  const margenX = rangoX * 0.1;
  const margenY = rangoY * 0.1;

  return {
    minX: minX - margenX,
    maxX: maxX + margenX,
    minY: minY - margenY,
    maxY: maxY + margenY,
    minTamanio,
    maxTamanio,
  };
};

export const escalarValor = (
  valor: number,
  min: number,
  max: number,
  rangoSalida: [number, number]
): number => {
  if (max === min) return (rangoSalida[0] + rangoSalida[1]) / 2;
  return ((valor - min) / (max - min)) * (rangoSalida[1] - rangoSalida[0]) + rangoSalida[0];
};

export const generarColoresDefault = (cantidad: number): string[] => {
  const colores = [
    '#8B5CF6', '#6366F1', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#EC4899', '#14B8A6', '#8B5CF6', '#6366F1',
  ];
  return Array.from({ length: cantidad }, (_, i) => colores[i % colores.length]);
};

interface DatosBurbuja {
  x: number;
  y: number;
  radio: number;
  color: string;
  etiqueta: string;
}

export const calcularDatosBurbujas = (
  datos: FilaDatos[],
  anchoCanvas: number,
  altoCanvas: number,
  margen: number
): DatosBurbuja[] => {
  const rangos = calcularRangos(datos);
  const coloresDefault = generarColoresDefault(datos.length);

  const anchoUtil = anchoCanvas - 2 * margen;
  const altoUtil = altoCanvas - 2 * margen;

  return datos.map((fila, indice) => {
    const x = escalarValor(fila.x, rangos.minX, rangos.maxX, [margen, margen + anchoUtil]);
    const y = escalarValor(fila.y, rangos.minY, rangos.maxY, [margen + altoUtil, margen]);
    const radio = escalarValor(fila.tamanio, rangos.minTamanio, rangos.maxTamanio, [15, 80]);

    return {
      x,
      y,
      radio,
      color: fila.color || coloresDefault[indice],
      etiqueta: `(${fila.x}, ${fila.y})`,
    };
  });
};

const dibujarCuadricula = (
  ctx: CanvasRenderingContext2D,
  anchoCanvas: number,
  altoCanvas: number,
  margen: number,
  rangos: RangosEscala
): void => {
  const pasos = 10;
  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = 0.5;

  for (let i = 1; i < pasos; i++) {
    const x = margen + ((anchoCanvas - 2 * margen) * i) / pasos;
    ctx.beginPath();
    ctx.moveTo(x, margen);
    ctx.lineTo(x, altoCanvas - margen);
    ctx.stroke();
  }

  for (let i = 1; i < pasos; i++) {
    const y = margen + ((altoCanvas - 2 * margen) * i) / pasos;
    ctx.beginPath();
    ctx.moveTo(margen, y);
    ctx.lineTo(anchoCanvas - margen, y);
    ctx.stroke();
  }
};

const dibujarEjes = (
  ctx: CanvasRenderingContext2D,
  anchoCanvas: number,
  altoCanvas: number,
  margen: number,
  rangos: RangosEscala,
  columnas: ConfiguracionColumnas
): void => {
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margen, margen);
  ctx.lineTo(margen, altoCanvas - margen);
  ctx.lineTo(anchoCanvas - margen, altoCanvas - margen);
  ctx.stroke();

  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(columnas.nombreTamanio, anchoCanvas / 2, 50);

  ctx.font = 'bold 18px sans-serif';
  ctx.save();
  ctx.translate(30, altoCanvas / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(columnas.nombreY, 0, 0);
  ctx.restore();

  ctx.fillText(columnas.nombreX, anchoCanvas / 2, altoCanvas - 30);

  const pasos = 10;
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#64748B';

  for (let i = 0; i <= pasos; i++) {
    const valorX = rangos.minX + (rangos.maxX - rangos.minX) * (i / pasos);
    const x = margen + ((anchoCanvas - 2 * margen) * i) / pasos;
    ctx.textAlign = 'center';
    ctx.fillText(valorX.toFixed(1), x, altoCanvas - margen + 20);
    
    if (i > 0 && i < pasos) {
      ctx.beginPath();
      ctx.moveTo(x, altoCanvas - margen);
      ctx.lineTo(x, altoCanvas - margen + 4);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  for (let i = 0; i <= pasos; i++) {
    const valorY = rangos.minY + (rangos.maxY - rangos.minY) * (i / pasos);
    const y = altoCanvas - margen - ((altoCanvas - 2 * margen) * i) / pasos;
    ctx.textAlign = 'right';
    ctx.fillText(valorY.toFixed(1), margen - 10, y + 4);
    
    if (i > 0 && i < pasos) {
      ctx.beginPath();
      ctx.moveTo(margen - 4, y);
      ctx.lineTo(margen, y);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
};



export const dibujarDiagrama = (
  canvas: HTMLCanvasElement,
  datos: FilaDatos[],
  columnas: ConfiguracionColumnas
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const margen = 90;
  const anchoCanvas = canvas.width;
  const altoCanvas = canvas.height;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, anchoCanvas, altoCanvas);

  const rangos = calcularRangos(datos);
  
  dibujarCuadricula(ctx, anchoCanvas, altoCanvas, margen, rangos);
  dibujarEjes(ctx, anchoCanvas, altoCanvas, margen, rangos, columnas);

  const burbujas = calcularDatosBurbujas(datos, anchoCanvas, altoCanvas, margen);

  burbujas.forEach((burbuja) => {
    const gradiente = ctx.createRadialGradient(
      burbuja.x - burbuja.radio / 3,
      burbuja.y - burbuja.radio / 3,
      0,
      burbuja.x,
      burbuja.y,
      burbuja.radio
    );
    gradiente.addColorStop(0, burbuja.color);
    gradiente.addColorStop(1, burbuja.color + 'DD');

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = gradiente;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(burbuja.x, burbuja.y, burbuja.radio, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });
};
