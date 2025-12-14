import React, { useState, useEffect } from 'react';

function SweetModal({ sweet, onClose, onSubmit, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sweets',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    if (isEditing && sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    } else {
      setFormData({
        name: '',
        category: 'Sweets',
        price: '',
        quantity: '',
      });
    }
  }, [sweet, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const submitData = isEditing
      ? { ...formData, id: sweet.id }
      : formData;
    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
        </h2>

        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sweet name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="filter-select"
            >
              <option>Sweets</option>
              <option>Candy</option>
              <option>Chocolate</option>
              <option>Gummies</option>
              <option>Licorice</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              className="form-input"
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button
            onClick={onClose}
            className="modal-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="modal-btn-submit"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SweetModal;