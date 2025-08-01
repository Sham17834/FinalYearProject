import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', 
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#008080', 
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', 
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
    transitionProperty: 'width',
    transitionDuration: '300ms',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    fontWeight: '500',
    paddingLeft: 4,
  },
  input: {
    height: 50,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008080',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#6b7280',
    fontSize: 14,
  }
});

const fakePredict = (data) => {
  console.log('fakePredict called with:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      let score = 100;

      if (data.bmi < 18.5 || data.bmi > 24.9) score -= 15;
      if (data.bmi < 16 || data.bmi > 30) score -= 10;
      if (data.daily_steps < 10000) score -= Math.floor((10000 - data.daily_steps) / 1000) * 2;
      if (data.daily_steps > 20000) score += 5;
      if (data.exercise_frequency < 3) score -= (3 - data.exercise_frequency) * 5;
      if (data.exercise_frequency > 5) score += 5;
      if (data.sleep_hours < 7 || data.sleep_hours > 9) score -= Math.abs(8 - data.sleep_hours) * 5;
      if (data.fruits_veggies < 5) score -= (5 - data.fruits_veggies) * 3;
      score -= data.stress_level * 2;
      if (data.screen_time_hours > 4) score -= (data.screen_time_hours - 4) * 2;
      if (data.alcohol_consumption === 'Yes') score -= 10;
      if (data.smoking_habit === 'Yes') score -= 15;
      if (data.diet_quality === 'Poor') score -= 15;
      else if (data.diet_quality === 'Average') score -= 5;
      else if (data.diet_quality === 'Excellent') score += 5;
      if (data.chronic_disease !== 'None') score -= 10;

      score = Math.max(0, Math.min(100, score));

      let risk = 'Low';
      if (score < 60 || data.smoking_habit === 'Yes' || data.bmi > 30 || data.chronic_disease !== 'None') risk = 'High';
      else if (score < 80 || data.alcohol_consumption === 'Yes') risk = 'Medium';

      resolve({ score, risk });
    }, 1000);
  });
};

const LifestyleDataInputScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bmi, setBmi] = useState('');
  const [chronicDisease, setChronicDisease] = useState('None');
  const [dailySteps, setDailySteps] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState('No');
  const [smokingHabit, setSmokingHabit] = useState('No');
  const [dietQuality, setDietQuality] = useState('Good');
  const [fruitsVeggies, setFruitsVeggies] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [screenTimeHours, setScreenTimeHours] = useState('');

  const calculateBMI = (height, weight) => {
    if (height && weight && !isNaN(height) && !isNaN(weight)) {
      const heightM = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
      setBmi(bmiValue);
    } else {
      setBmi('');
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 120) {
        Alert.alert('Error', 'Please enter a valid age (18-120)');
        return false;
      }
      if (!heightCm || isNaN(heightCm) || parseFloat(heightCm) < 100 || parseFloat(heightCm) > 250) {
        Alert.alert('Error', 'Please enter a valid height (100-250 cm)');
        return false;
      }
      if (!weightKg || isNaN(weightKg) || parseFloat(weightKg) < 30 || parseFloat(weightKg) > 300) {
        Alert.alert('Error', 'Please enter a valid weight (30-300 kg)');
        return false;
      }
    } else if (step === 2) {
      if (!dailySteps || isNaN(dailySteps) || parseInt(dailySteps) < 0 || parseInt(dailySteps) > 50000) {
        Alert.alert('Error', 'Please enter valid daily steps (0-50,000)');
        return false;
      }
      if (!exerciseFrequency || isNaN(exerciseFrequency) || parseInt(exerciseFrequency) < 0 || parseInt(exerciseFrequency) > 7) {
        Alert.alert('Error', 'Please enter valid exercise frequency (0-7 days)');
        return false;
      }
      if (!sleepHours || isNaN(sleepHours) || parseFloat(sleepHours) < 0 || parseFloat(sleepHours) > 24) {
        Alert.alert('Error', 'Please enter valid sleep hours (0-24)');
        return false;
      }
    } else if (step === 3) {
      if (!fruitsVeggies || isNaN(fruitsVeggies) || parseInt(fruitsVeggies) < 0 || parseInt(fruitsVeggies) > 20) {
        Alert.alert('Error', 'Please enter valid fruit/vegetable intake (0-20 servings)');
        return false;
      }
      if (!stressLevel || isNaN(stressLevel) || parseInt(stressLevel) < 1 || parseInt(stressLevel) > 10) {
        Alert.alert('Error', 'Please enter valid stress level (1-10)');
        return false;
      }
      if (!screenTimeHours || isNaN(screenTimeHours) || parseFloat(screenTimeHours) < 0 || parseFloat(screenTimeHours) > 24) {
        Alert.alert('Error', 'Please enter valid screen time (0-24 hours)');
        return false;
      }
    }
    return true;
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
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    const data = {
      age: parseInt(age),
      gender,
      height_cm: parseFloat(heightCm),
      weight_kg: parseFloat(weightKg),
      bmi: parseFloat(bmi),
      chronic_disease: chronicDisease,
      daily_steps: parseInt(dailySteps),
      exercise_frequency: parseInt(exerciseFrequency),
      sleep_hours: parseFloat(sleepHours),
      alcohol_consumption: alcoholConsumption,
      smoking_habit: smokingHabit,
      diet_quality: dietQuality,
      fruits_veggies: parseInt(fruitsVeggies),
      stress_level: parseInt(stressLevel),
      screen_time_hours: parseFloat(screenTimeHours),
    };

    try {
      const result = await fakePredict(data);
      const lifestyleData = { ...data, score: result.score, risk: result.risk };
      
      navigation.navigate('MainApp', {
        screen: 'Home',
        params: { lifestyleData: lifestyleData },
      });
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Prediction error:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to process data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.appName}>Lifestyle Data</Text>
        <Text style={styles.appTagline}>Step {currentStep} of {totalSteps}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {currentStep === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age (years)"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <Picker
                  selectedValue={gender}
                  style={styles.picker}
                  onValueChange={(itemValue) => setGender(itemValue)}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your height in centimeters"
                  keyboardType="numeric"
                  value={heightCm}
                  onChangeText={(text) => {
                    setHeightCm(text);
                    if (text && weightKg) calculateBMI(text, weightKg);
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your weight in kilograms"
                  keyboardType="numeric"
                  value={weightKg}
                  onChangeText={(text) => {
                    setWeightKg(text);
                    if (heightCm && text) calculateBMI(heightCm, text);
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>BMI (auto-calculated)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f1f5f9' }]}
                  value={bmi}
                  editable={false}
                  placeholder="BMI will be calculated"
                />
              </View>
            </>
          )}
          {currentStep === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Chronic Disease</Text>
                <Picker
                  selectedValue={chronicDisease}
                  style={styles.picker}
                  onValueChange={(itemValue) => setChronicDisease(itemValue)}
                >
                  <Picker.Item label="None" value="None" />
                  <Picker.Item label="Stroke" value="Stroke" />
                  <Picker.Item label="Hypertension" value="Hypertension" />
                  <Picker.Item label="Obesity" value="Obesity" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Average Daily Steps</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter average daily steps"
                  keyboardType="numeric"
                  value={dailySteps}
                  onChangeText={setDailySteps}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weekly Exercise Frequency (days)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter days per week (0-7)"
                  keyboardType="numeric"
                  value={exerciseFrequency}
                  onChangeText={setExerciseFrequency}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Average Daily Sleep Hours</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter hours of sleep per day"
                  keyboardType="numeric"
                  value={sleepHours}
                  onChangeText={setSleepHours}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Alcohol Consumption</Text>
                <Picker
                  selectedValue={alcoholConsumption}
                  style={styles.picker}
                  onValueChange={(itemValue) => setAlcoholConsumption(itemValue)}
                >
                  <Picker.Item label="No" value="No" />
                  <Picker.Item label="Yes" value="Yes" />
                </Picker>
              </View>
            </>
          )}
          {currentStep === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Smoking Habit</Text>
                <Picker
                  selectedValue={smokingHabit}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSmokingHabit(itemValue)}
                >
                  <Picker.Item label="No" value="No" />
                  <Picker.Item label="Yes" value="Yes" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Diet Quality</Text>
                <Picker
                  selectedValue={dietQuality}
                  style={styles.picker}
                  onValueChange={(itemValue) => setDietQuality(itemValue)}
                >
                  <Picker.Item label="Excellent" value="Excellent" />
                  <Picker.Item label="Good" value="Good" />
                  <Picker.Item label="Average" value="Average" />
                  <Picker.Item label="Poor" value="Poor" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Daily Fruit/Vegetable Consumption (servings)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of servings per day"
                  keyboardType="numeric"
                  value={fruitsVeggies}
                  onChangeText={setFruitsVeggies}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Stress Level (1-10)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter stress level (1-10)"
                  keyboardType="numeric"
                  value={stressLevel}
                  onChangeText={setStressLevel}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Daily Screen Time (hours)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter hours of screen time per day"
                  keyboardType="numeric"
                  value={screenTimeHours}
                  onChangeText={setScreenTimeHours}
                />
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.secondaryButton, { marginRight: 8 }]}
                onPress={handlePrevious}
                disabled={isSubmitting}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  styles.submitButton,
                  isSubmitting && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Processing...' : 'Save and Calculate'}
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
    