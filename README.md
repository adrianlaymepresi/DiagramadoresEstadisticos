# Generador de Diagramas de Burbujas

Aplicación web profesional y completamente responsiva para crear, visualizar y exportar diagramas de burbujas interactivos de alta calidad. Desarrollada con Next.js 16, React 19, TypeScript y TailwindCSS.

## Características Principales

### 1. Configuración Flexible e Intuitiva
- Define entre 3 y 20 puntos de datos para tu diagrama
- Nombra tus propios ejes (X, Y) y el tamaño de burbuja (que será el título)
- Opción de incluir una columna de color personalizado para cada burbuja
- Validación en tiempo real de todos los campos con feedback visual
- Interfaz moderna con gradientes y animaciones suaves

### 2. Editor de Tabla Profesional
- Tabla editable con diseño zebra (filas alternadas) para mejor legibilidad
- Soporte completo para copiar y pegar datos desde Excel o Word
- Selector de color integrado con vista previa del código hexadecimal
- Validación de datos numéricos en tiempo real
- Diseño responsivo que se adapta a tablets y móviles
- Inputs con efectos hover y focus mejorados

### 3. Visualización de Diagrama Avanzada
- **Canvas responsivo** que se adapta automáticamente al tamaño de la pantalla
- **Cuadrícula profesional** con 10x10 líneas para ubicación precisa
- **Líneas de intersección** que conectan cada burbuja con los ejes X e Y
- Burbujas con efectos de gradiente radial y sombras para profundidad 3D
- Colores personalizables con paleta automática inteligente
- Ejes completamente etiquetados con 10 divisiones para precisión
- Marcas en los ejes para mejor referencia
- Título prominente y etiquetas de ejes rotadas profesionalmente
- Ajuste automático para pantallas desde 320px hasta 4K

### 4. Exportación Múltiple Mejorada
- **PNG**: Imagen de alta calidad (1200x800px) del diagrama
- **PDF**: Documento con el diagrama en formato horizontal listo para imprimir
- **Excel**: Tabla de datos con formato profesional + hoja adicional con referencia al diagrama
  - Encabezados con estilo (fondo morado, texto blanco, negrita)
  - Columnas auto-ajustadas para mejor legibilidad
  - Hoja adicional con información del diagrama

### 5. Historial Inteligente
- Almacenamiento en memoria de todos los diagramas creados en la sesión
- Vista en tarjetas responsive (1 columna en móvil, 2 en desktop)
- Vista previa rápida en modal de pantalla completa
- Exportación directa desde el historial sin necesidad de recrear
- Gestión individual de diagramas guardados
- Animaciones de entrada suaves para mejor UX
- Iconos descriptivos para cada acción

### 6. Diseño Totalmente Responsivo
- **Móviles** (320px - 640px): Layout vertical optimizado, botones apilados
- **Tablets** (641px - 1024px): Grid de 2 columnas, mejor aprovechamiento del espacio
- **Desktop** (1025px+): Grid completo, visualización óptima del diagrama
- Canvas que se redimensiona automáticamente manteniendo proporciones
- Fuentes y espaciados adaptables según el dispositivo
- Animaciones y transiciones fluidas en todos los tamaños

## Estructura del Proyecto

```
app/
├── componentes/
│   ├── ui/
│   │   ├── Boton.tsx              # Botón con 3 variantes y efectos hover
│   │   ├── Entrada.tsx            # Input con validación y estados
│   │   ├── Tarjeta.tsx            # Contenedor con gradiente en header
│   │   └── Modal.tsx              # Modal responsive con backdrop
│   ├── ConfiguracionInicial.tsx   # Formulario mejorado con secciones
│   ├── EditorTabla.tsx            # Tabla zebra con inputs mejorados
│   ├── VisualizadorDiagrama.tsx   # Canvas responsivo y controles
│   └── Historial.tsx              # Grid de tarjetas con acciones
├── servicios/
│   ├── generadorTabla.ts          # Lógica inmutable de tabla
│   ├── generadorDiagrama.ts       # Renderizado avanzado con cuadrícula
│   └── exportador.ts              # Exportación multi-formato
├── tipos/
│   └── index.ts                   # Definiciones TypeScript completas
├── utilidades/
│   └── validaciones.ts            # Funciones puras de validación
├── globals.css                    # Variables CSS + animaciones
├── layout.tsx                     # Layout con metadata
└── page.tsx                       # Orquestador principal con estados

```

## Mejoras de Diseño Implementadas

### Sistema Visual Profesional

