# Generador de Diagramas de Burbujas Profesional

Aplicación web profesional para crear, personalizar y exportar diagramas de burbujas interactivos de alta calidad con hasta **4 dimensiones de datos**. Desarrollada con Next.js 16, React 19, TypeScript y TailwindCSS 4.

## ✨ Novedades: Panel de Personalización Estilo Excel

**¡Ahora con control total sobre cada aspecto visual de tu diagrama!**

Esta versión incluye un **Panel de Personalización completo** con 7 secciones de controles, permitiendo ajustar cada elemento visual del diagrama en tiempo real:

- 🎨 **+ de 25 opciones de personalización** disponibles
- 📊 **Vista previa instantánea** de todos los cambios
- 💾 **Exportación con tus personalizaciones** aplicadas
- 🎯 **Interfaz estilo Excel** familiar y profesional
- ⚡ **Sin límites**: Todo funciona dinámicamente con cualquier conjunto de datos

### Controles Disponibles
✓ Cuadrícula personalizable (líneas horizontales/verticales)  
✓ Líneas de conexión entre burbujas (continuas/punteadas)  
✓ Etiquetas de datos sobre burbujas (X, Y, tamaño, color)  
✓ Ejes configurables (títulos, grosor, color)  
✓ Leyenda posicionable (derecha/inferior)  
✓ Transparencia y bordes de burbujas  
✓ Tooltip configurable (formato normal/compacto)

---

## 🎯 Características Principales

### 1. Interfaz Profesional Renovada
- **Header limpio y moderno** con información clara del propósito de la herramienta
- **Breadcrumb simplificado** mostrando el progreso en 3 etapas claras
- **Diseño amplio y espacioso** con márgenes y padding generosos
- **Transiciones suaves** entre etapas con animaciones profesionales
- **Layout responsivo** que se adapta perfectamente a cualquier dispositivo

### 2. Configuración Flexible e Intuitiva
- Define entre **3 y 20 puntos** de datos para tu diagrama
- Nombra tus propios **ejes X e Y** con ejemplos contextuales
- Define qué representa el **tamaño de las burbujas**
- **Cuarta dimensión opcional** mediante color de burbuja
- Validación en tiempo real con mensajes claros y específicos
- Diseño por dimensiones con códigos de color distintivos

### 3. Editor de Tabla con Validación Progresiva
- **Inputs flexibles** que permiten valores temporalmente vacíos
- **Validación por campo** con errores específicos mostrados inline
- **Barra de progreso** mostrando completitud de datos (X% completado)
- **Resaltado de fila activa** para mejor contexto durante la edición
- Soporte completo para copiar y pegar desde Excel
- Selector de color integrado (si se usa cuarta dimensión)

### 4. 🎨 Panel de Personalización Estilo Excel (NUEVO)

Controla cada aspecto visual del diagrama con un panel lateral completo:

#### 📐 Cuadrícula y Fondo
- ✓ Activar/desactivar líneas horizontales y verticales
- 🎨 Personalizar color de líneas
- 📏 Ajustar grosor (0.5-3px)

#### 🔗 Líneas de Conexión
- ✓ Conectar burbujas en orden de ingreso
- 🎨 Personalizar color y grosor
- Elegir estilo: continua o punteada

#### 🏷️ Etiquetas de Datos
- ✓ Mostrar etiquetas sobre cada burbuja
- Elegir qué mostrar: X, Y, tamaño, color/categoría
- Ajustar tamaño de fuente (8-16px)
- Personalizar color de texto

#### 📏 Ejes
- ✓ Activar/desactivar títulos de ejes X e Y
- ✏️ Personalizar títulos (opcional)
- Ajustar grosor de línea (1-4px)
- Personalizar color de ejes

#### 🎨 Leyenda
- ✓ Mostrar/ocultar leyenda de colores
- Elegir posición: derecha o inferior
- Automática cuando hay cuarta dimensión

#### ⚫ Burbujas
- 🔄 Ajustar transparencia (0-100%)
- ✓ Activar/desactivar borde
- Ajustar grosor de borde (0-5px)
- Personalizar color de borde

#### 💬 Tooltip
- ✓ Activar/desactivar tooltip interactivo
- Formato de números: normal o compacto (K/M)

