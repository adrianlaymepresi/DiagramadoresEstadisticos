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
  nombreArchivo: string,
  canvas?: HTMLCanvasElement
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
  
  const hojaDatos = XLSX.utils.aoa_to_sheet(datosHoja);
  
  const rangoColumnas = XLSX.utils.decode_range(hojaDatos['!ref'] || 'A1');
  for (let C = rangoColumnas.s.c; C <= rangoColumnas.e.c; ++C) {
    const direccion = XLSX.utils.encode_col(C) + '1';
    if (!hojaDatos[direccion]) continue;
    hojaDatos[direccion].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '8B5CF6' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }
  
  hojaDatos['!cols'] = encabezados.map(() => ({ wch: 15 }));

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hojaDatos, 'Datos');

  if (canvas) {
    const imagenData = canvas.toDataURL('image/png').split(',')[1];
    const hojaImagen = XLSX.utils.aoa_to_sheet([
      ['Diagrama de Burbujas'],
      [''],
      ['Ver imagen adjunta en formato PNG']
    ]);
    XLSX.utils.book_append_sheet(libro, hojaImagen, 'Diagrama');
  }

  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
};

export const normalizarNombreArchivo = (nombre: string): string => {
  return nombre
    .trim()
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
};
