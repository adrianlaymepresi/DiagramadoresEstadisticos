'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  ConfiguracionDiagrama, 
  FormatoExportacion, 
  OpcionesVisualizacion,
  OPCIONES_VISUALIZACION_DEFAULT 
} from '../tipos';
import { dibujarDiagrama, calcularDatosBurbujas } from '../servicios/generadorDiagrama';
import {
  exportarComoImagen,
  exportarComoPDF,
  exportarComoExcel,
  normalizarNombreArchivo,
} from '../servicios/exportador';
import { PanelPersonalizacion } from './PanelPersonalizacion';

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
  const [dimensionesCanvas, setDimensionesCanvas] = useState({ ancho: 900, alto: 600 });
  const [tooltip, setTooltip] = useState<InfoTooltip>({ visible: false, x: 0, y: 0, valorX: 0, valorY: 0, valorTamanio: 0 });
  const [opciones, setOpciones] = useState<OpcionesVisualizacion>(OPCIONES_VISUALIZACION_DEFAULT);
  const [panelAbierto, setPanelAbierto] = useState<boolean>(true);

  const tieneColor = !!configuracion.configuracionColumnas.nombreColor;

  useEffect(() => {
    const actualizarDimensiones = () => {
      if (contenedorRef.current) {
        const ancho = contenedorRef.current.offsetWidth - 32;
        const alto = ancho * 0.65; // Proporción más cuadrada
        setDimensionesCanvas({ ancho: Math.max(600, ancho), alto: Math.max(400, alto) });
      }
    };

    actualizarDimensiones();
    window.addEventListener('resize', actualizarDimensiones);
    return () => window.removeEventListener('resize', actualizarDimensiones);
  }, [panelAbierto]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = dimensionesCanvas.ancho;
      canvas.height = dimensionesCanvas.alto;
      dibujarDiagrama(canvas, configuracion.datos, configuracion.configuracionColumnas, opciones);
    }
  }, [configuracion, dimensionesCanvas, opciones]);

  const manejarMovimientoMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !opciones.tooltip.mostrar) return;

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

  const formatearNumeroTooltip = (valor: number): string => {
    if (opciones.tooltip.formatoNumeros === 'compacto') {
      const abs = Math.abs(valor);
      if (abs >= 1000000) return (valor / 1000000).toFixed(1) + 'M';
      if (abs >= 1000) return (valor / 1000).toFixed(1) + 'K';
    }
    return valor.toFixed(2);
  };

  return (
    <div className="w-full">
      {/* Header con Toggle del Panel */}
      <div className="bg-white rounded-t-2xl shadow-lg border border-gray-200 border-b-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">📊 Diagrama de Burbujas</h2>
            <p className="text-purple-100 text-sm">
              Personalice la visualización usando el panel de opciones
            </p>
          </div>
          <button
            onClick={() => setPanelAbierto(!panelAbierto)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold text-sm"
          >
            {panelAbierto ? '← Ocultar Panel' : 'Mostrar Panel →'}
          </button>
        </div>
      </div>

      {/* Layout: Canvas + Panel Lateral */}
      <div className="bg-white rounded-b-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Área del Canvas */}
          <div className={`flex-1 transition-all duration-300 ${panelAbierto ? '' : 'w-full'}`}>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <div 
                ref={contenedorRef}
                className="bg-white rounded-xl border-2 border-gray-300 shadow-xl p-4 relative overflow-hidden"
              >
                <canvas
                  ref={canvasRef}
                  onMouseMove={manejarMovimientoMouse}
                  onMouseLeave={manejarSalidaMouse}
                  className="w-full h-auto cursor-crosshair"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                {/* Tooltip flotante */}
                {tooltip.visible && opciones.tooltip.mostrar && (
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
                        <span className="font-semibold">{formatearNumeroTooltip(tooltip.valorX)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">{configuracion.configuracionColumnas.nombreY}:</span>
                        <span className="font-semibold">{formatearNumeroTooltip(tooltip.valorY)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Tamaño:</span>
                        <span className="font-semibold text-purple-300">{formatearNumeroTooltip(tooltip.valorTamanio)}</span>
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
              {opciones.tooltip.mostrar && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-600">
                    💡 Pase el cursor sobre las burbujas para ver información detallada
                  </p>
                </div>
              )}
            </div>

            {/* Botones de Exportación y Nuevo Diagrama */}
            <div className="px-6 pb-6 bg-white">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => manejarExportacion('imagen')}
                  className="flex flex-col items-center gap-2 px-4 py-3 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <span className="text-xl">🖼️</span>
                  <span>Imagen PNG</span>
                </button>
                <button
                  onClick={() => manejarExportacion('pdf')}
                  className="flex flex-col items-center gap-2 px-4 py-3 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                >
                  <span className="text-xl">📄</span>
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => manejarExportacion('excel')}
                  className="flex flex-col items-center gap-2 px-4 py-3 text-sm font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                >
                  <span className="text-xl">📊</span>
                  <span>Excel</span>
                </button>
              </div>

              <button
                onClick={alNuevoDiagrama}
                className="w-full px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ← Crear Nuevo Diagrama
              </button>
            </div>
          </div>

          {/* Panel de Personalización (Condicional) */}
          {panelAbierto && (
            <div className="w-80 flex-shrink-0 h-[calc(100vh-250px)] overflow-hidden">
              <PanelPersonalizacion
                opciones={opciones}
                alCambiar={setOpciones}
                mostrarOpcionColor={tieneColor}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
