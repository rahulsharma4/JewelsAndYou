import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [advancedStats, setAdvancedStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stockUpdatingId, setStockUpdatingId] = useState(null);
  const [localStockValues, setLocalStockValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
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

  const loadDashboardData = async () => {
    try {
      const [statsData, ordersData, usersData, advancedData, contactsData, productsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders({ limit: 50 }),
        api.getAdminUsers({ limit: 50 }),
        api.getAdvancedAnalytics(),
        api.getAdminContacts(),
        api.getAdminProducts({ limit: 100 })
      ]);
      
      setStats(statsData);
      setOrders(ordersData.orders || []);
      setUsers(usersData.users || []);
      setAdvancedStats(advancedData);
      setContacts(contactsData || []);
      setProducts(productsData.products || []);

      // Initialize local stock values
      const stockVals = {};
      (productsData.products || []).forEach(p => {
        stockVals[p._id] = p.stock || 0;
      });
      setLocalStockValues(stockVals);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      setStockUpdatingId(productId);
      await api.updateAdminProductStock(productId, newStock);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setStockUpdatingId(null);
    }
  };

  const updateOrderStatus = async (orderId, status, trackingNumber = '') => {
    try {
      await api.updateOrderStatus(orderId, status, trackingNumber);
      loadDashboardData(); 
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await api.fetchWithAuth(`/admin/users/${userId}/status`, {
          method: 'PUT',
          body: { status }
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      await api.updateContactStatus(contactId, status);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  // Simple SVG Bar Chart Component
  const BarChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d.amount || 1));
    return (
      <div className="flex items-end gap-2 h-40 mt-4 border-b border-l border-brand-off/20 p-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            <div 
              className="w-full bg-brand-gold rounded-t transition-all duration-500" 
              style={{ height: `${(d.amount / max) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-tealDark px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-brand-gold/50 whitespace-nowrap z-10">
                ₹{d.amount.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] mt-2 text-brand-off/60 whitespace-nowrap">{d._id.split('-').slice(1).join('/')}</span>
          </div>
        ))}
      </div>
    );
  };

  // Simple Category Revenue List
  const CategoryStats = ({ data }) => (
    <div className="space-y-4 mt-4">
      {data.map((cat, i) => (
        <div key={i} className="relative pt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold inline-block text-brand-off">{cat._id}</span>
            <span className="text-sm font-semibold inline-block text-brand-gold">₹{cat.revenue.toLocaleString()}</span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-brand-teal border border-brand-gold/10">
            <div 
              style={{ width: `${(cat.revenue / (advancedStats?.totalRevenue || 1)) * 100}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-gold"
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-teal text-brand-off flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-teal text-brand-off p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-brand-gold text-brand-tealDark rounded-lg font-semibold"
            >
              Manage Products
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-brand-off/30 rounded-lg"
            >
              Back to Store
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['overview', 'orders', 'users', 'messages', 'analytics', 'inventory'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-lg font-semibold capitalize ${
                activeTab === tab
                  ? 'bg-brand-gold text-brand-tealDark'
                  : 'bg-brand-tealDark border border-brand-off/30'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20 shadow-lg">
                <h3 className="text-brand-off/60 text-sm uppercase tracking-wider mb-1">Total Products</h3>
                <p className="text-3xl font-bold text-brand-gold">{stats.totalProducts}</p>
                <div className="text-[11px] mt-2 text-brand-off/40">Active in catalog</div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20 shadow-lg">
                <h3 className="text-brand-off/60 text-sm uppercase tracking-wider mb-1">Total Orders</h3>
                <p className="text-3xl font-bold text-brand-gold">{stats.totalOrders}</p>
                <div className="text-[11px] mt-2 text-brand-off/40">Lifetime transactions</div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20 shadow-lg">
                <h3 className="text-brand-off/60 text-sm uppercase tracking-wider mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-brand-gold">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                <div className="text-[11px] mt-2 text-brand-off/40">Gross delivered sales</div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20 shadow-lg">
                <h3 className="text-brand-off/60 text-sm uppercase tracking-wider mb-1">Total Customers</h3>
                <p className="text-3xl font-bold text-brand-gold">{advancedStats?.userStats?.total || users.length}</p>
                <div className="text-[11px] mt-2 text-brand-off/40">Registered users</div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Trend */}
                <div className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Last 7 Days Sales</h2>
                    <BarChart data={advancedStats?.last7DaysSales} />
                </div>
                {/* Top Categories */}
                <div className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Revenue by Category</h2>
                    <CategoryStats data={advancedStats?.salesByCategory || []} />
                </div>
            </div>
          </>
        )}

        {/* Analytics Tab (Deep Dive) */}
        {activeTab === 'analytics' && advancedStats && (
            <div className="space-y-8">
                <div className="bg-brand-tealDark p-8 rounded-lg border border-brand-gold/20 shadow-lg flex flex-col md:flex-row justify-around items-center text-center">
                    <div>
                        <h4 className="text-brand-off/60 mb-2">Total Sales</h4>
                        <p className="text-4xl font-bold text-brand-gold">₹{advancedStats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-12 bg-brand-gold/20 hidden md:block"></div>
                    <div>
                        <h4 className="text-brand-off/60 mb-2">Delivered Orders</h4>
                        <p className="text-4xl font-bold text-brand-gold">{orders.filter(o => o.status === 'delivered').length}</p>
                    </div>
                    <div className="w-px h-12 bg-brand-gold/20 hidden md:block"></div>
                    <div>
                        <h4 className="text-brand-off/60 mb-2">Avg. Order Value</h4>
                        <p className="text-4xl font-bold text-brand-gold">₹{Math.round(advancedStats.totalRevenue / (orders.length || 1)).toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-brand-tealDark p-6 rounded-lg border border-brand-gold/20">
                    <h2 className="text-xl font-bold mb-6">Top Selling Products</h2>
                    <div className="space-y-4">
                        {stats.topProducts.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded bg-brand-teal/10 hover:bg-brand-teal/20 transition-colors">
                                <div className="w-10 h-10 flex items-center justify-center bg-brand-gold text-brand-tealDark font-bold rounded">#{i+1}</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{p.product.name}</h4>
                                    <p className="text-xs text-brand-off/60">{p.product.category}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-brand-gold">₹{p.revenue.toLocaleString()}</div>
                                    <div className="text-xs">{p.totalSold} Units sold</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-brand-off/20 flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Management</h2>
              <span className="text-xs text-brand-off/50">Total {orders.length} orders shown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-brand-teal/30">
                  <tr>
                    <th className="p-4 text-xs uppercase tracking-wider">Order ID</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Amount</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-off/10">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-brand-teal/20 transition-colors">
                      <td className="p-4 font-mono text-sm text-brand-gold">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4">
                        <div className="text-sm font-semibold">{order.user?.name || 'Guest'}</div>
                        <div className="text-[10px] text-brand-off/50">{order.user?.email}</div>
                      </td>
                      <td className="p-4 font-bold">₹{order.total.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                          order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                          order.status === 'shipped' ? 'bg-sky-500/10 text-sky-500' :
                          order.status === 'processing' ? 'bg-amber-500/10 text-amber-500' :
                          order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-slate-500/10 text-slate-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-brand-off/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="px-2 py-1 rounded bg-brand-teal text-xs border border-brand-off/20 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-brand-off/20 flex justify-between items-center">
              <h2 className="text-xl font-bold">User Access Control</h2>
              <div className="flex gap-4 text-xs">
                  <span className="text-emerald-500">Active: {advancedStats?.userStats?.active}</span>
                  <span className="text-rose-500">Suspended: {advancedStats?.userStats?.suspended}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-brand-teal/30">
                  <tr>
                    <th className="p-4 text-xs uppercase tracking-wider">User</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Joined</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-off/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-brand-teal/20 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-brand-off/50">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin' ? 'bg-brand-gold text-brand-tealDark' : 'bg-brand-off/10 text-brand-off'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          user.status === 'active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-brand-off/60">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => updateUserStatus(user._id, user.status === 'suspended' ? 'active' : 'suspended')}
                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${
                                    user.status === 'suspended' ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white'
                                }`}
                            >
                                {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-brand-off/20 flex justify-between items-center">
              <h2 className="text-xl font-bold">Contact Messages</h2>
              <div className="flex gap-4 text-xs">
                  <span className="text-brand-gold">New: {contacts.filter(c => c.status === 'new').length}</span>
                  <span className="text-emerald-500">Read: {contacts.filter(c => c.status !== 'new').length}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-brand-teal/30">
                  <tr>
                    <th className="p-4 text-xs uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Subject & Message</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-off/10">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className={`transition-colors ${contact.status === 'new' ? 'bg-brand-teal/30 hover:bg-brand-teal/40' : 'hover:bg-brand-teal/10'}`}>
                      <td className="p-4 text-xs text-brand-off/60 whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}<br/>{new Date(contact.createdAt).toLocaleTimeString()}</td>
                      <td className="p-4">
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-xs text-brand-off/50">{contact.email}</div>
                        <div className="text-[10px] text-brand-off/40">{contact.phone}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-sm mb-1">{contact.subject}</div>
                        <div className="text-xs text-brand-off/80 truncate">{contact.message}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          contact.status === 'new' ? 'text-amber-500 bg-amber-500/10' : 
                          contact.status === 'replied' ? 'text-emerald-500 bg-emerald-500/10' :
                          'text-sky-500 bg-sky-500/10'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={contact.status}
                          onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                          className="px-2 py-1 rounded bg-brand-teal text-xs border border-brand-off/20 outline-none"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-brand-off/50">No messages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && advancedStats && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Advanced Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales by Category */}
              <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6">
                <h3 className="text-lg font-bold mb-4 text-brand-off">Sales by Category</h3>
                {advancedStats.salesByCategory && advancedStats.salesByCategory.length > 0 ? (
                  <div className="space-y-4">
                    {advancedStats.salesByCategory.map((cat, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cat._id || 'Uncategorized'}</span>
                          <span className="text-brand-gold">${cat.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-brand-teal rounded-full h-2">
                          <div 
                            className="bg-brand-gold h-2 rounded-full" 
                            style={{ width: `${Math.min((cat.revenue / advancedStats.totalRevenue) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-off/50">No category data available.</p>
                )}
              </div>

              {/* User Statistics */}
              <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6">
                <h3 className="text-lg font-bold mb-4 text-brand-off">User Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-teal/30 rounded border border-brand-off/10 text-center">
                    <div className="text-3xl font-bold text-brand-gold">{advancedStats.userStats?.total || 0}</div>
                    <div className="text-xs text-brand-off/70 mt-1 uppercase">Total Users</div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded border border-emerald-500/20 text-center">
                    <div className="text-3xl font-bold text-emerald-500">{advancedStats.userStats?.active || 0}</div>
                    <div className="text-xs text-brand-off/70 mt-1 uppercase">Active Users</div>
                  </div>
                  <div className="p-4 bg-rose-500/10 rounded border border-rose-500/20 text-center col-span-2">
                    <div className="text-3xl font-bold text-rose-500">{advancedStats.userStats?.suspended || 0}</div>
                    <div className="text-xs text-brand-off/70 mt-1 uppercase">Suspended Users</div>
                  </div>
                </div>
              </div>

              {/* Last 7 Days Sales */}
              <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6 md:col-span-2">
                <h3 className="text-lg font-bold mb-4 text-brand-off">Last 7 Days Revenue</h3>
                {advancedStats.last7DaysSales && advancedStats.last7DaysSales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-brand-teal/30">
                        <tr>
                          <th className="p-3 text-xs uppercase tracking-wider">Date</th>
                          <th className="p-3 text-xs uppercase tracking-wider text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-off/10">
                        {advancedStats.last7DaysSales.map((day, idx) => (
                          <tr key={idx} className="hover:bg-brand-teal/10">
                            <td className="p-3 font-semibold">{day._id}</td>
                            <td className="p-3 text-right text-brand-gold font-bold">${day.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-brand-off/50">No sales in the last 7 days.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Inventory & Stock Alerts</h2>

            {/* Catalog Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-brand-tealDark p-5 rounded-lg border border-brand-gold/20 shadow-md text-center">
                <div className="text-xs text-brand-off/60 uppercase tracking-wider mb-1">Total Pieces in Catalog</div>
                <div className="text-3xl font-bold text-brand-gold">
                  {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
                </div>
              </div>
              <div className="bg-brand-tealDark p-5 rounded-lg border border-brand-gold/20 shadow-md text-center">
                <div className="text-xs text-brand-off/60 uppercase tracking-wider mb-1">Catalog Value Estimation</div>
                <div className="text-3xl font-bold text-brand-gold">
                  ₹{products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-brand-tealDark p-5 rounded-lg border border-brand-gold/20 shadow-md text-center">
                <div className="text-xs text-brand-off/60 uppercase tracking-wider mb-1">Low Stock Products (&lt;= 10)</div>
                <div className="text-3xl font-bold text-amber-500">
                  {products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length}
                </div>
              </div>
              <div className="bg-brand-tealDark p-5 rounded-lg border border-brand-gold/20 shadow-md text-center">
                <div className="text-xs text-brand-off/60 uppercase tracking-wider mb-1">Out of Stock Products</div>
                <div className="text-3xl font-bold text-rose-500">
                  {products.filter(p => (p.stock || 0) === 0).length}
                </div>
              </div>
            </div>

            {/* Gram-based Catalog Weight calculation */}
            <div className="bg-brand-tealDark p-5 rounded-lg border border-brand-gold/20 shadow-md mb-8">
              <h3 className="text-md font-bold mb-3 text-brand-gold uppercase tracking-wide">Dynamic Stock Metal Volume Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-brand-teal/20 p-4 rounded border border-brand-gold/10">
                  <div className="text-sm font-semibold text-brand-off/80">Total Gold Stock Weight</div>
                  <div className="text-2xl font-bold text-brand-gold mt-1">
                    {products
                      .filter(p => p.priceType === 'weight-based' && (p.metalType || '').toLowerCase() === 'gold')
                      .reduce((acc, p) => acc + ((p.weight || 0) * (p.stock || 0)), 0)
                      .toFixed(2)} g
                  </div>
                  <div className="text-xs text-brand-off/40 mt-1">Total weight across all Gold catalog items in stock</div>
                </div>
                <div className="bg-brand-teal/20 p-4 rounded border border-brand-gold/10">
                  <div className="text-sm font-semibold text-brand-off/80">Total Silver Stock Weight</div>
                  <div className="text-2xl font-bold text-brand-gold mt-1">
                    {products
                      .filter(p => p.priceType === 'weight-based' && (p.metalType || '').toLowerCase() === 'silver')
                      .reduce((acc, p) => acc + ((p.weight || 0) * (p.stock || 0)), 0)
                      .toFixed(2)} g
                  </div>
                  <div className="text-xs text-brand-off/40 mt-1">Total weight across all Silver catalog items in stock</div>
                </div>
              </div>
            </div>

            {/* Inventory table */}
            <div className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6">
              <h3 className="text-lg font-bold mb-4">Stock Alerts & Catalog List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-brand-teal/30">
                    <tr>
                      <th className="p-3 text-xs uppercase tracking-wider">Product</th>
                      <th className="p-3 text-xs uppercase tracking-wider">Category</th>
                      <th className="p-3 text-xs uppercase tracking-wider">Pricing Type</th>
                      <th className="p-3 text-xs uppercase tracking-wider">Metal Type / Weight</th>
                      <th className="p-3 text-xs uppercase tracking-wider">Total Metal Weight</th>
                      <th className="p-3 text-xs uppercase tracking-wider">Current Stock</th>
                      <th className="p-3 text-xs uppercase tracking-wider text-right">Quick Stock Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-off/10 text-sm">
                    {products.map((p) => {
                      const isLow = (p.stock || 0) <= 10;
                      const isOut = (p.stock || 0) === 0;
                      const totalWeight = p.priceType === 'weight-based' ? ((p.weight || 0) * (p.stock || 0)).toFixed(2) : null;
                      
                      return (
                        <tr key={p._id} className={`hover:bg-brand-teal/10 ${isOut ? 'bg-rose-500/5' : isLow ? 'bg-amber-500/5' : ''}`}>
                          <td className="p-3 font-semibold">
                            <div className="flex flex-col">
                              <span>{p.name}</span>
                              {isOut ? (
                                <span className="text-[10px] text-rose-400 font-bold uppercase mt-0.5">Out of Stock</span>
                              ) : isLow ? (
                                <span className="text-[10px] text-amber-400 font-bold uppercase mt-0.5">Low Stock</span>
                              ) : null}
                            </div>
                          </td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3 capitalize">{p.priceType}</td>
                          <td className="p-3">
                            {p.priceType === 'weight-based' ? (
                              <span className="capitalize">{p.metalType} • {p.weight}g</span>
                            ) : (
                              <span className="text-brand-off/40">—</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-brand-gold">
                            {totalWeight ? `${totalWeight} g` : <span className="text-brand-off/40">—</span>}
                          </td>
                          <td className="p-3">
                            <span className={`font-bold ${isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-brand-off'}`}>
                              {p.stock || 0}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={localStockValues[p._id] !== undefined ? localStockValues[p._id] : (p.stock || 0)}
                                onChange={(e) => setLocalStockValues({
                                  ...localStockValues,
                                  [p._id]: parseInt(e.target.value) || 0
                                })}
                                className="w-16 rounded bg-brand-teal px-2 py-1 text-center border border-brand-off/20 focus:border-brand-gold outline-none"
                              />
                              <button
                                onClick={() => updateStock(p._id, localStockValues[p._id])}
                                disabled={stockUpdatingId === p._id}
                                className="px-3 py-1 bg-brand-gold text-brand-tealDark font-bold rounded text-xs hover:bg-brand-gold/80 transition"
                              >
                                {stockUpdatingId === p._id ? 'Updating...' : 'Update'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
