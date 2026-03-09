export const validarNumeroFilas = (numero: number): boolean => {
  return numero >= 3 && numero <= 20;
};

export const validarNombreColumna = (nombre: string): boolean => {
  return nombre.trim().length > 0;
};

export const validarValorNumerico = (valor: string): boolean => {
  const numero = parseFloat(valor);
  return !isNaN(numero) && isFinite(numero);
};

export const validarTamanioPositivo = (valor: number): boolean => {
  return !isNaN(valor) && isFinite(valor) && valor >= 0;
};

export const validarFilaDiagramaBurbuja = (
  x: number,
  y: number,
  tamanio: number
): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  if (isNaN(x) || !isFinite(x)) {
    errores.push('El valor de X debe ser un número válido');
  }
  
  if (isNaN(y) || !isFinite(y)) {
    errores.push('El valor de Y debe ser un número válido');
  }
  
  if (isNaN(tamanio) || !isFinite(tamanio) || tamanio < 0) {
    errores.push('El tamaño debe ser un número mayor o igual a 0');
  }
  
  return {
    valido: errores.length === 0,
    errores,
  };
};

export const validarColorHex = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const parsearDatosTabla = (datos: string): string[][] => {
  const lineas = datos.trim().split('\n');
  return lineas.map(linea => 
    linea.split('\t').map(celda => celda.trim())
  );
};
