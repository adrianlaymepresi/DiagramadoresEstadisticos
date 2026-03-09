# Generador de Diagramas de Burbujas

Aplicación web profesional para crear, visualizar y exportar diagramas de burbujas interactivos. Desarrollada con Next.js 14, React 19, TypeScript y TailwindCSS.

## Características Principales

### 1. Configuración Flexible
- Define entre 3 y 20 puntos de datos para tu diagrama
- Nombra tus propios ejes (X, Y) y el tamaño de burbuja
- Opción de incluir una columna de color personalizado
- Validación en tiempo real de todos los campos

### 2. Editor de Tabla Intuitivo
- Tabla editable con interfaz limpia y organizada
- Soporte para copiar y pegar datos desde Excel o Word
- Selector de color integrado para personalización
- Validación de datos numéricos en tiempo real

### 3. Visualización de Diagrama
- Renderizado en canvas HTML5 de alta calidad
- Burbujas escaladas proporcionalmente al tamaño
- Colores personalizables o paleta automática
- Ejes etiquetados con escala numérica
- Título configurable basado en el nombre del tamaño

### 4. Exportación Múltiple
- **PNG**: Imagen de alta calidad del diagrama
- **PDF**: Documento listo para imprimir o compartir
- **Excel**: Tabla de datos estructurada con encabezados

### 5. Historial de Diagramas
- Almacenamiento en memoria de todos los diagramas creados
- Vista previa rápida en modal
- Exportación directa desde el historial
- Gestión de diagramas guardados

## Estructura del Proyecto

```
app/
├── componentes/
│   ├── ui/
│   │   ├── Boton.tsx              # Componente de botón reutilizable
│   │   ├── Entrada.tsx            # Componente de entrada con validación
│   │   ├── Tarjeta.tsx            # Componente contenedor
│   │   └── Modal.tsx              # Componente modal
│   ├── ConfiguracionInicial.tsx   # Formulario de configuración
│   ├── EditorTabla.tsx            # Editor de datos tabular
│   ├── VisualizadorDiagrama.tsx   # Visualización del diagrama
│   └── Historial.tsx              # Gestión de diagramas guardados
├── servicios/
│   ├── generadorTabla.ts          # Lógica de manejo de tabla
│   ├── generadorDiagrama.ts       # Renderizado y cálculos del diagrama
│   └── exportador.ts              # Exportación a múltiples formatos
├── tipos/
│   └── index.ts                   # Definiciones TypeScript
├── utilidades/
│   └── validaciones.ts            # Funciones de validación
├── globals.css                    # Estilos globales y variables CSS
├── layout.tsx                     # Layout principal
└── page.tsx                       # Página principal

```

## Arquitectura y Principios

### Principios SOLID Aplicados

#### 1. Single Responsibility Principle (SRP)
- Cada componente tiene una responsabilidad única y bien definida
- Los servicios están separados por funcionalidad (tabla, diagrama, exportación)
- Las utilidades de validación están aisladas

#### 2. Open/Closed Principle (OCP)
- Los componentes UI son extensibles mediante props
- Los servicios de exportación pueden añadir nuevos formatos sin modificar el código existente

#### 3. Liskov Substitution Principle (LSP)
- Los componentes UI mantienen contratos consistentes
- Las interfaces TypeScript garantizan sustitución segura

#### 4. Interface Segregation Principle (ISP)
- Las props de componentes están segmentadas según necesidad
- No se fuerzan dependencias innecesarias

#### 5. Dependency Inversion Principle (DIP)
- Los componentes dependen de abstracciones (tipos TypeScript)
- La lógica de negocio está desacoplada de la UI

### Principio DRY (Don't Repeat Yourself)
- Componentes UI reutilizables para toda la aplicación
- Funciones de utilidad compartidas para evitar duplicación
- Servicios centralizados para lógica común

### Factorización de Código
- Separación clara entre presentación y lógica
- Módulos pequeños y enfocados
- Funciones puras para cálculos matemáticos

## Diseño Visual

### Paleta de Colores
La aplicación utiliza un sistema de diseño coherente basado en variables CSS:

