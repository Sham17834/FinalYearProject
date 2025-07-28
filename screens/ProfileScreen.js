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

const ProfileScreen = () => {
  const [name, setName] = useState('John Doe');
  const [age, setAge] = useState('30');
  const [height, setHeight] = useState('175');
  const [gender, setGender] = useState('Male');

  const handleSave = () => {
    console.log('Saved:', { name, age, height, gender });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6' }]}>
        <Text style={styles.appName}>Profile</Text>
        <Text style={styles.appTagline}>Manage your personal information</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your height"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your gender"
              value={gender}
              onChangeText={setGender}
            />
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#3b82f6' }]}
            onPress={handleSave}
          >
            <Text style={styles.primaryButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;