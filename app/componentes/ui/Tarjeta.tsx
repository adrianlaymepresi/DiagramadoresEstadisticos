import React from 'react';

interface PropiedadesTarjeta {
  children: React.ReactNode;
  titulo?: string;
  className?: string;
}

export const Tarjeta: React.FC<PropiedadesTarjeta> = ({
  children,
  titulo,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg p-6
        border border-gray-200
        ${className}
      `}
    >
      {titulo && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          {titulo}
        </h2>
      )}
      {children}
    </div>
  );
};
