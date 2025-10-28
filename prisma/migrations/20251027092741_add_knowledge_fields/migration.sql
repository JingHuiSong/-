-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_knowledge_base" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "question" TEXT,
    "answer" TEXT,
    "authorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "knowledge_base_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_knowledge_base" ("authorId", "category", "content", "createdAt", "id", "published", "tags", "title", "updatedAt", "views") SELECT "authorId", "category", "content", "createdAt", "id", "published", "tags", "title", "updatedAt", "views" FROM "knowledge_base";
DROP TABLE "knowledge_base";
ALTER TABLE "new_knowledge_base" RENAME TO "knowledge_base";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
