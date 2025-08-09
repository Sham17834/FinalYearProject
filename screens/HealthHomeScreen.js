import React, { useState, useEffect, useContext, useCallback } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import { LanguageContext } from "./LanguageContext";
import { getDb } from "./db.js";

const { width } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#008080",
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  scoreContainer: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  progressCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressCircleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Bold",
    color: "#1D3557",
  },
  progressSubtext: {
    fontSize: 13,
    color: "#457B9D",
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Medium",
    color: "#457B9D",
    marginTop: 16,
  },
  riskStatusText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Medium",
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Bold",
    color: "#1D3557",
    marginBottom: 12,
    paddingLeft: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  metricTitle: {
    fontSize: 13,
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Medium",
    color: "#457B9D",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Bold",
    color: "#1D3557",
  },
  metricSubtext: {
    fontSize: 11,
    fontFamily: isIOS ? "SF Pro Display" : "Roboto",
    color: "#457B9D",
    marginTop: 4,
  },
  metricIcon: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  riskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  riskCardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  riskIcon: {
    marginRight: 12,
  },
  riskTextContainer: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Medium",
    color: "#1D3557",
    marginBottom: 4,
  },
  riskStatus: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto",
  },
  riskProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E6F0FA",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 15,
    fontFamily: isIOS ? "SF Pro Display" : "Roboto",
    color: "#1D3557",
    flex: 1,
  },
  recalculateContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  recalculateButton: {
    backgroundColor: "#326db9ff",
    borderRadius: 16,
    paddingVertical: 16,
    width: width - 32,
    alignItems: "center",
    shadowColor: "#326db9ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  recalculateButtonText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: isIOS ? "SF Pro Display" : "Roboto-Bold",
    color: "#FFFFFF",
  },
  fullWidthCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 15,
    color: "#FF3B30",
    textAlign: "center",
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
          <Text style={styles.errorText}>
            Something went wrong: {this.state.error?.message || "Unknown error"}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const CustomProgressBar = ({ progress, color }) => {
  const animatedWidth = new Animated.Value(0);

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
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
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const AnimatedProgressCircle = ({
  percentage,
  size = 180,
  strokeWidth = 12,
}) => {
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
        const offset =
          circumference - (circumference * (percentage || 0) * v.value) / 100;
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
    if (!score) return "#34C759";
    if (score >= 80) return "#34C759";
    if (score >= 60) return "#FFD60A";
    return "#FF3B30";
  };

  const color = getScoreColor(percentage);

  return (
    <View
      style={[styles.progressCircleContainer, { width: size, height: size }]}
    >
      <View
        style={[
          styles.progressCircleOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: "#E6F0FA",
            position: "absolute",
          },
        ]}
      />
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
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={styles.progressNumber}>{percentage || 0}</Text>
        <Text style={styles.progressSubtext}>{t.outOf100 || "out of 100"}</Text>
      </View>
    </View>
  );
};

const HealthHomeScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [lifestyleData, setLifestyleData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [localScore, setLocalScore] = useState(75);
  const [diseaseRisks, setDiseaseRisks] = useState({
    obesity: 1,
    hypertension: 1,
    stroke: 1,
  });
  const fadeAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(10);

  const fetchProgressData = useCallback(async () => {
    try {
      const db = await getDb();

      // Fetch the latest record from UserProfile
      const userProfileData = await db.getAllAsync(
        "SELECT * FROM UserProfile ORDER BY id DESC LIMIT 1"
      );

      let lifestyle = null;
      let prediction = null;

      if (userProfileData.length > 0) {
        const record = userProfileData[0];
        lifestyle = {
          date: record.date,
          Daily_Steps: Number(record.Daily_Steps) || 0,
          Sleep_Hours: Number(record.Sleep_Hours) || 0,
          BMI: Number(record.BMI) || null,
          Age: Number(record.Age) || null,
          Gender: record.Gender || "Unknown",
          Height_cm: Number(record.Height_cm) || null,
          Weight_kg: Number(record.Weight_kg) || null,
          Chronic_Disease: record.Chronic_Disease || "None",
          Exercise_Frequency: Number(record.Exercise_Frequency) || 0,
          Alcohol_Consumption: record.Alcohol_Consumption || "No",
          Smoking_Habit: record.Smoking_Habit || "No",
          Diet_Quality: record.Diet_Quality || "Average",
          FRUITS_VEGGIES: Number(record.FRUITS_VEGGIES) || 0,
          Stress_Level: Number(record.Stress_Level) || 1,
          Screen_Time_Hours: Number(record.Screen_Time_Hours) || 0,
          Salt_Intake: record.Salt_Intake || "Moderate",
        };

        // Parse prediction data from JSON strings
        prediction = {
          Obesity_Flag: record.Obesity_Flag ? JSON.parse(record.Obesity_Flag) : null,
          Hypertension_Flag: record.Hypertension_Flag ? JSON.parse(record.Hypertension_Flag) : null,
          Stroke_Flag: record.Stroke_Flag ? JSON.parse(record.Stroke_Flag) : null,
        };
      }

      // Fallback to route.params if no database records
      const navLifestyleData = route.params?.lifestyleData;
      const navPredictionData = route.params?.predictionData;

      if (!lifestyle && navLifestyleData) {
        lifestyle = {
          date: new Date().toISOString(),
          Daily_Steps: Number(navLifestyleData.Daily_Steps) || 0,
          Sleep_Hours: Number(navLifestyleData.Sleep_Hours) || 0,
          BMI: Number(navLifestyleData.BMI) || null,
          Age: Number(navLifestyleData.Age) || null,
          Gender: navLifestyleData.Gender || "Unknown",
          Height_cm: Number(navLifestyleData.Height_cm) || null,
          Weight_kg: Number(navLifestyleData.Weight_kg) || null,
          Chronic_Disease: navLifestyleData.Chronic_Disease || "None",
          Exercise_Frequency: Number(navLifestyleData.Exercise_Frequency) || 0,
          Alcohol_Consumption: navLifestyleData.Alcohol_Consumption || "No",
          Smoking_Habit: navLifestyleData.Smoking_Habit || "No",
          Diet_Quality: navLifestyleData.Diet_Quality || "Average",
          FRUITS_VEGGIES: Number(navLifestyleData.FRUITS_VEGGIES) || 0,
          Stress_Level: Number(navLifestyleData.Stress_Level) || 1,
          Screen_Time_Hours: Number(navLifestyleData.Screen_Time_Hours) || 0,
          Salt_Intake: navLifestyleData.Salt_Intake || "Moderate",
        };
      }

      if (!prediction && navPredictionData) {
        prediction = navPredictionData;
      }

      console.log("Received lifestyleData:", lifestyle);
      console.log("Received predictionData:", prediction);

      if (lifestyle) {
        setLifestyleData(lifestyle);
        calculateLocalScore(lifestyle);
      }

      if (
        prediction &&
        prediction.Obesity_Flag?.probability != null &&
        prediction.Hypertension_Flag?.probability != null &&
        prediction.Stroke_Flag?.probability != null
      ) {
        setPredictionData(prediction);
        setDiseaseRisks({
          obesity: Number(
            (prediction.Obesity_Flag.probability * 100).toFixed(2)
          ),
          hypertension: Number(
            (prediction.Hypertension_Flag.probability * 100).toFixed(2)
          ),
          stroke: Number(
            (prediction.Stroke_Flag.probability * 100).toFixed(2)
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  const calculateLocalScore = (data) => {
    if (!data) return setLocalScore(0);
    let score = 0;

    if (data.BMI >= 18.5 && data.BMI < 25) score += 15;
    else if (data.BMI < 18.5 || data.BMI < 30) score += 8;
    else score += 3;

    if (data.Daily_Steps >= 10000) score += 10;
    else if (data.Daily_Steps >= 7000) score += 7;
    else if (data.Daily_Steps >= 5000) score += 4;
    else score += 1;

    if (data.Exercise_Frequency >= 5) score += 15;
    else if (data.Exercise_Frequency >= 3) score += 10;
    else if (data.Exercise_Frequency >= 1) score += 5;
    else score += 1;

    if (data.Sleep_Hours >= 7 && data.Sleep_Hours <= 9) score += 15;
    else if (data.Sleep_Hours === 6 || data.Sleep_Hours === 10) score += 10;
    else score += 5;

    if (data.FRUITS_VEGGIES >= 5) score += 10;
    else if (data.FRUITS_VEGGIES >= 3) score += 7;
    else if (data.FRUITS_VEGGIES >= 1) score += 3;
    else score += 0;

    const isNonSmoker = data.Smoking_Habit === "No";
    const isLowAlcohol = data.Alcohol_Consumption === "No";
    if (isNonSmoker && isLowAlcohol) score += 10;
    else if (isNonSmoker || isLowAlcohol) score += 5;
    else score += 0;

    if (data.Screen_Time_Hours < 2) score += 5;
    else if (data.Screen_Time_Hours <= 4) score += 3;
    else if (data.Screen_Time_Hours <= 6) score += 1;
    else score += 0;

    if (data.Diet_Quality === "Excellent") score += 10;
    else if (data.Diet_Quality === "Good") score += 7;
    else if (data.Diet_Quality === "Average") score += 4;
    else score += 1;

    if (data.Stress_Level <= 3) score += 5;
    else if (data.Stress_Level <= 6) score += 3;
    else score += 1;

    if (data.Chronic_Disease === "None") score += 5;
    else score += 0;

    const finalScore = Math.min(Math.round(score), 100);
    setLocalScore(finalScore);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return t.normal || "Not available";
    if (bmi < 18.5) return t.underweight || "Underweight";
    if (bmi < 25) return t.normal || "Normal";
    if (bmi < 30) return t.overweight || "Overweight";
    return t.obese || "Obese";
  };

  const getBMIColor = (bmi) => {
    if (!bmi) return "#34C759";
    if (bmi < 18.5) return "#FFD60A";
    if (bmi < 25) return "#34C759";
    if (bmi < 30) return "#FFD60A";
    return "#FF3B30";
  };

  const getExerciseStatus = (frequency) => {
    if (!frequency) return t.inactive || "Not available";
    if (frequency >= 5) return t.veryActive || "Very Active";
    if (frequency >= 3) return t.active || "Active";
    if (frequency >= 1) return t.lightlyActive || "Lightly Active";
    return t.inactive || "Inactive";
  };

  const getSleepStatus = (hours) => {
    if (!hours) return t.unknown || "Not available";
    if (hours >= 7 && hours <= 9) return t.optimal || "Optimal";
    if (hours >= 6 && hours <= 10) return t.good || "Good";
    return t.needsImprovement || "Needs Improvement";
  };

  const getStressLevelText = (level) => {
    if (!level) return t.unknown || "Not available";
    if (level <= 3) return t.lowStress || "Low";
    if (level <= 6) return t.moderateStress || "Moderate";
    return t.highStress || "High";
  };

  const getStressColor = (level) => {
    if (!level) return "#34C759";
    if (level <= 3) return "#34C759";
    if (level <= 6) return "#FFD60A";
    return "#FF3B30";
  };

  const getRiskColor = (riskPercentage) => {
    if (riskPercentage >= 67) return "#FF3B30";
    if (riskPercentage >= 34) return "#FFD60A";
    return "#34C759";
  };

  const getRiskProgress = (riskPercentage) => {
    return Math.max(0, Math.min(1, riskPercentage / 100));
  };

  const generatePersonalizedTips = () => {
    const tips = [];
    if (!lifestyleData)
      return [
        {
          text: t.eatMoreVegetables || "Eat more vegetables",
          icon: "local-dining",
        },
        {
          text: t.exercise30MinDaily || "Exercise 30 minutes daily",
          icon: "directions-run",
        },
        { text: t.sleep78Hours || "Sleep 7-8 hours nightly", icon: "bed" },
      ];

    if (diseaseRisks.obesity >= 50) {
      tips.push({
        text:
          t.manageWeightTips || "Maintain a calorie deficit to reduce weight",
        icon: "scale",
      });
    }

    if (diseaseRisks.hypertension >= 50) {
      tips.push({
        text:
          t.lowerSodiumTips || "Reduce sodium intake to lower blood pressure",
        icon: "water-drop",
      });
    }

    if (diseaseRisks.stroke >= 50) {
      tips.push({
        text:
          t.strokePreventionTips || "Regular exercise helps reduce stroke risk",
        icon: "favorite",
      });
    }

    if (tips.length < 3) {
      if (lifestyleData.Exercise_Frequency < 3) {
        tips.push({
          text: t.increasePhysicalActivity || "Try to exercise 3+ days/week",
          icon: "directions-run",
        });
      }

      if (lifestyleData.Sleep_Hours < 7 || lifestyleData.Sleep_Hours > 9) {
        tips.push({
          text: t.improvesSleepQuality || "Aim for 7-9 hours of sleep nightly",
          icon: "bed",
        });
      }

      if (lifestyleData.FRUITS_VEGGIES < 5) {
        tips.push({
          text:
            t.eatMoreFruitsVeggies || "Eat 5+ servings of fruits/veggies daily",
          icon: "local-dining",
        });
      }
    }

    return tips.slice(0, 3);
  };

  const renderMetricCard = (
    title,
    value,
    subtext,
    iconName,
    iconColor = "#457B9D"
  ) => (
    <Animated.View
      style={[
        styles.metricCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>
        {value ?? (t.unknown || "Unknown")}
      </Text>
      <Text style={styles.metricSubtext}>
        {subtext ?? (t.unknown || "Unknown")}
      </Text>
      <Icon
        name={iconName}
        size={20}
        color={iconColor}
        style={styles.metricIcon}
      />
    </Animated.View>
  );

  const renderFullWidthMetricCard = (
    title,
    value,
    subtext,
    iconName,
    iconColor = "#457B9D"
  ) => (
    <Animated.View
      style={[
        styles.fullWidthCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>
        {value ?? (t.unknown || "Unknown")}
      </Text>
      <Text style={styles.metricSubtext}>
        {subtext ?? (t.unknown || "Unknown")}
      </Text>
      <Icon
        name={iconName}
        size={20}
        color={iconColor}
        style={styles.metricIcon}
      />
    </Animated.View>
  );

  const renderRiskCard = ({ item }) => {
    const riskPercentage = diseaseRisks[item.key];
    const color = getRiskColor(riskPercentage);
    const progress = getRiskProgress(riskPercentage);
    const predictionStatus = predictionData?.[
      `${item.key.charAt(0).toUpperCase() + item.key.slice(1)}_Flag`
    ]?.prediction
      ? t.highRisk || "High Risk"
      : t.lowRisk || "Low Risk";

    return (
      <Animated.View
        style={[
          styles.riskCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.riskCardContent}>
          <Icon
            name={item.icon}
            size={24}
            color={color}
            style={styles.riskIcon}
          />
          <View style={styles.riskTextContainer}>
            <Text style={styles.riskTitle}>{item.name}</Text>
            <Text style={[styles.riskStatus, { color }]}>
              {riskPercentage.toFixed(2)}% {t.risk || "Risk"} (
              {predictionStatus})
            </Text>
          </View>
        </View>
        <CustomProgressBar progress={progress} color={color} />
      </Animated.View>
    );
  };

  const renderTipCard = ({ item }) => (
    <Animated.View
      style={[
        styles.tipCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Icon name={item.icon} size={24} color="#34C759" style={styles.tipIcon} />
      <Text style={styles.tipText}>{item.text}</Text>
    </Animated.View>
  );

  const getOverallRiskLevel = () => {
    const maxRisk = Math.max(...Object.values(diseaseRisks));
    if (maxRisk >= 67) return t.high || "High";
    if (maxRisk >= 34) return t.medium || "Medium";
    return t.low || "Low";
  };

  const getOverallRiskColor = () => {
    const maxRisk = Math.max(...Object.values(diseaseRisks));
    return getRiskColor(maxRisk);
  };

  const data = [
    { type: "header", key: "header" },
    { type: "score", key: "score" },
    { type: "metrics", key: "metrics" },
    { type: "lifestyle", key: "lifestyle" },
    { type: "risks", key: "risks" },
    { type: "tips", key: "tips" },
    { type: "recalculate", key: "recalculate" },
  ];

  const renderItem = ({ item }) => {
    if (!predictionData && item.type !== "recalculate") {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t.noData ||
              "Please submit your lifestyle data to view your health risk predictions."}
          </Text>
          <TouchableOpacity
            style={styles.recalculateButton}
            onPress={() => navigation.navigate("LifestyleDataInput")}
          >
            <Text style={styles.recalculateButtonText}>
              {t.recalculate || "Submit Lifestyle Data"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (item.type) {
      case "header":
        return (
          <Animated.View
            style={[
              styles.headerContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.greeting}>
              {t.homeTitle || "Health Dashboard"}
            </Text>
            <Text style={styles.appTagline}>
              {t.homeTagline || "Your personalized health insights"}
            </Text>
          </Animated.View>
        );
      case "score":
        return (
          <Animated.View
            style={[
              styles.scoreContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <AnimatedProgressCircle percentage={localScore} />
            <Text style={styles.progressLabel}>
              {t.yourLifestyleScore || "Your Lifestyle Score"}
            </Text>
            <Text
              style={[styles.riskStatusText, { color: getOverallRiskColor() }]}
            >
              {getOverallRiskLevel()} {t.overallHealthRisk || "Overall Risk"}
            </Text>
          </Animated.View>
        );
      case "metrics":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.keyMetrics || "Key Metrics"}
            </Text>
            <View style={styles.metricsGrid}>
              {renderMetricCard(
                t.bmiLabel?.replace(": ", "") || "BMI",
                lifestyleData?.BMI?.toFixed(1) ?? t.unknown,
                getBMICategory(lifestyleData?.BMI) ?? t.unknown,
                "accessibility",
                getBMIColor(lifestyleData?.BMI)
              )}
              {renderMetricCard(
                t.steps || "Steps",
                formatNumber(lifestyleData?.Daily_Steps) ?? "0",
                t.daily || "Daily",
                "directions-walk",
                "#326db9ff"
              )}
              {renderMetricCard(
                t.sleep || "Sleep",
                lifestyleData?.Sleep_Hours !== undefined
                  ? `${lifestyleData.Sleep_Hours}h`
                  : `0${t.hours?.toLowerCase() || "h"}`,
                getSleepStatus(lifestyleData?.Sleep_Hours) ?? t.unknown,
                "bed",
                "#8A2BE2"
              )}
              {renderMetricCard(
                t.exercise || "Exercise",
                lifestyleData?.Exercise_Frequency !== undefined
                  ? `${lifestyleData.Exercise_Frequency}/${t.week || "week"}`
                  : `0/${t.week || "week"}`,
                getExerciseStatus(lifestyleData?.Exercise_Frequency) ??
                  t.unknown,
                "fitness-center",
                "#FF9500"
              )}
            </View>
          </View>
        );
      case "lifestyle":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.lifestyleFactors || "Lifestyle Factors"}
            </Text>
            {renderFullWidthMetricCard(
              t.dietQuality || "Diet Quality",
              lifestyleData?.Diet_Quality ?? t.unknown,
              "",
              "restaurant",
              "#4CAF50"
            )}
            {renderFullWidthMetricCard(
              t.fruitsVeggies || "Fruits & Vegetables",
              lifestyleData?.FRUITS_VEGGIES !== undefined
                ? `${lifestyleData.FRUITS_VEGGIES} ${
                    t.servingsPerDay || "servings/day"
                  }`
                : `0 ${t.servingsPerDay || "servings/day"}`,
              "",
              "local-dining",
              "#8BC34A"
            )}
            {renderFullWidthMetricCard(
              t.stressLevel || "Stress Level",
              getStressLevelText(lifestyleData?.Stress_Level) ?? t.unknown,
              lifestyleData?.Stress_Level !== undefined
                ? `${lifestyleData.Stress_Level}/10`
                : `0/10`,
              "mood",
              getStressColor(lifestyleData?.Stress_Level)
            )}
            {renderFullWidthMetricCard(
              t.screenTime || "Screen Time",
              lifestyleData?.Screen_Time_Hours !== undefined
                ? `${lifestyleData.Screen_Time_Hours}h`
                : `0${t.hours?.toLowerCase() || "h"}`,
              t.perDay || "per day",
              "devices",
              "#607D8B"
            )}
          </View>
        );
      case "risks":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.chronicDiseaseRisk || "Chronic Disease Risk"}
            </Text>
            <FlatList
              data={[
                {
                  key: "obesity",
                  name: t.obesityRisk || "Obesity Risk",
                  icon: "monitor-weight",
                },
                {
                  key: "hypertension",
                  name: t.hypertensionRisk || "Hypertension Risk",
                  icon: "favorite",
                },
                {
                  key: "stroke",
                  name: t.strokeRisk || "Stroke Risk",
                  icon: "local-hospital",
                },
              ]}
              renderItem={renderRiskCard}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>
        );
      case "tips":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.personalizedTips || "Personalized Tips"}
            </Text>
            <FlatList
              data={generatePersonalizedTips()}
              renderItem={renderTipCard}
              keyExtractor={(item, index) => `${item.text}-${index}`}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </View>
        );
      case "recalculate":
        return (
          <Animated.View
            style={[
              styles.recalculateContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.recalculateButton}
              onPress={() => navigation.navigate("LifestyleDataInput")}
            >
              <Text style={styles.recalculateButtonText}>
                {t.recalculate || "Submit Lifestyle Data"}
              </Text>
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