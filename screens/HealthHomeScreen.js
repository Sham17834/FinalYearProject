import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';

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
    marginHorizontal: 8,
    marginBottom: 12,
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
});

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
  const animatedValue = new Animated.Value(0);
  const circleRef = React.useRef();
  
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
    
    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const offset = circumference - (circumference * percentage * v.value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset: offset
        });
      }
    });
    
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [percentage]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FFD60A';
    return '#FF3B30';
  };

  const color = getScoreColor(percentage);

  return (
    <View style={[styles.progressCircleContainer, { width: size, height: size }]}>
      {/* Background circle */}
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
      
      {/* Animated circle */}
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
      
      {/* Score text */}
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={styles.progressNumber}>{percentage}</Text>
        <Text style={styles.progressSubtext}>out of 100</Text>
      </View>
    </View>
  );
};

const HealthHomeScreen = () => {
  const navigation = useNavigation();
  const [lifestyleScore] = useState(75);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

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
  }, []);

  const renderMetricCard = (title, value, subtext, iconName, iconColor = '#457B9D') => (
    <Animated.View style={[styles.metricCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSubtext}>{subtext}</Text>
      <Icon name={iconName} size={20} color={iconColor} style={styles.metricIcon} />
    </Animated.View>
  );

  const renderRiskCard = ({ item }) => (
    <Animated.View style={[styles.riskCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.riskCardContent}>
        <Icon name={item.icon} size={24} color={item.color} style={styles.riskIcon} />
        <View style={styles.riskTextContainer}>
          <Text style={styles.riskTitle}>{item.name}</Text>
          <Text style={[styles.riskStatus, { color: item.color }]}>{item.risk}</Text>
        </View>
      </View>
      <CustomProgressBar progress={item.progress} color={item.color} />
    </Animated.View>
  );

  const renderTipCard = ({ item }) => (
    <Animated.View style={[styles.tipCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Icon name={item.icon} size={24} color="#34C759" style={styles.tipIcon} />
      <Text style={styles.tipText}>{item.text}</Text>
    </Animated.View>
  );

  const data = [
    { type: 'header', key: 'header' },
    { type: 'score', key: 'score' },
    { type: 'metrics', key: 'metrics' },
    { type: 'risks', key: 'risks' },
    { type: 'tips', key: 'tips' },
    { type: 'recalculate', key: 'recalculate' },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <Animated.View style={[styles.headerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.greeting}>Dashboard</Text>
            <Text style={styles.appTagline}>Your health overview</Text>
          </Animated.View>
        );
      case 'score':
        return (
          <Animated.View style={[styles.scoreContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <AnimatedProgressCircle percentage={lifestyleScore} />
            <Text style={styles.progressLabel}>Your Lifestyle Score</Text>
          </Animated.View>
        );
      case 'metrics':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              {renderMetricCard('BMI', '24.2', 'Normal', 'accessibility', '#34C759')}
              {renderMetricCard('Steps', '8,542', 'Today', 'directions-walk', '#326db9ff')}
              {renderMetricCard('Sleep', '6.5h', 'Last night', 'bed', '#8A2BE2')}
              {renderMetricCard('Heart Rate', '72', 'bpm', 'favorite', '#FF3B30')}
            </View>
          </View>
        );
      case 'risks':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chronic Disease Risk</Text>
            <FlatList
              data={[
                { name: 'Obesity Risk', risk: 'Low', color: '#34C759', icon: 'scale', progress: 0.3 },
                { name: 'Hypertension Risk', risk: 'Medium', color: '#FFD60A', icon: 'bloodtype', progress: 0.6 },
                { name: 'Stroke Risk', risk: 'High', color: '#FF3B30', icon: 'monitor-heart', progress: 0.8 },
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
            <Text style={styles.sectionTitle}>Personalized Tips</Text>
            <FlatList
              data={[
                { text: 'Eat more vegetables', icon: 'local-dining' },
                { text: 'Exercise at least 30 min daily', icon: 'directions-run' },
                { text: 'Sleep 7-8 hours', icon: 'bed' },
              ]}
              renderItem={renderTipCard}
              keyExtractor={(item) => item.text}
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
              <Text style={styles.recalculateButtonText}>Recalculate</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
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
  );
};

export default HealthHomeScreen;