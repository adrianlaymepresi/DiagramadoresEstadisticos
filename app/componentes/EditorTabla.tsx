'use client';

import React, { useState, useEffect } from 'react';
import { FilaDatos, ConfiguracionColumnas } from '../tipos';
import { actualizarFila, crearFilasVacias } from '../servicios/generadorTabla';
import { parsearDatosTabla, validarFilaDiagramaBurbuja } from '../utilidades/validaciones';

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
  const [erroresFilas, setErroresFilas] = useState<Record<number, string[]>>({});

  useEffect(() => {
    setFilas(crearFilasVacias(numeroFilas, !!columnas.nombreColor));
  }, [numeroFilas, columnas.nombreColor]);

  const manejarCambio = (
    indice: number,
    campo: keyof FilaDatos,
    valor: string
  ) => {
    const nuevasFilas = [...filas];
    
    if (campo === 'color') {
      nuevasFilas[indice] = {
        ...nuevasFilas[indice],
        [campo]: valor,
      };
    } else {
      const valorNumerico = parseFloat(valor);
      nuevasFilas[indice] = {
        ...nuevasFilas[indice],
        [campo]: isNaN(valorNumerico) ? 0 : valorNumerico,
      };
    }
    
    setFilas(nuevasFilas);
    
    const { valido, errores } = validarFilaDiagramaBurbuja(
      nuevasFilas[indice].x,
      nuevasFilas[indice].y,
      nuevasFilas[indice].tamanio
    );
    
    if (!valido) {
      setErroresFilas(prev => ({ ...prev, [indice]: errores }));
    } else {
      setErroresFilas(prev => {
        const nuevo = { ...prev };
        delete nuevo[indice];
        return nuevo;
      });
    }
  };

  const manejarPegado = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textoPegado = e.clipboardData.getData('text');
    const datosParsedos = parsearDatosTabla(textoPegado);

    const nuevasFilas = [...filas];
    datosParsedos.forEach((fila, indice) => {
      if (indice >= nuevasFilas.length) return;

      if (fila[0]) {
        const x = parseFloat(fila[0]);
        if (!isNaN(x)) nuevasFilas[indice].x = x;
      }
      if (fila[1]) {
        const y = parseFloat(fila[1]);
        if (!isNaN(y)) nuevasFilas[indice].y = y;
      }
      if (fila[2]) {
        const tamanio = parseFloat(fila[2]);
        if (!isNaN(tamanio)) nuevasFilas[indice].tamanio = tamanio;
      }
      if (fila[3] && columnas.nombreColor) {
        nuevasFilas[indice].color = fila[3];
      }
    });

    setFilas(nuevasFilas);
  };

  const validarTodosDatos = (): boolean => {
    let todosValidos = true;
    const nuevosErrores: Record<number, string[]> = {};
    
    filas.forEach((fila, indice) => {
      const { valido, errores } = validarFilaDiagramaBurbuja(fila.x, fila.y, fila.tamanio);
      if (!valido) {
        todosValidos = false;
        nuevosErrores[indice] = errores;
      }
    });
    
    setErroresFilas(nuevosErrores);
    return todosValidos;
  };

  const manejarGenerar = () => {
    if (!validarTodosDatos()) {
      alert('Por favor, corrija los errores en los datos antes de continuar.');
      return;
    }
    alConfirmar(filas);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingresar Datos del Diagrama</h2>
          <p className="text-gray-600 text-sm">
            Complete los valores para cada burbuja. Puede copiar y pegar desde <strong>Excel</strong>.
          </p>
        </div>

        <div className="overflow-x-auto mb-6 rounded-lg border-2 border-gray-200">
          <table
            className="w-full border-collapse min-w-[700px]"
            onPaste={manejarPegado}
          >
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <th className="px-4 py-3 text-center font-bold text-white border-r border-purple-500 text-sm">
                  #
                </th>
                <th className="px-4 py-3 text-left font-bold text-white border-r border-purple-500 text-sm">
                  {columnas.nombreX} *
                </th>
                <th className="px-4 py-3 text-left font-bold text-white border-r border-purple-500 text-sm">
                  {columnas.nombreY} *
                </th>
                <th className="px-4 py-3 text-left font-bold text-white border-r border-purple-500 text-sm">
                  {columnas.nombreTamanio} *
                </th>
                {columnas.nombreColor && (
                  <th className="px-4 py-3 text-center font-bold text-white text-sm">
                    {columnas.nombreColor}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, indice) => (
                <React.Fragment key={indice}>
                  <tr className={`${indice % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
                    <td className="px-4 py-3 text-center font-bold text-purple-600 border border-gray-200 text-base">
                      {indice + 1}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={fila.x}
                        onChange={(e) => manejarCambio(indice, 'x', e.target.value)}
                        step="any"
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={fila.y}
                        onChange={(e) => manejarCambio(indice, 'y', e.target.value)}
                        step="any"
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <input
                        type="number"
                        value={fila.tamanio}
                        onChange={(e) => manejarCambio(indice, 'tamanio', e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </td>
                    {columnas.nombreColor && (
                      <td className="px-4 py-3 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={fila.color?.startsWith('#') ? fila.color : '#8B5CF6'}
                            onChange={(e) => manejarCambio(indice, 'color', e.target.value)}
                            className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={fila.color || ''}
                            onChange={(e) => manejarCambio(indice, 'color', e.target.value)}
                            placeholder="color/categoría"
                            className="flex-1 px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                  {erroresFilas[indice] && (
                    <tr>
                      <td></td>
                      <td colSpan={columnas.nombreColor ? 4 : 3} className="px-6 py-2 bg-red-50">
                        {erroresFilas[indice].map((error, idx) => (
                          <p key={idx} className="text-sm text-red-600 font-medium">{error}</p>
                        ))}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={alVolver}
            className="px-6 py-3 text-base font-semibold text-purple-600 bg-white border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
          >
            ← Volver
          </button>
          <button
            onClick={manejarGenerar}
            className="flex-1 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors duration-200 shadow-md"
          >
            Generar Diagrama →
          </button>
        </div>
      </div>
    </div>
  );
};
