import { FilaDatos, ConfiguracionColumnas, OpcionesVisualizacion } from '../tipos';

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

  // Manejar caso cuando todos los valores son iguales
  if (maxX === minX) {
    const base = minX === 0 ? 1 : Math.abs(minX) * 0.1;
    minX = minX - base;
    maxX = maxX + base;
  }
  if (maxY === minY) {
    const base = minY === 0 ? 1 : Math.abs(minY) * 0.1;
    minY = minY - base;
    maxY = maxY + base;
  }
  if (maxTamanio === minTamanio) {
    minTamanio = Math.max(0, minTamanio - 1);
    maxTamanio = maxTamanio + 1;
  }

  // Padding adaptativo: 15% para datos normales, más para rangos muy pequeños
  const rangoX = maxX - minX;
  const rangoY = maxY - minY;
  
  const porcentajePaddingX = rangoX < 10 ? 0.2 : 0.15;
  const porcentajePaddingY = rangoY < 10 ? 0.2 : 0.15;
  
  const margenX = rangoX * porcentajePaddingX;
  const margenY = rangoY * porcentajePaddingY;

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

const MAPA_COLORES_CATEGORIAS: Record<string, string> = {
  sube: '#10B981',
  subida: '#10B981',
  alto: '#10B981',
  positivo: '#10B981',
  arriba: '#10B981',
  baja: '#EF4444',
  bajada: '#EF4444',
  bajo: '#EF4444',
  negativo: '#EF4444',
  abajo: '#EF4444',
  estable: '#6B7280',
  neutro: '#6B7280',
  medio: '#F59E0B',
  moderado: '#F59E0B',
  verde: '#10B981',
  rojo: '#EF4444',
  azul: '#3B82F6',
  amarillo: '#F59E0B',
  morado: '#8B5CF6',
};

const esColorCSSValido = (color: string): boolean => {
  const trimmed = color.trim().toLowerCase();
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmed)) return true;
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(trimmed)) return true;
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(trimmed)) return true;
  const coloresCSS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'magenta', 'black', 'white', 'gray', 'brown'];
  return coloresCSS.includes(trimmed);
};

export const resolverColorBurbuja = (valorColor: string | undefined, colorDefault: string): string => {
  if (!valorColor || valorColor.trim() === '') return colorDefault;
  
  const valor = valorColor.trim().toLowerCase();
  
  if (esColorCSSValido(valorColor)) return valorColor;
  
  if (MAPA_COLORES_CATEGORIAS[valor]) return MAPA_COLORES_CATEGORIAS[valor];
  
  return colorDefault;
};

// Calcular radios dinámicos basados en el tamaño del canvas
export const calcularRadiosDinamicos = (anchoCanvas: number, altoCanvas: number): { min: number; max: number } => {
  const areaUtil = Math.min(anchoCanvas, altoCanvas) - 180; // Descontar márgenes
  const radioMin = Math.max(6, areaUtil * 0.01); // 1% del área útil, mínimo 6px
  const radioMax = Math.min(60, areaUtil * 0.08); // 8% del área útil, máximo 60px
  
  return { min: radioMin, max: radioMax };
};

export const calcularRadioVisualBurbuja = (
  tamanio: number,
  tamanioMaximo: number,
  radioMinimo: number,
  radioMaximo: number
): number => {
  if (tamanioMaximo === 0) return radioMinimo;
  
  if (tamanio <= 0) return radioMinimo;
  
  const tamanioNormalizado = tamanio / tamanioMaximo;
  
  // Escalado con raíz cuadrada para representación proporcional al área
  const radioVisual = radioMinimo + Math.sqrt(tamanioNormalizado) * (radioMaximo - radioMinimo);
  
  return Math.max(radioMinimo, Math.min(radioMaximo, radioVisual));
};

