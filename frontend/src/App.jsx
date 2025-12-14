import React, { useState, useEffect } from 'react';
import './Styles.css';
import AuthPage from './components/auth/AuthPage.jsx';
import Header from './components/Layout_/Header.jsx';
import SweetGrid from './components/Sweets/SweetGrid.jsx';
import SweetModal from './components/Sweets/SweetModal.jsx';
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Sweets State
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  // Messages
  const [sweetError, setSweetError] = useState('');
  const [sweetSuccess, setSweetSuccess] = useState('');

  // Auto-login if token exists
  useEffect(() => {
    if (token) {
      try {
        setIsAuthenticated(true);
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decoded.isAdmin);
        setUserEmail(decoded.email);
        fetchSweets(token);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, []);

  // Fetch sweets from API
  const fetchSweets = async (authToken) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sweets`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSweets(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching sweets:', error);
      setSweetError('Failed to load sweets. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Filter sweets
  useEffect(() => {
    let filtered = sweets.filter(sweet => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sweet.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || sweet.category === categoryFilter;
      
      let matchesPrice = true;
      if (priceFilter.min !== '' || priceFilter.max !== '0') {
        const minPrice = priceFilter.min !== '' ? parseFloat(priceFilter.min) : 0;
        const maxPrice = priceFilter.max !== '' ? parseFloat(priceFilter.max) : Infinity;
        matchesPrice = sweet.price >= minPrice && sweet.price <= maxPrice;
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    setFilteredSweets(filtered);
  }, [searchTerm, categoryFilter, priceFilter, sweets]);

  // Auth Handlers
  const handleLoginSuccess = (data) => {
    if (!data || !data.token || !data.user) {
      setSweetError('Invalid login response. Please try again.');
      return;
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setIsAuthenticated(true);
    setIsAdmin(data.user.isAdmin);
    setUserEmail(data.user.email);
    fetchSweets(data.token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserEmail('');
    setSweets([]);
    setShowAddModal(false);
    setEditingSweet(null);
    setSweetError('');
    setSweetSuccess('');
    setSearchTerm('');
    setPriceFilter({ min: '', max: '' });
    setCategoryFilter('all');
  };

  // Sweet Management
  const handleAddSweet = async (newSweet) => {
    try {
      setSweetError('');
      const response = await fetch(`${API_BASE_URL}/sweets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newSweet.name,
          category: newSweet.category,
          price: parseFloat(newSweet.price),
          quantity: parseInt(newSweet.quantity),
        }),
      });

      if (response.ok) {
        const sweet = await response.json();
        setSweets([...sweets, sweet]);
        setShowAddModal(false);
        setSweetSuccess('Sweet added successfully!');
        setTimeout(() => setSweetSuccess(''), 3000);
      } else {
        const data = await response.json();
        setSweetError(data.error || 'Failed to add sweet');
      }
    } catch (error) {
      setSweetError('Failed to add sweet. Check connection.');
    }
  };

  const handleUpdateSweet = async (updatedSweet) => {
    try {
      setSweetError('');
      const response = await fetch(`${API_BASE_URL}/sweets/${updatedSweet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedSweet.name,
          category: updatedSweet.category,
          price: parseFloat(updatedSweet.price),
          quantity: parseInt(updatedSweet.quantity),
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setSweets(sweets.map(s => s.id === updated.id ? updated : s));
        setEditingSweet(null);
        setSweetSuccess('Sweet updated successfully!');
        setTimeout(() => setSweetSuccess(''), 3000);
      } else {
        const data = await response.json();
        setSweetError(data.error || 'Failed to update sweet');
      }
    } catch (error) {
      setSweetError('Failed to update sweet. Check connection.');
    }
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      setSweetError('');
      const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setSweets(sweets.filter(s => s.id !== id));
        setSweetSuccess('Sweet deleted successfully!');
        setTimeout(() => setSweetSuccess(''), 3000);
      } else {
        setSweetError('Failed to delete sweet');
      }
    } catch (error) {
      setSweetError('Failed to delete sweet. Check connection.');
    }
  };

  const handlePurchase = async (id) => {
    try {
      setSweetError('');
      const response = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSweets(sweets.map(s => s.id === id ? data.sweet : s));
        setSweetSuccess('Purchase successful!');
        setTimeout(() => setSweetSuccess(''), 3000);
      } else {
        const data = await response.json();
        setSweetError(data.error || 'Purchase failed');
      }
    } catch (error) {
      setSweetError('Purchase failed. Check connection.');
    }
  };

  const handleRestock = async (id, amount) => {
    if (!amount || amount <= 0) {
      setSweetError('Invalid quantity');
      return;
    }

    try {
      setSweetError('');
      const response = await fetch(`${API_BASE_URL}/sweets/${id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: parseInt(amount) }),
      });

      if (response.ok) {
        const data = await response.json();
        setSweets(sweets.map(s => s.id === id ? data.sweet : s));
        setSweetSuccess('Restocked successfully!');
        setTimeout(() => setSweetSuccess(''), 3000);
      } else {
        const data = await response.json();
        setSweetError(data.error || 'Restock failed');
      }
    } catch (error) {
      setSweetError('Restock failed. Check connection.');
    }
  };

  const categories = ['all', ...new Set(sweets.map(s => s.category))];

  // Render Auth Page
  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Main App
  return (
    <div className="app-container">
      <Header userEmail={userEmail} isAdmin={isAdmin} onLogout={handleLogout} />

      <div className="main-content">
        {/* Messages */}
        {sweetError && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <p>{sweetError}</p>
          </div>
        )}
        {sweetSuccess && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <p>{sweetSuccess}</p>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="search-filter-box">
          <div className="search-filter-grid">
            <div>
              <label className="filter-label">🔍 Search by Name/Category</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Gummy bears, chocolate..."
                className="form-input"
              />
            </div>

            <div>
              <label className="filter-label">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="filter-label">Price Range: {priceFilter.min !== '' ? priceFilter.min : '0'} - {priceFilter.max || 'Any'}</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                  placeholder="Min price"
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                  placeholder="Max price"
                  className="form-input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-add-sweet"
          >
            <Plus size={24} /> Add New Sweet
          </button>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <p>Loading sweets...</p>
          </div>
        )}

        {/* Sweets Grid */}
        {!loading && filteredSweets.length > 0 ? (
          <SweetGrid
            sweets={filteredSweets}
            isAdmin={isAdmin}
            onPurchase={handlePurchase}
            onEdit={setEditingSweet}
            onDelete={handleDeleteSweet}
            onRestock={handleRestock}
          />
        ) : !loading && (
          <div className="empty-state">
            <p>No sweets found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSweet) && (
        <SweetModal
          sweet={editingSweet}
          onClose={() => {
            setShowAddModal(false);
            setEditingSweet(null);
            setSweetError('');
          }}
          onSubmit={editingSweet ? handleUpdateSweet : handleAddSweet}
          isEditing={!!editingSweet}
        />
      )}
    </div>
  );
}

export default App;