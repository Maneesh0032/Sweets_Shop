const db = require('../config/db');

const getAll = async () => {
  return await db.all('SELECT * FROM sweets ORDER BY id');
};

const getById = async (id) => {
  return await db.get('SELECT * FROM sweets WHERE id = ?', [id]);
};

const create = async (sweetData) => {
  const { name, category, price, quantity } = sweetData;

  const result = await db.run(
    'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
    [name, category, price, quantity]
  );

  return {
    id: result.lastID,
    ...sweetData,
  };
};

const update = async (id, sweetData) => {
  const { name, category, price, quantity } = sweetData;

  await db.run(
    'UPDATE sweets SET name = ?, category = ?, price = ?, quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [name, category, price, quantity, id]
  );

  return await getById(id);
};

const remove = async (id) => {
  await db.run('DELETE FROM sweets WHERE id = ?', [id]);
};

const search = async (filters) => {
  let sql = 'SELECT * FROM sweets WHERE 1=1';
  const params = [];

  if (filters.name) {
    sql += ' AND name LIKE ?';
    params.push(`%${filters.name}%`);
  }

  if (filters.category) {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.minPrice !== undefined) {
    sql += ' AND price >= ?';
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    sql += ' AND price <= ?';
    params.push(filters.maxPrice);
  }

  sql += ' ORDER BY id';

  return await db.all(sql, params);
};

const updateQuantity = async (id, quantity) => {
  await db.run(
    'UPDATE sweets SET quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [quantity, id]
  );

  return await getById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  updateQuantity,
};