### 5. Visualización Avanzada del Diagrama
- **Canvas responsivo** con proporción de aspecto optimizada
- **Escalado inteligente** de burbujas usando raíz cuadrada (como Excel)
- **Ejes fieles a datos** mostrando valores reales ingresados
- **Sistema de rangos adaptativo** con padding del 15-20%
- **Manejo robusto** de valores negativos, ceros y extremos
- **Tooltip interactivo** con información completa al pasar el cursor
- **Vista previa en tiempo real** de todos los cambios de personalización

### 6. Exportación Múltiple Profesional
- **🖼️ PNG**: Imagen de alta calidad con todas las personalizaciones
- **📄 PDF**: Documento listo para imprimir o reportes
- **📊 Excel**: Tabla de datos con formato profesional + metadatos
  - Encabezados estilizados (fondo morado, texto blanco)
  - Columnas auto-ajustadas
  - Información del diagrama incluida

### 7. Sistema de Color como Cuarta Dimensión
- **Colores CSS válidos**: #HEX, rgb(), rgba(), nombres de colores
- **Categorías semánticas**: "alto", "bajo", "positivo", "negativo", "estable"
- **Mapeo inteligente** de categorías a colores consistentes
- **Paleta automática** para valores no especificados
- **Leyenda dinámica** mostrando la correspondencia color-categoría
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
│   │   ├── Boton.tsx                 # Botón con 3 variantes y efectos hover
│   │   ├── Entrada.tsx               # Input con validación y estados
│   │   ├── Tarjeta.tsx               # Contenedor con gradiente en header
│   │   └── Modal.tsx                 # Modal responsive con backdrop
│   ├── ConfiguracionInicial.tsx      # Formulario mejorado con validación dimensional
│   ├── EditorTabla.tsx               # Tabla con validación progresiva por campo
│   ├── VisualizadorDiagrama.tsx      # Canvas + Sidebar Layout con preview en tiempo real
│   ├── PanelPersonalizacion.tsx      # **NUEVO** Panel estilo Excel con 7 secciones de controles
│   └── Historial.tsx                 # Grid de tarjetas con acciones
├── servicios/
│   ├── generadorTabla.ts             # Lógica inmutable de tabla
│   ├── generadorDiagrama.ts          # Motor de renderizado con todas las opciones de personalización
│   └── exportador.ts                 # Exportación multi-formato (PNG, PDF, Excel)
├── tipos/
│   └── index.ts                      # Tipos completos + OpcionesVisualizacion (8 interfaces)
├── utilidades/
│   └── validaciones.ts               # Funciones puras de validación
├── globals.css                       # Variables CSS + animaciones + scrollbars personalizados
├── layout.tsx                        # Layout con metadata SEO
└── page.tsx                          # Orquestador principal con breadcrumb compacto

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

### Diagrama de Burbujas con Personalización Avanzada

#### Sistema de Opciones de Visualización
El diagrama implementa un sistema completo de personalización con **8 interfaces TypeScript**:

1. **OpcionesCuadricula**: Control de líneas horizontales/verticales, color y grosor
2. **OpcionesLineasConexion**: Conectar burbujas con líneas (continua/punteada)
3. **OpcionesEtiquetas**: Etiquetas de datos sobre burbujas (X, Y, tamaño, color)
4. **OpcionesEjes**: Títulos personalizados, grosor y color de líneas
5. **OpcionesLeyenda**: Posición (derecha/inferior) y visibilidad
6. **OpcionesBurbujas**: Transparencia, bordes personalizables
7. **OpcionesTooltip**: Formato de números (normal/compacto)
8. **OpcionesVisualizacion**: Interface maestra que unifica todas las anteriores

#### Motor de Renderizado Mejorado
El archivo `generadorDiagrama.ts` ahora contiene funciones especializadas:

- **`dibujarCuadricula()`**: Renderiza líneas de referencia según opciones
- **`dibujarEjes()`**: Ejes con títulos personalizables y escalas inteligentes
- **`dibujarLineasConexion()`**: Conecta burbujas en orden de ingreso
- **`dibujarEtiquetasBurbujas()`**: Etiquetas con fondo semi-transparente
- **`dibujarLeyenda()`**: Leyenda adaptativa (vertical/horizontal)
- **`dibujarDiagrama()`**: Orquesta todo con sistema de opciones

#### Características Técnicas del Diagrama

1. **Cuadrícula Personalizable**
   - Activar/desactivar líneas horizontales y verticales independientemente
   - Color y grosor configurables
   - Ayuda visual opcional sin interferir con datos

2. **Ejes Inteligentes y Fieles**
   - Escalas calculadas automáticamente desde los datos reales
   - Función `calcularTicksInteligentes()` para valores legibles
   - Padding del 15-20% para evitar burbujas en bordes
   - Títulos personalizables o automáticos desde nombres de columnas

