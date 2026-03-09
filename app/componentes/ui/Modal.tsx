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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fadeIn"
      onClick={alCerrar}
    >
      <div
        className="bg-white rounded-2xl shadow-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>📊</span>
              {titulo}
            </h3>
            <button
              onClick={alCerrar}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
};
