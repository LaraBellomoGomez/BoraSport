# Handoff: Bora Sports — Rediseño Web

## Overview
Rediseño completo del sitio de e-commerce de indumentaria de ciclismo **Bora Sports** (borasports.com.ar). Inspiración de layout: **Ganga Home** (gangahome.com.ar) para la home — barra de promos, mega-grid de accesos rápidos, secciones de producto con cuotas/envío gratis, franja de medios de pago, footer legal. Paleta e identidad: negro + marrón/bronce (marca Bora Sports), no la de Ganga Home. Diseño original, no una copia.

**Usar `Home-v2.html` como la home definitiva** (es la dirección que el cliente aprobó) — `Home.html` es una primera iteración anterior, se incluye solo de referencia histórica.

## About the Design Files
Los archivos en `design_reference/` son referencias de diseño HTML — muestran layout/estilo/estructura pretendidos, no son código de producción para copiar tal cual. Recrear estos diseños en el stack real de la app.

Stack recomendado: **Next.js + React + TypeScript + Tailwind CSS + Framer Motion + lucide-react**.

Notas de implementación:
- Ignorar wrappers técnicos del prototipador (`<x-dc>`, `support.js`, `<script data-dc-script>` vacío) — el contenido relevante empieza en el `<div style="position:relative;min-height:100vh...">`.
- Todos los estilos están inline; pasar a Tailwind usando los tokens de abajo.
- Imágenes: **ya son fotos reales del catálogo** (`assets/*.webp`, `.jpg`, `.jpeg`) — no placeholders. Usarlas tal cual o reemplazar por versiones optimizadas/recortadas del mismo material.

## Fidelity
**Alta fidelidad**: colores, tipografía, espaciados, textos, datos de producto y fotos son los definitivos acordados con el cliente.

## Arquitectura de páginas / rutas sugeridas (Next.js App Router)
```
/                     → Home (basada en Home-v2.html)
/verano-2026          → Colección Verano 2026 (Verano.html)
/mujer                → Listado categoría Mujer
/hombre               → Listado categoría Hombre
/accesorios           → Listado categoría Accesorios (Fundas Ciclismo)
/quienes-somos        → Quiénes Somos
/contacto             → Contacto
```

## Design Tokens

### Colores (paleta negro + marrón/bronce)
| Token | Valor OKLCH | Uso |
|---|---|---|
| `bg-dark` | `oklch(0.14 0.015 45)` | Header, footer, secciones oscuras |
| `bg-dark-alt` | `oklch(0.1 0.015 45)` | Footer |
| `accent-bronze` | `oklch(0.7 0.1 55)` | CTAs, precios, acentos, tab activo, barra de promos |
| `text-dark` | `oklch(0.18 0.015 45)` | Títulos sobre fondo claro |
| `text-body` | `oklch(0.42-0.55 0.02 45)` | Texto de párrafo |
| `text-on-dark` | `oklch(0.82 0.02 55)` / `#fff` | Texto sobre fondo oscuro |
| `bg-light-gray` | `oklch(0.94 0 0)` | Franja de medios de pago |
| WhatsApp verde | `#25D366` | Botón flotante / CTA WhatsApp |

### Tipografía
Familia única: **Inter** (400/500/600/700/800), Google Fonts. Escala: 800 44–68px (hero), 800 26–32px (H2), 700 18px (subheads), 500–700 12–16px (body/labels/precios), 600 11–12px uppercase letter-spacing (nav, tabs, categorías).

### Espaciado / layout
- Contenedor máximo `1280–1400px` centrado, padding lateral 28–48px.
- Grillas de producto: `repeat(4, 1fr)`, gap ~24–28px.
- Header: sticky, una sola fila (logo — nav centrado con overflow-x:auto — buscar/ingresá/carrito), altura consistente en las 7 páginas.
- Botones: esquinas rectas (sin border-radius) en todo el sitio — parte de la identidad visual, excepto badges de descuento y chips de medios de pago.

## Screens / Views

