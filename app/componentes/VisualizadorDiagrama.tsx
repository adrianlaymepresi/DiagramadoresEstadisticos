'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ConfiguracionDiagrama, FormatoExportacion } from '../tipos';
import { dibujarDiagrama, calcularDatosBurbujas } from '../servicios/generadorDiagrama';
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

interface InfoTooltip {
  visible: boolean;
  x: number;
  y: number;
  valorX: number;
  valorY: number;
  valorTamanio: number;
  valorColor?: string;
}

export const VisualizadorDiagrama: React.FC<PropiedadesVisualizadorDiagrama> = ({
  configuracion,
  alNuevoDiagrama,
  alGuardar,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [dimensionesCanvas, setDimensionesCanvas] = useState({ ancho: 1200, alto: 750 });
  const [tooltip, setTooltip] = useState<InfoTooltip>({ visible: false, x: 0, y: 0, valorX: 0, valorY: 0, valorTamanio: 0 });

  useEffect(() => {
    const actualizarDimensiones = () => {
      if (contenedorRef.current) {
        const ancho = contenedorRef.current.offsetWidth - 32;
        const alto = ancho * 0.625; // Proporción 16:10
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

  const manejarMovimientoMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const margen = 90;
    const burbujas = calcularDatosBurbujas(
      configuracion.datos,
      dimensionesCanvas.ancho,
      dimensionesCanvas.alto,
      margen
    );

    // Encontrar burbuja bajo el cursor
    const burbajaDetectada = burbujas.find((burbuja) => {
      const distancia = Math.sqrt(
        Math.pow(mouseX - burbuja.x, 2) + Math.pow(mouseY - burbuja.y, 2)
      );
      return distancia <= burbuja.radio;
    });

    if (burbajaDetectada) {
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        valorX: burbajaDetectada.valorX,
        valorY: burbajaDetectada.valorY,
        valorTamanio: burbajaDetectada.valorTamanio,
        valorColor: burbajaDetectada.valorColor,
      });
    } else {
      setTooltip({ ...tooltip, visible: false });
    }
  };

  const manejarSalidaMouse = () => {
    setTooltip({ ...tooltip, visible: false });
  };

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
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Diagrama de Burbujas</h2>
          <p className="text-gray-600 text-sm">
            Pase el cursor sobre las burbujas para ver información detallada
          </p>
        </div>

        <div 
          ref={contenedorRef}
          className="bg-gray-50 rounded-xl border-2 border-gray-200 p-4 mb-6 relative"
          style={{ position: 'relative' }}
        >
          <canvas
            ref={canvasRef}
            onMouseMove={manejarMovimientoMouse}
            onMouseLeave={manejarSalidaMouse}
            className="w-full h-auto cursor-crosshair"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          
          {/* Tooltip flotante */}
          {tooltip.visible && (
            <div
              className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs pointer-events-none"
              style={{
                left: tooltip.x + 15,
                top: tooltip.y - 10,
                transform: 'translateY(-100%)',
              }}
            >
              <div className="font-semibold mb-1">{configuracion.configuracionColumnas.nombreTamanio}</div>
              <div><strong>{configuracion.configuracionColumnas.nombreX}:</strong> {tooltip.valorX.toFixed(2)}</div>
              <div><strong>{configuracion.configuracionColumnas.nombreY}:</strong> {tooltip.valorY.toFixed(2)}</div>
              <div><strong>Tamaño:</strong> {tooltip.valorTamanio.toFixed(2)}</div>
              {tooltip.valorColor && configuracion.configuracionColumnas.nombreColor && (
                <div><strong>{configuracion.configuracionColumnas.nombreColor}:</strong> {tooltip.valorColor}</div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => manejarExportacion('imagen')}
            className="px-4 py-3 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow"
          >
            📥 PNG
          </button>
          <button
            onClick={() => manejarExportacion('pdf')}
            className="px-4 py-3 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow"
          >
            📄 PDF
          </button>
          <button
            onClick={() => manejarExportacion('excel')}
            className="px-4 py-3 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow"
          >
            📊 Excel
          </button>
          <button
            onClick={manejarGuardar}
            className="px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors duration-200 shadow-sm hover:shadow"
          >
            💾 Guardar
          </button>
        </div>

        <button
          onClick={alNuevoDiagrama}
          className="w-full px-6 py-3 text-base font-semibold text-purple-600 bg-white border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
        >
          ← Crear Nuevo Diagrama
        </button>
      </div>
    </div>
  );
};
