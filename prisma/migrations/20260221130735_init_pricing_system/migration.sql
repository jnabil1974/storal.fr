-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productType" TEXT NOT NULL DEFAULT 'store',
    "salesCoefficient" REAL NOT NULL DEFAULT 1.8,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPromo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "projection" INTEGER NOT NULL,
    "maxWidth" INTEGER NOT NULL,
    "priceHT" REAL NOT NULL,
    "supplierRef" TEXT,
    "notes" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OptionCoefficient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "optionType" TEXT NOT NULL,
    "coefficient" REAL NOT NULL DEFAULT 1.0,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OptionCoefficient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GlobalCoefficient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CatalogGeneration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedBy" TEXT,
    "productsCount" INTEGER NOT NULL,
    "pricesCount" INTEGER NOT NULL,
    "fileSize" INTEGER,
    "status" TEXT NOT NULL,
    "errorLog" TEXT,
    "gitCommit" TEXT,
    "notes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_modelId_key" ON "Product"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_productId_projection_maxWidth_key" ON "ProductPrice"("productId", "projection", "maxWidth");

-- CreateIndex
CREATE UNIQUE INDEX "OptionCoefficient_productId_optionType_key" ON "OptionCoefficient"("productId", "optionType");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalCoefficient_key_key" ON "GlobalCoefficient"("key");