interface DatosBurbuja {
  x: number;
  y: number;
  radio: number;
  color: string;
  valorX: number;
  valorY: number;
  valorTamanio: number;
  valorColor?: string;
}

export const calcularDatosBurbujas = (
  datos: FilaDatos[],
  anchoCanvas: number,
  altoCanvas: number,
  margen: number
): DatosBurbuja[] => {
  const rangos = calcularRangos(datos);
  const coloresDefault = generarColoresDefault(datos.length);
  const { min: radioMin, max: radioMax } = calcularRadiosDinamicos(anchoCanvas, altoCanvas);

  const anchoUtil = anchoCanvas - 2 * margen;
  const altoUtil = altoCanvas - 2 * margen;
  
  const tamanioMaximo = Math.max(...datos.map(d => d.tamanio));

  return datos.map((fila, indice) => {
    const x = escalarValor(fila.x, rangos.minX, rangos.maxX, [margen, margen + anchoUtil]);
    const y = escalarValor(fila.y, rangos.minY, rangos.maxY, [margen + altoUtil, margen]);
    
    const radio = calcularRadioVisualBurbuja(fila.tamanio, tamanioMaximo, radioMin, radioMax);
    
    const colorFinal = resolverColorBurbuja(fila.color, coloresDefault[indice]);

    return {
      x,
      y,
      radio,
      color: colorFinal,
      valorX: fila.x,
      valorY: fila.y,
      valorTamanio: fila.tamanio,
      valorColor: fila.color,
    };
  });
};

const dibujarCuadricula = (
  ctx: CanvasRenderingContext2D,
  anchoCanvas: number,
  altoCanvas: number,
  margen: number,
  rangos: RangosEscala,
  opciones: OpcionesVisualizacion
): void => {
  if (!opciones.cuadricula.mostrarHorizontal && !opciones.cuadricula.mostrarVertical) {
    return; // No dibujar cuadrícula si ambas están desactivadas
  }

  const pasos = 10;
  ctx.strokeStyle = opciones.cuadricula.color;
  ctx.lineWidth = opciones.cuadricula.grosor;

  // Líneas verticales
  if (opciones.cuadricula.mostrarVertical) {
    for (let i = 1; i < pasos; i++) {
      const x = margen + ((anchoCanvas - 2 * margen) * i) / pasos;
      ctx.beginPath();
      ctx.moveTo(x, margen);
      ctx.lineTo(x, altoCanvas - margen);
      ctx.stroke();
    }
  }

  // Líneas horizontales
  if (opciones.cuadricula.mostrarHorizontal) {
    for (let i = 1; i < pasos; i++) {
      const y = margen + ((altoCanvas - 2 * margen) * i) / pasos;
      ctx.beginPath();
      ctx.moveTo(margen, y);
      ctx.lineTo(anchoCanvas - margen, y);
      ctx.stroke();
    }
  }
};

// Formatear números de forma inteligente para los ejes
const formatearNumeroEje = (valor: number): string => {
  const absValor = Math.abs(valor);
  
  if (absValor === 0) return '0';
  if (absValor >= 1000000) return (valor / 1000000).toFixed(1) + 'M';
  if (absValor >= 1000) return (valor / 1000).toFixed(1) + 'K';
  if (absValor >= 100) return valor.toFixed(0);
  if (absValor >= 1) return valor.toFixed(1);
  if (absValor >= 0.01) return valor.toFixed(2);
  return valor.toExponential(1);
};

