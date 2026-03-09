'use client';

import React, { useState, useEffect } from 'react';
import { Tarjeta } from './ui/Tarjeta';
import { Boton } from './ui/Boton';
import { FilaDatos, ConfiguracionColumnas } from '../tipos';
import { actualizarFila, crearFilasVacias } from '../servicios/generadorTabla';
import { parsearDatosTabla, validarValorNumerico } from '../utilidades/validaciones';

interface PropiedadesEditorTabla {
  numeroFilas: number;
  columnas: ConfiguracionColumnas;
  alConfirmar: (datos: FilaDatos[]) => void;
  alVolver: () => void;
}

export const EditorTabla: React.FC<PropiedadesEditorTabla> = ({
  numeroFilas,
  columnas,
  alConfirmar,
  alVolver,
}) => {
  const [filas, setFilas] = useState<FilaDatos[]>([]);

  useEffect(() => {
    setFilas(crearFilasVacias(numeroFilas, !!columnas.nombreColor));
  }, [numeroFilas, columnas.nombreColor]);

  const manejarCambio = (
    indice: number,
    campo: keyof FilaDatos,
    valor: string
  ) => {
    if (campo === 'color') {
      setFilas(actualizarFila(filas, indice, campo, valor));
    } else {
      const valorNumerico = parseFloat(valor) || 0;
      setFilas(actualizarFila(filas, indice, campo, valorNumerico));
    }
  };

  const manejarPegado = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textoPegado = e.clipboardData.getData('text');
    const datosParsedos = parsearDatosTabla(textoPegado);

    const nuevasFilas = [...filas];
    datosParsedos.forEach((fila, indice) => {
      if (indice >= nuevasFilas.length) return;

      if (fila[0] && validarValorNumerico(fila[0])) {
        nuevasFilas[indice].x = parseFloat(fila[0]);
      }
      if (fila[1] && validarValorNumerico(fila[1])) {
        nuevasFilas[indice].y = parseFloat(fila[1]);
      }
      if (fila[2] && validarValorNumerico(fila[2])) {
        nuevasFilas[indice].tamanio = parseFloat(fila[2]);
      }
      if (fila[3] && columnas.nombreColor) {
        nuevasFilas[indice].color = fila[3];
      }
    });

    setFilas(nuevasFilas);
  };

  const validarDatos = (): boolean => {
    return filas.every(
      (fila) =>
        validarValorNumerico(String(fila.x)) &&
        validarValorNumerico(String(fila.y)) &&
        validarValorNumerico(String(fila.tamanio)) &&
        fila.tamanio > 0
    );
  };

  const manejarGenerar = () => {
    if (!validarDatos()) {
      alert('Por favor, complete todos los campos con valores numéricos válidos.');
      return;
    }
    alConfirmar(filas);
  };

  return (
    <Tarjeta titulo="Ingresar Datos">
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            💡 Puede copiar datos desde Excel o Word y pegarlos directamente en la tabla.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            onPaste={manejarPegado}
          >
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <th className="px-4 py-3 text-left font-semibold border border-purple-500">
                  #
                </th>
                <th className="px-4 py-3 text-left font-semibold border border-purple-500">
                  {columnas.nombreX}
                </th>
                <th className="px-4 py-3 text-left font-semibold border border-purple-500">
                  {columnas.nombreY}
                </th>
                <th className="px-4 py-3 text-left font-semibold border border-purple-500">
                  {columnas.nombreTamanio}
                </th>
                {columnas.nombreColor && (
                  <th className="px-4 py-3 text-left font-semibold border border-purple-500">
                    {columnas.nombreColor}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, indice) => (
                <tr
                  key={indice}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <td className="px-4 py-2 border border-gray-300 font-medium text-gray-600">
                    {indice + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={fila.x || ''}
                      onChange={(e) => manejarCambio(indice, 'x', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={fila.y || ''}
                      onChange={(e) => manejarCambio(indice, 'y', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={fila.tamanio || ''}
                      onChange={(e) => manejarCambio(indice, 'tamanio', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                    />
                  </td>
                  {columnas.nombreColor && (
                    <td className="px-4 py-2 border border-gray-300">
                      <input
                        type="color"
                        value={fila.color || '#8B5CF6'}
                        onChange={(e) => manejarCambio(indice, 'color', e.target.value)}
                        className="w-full h-8 cursor-pointer rounded"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4">
          <Boton onClick={alVolver} variante="outline" ancho="auto">
            Volver
          </Boton>
          <Boton onClick={manejarGenerar} variante="primario" ancho="completo">
            Generar Diagrama
          </Boton>
        </div>
      </div>
    </Tarjeta>
  );
};
