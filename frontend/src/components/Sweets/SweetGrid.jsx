import React, { useState } from 'react';
import { ShoppingCart, Edit2, Trash2 } from 'lucide-react';

function SweetGrid({ sweets, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const [restockValues, setRestockValues] = useState({});

  const handleRestockChange = (id, value) => {
    setRestockValues(prev => ({ ...prev, [id]: value }));
  };

  const handleRestockSubmit = (id) => {
    const amount = restockValues[id] || 10;
    onRestock(id, amount);
    setRestockValues(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="sweets-grid">
      {sweets.map(sweet => (
        <div key={sweet.id} className="sweet-card">
          <div className="sweet-image">🍬</div>
          <div className="sweet-details">
            <h3 className="sweet-name">{sweet.name}</h3>
            <div className="sweet-info">
              <p><span className="category">Category:</span> {sweet.category}</p>
              <p><span className="price">Price:</span> ${sweet.price.toFixed(2)}</p>
              <p className={sweet.quantity > 0 ? 'stock-available' : 'stock-unavailable'}>
                <span className="stock">Stock:</span> {sweet.quantity}
                {sweet.quantity === 0 && ' (Out of Stock)'}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => onPurchase(sweet.id)}
                disabled={sweet.quantity === 0}
                className={`btn ${sweet.quantity > 0 ? 'btn-primary' : 'btn-disabled'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <ShoppingCart size={20} /> Purchase
              </button>
            )}

            {isAdmin && (
              <div className="sweet-actions">
                <button
                  onClick={() => onEdit(sweet)}
                  className="btn btn-info"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                  }}
                >
                  <Edit2 size={20} /> Edit
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    value={restockValues[sweet.id] || ''}
                    onChange={(e) => handleRestockChange(sweet.id, e.target.value)}
                    placeholder="Qty"
                    className="form-input"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <button
                    onClick={() => handleRestockSubmit(sweet.id)}
                    className="btn btn-success"
                    style={{ flex: 1 }}
                  >
                    Restock
                  </button>
                </div>
                <button
                  onClick={() => onDelete(sweet.id)}
                  className="btn btn-danger"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                  }}
                >
                  <Trash2 size={20} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SweetGrid;