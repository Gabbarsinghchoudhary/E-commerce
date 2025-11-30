import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Package, AlertTriangle, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { productAPI, Product as APIProduct, handleAPIError } from '../services/api';

// Convert backend Product to frontend Product format
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  stock: number;
}

export const ManageProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [productList, setProductList] = useState<Product[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      
      // Convert backend products to frontend format
      const convertedProducts: Product[] = response.products.map((p: APIProduct) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
        category: p.category,
        inStock: p.inStock,
        stock: (p as any).stock || 0,
      }));
      
      setProductList(convertedProducts);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      // Call the delete API
      await productAPI.deleteProduct(productId);
      
      // Remove from local state on success
      setProductList(prev => prev.filter(p => p.id !== productId));
      setDeleteConfirm(null);
      toast.success('Product deleted successfully!');
    } catch (err) {
      const errorMessage = handleAPIError(err);
      toast.error(errorMessage || 'Failed to delete product');
    }
  };

  const handleView = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleUpdateStock = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: stockValue }),
      });

      if (response.ok) {
        setProductList(prev =>
          prev.map(p =>
            p.id === productId
              ? { ...p, stock: stockValue, inStock: stockValue > 0 }
              : p
          )
        );
        setEditingStock(null);
        toast.success('Stock updated successfully!');
      } else {
        toast.error('Failed to update stock');
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      toast.error('Failed to update stock');
    }
  };

  const startEditingStock = (productId: string, currentStock: number) => {
    setEditingStock(productId);
    setStockValue(currentStock);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Manage Products</h1>
          </div>
          <div className="text-gray-400">
            Total: <span className="text-cyan-400 font-bold">{productList.length}</span> products
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : productList.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-cyan-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">{product.category}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-cyan-400">Rs {product.price}</span>
                      <span className="text-lg font-semibold text-gray-400 line-through">Rs {Math.round(product.price * 1.2)}</span>
                    </div>
                  </div>

                  {/* Stock Section */}
                  <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                    {editingStock === product.id ? (
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Update Stock</label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={stockValue}
                            onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          />
                          <button
                            onClick={() => handleUpdateStock(product.id)}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStock(null)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Stock</p>
                          <p className="text-lg font-bold text-white">{product.stock} units</p>
                          <span
                            className={`text-sm font-semibold ${
                              product.inStock ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <button
                          onClick={() => startEditingStock(product.id, product.stock)}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Edit Stock"
                        >
                          <Edit className="h-4 w-4 text-cyan-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(product.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl border border-red-500/30 p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-500/20 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
