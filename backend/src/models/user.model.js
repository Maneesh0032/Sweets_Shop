const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');

const create = async (email, password) => {
  const hashedPassword = await hashPassword(password);
  const isAdmin = email.includes('admin');

  const result = await db.run(
    'INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)',
    [email, hashedPassword, isAdmin ? 1 : 0]
  );

  return {
    id: result.lastID,
    email,
    isAdmin: isAdmin,
    createdAt: new Date(),
  };
};

const findByEmail = async (email) => {
  return await db.get('SELECT * FROM users WHERE email = ?', [email]);
};

const findById = async (id) => {
  return await db.get('SELECT id, email, isAdmin FROM users WHERE id = ?', [id]);
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await comparePassword(plainPassword, hashedPassword);
};

const exists = async (email) => {
  const user = await findByEmail(email);
  return !!user;
};

module.exports = {
  create,
  findByEmail,
  findById,
  verifyPassword,
  exists,
};