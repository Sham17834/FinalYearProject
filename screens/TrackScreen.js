import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { styles } from './styles';

const TrackScreen = () => {
  const [steps, setSteps] = useState('');
  const [sleep, setSleep] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = () => {
    console.log('Submitted:', { steps, sleep, heartRate, weight });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6' }]}>
        <Text style={styles.appName}>Track</Text>
        <Text style={styles.appTagline}>Log your health metrics</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Today's Metrics</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Steps</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter steps"
              keyboardType="numeric"
              value={steps}
              onChangeText={setSteps}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sleep (hours)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter sleep hours"
              keyboardType="numeric"
              value={sleep}
              onChangeText={setSleep}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Heart Rate (bpm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter heart rate"
              keyboardType="numeric"
              value={heartRate}
              onChangeText={setHeartRate}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#3b82f6' }]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>Submit Metrics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackScreen;