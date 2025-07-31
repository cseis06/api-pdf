const mongoose = require('mongoose');

// Esquema para las marcas
const marcaSchema = new mongoose.Schema({
  nombre: String,
  ruta: String
}, { _id: false });

// Esquema para categorías
const categoriaSchema = new mongoose.Schema({
  nombre: String,
  ruta: String,
  _id: mongoose.Schema.Types.ObjectId
});

// Esquema para subcategorías
const subcategoriaSchema = new mongoose.Schema({
  nombre: String,
  ruta: String,
  _id: mongoose.Schema.Types.ObjectId
});

// Esquema para las imágenes
const imagenSchema = new mongoose.Schema({
  variante: String,
  formato: String,
  url: {
    "60": String,
    "100": String,
    "300": String,
    "600": String,
    "1000": String
  }
}, { _id: false });

// Esquema principal del producto
const productoSchema = new mongoose.Schema({
  codigo: String,
  codigoBarra: String,
  marca: marcaSchema,
  modelo: String,
  nombre: String,
  ruta: String,
  descripcion: String,
  venta: Number,
  costo: Number,
  precio: Number,
  cantidad: Number,
  descuento: Number,
  categorias: [categoriaSchema],
  subcategorias: [subcategoriaSchema],
  caracteristicas: [mongoose.Schema.Types.Mixed],
  clasificaciones: [mongoose.Schema.Types.Mixed],
  ofertas: [mongoose.Schema.Types.Mixed],
  promos: [mongoose.Schema.Types.Mixed],
  proveedores: [String],
  imagenes: [imagenSchema],
  imagen: String,
  sello: String,
  dias_ultimo_movimiento: Number,
  web: Number,
  websc: Number,
  prioridad: Number,
  orden: Number,
  tipo: Number,
  estado: Number,
  deposito: String,
  fecha_actualizacion: Date,
  total_venta: Number,
  __v: Number
}, {
  collection: 'productos'
});

// Método para obtener la URL completa de la imagen
productoSchema.methods.getImagenCompleta = function() {
  if (this.imagenes && this.imagenes.length > 0 && this.imagenes[0].url && this.imagenes[0].url['1000']) {
    return `https://sdmntprcentralus.oaiusercontent.com/files/00000000-8e60-61f5-9fa9-a5186ad42b06/raw?se=2025-07-31T14%3A31%3A54Z&sp=r&sv=2024-08-04&sr=b&scid=56528464-122c-5165-85c6-b16a6c0b8305&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-30T22%3A38%3A21Z&ske=2025-07-31T22%3A38%3A21Z&sks=b&skv=2024-08-04&sig=%2B1OvIIwwBUmQ07MakSTlKpFVsqTGii2zMIIect1C8HA%3D`;
  }
  return null;
};

// Método para obtener la primera categoría
productoSchema.methods.getPrimeraCategoria = function() {
  return this.categorias && this.categorias.length > 0 ? this.categorias[0].nombre : 'Sin categoría';
};

// Método para obtener la primera subcategoría
productoSchema.methods.getPrimeraSubcategoria = function() {
  return this.subcategorias && this.subcategorias.length > 0 ? this.subcategorias[0].nombre : 'Sin subcategoría';
};

// Método para formatear el precio
productoSchema.methods.getPrecioFormateado = function() {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0
  }).format(this.precio);
};

module.exports = mongoose.model('Producto', productoSchema);