3. **Burbujas con Escalado Tipo Excel**
   - Radio calculado con **raíz cuadrada** del valor (como Excel)
   - Transparencia ajustable (0-100%)
   - Bordes opcionales con grosor y color personalizables
   - Colores de la cuarta dimensión con paleta inteligente

4. **Líneas de Conexión**
   - Conectan burbujas en el orden cronológico de ingreso
   - Estilo continuo o punteado
   - Color y grosor personalizables
   - Se renderizan debajo de las burbujas para no obstruir

5. **Etiquetas de Datos Inteligentes**
   - Muestran valores seleccionados: X, Y, tamaño, color/categoría
   - Fondo blanco semi-transparente con borde sutil
   - Posicionadas sobre cada burbuja
   - Tamaño de fuente y color personalizables

6. **Sistema de Color (Cuarta Dimensión)**
   - Acepta colores CSS válidos: #HEX, rgb(), rgba(), nombres
   - Mapeo semántico: "alto"→rojo, "bajo"→azul, "positivo"→verde
   - Leyenda dinámica con posicionamiento flexible (derecha o inferior)
   - Paleta automática para categorías no especificadas

7. **Tooltip Interactivo**
   - Aparece al pasar el cursor sobre burbujas
   - Formato de números configurable: normal (decimales) o compacto (K/M)
   - Muestra toda la información del punto de datos
   - Desactivable mediante opciones

#### Vista Previa en Tiempo Real
Todos los cambios en el Panel de Personalización se reflejan **instantáneamente** en el canvas, permitiendo experimentar y ajustar hasta lograr el resultado deseado.

## Arquitectura y Principios

### Principios SOLID Aplicados

#### 1. Single Responsibility Principle (SRP)
- **generadorDiagrama.ts**: Separado en funciones especializadas
  - `dibujarCuadricula()`: Solo maneja la cuadrícula con opciones
  - `dibujarEjes()`: Solo maneja los ejes con títulos personalizables
  - `dibujarLineasConexion()`: Solo las líneas entre burbujas
  - `dibujarEtiquetasBurbujas()`: Solo las etiquetas de datos
  - `dibujarLeyenda()`: Solo la leyenda con posicionamiento
  - `dibujarDiagrama()`: Orquesta todas las funciones
- **PanelPersonalizacion.tsx**: Solo maneja UI de controles
- **VisualizadorDiagrama.tsx**: Solo maneja canvas y coordinación
- Cada componente tiene una única razón de cambio
- Los servicios están completamente desacoplados de la UI

#### 2. Open/Closed Principle (OCP)
- Componentes UI extensibles mediante props
- Sistema de opciones de visualización permite agregar nuevas personalizaciones sin modificar código existente
- Exportadores pueden añadir formatos sin cambiar interfaz
- Panel de personalización modular con secciones independientes

#### 3. Liskov Substitution Principle (LSP)
- Todos los componentes UI mantienen contratos consistentes
- Las interfaces TypeScript garantizan sustitución segura
- Props opcionales con valores por defecto bien definidos
- OPCIONES_VISUALIZACION_DEFAULT garantiza estado inicial consistente

#### 4. Interface Segregation Principle (ISP)
- Props específicas por componente, sin dependencias innecesarias
- Interfaces pequeñas y focalizadas (8 interfaces vs 1 monolítica)
- OpcionesVisualizacion compone interfaces específicas
- No se fuerzan propiedades que no se usan

#### 5. Dependency Inversion Principle (DIP)
- Componentes dependen de abstracciones (tipos TypeScript)
- Lógica de renderizado desacoplada de opciones mediante interfaces
- Inyección de dependencias mediante props
- generadorDiagrama.ts acepta opciones sin conocer su origen

### Principio DRY (Don't Repeat Yourself)
- Componentes UI completamente reutilizables (Checkbox, Slider, InputColor, Select)
- Funciones de utilidad compartidas (validaciones, parseo, formateo)
- Estilos CSS en variables globales
- Lógica de exportación centralizada
- Funciones puras para cálculos matemáticos
- OPCIONES_VISUALIZACION_DEFAULT como única fuente de verdad
- SeccionAcordeon reutilizable para todas las secciones del panel