#### Paleta de Colores Expandida
- **Primario**: Morado vibrante (#8B5CF6)
- **Secundario**: Índigo profundo (#6366F1)
- **Acento**: Azul brillante (#3B82F6)
- **Fondo**: Gradiente suave multi-color (blanco → morado → azul)
- **Superficie**: Blanco puro con bordes sutiles
- **Interacciones**: Estados hover, focus y active diferenciados

#### Efectos Visuales
- **Gradientes**: En títulos, botones y fondos de tarjetas
- **Sombras**: 4 niveles (pequeña, mediana, grande, extra-grande)
- **Animaciones**: FadeIn, pulse, gradient animado
- **Transiciones**: Suaves en todos los elementos interactivos
- **Transformaciones**: Scale en hover para botones y tarjetas

#### Tipografía Mejorada
- Títulos grandes (3xl - 6xl) con gradiente animado
- Subtítulos con peso medium/semibold
- Cuerpo con line-height optimizado para lectura
- Tamaños responsivos que se adaptan al viewport

### Diagrama de Burbujas Mejorado

#### Características Técnicas
1. **Cuadrícula de Referencia**
   - 10x10 líneas en color gris claro (#F1F5F9)
   - Facilita la ubicación precisa de puntos
   - No interfiere con la visualización de datos

2. **Ejes Profesionales**
   - Líneas gruesas (3px) en gris oscuro (#475569)
   - 10 marcas por eje para máxima precisión
   - Etiquetas numéricas con un decimal
   - Título centrado en fuente bold 24px
   - Etiquetas de ejes rotadas para mejor legibilidad

3. **Líneas de Intersección**
   - Líneas punteadas desde cada burbuja a los ejes
   - Color morado semi-transparente (rgba(139, 92, 246, 0.3))
   - Permiten ver exactamente de qué coordenadas proviene cada punto

4. **Burbujas Mejoradas**
   - Gradiente radial para efecto 3D
   - Borde blanco grueso (3px) para contraste
   - Sombra proyectada para profundidad
   - Etiquetas con coordenadas en fuente bold
   - Texto blanco sobre fondo de color para legibilidad

5. **Escalado de Tamaño**
   - Radio entre 10px y 60px según el valor
   - Escalado proporcional y logarítmico
   - Evita solapamiento excesivo

## Arquitectura y Principios

### Principios SOLID Aplicados

#### 1. Single Responsibility Principle (SRP)
- **generadorDiagrama.ts**: Separado en funciones especializadas
  - `dibujarCuadricula()`: Solo maneja la cuadrícula
  - `dibujarEjes()`: Solo maneja los ejes y etiquetas
  - `dibujarLineasInterseccion()`: Solo las líneas guía
  - `dibujarDiagrama()`: Orquesta las demás funciones
- Cada componente tiene una única razón de cambio
- Los servicios están completamente desacoplados de la UI

#### 2. Open/Closed Principle (OCP)
- Componentes UI extensibles mediante props
- Sistema de variantes en botones sin modificar código base
- Exportadores pueden añadir formatos sin cambiar interfaz

#### 3. Liskov Substitution Principle (LSP)
- Todos los componentes UI mantienen contratos consistentes
- Las interfaces TypeScript garantizan sustitución segura
- Props opcionales con valores por defecto

#### 4. Interface Segregation Principle (ISP)
- Props específicas por componente, sin dependencias innecesarias
- Interfaces pequeñas y focalizadas
- No se fuerzan propiedades que no se usan

#### 5. Dependency Inversion Principle (DIP)
- Componentes dependen de abstracciones (tipos TypeScript)
- Lógica de negocio desacoplada de implementación
- Inyección de dependencias mediante props

### Principio DRY (Don't Repeat Yourself)
- Componentes UI completamente reutilizables
- Funciones de utilidad compartidas (validaciones, parseo)
- Estilos CSS en variables globales
- Lógica de exportación centralizada
- Funciones puras para cálculos matemáticos

### Clean Code Aplicado
- **Variables en español**: Nombres autoexplicativos y descriptivos
- **Sin comentarios**: Código que se explica por sí mismo
- **Funciones pequeñas**: Máximo 20-30 líneas por función
- **Inmutabilidad**: Uso de spread operator, map, filter
- **Tipado estricto**: Sin `any`, interfaces bien definidas
- **Separación de concerns**: Lógica vs presentación

## Responsividad Detallada

### Breakpoints Implementados
```css
/* Móvil pequeño */
@media (max-width: 640px) {
  - Layout en 1 columna
  - Fuente base 14px
  - Padding reducido
  - Botones apilados verticalmente
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  - Grid de 2 columnas para forms
  - Canvas adaptado
  - Botones en fila
}

/* Desktop */
@media (min-width: 1025px) {
  - Layout completo
  - Canvas máximo 1400px
  - Grid de 2 columnas en historial
}
```

### Componentes Adaptativos
- **Tarjeta**: Padding 6⇒8 (móvil⇒desktop)
- **Entrada**: Width 100% siempre, text-base responsive
- **Boton**: Transform scale en hover (desktop only)
- **Modal**: max-w ajustado según pantalla
- **Canvas**: Redimensionado proporcional automático

## Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior
- npm o yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)

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
