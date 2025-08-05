import * as SQLite from 'expo-sqlite';

let db;

export const getDb = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('userprofile.db');

  // Create UserProfile table if it doesn't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS UserProfile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      Daily_Steps INTEGER,
      Sleep_Hours REAL,
      BMI REAL,
      Age INTEGER,
      Gender TEXT,
      Height_cm REAL,
      Weight_kg REAL,
      Chronic_Disease TEXT,
      Exercise_Frequency INTEGER,
      Alcohol_Consumption TEXT,
      Smoking_Habit TEXT,
      Diet_Quality TEXT,
      FRUITS_VEGGIES INTEGER,
      Stress_Level INTEGER,
      Screen_Time_Hours REAL,
      Salt_Intake TEXT,
      Obesity_Flag TEXT,
      Hypertension_Flag TEXT,
      Stroke_Flag TEXT
    );
  `);

  // Migration: Add date column if it doesn't exist
  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN date TEXT;
    `);
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('Error adding date column:', error);
    }
  }

  // Migration: Add Salt_Intake column if it doesn't exist
  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Salt_Intake TEXT;
    `);
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('Error adding Salt_Intake column:', error);
    }
  }

  // Migration: Add prediction columns if they don't exist
  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Obesity_Flag TEXT;
    `);
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('Error adding Obesity_Flag column:', error);
    }
  }
  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Hypertension_Flag TEXT;
    `);
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('Error adding Hypertension_Flag column:', error);
    }
  }
  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Stroke_Flag TEXT;
    `);
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('Error adding Stroke_Flag column:', error);
    }
  }

  // Create HealthRecords table if it doesn't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS HealthRecords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      daily_steps INTEGER,
      sleep_hours REAL,
      bmi REAL,
      age INTEGER,
      gender TEXT,
      height_cm REAL,
      weight_kg REAL,
      chronic_disease TEXT,
      exercise_frequency INTEGER,
      alcohol_consumption TEXT,
      smoking_habit TEXT,
      diet_quality TEXT,
      fruits_veggies INTEGER,
      stress_level INTEGER,
      screen_time_hours REAL
    );
  `);

  return db;
};

// Optional: Function to reset the database (for testing or critical errors)
export const resetDatabase = async () => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS UserProfile;
      DROP TABLE IF EXISTS HealthRecords;
    `);
    db = null; // Force reinitialization
    console.log('Database reset successfully');
    return await getDb(); // Recreate tables
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

