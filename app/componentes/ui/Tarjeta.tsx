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
        bg-white rounded-2xl shadow-2xl
        border-2 border-purple-100
        overflow-hidden
        transition-all duration-300 hover:shadow-3xl
        ${className}
      `}
    >
      {titulo && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {titulo}
          </h2>
        </div>
      )}
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};
