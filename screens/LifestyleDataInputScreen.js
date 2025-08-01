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
  const { t } = useContext(LanguageContext);
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

  const genderOptions = [
    { label: t.male, value: 'Male' },
    { label: t.female, value: 'Female' },
  ];

  const chronicDiseaseOptions = [
    { label: t.none, value: 'None' },
    { label: t.stroke, value: 'Stroke' },
    { label: t.hypertension, value: 'Hypertension' },
    { label: t.obesity, value: 'Obesity' },
  ];

  const yesNoOptions = [
    { label: t.yes, value: 'Yes' },
    { label: t.no, value: 'No' },
  ];

  const dietQualityOptions = [
    { label: t.excellent, value: 'Excellent' },
    { label: t.good, value: 'Good' },
    { label: t.average, value: 'Average' },
    { label: t.poor, value: 'Poor' },
  ];

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
        Alert.alert(t.error, t.errorAge);
        return false;
      }
      if (!heightCm || isNaN(heightCm) || parseFloat(heightCm) < 100 || parseFloat(heightCm) > 250) {
        Alert.alert(t.error, t.errorHeight);
        return false;
      }
      if (!weightKg || isNaN(weightKg) || parseFloat(weightKg) < 30 || parseFloat(weightKg) > 300) {
        Alert.alert(t.error, t.errorWeight);
        return false;
      }
    } else if (step === 2) {
      if (!dailySteps || isNaN(dailySteps) || parseInt(dailySteps) < 0 || parseInt(dailySteps) > 50000) {
        Alert.alert(t.error, t.errorDailySteps);
        return false;
      }
      if (!exerciseFrequency || isNaN(exerciseFrequency) || parseInt(exerciseFrequency) < 0 || parseInt(exerciseFrequency) > 7) {
        Alert.alert(t.error, t.errorExerciseFrequency);
        return false;
      }
      if (!sleepHours || isNaN(sleepHours) || parseFloat(sleepHours) < 0 || parseFloat(sleepHours) > 24) {
        Alert.alert(t.error, t.errorSleepHours);
        return false;
      }
    } else if (step === 3) {
      if (!fruitsVeggies || isNaN(fruitsVeggies) || parseInt(fruitsVeggies) < 0 || parseInt(fruitsVeggies) > 20) {
        Alert.alert(t.error, t.errorFruitsVeggies);
        return false;
      }
      if (!stressLevel || isNaN(stressLevel) || parseInt(stressLevel) < 1 || parseInt(stressLevel) > 10) {
        Alert.alert(t.error, t.errorStressLevel);
        return false;
      }
      if (!screenTimeHours || isNaN(screenTimeHours) || parseFloat(screenTimeHours) < 0 || parseFloat(screenTimeHours) > 24) {
        Alert.alert(t.error, t.errorScreenTime);
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
      Alert.alert(t.error, t.errorSubmission);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.appName}>{t.lifestyleDataTitle}</Text>
        <Text style={styles.appTagline}>
          {formatString(t.lifestyleDataTagline, { currentStep, totalSteps })}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {currentStep === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.age}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterAge}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.gender}</Text>
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
                <Text style={styles.inputLabel}>{t.heightCm}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterHeight}
                  keyboardType="numeric"
                  value={heightCm}
                  onChangeText={(text) => {
                    setHeightCm(text);
                    if (text && weightKg) calculateBMI(text, weightKg);
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.weightKg}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterWeight}
                  keyboardType="numeric"
                  value={weightKg}
                  onChangeText={(text) => {
                    setWeightKg(text);
                    if (heightCm && text) calculateBMI(heightCm, text);
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.bmi}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f1f5f9' }]}
                  value={bmi}
                  editable={false}
                  placeholder={t.bmiPlaceholder}
                />
              </View>
            </>
          )}
          {currentStep === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.chronicDisease}</Text>
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
                <Text style={styles.inputLabel}>{t.dailySteps}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterDailySteps}
                  keyboardType="numeric"
                  value={dailySteps}
                  onChangeText={setDailySteps}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.exerciseFrequency}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterExerciseFrequency}
                  keyboardType="numeric"
                  value={exerciseFrequency}
                  onChangeText={setExerciseFrequency}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.sleepHours}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterSleepHours}
                  keyboardType="numeric"
                  value={sleepHours}
                  onChangeText={setSleepHours}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.alcoholConsumption}</Text>
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
          {currentStep === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.smokingHabit}</Text>
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
                <Text style={styles.inputLabel}>{t.dietQuality}</Text>
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
                <Text style={styles.inputLabel}>{t.fruitsVeggies}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterFruitsVeggies}
                  keyboardType="numeric"
                  value={fruitsVeggies}
                  onChangeText={setFruitsVeggies}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.stressLevel}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterStressLevel}
                  keyboardType="numeric"
                  value={stressLevel}
                  onChangeText={setStressLevel}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.screenTimeHours}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterScreenTime}
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
                <Text style={styles.secondaryButtonText}>{t.previous}</Text>
              </TouchableOpacity>
            )}
            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>{t.next}</Text>
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
                  {isSubmitting ? t.processing : t.saveAndCalculate}
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