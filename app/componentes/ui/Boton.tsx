import React from 'react';

interface PropiedadesBoton {
  children: React.ReactNode;
  onClick?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  variante?: 'primario' | 'secundario' | 'outline';
  deshabilitado?: boolean;
  ancho?: 'auto' | 'completo';
  className?: string;
}

export const Boton: React.FC<PropiedadesBoton> = ({
  children,
  onClick,
  tipo = 'button',
  variante = 'primario',
  deshabilitado = false,
  ancho = 'auto',
  className = '',
}) => {
  const estilosBase = `
    px-6 py-3 rounded-xl font-semibold text-base
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
    shadow-lg hover:shadow-xl
  `;

  const estilosVariante = {
    primario: `
      bg-gradient-to-r from-purple-600 to-indigo-600
      text-white hover:from-purple-700 hover:to-indigo-700
      shadow-md hover:shadow-lg focus:ring-purple-500
    `,
    secundario: `
      bg-blue-500 text-white hover:bg-blue-600
      shadow-md hover:shadow-lg focus:ring-blue-500
    `,
    outline: `
      bg-transparent border-2 border-purple-600
      text-purple-600 hover:bg-purple-50
      focus:ring-purple-500
    `,
  };

  const estilosAncho = ancho === 'completo' ? 'w-full' : 'w-auto';

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado}
      className={`${estilosBase} ${estilosVariante[variante]} ${estilosAncho} ${className}`}
    >
      {children}
    </button>
  );
};
