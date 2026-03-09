'use client';

import { useState } from 'react';
import { ConfiguracionInicial } from './componentes/ConfiguracionInicial';
import { EditorTabla } from './componentes/EditorTabla';
import { VisualizadorDiagrama } from './componentes/VisualizadorDiagrama';
import { ConfiguracionDiagrama, ConfiguracionColumnas, FilaDatos } from './tipos';

type EtapaAplicacion = 'configuracion' | 'edicion' | 'visualizacion';

// Componente de Breadcrumb Simplificado
interface EtapaInfo {
  id: EtapaAplicacion;
  titulo: string;
  icono: string;
}

const etapas: EtapaInfo[] = [
  { id: 'configuracion', titulo: 'Configuración', icono: '⚙️' },
  { id: 'edicion', titulo: 'Ingreso de Datos', icono: '📝' },
  { id: 'visualizacion', titulo: 'Visualización', icono: '📊' },
];

function BreadcrumbEtapas({ etapaActual }: { etapaActual: EtapaAplicacion }) {
  const indiceActual = etapas.findIndex(e => e.id === etapaActual);

  return (
    <nav className="flex items-center justify-center gap-3 mb-16" aria-label="Progreso">
      {etapas.map((etapa, idx) => {
        const activa = idx === indiceActual;
        const completada = idx < indiceActual;
        
        return (
          <div key={etapa.id} className="flex items-center">
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
              ${activa 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : completada 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-500'
              }
            `}>
              <span className="text-lg">{etapa.icono}</span>
              <span className="font-semibold text-sm">{etapa.titulo}</span>
              {completada && <span className="ml-1">✓</span>}
            </div>
            {idx < etapas.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${completada ? 'bg-purple-600' : 'bg-gray-300'}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function PaginaPrincipal() {
  const [etapaActual, setEtapaActual] = useState<EtapaAplicacion>('configuracion');
  const [configuracionActual, setConfiguracionActual] = useState<ConfiguracionDiagrama | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Profesional y Contenido */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Generador de Diagramas de Burbujas
              </h1>
              <p className="text-base text-gray-600">
                Visualización avanzada con hasta 4 dimensiones de datos
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                Herramienta Profesional
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenedor Principal con Más Espacio */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb Simplificado */}
        <BreadcrumbEtapas etapaActual={etapaActual} />

        {/* Contenido de las Etapas */}
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
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
