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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-6 px-4 sm:py-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mb-3">
            Generador de Diagramas de Burbujas
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mx-auto max-w-2xl">
            Cree y visualice diagramas de burbujas profesionales de manera intuitiva
          </p>
        </header>

        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg text-base"
          >
            <span className="flex items-center gap-2">
              {mostrarHistorial ? '📊 Ocultar Historial' : `📚 Ver Historial (${diagramasGuardados.length})`}
            </span>
          </button>
        </div>

        {mostrarHistorial && (
          <div className="mb-8 animate-fadeIn">
            <Historial
              diagramas={diagramasGuardados}
              alEliminar={manejarEliminarDiagrama}
            />
          </div>
        )}

        <div className="w-full">
          {etapaActual === 'configuracion' && (
            <div className="animate-fadeIn">
              <ConfiguracionInicial
                alConfirmar={manejarConfiguracionInicial}
              />
            </div>
          )}

          {etapaActual === 'edicion' && configuracionActual && (
            <div className="animate-fadeIn">
              <EditorTabla
                numeroFilas={configuracionActual.numeroFilas}
                columnas={configuracionActual.configuracionColumnas}
                alConfirmar={manejarConfirmarDatos}
                alVolver={manejarVolverConfiguracion}
              />
            </div>
          )}

          {etapaActual === 'visualizacion' && configuracionActual && (
            <div className="animate-fadeIn">
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
