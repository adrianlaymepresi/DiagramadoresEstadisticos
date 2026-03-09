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
  const [numeroFilas, setNumeroFilas] = useState<string>('3');
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
      nuevosErrores.numeroFilas = 'Debe estar entre 3 y 20';
    }

    if (!validarNombreColumna(nombreX)) {
      nuevosErrores.nombreX = 'Campo requerido';
    }

    if (!validarNombreColumna(nombreY)) {
      nuevosErrores.nombreY = 'Campo requerido';
    }

    if (!validarNombreColumna(nombreTamanio)) {
      nuevosErrores.nombreTamanio = 'Campo requerido';
    }

    if (incluirColor && !validarNombreColumna(nombreColor)) {
      nuevosErrores.nombreColor = 'Campo requerido cuando color está activado';
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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración del Diagrama</h2>
          <p className="text-gray-600 text-sm">
            Defina los parámetros básicos. Puede ingresar entre <strong className="text-purple-600">3 y 20</strong> puntos de datos.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Filas (Burbujas) *
            </label>
            <input
              type="number"
              value={numeroFilas}
              onChange={(e) => setNumeroFilas(e.target.value)}
              min={3}
              max={20}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              placeholder="Ingrese entre 3 y 20"
            />
            {errores.numeroFilas && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errores.numeroFilas}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Eje X *
              </label>
              <input
                type="text"
                value={nombreX}
                onChange={(e) => setNombreX(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                placeholder="Ej: Periodo en Meses"
              />
              {errores.nombreX && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errores.nombreX}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Eje Y *
              </label>
              <input
                type="text"
                value={nombreY}
                onChange={(e) => setNombreY(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                placeholder="Ej: Número de Casos"
              />
              {errores.nombreY && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errores.nombreY}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Variable de Tamaño *
            </label>
            <input
              type="text"
              value={nombreTamanio}
              onChange={(e) => setNombreTamanio(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              placeholder="Ej: Volumen de Inversión"
            />
            {errores.nombreTamanio && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errores.nombreTamanio}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incluirColor}
                onChange={(e) => setIncluirColor(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700">
                Incluir columna de color personalizada (4ta dimensión)
              </span>
            </label>

            {incluirColor && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Columna de Color *
                </label>
                <input
                  type="text"
                  value={nombreColor}
                  onChange={(e) => setNombreColor(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  placeholder="Ej: Estado, Categoría, Tendencia"
                />
                {errores.nombreColor && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errores.nombreColor}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Puede ingresar colores CSS (red, #ff0000) o categorías (sube, baja, alto, medio, bajo)
                </p>
              </div>
            )}
          </div>

          <button
            onClick={manejarEnvio}
            className="w-full px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors duration-200 shadow-md"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};
