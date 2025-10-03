import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import { formatString } from "./translations";
import { getDb } from "./db";
import debounce from "lodash.debounce";

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
    paddingTop: 40,
    backgroundColor: "#008080",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
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
    minHeight: 600,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 20,
    textAlign: "center",
    minHeight: 32,
  },
  inputGroup: {
    marginBottom: 24,
    minHeight: 80,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 12,
    fontWeight: "600",
    minHeight: 22,
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
  sliderGroup: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    minHeight: 140,
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
    minHeight: 44,
    minWidth: 180,
    alignSelf: "center",
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    minHeight: 16,
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
    minHeight: 80,
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
    minHeight: 60,
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
    minHeight: 56,
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
    minWidth: 120,
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
    minHeight: 16,
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
  const progressBarWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressBarWidth }]} />
      </View>
      <Text style={styles.progressText}>
        {formatString
          ? formatString(
              t.lifestyleDataTagline ||
                fallbackTranslations.lifestyleDataTagline,
              { currentStep, totalSteps }
            )
          : (
              t.lifestyleDataTagline ||
              fallbackTranslations.lifestyleDataTagline
            )
              .replace("{currentStep}", currentStep)
              .replace("{totalSteps}", totalSteps)}
      </Text>
    </View>
  );
});

const LifestyleDataInputScreen = () => {
  const context = useContext(LanguageContext);
  const t = context && context.t ? context.t : fallbackTranslations;

  useEffect(() => {
    if (!context || !context.t) {
      console.warn(
        "LanguageContext is not properly set up. Using fallback translations."
      );
    }
  }, [context]);

  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const formattedValues = useMemo(
    () => ({
      dailySteps: Math.round(formData.dailySteps).toLocaleString(),
      exerciseFrequency: `${formData.exerciseFrequency} ${t.daysPerWeek || fallbackTranslations.daysPerWeek}`,
      sleepHours: `${formData.sleepHours} ${t.hours || fallbackTranslations.hours}`,
      fruitsVeggies: `${formData.fruitsVeggies} ${t.servingsPerDay || fallbackTranslations.servingsPerDay}`,
      stressLevel: `${formData.stressLevel}/10`,
      screenTimeHours: `${formData.screenTimeHours} ${t.hours || fallbackTranslations.hours}`,
    }),
    [
      formData.dailySteps,
      formData.exerciseFrequency,
      formData.sleepHours,
      formData.fruitsVeggies,
      formData.stressLevel,
      formData.screenTimeHours,
      t,
    ]
  );

  const debouncedSetDailySteps = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, dailySteps: value }));
    }, 16),
    []
  );

  const debouncedSetExerciseFrequency = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, exerciseFrequency: value }));
    }, 16),
    []
  );

  const debouncedSetSleepHours = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, sleepHours: value }));
    }, 16),
    []
  );

  const debouncedSetFruitsVeggies = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, fruitsVeggies: value }));
    }, 16),
    []
  );

  const debouncedSetStressLevel = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, stressLevel: value }));
    }, 16),
    []
  );

  const debouncedSetScreenTimeHours = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, screenTimeHours: value }));
    }, 16),
    []
  );

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
      console.log("Making prediction request to online API...");
      const response = await fetch(
        "https://finalyearproject-c5hy.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get predictions");
      }
      
      const predictions = await response.json();
      console.log("Predictions received:", predictions);

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
        screen: "Home",
        params: {
          lifestyleData: data,
          predictionData: predictions,
          lifestyleScore,
        },
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Alert.alert(
        "Error", 
        error.message || "Failed to submit data. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStressLevelColors = useMemo(() => {
    return (level) => {
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
  }, []);

  const stepTitles = useMemo(
    () => [
      t.personalInfoTitle || fallbackTranslations.personalInfoTitle,
      t.healthHabitsTitle || fallbackTranslations.healthHabitsTitle,
      t.lifestyleTitle || fallbackTranslations.lifestyleTitle,
    ],
    [t]
  );

  const genderOptions = useMemo(
    () => [
      { label: t.male || fallbackTranslations.male, value: "Male" },
      { label: t.female || fallbackTranslations.female, value: "Female" },
    ],
    [t]
  );

  const chronicDiseaseOptions = useMemo(
    () => [
      { label: t.none || fallbackTranslations.none, value: "None" },
      { label: t.stroke || fallbackTranslations.stroke, value: "Stroke" },
      {
        label: t.hypertension || fallbackTranslations.hypertension,
        value: "Hypertension",
      },
      { label: t.obesity || fallbackTranslations.obesity, value: "Obesity" },
    ],
    [t]
  );

  const dietQualityOptions = useMemo(
    () => [
      {
        label: t.excellent || fallbackTranslations.excellent,
        value: "Excellent",
      },
      { label: t.good || fallbackTranslations.good, value: "Good" },
      { label: t.average || fallbackTranslations.average, value: "Average" },
      { label: t.poor || fallbackTranslations.poor, value: "Poor" },
    ],
    [t]
  );

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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>

          {currentStep === 1 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.age || fallbackTranslations.age}
                </Text>
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
                  />
                  {errors.age ? (
                    <Text style={styles.errorText}>{errors.age}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.gender || fallbackTranslations.gender}
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.gender}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setFormData((prev) => ({ ...prev, gender: itemValue }))
                    }
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
                    placeholder={
                      t.enterHeight || fallbackTranslations.enterHeight
                    }
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={formData.heightCm}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, heightCm: text }));
                      calculateBMI(text, formData.weightKg);
                    }}
                    onFocus={() => setFocusedInput("heightCm")}
                    onBlur={() => setFocusedInput(null)}
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
                    placeholder={
                      t.enterWeight || fallbackTranslations.enterWeight
                    }
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={formData.weightKg}
                    onChangeText={(text) => {
                      setFormData((prev) => ({ ...prev, weightKg: text }));
                      calculateBMI(formData.heightCm, text);
                    }}
                    onFocus={() => setFocusedInput("weightKg")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {errors.weightKg ? (
                    <Text style={styles.errorText}>{errors.weightKg}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.bmi || fallbackTranslations.bmi}
                </Text>
                <TextInput
                  style={[styles.input, styles.bmiContainer]}
                  value={formData.bmi}
                  editable={false}
                  placeholder={
                    t.bmiPlaceholder || fallbackTranslations.bmiPlaceholder
                  }
                  placeholderTextColor="#14b8a6"
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
                  onValueChange={debouncedSetDailySteps}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0</Text>
                  <Text style={styles.sliderMinMaxLabel}>50,000+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formattedValues.dailySteps}
                </Text>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.inputLabel}>
                  {t.exerciseFrequency ||
                    fallbackTranslations.exerciseFrequency}
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
                  onValueChange={debouncedSetExerciseFrequency}
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
                  {formattedValues.exerciseFrequency}
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
                  onValueChange={debouncedSetSleepHours}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>3h</Text>
                  <Text style={styles.sliderMinMaxLabel}>12h</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formattedValues.sleepHours}
                </Text>
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {t.alcoholConsumption ||
                      fallbackTranslations.alcoholConsumption}
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
                  />
                </View>
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.dietQuality?.label ||
                    fallbackTranslations.dietQuality.label}
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
                  onValueChange={debouncedSetFruitsVeggies}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>0</Text>
                  <Text style={styles.sliderMinMaxLabel}>10+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formattedValues.fruitsVeggies}
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
                  onValueChange={debouncedSetStressLevel}
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
                  {formattedValues.stressLevel}
                </Text>
                <View style={styles.stressLevelIndicator}>
                  {getStressLevelColors(formData.stressLevel).map(
                    (color, index) => (
                      <View
                        key={index}
                        style={[
                          styles.stressLevelColor,
                          { backgroundColor: color },
                        ]}
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
                  onValueChange={debouncedSetScreenTimeHours}
                />
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderMinMaxLabel}>
                    0 {t.hours || fallbackTranslations.hours}
                  </Text>
                  <Text style={styles.sliderMinMaxLabel}>
                    16 {t.hours || fallbackTranslations.hours}
                  </Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formattedValues.screenTimeHours}
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
                  {t.previous || fallbackTranslations.previous}
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
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