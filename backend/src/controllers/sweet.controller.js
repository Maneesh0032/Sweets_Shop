/**
 * Sweet Controller
 * Handles sweet management operations
 */

const sweetModel = require('../models/sweet.model');

/**
 * Get all sweets
 * GET /api/sweets
 */
const getAll = async (req, res) => {
  try {
    const sweets = await sweetModel.getAll();
    res.json(sweets);
  } catch (error) {
    console.error('❌ Error fetching sweets:', error);
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
};

/**
 * Search sweets
 * GET /api/sweets/search
 */
const search = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (category) filters.category = category;
    if (minPrice !== undefined) filters.minPrice = parseFloat(minPrice);
    if (maxPrice !== undefined) filters.maxPrice = parseFloat(maxPrice);

    const sweets = await sweetModel.search(filters);
    res.json(sweets);
  } catch (error) {
    console.error('❌ Error searching sweets:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

/**
 * Get sweet by ID
 * GET /api/sweets/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const sweet = await sweetModel.getById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    console.error('❌ Error fetching sweet:', error);
    res.status(500).json({ error: 'Failed to fetch sweet' });
  }
};

/**
 * Add a new sweet
 * POST /api/sweets
 */
const create = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (price < 0 || quantity < 0) {
      return res.status(400).json({ error: 'Price and quantity must be non-negative' });
    }

    const sweet = await sweetModel.create({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    });

    res.status(201).json(sweet);
  } catch (error) {
    console.error('❌ Error creating sweet:', error);
    res.status(500).json({ error: 'Failed to create sweet' });
  }
};

/**
 * Update a sweet
 * PUT /api/sweets/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    // Check if sweet exists
    const sweet = await sweetModel.getById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updated = await sweetModel.update(id, {
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating sweet:', error);
    res.status(500).json({ error: 'Failed to update sweet' });
  }
};

/**
 * Delete a sweet
 * DELETE /api/sweets/:id
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await sweetModel.getById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    await sweetModel.remove(id);

    res.json({ message: 'Sweet deleted successfully', sweet });
  } catch (error) {
    console.error('❌ Error deleting sweet:', error);
    res.status(500).json({ error: 'Failed to delete sweet' });
  }
};

/**
 * Purchase a sweet
 * POST /api/sweets/:id/purchase
 */
const purchase = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await sweetModel.getById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    const updated = await sweetModel.updateQuantity(id, sweet.quantity - 1);

    res.json({
      message: 'Purchase successful',
      sweet: updated,
    });
  } catch (error) {
    console.error('❌ Error during purchase:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

/**
 * Restock a sweet
 * POST /api/sweets/:id/restock
 */
const restock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    const sweet = await sweetModel.getById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    const updated = await sweetModel.updateQuantity(
      id,
      sweet.quantity + parseInt(quantity)
    );

    res.json({
      message: 'Restock successful',
      sweet: updated,
    });
  } catch (error) {
    console.error('❌ Error during restock:', error);
    res.status(500).json({ error: 'Restock failed' });
  }
};

module.exports = {
  getAll,
  search,
  getById,
  create,
  update,
  remove,
  purchase,
  restock,
};