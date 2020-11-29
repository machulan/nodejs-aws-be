import { Client, ClientConfig } from 'pg';
import { Book, BookDTO } from '../models';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions: ClientConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000
};

const GET_PRODUCTS_BY_ID_QUERY = `
  SELECT * FROM products
  LEFT JOIN stocks
  ON products.id = stocks.product_id
  WHERE id = $1;
`;
const GET_PRODUCTS_LIST_QUERY = `
  SELECT * FROM products
  LEFT JOIN stocks
  ON products.id = stocks.product_id;
`;
const CREATE_PRODUCT_QUERY = `
  INSERT INTO products (title, description, price) VALUES
  ($1, $2, $3)
  RETURNING id;
`;
const CREATE_PRODUCT_STOCK_QUERY = `
  INSERT INTO stocks (product_id, count) VALUES
  ($1, $2);
`;

const getProductsById = async (id: string): Promise<Book> => {
  const dbClient = new Client(dbOptions);
  await dbClient.connect();

  try {
    const { 
      rows: [product],
    } = await dbClient.query(GET_PRODUCTS_BY_ID_QUERY, [id]);
    
    if (product) {
      return product as Book;
    }
  } catch (error) {
      console.error('Error during database request executing:', error);
      throw error;
  } finally {
    dbClient.end();
  }
};

const getProductsList = async (): Promise<Book[]> => {
  const dbClient = new Client(dbOptions);
  await dbClient.connect();

  try {
    const { 
      rows: products,
    } = await dbClient.query(GET_PRODUCTS_LIST_QUERY);
    
    if (products) {
      return products as Book[];
    }
  } catch (error) {
      console.error('Error during database request executing:', error);
      throw error;
  } finally {
    dbClient.end();
  }
};

const createProduct = async (book: BookDTO): Promise<Book> => {
  const {
    title,
    description,
    price,
    count
  } = book;
  const dbClient = new Client(dbOptions);
  await dbClient.connect();

  try {
    await dbClient.query('BEGIN');

    const {
      rows: [{ id: newBookId }]
    } = await dbClient.query(CREATE_PRODUCT_QUERY, [title, description, price]);
    await dbClient.query(CREATE_PRODUCT_STOCK_QUERY, [newBookId, count]);

    await dbClient.query('COMMIT');

    return {
      ...book,
      id: newBookId,
    };
  } catch (error) {
      console.error('Error during database request executing:', error);
      await dbClient.query('ROLLBACK');
      throw error;
  } finally {
    dbClient.end();
  }
};

export {
  getProductsById,
  getProductsList,
  createProduct,
};
