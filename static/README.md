# Multiplaza Analytics — Despliegue Hostinger

Sitio estático para `navajowhite-tapir-160632.hostingersite.com`.

## Archivos

- `index.html` — Dashboard principal (KPIs, tendencia, estados, top tiendas/departamentos)
- `pedidos.html` — Tabla detallada de pedidos con filtros, búsqueda, paginación y export CSV
- `api/excel.php` — **Pendiente**. Backend que descarga el Excel de SharePoint y lo devuelve como `arraybuffer`. Ambas páginas hacen `fetch('/api/excel.php')`.

## Por qué se reescribió `index.html`

La versión anterior usaba un patrón de "bundler auto-extraíble" que decodificaba un manifest base64 enorme y reemplazaba el DOM en runtime. Quedaba colgado en "Cargando dashboard…" porque el unpacking fallaba o tardaba demasiado.

La versión actual:

1. Renderiza el `#loader` inmediatamente (HTML estático, primer paint < 100ms).
2. En `DOMContentLoaded` oculta el loader y muestra el `#dashboard` ya construido — el usuario ve el dashboard al instante.
3. La carga de datos vía `/api/excel.php` ocurre en segundo plano sin bloquear la UI; los KPIs y gráficos se rellenan cuando llegan los datos.
4. Si `/api/excel.php` no responde, la UI sigue siendo navegable (chip "Sin datos en vivo").

## Cómo desplegar

Subir por FTP a la raíz del hosting:

```
public_html/
  index.html
  pedidos.html
  api/
    excel.php
```
