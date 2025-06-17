-- CreateTable
CREATE TABLE "patients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "names" TEXT NOT NULL,
    "surnames" TEXT NOT NULL,
    "identification_number" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "chronological_age" REAL NOT NULL,
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
    "blood_type" TEXT,
    "general_observations" TEXT,
    "photo_url" TEXT,
    "history_date" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "biophysical_tests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "chronological_age" REAL NOT NULL,
    "biological_age" REAL NOT NULL,
    "differential_age" REAL NOT NULL,
    "gender" TEXT NOT NULL,
    "is_athlete" BOOLEAN NOT NULL,
    "measurements" TEXT NOT NULL,
    "partial_ages" TEXT NOT NULL,
    "test_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "biophysical_tests_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ranges" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "min_age" REAL NOT NULL,
    "max_age" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "boards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "range_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "min_val" TEXT NOT NULL,
    "max_val" TEXT NOT NULL,
    "inverse" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "boards_range_id_fkey" FOREIGN KEY ("range_id") REFERENCES "ranges" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