- **Primario**: Morado (#8B5CF6)
- **Secundario**: Índigo (#6366F1)
- **Acento**: Azul (#3B82F6)
- **Fondo**: Gradiente suave blanco-morado
- **Superficie**: Blanco puro con sombras
- **Bordes**: Grises suaves (#E2E8F0)

### Características de Diseño
- Gradientes suaves en encabezados y botones
- Transiciones fluidas en todas las interacciones
- Sombras sutiles para profundidad
- Bordes redondeados para modernidad
- Espaciado consistente y respiración visual

## Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
cd diagramadores

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Servidor de producción
npm run lint     # Verificar código
```

## Flujo de Uso

### 1. Configuración Inicial
1. Ingresa el número de filas (3-20)
2. Define nombres para los ejes X e Y
3. Establece el nombre del tamaño de burbuja (será el título)
4. Opcionalmente, activa la columna de color personalizado
5. Haz clic en "Continuar"

### 2. Ingreso de Datos
1. Completa la tabla con valores numéricos
2. Opción: Copia datos desde Excel/Word y pégalos directamente
3. Si activaste colores, selecciona un color para cada fila
4. Haz clic en "Generar Diagrama"

### 3. Visualización y Exportación
1. Visualiza tu diagrama generado
2. Exporta en el formato deseado (PNG, PDF, Excel)
3. Guarda el diagrama en el historial para acceso posterior
4. Crea un nuevo diagrama o vuelve al inicio

### 4. Gestión de Historial
1. Haz clic en "Ver Historial" para visualizar diagramas guardados
2. Visualiza cualquier diagrama en un modal
3. Exporta directamente desde el historial
4. Elimina diagramas que ya no necesites

## Tecnologías Utilizadas

- **Next.js 16**: Framework React con App Router
- **React 19**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para mayor confiabilidad
- **TailwindCSS 4**: Framework de estilos utilitarios
- **jsPDF**: Generación de documentos PDF
- **xlsx**: Manipulación de archivos Excel
- **Canvas API**: Renderizado de diagramas

## Gestión de Estado

La aplicación utiliza React Hooks para gestión de estado:

- `useState`: Estado local de componentes
- `useEffect`: Efectos secundarios (renderizado canvas)
- `useRef`: Referencias a elementos DOM (canvas)

Los datos se almacenan en memoria durante la sesión de la aplicación, lo que garantiza:
- Rendimiento óptimo
- Privacidad (sin persistencia en servidor)
- Simplicidad arquitectónica

## Validaciones Implementadas

### Configuración
- Número de filas entre 3 y 20
- Nombres de columnas no vacíos
- Nombre de color requerido si la opción está activada

### Datos
- Valores numéricos válidos para X, Y y Tamaño
- Tamaño mayor a cero
- Formato de color hexadecimal válido

### Exportación
- Normalización de nombres de archivo
- Validación de disponibilidad del canvas
- Manejo de errores en exportación

## Optimizaciones

### Rendimiento
- Renderizado condicional de componentes
- Actualización eficiente del canvas
- Carga dinámica de librerías de exportación

### UX/UI
- Feedback visual inmediato
- Validaciones en tiempo real
- Mensajes de error claros
- Transiciones suaves

### Código
- Componentes puros y reutilizables
- Separación de responsabilidades
- Funciones pequeñas y testables
- Tipado estricto TypeScript

## Extensibilidad

El proyecto está diseñado para ser fácilmente extensible:

### Añadir Nuevos Formatos de Exportación
1. Crea una función en `exportador.ts`
2. Añade el tipo a `FormatoExportacion`
3. Agrega el botón correspondiente en los componentes

### Añadir Nuevos Tipos de Gráficos
1. Crea un nuevo servicio en `servicios/`
2. Implementa la lógica de renderizado
3. Añade el componente visualizador correspondiente

### Personalizar Estilos
1. Modifica las variables CSS en `globals.css`
2. Los cambios se aplican automáticamente en toda la app

## Mejores Prácticas Implementadas

### Código Limpio
- Variables en español autoexplicativas
- Sin comentarios innecesarios (código autoexplicativo)
- Funciones pequeñas con propósito único
- Nombres descriptivos y consistentes

### TypeScript
- Interfaces bien definidas
- Tipado estricto sin `any`
- Props tipadas en todos los componentes
- Enums para valores constantes

### React
- Componentes funcionales con hooks
- Props destructuradas
- Composición sobre herencia
- Un componente por archivo

## Autor

Proyecto desarrollado siguiendo los más altos estándares de calidad de código, aplicando principios SOLID, DRY y Clean Code.

## Licencia

Este proyecto es de uso educativo.
