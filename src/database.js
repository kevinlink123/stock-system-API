import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'merceria.db');

// Asegurar que el directorio data existe
import fs from 'fs';
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`);

// Preparar statements para mejor performance
// CATEGORIES
const editCategory = db.prepare(`
  UPDATE categories
  SET name = @name
  WHERE id = @id  
`);

const deleteCategory = db.prepare(`
  DELETE FROM categories WHERE id = ?  
`);

const insertCategory = db.prepare(`
  INSERT INTO categories (name) 
  VALUES (@name)
`);

const getCategoryWithProducts = db.prepare(`
    SELECT
        c.id as category_id,
        c.name as category_name,
        p.id as product_id,
        p.name as product_name,
        p.price
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    WHERE c.id = ?
    ORDER BY p.created_at DESC        
`);

const getAllCategoriesWithProducts = db.prepare(`
  SELECT 
    c.*,
      json_group_array(
        json_object(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'created_at', p.created_at
        )
      ) as products
  FROM categories c
  LEFT JOIN products p ON c.id = p.category_id
  GROUP BY c.id
  ORDER BY c.created_at DESC
`);

const getAllCategories = db.prepare('SELECT * FROM categories ORDER BY created_at DESC');

// PRODUCTS
const editProduct = db.prepare(`
  UPDATE products
  SET name = @name, price = @price
  WHERE id = @id
`);

const deleteProduct = db.prepare(`
  DELETE FROM products WHERE id = ?  
`);

const insertProduct = db.prepare(`
    INSERT INTO products (name, price, category_id)
    VALUES (@name, @price, @category_id)    
`);

const getAllProducts = db.prepare(`
    SELECT * FROM products ORDER BY created_at DESC    
`);

const getProductByCategory = db.prepare(`
    SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC    
`);

export {
    db,
    insertCategory,
    deleteCategory,
    editCategory,
    getAllCategories,
    getCategoryWithProducts,
    getAllCategoriesWithProducts,
    insertProduct,
    deleteProduct,
    editProduct,
    getAllProducts,
    getProductByCategory
};