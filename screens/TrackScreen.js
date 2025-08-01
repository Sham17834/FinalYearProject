import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from './LanguageContext';
import { styles } from './styles';

const TrackScreen = () => {
  const { t } = useContext(LanguageContext);
  const [steps, setSteps] = useState('');
  const [sleep, setSleep] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [weight, setWeight] = useState('');
  const [vegetableServings, setVegetableServings] = useState('');
  const [fruitServings, setFruitServings] = useState('');
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const handleSubmit = () => {
    console.log('Submitted:', { 
      steps, sleep, heartRate, weight, 
      vegetableServings, fruitServings, exerciseCompleted 
    });
  };

  const handleSyncLifestyleScore = () => {
    console.log('Syncing to Lifestyle Score:', { 
      steps, sleep, heartRate, weight, 
      vegetableServings, fruitServings, exerciseCompleted 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>{t.trackHealthTitle}</Text>
          <Text style={styles.appTagline}>{t.trackTagline}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Physical Activity Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>{t.physicalActivity}</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="walk-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.steps}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={steps}
                onChangeText={setSteps}
              />
            </View>

            <View style={styles.switchContainer}>
              <Ionicons name="barbell-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <Text style={styles.switchLabel}>{t.exerciseCompleted}</Text>
              <Switch
                value={exerciseCompleted}
                onValueChange={setExerciseCompleted}
                trackColor={{ false: '#d1d5db', true: '#008080' }}
                thumbColor={exerciseCompleted ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>
        </View>

        {/* Vital Signs Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>{t.vitalSigns}</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="pulse-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.heartRateBpm}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={heartRate}
                onChangeText={setHeartRate}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="scale-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.weightKgInput}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
        </View>

        {/* Nutrition Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>{t.nutrition}</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="leaf-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.vegetableServings}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={vegetableServings}
                onChangeText={setVegetableServings}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="apple-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.fruitServings}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={fruitServings}
                onChangeText={setFruitServings}
              />
            </View>
          </View>
        </View>

        {/* Sleep Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="moon-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>{t.sleep}</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="bed-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.hoursSlept}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={sleep}
                onChangeText={setSleep}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryActionText}>{t.saveMetrics}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryActionButton, styles.secondaryActionButton]}
            onPress={handleSyncLifestyleScore}
            activeOpacity={0.7}
          >
            <Text style={[styles.primaryActionText, styles.secondaryActionText]}>
              {t.syncToLifestyle}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackScreen;