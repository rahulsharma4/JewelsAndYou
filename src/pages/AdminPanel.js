import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";
import {
  Gem, Settings, UploadCloud, Plus, Edit2, Trash2,
  Download, TrendingUp, Scale, Tag, Star
} from "lucide-react";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [importing, setImporting] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewMaterial, setIsNewMaterial] = useState(false);
  const [isNewColor, setIsNewColor] = useState(false);
  
  // Tag editing state
  const [editingCategory, setEditingCategory] = useState({ oldName: '', newName: '' });
  const [editingMaterial, setEditingMaterial] = useState({ oldName: '', newName: '' });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    material: "",
    color: "",
    stock: "",
    featured: false,
    images: [],
    imageColors: [],
    priceType: "fixed",
    weight: "",
    metalType: "None",
    makingCharge: ""
  });

  // Settings states
  const [siteSettings, setSiteSettings] = useState({
    aboutTitle: '',
    aboutDescription: '',
    aboutImage: null,
    currentAboutImage: null,
    promoText: '',
    promoActive: true,
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
          aboutTitle: data.about?.title || '',
          aboutDescription: data.about?.description || '',
          aboutImage: null,
          currentAboutImage: data.about?.image || null,
          promoText: data.promotions?.bannerText || '',
          promoActive: data.promotions?.isActive !== false,
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

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  const materials = useMemo(() => {
    const mats = new Set(products.map(p => p.material).filter(Boolean));
    return Array.from(mats).sort();
  }, [products]);

  const colors = useMemo(() => {
    const cls = new Set(products.map(p => p.color).filter(Boolean));
    return Array.from(cls).sort();
  }, [products]);

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

  const handleToggleFeatured = async (product) => {
    try {
      await api.toggleProductFeatured(product._id, !product.featured);
      loadProducts();
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
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
    const files = Array.from(e.target.files);
    if (files.length > 15) {
      alert("You can only upload a maximum of 15 images per product.");
      e.target.value = ""; // Clear the selection
      return;
    }
    setFormData(prev => ({ 
      ...prev, 
      images: files, 
      imageColors: files.map((_, idx) => prev.imageColors[idx] || '')
    }));
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
      formDataToSend.append('category', isNewCategory ? formData.category : (formData.category || 'Uncategorized'));
      formDataToSend.append('material', isNewMaterial ? formData.material : (formData.material || ''));
      formDataToSend.append('color', isNewColor ? formData.color : (formData.color || ''));
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
      
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(img => {
          formDataToSend.append('images', img);
        });
      } else if (editingProduct) {
        if (editingProduct.image) formDataToSend.append('currentImage', editingProduct.image);
        if (editingProduct.images) formDataToSend.append('currentImages', JSON.stringify(editingProduct.images));
      }

      formDataToSend.append('imageColors', JSON.stringify(formData.imageColors || []));

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
      images: [],
      imageColors: [],
      priceType: "fixed",
      weight: "",
      metalType: "None",
      makingCharge: "",
      material: "",
      color: ""
    });
    setEditingProduct(null);
    setShowAddForm(false);
    setIsNewCategory(false);
    setIsNewMaterial(false);
    setIsNewColor(false);
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
      images: [],
      imageColors: product.imageColors || [],
      priceType: product.priceType || "fixed",
      weight: product.weight ? product.weight.toString() : "",
      metalType: product.metalType || "None",
      makingCharge: product.makingCharge ? product.makingCharge.toString() : "",
      material: product.material || "",
      color: product.color || ""
    });
    
    // Check if category or material is new/custom
    if (product.category && !categories.includes(product.category)) {
      setIsNewCategory(true);
    } else {
      setIsNewCategory(false);
    }
    
    if (product.material && !materials.includes(product.material)) {
      setIsNewMaterial(true);
    } else {
      setIsNewMaterial(false);
    }
    
    if (product.color && !colors.includes(product.color)) {
      setIsNewColor(true);
    } else {
      setIsNewColor(false);
    }
    
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
      formDataToSend.append('promoText', siteSettings.promoText);
      formDataToSend.append('promoActive', siteSettings.promoActive);
      formDataToSend.append('metalRates', JSON.stringify(siteSettings.metalRates));
      formDataToSend.append('aboutTitle', siteSettings.aboutTitle);
      formDataToSend.append('aboutDescription', siteSettings.aboutDescription);
      
      if (siteSettings.aboutImage) {
        formDataToSend.append('aboutImage', siteSettings.aboutImage);
      }

      await api.updateSettings(formDataToSend);
      alert('Settings & Metal Rates updated successfully!');
      loadSettings();
    } catch (error) {
      alert('Error updating settings: ' + error.message);
    }
  };

  const handleRenameCategory = async () => {
    if (!editingCategory.newName.trim() || editingCategory.newName === editingCategory.oldName) return;
    try {
      await api.renameCategory(editingCategory.oldName, editingCategory.newName.trim());
      alert('Category renamed successfully!');
      setEditingCategory({ oldName: '', newName: '' });
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRenameMaterial = async () => {
    if (!editingMaterial.newName.trim() || editingMaterial.newName === editingMaterial.oldName) return;
    try {
      await api.renameMaterial(editingMaterial.oldName, editingMaterial.newName.trim());
      alert('Material renamed successfully!');
      setEditingMaterial({ oldName: '', newName: '' });
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Gem className="w-10 h-10 animate-spin text-brand-gold" />
          <span>Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-brand-gold/10 pb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-brand-dark/60 text-sm mt-1">Manage luxury collections and live metal configurations</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-brand-light rounded-xl border border-brand-gold/10 max-w-fit">
            <button
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'products' ? 'bg-brand-gold text-brand-light' : 'text-brand-dark/70 hover:bg-brand-cream/20'
              }`}
            >
              <Gem className="w-4 h-4" /> Products
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'settings' ? 'bg-brand-gold text-brand-light' : 'text-brand-dark/70 hover:bg-brand-cream/20'
              }`}
            >
              <Settings className="w-4 h-4" /> Store Settings
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'tags' ? 'bg-brand-gold text-brand-light' : 'text-brand-dark/70 hover:bg-brand-cream/20'
              }`}
            >
              <Tag className="w-4 h-4" /> Tags & Categories
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition text-brand-dark/70 hover:bg-brand-cream/20"
            >
              <TrendingUp className="w-4 h-4" /> Inventory Dashboard
            </button>
            <button
              onClick={() => {
                api.logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-400/30"
            >
              Logout
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-dark/20 text-brand-dark/80 rounded-lg text-sm font-semibold hover:bg-brand-dark/5 transition"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                    setShowAddForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-gold text-brand-light rounded-lg text-sm font-bold shadow-lg shadow-brand-gold/10"
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
                  className="bg-brand-light p-6 rounded-2xl border border-brand-gold/20 shadow-xl"
                >
                  <h3 className="text-lg font-bold font-heading mb-4 text-brand-gold border-b border-brand-gold/10 pb-2">
                    {editingProduct ? 'Edit Product Details' : 'Introduce New Product'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold uppercase text-brand-dark/60">Category</label>
                        {isNewCategory && (
                          <button type="button" onClick={() => { setIsNewCategory(false); setFormData(p => ({...p, category: ''})) }} className="text-[10px] text-brand-gold hover:underline">Select Existing</button>
                        )}
                      </div>
                      {isNewCategory ? (
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                          placeholder="Type new category..."
                        />
                      ) : (
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            if (e.target.value === 'ADD_NEW') {
                              setIsNewCategory(true);
                              setFormData(p => ({ ...p, category: '' }));
                            } else {
                              setFormData(p => ({ ...p, category: e.target.value }));
                            }
                          }}
                          className="w-full rounded-lg border border-brand-dark/15 bg-brand-light px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        >
                          <option value="" disabled>Select Category...</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="ADD_NEW" className="font-bold text-brand-gold bg-brand-cream/20">+ Add New Category</option>
                        </select>
                      )}
                    </div>

                    {/* Material */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold uppercase text-brand-dark/60">Material</label>
                        {isNewMaterial && (
                          <button 
                            type="button" 
                            onClick={() => { setIsNewMaterial(false); setFormData(p => ({...p, material: ''})) }}
                            className="text-[10px] text-brand-gold hover:underline"
                          >
                            Select Existing
                          </button>
                        )}
                      </div>
                      {isNewMaterial ? (
                        <input
                          type="text"
                          name="material"
                          value={formData.material}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                          placeholder="Type new material..."
                        />
                      ) : (
                        <div className="flex flex-col">
                          <select
                            value={materials.includes(formData.material) ? formData.material : ''}
                            onChange={(e) => {
                              if (e.target.value === 'ADD_NEW') {
                                setIsNewMaterial(true);
                                setFormData({ ...formData, material: '' });
                              } else {
                                setFormData({ ...formData, material: e.target.value });
                              }
                            }}
                            className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                          >
                            <option value="">Select Material...</option>
                            {materials.map(mat => (
                              <option key={mat} value={mat}>{mat}</option>
                            ))}
                            <option value="ADD_NEW" className="font-bold text-brand-gold bg-brand-light">+ Add New Material...</option>
                          </select>
                        </div>
                      )}
                    </div>
                  
                  {/* Color Selection (Dynamic Dropdown) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60">Color</label>
                      {isNewColor && (
                        <button 
                          type="button" 
                          onClick={() => { setIsNewColor(false); setFormData(p => ({...p, color: ''})) }}
                          className="text-[10px] text-brand-gold hover:underline"
                        >
                          Select Existing
                        </button>
                      )}
                    </div>
                    {isNewColor ? (
                      <div className="flex flex-col">
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="Type new color..."
                          className="w-full rounded-lg border border-brand-gold/40 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/70 focus:outline-none placeholder-brand-dark/30"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <select
                          value={colors.includes(formData.color) ? formData.color : ''}
                          onChange={(e) => {
                            if (e.target.value === 'ADD_NEW') {
                              setIsNewColor(true);
                              setFormData({ ...formData, color: '' });
                            } else {
                              setFormData({ ...formData, color: e.target.value });
                            }
                          }}
                          className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        >
                          <option value="">Select Color...</option>
                          {colors.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="ADD_NEW" className="font-bold text-brand-gold bg-brand-light">+ Add New Color...</option>
                        </select>
                      </div>
                    )}
                  </div>


                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Stock Inventory</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                        required
                        min="0"
                      />
                    </div>

                    {/* Pricing Model */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Pricing model</label>
                      <select
                        name="priceType"
                        value={formData.priceType}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-dark/15 bg-brand-light px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                      >
                        <option value="fixed">Fixed Price Tag</option>
                        <option value="weight-based">Weight & Metal Dynamic Price</option>
                      </select>
                    </div>

                    {/* Dynamic Fields vs Fixed Price */}
                    {formData.priceType === 'fixed' ? (
                      <div>
                        <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Retail Price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40 text-sm">₹</span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 pl-8 pr-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                            required={formData.priceType === 'fixed'}
                            min="1"
                          />
                        </div>
                      </div>
                    ) : (
                      <>


                        {/* Weight */}
                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Weight (Grams)</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              name="weight"
                              value={formData.weight}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                              required={formData.priceType === 'weight-based'}
                              placeholder="e.g. 8.45"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark/40 text-xs">grams</span>
                          </div>
                        </div>

                        {/* Making Charge */}
                        <div>
                          <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Making Charges (Flat ₹)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40 text-sm">₹</span>
                            <input
                              type="number"
                              name="makingCharge"
                              value={formData.makingCharge}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 pl-8 pr-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                              required={formData.priceType === 'weight-based'}
                              placeholder="e.g. 2500"
                            />
                          </div>
                        </div>
                      </>
                    )}



                    {/* Description */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Specifications & Story</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none h-20 resize-none"
                        required
                      />
                    </div>

                    {/* Image selector */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Product Images</label>
                      <div className="flex flex-col">
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {formData.images.length > 0 ? (
                            formData.images.map((img, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-brand-cream/20 p-2 rounded-lg border border-brand-dark/10">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-gold/25 flex-shrink-0">
                                  <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <input 
                                    type="text" 
                                    placeholder="Associate Color (e.g. Gold, Silver) - Optional"
                                    value={formData.imageColors[idx] || ''}
                                    onChange={(e) => {
                                      const newColors = [...formData.imageColors];
                                      newColors[idx] = e.target.value;
                                      setFormData(prev => ({ ...prev, imageColors: newColors }));
                                    }}
                                    className="w-full px-2.5 py-1 text-xs rounded border border-brand-dark/15 bg-brand-light/50 text-brand-dark focus:outline-none focus:border-brand-gold/30"
                                  />
                                </div>
                              </div>
                            ))
                          ) : editingProduct && editingProduct.images && editingProduct.images.length > 0 ? (
                            editingProduct.images.map((img, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-brand-cream/20 p-2 rounded-lg border border-brand-dark/10">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-gold/25 flex-shrink-0">
                                  <img src={getImageUrl(img)} alt={`Current ${idx}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <input 
                                    type="text" 
                                    placeholder="Associate Color (e.g. Gold, Silver) - Optional"
                                    value={formData.imageColors[idx] || ''}
                                    onChange={(e) => {
                                      const newColors = [...formData.imageColors];
                                      newColors[idx] = e.target.value;
                                      setFormData(prev => ({ ...prev, imageColors: newColors }));
                                    }}
                                    className="w-full px-2.5 py-1 text-xs rounded border border-brand-dark/15 bg-brand-light/50 text-brand-dark focus:outline-none focus:border-brand-gold/30"
                                  />
                                </div>
                              </div>
                            ))
                          ) : editingProduct && editingProduct.image && !formData.images.length && (
                            <div className="flex items-center gap-3 bg-brand-cream/20 p-2 rounded-lg border border-brand-dark/10">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-gold/25 flex-shrink-0">
                                <img src={getImageUrl(editingProduct.image)} alt="Current" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  placeholder="Associate Color (e.g. Gold, Silver) - Optional"
                                  value={formData.imageColors[0] || ''}
                                  onChange={(e) => {
                                    const newColors = [...formData.imageColors];
                                    newColors[0] = e.target.value;
                                    setFormData(prev => ({ ...prev, imageColors: newColors }));
                                  }}
                                  className="w-full px-2.5 py-1 text-xs rounded border border-brand-dark/15 bg-brand-light/50 text-brand-dark focus:outline-none focus:border-brand-gold/30"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
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
                        className="px-6 py-2.5 bg-brand-gold text-brand-light rounded-lg font-bold shadow-lg hover:bg-brand-gold/90 transition"
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
                        className="px-6 py-2.5 border border-brand-dark/20 hover:bg-brand-dark/5 rounded-lg font-semibold text-brand-dark/80 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inventory table */}
            <div className="bg-brand-light rounded-2xl border border-brand-gold/10 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-cream/40 border-b border-brand-gold/10">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Image</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Product</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Category</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Pricing Model</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Retail Value</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold">Stock</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-brand-gold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-dark/5">
                    {products.map((p, idx) => (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                        className="hover:bg-brand-cream/10 transition"
                      >
                        <td className="p-4">
                          <ImageWithFallback
                            src={p.image || (p.images && p.images.length > 0 ? p.images[0] : null)}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border border-brand-gold/10"
                          />
                        </td>
                        <td className="p-4 font-semibold text-sm max-w-[200px] truncate">{p.name}</td>
                        <td className="p-4 text-xs font-medium text-brand-dark/70">{p.category}</td>
                        <td className="p-4 text-xs">
                          {p.priceType === 'weight-based' ? (
                            <span className="inline-flex items-center gap-1 text-brand-gold">
                              <Scale className="w-3.5 h-3.5" />
                              {p.metalType && p.metalType !== 'None' ? `${p.metalType} ` : ''}({p.weight}g)
                            </span>
                          ) : (
                            <span className="text-brand-dark/50">Fixed Price</span>
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
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1.5 rounded-lg border transition ${
                                p.featured 
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                                  : 'border-brand-dark/15 hover:border-amber-500/40 text-brand-dark/50 hover:text-amber-500'
                              }`}
                              title={p.featured ? "Unfeature Product" : "Feature Product"}
                            >
                              <Star className="w-4 h-4" fill={p.featured ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-1.5 rounded-lg border border-brand-dark/15 hover:border-brand-gold/40 text-brand-dark/80 hover:text-brand-gold transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-1.5 rounded-lg border border-brand-dark/15 hover:border-red-400/40 text-brand-dark/80 hover:text-red-400 transition"
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
            {/* Banner details config */}
            <div className="bg-brand-light p-6 rounded-2xl border border-brand-gold/10 lg:col-span-2 space-y-5">
              <h3 className="text-lg font-bold font-heading text-brand-gold border-b border-brand-gold/10 pb-2">
                Storefront Configuration
              </h3>
              
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">About Title</label>
                    <input
                      type="text"
                      value={siteSettings.aboutTitle}
                      onChange={e => setSiteSettings(prev => ({...prev, aboutTitle: e.target.value}))}
                      className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">About Description</label>
                  <textarea
                    value={siteSettings.aboutDescription}
                    onChange={e => setSiteSettings(prev => ({...prev, aboutDescription: e.target.value}))}
                    className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">About Image</label>
                  {siteSettings.currentAboutImage && (
                    <div className="mb-3">
                      <img 
                        src={getImageUrl(siteSettings.currentAboutImage)} 
                        alt="About img" 
                        className="w-32 h-16 object-cover rounded-lg border border-brand-gold/20"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) setSiteSettings(prev => ({...prev, aboutImage: file}));
                    }}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-gold/15 file:text-brand-gold hover:file:bg-brand-gold/20"
                  />
                </div>

                <div className="border-t border-brand-gold/10 pt-4">
                  <h4 className="text-sm font-bold text-brand-gold mb-3">Promotional Ticker Banner</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-brand-dark/60 mb-2">Banner Message</label>
                      <input
                        type="text"
                        value={siteSettings.promoText}
                        onChange={e => setSiteSettings(prev => ({...prev, promoText: e.target.value}))}
                        className="w-full rounded-lg border border-brand-dark/15 bg-brand-cream/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
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
                    className="px-8 py-3 bg-brand-gold text-brand-light rounded-lg font-bold shadow-lg hover:bg-brand-gold/90 transition"
                  >
                    Save Changes & Live Rates
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
        {/* Tab 3: Tags & Categories */}
        {activeTab === 'tags' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold font-heading">Manage Categories & Materials</h2>
            <p className="text-brand-dark/60 text-sm mb-6">Editing a name here will instantly update all products that currently use it.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Categories */}
              <div className="bg-brand-light rounded-2xl p-6 border border-brand-gold/10">
                <h3 className="text-lg font-bold font-heading mb-4 text-brand-gold">Categories</h3>
                <div className="space-y-3">
                  {categories.length === 0 ? <p className="text-brand-dark/50 text-sm">No categories found.</p> : null}
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-3 bg-brand-cream/30 rounded-lg border border-brand-dark/5">
                      {editingCategory.oldName === cat ? (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={editingCategory.newName}
                            onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                            className="w-full rounded-lg border border-brand-dark/15 bg-brand-light px-3 py-1.5 text-sm focus:border-brand-gold/40 focus:outline-none"
                          />
                          <button onClick={handleRenameCategory} className="text-emerald-400 text-xs font-bold hover:underline">Save</button>
                          <button onClick={() => setEditingCategory({ oldName: '', newName: '' })} className="text-brand-dark/60 text-xs hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-sm">{cat}</span>
                          <button 
                            onClick={() => setEditingCategory({ oldName: cat, newName: cat })}
                            className="text-brand-gold hover:text-brand-gold/70 transition p-1"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="bg-brand-light rounded-2xl p-6 border border-brand-gold/10">
                <h3 className="text-lg font-bold font-heading mb-4 text-brand-gold">Materials</h3>
                <div className="space-y-3">
                  {materials.length === 0 ? <p className="text-brand-dark/50 text-sm">No materials found.</p> : null}
                  {materials.map(mat => (
                    <div key={mat} className="flex items-center justify-between p-3 bg-brand-cream/30 rounded-lg border border-brand-dark/5">
                      {editingMaterial.oldName === mat ? (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={editingMaterial.newName}
                            onChange={(e) => setEditingMaterial({ ...editingMaterial, newName: e.target.value })}
                            className="w-full rounded-lg border border-brand-dark/15 bg-brand-light px-3 py-1.5 text-sm focus:border-brand-gold/40 focus:outline-none"
                          />
                          <button onClick={handleRenameMaterial} className="text-emerald-400 text-xs font-bold hover:underline">Save</button>
                          <button onClick={() => setEditingMaterial({ oldName: '', newName: '' })} className="text-brand-dark/60 text-xs hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-sm">{mat}</span>
                          <button 
                            onClick={() => setEditingMaterial({ oldName: mat, newName: mat })}
                            className="text-brand-gold hover:text-brand-gold/70 transition p-1"
                            title="Edit Material"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
