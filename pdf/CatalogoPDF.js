const React = require('react');
const { Document, Page, Text, View, StyleSheet, Image, Font } = require('@react-pdf/renderer');

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: '2px solid #E5E7EB',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'normal',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  productCard: {
    width: '48%',
    marginBottom: 25,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 15,
    border: '1px solid #E5E7EB',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '100%',
    height: 120,
    objectFit: 'contain',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  productName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 1.3,
    minHeight: 28,
  },
  productBrand: {
    fontSize: 10,
    color: '#ff7300',
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productCategory: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 2,
  },
  productSubcategory: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff7300',
    textAlign: 'right',
    backgroundColor: '#ffdec3',
    padding: 6,
    borderRadius: 6,
    border: '1px solid #ff9b49',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 10,
    color: '#6B7280',
  },
  noImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #D1D5DB',
  },
  noImageText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

// Componente para renderizar un producto individual
const ProductCard = ({ producto }) => {
  // Obtener URL de imagen
  const getImageUrl = () => {
    if (producto.imagenes && producto.imagenes.length > 0 && producto.imagenes[0].url && producto.imagenes[0].url['1000']) {
      return `https://sdmntprcentralus.oaiusercontent.com/files/00000000-8e60-61f5-9fa9-a5186ad42b06/raw?se=2025-07-31T14%3A31%3A54Z&sp=r&sv=2024-08-04&sr=b&scid=56528464-122c-5165-85c6-b16a6c0b8305&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-30T22%3A38%3A21Z&ske=2025-07-31T22%3A38%3A21Z&sks=b&skv=2024-08-04&sig=%2B1OvIIwwBUmQ07MakSTlKpFVsqTGii2zMIIect1C8HA%3D`;
    }
    return null;
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Truncar texto largo
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const imageUrl = getImageUrl();
  const categoria = producto.categorias && producto.categorias.length > 0 ? producto.categorias[0].nombre : 'Sin categoría';
  const subcategoria = producto.subcategorias && producto.subcategorias.length > 0 ? producto.subcategorias[0].nombre : 'Sin subcategoría';

  return React.createElement(View, { style: styles.productCard },
    React.createElement(View, { style: styles.noImage },
      React.createElement(Text, { style: styles.noImageText }, 'Imagen no disponible')
    ),
    React.createElement(Text, { style: styles.productBrand },
      (producto.marca && producto.marca.nombre) || 'Sin marca'
    ),
    React.createElement(Text, { style: styles.productName },
      truncateText(producto.nombre)
    ),
    React.createElement(Text, { style: styles.productCategory },
      categoria
    ),
    React.createElement(Text, { style: styles.productSubcategory },
      subcategoria
    ),
    React.createElement(Text, { style: styles.productPrice },
      formatPrice(producto.precio)
    )
  );
};

// Componente principal del catálogo
const CatalogoPDF = ({ productos }) => {
  // Dividir productos en páginas (4 productos por página)
  const productosPerPage = 4;
  const pages = [];
  
  for (let i = 0; i < productos.length; i += productosPerPage) {
    pages.push(productos.slice(i, i + productosPerPage));
  }

  const totalPages = pages.length;
  const fechaGeneracion = new Date().toLocaleDateString('es-PY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return React.createElement(Document, null,
    pages.map((pageProducts, pageIndex) => 
      React.createElement(Page, { key: pageIndex, size: 'A4', style: styles.page },
        // Header solo en la primera página
        pageIndex === 0 && React.createElement(View, { style: styles.header },
          React.createElement(Text, { style: styles.title }, 'Catálogo de Productos'),
          React.createElement(Text, { style: styles.subtitle },
            `Productos sin stock con movimiento reciente - ${fechaGeneracion}`
          )
        ),
        // Contenedor de productos
        React.createElement(View, { style: styles.productsContainer },
          pageProducts.map((producto, index) => 
            React.createElement(ProductCard, { 
              key: producto._id || index, 
              producto: producto 
            })
          )
        ),
        // Footer
        React.createElement(Text, { style: styles.footer },
          'Central Shop - Catálogo generado automáticamente'
        ),
        // Número de página
        React.createElement(Text, { style: styles.pageNumber },
          `Página ${pageIndex + 1} de ${totalPages}`
        )
      )
    )
  );
};

module.exports = CatalogoPDF;