// Calcular ticks inteligentes basados en datos reales
const calcularTicksInteligentes = (
  datos: FilaDatos[],
  campo: 'x' | 'y',
  minRango: number,
  maxRango: number
): number[] => {
  // Obtener valores únicos ordenados
  const valoresUnicos = [...new Set(datos.map(d => d[campo]))].sort((a, b) => a - b);
  
  // Siempre incluir min y max del rango
  const ticks = new Set<number>([minRango, maxRango]);
  
  // Agregar valores reales de los datos
  valoresUnicos.forEach(v => ticks.add(v));
  
  const ticksArray = Array.from(ticks).sort((a, b) => a - b);
  
  // Si hay demasiados ticks (>10), reducir mostrando valores representativos
  if (ticksArray.length > 10) {
    const ticksReducidos = [ticksArray[0]]; // Mínimo
    const paso = Math.floor(ticksArray.length / 8);
    
    for (let i = paso; i < ticksArray.length - 1; i += paso) {
      ticksReducidos.push(ticksArray[i]);
    }
    
    ticksReducidos.push(ticksArray[ticksArray.length - 1]); // Máximo
    return ticksReducidos;
  }
  
  return ticksArray;
};

const dibujarEjes = (
  ctx: CanvasRenderingContext2D,
  anchoCanvas: number,
  altoCanvas: number,
  margen: number,
  rangos: RangosEscala,
  columnas: ConfiguracionColumnas,
  datos: FilaDatos[],
  opciones: OpcionesVisualizacion
): void => {
  // Ejes principales con personalización
  ctx.strokeStyle = opciones.ejes.colorLinea;
  ctx.lineWidth = opciones.ejes.grosorLinea;
  ctx.beginPath();
  ctx.moveTo(margen, margen);
  ctx.lineTo(margen, altoCanvas - margen);
  ctx.lineTo(anchoCanvas - margen, altoCanvas - margen);
  ctx.stroke();

  // Título del diagrama
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Diagrama de Burbujas: ${columnas.nombreTamanio}`, anchoCanvas / 2, 35);

  // Etiquetas de ejes con opciones personalizadas
  ctx.font = 'bold 14px sans-serif';
  
  // Título eje Y
  if (opciones.ejes.mostrarTituloY) {
    const tituloY = opciones.ejes.tituloYPersonalizado || columnas.nombreY;
    ctx.save();
    ctx.translate(25, altoCanvas / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(tituloY, 0, 0);
    ctx.restore();
  }

  // Título eje X
  if (opciones.ejes.mostrarTituloX) {
    const tituloX = opciones.ejes.tituloXPersonalizado || columnas.nombreX;
    ctx.fillText(tituloX, anchoCanvas / 2, altoCanvas - 20);
  }

  // Calcular ticks basados en datos reales
  const ticksX = calcularTicksInteligentes(datos, 'x', rangos.minX, rangos.maxX);
  const ticksY = calcularTicksInteligentes(datos, 'y', rangos.minY, rangos.maxY);

  // Dibujar ticks y valores del eje X
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#64748B';

  ticksX.forEach((valorX) => {
    const proporcion = (valorX - rangos.minX) / (rangos.maxX - rangos.minX);
    const x = margen + (anchoCanvas - 2 * margen) * proporcion;
    
    ctx.textAlign = 'center';
    ctx.fillText(formatearNumeroEje(valorX), x, altoCanvas - margen + 18);
    
    // Tick mark
    ctx.beginPath();
    ctx.moveTo(x, altoCanvas - margen);
    ctx.lineTo(x, altoCanvas - margen + 5);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Dibujar ticks y valores del eje Y
  ticksY.forEach((valorY) => {
    const proporcion = (valorY - rangos.minY) / (rangos.maxY - rangos.minY);
    const y = altoCanvas - margen - (altoCanvas - 2 * margen) * proporcion;
    
    ctx.textAlign = 'right';
    ctx.fillText(formatearNumeroEje(valorY), margen - 8, y + 4);
    
    // Tick mark
    ctx.beginPath();
    ctx.moveTo(margen - 5, y);
    ctx.lineTo(margen, y);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

// Dibujar líneas de conexión entre burbujas
const dibujarLineasConexion = (
  ctx: CanvasRenderingContext2D,
  burbujas: DatosBurbuja[],
  opciones: OpcionesVisualizacion
): void => {
  if (!opciones.lineasConexion.mostrar || burbujas.length < 2) return;

  ctx.strokeStyle = opciones.lineasConexion.color;
  ctx.lineWidth = opciones.lineasConexion.grosor;
  
  if (opciones.lineasConexion.estilo === 'punteada') {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }

  ctx.beginPath();
  ctx.moveTo(burbujas[0].x, burbujas[0].y);
  
  for (let i = 1; i < burbujas.length; i++) {
    ctx.lineTo(burbujas[i].x, burbujas[i].y);
  }
  
  ctx.stroke();
  ctx.setLineDash([]); // Resetear
};

// Dibujar etiquetas sobre las burbujas
const dibujarEtiquetasBurbujas = (
  ctx: CanvasRenderingContext2D,
  burbujas: DatosBurbuja[],
  columnas: ConfiguracionColumnas,
  opciones: OpcionesVisualizacion
): void => {
  if (!opciones.etiquetas.mostrar) return;

  ctx.font = `${opciones.etiquetas.tamanioFuente}px sans-serif`;
  ctx.fillStyle = opciones.etiquetas.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  burbujas.forEach((burbuja) => {
    const etiquetas: string[] = [];

    if (opciones.etiquetas.mostrarX) {
      etiquetas.push(`${columnas.nombreX}: ${formatearNumeroEje(burbuja.valorX)}`);
    }
    if (opciones.etiquetas.mostrarY) {
      etiquetas.push(`${columnas.nombreY}: ${formatearNumeroEje(burbuja.valorY)}`);
    }
    if (opciones.etiquetas.mostrarTamanio) {
      etiquetas.push(`${formatearNumeroEje(burbuja.valorTamanio)}`);
    }
    if (opciones.etiquetas.mostrarColor && burbuja.valorColor) {
      etiquetas.push(burbuja.valorColor);
    }

    // Dibujar etiquetas con fondo semi-transparente
    const offsetY = burbuja.radio + 8;
    etiquetas.forEach((etiqueta, idx) => {
      const y = burbuja.y - offsetY - (idx * (opciones.etiquetas.tamanioFuente + 4));
      
      // Fondo para legibilidad
      const medidaTexto = ctx.measureText(etiqueta);
      const paddingH = 6;
      const paddingV = 3;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(
        burbuja.x - medidaTexto.width / 2 - paddingH,
        y - opciones.etiquetas.tamanioFuente / 2 - paddingV,
        medidaTexto.width + paddingH * 2,
        opciones.etiquetas.tamanioFuente + paddingV * 2
      );
      
      // Borde sutil
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        burbuja.x - medidaTexto.width / 2 - paddingH,
        y - opciones.etiquetas.tamanioFuente / 2 - paddingV,
        medidaTexto.width + paddingH * 2,
        opciones.etiquetas.tamanioFuente + paddingV * 2
      );
      
      // Texto
      ctx.fillStyle = opciones.etiquetas.color;
      ctx.fillText(etiqueta, burbuja.x, y);
    });
  });
};



// Dibujar leyenda de colores con posicionamiento
const dibujarLeyenda = (
  ctx: CanvasRenderingContext2D,
  datos: FilaDatos[],
  anchoCanvas: number,
  altoCanvas: number,
  margen: number,
  columnas: ConfiguracionColumnas,
  opciones: OpcionesVisualizacion
): void => {
  if (!opciones.leyenda.mostrar || !columnas.nombreColor) return;
  
  // Obtener colores únicos con sus valores originales
  const coloresUnicos = new Map<string, string>();
  datos.forEach((fila, idx) => {
    if (fila.color) {
      const colorResuelto = resolverColorBurbuja(fila.color, generarColoresDefault(datos.length)[idx]);
      coloresUnicos.set(fila.color, colorResuelto);
    }
  });
  
  if (coloresUnicos.size === 0) return;
  
  const items = Array.from(coloresUnicos.entries());
  
  let startX: number;
  let startY: number;
  
  if (opciones.leyenda.posicion === 'derecha') {
    startX = anchoCanvas - 200;
    startY = 60;
  } else {
    // Posición inferior
    startX = margen + 20;
    startY = altoCanvas - margen + 40;
  }
  
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#1E293B';
  ctx.textAlign = 'left';
  ctx.fillText(columnas.nombreColor + ':', startX, startY);
  startY += 20;
  
  ctx.font = '11px sans-serif';
  
  if (opciones.leyenda.posicion === 'derecha') {
    // Layout vertical
    items.forEach(([valor, color], idx) => {
      const y = startY + idx * 22;
      
      // Cuadro de color
      ctx.fillStyle = color;
      ctx.globalAlpha = opciones.burbujas.transparencia / 100;
      ctx.fillRect(startX, y - 10, 14, 14);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, y - 10, 14, 14);
      
      // Texto
      ctx.fillStyle = '#475569';
      ctx.fillText(valor.length > 15 ? valor.substring(0, 15) + '...' : valor, startX + 20, y);
    });
  } else {
    // Layout horizontal
    let offsetX = 0;
    items.forEach(([valor, color]) => {
      // Cuadro de color
      ctx.fillStyle = color;
      ctx.globalAlpha = opciones.burbujas.transparencia / 100;
      ctx.fillRect(startX + offsetX, startY - 10, 14, 14);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX + offsetX, startY - 10, 14, 14);
      
      // Texto
      ctx.fillStyle = '#475569';
      const textoCorto = valor.length > 12 ? valor.substring(0, 12) + '...' : valor;
      ctx.fillText(textoCorto, startX + offsetX + 20, startY);
      
      offsetX += ctx.measureText(textoCorto).width + 40;
    });
  }
};

export const dibujarDiagrama = (
  canvas: HTMLCanvasElement,
  datos: FilaDatos[],
  columnas: ConfiguracionColumnas,
  opciones: OpcionesVisualizacion
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const margen = 90;
  const anchoCanvas = canvas.width;
  const altoCanvas = canvas.height;

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, anchoCanvas, altoCanvas);

  const rangos = calcularRangos(datos);
  
  // Dibujar cuadrícula (condicional y personalizable)
  dibujarCuadricula(ctx, anchoCanvas, altoCanvas, margen, rangos, opciones);
  
  // Dibujar ejes (con personalización)
  dibujarEjes(ctx, anchoCanvas, altoCanvas, margen, rangos, columnas, datos, opciones);

  const burbujas = calcularDatosBurbujas(datos, anchoCanvas, altoCanvas, margen);

  // Dibujar líneas de conexión (si está activado)
  dibujarLineasConexion(ctx, burbujas, opciones);

  // Dibujar burbujas con opciones personalizables
  burbujas.forEach((burbuja) => {
    // Fill con transparencia personalizable
    ctx.fillStyle = burbuja.color;
    ctx.globalAlpha = opciones.burbujas.transparencia / 100;
    ctx.beginPath();
    ctx.arc(burbuja.x, burbuja.y, burbuja.radio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Borde personalizable
    if (opciones.burbujas.mostrarBorde && opciones.burbujas.grosorBorde > 0) {
      ctx.strokeStyle = opciones.burbujas.colorBorde;
      ctx.lineWidth = opciones.burbujas.grosorBorde;
      ctx.stroke();
    }
  });
  
  // Dibujar etiquetas sobre burbujas (si está activado)
  dibujarEtiquetasBurbujas(ctx, burbujas, columnas, opciones);
  
  // Dibujar leyenda si hay cuarta dimensión (con posicionamiento)
  dibujarLeyenda(ctx, datos, anchoCanvas, altoCanvas, margen, columnas, opciones);
};

// Exportar burbujas para interactividad (tooltips)
export type { DatosBurbuja };
