'use client';

import { useState } from 'react';
import { ConfiguracionInicial } from './componentes/ConfiguracionInicial';
import { EditorTabla } from './componentes/EditorTabla';
import { VisualizadorDiagrama } from './componentes/VisualizadorDiagrama';
import { ConfiguracionDiagrama, ConfiguracionColumnas, FilaDatos } from './tipos';

type EtapaAplicacion = 'configuracion' | 'edicion' | 'visualizacion';

// Componente de Indicador de Progreso
interface EtapaInfo {
  numero: number;
  titulo: string;
  descripcion: string;
  icono: string;
}

const etapas: EtapaInfo[] = [
  { numero: 1, titulo: 'Configuración', descripcion: 'Defina las columnas', icono: '⚙️' },
  { numero: 2, titulo: 'Datos', descripcion: 'Ingrese valores', icono: '📝' },
  { numero: 3, titulo: 'Visualización', descripcion: 'Vea el diagrama', icono: '📊' },
];

function IndicadorProgreso({ etapaActual }: { etapaActual: EtapaAplicacion }) {
  const etapaNumero = 
    etapaActual === 'configuracion' ? 1 : 
    etapaActual === 'edicion' ? 2 : 3;

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {etapas.map((etapa, idx) => (
          <div key={etapa.numero} className="flex items-center flex-1">
            {/* Círculo de etapa */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-2xl
                  transition-all duration-300 shadow-lg
                  ${etapaNumero >= etapa.numero
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 scale-110'
                    : 'bg-white border-2 border-gray-300 scale-100'
                  }
                `}
              >
                {etapaNumero > etapa.numero ? (
                  <span className="text-white font-bold">✓</span>
                ) : (
                  <span className={etapaNumero === etapa.numero ? 'text-white' : 'text-gray-400'}>
                    {etapa.icono}
                  </span>
                )}
              </div>
              
              <div className="mt-3 text-center">
                <p className={`font-bold text-sm ${etapaNumero === etapa.numero ? 'text-purple-700' : 'text-gray-600'}`}>
                  {etapa.titulo}
                </p>
                <p className="text-xs text-gray-500 mt-1">{etapa.descripcion}</p>
              </div>
            </div>

            {/* Línea conectora */}
            {idx < etapas.length - 1 && (
              <div className="flex-1 h-1 mx-3 mb-10">
                <div className="h-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ${
                      etapaNumero > etapa.numero ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-10 px-4 sm:py-16">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mb-4 tracking-tight">
            Generador de Diagramas de Burbujas
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl mx-auto max-w-3xl leading-relaxed">
            Herramienta profesional para crear diagramas de burbujas interactivos con hasta 4 dimensiones de datos
          </p>
        </header>

        {/* Indicador de Progreso */}
        <IndicadorProgreso etapaActual={etapaActual} />

        {/* Contenido */}
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
      </div>
    </div>
  );
}