### 1. Home (`/`, basada en `Home-v2.html`)
- **Barra de promos**: banda `accent-bronze`, texto en loop horizontal ("30% OFF POR TRANSFERENCIA", "3 CUOTAS SIN INTERÉS", "ENVÍOS A TODO EL PAÍS").
- **Header**: logo Bora Sports (nuevo logo, `assets/bora-logo-2.png`, fondo blanco, sin recorte circular) a la izquierda; nav centrado (Inicio, Colección Verano, Mujer, Hombre, Accesorios, Quiénes Somos, Contacto); Buscar / Ingresá / Carrito a la derecha. Todo en una sola fila, mismo alto — en mobile el nav hace scroll horizontal en vez de wrappear.
- **Banner hero**: foto ancha (ciclista en acción, `assets/hero-3.webp`) con overlay oscuro en gradiente para legibilidad + "Colección Verano 2026" / "Tecnología + confort" (con text-shadow) + CTA "Ver colección" → `/verano-2026`.
- **Accesos rápidos** (grid 4 columnas, foto + nombre): Mujer, Hombre, Accesorios, Colección Verano 2026 — cada uno con foto de modelo/producto real, no repetida con la sección de abajo.
- **"¡Los favoritos de Bora!"**: grid de 4 productos destacados con foto real, badge de % OFF, "Envío gratis", precio tachado + final, cuotas sin interés.
- **Seguinos**: link real a Instagram `@borasportsar` + grid de 6 fotos (dúo de modelos, detalles de producto).
- **Franja de medios de pago/envío**: fondo gris claro, logos reales de Visa, Mastercard, Amex, Diners, Banelco, Cabal, Link, NX, Tarjeta Shopping, Nativa, Cencosud, Argencard, Cabal Débito, Provincia NET, Maestro, Visa Débito, Pago Fácil, Rapipago + Correo Argentino (todos en `assets/pago-*.png` / `assets/envio-*.png`).
- **Newsletter**: banda oscura, input blanco + botón "Enviar" sólido bronce con texto negro.
- **Footer**: logo, columna Colección, columna Contactános (WhatsApp real, email, Instagram real, Ubicación "Próximamente"). Sin horarios (decisión del cliente).
- **Botón flotante WhatsApp**: fixed bottom-right en TODAS las páginas.

### 2. Colección Verano 2026 (`/verano-2026`, `Verano.html`)
Página de listado (sin tabs, colección única) con los 9 productos reales de la colección: Bermuda Mujer Leoa, Jersey Hombre Fénix Verde, Bermuda Mujer Calça Preta, Bermuda Mujer Calça Arena, Jersey Mujer Fénix Areia, Jersey Mujer Fénix Dourada, Bermuda Hombre Amarela, Bermuda Hombre Selva, Jersey Hombre Fénix Preto — mismo estilo de card que Mujer/Hombre (foto real, badge %, envío gratis, precio tachado+final).

### 3. Quiénes Somos (`/quienes-somos`)
Hero de marca: foto real (dúo de modelos) a la izquierda, texto a la derecha — eyebrow "Quiénes Somos", H1 "No sigas tendencias, créalas.", 2 párrafos de historia, línea destacada en bold "Sé parte de la evolución con Bora Sports.", botón "Conocenos más / Consultas por WhatsApp" (deep link con mensaje prellenado). Grid de 3 fotos reales adicionales debajo.

### 4. Contacto (`/contacto`)
Hero centrado "Contacto" / "Hablemos" + 2 tarjetas (WhatsApp real, Email real) + línea con Instagram real y "Ubicación: Próximamente".

### 5. Listados de categoría — Mujer / Hombre / Accesorios
- Mujer y Hombre comparten estructura: breadcrumb, H1, tabs ("Ver Todo" + subcategorías: Jerseys / Bermudas / Colección Verano 2026 {Género}), contador de productos dinámico, grid de cards con foto real, badge %, precio, swatch de color, chips de talle S/M/L/XL.
- **Comportamiento de tabs a replicar** (intencional, calca el sitio real):
  - "Ver Todo" → todos los productos en un único grid sin encabezados de sección.
  - "Jerseys"/"Bermudas" → solo esa subcategoría, con encabezado visible.
  - "Colección Verano 2026 {Género}" → en Mujer es un SUBCONJUNTO (Fénix Areia + Calça Arena, no todos); en Hombre son TODOS los productos (unión de jerseys+bermudas). Esta asimetría es real del sitio actual, mantenerla.
