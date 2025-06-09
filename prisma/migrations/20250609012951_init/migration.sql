-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surnames" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "identification_number" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "chronological_age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "birth_place" TEXT,
    "marital_status" TEXT,
    "occupation" TEXT,
    "address" TEXT,
    "country" TEXT,
    "state_province" TEXT,
    "city" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "history_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photo_url" TEXT,
    "blood_type" TEXT,
    "general_observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BiophysicsTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "chronological_age" INTEGER NOT NULL,
    "biological_age" REAL NOT NULL,
    "differential_age" REAL NOT NULL,
    "form_data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BiophysicsTest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Range" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rangeId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "min_val" TEXT NOT NULL,
    "max_val" TEXT NOT NULL,
    "inverse" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Board_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identification_number_key" ON "Patient"("identification_number");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
