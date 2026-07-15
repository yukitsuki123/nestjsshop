import { relations } from 'drizzle-orm';
import { numeric } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: uuid().primaryKey().defaultRandom().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email:    varchar('email',{length:255}).notNull().unique()
});
// export const product_img = pgTable('shop_images',{})


export const categories = pgTable('categories',{
  id: uuid().primaryKey().defaultRandom().unique(),
  name:varchar('name',{length:255}).notNull(),
  userId:uuid('user_id').notNull().references(()=>users.id)
})
export const product = pgTable('products',{
  id: uuid().primaryKey().defaultRandom().unique(),
  name:varchar('name',{length:255}).notNull(),
  slug:varchar('slug',{length:255}).notNull().unique(),
  costPrice:numeric('cost_price',{precision:10,scale:2}).notNull(),
  sellingPrice:numeric('selling_price',{precision:10,scale:2}).notNull(),
  categoryId:uuid('category_id').notNull().references(()=>categories.id),
  userId:uuid('user_id').notNull().references(()=>users.id),
})

// junction table

export const productRelations  = relations(product,({one})=>({
  category:one(categories,{
    fields:[product.categoryId],
    references:[categories.id]
  })
}))
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(product),
}));

