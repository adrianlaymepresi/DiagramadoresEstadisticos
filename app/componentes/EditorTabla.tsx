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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <p className="text-base md:text-lg text-gray-700 flex-1 leading-relaxed">
              Puede copiar datos desde <span className="font-bold">Excel</span> o <span className="font-bold">Word</span> y pegarlos directamente en la tabla.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse min-w-[700px]"
              onPaste={manejarPegado}
            >
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <th className="px-6 py-5 text-center font-bold text-white border-r border-purple-500 w-20 text-lg">
                    #
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-white border-r border-purple-500 text-lg">
                    {columnas.nombreX}
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-white border-r border-purple-500 text-lg">
                    {columnas.nombreY}
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-white border-r border-purple-500 text-lg">
                    {columnas.nombreTamanio}
                  </th>
                  {columnas.nombreColor && (
                    <th className="px-6 py-5 text-center font-bold text-white text-lg">
                      {columnas.nombreColor}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila, indice) => (
                  <tr
                    key={indice}
                    className={`
                      transition-all duration-200
                      ${indice % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      hover:bg-purple-50
                    `}
                  >
                    <td className="px-6 py-4 border border-gray-200 font-bold text-purple-600 text-center text-lg">
                      {indice + 1}
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <input
                        type="number"
                        value={fila.x || ''}
                        onChange={(e) => manejarCambio(indice, 'x', e.target.value)}
                        step="any"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base"
                      />
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <input
                        type="number"
                        value={fila.y || ''}
                        onChange={(e) => manejarCambio(indice, 'y', e.target.value)}
                        step="any"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base"
                      />
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <input
                        type="number"
                        value={fila.tamanio || ''}
                        onChange={(e) => manejarCambio(indice, 'tamanio', e.target.value)}
                        step="any"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base"
                      />
                    </td>
                    {columnas.nombreColor && (
                      <td className="px-6 py-4 border border-gray-200">
                        <div className="flex items-center justify-center gap-3">
                          <input
                            type="color"
                            value={fila.color || '#8B5CF6'}
                            onChange={(e) => manejarCambio(indice, 'color', e.target.value)}
                            className="w-14 h-14 cursor-pointer rounded-lg border-2 border-gray-300"
                          />
                          <span className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-2 rounded-lg">
                            {fila.color || '#8B5CF6'}
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-6">
          <Boton onClick={alVolver} variante="outline" ancho="auto" className="text-lg px-8 py-4">
            ← Volver
          </Boton>
          <div className="flex-1">
            <Boton onClick={manejarGenerar} variante="primario" ancho="completo" className="text-lg px-8 py-4">
              Generar Diagrama →
            </Boton>
          </div>
        </div>
      </div>
    </Tarjeta>
  );
};
