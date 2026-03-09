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

export const validarColorHex = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const parsearDatosTabla = (datos: string): string[][] => {
  const lineas = datos.trim().split('\n');
  return lineas.map(linea => 
    linea.split('\t').map(celda => celda.trim())
  );
};
