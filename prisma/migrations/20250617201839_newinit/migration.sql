/*
  Warnings:

  - You are about to drop the `biophysical_tests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ranges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "biophysical_tests";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "boards";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "patients";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ranges";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT NOT NULL,
    "surnames" TEXT NOT NULL,
    "document_type" TEXT,
    "document_number" TEXT,
    "birth_date" DATETIME,
    "chronological_age" INTEGER,
    "gender" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BiophysicsTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "test_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chronological_age" INTEGER NOT NULL,
    "biological_age" REAL NOT NULL,
    "differential_age" REAL NOT NULL,
    "form_data" JSONB NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BiophysicsTest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "inverse" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Range" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "min_age" INTEGER NOT NULL,
    "max_age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "is_athlete" BOOLEAN NOT NULL,
    "min_value" REAL NOT NULL,
    "max_value" REAL NOT NULL,
    "boardId" TEXT NOT NULL,
    CONSTRAINT "Range_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_document_number_key" ON "Patient"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Board_name_key" ON "Board"("name");

-- CreateIndex
CREATE INDEX "Range_boardId_idx" ON "Range"("boardId");
