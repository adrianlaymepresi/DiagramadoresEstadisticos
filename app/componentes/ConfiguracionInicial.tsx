'use client';

import React, { useState } from 'react';
import { Tarjeta } from './ui/Tarjeta';
import { Entrada } from './ui/Entrada';
import { Boton } from './ui/Boton';
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
    <Tarjeta titulo="Configuración del Diagrama">
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📊</span>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1">
              Configure los parámetros iniciales para crear su diagrama de burbujas.
              Podrá ingresar entre <span className="font-bold text-purple-600">3 y 20</span> puntos de datos.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 space-y-6">
          <Entrada
            valor={numeroFilas}
            onChange={setNumeroFilas}
            tipo="number"
            etiqueta="Número de Filas"
            placeholder="Ingrese entre 3 y 20"
            error={errores.numeroFilas}
            requerido
            min={3}
            max={20}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
            <Entrada
              valor={nombreX}
              onChange={setNombreX}
              tipo="text"
              etiqueta="Nombre del Eje X"
              placeholder="Ej: Periodo en Meses"
              error={errores.nombreX}
              requerido
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
            <Entrada
              valor={nombreY}
              onChange={setNombreY}
              tipo="text"
              etiqueta="Nombre del Eje Y"
              placeholder="Ej: Número de Casos"
              error={errores.nombreY}
              requerido
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
          <Entrada
            valor={nombreTamanio}
            onChange={setNombreTamanio}
            tipo="text"
            etiqueta="Nombre del Tamaño de Burbuja (Título del Diagrama)"
            placeholder="Ej: TBC"
            error={errores.nombreTamanio}
            requerido
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="incluirColor"
              checked={incluirColor}
              onChange={(e) => setIncluirColor(e.target.checked)}
              className="w-7 h-7 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="incluirColor" className="text-gray-700 font-semibold cursor-pointer flex-1 text-base md:text-lg">
              Incluir columna de color personalizado
            </label>
          </div>

          {incluirColor && (
            <div className="mt-6 pl-11">
              <Entrada
                valor={nombreColor}
                onChange={setNombreColor}
                tipo="text"
                etiqueta="Nombre de la Columna de Color"
                placeholder="Ej: Color"
                error={errores.nombreColor}
                requerido
              />
            </div>
          )}
        </div>

        <Boton onClick={manejarEnvio} variante="primario" ancho="completo" className="text-lg px-8 py-4">
          Continuar →
        </Boton>
      </div>
    </Tarjeta>
  );
};
