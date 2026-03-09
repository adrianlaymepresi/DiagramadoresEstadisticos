import { ConfiguracionDiagrama } from '../tipos';

export const exportarComoImagen = async (
  canvas: HTMLCanvasElement,
  nombreArchivo: string
): Promise<void> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `${nombreArchivo}.png`;
      enlace.click();
      URL.revokeObjectURL(url);
      resolve();
    });
  });
};

export const exportarComoPDF = async (
  canvas: HTMLCanvasElement,
  nombreArchivo: string,
  configuracion: ConfiguracionDiagrama
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  const imagenData = canvas.toDataURL('image/png');
  pdf.addImage(imagenData, 'PNG', 0, 0, canvas.width, canvas.height);

  pdf.save(`${nombreArchivo}.pdf`);
};

export const exportarComoExcel = async (
  configuracion: ConfiguracionDiagrama,
  nombreArchivo: string
): Promise<void> => {
  const XLSX = await import('xlsx');

  const encabezados = [
    configuracion.configuracionColumnas.nombreX,
    configuracion.configuracionColumnas.nombreY,
    configuracion.configuracionColumnas.nombreTamanio,
  ];

  if (configuracion.configuracionColumnas.nombreColor) {
    encabezados.push(configuracion.configuracionColumnas.nombreColor);
  }

  const filas = configuracion.datos.map((fila) => {
    const fila_data: (string | number)[] = [fila.x, fila.y, fila.tamanio];
    if (fila.color) {
      fila_data.push(fila.color);
    }
    return fila_data;
  });

  const datosHoja = [encabezados, ...filas];
  const hoja = XLSX.utils.aoa_to_sheet(datosHoja);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Datos');

  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
};

export const normalizarNombreArchivo = (nombre: string): string => {
  return nombre
    .trim()
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
};
