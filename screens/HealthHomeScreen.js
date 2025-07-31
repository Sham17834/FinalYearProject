import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';

const HealthHomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [userName] = useState('John');
  const [lifestyleScore, setLifestyleScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState('Low');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  const [healthMetrics, setHealthMetrics] = useState([
    {
      title: 'BMI',
      value: '22.4',
      unit: 'kg/m²',
      status: 'Normal',
      color: '#10b981',
      bgColor: '#f8fafc',
      materialIcon: 'scale',
      trend: '+0.2',
      trendUp: false,
    },
    {
      title: 'Steps',
      value: '8,234',
      unit: 'steps',
      status: '82% of goal',
      color: '#3b82f6',
      bgColor: '#f8fafc',
      materialIcon: 'directions-walk',
      trend: '+1,234',
      trendUp: true,
    },
    {
      title: 'Sleep',
      value: '7.2',
      unit: 'hours',
      status: 'Good quality',
      color: '#3b82f6',
      bgColor: '#f8fafc',
      materialIcon: 'bed',
      trend: '+0.5',
      trendUp: true,
    },
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'Resting',
      color: '#ef4444',
      bgColor: '#f8fafc',
      materialIcon: 'favorite',
      trend: '-2',
      trendUp: false,
    },
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    if (route.params?.lifestyleData) {
      const { bmi, dailySteps, sleepDuration, score, risk } = route.params.lifestyleData;
      setLifestyleScore(score || 85);
      setRiskLevel(risk || 'Low');
      setHealthMetrics((prev) =>
        prev.map((metric) => {
          if (metric.title === 'BMI') {
            return { ...metric, value: bmi.toString(), status: bmi < 25 ? 'Normal' : 'Overweight' };
          }
          if (metric.title === 'Steps') {
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

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const ProgressRing = ({ percentage }) => (
    <View style={styles.progressRingContainer}>
      <View style={styles.progressRingOuter}>
        <View style={[styles.progressRingInner, { 
          borderTopColor: getScoreColor(percentage),
          borderRightColor: getScoreColor(percentage),
          transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
        }]} />
        <View style={styles.progressRingContent}>
          <Text style={styles.progressNumber}>{percentage}</Text>
          <Text style={styles.progressLabel}>Score</Text>
        </View>
      </View>
    </View>
  );

  const renderMetricCard = ({ item }) => (
    <Animated.View 
      style={[styles.metricCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }]}
    >
      <View style={styles.metricCardHeader}>
        <View style={[styles.metricIcon, { backgroundColor: item.bgColor }]}>
          <Icon name={item.materialIcon} size={20} color={item.color} />
        </View>
        <View style={[styles.trendIndicator, { backgroundColor: item.trendUp ? '#ECFDF5' : '#FEF2F2' }]}>
          <Text style={[styles.trendText, { color: item.trendUp ? '#10b981' : '#ef4444' }]}>
            {item.trendUp ? '↗' : '↘'} {item.trend}
          </Text>
        </View>
      </View>
      <Text style={styles.metricTitle}>{item.title}</Text>
      <View style={styles.metricValue}>
        <Text style={styles.metricNumber}>{item.value}</Text>
        <Text style={styles.metricUnit}>{item.unit}</Text>
      </View>
      <Text style={[styles.metricStatus, { color: item.color }]}>{item.status}</Text>
    </Animated.View>
  );

  const data = [
    { type: 'header', key: 'header' },
    { type: 'score', key: 'score' },
    { type: 'metrics', key: 'metrics' },
    { type: 'risks', key: 'risks' },
    { type: 'recommendations', key: 'recommendations' },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>{getGreeting()}, {userName}!</Text>
              <Text style={styles.appTagline}>Your health at a glance</Text>
            </View>
          </View>
        );
      case 'score':
        return (
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={[styles.scoreCard, { backgroundColor: '#008080' }]}>
              <ProgressRing percentage={lifestyleScore} />
              <Text style={[styles.scoreTitle, { color: '#ffffff', textAlign: 'center' }]}>
                Wellness Score
              </Text>
              <Text style={[styles.scoreMessage, { color: '#ffffff', textAlign: 'center' }]}>
                {riskLevel === 'Low' ? "You're doing great!" : 
                 riskLevel === 'Medium' ? "Keep it up!" : 
                 "Let's improve your health!"}
              </Text>
              <View style={styles.secondaryButtonsRow}>
                <TouchableOpacity 
                  style={styles.secondaryActionButton}
                  onPress={() => navigation.navigate("HealthInsights")}
                >
                  <Text style={styles.secondaryActionText}>Insights</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryActionButton}
                  onPress={() => navigation.navigate("LifestyleDataInput")}
                >
                  <Text style={styles.secondaryActionText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        );
      case 'metrics':
        return (
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vital Metrics</Text>
              <FlatList
                data={healthMetrics}
                renderItem={renderMetricCard}
                keyExtractor={(item) => item.title}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            </View>
          </Animated.View>
        );
      case 'risks':
        return (
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Risks</Text>
              <View style={styles.suggestionsContainer}>
                {[
                  { name: 'Obesity', risk: 'Low', color: '#10b981', icon: require("../assets/obesity.png") },
                  { name: 'Hypertension', risk: 'Moderate', color: '#f59e0b', icon: require("../assets/hypertension.png") },
                  { name: 'Diabetes', risk: 'High', color: '#ef4444', icon: require("../assets/diabetes.png") },
                ].map((item, index) => (
                  <View key={index} style={styles.riskPredictionItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={item.icon} style={styles.diseaseIcon} />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={[styles.riskPredictionText, { fontWeight: '600' }]}>{item.name} Risk</Text>
                        <Text style={[styles.riskPredictionText, { color: item.color }]}>{item.risk} probability</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        );
      case 'recommendations':
        return (
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              <View style={styles.suggestionsContainer}>
                {[
                  { text: 'Increase vegetable intake to 5 servings/day', icon: 'restaurant', color: '#10b981' },
                  { text: 'Aim for 10,000 steps daily', icon: 'directions-run', color: '#3b82f6' },
                  { text: 'Reduce sodium intake', icon: 'warning', color: '#ef4444' },
                ].map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: 12, 
                      backgroundColor: '#f8fafc', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginRight: 12 
                    }}>
                      <Icon name={item.icon} size={14} color={item.color} />
                    </View>
                    <Text style={[styles.suggestionText, { flex: 1 }]}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HealthHomeScreen;