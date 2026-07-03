import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";
import {
  Gem, Settings, UploadCloud, Plus, Edit2, Trash2,
  Download, TrendingUp, Scale
} from "lucide-react";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [importing, setImporting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    featured: false,
    image: null,
    priceType: "fixed",
    weight: "",
    metalType: "None",
    makingCharge: ""
  });

  // Settings states
  const [siteSettings, setSiteSettings] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    promoText: '',
    promoActive: true,
    heroImage: null,
    currentHeroImage: null,
    metalRates: {
      gold24k: 7200,
      gold22k: 6600,
      gold18k: 5400,
      silver: 90,
      platinum: 3500
    }
  });

  const fileInputRef = useRef(null);
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
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getAdminProducts({ limit: 100 });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        setSiteSettings({
          heroTitle: data.hero?.title || '',
          heroSubtitle: data.hero?.subtitle || '',
          heroDescription: data.hero?.description || '',
          promoText: data.promotions?.bannerText || '',
          promoActive: data.promotions?.isActive !== false,
          heroImage: null,
          currentHeroImage: data.hero?.image || null,
          metalRates: data.metalRates || {
            gold24k: 7200,
            gold22k: 6600,
            gold18k: 5400,
            silver: 90,
            platinum: 3500
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      loadSettings();
    }
  }, [activeTab]);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  // Preview Price for Weight-Based Calculation
  const calculatedPreviewPrice = (() => {
    if (formData.priceType === 'fixed') {
      return Number(formData.price) || 0;
    }
    const weight = Number(formData.weight) || 0;
    const making = Number(formData.makingCharge) || 0;
    
    let rate = 0;
    const rates = siteSettings.metalRates;
    switch (formData.metalType) {
      case 'Gold 24K': rate = rates.gold24k; break;
      case 'Gold 22K': rate = rates.gold22k; break;
      case 'Gold 18K': rate = rates.gold18k; break;
      case 'Silver': rate = rates.silver; break;
      case 'Platinum': rate = rates.platinum; break;
      default: rate = 0; break;
    }
    return Math.round((weight * rate) + making);
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('priceType', formData.priceType);
      
      if (formData.priceType === 'fixed') {
        formDataToSend.append('price', formData.price);
        formDataToSend.append('weight', 0);
        formDataToSend.append('metalType', 'None');
        formDataToSend.append('makingCharge', 0);
      } else {
        formDataToSend.append('price', calculatedPreviewPrice); // Stored as computed default
        formDataToSend.append('weight', formData.weight);
        formDataToSend.append('metalType', formData.metalType);
        formDataToSend.append('makingCharge', formData.makingCharge);
      }
      
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else if (editingProduct && editingProduct.image) {
        formDataToSend.append('currentImage', editingProduct.image);
      }

      const url = `${editingProduct ? `/${editingProduct._id}` : ''}`;
      
      await api.fetchWithAuth(`/admin/products${url}`, {
        method: editingProduct ? 'PUT' : 'POST',
        body: formDataToSend
      });

      setShowAddForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      alert(`Error saving product: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      featured: false,
      image: null,
      priceType: "fixed",
      weight: "",
      metalType: "None",
      makingCharge: ""
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price ? product.price.toString() : "",
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      image: product.image,
      priceType: product.priceType || "fixed",
      weight: product.weight ? product.weight.toString() : "",
      metalType: product.metalType || "None",
      makingCharge: product.makingCharge ? product.makingCharge.toString() : ""
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

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heroTitle', siteSettings.heroTitle);
      formDataToSend.append('heroSubtitle', siteSettings.heroSubtitle);
      formDataToSend.append('heroDescription', siteSettings.heroDescription);
      formDataToSend.append('promoText', siteSettings.promoText);
      formDataToSend.append('promoActive', siteSettings.promoActive);
      formDataToSend.append('metalRates', JSON.stringify(siteSettings.metalRates));
      
      if (siteSettings.heroImage) {
        formDataToSend.append('heroImage', siteSettings.heroImage);
      }

      await api.updateSettings(formDataToSend);
      alert('Settings & Metal Rates updated successfully!');
      loadSettings();
    } catch (error) {
      alert('Error updating settings: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-teal text-brand-off flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Gem className="w-10 h-10 animate-spin text-brand-gold" />
          <span>Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-teal text-brand-off p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-brand-gold/10 pb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-brand-off/60 text-sm mt-1">Manage luxury collections and live metal configurations</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-brand-tealDark rounded-xl border border-brand-gold/10 max-w-fit">
            <button
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'products' ? 'bg-brand-gold text-brand-tealDark' : 'text-brand-off/70 hover:bg-brand-teal/20'
              }`}
            >
              <Gem className="w-4 h-4" /> Products
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'settings' ? 'bg-brand-gold text-brand-tealDark' : 'text-brand-off/70 hover:bg-brand-teal/20'
              }`}
            >
              <Settings className="w-4 h-4" /> Store Settings
            </button>
          </div>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h2 className="text-xl font-bold font-heading">Inventory List ({products.length})</h2>
              
              <div className="flex gap-2">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-gold/30 text-brand-gold rounded-lg text-sm font-semibold hover:bg-brand-gold/5 transition disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" /> Import CSV
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-off/20 text-brand-off/80 rounded-lg text-sm font-semibold hover:bg-brand-off/5 transition"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                    setShowAddForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-gold text-brand-tealDark rounded-lg text-sm font-bold shadow-lg shadow-brand-gold/10"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
            </div>

            {/* Add / Edit Form Modal */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-brand-tealDark p-6 rounded-2xl border border-brand-gold/20 shadow-xl"
                >
                  <h3 className="text-lg font-bold font-heading mb-4 text-brand-gold border-b border-brand-gold/10 pb-2">
                    {editingProduct ? 'Edit Product Details' : 'Introduce New Product'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-off/15 bg-brand-tealDark px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        required
                      >
                        <option value="" disabled>Select Category</option>
                        <option value="Rings">Rings</option>
                        <option value="Necklaces">Necklaces</option>
                        <option value="Earrings">Earrings</option>
                        <option value="Bracelets">Bracelets</option>
                        <option value="Pendants">Pendants</option>
                        <option value="Watches">Watches</option>
                      </select>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Stock Inventory</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        required
                        min="0"
                      />
                    </div>

                    {/* Pricing Model */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Pricing model</label>
                      <select
                        name="priceType"
                        value={formData.priceType}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-off/15 bg-brand-tealDark px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                      >
                        <option value="fixed">Fixed Price Tag</option>
                        <option value="weight-based">Weight & Metal Dynamic Price</option>
                      </select>
                    </div>

                    {/* Dynamic Fields vs Fixed Price */}
                    {formData.priceType === 'fixed' ? (
                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Retail Price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-off/40 text-sm">₹</span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 pl-8 pr-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                            required={formData.priceType === 'fixed'}
                            min="1"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Metal Type */}
                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Metal Variant</label>
                          <select
                            name="metalType"
                            value={formData.metalType}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-brand-off/15 bg-brand-tealDark px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                            required={formData.priceType === 'weight-based'}
                          >
                            <option value="None" disabled>Select Metal</option>
                            <option value="Gold 24K">Gold 24K</option>
                            <option value="Gold 22K">Gold 22K</option>
                            <option value="Gold 18K">Gold 18K</option>
                            <option value="Silver">Silver</option>
                            <option value="Platinum">Platinum</option>
                          </select>
                        </div>

                        {/* Weight */}
                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Weight (Grams)</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              name="weight"
                              value={formData.weight}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                              required={formData.priceType === 'weight-based'}
                              placeholder="e.g. 8.45"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-off/40 text-xs">grams</span>
                          </div>
                        </div>

                        {/* Making Charge */}
                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Making Charges (Flat ₹)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-off/40 text-sm">₹</span>
                            <input
                              type="number"
                              name="makingCharge"
                              value={formData.makingCharge}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 pl-8 pr-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                              required={formData.priceType === 'weight-based'}
                              placeholder="e.g. 2500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Calculated Price Display */}
                    <div className="bg-brand-teal/20 rounded-xl p-3 border border-brand-gold/10 flex flex-col justify-center">
                      <div className="text-xs text-brand-off/50">Estimated Value</div>
                      <div className="text-lg font-bold text-brand-gold flex items-center gap-1 mt-0.5">
                        ₹{calculatedPreviewPrice.toLocaleString('en-IN')}
                        <TrendingUp className="w-4 h-4 text-brand-gold/60" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Specifications & Story</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none h-20 resize-none"
                        required
                      />
                    </div>

                    {/* Image selector */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Product Image File</label>
                      <div className="flex items-center gap-4">
                        {editingProduct && editingProduct.image && !formData.image && (
                          <img 
                            src={getImageUrl(editingProduct.image)} 
                            alt="Current" 
                            className="w-12 h-12 object-cover rounded-lg border border-brand-gold/25"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-gold/15 file:text-brand-gold hover:file:bg-brand-gold/20"
                        />
                      </div>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="mr-3 accent-brand-gold w-4 h-4 rounded"
                        />
                        <span className="text-sm font-semibold">Mark as Featured Bestseller</span>
                      </label>
                    </div>

                    {/* Action buttons */}
                    <div className="md:col-span-3 flex gap-3 border-t border-brand-gold/10 pt-4 mt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-brand-gold text-brand-tealDark rounded-lg font-bold shadow-lg hover:bg-brand-gold/90 transition"
                      >
                        {editingProduct ? 'Update Inventory' : 'Create Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingProduct(null);
                          resetForm();
                        }}
                        className="px-6 py-2.5 border border-brand-off/20 hover:bg-brand-off/5 rounded-lg font-semibold text-brand-off/80 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inventory table */}
            <div className="bg-brand-tealDark rounded-2xl border border-brand-gold/10 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-teal/40 border-b border-brand-gold/10">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Image</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Product</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Category</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Pricing Model</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Retail Value</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Stock</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-off/5">
                    {products.map((p, idx) => (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                        className="hover:bg-brand-teal/10 transition"
                      >
                        <td className="p-4">
                          <ImageWithFallback
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border border-brand-gold/10"
                          />
                        </td>
                        <td className="p-4 font-semibold text-sm max-w-[200px] truncate">{p.name}</td>
                        <td className="p-4 text-xs font-medium text-brand-off/70">{p.category}</td>
                        <td className="p-4 text-xs">
                          {p.priceType === 'weight-based' ? (
                            <span className="inline-flex items-center gap-1 text-brand-gold">
                              <Scale className="w-3.5 h-3.5" />
                              {p.metalType} ({p.weight}g)
                            </span>
                          ) : (
                            <span className="text-brand-off/50">Fixed Price</span>
                          )}
                        </td>
                        <td className="p-4 text-sm font-bold text-brand-gold">₹{p.price?.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-xs">
                          <span className={`px-2 py-1 rounded-md font-bold ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {p.stock > 0 ? `${p.stock} units` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-1.5 rounded-lg border border-brand-off/15 hover:border-brand-gold/40 text-brand-off/80 hover:text-brand-gold transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-1.5 rounded-lg border border-brand-off/15 hover:border-red-400/40 text-brand-off/80 hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Store Settings */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Rates config */}
            <div className="bg-brand-tealDark p-6 rounded-2xl border border-brand-gold/10 h-fit space-y-4">
              <h3 className="text-lg font-bold font-heading text-brand-gold border-b border-brand-gold/10 pb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Live Metal Rates (per gram)
              </h3>
              
              <div className="space-y-4">
                {/* Gold 24K */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Gold 24K Rate (₹)</label>
                  <input
                    type="number"
                    value={siteSettings.metalRates.gold24k}
                    onChange={e => setSiteSettings(prev => ({
                      ...prev,
                      metalRates: { ...prev.metalRates, gold24k: Number(e.target.value) }
                    }))}
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                  />
                </div>

                {/* Gold 22K */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Gold 22K Rate (₹)</label>
                  <input
                    type="number"
                    value={siteSettings.metalRates.gold22k}
                    onChange={e => setSiteSettings(prev => ({
                      ...prev,
                      metalRates: { ...prev.metalRates, gold22k: Number(e.target.value) }
                    }))}
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                  />
                </div>

                {/* Gold 18K */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Gold 18K Rate (₹)</label>
                  <input
                    type="number"
                    value={siteSettings.metalRates.gold18k}
                    onChange={e => setSiteSettings(prev => ({
                      ...prev,
                      metalRates: { ...prev.metalRates, gold18k: Number(e.target.value) }
                    }))}
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                  />
                </div>

                {/* Silver */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Silver Rate (₹)</label>
                  <input
                    type="number"
                    value={siteSettings.metalRates.silver}
                    onChange={e => setSiteSettings(prev => ({
                      ...prev,
                      metalRates: { ...prev.metalRates, silver: Number(e.target.value) }
                    }))}
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                  />
                </div>

                {/* Platinum */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Platinum Rate (₹)</label>
                  <input
                    type="number"
                    value={siteSettings.metalRates.platinum}
                    onChange={e => setSiteSettings(prev => ({
                      ...prev,
                      metalRates: { ...prev.metalRates, platinum: Number(e.target.value) }
                    }))}
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Banner details config */}
            <div className="bg-brand-tealDark p-6 rounded-2xl border border-brand-gold/10 lg:col-span-2 space-y-5">
              <h3 className="text-lg font-bold font-heading text-brand-gold border-b border-brand-gold/10 pb-2">
                Storefront Banner Configuration
              </h3>
              
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={siteSettings.heroTitle}
                      onChange={e => setSiteSettings(prev => ({...prev, heroTitle: e.target.value}))}
                      className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Hero Subtitle</label>
                    <input
                      type="text"
                      value={siteSettings.heroSubtitle}
                      onChange={e => setSiteSettings(prev => ({...prev, heroSubtitle: e.target.value}))}
                      className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Hero Description</label>
                  <textarea
                    value={siteSettings.heroDescription}
                    onChange={e => setSiteSettings(prev => ({...prev, heroDescription: e.target.value}))}
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Hero Image</label>
                  {siteSettings.currentHeroImage && (
                    <div className="mb-3">
                      <img 
                        src={getImageUrl(siteSettings.currentHeroImage)} 
                        alt="Hero bg" 
                        className="w-32 h-16 object-cover rounded-lg border border-brand-gold/20"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) setSiteSettings(prev => ({...prev, heroImage: file}));
                    }}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-gold/15 file:text-brand-gold hover:file:bg-brand-gold/20"
                  />
                </div>

                <div className="border-t border-brand-gold/10 pt-4">
                  <h4 className="text-sm font-bold text-brand-gold mb-3">Promotional Ticker Banner</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Banner Message</label>
                      <input
                        type="text"
                        value={siteSettings.promoText}
                        onChange={e => setSiteSettings(prev => ({...prev, promoText: e.target.value}))}
                        className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                      />
                    </div>
                    
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={siteSettings.promoActive}
                        onChange={e => setSiteSettings(prev => ({...prev, promoActive: e.target.checked}))}
                        className="mr-3 accent-brand-gold w-4 h-4 rounded"
                      />
                      <span className="text-sm font-semibold">Enable Promotions Banner</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-brand-gold/10 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-brand-gold text-brand-tealDark rounded-lg font-bold shadow-lg hover:bg-brand-gold/90 transition"
                  >
                    Save Changes & Live Rates
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
