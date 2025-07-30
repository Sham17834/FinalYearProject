import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Picker,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const LifestyleDataInputScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [dailySteps, setDailySteps] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [alcohol, setAlcohol] = useState('No');
  const [smoking, setSmoking] = useState('No');
  const [dietaryQuality, setDietaryQuality] = useState('Good');
  const [vegetableFruitIntake, setVegetableFruitIntake] = useState('');
  const [stressIndex, setStressIndex] = useState('');
  const [screenUsage, setScreenUsage] = useState('');

  // Calculate BMI
  const calculateBMI = (heightCm, weightKg) => {
    if (heightCm && weightKg) {
      const heightM = parseFloat(heightCm) / 100;
      const bmiValue = (parseFloat(weightKg) / (heightM * heightM)).toFixed(1);
      setBmi(bmiValue);
    } else {
      setBmi('');
    }
  };

  // Validation function
  const validateStep = (step) => {
    if (step === 1) {
      if (!age || isNaN(age) || age < 18 || age > 120) {
        Alert.alert('Error', 'Please enter a valid age (18-120)');
        return false;
      }
      if (!height || isNaN(height) || height < 100 || height > 250) {
        Alert.alert('Error', 'Please enter a valid height (100-250 cm)');
        return false;
      }
      if (!weight || isNaN(weight) || weight < 30 || weight > 300) {
        Alert.alert('Error', 'Please enter a valid weight (30-300 kg)');
        return false;
      }
    } else if (step === 2) {
      if (!dailySteps || isNaN(dailySteps) || dailySteps < 0 || dailySteps > 50000) {
        Alert.alert('Error', 'Please enter valid daily steps (0-50,000)');
        return false;
      }
      if (!exerciseFrequency || isNaN(exerciseFrequency) || exerciseFrequency < 0 || exerciseFrequency > 7) {
        Alert.alert('Error', 'Please enter valid exercise frequency (0-7 days)');
        return false;
      }
      if (!sleepDuration || isNaN(sleepDuration) || sleepDuration < 0 || sleepDuration > 24) {
        Alert.alert('Error', 'Please enter valid sleep duration (0-24 hours)');
        return false;
      }
    } else if (step === 3) {
      if (!vegetableFruitIntake || isNaN(vegetableFruitIntake) || vegetableFruitIntake < 0 || vegetableFruitIntake > 20) {
        Alert.alert('Error', 'Please enter valid vegetable/fruit intake (0-20 servings)');
        return false;
      }
      if (!stressIndex || isNaN(stressIndex) || stressIndex < 1 || stressIndex > 10) {
        Alert.alert('Error', 'Please enter valid stress index (1-10)');
        return false;
      }
      if (!screenUsage || isNaN(screenUsage) || screenUsage < 0 || screenUsage > 24) {
        Alert.alert('Error', 'Please enter valid screen usage (0-24 hours)');
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

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    const data = {
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi: parseFloat(bmi),
      dailySteps: parseInt(dailySteps),
      exerciseFrequency: parseInt(exerciseFrequency),
      sleepDuration: parseFloat(sleepDuration),
      alcohol,
      smoking,
      dietaryQuality,
      vegetableFruitIntake: parseInt(vegetableFruitIntake),
      stressIndex: parseInt(stressIndex),
      screenUsage: parseFloat(screenUsage),
    };

    // Placeholder: Simulate backend call to /predict
    console.log('Submitting to /predict:', data);
    Alert.alert('Success', 'Lifestyle data submitted (placeholder). Lifestyle Score: 85, Risk: Low');
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6' }]}>
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
                  placeholder="Enter your age"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={(text) => {
                    setAge(text);
                    if (height && weight) calculateBMI(height, weight);
                  }}
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
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your height"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={(text) => {
                    setHeight(text);
                    if (text && weight) calculateBMI(text, weight);
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your weight"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={(text) => {
                    setWeight(text);
                    if (height && text) calculateBMI(height, text);
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
                  placeholder="Enter days (0-7)"
                  keyboardType="numeric"
                  value={exerciseFrequency}
                  onChangeText={setExerciseFrequency}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Average Daily Sleep Duration (hours)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter hours"
                  keyboardType="numeric"
                  value={sleepDuration}
                  onChangeText={setSleepDuration}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Alcohol Consumption</Text>
                <Picker
                  selectedValue={alcohol}
                  style={styles.picker}
                  onValueChange={(itemValue) => setAlcohol(itemValue)}
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
                <Text style={styles.inputLabel}>Smoking</Text>
                <Picker
                  selectedValue={smoking}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSmoking(itemValue)}
                >
                  <Picker.Item label="No" value="No" />
                  <Picker.Item label="Yes" value="Yes" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dietary Quality</Text>
                <Picker
                  selectedValue={dietaryQuality}
                  style={styles.picker}
                  onValueChange={(itemValue) => setDietaryQuality(itemValue)}
                >
                  <Picker.Item label="Excellent" value="Excellent" />
                  <Picker.Item label="Good" value="Good" />
                  <Picker.Item label="Average" value="Average" />
                  <Picker.Item label="Poor" value="Poor" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Daily Vegetable/Fruit Intake (servings)</Text>
                <TextInput
                  style={steps.input}
                  placeholder="Enter servings"
                  keyboardType="numeric"
                  value={vegetableFruitIntake}
                  onChangeText={setVegetableFruitIntake}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Stress Index (1-10)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter stress index"
                  keyboardType="numeric"
                  value={stressIndex}
                  onChangeText={setStressIndex}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Daily Screen Usage (hours)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter hours"
                  keyboardType="numeric"
                  value={screenUsage}
                  onChangeText={setScreenUsage}
                />
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.secondaryButton, { marginRight: 8 }]}
                onPress={handlePrevious}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#3b82f6', flex: 1 }]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#10b981', flex: 1 }]}
                onPress={handleSubmit}
              >
                <Text style={styles.primaryButtonText}>Save and Calculate</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LifestyleDataInputScreen;