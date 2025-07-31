const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { renderToBuffer } = require('@react-pdf/renderer');
const Producto = require('./models/Producto');
const CatalogoPDF = require('./pdf/CatalogoPDF');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
let mongoConnected = false;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/catalogo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
  mongoConnected = true;
})
.catch(err => {
  console.error('Error conectando a MongoDB:', err);
  console.log('Continuando sin MongoDB - usando datos de ejemplo');
});

// Datos de ejemplo para cuando MongoDB no esté disponible
const productosEjemplo = [
  {
    _id: '65556e2c6f5574ec1f4070af',
    codigo: '9565',
    nombre: 'BEBEDERO MIDEA DE PIE P/BOTELLON F/C CON BOTELLON INTERNO YL1633S',
    marca: { nombre: 'Midea' },
    precio: 1396600,
    cantidad: 0,
    dias_ultimo_movimiento: 7,
    deposito: 'Central Shop',
    categorias: [{ nombre: 'Electrodomésticos' }],
    subcategorias: [{ nombre: 'Refrigeración' }],
    imagenes: [{
      url: { '1000': 'https://f.fcdn.app/imgs/22f038/www.bristol.com.py/brispy/b7da/original/catalogo/0101156_0101156_1/1920-1200/bebedero-midea-de-pie-frio-y-caliente-para-botellon-yl1533s-bebedero-midea-de-pie-frio-y-caliente-para-botellon-yl1533s.jpg' }
    }]
  },
  {
    _id: '65556e2c6f5574ec1f4070b0',
    codigo: '9566',
    nombre: 'MICROONDAS SAMSUNG 23L DIGITAL MS23K3513AS/ZS',
    marca: { nombre: 'Samsung' },
    precio: 899900,
    cantidad: 0,
    dias_ultimo_movimiento: 15,
    deposito: 'Central Shop',
    categorias: [{ nombre: 'Electrodomésticos' }],
    subcategorias: [{ nombre: 'Cocina' }],
    imagenes: [{
      url: { '1000': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Lc3NywvfkA6ndOaGq496BTwiuB5sXp_TyA&s' }
    }]
  },
  {
    _id: '65556e2c6f5574ec1f4070b1',
    codigo: '9567',
    nombre: 'TELEVISOR LG 43" SMART TV 4K UHD 43UP7500PSB',
    marca: { nombre: 'LG' },
    precio: 2599000,
    cantidad: 0,
    dias_ultimo_movimiento: 30,
    deposito: 'Central Shop',
    categorias: [{ nombre: 'Electrónicos' }],
    subcategorias: [{ nombre: 'Televisores' }],
    imagenes: [{
      url: { '1000': 'https://merkamax.com.bo/wp-content/uploads/2021/06/Televisor-UHD-4K-LG-43UP7500PSF-Merkamax.jpg' }
    }]
  },
  {
    _id: '65556e2c6f5574ec1f4070b2',
    codigo: '9568',
    nombre: 'LAVARROPAS WHIRLPOOL 7KG CARGA FRONTAL WWF70B',
    marca: { nombre: 'Whirlpool' },
    precio: 1899000,
    cantidad: 0,
    dias_ultimo_movimiento: 45,
    deposito: 'Central Shop',
    categorias: [{ nombre: 'Electrodomésticos' }],
    subcategorias: [{ nombre: 'Lavado' }],
    imagenes: [{
      url: { '1000': 'https://whirlpoolarg.vtexassets.com/arquivos/ids/164112/WNQ07.png?v=638747934738230000' }
    }]
  },
  {
    _id: '65556e2c6f5574ec1f4070b3',
    codigo: '9569',
    nombre: 'AIRE ACONDICIONADO SPLIT INVERTER 3000F BGH SILENT AIR',
    marca: { nombre: 'BGH' },
    precio: 1299000,
    cantidad: 0,
    dias_ultimo_movimiento: 60,
    deposito: 'Central Shop',
    categorias: [{ nombre: 'Climatización' }],
    subcategorias: [{ nombre: 'Aire Acondicionado' }],
    imagenes: [{
      url: { '1000': 'https://static.bidcom.com.ar/publicacionesML/productos/KAIREA24/1000x1000-KAIREA24.jpg' }
    }]
  }
];

// Endpoint para generar catálogo PDF
app.get('/catalogo', async (req, res) => {
  try {
    console.log('Iniciando generación de catálogo...');
    
    let productos;
    
    if (mongoConnected) {
      // Consultar productos sin stock con movimiento en últimos 90 días del depósito Central Shop
      productos = await Producto.find({
        cantidad: 0,
        dias_ultimo_movimiento: { $lte: 90 },
        deposito: "Central Shop"
      }).lean();
      console.log(`Encontrados ${productos.length} productos desde MongoDB`);
    } else {
      // Usar datos de ejemplo
      productos = productosEjemplo;
      console.log(`Usando ${productos.length} productos de ejemplo (MongoDB no disponible)`);
    }

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos para el catálogo' });
    }

    // Generar PDF
    const pdfBuffer = await renderToBuffer(CatalogoPDF({ productos }));

    // Configurar headers para descarga del PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="catalogo.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Enviar PDF
    res.send(pdfBuffer);
    
    console.log('Catálogo PDF generado exitosamente');
  } catch (error) {
    console.error('Error generando catálogo:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: error.message 
    });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Catálogo disponible en http://localhost:${PORT}/catalogo`);
});