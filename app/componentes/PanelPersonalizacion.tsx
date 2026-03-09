'use client';

import React, { useState } from 'react';
import { OpcionesVisualizacion, OPCIONES_VISUALIZACION_DEFAULT } from '../tipos';

interface PropiedadesPanelPersonalizacion {
  opciones: OpcionesVisualizacion;
  alCambiar: (opciones: OpcionesVisualizacion) => void;
  mostrarOpcionColor: boolean;
}

export const PanelPersonalizacion: React.FC<PropiedadesPanelPersonalizacion> = ({
  opciones,
  alCambiar,
  mostrarOpcionColor,
}) => {
  const [colapsados, setColapsados] = useState<Record<string, boolean>>({
    cuadricula: false,
    lineas: true,
    etiquetas: true,
    ejes: true,
    leyenda: true,
    burbujas: true,
    tooltip: true,
  });

  const toggleSeccion = (seccion: string) => {
    setColapsados({ ...colapsados, [seccion]: !colapsados[seccion] });
  };

  const actualizarOpciones = (seccion: keyof OpcionesVisualizacion, cambios: Partial<any>) => {
    alCambiar({
      ...opciones,
      [seccion]: { ...opciones[seccion], ...cambios },
    });
  };

  const restablecerOpciones = () => {
    alCambiar(OPCIONES_VISUALIZACION_DEFAULT);
  };

  return (
    <div className="bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header del Panel */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 z-10">
        <h3 className="text-lg font-bold text-white mb-1">⚙️ Personalización</h3>
        <p className="text-xs text-purple-100">Opciones de visualización</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Botón Restablecer */}
        <button
          onClick={restablecerOpciones}
          className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
        >
          ↺ Restablecer valores predeterminados
        </button>

        {/* Sección: Cuadrícula */}
        <SeccionAcordeon
          titulo="Cuadrícula y Fondo"
          icono="📐"
          colapsado={colapsados.cuadricula}
          onToggle={() => toggleSeccion('cuadricula')}
        >
          <div className="space-y-3">
            <Checkbox
              label="Mostrar líneas horizontales"
              checked={opciones.cuadricula.mostrarHorizontal}
              onChange={(checked) => actualizarOpciones('cuadricula', { mostrarHorizontal: checked })}
            />
            <Checkbox
              label="Mostrar líneas verticales"
              checked={opciones.cuadricula.mostrarVertical}
              onChange={(checked) => actualizarOpciones('cuadricula', { mostrarVertical: checked })}
            />
            <InputColor
              label="Color de líneas"
              value={opciones.cuadricula.color}
              onChange={(color) => actualizarOpciones('cuadricula', { color })}
            />
            <Slider
              label="Grosor de líneas"
              value={opciones.cuadricula.grosor}
              min={0.5}
              max={3}
              step={0.5}
              unidad="px"
              onChange={(grosor) => actualizarOpciones('cuadricula', { grosor })}
            />
          </div>
        </SeccionAcordeon>

        {/* Sección: Líneas de Conexión */}
        <SeccionAcordeon
          titulo="Líneas de Conexión"
          icono="🔗"
          colapsado={colapsados.lineas}
          onToggle={() => toggleSeccion('lineas')}
        >
          <div className="space-y-3">
            <Checkbox
              label="Conectar burbujas en orden"
              checked={opciones.lineasConexion.mostrar}
              onChange={(checked) => actualizarOpciones('lineasConexion', { mostrar: checked })}
            />
            {opciones.lineasConexion.mostrar && (
              <>
                <InputColor
                  label="Color de línea"
                  value={opciones.lineasConexion.color}
                  onChange={(color) => actualizarOpciones('lineasConexion', { color })}
                />
                <Slider
                  label="Grosor"
                  value={opciones.lineasConexion.grosor}
                  min={1}
                  max={5}
                  step={1}
                  unidad="px"
                  onChange={(grosor) => actualizarOpciones('lineasConexion', { grosor })}
                />
                <Select
                  label="Estilo"
                  value={opciones.lineasConexion.estilo}
                  options={[
                    { value: 'continua', label: 'Continua' },
                    { value: 'punteada', label: 'Punteada' },
                  ]}
                  onChange={(estilo) => actualizarOpciones('lineasConexion', { estilo })}
                />
              </>
            )}
          </div>
        </SeccionAcordeon>

        {/* Sección: Etiquetas de Datos */}
        <SeccionAcordeon
          titulo="Etiquetas de Datos"
          icono="🏷️"
          colapsado={colapsados.etiquetas}
          onToggle={() => toggleSeccion('etiquetas')}
        >
          <div className="space-y-3">
            <Checkbox
              label="Mostrar etiquetas sobre burbujas"
              checked={opciones.etiquetas.mostrar}
              onChange={(checked) => actualizarOpciones('etiquetas', { mostrar: checked })}
            />
            {opciones.etiquetas.mostrar && (
              <>
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  <Checkbox
                    label="Valor X"
                    checked={opciones.etiquetas.mostrarX}
                    onChange={(checked) => actualizarOpciones('etiquetas', { mostrarX: checked })}
                    small
                  />
                  <Checkbox
                    label="Valor Y"
                    checked={opciones.etiquetas.mostrarY}
                    onChange={(checked) => actualizarOpciones('etiquetas', { mostrarY: checked })}
                    small
                  />
                  <Checkbox
                    label="Tamaño"
                    checked={opciones.etiquetas.mostrarTamanio}
                    onChange={(checked) => actualizarOpciones('etiquetas', { mostrarTamanio: checked })}
                    small
                  />
                  {mostrarOpcionColor && (
                    <Checkbox
                      label="Categoría/Color"
                      checked={opciones.etiquetas.mostrarColor}
                      onChange={(checked) => actualizarOpciones('etiquetas', { mostrarColor: checked })}
                      small
                    />
                  )}
                </div>
                <Slider
                  label="Tamaño de fuente"
                  value={opciones.etiquetas.tamanioFuente}
                  min={8}
                  max={16}
                  step={1}
                  unidad="px"
                  onChange={(tamanioFuente) => actualizarOpciones('etiquetas', { tamanioFuente })}
                />
                <InputColor
                  label="Color de texto"
                  value={opciones.etiquetas.color}
                  onChange={(color) => actualizarOpciones('etiquetas', { color })}
                />
              </>
            )}
          </div>
        </SeccionAcordeon>

        {/* Sección: Ejes */}
        <SeccionAcordeon
          titulo="Ejes"
          icono="📏"
          colapsado={colapsados.ejes}
          onToggle={() => toggleSeccion('ejes')}
        >
          <div className="space-y-3">
            <Checkbox
              label="Mostrar título del eje X"
              checked={opciones.ejes.mostrarTituloX}
              onChange={(checked) => actualizarOpciones('ejes', { mostrarTituloX: checked })}
            />
            <Checkbox
              label="Mostrar título del eje Y"
              checked={opciones.ejes.mostrarTituloY}
              onChange={(checked) => actualizarOpciones('ejes', { mostrarTituloY: checked })}
            />
            <Slider
              label="Grosor de línea"
              value={opciones.ejes.grosorLinea}
              min={1}
              max={4}
              step={1}
              unidad="px"
              onChange={(grosorLinea) => actualizarOpciones('ejes', { grosorLinea })}
            />
            <InputColor
              label="Color de ejes"
              value={opciones.ejes.colorLinea}
              onChange={(colorLinea) => actualizarOpciones('ejes', { colorLinea })}
            />
          </div>
        </SeccionAcordeon>

        {/* Sección: Leyenda */}
        {mostrarOpcionColor && (
          <SeccionAcordeon
            titulo="Leyenda"
            icono="🎨"
            colapsado={colapsados.leyenda}
            onToggle={() => toggleSeccion('leyenda')}
          >
            <div className="space-y-3">
              <Checkbox
                label="Mostrar leyenda de colores"
                checked={opciones.leyenda.mostrar}
                onChange={(checked) => actualizarOpciones('leyenda', { mostrar: checked })}
              />
              {opciones.leyenda.mostrar && (
                <Select
                  label="Posición"
                  value={opciones.leyenda.posicion}
                  options={[
                    { value: 'derecha', label: 'Derecha' },
                    { value: 'inferior', label: 'Inferior' },
                  ]}
                  onChange={(posicion) => actualizarOpciones('leyenda', { posicion })}
                />
              )}
            </div>
          </SeccionAcordeon>
        )}

        {/* Sección: Burbujas */}
        <SeccionAcordeon
          titulo="Burbujas"
          icono="⚫"
          colapsado={colapsados.burbujas}
          onToggle={() => toggleSeccion('burbujas')}
        >
          <div className="space-y-3">
            <Slider
              label="Transparencia"
              value={opciones.burbujas.transparencia}
              min={0}
              max={100}
              step={5}
              unidad="%"
              onChange={(transparencia) => actualizarOpciones('burbujas', { transparencia })}
            />
            <Checkbox
              label="Mostrar borde"
              checked={opciones.burbujas.mostrarBorde}
              onChange={(checked) => actualizarOpciones('burbujas', { mostrarBorde: checked })}
            />
            {opciones.burbujas.mostrarBorde && (
              <>
                <Slider
                  label="Grosor de borde"
                  value={opciones.burbujas.grosorBorde}
                  min={0}
                  max={5}
                  step={1}
                  unidad="px"
                  onChange={(grosorBorde) => actualizarOpciones('burbujas', { grosorBorde })}
                />
                <InputColor
                  label="Color de borde"
                  value={opciones.burbujas.colorBorde}
                  onChange={(colorBorde) => actualizarOpciones('burbujas', { colorBorde })}
                />
              </>
            )}
          </div>
        </SeccionAcordeon>

        {/* Sección: Tooltip */}
        <SeccionAcordeon
          titulo="Tooltip"
          icono="💬"
          colapsado={colapsados.tooltip}
          onToggle={() => toggleSeccion('tooltip')}
        >
          <div className="space-y-3">
            <Checkbox
              label="Mostrar tooltip al pasar el cursor"
              checked={opciones.tooltip.mostrar}
              onChange={(checked) => actualizarOpciones('tooltip', { mostrar: checked })}
            />
            {opciones.tooltip.mostrar && (
              <Select
                label="Formato de números"
                value={opciones.tooltip.formatoNumeros}
                options={[
                  { value: 'normal', label: 'Normal (12.34)' },
                  { value: 'compacto', label: 'Compacto (12.3K)' },
                ]}
                onChange={(formatoNumeros) => actualizarOpciones('tooltip', { formatoNumeros })}
              />
            )}
          </div>
        </SeccionAcordeon>
      </div>
    </div>
  );
};

// ========================================
// COMPONENTES AUXILIARES
// ========================================

interface SeccionAcordeonProps {
  titulo: string;
  icono: string;
  colapsado: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SeccionAcordeon: React.FC<SeccionAcordeonProps> = ({
  titulo,
  icono,
  colapsado,
  onToggle,
  children,
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icono}</span>
        <span className="font-semibold text-sm text-gray-800">{titulo}</span>
      </div>
      <span className="text-gray-500 text-xs">{colapsado ? '▼' : '▲'}</span>
    </button>
    {!colapsado && (
      <div className="p-4 bg-white">
        {children}
      </div>
    )}
  </div>
);

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  small?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, small }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
    />
    <span className={`${small ? 'text-xs' : 'text-sm'} text-gray-700 group-hover:text-gray-900`}>
      {label}
    </span>
  </label>
);

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unidad: string;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unidad, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className="text-sm text-gray-700">{label}</label>
      <span className="text-xs font-semibold text-purple-600">{value}{unidad}</span>
    </div>
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
    />
  </div>
);

interface InputColorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InputColor: React.FC<InputColorProps> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-700">{label}</label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none font-mono"
      />
    </div>
  </div>
);

interface SelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: any) => void;
}

const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
