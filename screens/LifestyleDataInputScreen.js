import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from "react";
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
  Switch,
  Animated,
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
import { Asset } from "expo-asset";
import debounce from "lodash.debounce";

// Fallback translations to use when LanguageContext is not properly set up
const fallbackTranslations = {
  lifestyleDataTitle: "Lifestyle Assessment",
  personalInfoTitle: "Personal Information",
  healthHabitsTitle: "Health & Activity",
  lifestyleTitle: "Lifestyle & Wellness",
  lifestyleDataTagline: "Step {currentStep} of {totalSteps}",
  age: "Age",
  enterAge: "Enter your age",
  errorAge: "Please enter a valid age (18 - 120)",
  gender: "Gender",
  male: "Male",
  female: "Female",
  heightCm: "Height (cm)",
  enterHeight: "Enter your height in cm",
  errorHeight: "Please enter a valid height (100 - 250 cm)",
  weightKg: "Weight (kg)",
  enterWeight: "Enter your weight in kg",
  errorWeight: "Please enter a valid weight (20 - 300 kg)",
  bmi: "BMI",
  bmiPlaceholder: "Calculated automatically",
  chronicDisease: "Chronic Disease",
  none: "None",
  stroke: "Stroke",
  hypertension: "Hypertension",
  obesity: "Obesity",
  dailySteps: "Daily Steps",
  exerciseFrequency: "Exercise Frequency (days/week)",
  sedentary: "Sedentary",
  veryActive: "Very Active",
  daysPerWeek: "days/week",
  sleepHours: "Sleep Hours",
  hours: "hours",
  alcoholConsumption: "Alcohol Consumption",
  smokingHabit: "Smoking Habit",
  dietQuality: { label: "Diet Quality" },
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  poor: "Poor",
  fruitsVeggies: "Fruits & Vegetables (servings/day)",
  servingsPerDay: "servings/day",
  stressLevel: "Stress Level",
  lowStress: "Low",
  highStress: "High",
  screenTimeHours: "Screen Time (hours/day)",
  previous: "Previous",
  next: "Next",
  submit: "Submit",
  submitting: "Submitting...",
};

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
});

const calculateLifestyleScore = (lifestyleData) => {
  if (!lifestyleData) return 0;

  let totalScore = 0;
  const maxScore = 100;

  const bmiScore = (() => {
    const bmi = lifestyleData.BMI;
    if (!bmi) return 0;
    if (bmi >= 18.5 && bmi < 25) return 15;
    if (bmi >= 17 && bmi < 18.5) return 12;
    if (bmi >= 25 && bmi < 27) return 12;
    if (bmi >= 16 && bmi < 17) return 8; 
    if (bmi >= 27 && bmi < 30) return 8;
    if (bmi >= 15 && bmi < 16) return 4; 
    if (bmi >= 30 && bmi < 35) return 4;
    return 0; 
  })();

  const stepsScore = (() => {
    const steps = lifestyleData.Daily_Steps || 0;
    if (steps >= 10000) return 15; 
    if (steps >= 8000) return 12;
    if (steps >= 6000) return 9;
    if (steps >= 4000) return 6;
    if (steps >= 2000) return 3; 
    return 0; 
  })();

  const sleepScore = (() => {
    const hours = lifestyleData.Sleep_Hours || 0;
    if (hours >= 7 && hours <= 9) return 15; 
    if (hours >= 6 && hours < 7) return 12; 
    if (hours > 9 && hours <= 10) return 12; 
    if (hours >= 5 && hours < 6) return 8; 
    if (hours > 10 && hours <= 11) return 8; 
    if (hours >= 4 && hours < 5) return 4; 
    if (hours > 11) return 4; 
    return 0; 
  })();

  const exerciseScore = (() => {
    const frequency = lifestyleData.Exercise_Frequency || 0;
    if (frequency >= 5) return 15; 
    if (frequency >= 3) return 12; 
    if (frequency >= 2) return 8; 
    if (frequency >= 1) return 4; 
    return 0; 
  })();

  const dietScore = (() => {
    const quality = lifestyleData.Diet_Quality?.toLowerCase() || "poor";
    switch (quality) {
      case "excellent":
        return 10;
      case "good":
        return 8;
      case "fair":
        return 6;
      case "poor":
        return 2;
      default:
        return 0;
    }
  })();

  const fruitsVeggiesScore = (() => {
    const servings = lifestyleData.FRUITS_VEGGIES || 0;
    if (servings >= 5) return 10; 
    if (servings >= 4) return 8;
    if (servings >= 3) return 6;
    if (servings >= 2) return 4;
    if (servings >= 1) return 2;
    return 0;
  })();

  const stressScore = (() => {
    const stress = lifestyleData.Stress_Level || 5;
    if (stress <= 2) return 10; 
    if (stress <= 4) return 8; 
    if (stress <= 6) return 6; 
    if (stress <= 8) return 3; 
    return 0; 
  })();

  const screenTimeScore = (() => {
    const hours = lifestyleData.Screen_Time_Hours || 0;
    if (hours <= 2) return 5; 
    if (hours <= 4) return 4; 
    if (hours <= 6) return 3; 
    if (hours <= 8) return 2; 
    if (hours <= 10) return 1; 
    return 0; 
  })();

  const smokingPenalty = (() => {
    const smoking = lifestyleData.Smoking_Habit?.toLowerCase() || "no";
    if (smoking === "yes" || smoking === "daily" || smoking === "heavy")
      return -10;
    if (smoking === "occasionally" || smoking === "social") return -5;
    return 0;
  })();

  const alcoholPenalty = (() => {
    const alcohol = lifestyleData.Alcohol_Consumption?.toLowerCase() || "no";
    if (alcohol === "heavy" || alcohol === "daily") return -5;
    if (alcohol === "frequently") return -2;
    return 0;
  })();

  totalScore =
    bmiScore +
    stepsScore +
    sleepScore +
    exerciseScore +
    dietScore +
    fruitsVeggiesScore +
    stressScore +
    screenTimeScore +
    smokingPenalty +
    alcoholPenalty;

  const finalScore = Math.max(0, Math.min(100, totalScore));
  return finalScore;
};