### Clean Code Aplicado
- **Variables en español**: Nombres autoexplicativos y descriptivos
- **Sin comentarios innecesarios**: Código que se explica por sí mismo
- **Funciones pequeñas**: Máximo 20-40 líneas por función
- **Inmutabilidad**: Uso de spread operator, map, filter
- **Tipado estricto**: Sin `any`, interfaces bien definidas
- **Separación de concerns**: Lógica vs presentación vs estado
- **Componentes funcionales**: Hooks para gestión de estado

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

### 1. Configuración Inicial (Etapa 1/3)
1. Ingresa el número de filas/puntos de datos (3-20)
2. Define nombres descriptivos para los ejes X e Y
3. Establece el nombre de la dimensión de tamaño (será el título del diagrama)
4. **Opcionalmente**, activa la **cuarta dimensión mediante color**
5. Haz clic en "Continuar a Ingreso de Datos"

### 2. Ingreso de Datos (Etapa 2/3)
1. Completa la tabla con valores numéricos para X, Y y Tamaño
2. **Opción rápida**: Copia datos desde Excel/Google Sheets y pégalos directamente
3. Si activaste la cuarta dimensión:
   - Selecciona colores con el picker (formato #HEX)
   - O escribe categorías semánticas ("alto", "bajo", "positivo", "negativo")
   - O usa nombres de colores CSS ("red", "blue", "green")
4. La **barra de progreso** te indica el % de datos completos
5. Haz clic en "Generar Diagrama" cuando esté todo validado

### 3. Visualización y Personalización (Etapa 3/3)
1. **Visualiza tu diagrama** generado en el canvas principal
2. **Abre el Panel de Personalización** (botón ⚙️ en el header):
   - 📐 **Cuadrícula**: Activa/desactiva líneas horizontales/verticales, personaliza color y grosor
   - 🔗 **Líneas de Conexión**: Conecta burbujas con líneas continuas o punteadas
   - 🏷️ **Etiquetas de Datos**: Muestra valores X/Y/tamaño/color sobre cada burbuja
   - 📏 **Ejes**: Personaliza títulos, grosor y color de las líneas
   - 🎨 **Leyenda**: Posiciona la leyenda (derecha o inferior) si usas color
   - ⚫ **Burbujas**: Ajusta transparencia, activa bordes personalizados
   - 💬 **Tooltip**: Configura formato de tooltip (normal o compacto con K/M)
3. **Vista previa en tiempo real**: Todos los cambios se reflejan instantáneamente
4. **Resetea a valores por defecto** si lo necesitas
5. **Exporta** en el formato deseado (PNG, PDF, Excel) con todas tus personalizaciones
6. **Crea un nuevo diagrama** o vuelve al inicio cuando quieras

### 4. Gestión de Historial (Opcional)
1. Haz clic en "Ver Historial" para visualizar diagramas guardados
2. Visualiza cualquier diagrama en un modal de pantalla completa
3. Exporta directamente desde el historial sin recrear
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

El proyecto está diseñado para ser fácilmente extensible siguiendo principios SOLID:

### Añadir Nuevas Opciones de Personalización
1. **Actualiza tipos** en `tipos/index.ts`:
   - Crea una nueva interface (ej: `OpcionesAnimacion`)
   - Agrégala a `OpcionesVisualizacion`
   - Actualiza `OPCIONES_VISUALIZACION_DEFAULT`
2. **Añade controles** en `PanelPersonalizacion.tsx`:
   - Crea una nueva `SeccionAcordeon`
   - Agrega controles (Checkbox, Slider, Select, etc.)
   - Conecta con el callback `alCambiar`
3. **Implementa lógica** en `generadorDiagrama.ts`:
   - Modifica funciones existentes o crea nuevas
   - Usa las opciones recibidas como parámetro
   - Mantén funciones pequeñas y focalizadas

### Añadir Nuevos Formatos de Exportación
1. Crea una función en `exportador.ts`
2. Añade el tipo a `FormatoExportacion` en tipos
3. Agrega el botón correspondiente en `VisualizadorDiagrama.tsx`
4. Implementa la lógica de conversión/descarga

### Añadir Nuevos Tipos de Gráficos
1. Crea un nuevo servicio en `servicios/` (ej: `generadorBarras.ts`)
2. Implementa la lógica de renderizado específica
3. Añade el componente visualizador correspondiente
4. Reutiliza el sistema de opciones de visualización

### Personalizar Estilos Globales
1. Modifica las variables CSS en `globals.css`
2. Las animaciones @keyframes están centralizadas
3. Los colores principales usan purple/indigo de Tailwind
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
