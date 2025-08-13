import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
  Platform,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import { formatString } from "./translations";
import { getDb } from "./db";
import * as ort from "onnxruntime-react-native";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 50,
    backgroundColor: "#008080",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.9,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    transitionProperty: "width",
    transitionDuration: "300ms",
  },
  progressText: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderColor: "#e2e8f0",
    borderWidth: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 12,
    fontWeight: "600",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 56,
    borderColor: "#e2e8f0",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 15,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  inputFocused: {
    borderColor: "#008080",
    backgroundColor: "#f0fdfa",
  },
  picker: {
    height: 56,
    borderColor: "#e2e8f0",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  pickerContainer: {
    borderColor: "#e2e8f0",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    position: "relative",
  },
  dropdownIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -6 }],
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#64748b",
    zIndex: 1,
  },
  sliderGroup: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderColor: "#e2e8f0",
    borderWidth: 1,
  },
  slider: {
    width: "100%",
    height: 48,
    marginVertical: 8,
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#008080",
    textAlign: "center",
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: "#008080",
    borderWidth: 1,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sliderMinMaxLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  switchGroup: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
    flex: 1,
    marginRight: 16,
  },
  switchToggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#008080",
  },
  secondaryButton: {
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 2,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#1e293b",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  stressLevelIndicator: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    marginTop: 12,
    overflow: "hidden",
    gap: 2,
  },
  stressLevelColor: {
    flex: 1,
    borderRadius: 2,
  },
  bmiContainer: {
    backgroundColor: "#f0fdfa",
    borderColor: "#14b8a6",
    borderWidth: 1,
  },
  bmiText: {
    color: "#0d9488",
    fontWeight: "600",
  },
});

const LifestyleDataInputScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const totalSteps = 3;

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

  // Error states for validation
  const [ageError, setAgeError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");

  useEffect(() => {
    const loadOfflineMode = async () => {
      try {
        const offlineMode = await AsyncStorage.getItem("offlineMode");
        setIsOfflineMode(offlineMode === "true");
      } catch (error) {
        console.error("Error loading offline mode:", error);
      }
    };
    loadOfflineMode();
  }, []);

  const stepTitles = [
    t.personalInfoTitle || "Personal Information",
    t.healthHabitsTitle || "Health & Activity",
    t.lifestyleTitle || "Lifestyle & Wellness",
  ];

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

  const validateStep = (step) => {
    let isValid = true;

    setAgeError("");
    setHeightError("");
    setWeightError("");

    if (step === 1) {
      if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 120) {
        setAgeError("Please enter a valid age (18 - 120)");
        isValid = false;
      }
      if (
        !heightCm ||
        isNaN(heightCm) ||
        parseFloat(heightCm) < 100 ||
        parseFloat(heightCm) > 250
      ) {
        setHeightError("Please enter a valid height (100 - 250 cm)");
        isValid = false;
      }
      if (
        !weightKg ||
        isNaN(weightKg) ||
        parseFloat(weightKg) < 20 ||
        parseFloat(weightKg) > 300
      ) {
        setWeightError("Please enter a valid weight (20 - 300 kg)");
        isValid = false;
      }
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);

    const data = {
      date: new Date().toISOString(),
      Age: parseInt(age),
      Gender: gender,
      Height_cm: parseFloat(heightCm),
      Weight_kg: parseFloat(weightKg),
      BMI: parseFloat(bmi),
      Chronic_Disease: chronicDisease,
      Daily_Steps: dailySteps,
      Exercise_Frequency: exerciseFrequency,
      Sleep_Hours: sleepHours,
      Alcohol_Consumption: alcoholConsumption ? "Yes" : "No",
      Smoking_Habit: smokingHabit ? "Yes" : "No",
      Diet_Quality: dietQuality,
      Stress_Level: stressLevel,
      FRUITS_VEGGIES: fruitsVeggies,
      Screen_Time_Hours: screenTimeHours,
      Salt_Intake: "Unknown",
    };

    try {
      let predictions;

      if (isOfflineMode) {
        // Offline mode: Use ONNX models
        const labelEncoders = JSON.parse(
          await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}label_encoders.json`
          )
        );
        const scaler = JSON.parse(
          await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}scaler.json`
          )
        );
        const selectedFeatures = JSON.parse(
          await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}selected_features.json`
          )
        );

        // Preprocess input data
        const inputData = { ...data };
        inputData.Gender = labelEncoders.Gender[data.Gender] || 0;
        inputData.Chronic_Disease =
          labelEncoders.Chronic_Disease[data.Chronic_Disease] || 0;
        inputData.Alcohol_Consumption =
          labelEncoders.Alcohol_Consumption[data.Alcohol_Consumption] || 0;
        inputData.Smoking_Habit =
          labelEncoders.Smoking_Habit[data.Smoking_Habit] || 0;
        inputData.Diet_Quality =
          labelEncoders.Diet_Quality[data.Diet_Quality] || 0;

        const featureArray = selectedFeatures.map(
          (feature) => inputData[feature]
        );

        const scaledFeatures = featureArray.map((value, index) => {
          const mean = scaler.mean[index];
          const std = scaler.std[index];
          return (value - mean) / std;
        });

        const inputTensor = new ort.Tensor(
          "float32",
          new Float32Array(scaledFeatures),
          [1, scaledFeatures.length]
        );

        const modelPaths = [
          `${FileSystem.documentDirectory}xgb_model_output_0.onnx`,
          `${FileSystem.documentDirectory}xgb_model_output_1.onnx`,
          `${FileSystem.documentDirectory}xgb_model_output_2.onnx`,
        ];
        predictions = {};

        for (let i = 0; i < modelPaths.length; i++) {
          const session = await ort.InferenceSession.create(modelPaths[i]);
          const feeds = { input: inputTensor };
          const results = await session.run(feeds);
          const output = results.output.data;
          const prediction = output[0] > 0.5 ? 1 : 0;
          predictions[
            i === 0
              ? "Obesity_Flag"
              : i === 1
              ? "Hypertension_Flag"
              : "Stroke_Flag"
          ] = prediction;
        }
      } else {
        // Online mode: Use API
        const response = await fetch(
          "https://finalyearproject-c5hy.onrender.com/predict",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error(await response.text());
        predictions = await response.json();
      }

      const fullData = {
        ...data,
        Obesity_Flag: JSON.stringify(predictions.Obesity_Flag || {}),
        Hypertension_Flag: JSON.stringify(predictions.Hypertension_Flag || {}),
        Stroke_Flag: JSON.stringify(predictions.Stroke_Flag || {}),
      };

      const db = await getDb();
      await db.runAsync(
        `INSERT INTO UserProfile (
          date, Age, Gender, Height_cm, Weight_kg, BMI, Chronic_Disease,
          Daily_Steps, Exercise_Frequency, Sleep_Hours, Alcohol_Consumption,
          Smoking_Habit, Diet_Quality, Stress_Level, FRUITS_VEGGIES, Screen_Time_Hours,
          Salt_Intake, Obesity_Flag, Hypertension_Flag, Stroke_Flag
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fullData.date,
          fullData.Age,
          fullData.Gender,
          fullData.Height_cm,
          fullData.Weight_kg,
          fullData.BMI,
          fullData.Chronic_Disease,
          fullData.Daily_Steps,
          fullData.Exercise_Frequency,
          fullData.Sleep_Hours,
          fullData.Alcohol_Consumption,
          fullData.Smoking_Habit,
          fullData.Diet_Quality,
          fullData.Stress_Level,
          fullData.FRUITS_VEGGIES,
          fullData.Screen_Time_Hours,
          fullData.Salt_Intake,
          fullData.Obesity_Flag,
          fullData.Hypertension_Flag,
          fullData.Stroke_Flag,
        ]
      );

      navigation.navigate("MainApp", {
        lifestyleData: data,
        predictionData: predictions,
      });
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStressLevelColors = (level) => {
    const colors = [];
    for (let i = 1; i <= 10; i++) {
      if (i <= level) {
        if (i <= 3) colors.push("#10b981");
        else if (i <= 6) colors.push("#f59e0b");
        else colors.push("#ef4444");
      } else {
        colors.push("#e5e7eb");
      }
    }
    return colors;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.title}>
          {t.lifestyleDataTitle || "Lifestyle Assessment"}
        </Text>
        <Text style={styles.subtitle}>{stepTitles[currentStep - 1]}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(currentStep / totalSteps) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {formatString
              ? formatString(
                  t.lifestyleDataTagline ||
                    "Step {currentStep} of {totalSteps}",
                  {
                    currentStep,
                    totalSteps,
                  }
                )
              : (t.lifestyleDataTagline || "Step {currentStep} of {totalSteps}")
                  .replace("{currentStep}", currentStep)
                  .replace("{totalSteps}", totalSteps)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>

          {currentStep === 1 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.age || "Age"}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      ageError && { borderColor: "#ef4444" },
                    ]}
                    placeholder={t.enterAge || "Enter your age"}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                  />
                  {ageError ? (
                    <Text style={styles.errorText}>{ageError}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.gender || "Gender"}</Text>
                <View style={styles.pickerContainer}>
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
                  <View style={styles.dropdownIcon} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.heightCm || "Height (cm)"}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      heightError && { borderColor: "#ef4444" },
                    ]}
                    placeholder={t.enterHeight || "Enter your height in cm"}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={heightCm}
                    onChangeText={(text) => {
                      setHeightCm(text);
                      if (text && weightKg) calculateBMI(text, weightKg);
                    }}
                  />
                  {heightError ? (
                    <Text style={styles.errorText}>{heightError}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.weightKg || "Weight (kg)"}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      weightError && { borderColor: "#ef4444" },
                    ]}
                    placeholder={t.enterWeight || "Enter your weight in kg"}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={weightKg}
                    onChangeText={(text) => {
                      setWeightKg(text);
                      if (heightCm && text) calculateBMI(heightCm, text);
                    }}
                  />
                  {weightError ? (
                    <Text style={styles.errorText}>{weightError}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.bmi || "BMI"}</Text>
                <TextInput
                  style={[styles.input, styles.bmiContainer]}
                  value={bmi}
                  editable={false}
                  placeholder={t.bmiPlaceholder || "Calculated automatically"}
                  placeholderTextColor="#14b8a6"
                />
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.chronicDisease || "Chronic Disease"}
                </Text>
                <View style={styles.pickerContainer}>
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
                  <View style={styles.dropdownIcon} />
                </View>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.dailySteps || "Daily Steps"}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={50000}
                  step={100}
                  value={dailySteps}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) => setDailySteps(value)}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0</Text>
                  <Text style={styles.sliderMinMaxLabel}>50,000+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {Math.round(dailySteps).toLocaleString()}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.exerciseFrequency || "Exercise Frequency (days/week)"}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={7}
                  step={1}
                  value={exerciseFrequency}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) => setExerciseFrequency(value)}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.sedentary || "Sedentary"}
                  </Text>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.veryActive || "Very Active"}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>
                  {exerciseFrequency} {t.daysPerWeek || "days/week"}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.sleepHours || "Sleep Hours"}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={3}
                  maximumValue={12}
                  step={0.5}
                  value={sleepHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) => setSleepHours(value)}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>3h</Text>
                  <Text style={styles.sliderMinMaxLabel}>12h</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {sleepHours} {t.hours || "hours"}
                </Text>
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {t.alcoholConsumption || "Alcohol Consumption"}
                  </Text>
                  <Switch
                    style={styles.switchToggle}
                    value={alcoholConsumption}
                    onValueChange={setAlcoholConsumption}
                    trackColor={{ false: "#e2e8f0", true: "#14b8a6" }}
                    thumbColor={alcoholConsumption ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {t.smokingHabit || "Smoking Habit"}
                  </Text>
                  <Switch
                    style={styles.switchToggle}
                    value={smokingHabit}
                    onValueChange={setSmokingHabit}
                    trackColor={{ false: "#e2e8f0", true: "#14b8a6" }}
                    thumbColor={smokingHabit ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.dietQuality || "Diet Quality"}
                </Text>
                <View style={styles.pickerContainer}>
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
                  <View style={styles.dropdownIcon} />
                </View>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.fruitsVeggies || "Fruits & Vegetables (servings/day)"}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={fruitsVeggies}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) => setFruitsVeggies(value)}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0</Text>
                  <Text style={styles.sliderMinMaxLabel}>10+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {fruitsVeggies} {t.servingsPerDay || "servings/day"}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.stressLevel || "Stress Level"}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={stressLevel}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) => setStressLevel(value)}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.lowStress || "Low"}
                  </Text>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.highStress || "High"}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>{stressLevel}/10</Text>
                <View style={styles.stressLevelIndicator}>
                  {getStressLevelColors(stressLevel).map((color, index) => (
                    <View
                      key={index}
                      style={[
                        styles.stressLevelColor,
                        { backgroundColor: color },
                      ]}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.screenTimeHours || "Screen Time (hours/day)"}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={0.5}
                  value={screenTimeHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) => setScreenTimeHours(value)}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0h</Text>
                  <Text style={styles.sliderMinMaxLabel}>16h</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {screenTimeHours} {t.hoursPerDay || "hours/day"}
                </Text>
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handlePrevious}
              >
                <Text style={styles.secondaryButtonText}>
                  {t.previous || "Previous"}
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>{t.next || "Next"}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting
                    ? t.submitting || "Submitting..."
                    : t.submit || "Submit"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LifestyleDataInputScreen;