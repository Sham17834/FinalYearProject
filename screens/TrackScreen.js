import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import { getDb } from "./db";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    backgroundColor: "#008080",
    paddingTop: 20,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
  },
  recordHeader: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  recordDate: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  fieldValue: {
    fontSize: 15,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  readOnlyField: {
    backgroundColor: "#f1f5f9",
    color: "#6b7280",
  },
  picker: {
    height: 50,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    color: "#1f2937",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },
  switchIndicator: {
    marginLeft: 12,
  },
  sliderGroup: {
    marginBottom: 6,
  },
  sliderContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 8,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#008080",
    textAlign: "center",
    marginTop: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sliderRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rangeLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  stressIndicator: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    marginVertical: 8,
    overflow: "hidden",
  },
  stressColor: {
    flex: 1,
  },
  submitSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: "#008080",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  validationNote: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
};

const TrackScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bmi, setBmi] = useState("");
  const [chronicDisease, setChronicDisease] = useState("None");
  const [dailySteps, setDailySteps] = useState(5000);
  const [exerciseFrequency, setExerciseFrequency] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [alcoholConsumption, setAlcoholConsumption] = useState(false);
  const [smokingHabit, setSmokingHabit] = useState(false);
  const [dietQuality, setDietQuality] = useState("Good");
  const [fruitsVeggies, setFruitsVeggies] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [screenTimeHours, setScreenTimeHours] = useState(4);

  const genderOptions = [
    { label: t.male || "Male", value: "Male" },
    { label: t.female || "Female", value: "Female" },
  ];

  const chronicDiseaseOptions = [
    { label: t.none || "None", value: "None" },
    { label: t.stroke || "Stroke", value: "Stroke" },
    { label: t.hypertension || "Hypertension", value: "Hypertension" },
    { label: t.obesity || "Obesity", value: "Obesity" },
  ];

  const dietQualityOptions = [
    { label: t.excellent || "Excellent", value: "Excellent" },
    { label: t.good || "Good", value: "Good" },
    { label: t.average || "Average", value: "Average" },
    { label: t.poor || "Poor", value: "Poor" },
  ];

  const calculateBMI = (height, weight) => {
    if (height && weight && !isNaN(height) && !isNaN(weight)) {
      const heightM = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
      setBmi(bmiValue);
    } else {
      setBmi("");
    }
  };

  const validateForm = () => {
    if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 120) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorAge || "Please enter a valid age (18 - 120)"
      );
      return false;
    }
    if (
      !heightCm ||
      isNaN(heightCm) ||
      parseFloat(heightCm) < 100 ||
      parseFloat(heightCm) > 250
    ) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorHeight || "Please enter a valid height (100 - 250 cm)"
      );
      return false;
    }
    if (
      !weightKg ||
      isNaN(weightKg) ||
      parseFloat(weightKg) < 30 ||
      parseFloat(weightKg) > 300
    ) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorWeight || "Please enter a valid weight (30 - 300 kg)"
      );
      return false;
    }
    if (dailySteps < 0 || dailySteps > 50000) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorSteps || "Please enter valid daily steps (0 - 50,000)"
      );
      return false;
    }
    if (sleepHours < 0 || sleepHours > 12) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorSleep || "Please enter valid sleep hours (0 - 12)"
      );
      return false;
    }
    if (exerciseFrequency < 0 || exerciseFrequency > 7) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorExercise || "Please enter valid exercise frequency (0 - 7 days)"
      );
      return false;
    }
    if (fruitsVeggies < 0 || fruitsVeggies > 15) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorFruitsVeggies || "Please enter valid servings (0 - 15)"
      );
      return false;
    }
    if (screenTimeHours < 0 || screenTimeHours > 16) {
      Alert.alert(
        t.error || "Validation Error",
        t.errorScreenTime || "Please enter valid screen time (0 - 16 hours)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const data = {
      date: getCurrentDate(),
      daily_steps: Math.round(dailySteps),
      sleep_hours: sleepHours,
      bmi: parseFloat(bmi) || null,
      age: parseInt(age),
      gender,
      height_cm: parseFloat(heightCm),
      weight_kg: parseFloat(weightKg),
      chronic_disease: chronicDisease,
      exercise_frequency: exerciseFrequency,
      alcohol_consumption: alcoholConsumption ? "Yes" : "No",
      smoking_habit: smokingHabit ? "Yes" : "No",
      diet_quality: dietQuality,
      fruits_veggies: fruitsVeggies,
      stress_level: stressLevel,
      screen_time_hours: screenTimeHours,
    };

    try {
      const db = await getDb();
      console.log("Database opened successfully");

      await db.runAsync(
        `INSERT INTO HealthRecords (
        date, daily_steps, sleep_hours, bmi, age, gender, height_cm, weight_kg,
        chronic_disease, exercise_frequency, alcohol_consumption, smoking_habit,
        diet_quality, fruits_veggies, stress_level, screen_time_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.date,
          data.daily_steps,
          data.sleep_hours,
          data.bmi,
          data.age,
          data.gender,
          data.height_cm,
          data.weight_kg,
          data.chronic_disease,
          data.exercise_frequency,
          data.alcohol_consumption,
          data.smoking_habit,
          data.diet_quality,
          data.fruits_veggies,
          data.stress_level,
          data.screen_time_hours,
        ]
      );
      console.log("Health record saved to database:", data);

      navigation.navigate("MainApp", {
        screen: "Progress",
        params: { newRecord: data },
      });
    } catch (error) {
      console.error(
        "Error saving data to database:",
        error.message,
        error.stack
      );
      Alert.alert(
        t.error || "Error",
        t.errorSaving || "Failed to save health record: " + error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDate = getCurrentDate();
  const recordId = `HR-${Date.now().toString().slice(-6)}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <ScrollView
        style={styles.content}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, {}]}>
          <Text style={styles.appName}>
            {t.trackHealthTitle || "Track Your Health"}
          </Text>
          <Text style={styles.appTagline}>
            {t.trackTagline || "Record your health metrics"}
          </Text>
        </View>
        <View style={styles.recordHeader}>
          <Text style={styles.recordTitle}>
            {t.healthAssessmentRecord || "Health Assessment Record"}
          </Text>
          <Text style={styles.recordDate}>
            {t.date || "Date"}: {currentDate}
          </Text>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.personalInfo || "Personal Information"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.age || "Age"}</Text>
              <TextInput
                style={styles.fieldValue}
                placeholder={t.enterAge || "Enter your age"}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.gender || "Gender"}</Text>
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                {genderOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.physicalMeasurements || "Physical Measurements"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.heightCm || "Height (cm)"}
              </Text>
              <TextInput
                style={styles.fieldValue}
                placeholder={t.enterHeight || "Enter your height in cm"}
                keyboardType="numeric"
                value={heightCm}
                onChangeText={(text) => {
                  setHeightCm(text);
                  if (text && weightKg) calculateBMI(text, weightKg);
                }}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.weightKg || "Weight (kg)"}
              </Text>
              <TextInput
                style={styles.fieldValue}
                placeholder={t.enterWeight || "Enter your weight in kg"}
                keyboardType="numeric"
                value={weightKg}
                onChangeText={(text) => {
                  setWeightKg(text);
                  if (heightCm && text) calculateBMI(heightCm, text);
                }}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.bmi || "BMI (calculated)"}
              </Text>
              <TextInput
                style={[styles.fieldValue, styles.readOnlyField]}
                value={bmi}
                editable={false}
                placeholder={t.bmiPlaceholder || "Calculated automatically"}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.medicalHistory || "Medical History"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.chronicDisease || "Chronic Disease"}
              </Text>
              <Picker
                selectedValue={chronicDisease}
                style={styles.picker}
                onValueChange={(itemValue) => setChronicDisease(itemValue)}
              >
                {chronicDiseaseOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.activityExercise || "Activity & Exercise"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.steps || "Daily Steps"}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={50000}
                  step={100}
                  value={dailySteps}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onValueChange={(value) => setDailySteps(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>0</Text>
                  <Text style={styles.rangeLabel}>50,000+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {Math.round(dailySteps).toLocaleString()} {t.steps || "steps"}
                </Text>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.exerciseFrequency || "Exercise Frequency (days/week)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={7}
                  step={1}
                  value={exerciseFrequency}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onValueChange={(value) => setExerciseFrequency(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>
                    {t.sedentary || "Sedentary"}
                  </Text>
                  <Text style={styles.rangeLabel}>{t.daily || "Daily"}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {exerciseFrequency === 1
                    ? `${exerciseFrequency} ${t.day || "day"}`
                    : `${exerciseFrequency} ${t.days || "days"}`}{" "}
                  {t.perWeek}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.sleepRecovery || "Sleep & Recovery"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.sleepHours || "Sleep Duration"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={12}
                  step={0.5}
                  value={sleepHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onValueChange={(value) => setSleepHours(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{t.poor || "Poor"}</Text>
                  <Text style={styles.rangeLabel}>
                    {t.excessive || "Excessive"}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>
                  {sleepHours} {t.hours || "hours"} {t.perNight || "per night"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.lifestyleHabits || "Lifestyle Habits"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {t.alcoholConsumption || "Alcohol Consumption"}
                </Text>
                <Switch
                  style={styles.switchIndicator}
                  value={alcoholConsumption}
                  onValueChange={(value) => setAlcoholConsumption(value)}
                  trackColor={{ false: "#e5e7eb", true: "#008080" }}
                  thumbColor={alcoholConsumption ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {t.smokingHabit || "Smoking Habit"}
                </Text>
                <Switch
                  style={styles.switchIndicator}
                  value={smokingHabit}
                  onValueChange={(value) => setSmokingHabit(value)}
                  trackColor={{ false: "#e5e7eb", true: "#008080" }}
                  thumbColor={smokingHabit ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.screenTimeHours || "Screen Time (hours/day)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={0.5}
                  value={screenTimeHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onValueChange={(value) => setScreenTimeHours(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>
                    {t.minimal || "Minimal"}
                  </Text>
                  <Text style={styles.rangeLabel}>
                    {t.extensive || "Extensive"}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>
                  {screenTimeHours} {t.hours || "hours"} {t.daily || "daily"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.nutritionAssessment || "Nutrition Assessment"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.dietQuality || "Overall Diet Quality"}
              </Text>
              <Picker
                selectedValue={dietQuality}
                style={styles.picker}
                onValueChange={(itemValue) => setDietQuality(itemValue)}
              >
                {dietQualityOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.fruitsVeggies || "Fruits & Vegetables (servings/day)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={15}
                  step={1}
                  value={fruitsVeggies}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onValueChange={(value) => setFruitsVeggies(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{t.low || "Low"}</Text>
                  <Text style={styles.rangeLabel}>{t.high || "High"}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {fruitsVeggies === 1
                    ? `${fruitsVeggies} ${t.serving || "serving"}`
                    : `${fruitsVeggies} ${t.servings || "servings"}`}{" "}
                  {t.daily || "daily"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.mentalHealthAssessment || "Mental Health Assessment"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.stressLevel || "Perceived Stress Level (1-10)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={stressLevel}
                  minimumTrackTintColor="#10b981"
                  maximumTrackTintColor="#ef4444"
                  onValueChange={(value) => setStressLevel(value)}
                />
                <View style={styles.stressIndicator}>
                  <View
                    style={[styles.stressColor, { backgroundColor: "#10b981" }]}
                  />
                  <View
                    style={[styles.stressColor, { backgroundColor: "#a3e635" }]}
                  />
                  <View
                    style={[styles.stressColor, { backgroundColor: "#f59e0b" }]}
                  />
                  <View
                    style={[styles.stressColor, { backgroundColor: "#ef4444" }]}
                  />
                </View>
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{t.low || "Low"}</Text>
                  <Text style={styles.rangeLabel}>{t.high || "High"}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {t.level || "Level"} {stressLevel}/10
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? t.saving || "Saving Record..."
                : t.save || "Save Health Record"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.validationNote}>
            {t.validationNote || "All fields are validated before submission"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackScreen;
