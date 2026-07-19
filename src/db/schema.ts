import { defineRelations } from 'drizzle-orm';
import { jsonb, numeric, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
export const statusEnum = pgEnum('status', [
  'active',
  'draft',
  'out_of_stock',
  'discontinued',
]);
export const users = pgTable('user', {
  id: uuid().primaryKey().defaultRandom().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

export const images = pgTable('images', {
  id: uuid().primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id),
  filename: varchar('filename', { length: 256 }).notNull(),
  path: varchar('path', { length: 256 }).notNull(),
  mimetype: varchar('mimetype', { length: 256 }).notNull(),
  size: varchar('size').notNull(),
});
export const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
});
export const product = pgTable('products', {
  id: uuid().primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  costPrice: numeric('cost_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: numeric('selling_price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  sku: varchar('sku', { length: 255 }).notNull().unique(),
  barcode: integer('barcode').notNull().unique(),
  quantity: integer('quantity').notNull(),
  avgRating: integer('avg_rating').default(0),
  reviewCount: integer('review_count').default(0),
  specification: jsonb('specification'),
  status: statusEnum(),
  createdAt: timestamp().defaultNow(),
  waranty: varchar('waranty').notNull(),
  supplier: varchar('supplier').notNull(),
  restockLevel: integer('restock_level').notNull().default(0),
});

// junction table
export const product_images = defineRelations({ product, images }, (r) => ({
  images: {
    product: r.one.product({
      from: r.images.productId,
      to: r.product.id,
    }),
  },
  product: {
    images: r.many.images(),
  },
}));
export const product_categories = defineRelations(
  { product, categories }, // pass the tables as an object
  (r) => ({
    product: {
      category: r.one.categories({
        from: r.product.categoryId,
        to: r.categories.id,
      }),
    },
    categories: {
      products: r.many.product(),
    },
  }),
);
