// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client"
}

datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}

enum InventoryStatus {
  active
  draft
  out_of_stock
  discontinued
}
model User {
  id String @id @default(uuid())
  email String @unique
  username String @unique
  password String?
  createdAt DateTime @default(now())
  categories Category[]
  reviews Review[]
}

model Inventory {
  id String @id @default(uuid())
  name String
  slug String @unique
  image Image[] 
  categoryid String
  category Category @relation(fields: [categoryid], references: [id])
  description String
  brand String
  sellingPrice Float
  costPrice Float
  quantity Float
  sku String
  supplier String
  barcode Int
  status InventoryStatus @default(active)
  averageRating Float @default(0)
  reviewCount   Int   @default(0)
  updatedAt DateTime @updatedAt
  reviews Review[]
  specification Json
}

model Category {
  id String @id @default(uuid())
  name String
  userId String
  user User @relation(fields: [userId], references: [id])
  inventories Inventory[]
  @@map("categories")
}

model Image {
  id String @id @default(uuid())
  img String
  createdAt DateTime @default(now())
  inventoryId String
  inventory Inventory @relation(fields: [inventoryId],references: [id])
}

model Review {
  id        String   @id @default(uuid())
  rating    Int
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  inventoryId String
  inventory   Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([inventoryId, userId])
}

