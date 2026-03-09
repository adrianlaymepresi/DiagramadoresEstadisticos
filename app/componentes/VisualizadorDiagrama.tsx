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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">📊 Diagrama de Burbujas Generado</h2>
          <p className="text-purple-100 text-base">
            Interactúe con el diagrama, expórtelo o cree uno nuevo con datos diferentes
          </p>
        </div>

        {/* Canvas Container */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div 
            ref={contenedorRef}
            className="bg-white rounded-2xl border-2 border-gray-300 shadow-xl p-6 relative overflow-hidden"
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
                className="fixed z-50 bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-3 rounded-xl shadow-2xl text-sm pointer-events-none border border-gray-700"
                style={{
                  left: tooltip.x + 15,
                  top: tooltip.y - 10,
                  transform: 'translateY(-100%)',
                }}
              >
                <div className="font-bold text-purple-300 mb-2 text-base">
                  {configuracion.configuracionColumnas.nombreTamanio}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">{configuracion.configuracionColumnas.nombreX}:</span>
                    <span className="font-semibold">{tooltip.valorX.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">{configuracion.configuracionColumnas.nombreY}:</span>
                    <span className="font-semibold">{tooltip.valorY.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Tamaño:</span>
                    <span className="font-semibold text-purple-300">{tooltip.valorTamanio.toFixed(2)}</span>
                  </div>
                  {tooltip.valorColor && configuracion.configuracionColumnas.nombreColor && (
                    <div className="flex justify-between gap-4 pt-1 border-t border-gray-700">
                      <span className="text-gray-400">{configuracion.configuracionColumnas.nombreColor}:</span>
                      <span className="font-semibold text-green-300">{tooltip.valorColor}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hint de interacción */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              💡 <strong>Pase el cursor sobre las burbujas</strong> para ver información detallada de cada punto
            </p>
          </div>
        </div>

        {/* Acciones de exportación */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📤 Exportar Diagrama</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => manejarExportacion('imagen')}
              className="flex items-center justify-center gap-3 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-2xl">🖼️</span>
              <div className="text-left">
                <div>Imagen PNG</div>
                <div className="text-xs text-blue-100">Alta calidad</div>
              </div>
            </button>
            <button
              onClick={() => manejarExportacion('pdf')}
              className="flex items-center justify-center gap-3 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-2xl">📄</span>
              <div className="text-left">
                <div>Documento PDF</div>
                <div className="text-xs text-red-100">Para reportes</div>
              </div>
            </button>
            <button
              onClick={() => manejarExportacion('excel')}
              className="flex items-center justify-center gap-3 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <div>Hoja Excel</div>
                <div className="text-xs text-green-100">Con datos</div>
              </div>
            </button>
          </div>
        </div>

        {/* Acción principal */}
        <div className="px-8 pb-8">
          <button
            onClick={alNuevoDiagrama}
            className="w-full px-8 py-5 text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            ← Crear Nuevo Diagrama desde el Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
