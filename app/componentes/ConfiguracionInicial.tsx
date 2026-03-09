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
    <Tarjeta titulo="Configuración del Diagrama de Burbujas">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed">
            Configure los parámetros iniciales para crear su diagrama de burbujas.
            Podrá ingresar entre 3 y 20 puntos de datos.
          </p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Entrada
            valor={nombreX}
            onChange={setNombreX}
            tipo="text"
            etiqueta="Nombre del Eje X"
            placeholder="Ej: Periodo en Meses"
            error={errores.nombreX}
            requerido
          />

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

        <Entrada
          valor={nombreTamanio}
          onChange={setNombreTamanio}
          tipo="text"
          etiqueta="Nombre del Tamaño de Burbuja"
          placeholder="Ej: TBC"
          error={errores.nombreTamanio}
          requerido
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="incluirColor"
            checked={incluirColor}
            onChange={(e) => setIncluirColor(e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
          <label htmlFor="incluirColor" className="text-gray-700 font-medium">
            Incluir columna de color personalizado
          </label>
        </div>

        {incluirColor && (
          <Entrada
            valor={nombreColor}
            onChange={setNombreColor}
            tipo="text"
            etiqueta="Nombre de la Columna de Color"
            placeholder="Ej: Color"
            error={errores.nombreColor}
            requerido
          />
        )}

        <Boton onClick={manejarEnvio} variante="primario" ancho="completo">
          Continuar
        </Boton>
      </div>
    </Tarjeta>
  );
};
