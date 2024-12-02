-- DropForeignKey
ALTER TABLE "repositories" DROP CONSTRAINT "repositories_category_fkey";

-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ALTER COLUMN "thumbnail" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "repositories" ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ALTER COLUMN "thumbnail" SET DATA TYPE TEXT,
ALTER COLUMN "indication" SET DATA TYPE TEXT,
ALTER COLUMN "composition" SET DATA TYPE TEXT,
ALTER COLUMN "dose" SET DATA TYPE TEXT,
ALTER COLUMN "usage_guideline" SET DATA TYPE TEXT,
ALTER COLUMN "attention" SET DATA TYPE TEXT,
ALTER COLUMN "contraindication" SET DATA TYPE TEXT,
ALTER COLUMN "side_effect" SET DATA TYPE TEXT,
ALTER COLUMN "product_categories" SET DATA TYPE TEXT,
ALTER COLUMN "no_registration" SET DATA TYPE TEXT,
ALTER COLUMN "category" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_category_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
