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

  return {
    minX: Math.min(...valoresX),
    maxX: Math.max(...valoresX),
    minY: Math.min(...valoresY),
    maxY: Math.max(...valoresY),
    minTamanio: Math.min(...valoresTamanio),
    maxTamanio: Math.max(...valoresTamanio),
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
    const radio = escalarValor(fila.tamanio, rangos.minTamanio, rangos.maxTamanio, [10, 60]);

    return {
      x,
      y,
      radio,
      color: fila.color || coloresDefault[indice],
      etiqueta: `(${fila.x}, ${fila.y})`,
    };
  });
};

export const dibujarDiagrama = (
  canvas: HTMLCanvasElement,
  datos: FilaDatos[],
  columnas: ConfiguracionColumnas
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const margen = 80;
  const anchoCanvas = canvas.width;
  const altoCanvas = canvas.height;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, anchoCanvas, altoCanvas);

  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margen, margen);
  ctx.lineTo(margen, altoCanvas - margen);
  ctx.lineTo(anchoCanvas - margen, altoCanvas - margen);
  ctx.stroke();

  const rangos = calcularRangos(datos);
  const burbujas = calcularDatosBurbujas(datos, anchoCanvas, altoCanvas, margen);

  burbujas.forEach((burbuja) => {
    ctx.fillStyle = burbuja.color;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(burbuja.x, burbuja.y, burbuja.radio, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#1E293B';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(burbuja.etiqueta, burbuja.x, burbuja.y + 4);
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(columnas.nombreTamanio, anchoCanvas / 2, 30);

  ctx.font = '14px sans-serif';
  ctx.save();
  ctx.translate(20, altoCanvas / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(columnas.nombreY, 0, 0);
  ctx.restore();

  ctx.fillText(columnas.nombreX, anchoCanvas / 2, altoCanvas - 20);

  const pasos = 5;
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#64748B';

  for (let i = 0; i <= pasos; i++) {
    const valorX = rangos.minX + (rangos.maxX - rangos.minX) * (i / pasos);
    const x = margen + ((anchoCanvas - 2 * margen) * i) / pasos;
    ctx.textAlign = 'center';
    ctx.fillText(valorX.toFixed(1), x, altoCanvas - margen + 20);
  }

  for (let i = 0; i <= pasos; i++) {
    const valorY = rangos.minY + (rangos.maxY - rangos.minY) * (i / pasos);
    const y = altoCanvas - margen - ((altoCanvas - 2 * margen) * i) / pasos;
    ctx.textAlign = 'right';
    ctx.fillText(valorY.toFixed(1), margen - 10, y + 4);
  }
};
