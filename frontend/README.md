# SISTEP · Frontend del Panel de Seguridad

Prototipo funcional del panel de seguridad construido únicamente con **HTML, CSS y JavaScript nativo**, sin frameworks, sin librerías y sin proceso de compilación. Incluye el dashboard y los módulos de Alertas, Incidentes, Reportes y Configuración.

## Cómo abrir

Abre `index.html` directamente en el navegador o sírvelo con cualquier servidor estático. Por ejemplo:

```powershell
python -m http.server 5500
```

Luego visita `http://localhost:5500`.

## Estructura

```text
.
├── index.html          # Shell, cinco vistas, diálogos y sprite de iconos SVG
├── css/
│   ├── global.css      # Tokens de color, reset, shell, botones y modales
│   ├── dashboard.css   # Indicadores, tabla, filtros y responsive del panel
│   └── views.css       # Alertas, incidentes, reportes, configuración e impresión
├── js/
│   ├── app.js          # Dashboard, notificaciones y router por hash
│   └── views.js        # Lógica de las cuatro vistas secundarias
├── assets/
│   └── favicon.svg
└── README.md
```

## Paleta

| Uso | Color |
| --- | --- |
| Principal | `#1E3A8A` |
| Acento | `#0F766E` |
| Alerta / peligro | `#DC2626` |
| Fondo | `#F9FAFB` |
| Texto | `#111827` |

Los tokens están definidos en `css/global.css` dentro de `:root`. Los colores semánticos de apoyo (éxito, advertencia, bordes y textos secundarios) también están centralizados allí.

## Navegación

La aplicación es una SPA con rutas por hash. El menú lateral y los botones Atrás/Adelante del navegador funcionan sin recargar la página:

| Vista | Ruta |
| --- | --- |
| Dashboard | `#dashboard` |
| Alertas | `#alertas` |
| Incidentes | `#incidentes` |
| Reportes y Estadísticas | `#reportes` |
| Configuración del Sistema | `#configuracion` |

El router actualiza el panel visible, el enlace activo, `aria-current`, el contexto del topbar y el título del documento.

## Funcionalidad incluida

### Dashboard

- Búsqueda por ID, alerta, ubicación, estado o responsable (sin distinguir acentos).
- Filtros por prioridad y estado, con chips de filtros activos.
- Detalle de cada alerta en un diálogo accesible.
- Acciones para resolver, cerrar y archivar alertas de la muestra.
- Exportación CSV de los resultados visibles.

### Alertas

- Bandeja dividida con tres alertas de ejemplo y detalle sincronizado.
- Mapa y evidencia de cámara como recursos visuales de demostración.
- «Notificar PNP 105» deriva la alerta y deshabilita la acción.
- «Descartar (falso positivo)» retira la alerta y actualiza los contadores.
- Estado vacío cuando ya no quedan alertas pendientes.

### Incidentes

- Historial con seis registros, búsqueda sin acentos y filtros por fecha, tipo, estado y operador.
- Paginación, tamaño de página y resumen de resultados.
- Modal con metadatos y bitácora de auditoría de cada incidente.
- Exportación CSV y PDF (mediante el diálogo de impresión del navegador).

### Reportes y Estadísticas

- Rangos de 7, 30 y 90 días con periodos calculados dinámicamente.
- Gráfico de barras, dona de resolución y gráfico de línea generados con SVG/CSS nativo.
- Exportación PDF y Excel (archivo `.xls` con tabla HTML compatible).

### Configuración del Sistema

- Umbral de confianza con slider, detecciones activas y modelo seleccionable.
- Protocolos de alerta y contacto PNP con validación.
- Tabla de cámaras, alta de dispositivos con validación de Bus ID y duplicados.
- Estado de cambios sin guardar, guardado simulado y restauración con «Cancelar».

### Comportamiento general

- Actualización simulada y notificaciones tipo toast.
- Navegación responsive con menú lateral deslizante.
- Tablas con desplazamiento horizontal contenido en pantallas pequeñas.
- Estados vacíos, foco visible y soporte para `prefers-reduced-motion`.
- Estilos de impresión para guardar las vistas como PDF.

## Datos de demostración

Los datos viven en `js/app.js` (dashboard y alertas recientes) y en `js/views.js` (bandeja de alertas, historial de incidentes, series de reportes y cámaras). Se mantienen deliberadamente pocos registros por vista para priorizar el diseño y las interacciones.

Los contadores globales del dashboard (`42` alertas y `15` incidentes activos) representan el resumen del sistema; al resolver una alerta se actualiza el contador de incidentes activos para demostrar la interacción.

## Integración con el backend

El frontend consume el API descrito en `INTEGRACION_BACKEND.md` mediante `js/api.js` (objeto global `SistepApi`).
Ya no hay datos de demostración en `app.js` ni `views.js`: dashboard, alertas, incidentes, reportes y
configuración se cargan al iniciar y al volver a cada vista. Las fechas llegan en ISO y se formatean en el navegador.
Si el backend no responde, cada vista muestra un mensaje de error y los toasts muestran `error.message`.
Ver `../README.md` para ponerlo en marcha.
