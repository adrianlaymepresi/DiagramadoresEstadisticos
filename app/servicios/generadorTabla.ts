import { FilaDatos } from '../tipos';

export const crearFilaVacia = (incluirColor: boolean): FilaDatos => ({
  x: 0,
  y: 0,
  tamanio: 0,
  ...(incluirColor && { color: '#8B5CF6' }),
});

export const crearFilasVacias = (
  numeroFilas: number,
  incluirColor: boolean
): FilaDatos[] => {
  return Array.from({ length: numeroFilas }, () => crearFilaVacia(incluirColor));
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
