# Generador de Catálogos PDF

Generador automático de catálogos PDF con Node.js, Express, MongoDB y React PDF.

## Características

- **Backend**: Node.js con Express
- **Base de datos**: MongoDB
- **Generación PDF**: @react-pdf/renderer
- **Diseño**: Minimalista y profesional con tipografía Poppins
- **Paginación**: Automática (4 productos por página)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar MongoDB:
   - Asegúrate de tener MongoDB ejecutándose
   - Modifica la URL de conexión en `.env` si es necesario

3. Iniciar el servidor:
```bash
npm start
```

O para desarrollo con auto-reload:
```bash
npm run dev
```

## Uso

### Generar Catálogo

Visita: `http://localhost:5100/catalogo`

Esto descargará automáticamente un PDF con todos los productos que cumplan los criterios:
- Sin stock (cantidad = 0)
- Con movimiento en los últimos 90 días
- Del depósito "Central Shop"

### Endpoint de Salud

Verifica que el servidor esté funcionando: `http://localhost:5100/health`

## Estructura del Proyecto

```
catalogo/
├── models/
│   └── Producto.js          # Modelo de MongoDB
├── pdf/
│   └── CatalogoPDF.jsx      # Componente React PDF
├── server.js                # Servidor Express principal
├── package.json             # Dependencias del proyecto
├── .env                     # Variables de entorno
└── README.md                # Este archivo
```

## Configuración

### Variables de Entorno (.env)

- `MONGODB_URI`: URL de conexión a MongoDB
- `PORT`: Puerto del servidor (default: 5100)
- `NODE_ENV`: Entorno de ejecución

### Formato de Producto en MongoDB

El modelo espera productos con la siguiente estructura:

```javascript
{
  "codigo": "9565",
  "nombre": "BEBEDERO MIDEA DE PIE...",
  "marca": { "nombre": "Midea" },
  "precio": 1396600,
  "cantidad": 0,
  "dias_ultimo_movimiento": 7,
  "deposito": "Central Shop",
  "categorias": [{ "nombre": "Electrodomésticos" }],
  "subcategorias": [{ "nombre": "Refrigeración" }],
  "imagenes": [{
    "url": {
      "1000": "9565/0111255493/1000.webp"
    }
  }]
}
```

## Características del PDF

- **Diseño**: Limpio y profesional
- **Tipografía**: Poppins (con fallback a fuentes del sistema)
- **Layout**: 4 productos por página en formato 2x2
- **Información por producto**:
  - Imagen (1000px de resolución)
  - Nombre del producto
  - Marca
  - Categoría y subcategoría
  - Precio formateado
- **Paginación**: Automática con numeración
- **Header**: Solo en la primera página
- **Footer**: Información de la empresa

## Troubleshooting

### Error de conexión a MongoDB
- Verifica que MongoDB esté ejecutándose
- Revisa la URL de conexión en `.env`

### Error al generar PDF
- Verifica que las URLs de las imágenes sean accesibles
- Revisa los logs del servidor para más detalles

### No se encuentran productos
- Verifica que existan productos en la base de datos que cumplan los criterios
- Revisa los filtros de la consulta en `server.js`