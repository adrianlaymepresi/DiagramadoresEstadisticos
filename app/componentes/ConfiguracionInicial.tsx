'use client';

import React, { useState } from 'react';
import { ConfiguracionColumnas } from '../tipos';
import { validarNumeroFilas, validarNombreColumna } from '../utilidades/validaciones';

interface PropiedadesConfiguracionInicial {
  alConfirmar: (numeroFilas: number, columnas: ConfiguracionColumnas) => void;
}

export const ConfiguracionInicial: React.FC<PropiedadesConfiguracionInicial> = ({
  alConfirmar,
}) => {
  const [numeroFilas, setNumeroFilas] = useState<string>('5');
  const [nombreX, setNombreX] = useState<string>('');
  const [nombreY, setNombreY] = useState<string>('');
  const [nombreTamanio, setNombreTamanio] = useState<string>('');
  const [nombreColor, setNombreColor] = useState<string>('');
  const [incluirColor, setIncluirColor] = useState<boolean>(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    const numeroFilasNum = parseInt(numeroFilas);
    if (!validarNumeroFilas(numeroFilasNum)) {
      nuevosErrores.numeroFilas = 'Debe ingresar entre 3 y 20 burbujas';
    }

    if (!validarNombreColumna(nombreX)) {
      nuevosErrores.nombreX = 'Ingrese un nombre para el eje horizontal';
    }

    if (!validarNombreColumna(nombreY)) {
      nuevosErrores.nombreY = 'Ingrese un nombre para el eje vertical';
    }

    if (!validarNombreColumna(nombreTamanio)) {
      nuevosErrores.nombreTamanio = 'Ingrese qué representa el tamaño de las burbujas';
    }

    if (incluirColor && !validarNombreColumna(nombreColor)) {
      nuevosErrores.nombreColor = 'Ingrese un nombre para la columna de color';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = () => {
    if (!validarFormulario()) return;

    const configuracionColumnas: ConfiguracionColumnas = {
      nombreX,
      nombreY,
      nombreTamanio,
      ...(incluirColor && { nombreColor }),
    };

    alConfirmar(parseInt(numeroFilas), configuracionColumnas);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header de la configuración */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">⚙️ Configuración del Diagrama</h2>
          <p className="text-purple-100 text-base">
            Defina las dimensiones de su análisis. Los diagramas de burbujas permiten visualizar hasta 4 variables simultáneamente.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Número de puntos de datos */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>¿Cuántos puntos de datos desea visualizar?</span>
            </label>
            <p className="text-sm text-gray-600 mb-4 ml-9">
              Cada punto será representado como una burbuja en el diagrama. Elija entre 3 y 20 burbujas.
            </p>
            <input
              type="number"
              value={numeroFilas}
              onChange={(e) => setNumeroFilas(e.target.value)}
              min={3}
              max={20}
              className="w-full px-5 py-4 text-lg font-semibold border-2 border-purple-300 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
              placeholder="Entre 3 y 20"
            />
            {errores.numeroFilas && (
              <div className="mt-3 flex items-center gap-2 text-red-600">
                <span className="text-lg">⚠️</span>
                <p className="text-sm font-semibold">{errores.numeroFilas}</p>
              </div>
            )}
          </div>

          {/* Dimensiones del diagrama */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3">
              🎯 Dimensiones de su Diagrama
            </h3>

            {/* Eje X (1ra dimensión) */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <label className="block text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">↔️</span>
                <span>Eje Horizontal (X) - 1ra Dimensión</span>
              </label>
              <p className="text-sm text-gray-600 mb-4 ml-9">
                Variable que se representará en el eje horizontal. Puede ser tiempo, categorías, rangos, etc.
              </p>
              <input
                type="text"
                value={nombreX}
                onChange={(e) => setNombreX(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-blue-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
                placeholder="Ejemplo: Meses, Edad, Temperatura, Ingresos..."
              />
              {errores.nombreX && (
                <div className="mt-3 flex items-center gap-2 text-red-600">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-semibold">{errores.nombreX}</p>
                </div>
              )}
            </div>

            {/* Eje Y (2da dimensión) */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <label className="block text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">↕️</span>
                <span>Eje Vertical (Y) - 2da Dimensión</span>
              </label>
              <p className="text-sm text-gray-600 mb-4 ml-9">
                Variable que se representará en el eje vertical. Permite comparar contra el eje X.
              </p>
              <input
                type="text"
                value={nombreY}
                onChange={(e) => setNombreY(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-green-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
                placeholder="Ejemplo: Ventas, Población, Casos, Gastos..."
              />
              {errores.nombreY && (
                <div className="mt-3 flex items-center gap-2 text-red-600">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-semibold">{errores.nombreY}</p>
                </div>
              )}
            </div>

            {/* Tamaño (3ra dimensión) */}
            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
              <label className="block text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">⚫</span>
                <span>Tamaño de la Burbuja - 3ra Dimensión</span>
              </label>
              <p className="text-sm text-gray-600 mb-4 ml-9">
                Variable que determinará qué tan grande o pequeña será cada burbuja. Ideal para representar magnitudes, volúmenes o importancia.
              </p>
              <input
                type="text"
                value={nombreTamanio}
                onChange={(e) => setNombreTamanio(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-orange-300 rounded-xl focus:border-orange-600 focus:ring-4 focus:ring-orange-100 outline-none transition-all bg-white"
                placeholder="Ejemplo: Inversión, Población Total, Impacto, Riesgo..."
              />
              {errores.nombreTamanio && (
                <div className="mt-3 flex items-center gap-2 text-red-600">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-semibold">{errores.nombreTamanio}</p>
                </div>
              )}
            </div>

            {/* Color (4ta dimensión - opcional) */}
            <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
              <label className="flex items-center cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={incluirColor}
                  onChange={(e) => setIncluirColor(e.target.checked)}
                  className="w-6 h-6 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                />
                <span className="ml-4 text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  <span>Color de la Burbuja - 4ta Dimensión (Opcional)</span>
                </span>
              </label>
              <p className="text-sm text-gray-600 mb-4 ml-11">
                Active esta opción para añadir una cuarta variable categórica. Útil para clasificar burbujas por tipo, estado, región, etc.
              </p>

              {incluirColor && (
                <div className="ml-11 mt-4 space-y-3 animate-fadeIn">
                  <input
                    type="text"
                    value={nombreColor}
                    onChange={(e) => setNombreColor(e.target.value)}
                    className="w-full px-5 py-4 text-lg border-2 border-pink-300 rounded-xl focus:border-pink-600 focus:ring-4 focus:ring-pink-100 outline-none transition-all bg-white"
                    placeholder="Ejemplo: Categoría, Estado, Región, Tipo..."
                  />
                  {errores.nombreColor && (
                    <div className="flex items-center gap-2 text-red-600">
                      <span className="text-lg">⚠️</span>
                      <p className="text-sm font-semibold">{errores.nombreColor}</p>
                    </div>
                  )}
                  <div className="bg-white rounded-lg p-4 border border-pink-200">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      💡 <strong>Tip:</strong> Puede usar colores CSS directos (red, blue, #FF5733) o categorías textuales (Alto, Medio, Bajo / Activo, Inactivo). El sistema asignará colores automáticamente a las categorías.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de continuar */}
          <div className="pt-4">
            <button
              onClick={manejarEnvio}
              className="w-full px-8 py-5 text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Continuar al Ingreso de Datos →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
