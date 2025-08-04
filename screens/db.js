// db.js
import * as SQLite from 'expo-sqlite';

let db;

export const getDb = async () => {
  if (db) return db;            

  db = await SQLite.openDatabaseAsync('userprofile.db');

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
      Salt_Intake TEXT
    );
  `);

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