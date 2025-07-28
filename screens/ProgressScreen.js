import React from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { styles } from './styles';

const ProgressScreen = () => {
  const progressData = [
    { date: '2025-07-27', steps: 8234, sleep: 7.2, heartRate: 72, bmi: 22.4 },
    { date: '2025-07-26', steps: 7500, sleep: 6.8, heartRate: 74, bmi: 22.4 },
    { date: '2025-07-25', steps: 9000, sleep: 7.5, heartRate: 71, bmi: 22.4 },
    { date: '2025-07-24', steps: 6500, sleep: 6.5, heartRate: 73, bmi: 22.4 },
  ];

  const renderProgressItem = ({ item }) => (
    <View style={styles.progressItem}>
      <Text style={styles.progressDate}>{item.date}</Text>
      <View style={styles.progressMetrics}>
        <Text style={styles.progressMetric}>Steps: {item.steps}</Text>
        <Text style={styles.progressMetric}>Sleep: {item.sleep} hrs</Text>
        <Text style={styles.progressMetric}>Heart Rate: {item.heartRate} bpm</Text>
        <Text style={styles.progressMetric}>BMI: {item.bmi}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6' }]}>
        <Text style={styles.appName}>Progress</Text>
        <Text style={styles.appTagline}>Your health journey over time</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <FlatList
            data={progressData}
            renderItem={renderProgressItem}
            keyExtractor={(item) => item.date}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProgressScreen;