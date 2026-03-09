import React from 'react';

interface PropiedadesModal {
  abierto: boolean;
  alCerrar: () => void;
  children: React.ReactNode;
  titulo?: string;
}

export const Modal: React.FC<PropiedadesModal> = ({
  abierto,
  alCerrar,
  children,
  titulo,
}) => {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={alCerrar}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">{titulo}</h3>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