- Accesorios: una sola subcategoría "Fundas Ciclismo", 3 productos reales con foto, precio y "Envío gratis" (Full Protection $45.900, Wild Spectrum $41.500, Jungle Velocity $41.500).

## Datos de producto reales (Colección Verano 2026)

### Mujer
| Producto | Original | Final | OFF | Sub |
|---|---|---|---|---|
| Jersey Mujer — Wild Leopard | $60.200 | $40.900 | 32% | Jerseys |
| Jersey Mujer — Fénix Areia | $52.900 | $35.600 | 33% | Jerseys + Colección |
| Jersey Mujer — Fénix Dourada | $52.900 | $35.600 | 33% | Jerseys |
| Jersey Mujer — Tropical Toucan | $60.200 | $40.900 | 32% | Jerseys |
| Bermuda Mujer — Leoa | $53.600 | $39.000 | 27% | Bermudas |
| Bermuda Mujer — Calça Preta | $53.600 | $39.000 | 27% | Bermudas |
| Bermuda Mujer — Calça Arena | $54.000 | $39.000 | 28% | Bermudas + Colección |

### Hombre
| Producto | Original | Final | OFF | Sub |
|---|---|---|---|---|
| Jersey Hombre — Fénix Preto | $52.900 | $37.500 | 29% | Jerseys + Colección |
| Jersey Hombre — Fénix Verde | $52.900 | $37.500 | 29% | Jerseys + Colección |
| Bermuda Hombre — Selva | $53.600 | $39.000 | 27% | Bermudas + Colección |
| Bermuda Hombre — Amarela | $53.600 | $39.000 | 27% | Bermudas + Colección |

### Accesorios (Fundas Ciclismo)
Full Protection — Cobertor Completo $51.900→$45.900 (12% OFF); Wild Spectrum — Cubre Ruedas $45.900→$41.500 (10% OFF, envío gratis); Jungle Velocity — Cubre Ruedas $45.900→$41.500 (10% OFF, envío gratis).

## Información de contacto (real)
- WhatsApp: **+54 011 3899 0252** — `https://wa.me/5401138990252`
- Email: **borasportsinfo@gmail.com**
- Instagram: **@borasportsar** — `https://instagram.com/borasportsar`
- Ubicación: no publicada — "Próximamente"
- Sin horarios (decisión del cliente)

## Interactions & Behavior
- Tabs de categoría: estado local (`useState`), sin backend.
- Header: una sola fila en desktop; nav con overflow-x scroll en vez de wrap en mobile.
- Botón WhatsApp flotante: fixed, en todas las páginas.
- Sin carrito funcional (visual únicamente).
- Responsive: adaptar mobile-first siguiendo Tailwind breakpoints — header colapsa a hamburguesa, grids de producto a 2 col (mobile)/3 col (tablet), hero de banner a foto simple full-bleed.

## Assets (todas son fotos/logos REALES, no placeholders)
- `assets/bora-logo-2.png` — logo vigente (usar este, no `bora-logo.jpeg` que es una versión anterior).
- `assets/jersey-*.webp`, `assets/bermuda-*.webp` — fotos de producto por SKU (nombre de archivo = nombre de producto).
- `assets/funda-*.webp` — fotos de accesorios.
- `assets/hero-*.webp`, `assets/duo-*.jpg`, `assets/accion-ciclista.jpg`, `assets/leoa-back-*.jpg`, `assets/calza-arena-back.jpg` — fotos editoriales/de marca para hero, Quiénes Somos, Instagram feed.
- `assets/pago-*.png`, `assets/envio-correo-argentino.png` — logos reales de medios de pago y envío.

## Files
- `design_reference/Home-v2.html` — **home definitiva** (usar esta)
- `design_reference/Home.html` — iteración anterior de home (referencia histórica, no usar)
- `design_reference/Verano.html` — Colección Verano 2026
- `design_reference/Mujer.html`, `Hombre.html`, `Accesorios.html` — listados de categoría
- `design_reference/QuienesSomos.html`, `Contacto.html`
- `assets/` — todas las fotos e imágenes reales usadas

Cada HTML abre directo en navegador (rutas de imagen relativas a `assets/` en la misma carpeta).
# BoraSport
