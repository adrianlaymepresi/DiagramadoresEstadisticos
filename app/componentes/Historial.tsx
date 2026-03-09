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

    const nombreArchivo = normalizarNombreArchivo(
      diagrama.configuracion.configuracionColumnas.nombreTamanio
    );

    try {
      switch (formato) {
        case 'imagen':
          await exportarComoImagen(canvasRef.current, nombreArchivo);
          break;
        case 'pdf':
          await exportarComoPDF(canvasRef.current, nombreArchivo, diagrama.configuracion);
          break;
        case 'excel':
          await exportarComoExcel(diagrama.configuracion, nombreArchivo);
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">No hay diagramas guardados</p>
            <p className="text-gray-400 text-sm mt-2">
              Los diagramas que guarde aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {diagramas.map((diagrama) => (
              <div
                key={diagrama.id}
                className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {diagrama.configuracion.configuracionColumnas.nombreTamanio}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatearFecha(diagrama.fechaCreacion)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {diagrama.configuracion.numeroFilas} puntos de datos
                    </p>
                  </div>
                  <Boton
                    onClick={() => alEliminar(diagrama.id)}
                    variante="outline"
                  >
                    Eliminar
                  </Boton>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Boton
                    onClick={() => setDiagramaSeleccionado(diagrama)}
                    variante="primario"
                  >
                    Ver Diagrama
                  </Boton>
                  <Boton
                    onClick={() => {
                      setDiagramaSeleccionado(diagrama);
                      setTimeout(() => manejarExportacion(diagrama, 'imagen'), 100);
                    }}
                    variante="secundario"
                  >
                    PNG
                  </Boton>
                  <Boton
                    onClick={() => {
                      setDiagramaSeleccionado(diagrama);
                      setTimeout(() => manejarExportacion(diagrama, 'pdf'), 100);
                    }}
                    variante="secundario"
                  >
                    PDF
                  </Boton>
                  <Boton
                    onClick={() => manejarExportacion(diagrama, 'excel')}
                    variante="secundario"
                  >
                    Excel
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
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto border-2 border-gray-200 rounded"
        />
      </Modal>
    </>
  );
};
