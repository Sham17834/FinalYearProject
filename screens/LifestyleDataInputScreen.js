import React, { useState, useContext } from "react";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#008080",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 3,
    transitionProperty: "width",
    transitionDuration: "300ms",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
    paddingLeft: 4,
  },
  input: {
    height: 50,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#ffffff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  registerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#008080",
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#008080",
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  bottomText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  bottomTextLink: {
    color: "#008080",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 4,
  },
  sliderContainer: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#008080",
    textAlign: "center",
    marginTop: 8,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sliderMinMaxLabel: {
    fontSize: 12,
    color: "#666",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  stressLevelIndicator: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
    overflow: "hidden",
  },
  stressLevelColor: {
    flex: 1,
  },
});

const LifestyleDataInputScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await fetch(
        "https://finalyearproject-c5hy.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error(await response.text());

      const predictionData = await response.json();

      const fullData = {
        ...data,
        Obesity_Flag: JSON.stringify(predictionData.Obesity_Flag || {}),
        Hypertension_Flag: JSON.stringify(predictionData.Hypertension_Flag || {}),
        Stroke_Flag: JSON.stringify(predictionData.Stroke_Flag || {}),
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
        predictionData: predictionData,
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
        <Text style={styles.subtitle}>
          {formatString
            ? formatString(
                t.lifestyleDataTagline || "Step {currentStep} of {totalSteps}",
                { currentStep, totalSteps }
              )
            : `Step ${currentStep} of ${totalSteps}`}
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {currentStep === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.age || "Age"}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterAge || "Enter your age"}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
                {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.gender || "Gender"}</Text>
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t.heightCm || "Height (cm)"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterHeight || "Enter your height in cm"}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={heightCm}
                  onChangeText={(text) => {
                    setHeightCm(text);
                    if (text && weightKg) calculateBMI(text, weightKg);
                  }}
                />
                {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t.weightKg || "Weight (kg)"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterWeight || "Enter your weight in kg"}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={weightKg}
                  onChangeText={(text) => {
                    setWeightKg(text);
                    if (heightCm && text) calculateBMI(heightCm, text);
                  }}
                />
                {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.bmi || "BMI"}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: "#f1f5f9" }]}
                  value={bmi}
                  editable={false}
                  placeholder={t.bmiPlaceholder || "Calculated automatically"}
                  placeholderTextColor="#999"
                />
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
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

              <View style={styles.sliderContainer}>
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
                  maximumTrackTintColor="#e5e7eb"
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

              <View style={styles.sliderContainer}>
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
                  maximumTrackTintColor="#e5e7eb"
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

              <View style={styles.sliderContainer}>
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
                  maximumTrackTintColor="#e5e7eb"
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

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {t.alcoholConsumption || "Alcohol Consumption"}
                </Text>
                <Switch
                  value={alcoholConsumption}
                  onValueChange={setAlcoholConsumption}
                  trackColor={{ false: "#e5e7eb", true: "#008080" }}
                  thumbColor={alcoholConsumption ? "#ffffff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {t.smokingHabit || "Smoking Habit"}
                </Text>
                <Switch
                  value={smokingHabit}
                  onValueChange={setSmokingHabit}
                  trackColor={{ false: "#e5e7eb", true: "#008080" }}
                  thumbColor={smokingHabit ? "#ffffff" : "#f4f3f4"}
                />
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t.dietQuality || "Diet Quality"}
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

              <View style={styles.sliderContainer}>
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
                  maximumTrackTintColor="#e5e7eb"
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

              <View style={styles.sliderContainer}>
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
                  maximumTrackTintColor="#e5e7eb"
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
                      style={[styles.stressLevelColor, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.sliderContainer}>
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
                  maximumTrackTintColor="#e5e7eb"
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
                style={[styles.secondaryButton, { marginRight: 12 }]}
                onPress={handlePrevious}
              >
                <Text style={styles.secondaryButtonText}>
                  {t.previous || "Previous"}
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleNext}
              >
                <Text style={styles.registerButtonText}>
                  {t.next || "Next"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  styles.submitButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.registerButtonText}>
                  {isSubmitting
                    ? t.submitting || "Submitting..."
                    : t.submit || "Submit"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {currentStep === 1 && (
            <Text style={styles.bottomText}>
              {t.alreadyHaveAccount || "Already have an account?"}{" "}
              <Text
                style={styles.bottomTextLink}
                onPress={() => navigation.goBack()}
              >
                {t.signIn || "Sign In"}
              </Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LifestyleDataInputScreen;

