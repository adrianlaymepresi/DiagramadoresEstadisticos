import React from 'react';

interface PropiedadesEntrada {
  valor: string | number;
  onChange: (valor: string) => void;
  tipo?: 'text' | 'number';
  placeholder?: string;
  etiqueta?: string;
  error?: string;
  requerido?: boolean;
  min?: number;
  max?: number;
  ancho?: 'auto' | 'completo';
}

export const Entrada: React.FC<PropiedadesEntrada> = ({
  valor,
  onChange,
  tipo = 'text',
  placeholder,
  etiqueta,
  error,
  requerido = false,
  min,
  max,
  ancho = 'completo',
}) => {
  const estilosContenedor = ancho === 'completo' ? 'w-full' : 'w-auto';
  
  const estilosEntrada = `
    w-full px-4 py-2 rounded-lg border-2
    ${error ? 'border-red-500' : 'border-gray-300'}
    focus:outline-none focus:border-purple-500
    transition-colors duration-200
    bg-white text-gray-900
  `;

  return (
    <div className={`flex flex-col gap-2 ${estilosContenedor}`}>
      {etiqueta && (
        <label className="text-sm font-medium text-gray-700">
          {etiqueta}
          {requerido && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={estilosEntrada}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};
