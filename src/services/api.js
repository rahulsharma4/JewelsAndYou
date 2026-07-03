const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async fetchWithAuth(url, options = {}) {
    const headers = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    // Only set Content-Type to application/json if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
      if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
      }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    });
    
    if (!response.ok) {
      let errorMsg = 'Request failed';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {}
      throw new Error(errorMsg);
    }
    
    return response.json();
  }

  // Auth API
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(credentials) {
    console.log('🌐 API Login request:', credentials);
    console.log('🌐 API Base URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    console.log('📡 API Response status:', response.status);
    console.log('📡 API Response headers:', response.headers);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error response:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('✅ API Success response:', data);
    
    if (data.token) {
      this.setToken(data.token);
      console.log('🔑 Token set successfully');
    }
    return data;
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Unauthorized');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get profile');
    }
    
    return response.json();
  }

  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });
    return response.json();
  }

  async toggleFavorite(productId) {
    const response = await fetch(`${API_BASE_URL}/auth/favorites/${productId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getFavorites() {
    const response = await fetch(`${API_BASE_URL}/auth/favorites`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Products API
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    return response.json();
  }

  async getProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/products/categories/list`);
    return response.json();
  }

  async getFeaturedProducts() {
    const response = await fetch(`${API_BASE_URL}/products/featured/list`);
    return response.json();
  }

  async searchProducts(query, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products/search/${encodeURIComponent(query)}?${queryString}`);
    return response.json();
  }

  async getRelatedProducts(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/related`);
    return response.json();
  }

  // Orders API
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });
    return response.json();
  }

  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getOrder(id) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Cart API
  async getCart() {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async addToCart(productId, quantity = 1) {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add item to cart');
    }
    
    return response.json();
  }

  async updateCartItem(productId, quantity) {
    const response = await fetch(`${API_BASE_URL}/cart/update/${productId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update cart item');
    }
    
    return response.json();
  }

  async removeFromCart(productId) {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async clearCart() {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Product Reviews API
  async addProductReview(productId, reviewData) {
    const formData = new FormData();
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    
    if (reviewData.images) {
      reviewData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        // Note: Don't set Content-Type for FormData, browser does it with boundary
      },
      body: formData,
    });
    return response.json();
  }

  async getProductReviews(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
    return response.json();
  }

  // Stripe Payment API
  async createPaymentIntent(amount, currency = 'usd', orderId, items) {
    const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, currency, orderId, items }),
    });
    return response.json();
  }

  async confirmPayment(paymentIntentId) {
    const response = await fetch(`${API_BASE_URL}/payments/confirm-payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ paymentIntentId }),
    });
    return response.json();
  }

  async createCustomer(email, name) {
    const response = await fetch(`${API_BASE_URL}/payments/create-customer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, name }),
    });
    return response.json();
  }

  async getPaymentMethods() {
    const response = await fetch(`${API_BASE_URL}/payments/payment-methods`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createSetupIntent() {
    const response = await fetch(`${API_BASE_URL}/payments/setup-intent`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createRefund(paymentIntentId, amount, reason) {
    const response = await fetch(`${API_BASE_URL}/payments/refund`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ paymentIntentId, amount, reason }),
    });
    return response.json();
  }

  async getPaymentIntent(paymentIntentId) {
    const response = await fetch(`${API_BASE_URL}/payments/payment-intent/${paymentIntentId}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getAccountBalance() {
    const response = await fetch(`${API_BASE_URL}/payments/balance`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Password reset
  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email }),
    });
    return response.json();
  }

  async resetPassword(token, password) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ token, password }),
    });
    return response.json();
  }

  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  }

  // Order tracking
  async getOrderTracking(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Admin API
  async getAdminProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/products?${queryString}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getAdminStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getAdminOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/orders?${queryString}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateOrderStatus(orderId, status, trackingNumber) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, trackingNumber }),
    });
    return response.json();
  }

  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users?${queryString}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateUserRole(userId, role) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ role }),
    });
    return response.json();
  }

  async getOrderAnalytics(period = '30') {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/orders?period=${period}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getAdvancedAnalytics() {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/advanced`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async bulkImportProducts(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/admin/products/bulk-import`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData,
    });
    return response.json();
  }

  async exportProducts() {
    const response = await fetch(`${API_BASE_URL}/admin/products/export`, {
      headers: this.getHeaders(),
    });
    return response.blob();
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Contacts
  async submitContact(contactData) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(contactData),
    });
    return response.json();
  }

  async getAdminContacts() {
    const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateContactStatus(contactId, status) {
    const response = await fetch(`${API_BASE_URL}/admin/contacts/${contactId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  // Site Settings
  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) return null;
    return response.json();
  }

  async updateSettings(settingsFormData) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: settingsFormData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update settings');
    }
    return response.json();
  }
}

const apiService = new ApiService();
export default apiService;

