import { FilaDatos } from '../tipos';

export const crearFilaVacia = (incluirColor: boolean, indice: number): FilaDatos => ({
  x: (indice + 1) * 10,
  y: (indice + 1) * 10,
  tamanio: (indice + 1) * 5,
  ...(incluirColor && { color: '#8B5CF6' }),
});

export const crearFilasVacias = (
  numeroFilas: number,
  incluirColor: boolean
): FilaDatos[] => {
  return Array.from({ length: numeroFilas }, (_, i) => crearFilaVacia(incluirColor, i));
};

export const actualizarFila = (
  filas: FilaDatos[],
  indice: number,
  campo: keyof FilaDatos,
  valor: number | string
): FilaDatos[] => {
  const nuevasFilas = [...filas];
  nuevasFilas[indice] = {
    ...nuevasFilas[indice],
    [campo]: valor,
  };
  return nuevasFilas;
};

export const validarFilasCompletas = (filas: FilaDatos[]): boolean => {
  return filas.every(
    (fila) => fila.x !== 0 || fila.y !== 0 || fila.tamanio !== 0
  );
};
