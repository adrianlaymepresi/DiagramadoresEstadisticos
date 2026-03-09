'use client';

import { useState } from 'react';
import { ConfiguracionInicial } from './componentes/ConfiguracionInicial';
import { EditorTabla } from './componentes/EditorTabla';
import { VisualizadorDiagrama } from './componentes/VisualizadorDiagrama';
import { Historial } from './componentes/Historial';
import { ConfiguracionDiagrama, ConfiguracionColumnas, FilaDatos, DiagramaGuardado } from './tipos';

type EtapaAplicacion = 'configuracion' | 'edicion' | 'visualizacion';

export default function PaginaPrincipal() {
  const [etapaActual, setEtapaActual] = useState<EtapaAplicacion>('configuracion');
  const [configuracionActual, setConfiguracionActual] = useState<ConfiguracionDiagrama | null>(null);
  const [diagramasGuardados, setDiagramasGuardados] = useState<DiagramaGuardado[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState<boolean>(false);

  const manejarConfiguracionInicial = (
    numeroFilas: number,
    columnas: ConfiguracionColumnas
  ) => {
    setConfiguracionActual({
      numeroFilas,
      configuracionColumnas: columnas,
      datos: [],
    });
    setEtapaActual('edicion');
  };

  const manejarVolverConfiguracion = () => {
    setEtapaActual('configuracion');
    setConfiguracionActual(null);
  };

  const manejarConfirmarDatos = (datos: FilaDatos[]) => {
    if (!configuracionActual) return;

    setConfiguracionActual({
      ...configuracionActual,
      datos,
    });
    setEtapaActual('visualizacion');
  };

  const manejarNuevoDiagrama = () => {
    setEtapaActual('configuracion');
    setConfiguracionActual(null);
  };

  const manejarGuardarDiagrama = (configuracion: ConfiguracionDiagrama) => {
    const nuevoDiagrama: DiagramaGuardado = {
      id: Date.now().toString(),
      fechaCreacion: new Date(),
      configuracion,
    };

    setDiagramasGuardados([...diagramasGuardados, nuevoDiagrama]);
  };

  const manejarEliminarDiagrama = (id: string) => {
    setDiagramasGuardados(diagramasGuardados.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen py-8 px-6 sm:py-12 lg:py-16">
      <div className="w-full max-w-[1800px] mx-auto">
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mb-4 animate-gradient">
            Generador de Diagramas de Burbujas
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl mx-auto">
            Cree y visualice diagramas de burbujas profesionales de manera intuitiva
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sistema en línea
          </div>
        </header>

        <div className="mb-10 lg:mb-12 flex justify-center">
          <button
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
          >
            <span className="flex items-center gap-2">
              {mostrarHistorial ? '📊 Ocultar Historial' : `📚 Ver Historial (${diagramasGuardados.length})`}
            </span>
          </button>
        </div>

        {mostrarHistorial && (
          <div className="mb-12 lg:mb-16 animate-fadeIn">
            <Historial
              diagramas={diagramasGuardados}
              alEliminar={manejarEliminarDiagrama}
            />
          </div>
        )}

        <div className="w-full">
          {etapaActual === 'configuracion' && (
            <div className="w-full max-w-5xl mx-auto px-4 animate-fadeIn">
              <ConfiguracionInicial
                alConfirmar={manejarConfiguracionInicial}
              />
            </div>
          )}

          {etapaActual === 'edicion' && configuracionActual && (
            <div className="w-full px-4 animate-fadeIn">
              <EditorTabla
                numeroFilas={configuracionActual.numeroFilas}
                columnas={configuracionActual.configuracionColumnas}
                alConfirmar={manejarConfirmarDatos}
                alVolver={manejarVolverConfiguracion}
              />
            </div>
          )}

          {etapaActual === 'visualizacion' && configuracionActual && (
            <div className="w-full px-4 animate-fadeIn">
              <VisualizadorDiagrama
                configuracion={configuracionActual}
                alNuevoDiagrama={manejarNuevoDiagrama}
                alGuardar={manejarGuardarDiagrama}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
