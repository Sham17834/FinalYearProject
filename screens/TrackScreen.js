import React, { useState } from 'react';
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
import { styles } from './styles';

const TrackScreen = () => {
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
          <Text style={styles.appName}>Track Your Health</Text>
          <Text style={styles.appTagline}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 
          Card-based section grouping for related metrics
        */}
        
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>Physical Activity</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="walk-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Steps"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={steps}
                onChangeText={setSteps}
              />
            </View>

            <View style={styles.switchContainer}>
              <Ionicons name="barbell-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <Text style={styles.switchLabel}>Exercise Completed</Text>
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

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>Vital Signs</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="pulse-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Heart Rate (bpm)"
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
                placeholder="Weight (kg)"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>Nutrition</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="leaf-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Vegetable Servings"
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
                placeholder="Fruit Servings"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={fruitServings}
                onChangeText={setFruitServings}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="moon-outline" size={20} color="#008080" />
            <Text style={styles.sectionTitle}>Sleep</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Ionicons name="bed-outline" size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Hours Slept"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={sleep}
                onChangeText={setSleep}
              />
            </View>
          </View>
        </View>

        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryActionText}>Save Metrics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryActionButton, styles.secondaryActionButton]}
            onPress={handleSyncLifestyleScore}
            activeOpacity={0.7}
          >
            <Text style={[styles.primaryActionText, styles.secondaryActionText]}>
              Sync to Lifestyle Score
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackScreen;