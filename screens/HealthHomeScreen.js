import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';

const HealthHomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [userName] = useState('John'); 
  const [lifestyleScore, setLifestyleScore] = useState(85); 
  const [riskLevel, setRiskLevel] = useState('Low'); 
  const [healthMetrics, setHealthMetrics] = useState([
    {
      title: 'BMI',
      value: '22.4',
      unit: 'kg/m²',
      status: 'Normal',
      color: '#10b981',
      bgColor: '#ecfdf5',
      icon: '🎯',
    },
    {
      title: 'Steps Today',
      value: '8,234',
      unit: 'steps',
      status: '82% of goal',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      icon: '👟',
    },
    {
      title: 'Sleep',
      value: '7.2',
      unit: 'hours',
      status: 'Good quality',
      color: '#6366f1',
      bgColor: '#eef2ff',
      icon: '🌙',
    },
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'Resting',
      color: '#f43f5e',
      bgColor: '#fdf2f8',
      icon: '❤️',
    },
  ]);

  useEffect(() => {
    console.log('HealthTrackHomeScreen received params:', route.params);
    if (route.params?.lifestyleData) {
      const { bmi, dailySteps, sleepDuration, score, risk } = route.params.lifestyleData;
      setLifestyleScore(score || 85);
      setRiskLevel(risk || 'Low');
      setHealthMetrics((prev) =>
        prev.map((metric) => {
          if (metric.title === 'BMI') {
            return { ...metric, value: bmi.toString(), status: bmi < 25 ? 'Normal' : 'Overweight' };
          }
          if (metric.title === 'Steps Today') {
            return { ...metric, value: dailySteps.toString(), status: `${Math.round((dailySteps / 10000) * 100)}% of goal` };
          }
          if (metric.title === 'Sleep') {
            return { ...metric, value: sleepDuration.toString(), status: sleepDuration >= 7 ? 'Good quality' : 'Needs improvement' };
          }
          return metric;
        })
      );
    }
  }, [route.params?.lifestyleData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const ProgressBar = ({ percentage }) => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressNumber}>{percentage}</Text>
      <Text style={styles.progressLabel}>out of 100</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6' }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.appName}>HealthTrack</Text>
            <Text style={styles.appTagline}>Track your lifestyle to reduce chronic disease risks</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>
                {getGreeting()}, {userName}!
              </Text>
              <Text style={styles.welcomeText}>
                Let's check on your health journey today
              </Text>
            </View>

            <View style={styles.scoreCard}>
              <Text style={styles.scoreTitle}>Your Lifestyle Score</Text>
              <ProgressBar percentage={lifestyleScore} />
              <Text style={styles.scoreMessage}>
                {riskLevel === 'Low' ? 'Great job! Keep it up.' : 
                 riskLevel === 'Medium' ? 'Good effort, but there’s room to improve.' : 
                 'Consider making lifestyle changes to reduce risk.'}
              </Text>
              <Text style={[styles.scoreMessage, { color: riskLevel === 'High' ? '#f43f5e' : riskLevel === 'Medium' ? '#f59e0b' : '#10b981' }]}>
                Risk Level: {riskLevel}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Metrics</Text>
              <FlatList
                data={healthMetrics}
                renderItem={({ item }) => (
                  <View style={styles.metricCard}>
                    <View style={[styles.metricIcon, { backgroundColor: item.bgColor }]}>
                      <Text style={styles.metricEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={styles.metricTitle}>{item.title}</Text>
                    <View style={styles.metricValue}>
                      <Text style={styles.metricNumber}>{item.value}</Text>
                      <Text style={styles.metricUnit}>{item.unit}</Text>
                    </View>
                    <Text style={[styles.metricStatus, { color: item.color }]}>
                      {item.status}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
              />
            </View>

            <View style={styles.section}>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.primaryButtonText}>View Health Tips</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Update Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HealthHomeScreen;