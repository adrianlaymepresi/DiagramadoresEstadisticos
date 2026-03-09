'use client';

import React, { useState, useEffect } from 'react';
import { FilaDatos, ConfiguracionColumnas } from '../tipos';
import { parsearDatosTabla } from '../utilidades/validaciones';

interface PropiedadesEditorTabla {
  numeroFilas: number;
  columnas: ConfiguracionColumnas;
  alConfirmar: (datos: FilaDatos[]) => void;
  alVolver: () => void;
}

// Estado interno con strings para permitir edición flexible
interface FilaInterna {
  x: string;
  y: string;
  tamanio: string;
  color?: string;
}

interface ErrorFila {
  campo: string;
  mensaje: string;
}

export const EditorTabla: React.FC<PropiedadesEditorTabla> = ({
  numeroFilas,
  columnas,
  alConfirmar,
  alVolver,
}) => {
  // Usar strings internamente para permitir borrar sin forzar 0
  const [filasInternas, setFilasInternas] = useState<FilaInterna[]>([]);
  const [erroresFilas, setErroresFilas] = useState<Record<number, ErrorFila[]>>({});
  const [filaEditando, setFilaEditando] = useState<number | null>(null);

  useEffect(() => {
    // Inicializar filas vacías con strings vacíos
    const nuevasFilas: FilaInterna[] = Array.from({ length: numeroFilas }, () => ({
      x: '',
      y: '',
      tamanio: '',
      ...(columnas.nombreColor && { color: '' }),
    }));
    setFilasInternas(nuevasFilas);
  }, [numeroFilas, columnas.nombreColor]);

  const manejarCambio = (
    indice: number,
    campo: keyof FilaInterna,
    valor: string
  ) => {
    const nuevasFilas = [...filasInternas];
    nuevasFilas[indice] = {
      ...nuevasFilas[indice],
      [campo]: valor,
    };
    setFilasInternas(nuevasFilas);

    // Limpiar errores de este campo cuando el usuario empiece a editar
    setErroresFilas(prev => {
      const nuevosErrores = { ...prev };
      if (nuevosErrores[indice]) {
        nuevosErrores[indice] = nuevosErrores[indice].filter(e => e.campo !== campo);
        if (nuevosErrores[indice].length === 0) {
          delete nuevosErrores[indice];
        }
      }
      return nuevosErrores;
    });
  };

  const validarFila = (indice: number): boolean => {
    const fila = filasInternas[indice];
    const errores: ErrorFila[] = [];

    const x = parseFloat(fila.x);
    const y = parseFloat(fila.y);
    const tamanio = parseFloat(fila.tamanio);

    if (isNaN(x) || fila.x.trim() === '') {
      errores.push({ campo: 'x', mensaje: `${columnas.nombreX} requerido` });
    }

    if (isNaN(y) || fila.y.trim() === '') {
      errores.push({ campo: 'y', mensaje: `${columnas.nombreY} requerido` });
    }

    if (isNaN(tamanio) || fila.tamanio.trim() === '') {
      errores.push({ campo: 'tamanio', mensaje: `${columnas.nombreTamanio} requerido` });
    } else if (tamanio <= 0) {
      errores.push({ campo: 'tamanio', mensaje: 'Debe ser mayor a 0' });
    }

    if (errores.length > 0) {
      setErroresFilas(prev => ({ ...prev, [indice]: errores }));
      return false;
    } else {
      setErroresFilas(prev => {
        const nuevo = { ...prev };
        delete nuevo[indice];
        return nuevo;
      });
      return true;
    }
  };

  const manejarBlur = (indice: number) => {
    setFilaEditando(null);
    validarFila(indice);
  };

  const manejarFocus = (indice: number) => {
    setFilaEditando(indice);
  };

  const manejarPegado = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textoPegado = e.clipboardData.getData('text');
    const datosParsedos = parsearDatosTabla(textoPegado);

    const nuevasFilas = [...filasInternas];
    datosParsedos.forEach((fila, indice) => {
      if (indice >= nuevasFilas.length) return;

      if (fila[0]) nuevasFilas[indice].x = fila[0];
      if (fila[1]) nuevasFilas[indice].y = fila[1];
      if (fila[2]) nuevasFilas[indice].tamanio = fila[2];
      if (fila[3] && columnas.nombreColor) nuevasFilas[indice].color = fila[3];
    });

    setFilasInternas(nuevasFilas);
    setErroresFilas({});
  };

  const convertirAFilaDatos = (): FilaDatos[] | null => {
    const filasConvertidas: FilaDatos[] = [];
    let hayErrores = false;

    filasInternas.forEach((fila, indice) => {
      if (!validarFila(indice)) {
        hayErrores = true;
      } else {
        filasConvertidas.push({
          x: parseFloat(fila.x),
          y: parseFloat(fila.y),
          tamanio: parseFloat(fila.tamanio),
          ...(columnas.nombreColor && { color: fila.color || '' }),
        });
      }
    });

    return hayErrores ? null : filasConvertidas;
  };

  const manejarGenerar = () => {
    const datos = convertirAFilaDatos();
    if (!datos) {
      // No mostrar alert, los errores ya están visibles en la tabla
      return;
    }
    alConfirmar(datos);
  };

  const calcularProgreso = (): number => {
    const filasCompletas = filasInternas.filter(fila => 
      fila.x.trim() !== '' && 
      fila.y.trim() !== '' && 
      fila.tamanio.trim() !== '' &&
      !isNaN(parseFloat(fila.x)) &&
      !isNaN(parseFloat(fila.y)) &&
      !isNaN(parseFloat(fila.tamanio))
    ).length;
    return Math.round((filasCompletas / numeroFilas) * 100);
  };

  const tieneErrores = Object.keys(erroresFilas).length > 0;
  const progreso = calcularProgreso();
  const estaCompleto = progreso === 100;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">📝 Ingreso de Datos</h2>
          <p className="text-purple-100 text-base">
            Complete los valores para cada punto. Los campos permanecerán editables hasta que salga de ellos.
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Progreso de completitud
            </span>
            <span className={`text-sm font-bold ${estaCompleto ? 'text-green-600' : 'text-purple-600'}`}>
              {progreso}% ({filasInternas.filter(f => f.x.trim() && f.y.trim() && f.tamanio.trim()).length}/{numeroFilas} burbujas)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                estaCompleto ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* Tips de uso */}
        <div className="px-8 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">Tips de uso:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Puede <strong>copiar y pegar desde Excel</strong> seleccionando las celdas y pegando aquí</li>
                <li>• Los campos pueden quedar <strong>temporalmente vacíos</strong> mientras edita</li>
                <li>• La validación se ejecuta al <strong>salir de cada campo</strong> o al generar el diagrama</li>
                <li>• El tamaño debe ser <strong>mayor a 0</strong> (negativo o cero no es válido)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="p-8">
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg">
            <table
              className="w-full border-collapse min-w-[800px]"
              onPaste={manejarPegado}
            >
              <thead>
                <tr className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700">
                  <th className="px-5 py-4 text-center font-bold text-white border-r border-purple-500 w-16">
                    <div className="text-base">#</div>
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-white border-r border-purple-500">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">↔</span>
                      <div>
                        <div className="text-base">{columnas.nombreX}</div>
                        <div className="text-xs font-normal text-purple-200">Eje horizontal (X)</div>
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-white border-r border-purple-500">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">↕</span>
                      <div>
                        <div className="text-base">{columnas.nombreY}</div>
                        <div className="text-xs font-normal text-purple-200">Eje vertical (Y)</div>
                      </div>
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-white border-r border-purple-500">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚫</span>
                      <div>
                        <div className="text-base">{columnas.nombreTamanio}</div>
                        <div className="text-xs font-normal text-purple-200">Tamaño de burbuja</div>
                      </div>
                    </div>
                  </th>
                  {columnas.nombreColor && (
                    <th className="px-5 py-4 text-left font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎨</span>
                        <div>
                          <div className="text-base">{columnas.nombreColor}</div>
                          <div className="text-xs font-normal text-purple-200">Color/Categoría</div>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filasInternas.map((fila, indice) => {
                  const tieneError = erroresFilas[indice];
                  const estaEditandoFila = filaEditando === indice;
                  
                  return (
                    <React.Fragment key={indice}>
                      <tr 
                        className={`
                          transition-all duration-200
                          ${tieneError ? 'bg-red-50 border-l-4 border-red-500' : 
                            indice % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          ${estaEditandoFila ? 'ring-2 ring-purple-300' : ''}
                          hover:bg-purple-50
                        `}
                      >
                        <td className="px-5 py-4 text-center font-bold text-purple-700 border border-gray-200 text-lg">
                          {tieneError && <span className="text-red-500 mr-1">⚠️</span>}
                          {indice + 1}
                        </td>
                        
                        <td className="px-5 py-4 border border-gray-200">
                          <input
                            type="text"
                            value={fila.x}
                            onChange={(e) => manejarCambio(indice, 'x', e.target.value)}
                            onFocus={() => manejarFocus(indice)}
                            onBlur={() => manejarBlur(indice)}
                            className={`
                              w-full px-4 py-3 text-base border-2 rounded-lg outline-none transition-all
                              ${tieneError && erroresFilas[indice].some(e => e.campo === 'x')
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                : 'border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100'}
                            `}
                            placeholder="Ej: 10, 25.5, -3"
                          />
                        </td>
                        
                        <td className="px-5 py-4 border border-gray-200">
                          <input
                            type="text"
                            value={fila.y}
                            onChange={(e) => manejarCambio(indice, 'y', e.target.value)}
                            onFocus={() => manejarFocus(indice)}
                            onBlur={() => manejarBlur(indice)}
                            className={`
                              w-full px-4 py-3 text-base border-2 rounded-lg outline-none transition-all
                              ${tieneError && erroresFilas[indice].some(e => e.campo === 'y')
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                : 'border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100'}
                            `}
                            placeholder="Ej: 100, 52.3, 0.5"
                          />
                        </td>
                        
                        <td className="px-5 py-4 border border-gray-200">
                          <input
                            type="text"
                            value={fila.tamanio}
                            onChange={(e) => manejarCambio(indice, 'tamanio', e.target.value)}
                            onFocus={() => manejarFocus(indice)}
                            onBlur={() => manejarBlur(indice)}
                            className={`
                              w-full px-4 py-3 text-base border-2 rounded-lg outline-none transition-all
                              ${tieneError && erroresFilas[indice].some(e => e.campo === 'tamanio')
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                : 'border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100'}
                            `}
                            placeholder="Ej: 1500, 42.8 (>0)"
                          />
                        </td>
                        
                        {columnas.nombreColor && (
                          <td className="px-5 py-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={fila.color?.startsWith('#') ? fila.color : '#8B5CF6'}
                                onChange={(e) => manejarCambio(indice, 'color', e.target.value)}
                                className="w-14 h-14 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-purple-500 transition-all"
                                title="Selector de color"
                              />
                              <input
                                type="text"
                                value={fila.color || ''}
                                onChange={(e) => manejarCambio(indice, 'color', e.target.value)}
                                onFocus={() => manejarFocus(indice)}
                                onBlur={() => manejarBlur(indice)}
                                placeholder="Color o categoría"
                                className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white"
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                      
                      {tieneError && (
                        <tr>
                          <td></td>
                          <td colSpan={columnas.nombreColor ? 4 : 3} className="px-5 py-3 bg-red-100 border-x border-b border-red-200">
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 text-lg mt-0.5">❌</span>
                              <div className="flex-1">
                                {erroresFilas[indice].map((error, idx) => (
                                  <p key={idx} className="text-sm text-red-700 font-semibold">
                                    • {error.mensaje}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={alVolver}
              className="px-6 py-4 text-lg font-semibold text-purple-700 bg-white border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ← Volver a Configuración
            </button>
            <button
              onClick={manejarGenerar}
              disabled={!estaCompleto || tieneErrores}
              className={`
                flex-1 px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 shadow-xl
                ${estaCompleto && !tieneErrores
                  ? 'text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed'}
              `}
            >
              {tieneErrores 
                ? '⚠️ Corrija los errores para continuar' 
                : !estaCompleto 
                  ? `Complete los datos (${progreso}%)` 
                  : '✓ Generar Diagrama de Burbujas →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
