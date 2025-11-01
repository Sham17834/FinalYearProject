import * as SQLite from "expo-sqlite";

let db;

export const getDb = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("userprofile.db");

  // Create Users table with all columns
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      dateOfBirth TEXT,
      bio TEXT,
      profileImage TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);

  // Add new columns to Users table if they don't exist
  const addColumnIfNotExists = async (table, column, type) => {
    try {
      await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
    } catch (error) {
      // Column already exists, ignore error
    }
  };

  // Add new columns for existing databases
  await addColumnIfNotExists('Users', 'dateOfBirth', 'TEXT');
  await addColumnIfNotExists('Users', 'bio', 'TEXT');
  await addColumnIfNotExists('Users', 'profileImage', 'TEXT');
  await addColumnIfNotExists('Users', 'updatedAt', 'TEXT');

  // Create UserProfile table with all columns
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS UserProfile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Full_Name TEXT,
      email TEXT,
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
      Lifestyle_Score INTEGER
    );
  `);

  // Add new columns for existing UserProfile databases
  await addColumnIfNotExists('UserProfile', 'Full_Name', 'TEXT');
  await addColumnIfNotExists('UserProfile', 'email', 'TEXT');
  await addColumnIfNotExists('UserProfile', 'date', 'TEXT');
  await addColumnIfNotExists('UserProfile', 'Salt_Intake', 'TEXT');
  await addColumnIfNotExists('UserProfile', 'Obesity_Flag', 'TEXT');
  await addColumnIfNotExists('UserProfile', 'Hypertension_Flag', 'TEXT');
  await addColumnIfNotExists('UserProfile', 'Stroke_Flag', 'TEXT');

  // Create HealthRecords table with all columns
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
      screen_time_hours REAL,
      salt_intake TEXT
    );
  `);

  // Add new columns for existing HealthRecords databases
  await addColumnIfNotExists('HealthRecords', 'salt_intake', 'TEXT');

  return db;
};