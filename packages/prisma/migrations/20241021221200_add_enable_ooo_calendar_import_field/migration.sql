-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "enableOOOCalendarImport" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "enableOOOCalendarImport" BOOLEAN NOT NULL DEFAULT false;
