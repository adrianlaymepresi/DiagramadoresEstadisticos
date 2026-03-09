'use client';

import React, { useRef, useEffect } from 'react';
import { Tarjeta } from './ui/Tarjeta';
import { Boton } from './ui/Boton';
import { Modal } from './ui/Modal';
import { DiagramaGuardado, FormatoExportacion } from '../tipos';
import { dibujarDiagrama } from '../servicios/generadorDiagrama';
import {
  exportarComoImagen,
  exportarComoPDF,
  exportarComoExcel,
  normalizarNombreArchivo,
} from '../servicios/exportador';

interface PropiedadesHistorial {
  diagramas: DiagramaGuardado[];
  alEliminar: (id: string) => void;
}

export const Historial: React.FC<PropiedadesHistorial> = ({
  diagramas,
  alEliminar,
}) => {
  const [diagramaSeleccionado, setDiagramaSeleccionado] = React.useState<DiagramaGuardado | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && diagramaSeleccionado) {
      dibujarDiagrama(
        canvasRef.current,
        diagramaSeleccionado.configuracion.datos,
        diagramaSeleccionado.configuracion.configuracionColumnas
      );
    }
  }, [diagramaSeleccionado]);

  const manejarExportacion = async (
    diagrama: DiagramaGuardado,
    formato: FormatoExportacion
  ) => {
    if (!canvasRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    
    dibujarDiagrama(
      canvas,
      diagrama.configuracion.datos,
      diagrama.configuracion.configuracionColumnas
    );

    const nombreArchivo = normalizarNombreArchivo(
      diagrama.configuracion.configuracionColumnas.nombreTamanio
    );

    try {
      switch (formato) {
        case 'imagen':
          await exportarComoImagen(canvas, nombreArchivo);
          break;
        case 'pdf':
          await exportarComoPDF(canvas, nombreArchivo, diagrama.configuracion);
          break;
        case 'excel':
          await exportarComoExcel(diagrama.configuracion, nombreArchivo, canvas);
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el diagrama');
    }
  };

  const formatearFecha = (fecha: Date): string => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Tarjeta titulo="Historial de Diagramas">
        {diagramas.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-7xl mb-6 animate-bounce">📊</div>
            <p className="text-gray-500 text-xl font-semibold">No hay diagramas guardados</p>
            <p className="text-gray-400 text-sm mt-3">
              Los diagramas que guarde aparecerán aquí para acceso rápido
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {diagramas.map((diagrama) => (
              <div
                key={diagrama.id}
                className="bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">📈</span>
                      {diagrama.configuracion.configuracionColumnas.nombreTamanio}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span>🕐</span>
                        {formatearFecha(diagrama.fechaCreacion)}
                      </p>
                      <p className="text-sm text-purple-600 font-semibold flex items-center gap-2">
                        <span>📊</span>
                        {diagrama.configuracion.numeroFilas} puntos de datos
                      </p>
                    </div>
                  </div>
                  <Boton
                    onClick={() => alEliminar(diagrama.id)}
                    variante="outline"
                  >
                    🗑️
                  </Boton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Boton
                    onClick={() => setDiagramaSeleccionado(diagrama)}
                    variante="primario"
                  >
                    👁️ Ver
                  </Boton>
                  <Boton
                    onClick={() => manejarExportacion(diagrama, 'imagen')}
                    variante="secundario"
                  >
                    📥 PNG
                  </Boton>
                  <Boton
                    onClick={() => manejarExportacion(diagrama, 'pdf')}
                    variante="secundario"
                  >
                    📄 PDF
                  </Boton>
                  <Boton
                    onClick={() => manejarExportacion(diagrama, 'excel')}
                    variante="secundario"
                  >
                    📊 Excel
                  </Boton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Tarjeta>

      <Modal
        abierto={!!diagramaSeleccionado}
        alCerrar={() => setDiagramaSeleccionado(null)}
        titulo={diagramaSeleccionado?.configuracion.configuracionColumnas.nombreTamanio}
      >
        <div className="bg-gray-100 p-4 rounded-xl">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-auto border-4 border-white rounded-lg shadow-xl"
          />
        </div>
      </Modal>
    </>
  );
};
