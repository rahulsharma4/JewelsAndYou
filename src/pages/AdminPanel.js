import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    featured: false,
    image: null
  });
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await api.getProfile();
      if (user.role !== 'admin') {
        navigate('/');
        return;
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getAdminProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await api.exportProducts();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImporting(true);
    try {
      await api.bulkImportProducts(file);
      alert("Products imported successfully!");
      loadProducts();
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Check CSV format.");
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('📁 Image selected:', file);
    if (file) {
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
    }
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('featured', formData.featured);
      
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else if (editingProduct && editingProduct.image) {
        formDataToSend.append('currentImage', editingProduct.image);
      }

      const url = `${editingProduct ? `/${editingProduct._id}` : ''}`;
      
      const result = await api.fetchWithAuth(`/admin/products${url}`, {
        method: editingProduct ? 'PUT' : 'POST',
        body: formDataToSend
      });

      console.log('✅ Success:', result);
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        featured: false,
        image: null
      });
      loadProducts();
    } catch (error) {
      console.error('❌ Error saving product:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      image: product.image // Preserve existing image
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.fetchWithAuth(`/admin/products/${productId}`, {
          method: 'DELETE'
        });
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-teal text-brand-off flex items-center justify-center">
        <div className="text-center">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-teal text-brand-off p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".csv" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={importing}
              className="px-4 py-2 border border-brand-gold text-brand-gold rounded-lg font-semibold hover:bg-brand-gold/10 transition-colors disabled:opacity-50"
            >
              {importing ? 'Importing...' : 'Bulk Import'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-brand-off/30 text-brand-off rounded-lg font-semibold hover:bg-brand-off/5 transition-colors"
            >
              Export CSV
            </button>
            <motion.button
              onClick={() => {
                setEditingProduct(null);
                setShowAddForm(true);
                setFormData({
                    name: "",
                    price: "",
                    description: "",
                    category: "",
                    stock: "",
                    featured: false,
                    image: null
                });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-brand-gold text-brand-tealDark rounded-lg font-semibold"
            >
              Add New Product
            </motion.button>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-tealDark p-6 rounded-lg mb-8 border border-brand-gold/20"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                >
                  <option value="" style={{background:"#0f2a2c"}}>Select Category</option>
                  <option value="Rings" style={{background:"#0f2a2c"}}>Rings</option>
                  <option value="Necklaces" style={{background:"#0f2a2c"}}>Necklaces</option>
                  <option value="Earrings" style={{background:"#0f2a2c"}}>Earrings</option>
                  <option value="Bracelets" style={{background:"#0f2a2c"}}>Bracelets</option>
                  <option value="Pendants" style={{background:"#0f2a2c"}}>Pendants</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2 h-20"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Product Image</label>
                {editingProduct && editingProduct.image && (
                  <div className="mb-3">
                    <p className="text-sm text-brand-off/70 mb-2">Current Image:</p>
                    <img 
                      src={getImageUrl(editingProduct.image)} 
                      alt="Current product" 
                      className="w-20 h-20 object-cover rounded border border-brand-gold/20"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                />
                {formData.image && formData.image instanceof File && (
                  <div className="mt-3">
                    <p className="text-sm text-brand-off/70 mb-2">New Image Preview:</p>
                    <img 
                      src={URL.createObjectURL(formData.image)} 
                      alt="New product" 
                      className="w-20 h-20 object-cover rounded border border-brand-gold/20"
                    />
                  </div>
                )}
                <p className="text-xs text-brand-off/60 mt-1">
                  {editingProduct ? 'Select a new image to replace the current one, or leave empty to keep current image' : 'Select an image for this product'}
                </p>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Featured Product
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-brand-gold text-brand-tealDark rounded-lg font-semibold"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      price: "",
                      description: "",
                      category: "",
                      stock: "",
                      featured: false,
                      image: null
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 border border-brand-off/30 rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products List */}
        <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 overflow-hidden">
          <div className="p-6 border-b border-brand-off/20">
            <h2 className="text-xl font-bold">Products ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-teal/20">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Featured</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-brand-off/10 hover:bg-brand-teal/10"
                  >
                    <td className="p-4">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 font-semibold">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 text-brand-gold">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(product)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(product._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


