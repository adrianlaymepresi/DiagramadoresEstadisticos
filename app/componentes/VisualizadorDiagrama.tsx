'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [dimensionesCanvas, setDimensionesCanvas] = useState({ ancho: 1200, alto: 800 });

  useEffect(() => {
    const actualizarDimensiones = () => {
      if (contenedorRef.current) {
        const ancho = contenedorRef.current.offsetWidth - 40;
        const alto = ancho * 0.6;
        setDimensionesCanvas({ ancho, alto });
      }
    };

    actualizarDimensiones();
    window.addEventListener('resize', actualizarDimensiones);
    return () => window.removeEventListener('resize', actualizarDimensiones);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = dimensionesCanvas.ancho;
      canvas.height = dimensionesCanvas.alto;
      dibujarDiagrama(canvas, configuracion.datos, configuracion.configuracionColumnas);
    }
  }, [configuracion, dimensionesCanvas]);

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
          await exportarComoExcel(configuracion, nombreArchivo, canvasRef.current);
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el diagrama');
    }
  };

  const manejarGuardar = () => {
    alGuardar(configuracion);
    alert('✅ Diagrama guardado en el historial');
  };

  return (
    <Tarjeta titulo="Diagrama de Burbujas Generado">
      <div className="space-y-8">
        <div 
          ref={contenedorRef}
          className="bg-white rounded-2xl border-4 border-gray-200 p-6 shadow-inner overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Boton
            onClick={() => manejarExportacion('imagen')}
            variante="secundario"
            ancho="completo"
            className="text-lg px-6 py-4"
          >
            📥 PNG
          </Boton>
          <Boton
            onClick={() => manejarExportacion('pdf')}
            variante="secundario"
            ancho="completo"
            className="text-lg px-6 py-4"
          >
            📄 PDF
          </Boton>
          <Boton
            onClick={() => manejarExportacion('excel')}
            variante="secundario"
            ancho="completo"
            className="text-lg px-6 py-4"
          >
            📊 Excel
          </Boton>
          <Boton
            onClick={manejarGuardar}
            variante="primario"
            ancho="completo"
            className="text-lg px-6 py-4"
          >
            💾 Guardar
          </Boton>
        </div>

        <Boton onClick={alNuevoDiagrama} variante="outline" ancho="completo" className="text-lg px-8 py-4">
          ← Crear Nuevo Diagrama
        </Boton>
      </div>
    </Tarjeta>
  );
};
