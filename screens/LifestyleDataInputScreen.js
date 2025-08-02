import React, { useState, useContext } from 'react';
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
import { LanguageContext } from './LanguageContext';
import { formatString } from './translations';

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

const LifestyleDataInputScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  // Form state variables
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

  // Dropdown options
  const genderOptions = [
    { label: t.male || 'Male', value: 'Male' },
    { label: t.female || 'Female', value: 'Female' },
  ];

  const chronicDiseaseOptions = [
    { label: t.none || 'None', value: 'None' },
    { label: t.stroke || 'Stroke', value: 'Stroke' },
    { label: t.hypertension || 'Hypertension', value: 'Hypertension' },
    { label: t.obesity || 'Obesity', value: 'Obesity' },
  ];

  const yesNoOptions = [
    { label: t.yes || 'Yes', value: 'Yes' },
    { label: t.no || 'No', value: 'No' },
  ];

  const dietQualityOptions = [
    { label: t.excellent || 'Excellent', value: 'Excellent' },
    { label: t.good || 'Good', value: 'Good' },
    { label: t.average || 'Average', value: 'Average' },
    { label: t.poor || 'Poor', value: 'Poor' },
  ];

  // BMI calculation function
  const calculateBMI = (height, weight) => {
    if (height && weight && !isNaN(height) && !isNaN(weight)) {
      const heightM = parseFloat(height) / 100;
      const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
      setBmi(bmiValue);
    } else {
      setBmi('');
    }
  };

  // Validation function
  const validateStep = (step) => {
    if (step === 1) {
      if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 120) {
        Alert.alert(t.error || 'Error', t.errorAge || 'Please enter a valid age (18 - 120)');
        return false;
      }
      if (!heightCm || isNaN(heightCm) || parseFloat(heightCm) < 100 || parseFloat(heightCm) > 250) {
        Alert.alert(t.error || 'Error', t.errorHeight || 'Please enter a valid height (100 - 250 cm)');
        return false;
      }
      if (!weightKg || isNaN(weightKg) || parseFloat(weightKg) < 30 || parseFloat(weightKg) > 300) {
        Alert.alert(t.error || 'Error', t.errorWeight || 'Please enter a valid weight (30 - 300 kg)');
        return false;
      }
    } else if (step === 2) {
      if (!dailySteps || isNaN(dailySteps) || parseInt(dailySteps) < 0 || parseInt(dailySteps) > 50000) {
        Alert.alert(t.error || 'Error', t.errorDailySteps || 'Please enter valid daily steps (0 - 50000)');
        return false;
      }
      if (!exerciseFrequency || isNaN(exerciseFrequency) || parseInt(exerciseFrequency) < 0 || parseInt(exerciseFrequency) > 7) {
        Alert.alert(t.error || 'Error', t.errorExerciseFrequency || 'Please enter valid exercise frequency (0 - 7 days)');
        return false;
      }
      if (!sleepHours || isNaN(sleepHours) || parseFloat(sleepHours) < 0 || parseFloat(sleepHours) > 24) {
        Alert.alert(t.error || 'Error', t.errorSleepHours || 'Please enter valid sleep hours (0 - 24)');
        return false;
      }
    } else if (step === 3) {
      if (!fruitsVeggies || isNaN(fruitsVeggies) || parseInt(fruitsVeggies) < 0 || parseInt(fruitsVeggies) > 20) {
        Alert.alert(t.error || 'Error', t.errorFruitsVeggies || 'Please enter valid servings (0 - 20)');
        return false;
      }
      if (!stressLevel || isNaN(stressLevel) || parseInt(stressLevel) < 1 || parseInt(stressLevel) > 10) {
        Alert.alert(t.error || 'Error', t.errorStressLevel || 'Please enter valid stress level (1 - 10)');
        return false;
      }
      if (!screenTimeHours || isNaN(screenTimeHours) || parseFloat(screenTimeHours) < 0 || parseFloat(screenTimeHours) > 24) {
        Alert.alert(t.error || 'Error', t.errorScreenTime || 'Please enter valid screen time (0 - 24 hours)');
        return false;
      }
    }
    return true;
  };

  // Navigation functions
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

  // Submit function
  const handleSubmit = () => {
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

    console.log('Submitting form data:', data);
    navigation.navigate('MainApp', {
      screen: 'Home',
      params: { lifestyleData: data },
    });
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.appName}>{t.lifestyleDataTitle || 'Lifestyle Assessment'}</Text>
        <Text style={styles.appTagline}>
          {formatString
            ? formatString(t.lifestyleDataTagline || 'Step {currentStep} of {totalSteps}', { currentStep, totalSteps })
            : `Step ${currentStep} of ${totalSteps}`
          }
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.age || 'Age'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterAge || 'Enter your age'}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.gender || 'Gender'}</Text>
                <Picker
                  selectedValue={gender}
                  style={styles.picker}
                  onValueChange={(itemValue) => setGender(itemValue)}
                >
                  {genderOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.heightCm || 'Height (cm)'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterHeight || 'Enter your height in cm'}
                  keyboardType="numeric"
                  value={heightCm}
                  onChangeText={(text) => {
                    setHeightCm(text);
                    if (text && weightKg) calculateBMI(text, weightKg);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.weightKg || 'Weight (kg)'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterWeight || 'Enter your weight in kg'}
                  keyboardType="numeric"
                  value={weightKg}
                  onChangeText={(text) => {
                    setWeightKg(text);
                    if (heightCm && text) calculateBMI(heightCm, text);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.bmi || 'BMI'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f1f5f9' }]}
                  value={bmi}
                  editable={false}
                  placeholder={t.bmiPlaceholder || 'Calculated automatically'}
                />
              </View>
            </>
          )}

          {/* Step 2: Activity and Health */}
          {currentStep === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.chronicDisease || 'Chronic Disease'}</Text>
                <Picker
                  selectedValue={chronicDisease}
                  style={styles.picker}
                  onValueChange={(itemValue) => setChronicDisease(itemValue)}
                >
                  {chronicDiseaseOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.dailySteps || 'Daily Steps'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterDailySteps || 'Enter your daily steps'}
                  keyboardType="numeric"
                  value={dailySteps}
                  onChangeText={setDailySteps}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.exerciseFrequency || 'Exercise Frequency (days/week)'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterExerciseFrequency || 'Enter exercise days per week'}
                  keyboardType="numeric"
                  value={exerciseFrequency}
                  onChangeText={setExerciseFrequency}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.sleepHours || 'Sleep Hours'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterSleepHours || 'Enter hours of sleep per night'}
                  keyboardType="numeric"
                  value={sleepHours}
                  onChangeText={setSleepHours}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.alcoholConsumption || 'Alcohol Consumption'}</Text>
                <Picker
                  selectedValue={alcoholConsumption}
                  style={styles.picker}
                  onValueChange={(itemValue) => setAlcoholConsumption(itemValue)}
                >
                  {yesNoOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Step 3: Lifestyle Factors */}
          {currentStep === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.smokingHabit || 'Smoking Habit'}</Text>
                <Picker
                  selectedValue={smokingHabit}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSmokingHabit(itemValue)}
                >
                  {yesNoOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.dietQuality || 'Diet Quality'}</Text>
                <Picker
                  selectedValue={dietQuality}
                  style={styles.picker}
                  onValueChange={(itemValue) => setDietQuality(itemValue)}
                >
                  {dietQualityOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.fruitsVeggies || 'Fruits & Vegetables (servings/day)'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterFruitsVeggies || 'Enter servings per day'}
                  keyboardType="numeric"
                  value={fruitsVeggies}
                  onChangeText={setFruitsVeggies}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.stressLevel || 'Stress Level (1-10)'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterStressLevel || 'Enter stress level (1=low, 10=high)'}
                  keyboardType="numeric"
                  value={stressLevel}
                  onChangeText={setStressLevel}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.screenTimeHours || 'Screen Time (hours/day)'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterScreenTime || 'Enter daily screen time in hours'}
                  keyboardType="numeric"
                  value={screenTimeHours}
                  onChangeText={setScreenTimeHours}
                />
              </View>
            </>
          )}

          {/* Navigation buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.secondaryButton, { marginRight: 8 }]}
                onPress={handlePrevious}
                disabled={isSubmitting}
              >
                <Text style={styles.secondaryButtonText}>{t.previous || 'Previous'}</Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>{t.next || 'Next'}</Text>
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
                  {isSubmitting ? (t.processing || 'Processing...') : (t.saveAndCalculate || 'Save Data')}
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