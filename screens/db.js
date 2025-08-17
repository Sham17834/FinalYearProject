import * as SQLite from "expo-sqlite";

let db;

export const getDb = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("userprofile.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      createdAt TEXT
    );
  `);

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
      Stroke_Flag TEXT,
      Full_Name TEXT,
      email TEXT
    );
  `);

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Full_Name TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN email TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN date TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Salt_Intake TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Obesity_Flag TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Hypertension_Flag TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

  try {
    await db.execAsync(`
      ALTER TABLE UserProfile ADD COLUMN Stroke_Flag TEXT;
    `);
  } catch (error) {
    if (!error.message.includes("duplicate column name")) {
    }
  }

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
