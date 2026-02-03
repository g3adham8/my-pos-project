import { useMemo } from 'react';
import { useApp, useCart } from '../../context/AppContext';
import { Product } from '../../types';

export function ProductGrid() {
  const { state } = useApp();
  const { addToCart } = useCart();
  const { products, selectedCategory, searchTerm } = state;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.isActive) return false;
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { color: 'bg-red-100 text-red-700', text: 'Out of Stock' };
    if (product.stock <= product.minStock) return { color: 'bg-amber-100 text-amber-700', text: `Low: ${product.stock}` };
    return { color: 'bg-green-100 text-green-700', text: `${product.stock} in stock` };
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
        <span className="text-7xl mb-4">🔍</span>
        <p className="text-xl font-medium">No products found</p>
        <p className="text-sm mt-1">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
      {filteredProducts.map((product) => {
        const stockStatus = getStockStatus(product);
        const isOutOfStock = product.stock === 0;
        
        return (
          <button
            key={product.id}
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            className={`bg-white rounded-xl p-3 border border-gray-100 transition-all group relative overflow-hidden ${
              isOutOfStock 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:shadow-lg hover:border-indigo-300 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {/* Quick Add Badge */}
            {!isOutOfStock && (
              <div className="absolute top-2 right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <span className="text-lg">+</span>
              </div>
            )}

            {/* Product Image */}
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
              {product.image}
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate" title={product.name}>
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 mb-2">{product.sku}</p>

            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <p className="text-indigo-600 font-bold text-lg">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>

            {/* Tax indicator */}
            {product.taxRate > 0 && (
              <div className="absolute bottom-2 right-2">
                <span className="text-xs text-gray-400">+tax</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
