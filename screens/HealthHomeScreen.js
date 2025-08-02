import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { LanguageContext } from './LanguageContext';

const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const FONT_FAMILY = {
  regular: isIOS ? 'SF Pro Display' : 'Roboto',
  medium: isIOS ? 'SF Pro Display' : 'Roboto-Medium',
  bold: isIOS ? 'SF Pro Display' : 'Roboto-Bold',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#008080',
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#ffffff',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    fontFamily: FONT_FAMILY.medium,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  progressNumber: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#1D3557',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#457B9D',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: '#457B9D',
    marginTop: 16,
  },
  riskStatusText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#1D3557',
    marginBottom: 12,
    paddingLeft: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
    color: '#457B9D',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#1D3557',
  },
  metricSubtext: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#457B9D',
    marginTop: 4,
  },
  metricIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  riskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  riskCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskIcon: {
    marginRight: 12,
  },
  riskTextContainer: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.medium,
    color: '#1D3557',
    marginBottom: 4,
  },
  riskStatus: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: FONT_FAMILY.regular,
  },
  riskProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6F0FA',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
    color: '#1D3557',
    flex: 1,
  },
  recalculateContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  recalculateButton: {
    backgroundColor: '#326db9ff',
    borderRadius: 16,
    paddingVertical: 16,
    width: width - 32,
    alignItems: 'center',
    shadowColor: '#326db9ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  recalculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.bold,
    color: '#FFFFFF',
  },
  fullWidthCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong: {this.state.error?.message || 'Unknown error'}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const CustomProgressBar = ({ progress, color }) => {
  const animatedWidth = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.riskProgressBar}>
      <Animated.View
        style={[
          styles.progressBarFill,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const AnimatedProgressCircle = ({ percentage, size = 180, strokeWidth = 12 }) => {
  const { t = {} } = useContext(LanguageContext);
  const animatedValue = new Animated.Value(0);
  const circleRef = React.useRef();
  
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
    
    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const offset = circumference - (circumference * (percentage || 0) * v.value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset: offset,
        });
      }
    });
    
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [percentage]);

  const getScoreColor = (score) => {
    if (!score) return '#34C759';
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FFD60A';
    return '#FF3B30';
  };

  const color = getScoreColor(percentage);

  return (
    <View style={[styles.progressCircleContainer, { width: size, height: size }]}>
      <View style={[
        styles.progressCircleOuter, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderColor: '#E6F0FA',
          position: 'absolute',
        }
      ]} />
      
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          fill="none"
          ref={circleRef}
          rotation="-90"
          origin={`${halfSize}, ${halfSize}`}
        />
      </Svg>
      
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={styles.progressNumber}>{percentage || 0}</Text>
        <Text style={styles.progressSubtext}>{t.outOf100 || 'out of 100'}</Text>
      </View>
    </View>
  );
};

const HealthHomeScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [lifestyleData, setLifestyleData] = useState(null);
  const [localScore, setLocalScore] = useState(75);
  const [localRisk, setLocalRisk] = useState('Medium');
  const fadeAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(10);

  useEffect(() => {
    const data = route.params?.lifestyleData;
    console.log('Received lifestyleData:', data);
    if (data) {
      setLifestyleData(data);
      calculateLocalScore(data);
      calculateLocalRisk(data);
    }

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
    ]).start(() => {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    });
  }, [route.params]);

  const calculateLocalScore = (data) => {
    let score = 0;
    if (!data) return setLocalScore(0);

    if (data.bmi >= 18.5 && data.bmi < 25) score += 20;
    else if (data.bmi < 18.5 || data.bmi < 30) score += 15;
    else score += 10;

    if (data.daily_steps >= 8000) score += 15;
    else if (data.daily_steps >= 5000) score += 10;
    else score += 5;

    if (data.exercise_frequency >= 5) score += 15;
    else if (data.exercise_frequency >= 3) score += 10;
    else if (data.exercise_frequency >= 1) score += 5;

    if (data.sleep_hours >= 7 && data.sleep_hours <= 9) score += 15;
    else if (data.sleep_hours === 6 || data.sleep_hours === 10) score += 10;
    else score += 5;

    if (data.fruits_veggies >= 5) score += 10;
    else if (data.fruits_veggies >= 3) score += 7;
    else score += 3;

    const isHealthyHabits = data.smoking_habit === 'No' && data.alcohol_consumption === 'No';
    const hasOneBadHabit = data.smoking_habit === 'Yes' ^ data.alcohol_consumption === 'Yes';
    if (isHealthyHabits) score += 15;
    else if (hasOneBadHabit) score += 7;

    if (data.screen_time_hours < 4) score += 10;
    else if (data.screen_time_hours <= 6) score += 5;

    if (data.diet_quality === 'Excellent') score += 10;
    else if (data.diet_quality === 'Good') score += 7;
    else if (data.diet_quality === 'Average') score += 3;

    if (data.stress_level <= 3) score += 10;
    else if (data.stress_level <= 6) score += 5;

    if (data.chronic_disease === 'None') score += 10;

    setLocalScore(Math.round(score));
  };

  const calculateLocalRisk = (data) => {
    let riskFactors = 0;
    if (!data) return setLocalRisk('Unknown');

    if (data.bmi >= 30) riskFactors += 1;
    if (data.exercise_frequency < 2) riskFactors += 1;
    if (data.sleep_hours < 6 || data.sleep_hours > 10) riskFactors += 1;
    if (data.smoking_habit === 'Yes') riskFactors += 1;
    if (data.stress_level > 7) riskFactors += 1;
    if (data.chronic_disease !== 'None') riskFactors += 1;
    if (data.diet_quality === 'Poor' || data.diet_quality === 'Average') riskFactors += 1;
    if (data.fruits_veggies < 3) riskFactors += 1;
    if (data.screen_time_hours > 6) riskFactors += 1;
    if (data.alcohol_consumption === 'Yes') riskFactors += 1;

    if (riskFactors >= 4) setLocalRisk('High');
    else if (riskFactors >= 2) setLocalRisk('Medium');
    else setLocalRisk('Low');
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return t.normal || 'Not available';
    if (bmi < 18.5) return t.underweight || 'Underweight';
    if (bmi < 25) return t.normal || 'Normal';
    if (bmi < 30) return t.overweight || 'Overweight';
    return t.obese || 'Obese';
  };

  const getBMIColor = (bmi) => {
    if (!bmi) return '#34C759';
    if (bmi < 18.5) return '#FFD60A';
    if (bmi < 25) return '#34C759';
    if (bmi < 30) return '#FFD60A';
    return '#FF3B30';
  };

  const getExerciseStatus = (frequency) => {
    if (!frequency) return t.inactive || 'Not available';
    if (frequency >= 5) return t.veryActive || 'Very Active';
    if (frequency >= 3) return t.active || 'Active';
    if (frequency >= 1) return t.lightlyActive || 'Lightly Active';
    return t.inactive || 'Inactive';
  };

  const getSleepStatus = (hours) => {
    if (!hours) return t.unknown || 'Not available';
    if (hours >= 7 && hours <= 9) return t.optimal || 'Optimal';
    if (hours >= 6 && hours <= 10) return t.good || 'Good';
    return t.needsImprovement || 'Needs Improvement';
  };

  const getStressLevelText = (level) => {
    if (!level) return t.unknown || 'Not available';
    if (level <= 3) return t.lowStress || 'Low';
    if (level <= 6) return t.moderateStress || 'Moderate';
    return t.highStress || 'High';
  };

  const getStressColor = (level) => {
    if (!level) return '#34C759';
    if (level <= 3) return '#34C759';
    if (level <= 6) return '#FFD60A';
    return '#FF3B30';
  };

  const generatePersonalizedTips = () => {
    const tips = [];
    if (!lifestyleData) return [
      { text: t.eatMoreVegetables || 'Eat more vegetables', icon: 'local-dining' },
      { text: t.exercise30MinDaily || 'Exercise 30 minutes daily', icon: 'directions-run' },
      { text: t.sleep78Hours || 'Sleep 7-8 hours nightly', icon: 'bed' },
    ];

    if (lifestyleData.bmi >= 25) {
      tips.push({ text: t.maintainHealthyWeight || 'Focus on maintaining a healthy weight', icon: 'scale' });
    } else if (lifestyleData.bmi < 18.5) {
      tips.push({ text: t.gainWeightHealthy || 'Consider healthy weight gain strategies', icon: 'scale' });
    }

    if (lifestyleData.exercise_frequency < 3) {
      tips.push({ text: t.increasePhysicalActivity || 'Try to exercise 3+ days/week', icon: 'directions-run' });
    }

    if (lifestyleData.sleep_hours < 7 || lifestyleData.sleep_hours > 9) {
      tips.push({ text: t.improvesSleepQuality || 'Aim for 7-9 hours of sleep nightly', icon: 'bed' });
    }

    if (lifestyleData.fruits_veggies < 5) {
      tips.push({ text: t.eatMoreFruitsVeggies || 'Eat 5+ servings of fruits/veggies daily', icon: 'local-dining' });
    } else if (lifestyleData.diet_quality === 'Poor' || lifestyleData.diet_quality === 'Average') {
      tips.push({ text: t.improveDietQuality || 'Focus on improving your diet quality', icon: 'restaurant' });
    }

    if (lifestyleData.daily_steps < 8000) {
      tips.push({ text: t.increaseWalkingSteps || 'Walk 8000+ steps daily for better health', icon: 'directions-walk' });
    }

    if (lifestyleData.stress_level > 6) {
      tips.push({ text: t.manageStressLevels || 'Practice meditation to reduce stress', icon: 'spa' });
    }

    if (lifestyleData.screen_time_hours > 6) {
      tips.push({ text: t.reduceScreenTime || 'Limit screen time to 6 hours/day', icon: 'phone' });
    }

    if (lifestyleData.smoking_habit === 'Yes') {
      tips.push({ text: t.quitSmoking || 'Consider quitting smoking for better health', icon: 'do-not-disturb' });
    }
    if (lifestyleData.alcohol_consumption === 'Yes') {
      tips.push({ text: t.limitAlcohol || 'Limit alcohol consumption', icon: 'local-bar' });
    }

    if (lifestyleData.chronic_disease !== 'None') {
      tips.push({ 
        text: t.manageChronicCondition || `Manage your ${lifestyleData.chronic_disease} condition`, 
        icon: 'medical-services' 
      });
    }

    return tips.slice(0, 3).length > 0 ? tips.slice(0, 3) : [
      { text: t.eatMoreVegetables || 'Eat more vegetables', icon: 'local-dining' },
      { text: t.exercise30MinDaily || 'Exercise 30 minutes daily', icon: 'directions-run' },
      { text: t.sleep78Hours || 'Sleep 7-8 hours nightly', icon: 'bed' },
    ];
  };

  const renderMetricCard = (title, value, subtext, iconName, iconColor = '#457B9D') => (
    <Animated.View style={[styles.metricCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value ?? 'N/A'}</Text>
      <Text style={styles.metricSubtext}>{subtext ?? 'Not available'}</Text>
      <Icon name={iconName} size={20} color={iconColor} style={styles.metricIcon} />
    </Animated.View>
  );

  const renderFullWidthMetricCard = (title, value, subtext, iconName, iconColor = '#457B9D') => (
    <Animated.View style={[styles.fullWidthCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value ?? 'N/A'}</Text>
      <Text style={styles.metricSubtext}>{subtext ?? 'Not available'}</Text>
      <Icon name={iconName} size={20} color={iconColor} style={styles.metricIcon} />
    </Animated.View>
  );

  const renderRiskCard = ({ item }) => {
    let progress = 0;
    let color = '#E6F0FA';
    let riskStatus = localRisk || 'Unknown';

    if (localRisk === 'High') {
      progress = 0.8;
      color = '#FF3B30';
    } else if (localRisk === 'Medium') {
      progress = 0.6;
      color = '#FFD60A';
    } else {
      progress = 0.3;
      color = '#34C759';
    }

    return (
      <Animated.View style={[styles.riskCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.riskCardContent}>
          <Icon name={item.icon} size={24} color={color} style={styles.riskIcon} />
          <View style={styles.riskTextContainer}>
            <Text style={styles.riskTitle}>{item.name}</Text>
            <Text style={[styles.riskStatus, { color }]}>{riskStatus}</Text>
          </View>
        </View>
        <CustomProgressBar progress={progress} color={color} />
      </Animated.View>
    );
  };

  const renderTipCard = ({ item }) => (
    <Animated.View style={[styles.tipCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Icon name={item.icon} size={24} color="#34C759" style={styles.tipIcon} />
      <Text style={styles.tipText}>{item.text}</Text>
    </Animated.View>
  );

  const getRiskStatusColor = () => {
    if (localRisk === 'High') return '#FF3B30';
    if (localRisk === 'Medium') return '#FFD60A';
    return '#34C759';
  };

  const data = [
    { type: 'header', key: 'header' },
    { type: 'score', key: 'score' },
    { type: 'metrics', key: 'metrics' },
    { type: 'lifestyle', key: 'lifestyle' },
    { type: 'risks', key: 'risks' },
    { type: 'tips', key: 'tips' },
    { type: 'recalculate', key: 'recalculate' },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <Animated.View style={[styles.headerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.greeting}>{t.homeTitle || 'Health Dashboard'}</Text>
            <Text style={styles.appTagline}>{t.homeTagline || 'Your personalized health insights'}</Text>
          </Animated.View>
        );
      case 'score':
        return (
          <Animated.View style={[styles.scoreContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <AnimatedProgressCircle percentage={localScore} />
            <Text style={styles.progressLabel}>{t.yourLifestyleScore || 'Your Lifestyle Score'}</Text>
            <Text style={[styles.riskStatusText, { color: getRiskStatusColor() }]}>
              {localRisk || 'Unknown'} {t.risk || 'Risk'}
            </Text>
          </Animated.View>
        );
      case 'metrics':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.keyMetrics || 'Key Metrics'}</Text>
            <View style={styles.metricsGrid}>
              {renderMetricCard(
                t.bmiLabel?.replace(': ', '') || 'BMI', 
                lifestyleData?.bmi?.toFixed(1) ?? 'N/A', 
                getBMICategory(lifestyleData?.bmi) ?? 'Not available', 
                'accessibility', 
                getBMIColor(lifestyleData?.bmi)
              )}
              {renderMetricCard(
                t.steps || 'Steps', 
                formatNumber(lifestyleData?.daily_steps) ?? 'N/A', 
                t.daily || 'Daily', 
                'directions-walk', 
                '#326db9ff'
              )}
              {renderMetricCard(
                t.sleep || 'Sleep', 
                `${lifestyleData?.sleep_hours ?? 0}h`, 
                getSleepStatus(lifestyleData?.sleep_hours) ?? 'Not available', 
                'bed', 
                '#8A2BE2'
              )}
              {renderMetricCard(
                t.exercise || 'Exercise', 
                `${lifestyleData?.exercise_frequency ?? 0}/week`, 
                getExerciseStatus(lifestyleData?.exercise_frequency) ?? 'Not available', 
                'fitness-center', 
                '#FF9500'
              )}
            </View>
          </View>
        );
      case 'lifestyle':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.lifestyleFactors || 'Lifestyle Factors'}</Text>
            {renderFullWidthMetricCard(
              t.dietQuality || 'Diet Quality',
              lifestyleData?.diet_quality ?? 'Unknown',
              '',
              'restaurant',
              '#4CAF50'
            )}
            {renderFullWidthMetricCard(
              t.fruitsVeggies || 'Fruits & Vegetables',
              `${lifestyleData?.fruits_veggies ?? 0} ${t.servingsPerDay || 'servings/day'}`,
              '',
              'local-dining',
              '#8BC34A'
            )}
            {renderFullWidthMetricCard(
              t.stressLevel || 'Stress Level',
              getStressLevelText(lifestyleData?.stress_level) ?? 'Unknown',
              `${lifestyleData?.stress_level ?? 0}/10`,
              'mood',
              getStressColor(lifestyleData?.stress_level)
            )}
            {renderFullWidthMetricCard(
              t.screenTime || 'Screen Time',
              `${lifestyleData?.screen_time_hours ?? 0}h`,
              t.perDay || 'per day',
              'devices',
              '#607D8B'
            )}
          </View>
        );
      case 'risks':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.chronicDiseaseRisk || 'Health Risk Assessment'}</Text>
            <FlatList
              data={[
                { name: t.overallHealthRisk || 'Overall Health Risk', icon: 'favorite' },
                { name: t.lifestyleRisk || 'Lifestyle Risk', icon: 'trending-up' },
                { name: t.chronicDiseaseRisk || 'Chronic Disease Risk', icon: 'local-hospital' },
              ]}
              renderItem={renderRiskCard}
              keyExtractor={(item) => item.name}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>
        );
      case 'tips':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.personalizedTips || 'Personalized Tips'}</Text>
            <FlatList
              data={generatePersonalizedTips()}
              renderItem={renderTipCard}
              keyExtractor={(item, index) => `${item.text}-${index}`}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>
        );
      case 'recalculate':
        return (
          <Animated.View style={[styles.recalculateContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity
              style={styles.recalculateButton}
              onPress={() => navigation.navigate('LifestyleDataInput')}
            >
              <Text style={styles.recalculateButtonText}>{t.recalculate || 'Update Lifestyle Data'}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default HealthHomeScreen;