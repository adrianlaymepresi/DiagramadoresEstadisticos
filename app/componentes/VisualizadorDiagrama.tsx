'use client';

import React, { useRef, useEffect } from 'react';
import { Tarjeta } from './ui/Tarjeta';
import { Boton } from './ui/Boton';
import { ConfiguracionDiagrama, FormatoExportacion } from '../tipos';
import { dibujarDiagrama } from '../servicios/generadorDiagrama';
import {
  exportarComoImagen,
  exportarComoPDF,
  exportarComoExcel,
  normalizarNombreArchivo,
} from '../servicios/exportador';

interface PropiedadesVisualizadorDiagrama {
  configuracion: ConfiguracionDiagrama;
  alNuevoDiagrama: () => void;
  alGuardar: (configuracion: ConfiguracionDiagrama) => void;
}

export const VisualizadorDiagrama: React.FC<PropiedadesVisualizadorDiagrama> = ({
  configuracion,
  alNuevoDiagrama,
  alGuardar,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      dibujarDiagrama(
        canvasRef.current,
        configuracion.datos,
        configuracion.configuracionColumnas
      );
    }
  }, [configuracion]);

  const manejarExportacion = async (formato: FormatoExportacion) => {
    if (!canvasRef.current) return;

    const nombreArchivo = normalizarNombreArchivo(
      configuracion.configuracionColumnas.nombreTamanio
    );

    try {
      switch (formato) {
        case 'imagen':
          await exportarComoImagen(canvasRef.current, nombreArchivo);
          break;
        case 'pdf':
          await exportarComoPDF(canvasRef.current, nombreArchivo, configuracion);
          break;
        case 'excel':
          await exportarComoExcel(configuracion, nombreArchivo);
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el diagrama');
    }
  };

  const manejarGuardar = () => {
    alGuardar(configuracion);
    alert('Diagrama guardado en el historial');
  };

  return (
    <Tarjeta titulo="Diagrama de Burbujas Generado">
      <div className="space-y-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-inner">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Boton
            onClick={() => manejarExportacion('imagen')}
            variante="secundario"
            ancho="completo"
          >
            Descargar PNG
          </Boton>
          <Boton
            onClick={() => manejarExportacion('pdf')}
            variante="secundario"
            ancho="completo"
          >
            Descargar PDF
          </Boton>
          <Boton
            onClick={() => manejarExportacion('excel')}
            variante="secundario"
            ancho="completo"
          >
            Descargar Excel
          </Boton>
          <Boton
            onClick={manejarGuardar}
            variante="primario"
            ancho="completo"
          >
            Guardar
          </Boton>
        </div>

        <Boton onClick={alNuevoDiagrama} variante="outline" ancho="completo">
          Crear Nuevo Diagrama
        </Boton>
      </div>
    </Tarjeta>
  );
};
