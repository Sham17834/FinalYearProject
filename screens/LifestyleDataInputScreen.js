
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

// Mock backend predict function
const fakePredict = (data) => {
  console.log('fakePredict called with:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      let score = 100;

      if (data.bmi < 18.5 || data.bmi > 24.9) score -= 15;
      if (data.bmi < 16 || data.bmi > 30) score -= 10;
      if (data.dailySteps < 10000) score -= Math.floor((10000 - data.dailySteps) / 1000) * 2;
      if (data.dailySteps > 20000) score += 5;
      if (data.exerciseFrequency < 3) score -= (3 - data.exerciseFrequency) * 5;
      if (data.exerciseFrequency > 5) score += 5;
      if (data.sleepDuration < 7 || data.sleepDuration > 9) score -= Math.abs(8 - data.sleepDuration) * 5;
      if (data.vegetableFruitIntake < 5) score -= (5 - data.vegetableFruitIntake) * 3;
      score -= data.stressIndex * 2;
      if (data.screenUsage > 4) score -= (data.screenUsage - 4) * 2;
      if (data.alcohol === 'Yes') score -= 10;
      if (data.smoking === 'Yes') score -= 15;
      if (data.dietaryQuality === 'Poor') score -= 15;
      else if (data.dietaryQuality === 'Average') score -= 5;
      else if (data.dietaryQuality === 'Excellent') score += 5;

      score = Math.max(0, Math.min(100, score));

      let risk = 'Low';
      if (score < 60 || data.smoking === 'Yes' || data.bmi > 30) risk = 'High';
      else if (score < 80 || data.alcohol === 'Yes') risk = 'Medium';

      console.log('fakePredict result:', { score, risk });
      resolve({ score, risk });
    }, 1000);
  });
};

const LifestyleDataInputScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (heightCm && weightKg && !isNaN(heightCm) && !isNaN(weightKg)) {
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
      if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 120) {
        Alert.alert('Error', 'Please enter a valid age (18-120)');
        return false;
      }
      if (!height || isNaN(height) || parseFloat(height) < 100 || parseFloat(height) > 250) {
        Alert.alert('Error', 'Please enter a valid height (100-250 cm)');
        return false;
      }
      if (!weight || isNaN(weight) || parseFloat(weight) < 30 || parseFloat(weight) > 300) {
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
      if (!sleepDuration || isNaN(sleepDuration) || parseFloat(sleepDuration) < 0 || parseFloat(sleepDuration) > 24) {
        Alert.alert('Error', 'Please enter valid sleep duration (0-24 hours)');
        return false;
      }
    } else if (step === 3) {
      if (!vegetableFruitIntake || isNaN(vegetableFruitIntake) || parseInt(vegetableFruitIntake) < 0 || parseInt(vegetableFruitIntake) > 20) {
        Alert.alert('Error', 'Please enter valid vegetable/fruit intake (0-20 servings)');
        return false;
      }
      if (!stressIndex || isNaN(stressIndex) || parseInt(stressIndex) < 1 || parseInt(stressIndex) > 10) {
        Alert.alert('Error', 'Please enter valid stress index (1-10)');
        return false;
      }
      if (!screenUsage || isNaN(screenUsage) || parseFloat(screenUsage) < 0 || parseFloat(screenUsage) > 24) {
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

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    
    if (!validateStep(currentStep)) {
      console.log('Validation failed for step:', currentStep);
      return;
    }

    setIsSubmitting(true);

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

    try {
      console.log('Calling fakePredict with data:', data);
      const result = await fakePredict(data);
      console.log('fakePredict result:', result);
      
      const lifestyleData = { 
        ...data, 
        score: result.score, 
        risk: result.risk 
      };
      
      console.log('Navigating with lifestyleData:', lifestyleData);
      
      navigation.navigate('MainApp', {
        screen: 'Home',
        params: { lifestyleData: lifestyleData },
      });
      
      setIsSubmitting(false);
      
    } catch (error) {
      console.error('Fake predict error:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to process lifestyle data. Please try again.');
    }
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
                  style={styles.input}
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
                disabled={isSubmitting}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#3b82f6', flex: 1 }]}
                onPress={handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.primaryButton, 
                  { 
                    backgroundColor: isSubmitting ? '#9ca3af' : '#10b981', 
                    flex: 1 
                  }
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