const ProgressBar = React.memo(({ currentStep, totalSteps, t }) => {
  const progressAnim = useRef(new Animated.Value(currentStep / totalSteps)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / totalSteps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: animatedWidth }]} />
      </View>
      <Text style={styles.progressText}>
        {formatString
          ? formatString(
              t.lifestyleDataTagline || fallbackTranslations.lifestyleDataTagline,
              { currentStep, totalSteps }
            )
          : (t.lifestyleDataTagline || fallbackTranslations.lifestyleDataTagline)
              .replace("{currentStep}", currentStep)
              .replace("{totalSteps}", totalSteps)}
      </Text>
    </View>
  );
});

const LifestyleDataInputScreen = () => {
  const context = useContext(LanguageContext);
  const t = context && context.t ? context.t : fallbackTranslations;
  
  // Log warning if context is not properly set up
  useEffect(() => {
    if (!context || !context.t) {
      console.warn("LanguageContext is not properly set up. Using fallback translations.");
    }
  }, [context]);

  const navigation = useNavigation();
  const route = useRoute();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineFilesReady, setOfflineFilesReady] = useState(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    heightCm: "",
    weightKg: "",
    bmi: "",
    chronicDisease: "None",
    dailySteps: 5000,
    exerciseFrequency: 3,
    sleepHours: 7,
    alcoholConsumption: false,
    smokingHabit: false,
    dietQuality: "Good",
    fruitsVeggies: 5,
    stressLevel: 5,
    screenTimeHours: 4,
  });

  const [errors, setErrors] = useState({
    age: "",
    heightCm: "",
    weightKg: "",
  });

  const [focusedInput, setFocusedInput] = useState(null);

  const loadOfflineFilesFromAssets = async () => {
    try {
      console.log("Document directory:", FileSystem.documentDirectory);
      console.log("Loading offline model files from assets...");

      const assets = [
        {
          name: "label_encoders.json",
          module: require("../assets/model/label_encoders.json"),
          isJson: true,
        },
        {
          name: "scaler.json",
          module: require("../assets/model/scaler.json"),
          isJson: true,
        },
        {
          name: "selected_features.json",
          module: require("../assets/model/selected_features.json"),
          isJson: true,
        },
        {
          name: "xgb_model_output_0.onnx",
          module: require("../assets/model/xgb_model_output_0.onnx"),
          isJson: false,
        },
        {
          name: "xgb_model_output_1.onnx",
          module: require("../assets/model/xgb_model_output_1.onnx"),
          isJson: false,
        },
        {
          name: "xgb_model_output_2.onnx",
          module: require("../assets/model/xgb_model_output_2.onnx"),
          isJson: false,
        },
      ];

      for (const asset of assets) {
        try {
          console.log(`Attempting to load asset: ${asset.name}`);
          console.log(`Required module: ${JSON.stringify(asset.module)}`);

          if (asset.isJson && typeof asset.module === "object") {
            console.log(
              `JSON file ${asset.name} parsed by Metro, writing directly...`
            );
            const destinationPath = `${FileSystem.documentDirectory}${asset.name}`;
            await FileSystem.writeAsStringAsync(
              destinationPath,
              JSON.stringify(asset.module)
            );
            console.log(
              `Successfully wrote ${asset.name} to ${destinationPath}`
            );
          } else {
            if (
              !asset.module ||
              (typeof asset.module === "object" && !asset.module.uri)
            ) {
              throw new Error(
                `Invalid module for ${asset.name}. Ensure the file is correctly included in assets/model/ and bundled in app.json.`
              );
            }
            const assetModule = Asset.fromModule(asset.module);
            console.log(
              `Asset module resolved: ${JSON.stringify(assetModule)}`
            );
            await assetModule.downloadAsync();
            if (!assetModule.localUri) {
              throw new Error(
                `Failed to download asset: ${asset.name}. No local URI available. Check if the file is bundled in app.json.`
              );
            }
            const destinationPath = `${FileSystem.documentDirectory}${asset.name}`;
            console.log(
              `Copying from ${assetModule.localUri} to ${destinationPath}`
            );
            await FileSystem.copyAsync({
              from: assetModule.localUri,
              to: destinationPath,
            });
            console.log(
              `Successfully copied ${asset.name} to ${destinationPath}`
            );
          }

          const fileInfo = await FileSystem.getInfoAsync(
            `${FileSystem.documentDirectory}${asset.name}`
          );
          if (!fileInfo.exists) {
            throw new Error(
              `Copied file not found at ${FileSystem.documentDirectory}${asset.name}`
            );
          }
        } catch (error) {
          console.error(`Error processing asset ${asset.name}:`, error);
          throw new Error(`Failed to load ${asset.name}: ${error.message}`);
        }
      }

      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      console.log("Files in document directory:", files);

      const scalerContent = await FileSystem.readAsStringAsync(
        `${FileSystem.documentDirectory}scaler.json`
      );
      console.log("Raw scaler.json content:", scalerContent);

      setOfflineFilesReady(true);
      console.log("All offline files loaded successfully");
      return true;
    } catch (error) {
      console.error("Error loading offline files:", error);
      Alert.alert(
        "Error Loading Offline Files",
        `Failed to load model files: ${error.message}. Please ensure that all files are present in assets/model/ and included in app.json under assetBundlePatterns. Switching to online mode.`,
        [{ text: "OK" }]
      );
      setOfflineFilesReady(false);
      return false;
    }
  };

  const checkOfflineFilesExist = async () => {
    try {
      const requiredFiles = [
        "label_encoders.json",
        "scaler.json",
        "selected_features.json",
        "xgb_model_output_0.onnx",
        "xgb_model_output_1.onnx",
        "xgb_model_output_2.onnx",
      ];

      const fileChecks = await Promise.all(
        requiredFiles.map(async (filename) => {
          const filePath = `${FileSystem.documentDirectory}${filename}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          console.log(
            `Checking file ${filePath}: ${fileInfo.exists ? "exists" : "not found"}`
          );
          return fileInfo.exists;
        })
      );

      const allFilesExist = fileChecks.every((exists) => exists);
      console.log("Offline files exist in documents directory:", allFilesExist);
      return allFilesExist;
    } catch (error) {
      console.error("Error checking offline files:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeOfflineMode = async () => {
      try {
        const offlineMode = await AsyncStorage.getItem("offlineMode");
        const shouldUseOffline = offlineMode === "true";
        setIsOfflineMode(shouldUseOffline);

        if (shouldUseOffline) {
          const filesExist = await checkOfflineFilesExist();
          if (!filesExist) {
            console.log("Offline files not found, loading from assets...");
            const success = await loadOfflineFilesFromAssets();
            if (!success) {
              setIsOfflineMode(false);
              await AsyncStorage.setItem("offlineMode", "false");
              Alert.alert(
                "Offline Mode Disabled",
                "Failed to load offline files. Switched to online mode.",
                [{ text: "OK" }]
              );
            }
          } else {
            setOfflineFilesReady(true);
            console.log("Offline files already exist in documents directory");
          }
        }
      } catch (error) {
        console.error("Error initializing offline mode:", error);
        setIsOfflineMode(false);
        await AsyncStorage.setItem("offlineMode", "false");
        Alert.alert(
          "Error",
          "Failed to initialize offline mode. Using online mode.",
          [{ text: "OK" }]
        );
      }
    };

    initializeOfflineMode();
  }, []);

  const calculateBMI = useCallback(
    debounce((height, weight) => {
      if (height && weight && !isNaN(height) && !isNaN(weight)) {
        const heightM = parseFloat(height) / 100;
        const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
        setFormData((prev) => ({ ...prev, bmi: bmiValue }));
      } else {
        setFormData((prev) => ({ ...prev, bmi: "" }));
      }
    }, 300),
    []
  );

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = { age: "", heightCm: "", weightKg: "" };

    if (step === 1) {
      const ageNum = parseInt(formData.age);
      if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        newErrors.age = t.errorAge || fallbackTranslations.errorAge;
        isValid = false;
      }
      const heightNum = parseFloat(formData.heightCm);
      if (
        !formData.heightCm ||
        isNaN(heightNum) ||
        heightNum < 100 ||
        heightNum > 250
      ) {
        newErrors.heightCm = t.errorHeight || fallbackTranslations.errorHeight;
        isValid = false;
      }
      const weightNum = parseFloat(formData.weightKg);
      if (
        !formData.weightKg ||
        isNaN(weightNum) ||
        weightNum < 20 ||
        weightNum > 300
      ) {
        newErrors.weightKg = t.errorWeight || fallbackTranslations.errorWeight;
        isValid = false;
      }
    }

    setErrors(newErrors);
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
      Age: parseInt(formData.age),
      Gender: formData.gender,
      Height_cm: parseFloat(formData.heightCm),
      Weight_kg: parseFloat(formData.weightKg),
      BMI: parseFloat(formData.bmi),
      Chronic_Disease: formData.chronicDisease,
      Daily_Steps: formData.dailySteps,
      Exercise_Frequency: formData.exerciseFrequency,
      Sleep_Hours: formData.sleepHours,
      Alcohol_Consumption: formData.alcoholConsumption ? "Yes" : "No",
      Smoking_Habit: formData.smokingHabit ? "Yes" : "No",
      Diet_Quality: formData.dietQuality,
      Stress_Level: formData.stressLevel,
      FRUITS_VEGGIES: formData.fruitsVeggies,
      Screen_Time_Hours: formData.screenTimeHours,
      Salt_Intake: "Unknown",
    };

    try {
      let predictions = {};

      if (isOfflineMode && offlineFilesReady) {
        try {
          const labelEncodersContent = await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}label_encoders.json`
          );
          console.log("Raw label_encoders.json content:", labelEncodersContent);
          const labelEncoders = JSON.parse(labelEncodersContent);
          if (!labelEncoders || typeof labelEncoders !== "object") {
            throw new Error("Invalid label_encoders.json content");
          }
          console.log("labelEncoders:", labelEncoders);

          const scalerContent = await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}scaler.json`
          );
          console.log("Raw scaler.json content:", scalerContent);
          const scaler = JSON.parse(scalerContent);
          if (
            !scaler.mean ||
            !scaler.scale ||
            !Array.isArray(scaler.mean) ||
            !Array.isArray(scaler.scale)
          ) {
            throw new Error(
              "Invalid scaler.json content: missing or invalid mean or scale arrays"
            );
          }
          if (scaler.mean.length !== scaler.scale.length) {
            throw new Error(
              `scaler.json mismatch: mean length (${scaler.mean.length}) does not match scale length (${scaler.scale.length})`
            );
          }
          console.log("scaler:", scaler);

          const selectedFeaturesContent = await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}selected_features.json`
          );
          console.log(
            "Raw selected_features.json content:",
            selectedFeaturesContent
          );
          const selectedFeatures = JSON.parse(selectedFeaturesContent);
          if (!Array.isArray(selectedFeatures)) {
            throw new Error(
              "Invalid selected_features.json content: not an array"
            );
          }
          if (selectedFeatures.length !== scaler.mean.length) {
            throw new Error(
              `Feature mismatch: selectedFeatures length (${selectedFeatures.length}) does not match scaler.mean length (${scaler.mean.length})`
            );
          }
          console.log("selectedFeatures:", selectedFeatures);

          const inputData = { ...data };
          console.log("inputData before encoding:", inputData);

          inputData.Gender = labelEncoders.Gender.indexOf(data.Gender);
          if (inputData.Gender === -1)
            throw new Error(`Invalid Gender value: ${data.Gender}`);

          inputData.Chronic_Disease = labelEncoders.Chronic_Disease.indexOf(
            data.Chronic_Disease
          );
          if (inputData.Chronic_Disease === -1)
            throw new Error(
              `Invalid Chronic_Disease value: ${data.Chronic_Disease}`
            );

          inputData.Alcohol_Consumption =
            labelEncoders.Alcohol_Consumption.indexOf(data.Alcohol_Consumption);
          if (inputData.Alcohol_Consumption === -1)
            throw new Error(
              `Invalid Alcohol_Consumption value: ${data.Alcohol_Consumption}`
            );

          inputData.Smoking_Habit = labelEncoders.Smoking_Habit.indexOf(
            data.Smoking_Habit
          );
          if (inputData.Smoking_Habit === -1)
            throw new Error(
              `Invalid Smoking_Habit value: ${data.Smoking_Habit}`
            );

          inputData.Diet_Quality = labelEncoders.Diet_Quality.indexOf(
            data.Diet_Quality
          );
          if (inputData.Diet_Quality === -1)
            throw new Error(`Invalid Diet_Quality value: ${data.Diet_Quality}`);

          console.log("inputData after encoding:", inputData);

          const featureArray = selectedFeatures.map((feature) => {
            if (inputData[feature] === undefined) {
              throw new Error(`Feature ${feature} is undefined in inputData`);
            }
            return inputData[feature];
          });
          console.log("featureArray:", featureArray);

          const scaledFeatures = featureArray.map((value, index) => {
            if (
              isNaN(value) ||
              scaler.mean[index] === undefined ||
              scaler.scale[index] === undefined
            ) {
              throw new Error(
                `Invalid scaling at index ${index}: value=${value}, mean=${scaler.mean[index]}, scale=${scaler.scale[index]}`
              );
            }
            return (value - scaler.mean[index]) / scaler.scale[index];
          });
          console.log("scaledFeatures:", scaledFeatures);

          const inputTensor = new ort.Tensor(
            "float32",
            new Float32Array(scaledFeatures),
            [1, scaledFeatures.length]
          );
          console.log("inputTensor:", {
            type: inputTensor.type,
            dims: inputTensor.dims,
            data: Array.from(inputTensor.data),
          });

          // Verify .onnx files exist
          const modelPaths = [
            `${FileSystem.documentDirectory}xgb_model_output_0.onnx`,
            `${FileSystem.documentDirectory}xgb_model_output_1.onnx`,
            `${FileSystem.documentDirectory}xgb_model_output_2.onnx`,
          ];

          for (const modelPath of modelPaths) {
            const fileInfo = await FileSystem.getInfoAsync(modelPath);
            if (!fileInfo.exists) {
              throw new Error(`ONNX model file not found: ${modelPath}`);
            }
          }

          for (let i = 0; i < modelPaths.length; i++) {
            console.log(`Creating inference session for ${modelPaths[i]}`);
            const session = await ort.InferenceSession.create(modelPaths[i]);
            if (!session) {
              throw new Error(
                `Failed to create InferenceSession for ${modelPaths[i]}`
              );
            }
            const feeds = { float_input: inputTensor };
            console.log("feeds:", {
              float_input: {
                type: inputTensor.type,
                dims: inputTensor.dims,
                data: Array.from(inputTensor.data),
              },
            });
            try {
              const results = await session.run(feeds);
              console.log(
                "Inference results:",
                JSON.stringify(results, (key, value) => {
                  if (
                    value instanceof Float32Array ||
                    value instanceof Float64Array
                  ) {
                    return Array.from(value);
                  }
                  if (typeof value === "bigint") {
                    return Number(value);
                  }
                  if (
                    value instanceof Int8Array ||
                    value instanceof Uint8Array ||
                    value instanceof Int16Array ||
                    value instanceof Uint16Array ||
                    value instanceof Int32Array ||
                    value instanceof Uint32Array ||
                    value instanceof BigInt64Array ||
                    value instanceof BigUint64Array
                  ) {
                    return Array.from(value).map((v) => Number(v));
                  }
                  return value;
                })
              );

              let prediction;
              let probabilitiesData =
                results.probabilities &&
                (results.probabilities.cpuData || results.probabilities.data);
              let labelData =
                results.label && (results.label.cpuData || results.label.data);

              console.log(
                "probabilitiesData type:",
                probabilitiesData
                  ? Object.prototype.toString.call(probabilitiesData)
                  : "undefined"
              );
              console.log(
                "labelData type:",
                labelData
                  ? Object.prototype.toString.call(labelData)
                  : "undefined"
              );

              if (probabilitiesData && probabilitiesData.length === 2) {
                console.log("Using 'probabilities' output:", {
                  dims: results.probabilities.dims,
                  data: Array.from(probabilitiesData),
                });
                if (
                  results.probabilities.dims[0] !== 1 ||
                  results.probabilities.dims[1] !== 2
                ) {
                  throw new Error(
                    `Invalid probabilities shape for ${modelPaths[i]}. Expected [1, 2], got ${JSON.stringify(results.probabilities.dims)}`
                  );
                }
                prediction = probabilitiesData[1] > 0.5 ? 1 : 0;
              } else if (labelData && labelData.length === 1) {
                console.log("Using 'label' output:", {
                  dims: results.label.dims,
                  data: Array.from(labelData).map((v) => Number(v)),
                });
                if (results.label.dims[0] !== 1) {
                  throw new Error(
                    `Invalid label shape for ${modelPaths[i]}. Expected [1,], got ${JSON.stringify(results.label.dims)}`
                  );
                }
                prediction = Number(labelData[0]);
                if (
                  isNaN(prediction) ||
                  (prediction !== 0 && prediction !== 1)
                ) {
                  throw new Error(
                    `Invalid label value for ${modelPaths[i]}: ${labelData[0]}`
                  );
                }
              } else {
                const outputKeys = Object.keys(results);
                throw new Error(
                  `No valid output ('probabilities' or 'label') found for ${modelPaths[i]}. Available keys: ${JSON.stringify(outputKeys)}`
                );
              }

              predictions[
                i === 0
                  ? "Obesity_Flag"
                  : i === 1
                    ? "Hypertension_Flag"
                    : "Stroke_Flag"
              ] = prediction;
            } catch (runError) {
              throw new Error(
                `Inference failed for ${modelPaths[i]}: ${runError.message}`
              );
            }
          }
          console.log("Offline predictions completed:", predictions);
        } catch (offlineError) {
          console.error("Offline prediction failed:", offlineError);
          Alert.alert(
            "Offline Mode Failed",
            `Failed to use offline predictions: ${offlineError.message}. Please verify .onnx files, scaler.json, and input data. Switching to online mode.`,
            [{ text: "OK" }]
          );

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

          setIsOfflineMode(false);
          setOfflineFilesReady(false);
          await AsyncStorage.setItem("offlineMode", "false");
        }
      } else {
        console.log("Using online mode for predictions...");
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
        Obesity_Flag: JSON.stringify(predictions.Obesity_Flag || 0),
        Hypertension_Flag: JSON.stringify(predictions.Hypertension_Flag || 0),
        Stroke_Flag: JSON.stringify(predictions.Stroke_Flag || 0),
      };

      const lifestyleScore = calculateLifestyleScore(data);

      const db = await getDb();
      await db.runAsync(
        `INSERT INTO UserProfile (
          date, Age, Gender, Height_cm, Weight_kg, BMI, Chronic_Disease,
          Daily_Steps, Exercise_Frequency, Sleep_Hours, Alcohol_Consumption,
          Smoking_Habit, Diet_Quality, Stress_Level, FRUITS_VEGGIES, Screen_Time_Hours,
          Salt_Intake, Obesity_Flag, Hypertension_Flag, Stroke_Flag, Lifestyle_Score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          lifestyleScore,
        ]
      );

      navigation.navigate("MainApp", {
        lifestyleData: data,
        predictionData: predictions,
        lifestyleScore,
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
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

  const stepTitles = [
    t.personalInfoTitle || fallbackTranslations.personalInfoTitle,
    t.healthHabitsTitle || fallbackTranslations.healthHabitsTitle,
    t.lifestyleTitle || fallbackTranslations.lifestyleTitle,
  ];

  const genderOptions = [
    { label: t.male || fallbackTranslations.male, value: "Male" },
    { label: t.female || fallbackTranslations.female, value: "Female" },
  ];

  const chronicDiseaseOptions = [
    { label: t.none || fallbackTranslations.none, value: "None" },
    { label: t.stroke || fallbackTranslations.stroke, value: "Stroke" },
    { label: t.hypertension || fallbackTranslations.hypertension, value: "Hypertension" },
    { label: t.obesity || fallbackTranslations.obesity, value: "Obesity" },
  ];

  const dietQualityOptions = [
    { label: t.excellent || fallbackTranslations.excellent, value: "Excellent" },
    { label: t.good || fallbackTranslations.good, value: "Good" },
    { label: t.average || fallbackTranslations.average, value: "Average" },
    { label: t.poor || fallbackTranslations.poor, value: "Poor" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.title}>
          {t.lifestyleDataTitle || fallbackTranslations.lifestyleDataTitle}
        </Text>
        <Text style={styles.subtitle}>{stepTitles[currentStep - 1]}</Text>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} t={t} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>

          {currentStep === 1 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.age || fallbackTranslations.age}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "age" && styles.inputFocused,
                      errors.age && { borderColor: "#ef4444" },
                    ]}
                    placeholder={t.enterAge || fallbackTranslations.enterAge}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={formData.age}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, age: text }))
                    }
                    onFocus={() => setFocusedInput("age")}
                    onBlur={() => setFocusedInput(null)}
                    accessibilityLabel={t.age || fallbackTranslations.age}
                    accessibilityHint={t.enterAge || fallbackTranslations.enterAge}
                  />
                  {errors.age ? (
                    <Text style={styles.errorText}>{errors.age}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.gender || fallbackTranslations.gender}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.gender}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setFormData((prev) => ({ ...prev, gender: itemValue }))
                    }
                    accessibilityLabel={t.gender || fallbackTranslations.gender}
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.heightCm || fallbackTranslations.heightCm}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "heightCm" && styles.inputFocused,
                      errors.heightCm && { borderColor: "#ef4444" },
                    ]}
                    placeholder={t.enterHeight || fallbackTranslations.enterHeight}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={formData.heightCm}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, heightCm: text }));
                      calculateBMI(text, formData.weightKg);
                    }}
                    onFocus={() => setFocusedInput("heightCm")}
                    onBlur={() => setFocusedInput(null)}
                    accessibilityLabel={t.heightCm || fallbackTranslations.heightCm}
                    accessibilityHint={t.enterHeight || fallbackTranslations.enterHeight}
                  />
                  {errors.heightCm ? (
                    <Text style={styles.errorText}>{errors.heightCm}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.weightKg || fallbackTranslations.weightKg}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "weightKg" && styles.inputFocused,
                      errors.weightKg && { borderColor: "#ef4444" },
                    ]}
                    placeholder={t.enterWeight || fallbackTranslations.enterWeight}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={formData.weightKg}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, weightKg: text }));
                      calculateBMI(formData.heightCm, text);
                    }}
                    onFocus={() => setFocusedInput("weightKg")}
                    onBlur={() => setFocusedInput(null)}
                    accessibilityLabel={t.weightKg || fallbackTranslations.weightKg}
                    accessibilityHint={t.enterWeight || fallbackTranslations.enterWeight}
                  />
                  {errors.weightKg ? (
                    <Text style={styles.errorText}>{errors.weightKg}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.bmi || fallbackTranslations.bmi}</Text>
                <TextInput
                  style={[styles.input, styles.bmiContainer]}
                  value={formData.bmi}
                  editable={false}
                  placeholder={t.bmiPlaceholder || fallbackTranslations.bmiPlaceholder}
                  placeholderTextColor="#14b8a6"
                  accessibilityLabel={t.bmi || fallbackTranslations.bmi}
                />
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.chronicDisease || fallbackTranslations.chronicDisease}
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.chronicDisease}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        chronicDisease: itemValue,
                      }))
                    }
                    accessibilityLabel={t.chronicDisease || fallbackTranslations.chronicDisease}
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

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.dailySteps || fallbackTranslations.dailySteps}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={50000}
                  step={100}
                  value={formData.dailySteps}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, dailySteps: value }))
                  }
                  accessibilityLabel={t.dailySteps || fallbackTranslations.dailySteps}
                  accessibilityValue={{
                    text: `${Math.round(formData.dailySteps)} steps`,
                  }}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0</Text>
                  <Text style={styles.sliderMinMaxLabel}>50,000+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {Math.round(formData.dailySteps).toLocaleString()}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.exerciseFrequency || fallbackTranslations.exerciseFrequency}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={7}
                  step={1}
                  value={formData.exerciseFrequency}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      exerciseFrequency: value,
                    }))
                  }
                  accessibilityLabel={t.exerciseFrequency || fallbackTranslations.exerciseFrequency}
                  accessibilityValue={{
                    text: `${formData.exerciseFrequency} days per week`,
                  }}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.sedentary || fallbackTranslations.sedentary}
                  </Text>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.veryActive || fallbackTranslations.veryActive}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formData.exerciseFrequency} {t.daysPerWeek || fallbackTranslations.daysPerWeek}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.sleepHours || fallbackTranslations.sleepHours}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={3}
                  maximumValue={12}
                  step={0.5}
                  value={formData.sleepHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, sleepHours: value }))
                  }
                  accessibilityLabel={t.sleepHours || fallbackTranslations.sleepHours}
                  accessibilityValue={{ text: `${formData.sleepHours} hours` }}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>3h</Text>
                  <Text style={styles.sliderMinMaxLabel}>12h</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formData.sleepHours} {t.hours || fallbackTranslations.hours}
                </Text>
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {t.alcoholConsumption || fallbackTranslations.alcoholConsumption}
                  </Text>
                  <Switch
                    style={styles.switchToggle}
                    value={formData.alcoholConsumption}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        alcoholConsumption: value,
                      }))
                    }
                    trackColor={{ false: "#e2e8f0", true: "#14b8a6" }}
                    thumbColor={
                      formData.alcoholConsumption ? "#ffffff" : "#f4f3f4"
                    }
                    accessibilityLabel={t.alcoholConsumption || fallbackTranslations.alcoholConsumption}
                  />
                </View>
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {t.smokingHabit || fallbackTranslations.smokingHabit}
                  </Text>
                  <Switch
                    style={styles.switchToggle}
                    value={formData.smokingHabit}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, smokingHabit: value }))
                    }
                    trackColor={{ false: "#e2e8f0", true: "#14b8a6" }}
                    thumbColor={formData.smokingHabit ? "#ffffff" : "#f4f3f4"}
                    accessibilityLabel={t.smokingHabit || fallbackTranslations.smokingHabit}
                  />
                </View>
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.dietQuality?.label || fallbackTranslations.dietQuality.label}
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.dietQuality}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        dietQuality: itemValue,
                      }))
                    }
                    accessibilityLabel={t.dietQuality?.label || fallbackTranslations.dietQuality.label}
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
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.fruitsVeggies || fallbackTranslations.fruitsVeggies}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={formData.fruitsVeggies}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, fruitsVeggies: value }))
                  }
                  accessibilityLabel={t.fruitsVeggies || fallbackTranslations.fruitsVeggies}
                  accessibilityValue={{
                    text: `${formData.fruitsVeggies} servings per day`,
                  }}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0</Text>
                  <Text style={styles.sliderMinMaxLabel}>10+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formData.fruitsVeggies} {t.servingsPerDay || fallbackTranslations.servingsPerDay}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.stressLevel || fallbackTranslations.stressLevel}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={formData.stressLevel}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, stressLevel: value }))
                  }
                  accessibilityLabel={t.stressLevel || fallbackTranslations.stressLevel}
                  accessibilityValue={{
                    text: `${formData.stressLevel} out of 10`,
                  }}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.lowStress || fallbackTranslations.lowStress}
                  </Text>
                  <Text style={styles.sliderMinMaxLabel}>
                    {t.highStress || fallbackTranslations.highStress}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formData.stressLevel}/10
                </Text>
                <View style={styles.stressLevelIndicator}>
                  {getStressLevelColors(formData.stressLevel).map(
                    (color, index) => (
                      <View
                        key={index}
                        style={[styles.stressLevelColor, { backgroundColor: color }]}
                      />
                    )
                  )}
                </View>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.screenTimeHours || fallbackTranslations.screenTimeHours}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={0.5}
                  value={formData.screenTimeHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#008080"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, screenTimeHours: value }))
                  }
                  accessibilityLabel={t.screenTimeHours || fallbackTranslations.screenTimeHours}
                  accessibilityValue={{
                    text: `${formData.screenTimeHours} hours per day`,
                  }}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0 {t.hours || fallbackTranslations.hours}</Text>
                  <Text style={styles.sliderMinMaxLabel}>16 {t.hours || fallbackTranslations.hours}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formData.screenTimeHours} {t.hours || fallbackTranslations.hours}
                </Text>
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handlePrevious}
                accessibilityLabel={t.previous || fallbackTranslations.previous}
              >
                <Text style={styles.secondaryButtonText}>
                  {t.previous || fallbackTranslations.previous}
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
                accessibilityLabel={t.next || fallbackTranslations.next}
              >
                <Text style={styles.primaryButtonText}>
                  {t.next || fallbackTranslations.next}
                </Text>
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
                accessibilityLabel={
                  isSubmitting
                    ? t.submitting || fallbackTranslations.submitting
                    : t.submit || fallbackTranslations.submit
                }
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting
                    ? t.submitting || fallbackTranslations.submitting
                    : t.submit || fallbackTranslations.submit}
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