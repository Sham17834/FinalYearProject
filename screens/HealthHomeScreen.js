import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import { LanguageContext } from "./LanguageContext";
import { getDb } from "./db.js";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#008080",
    width: "100%",
    paddingTop: 20,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  appTagline: {
    fontSize: 14,
    color: "#e0f2f1",
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 10,
    marginVertical: 10,
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
    fontFamily: "Roboto-Bold",
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
    fontFamily: "Roboto-Medium",
    color: "#457B9D",
    marginTop: 16,
  },
  riskStatusText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Roboto-Medium",
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Roboto-Bold",
    color: "#1D3557",
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
    fontFamily: "Roboto-Medium",
    color: "#457B9D",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Roboto-Bold",
    color: "#1D3557",
  },
  metricSubtext: {
    fontSize: 11,
    fontFamily: "Roboto",
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
    fontFamily: "Roboto-Medium",
    color: "#1D3557",
    marginBottom: 4,
  },
  riskStatus: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Roboto",
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
    fontFamily: "Roboto",
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
    fontFamily: "Roboto-Bold",
    color: "#FFFFFF",
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    paddingVertical: 16,
    width: width - 32,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 12,
  },
  downloadButtonText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Roboto-Bold",
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
        <Text style={styles.progressNumber}>{percentage ?? 0}</Text>
        <Text style={styles.progressApproved}>
          {t.outOf100 ?? "out of 100"}
        </Text>
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

        prediction = {
          Obesity_Flag: record.Obesity_Flag
            ? JSON.parse(record.Obesity_Flag)
            : null,
          Hypertension_Flag: record.Hypertension_Flag
            ? JSON.parse(record.Hypertension_Flag)
            : null,
          Stroke_Flag: record.Stroke_Flag
            ? JSON.parse(record.Stroke_Flag)
            : null,
        };
      }

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
          stroke: Number((prediction.Stroke_Flag.probability * 100).toFixed(2)),
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

  const generateHealthReportHTML = () => {
    const tips = generatePersonalizedTips();
    return `
      <html>
        <head>
          <style>
            body { font-family: Roboto, Arial, sans-serif; color: #1D3557; padding: 20px; }
            h1 { color: #008080; text-align: center; }
            h2 { color: #457B9D; }
            .section { margin-bottom: 20px; }
            .metric { margin: 10px 0; }
            .risk { margin: 10px 0; }
            .tip { margin: 10px 0; }
            .label { font-weight: bold; }
            .value { color: #326db9ff; }
          </style>
        </head>
        <body>
          <h1>${t.healthReportTitle || "Your Health Report"}</h1>
          <div class="section">
            <h2>${t.lifestyleScore || "Lifestyle Score"}</h2>
            <p class="metric"><span class="label">${t.score || "Score"}:</span> <span class="value">${localScore || 0} ${t.outOf100 || "out of 100"}</span></p>
            <p class="metric"><span class="label">${t.overallRisk || "Overall Risk"}:</span> <span class="value">${getOverallRiskLevel()}</span></p>
          </div>
          <div class="section">
            <h2>${t.keyMetrics || "Key Metrics"}</h2>
            <p class="metric">
  <span class="label">${t.bmiLabel ?? "BMI"}:</span>
  <span class="value">
    ${
      lifestyleData?.BMI != null
        ? lifestyleData.BMI.toFixed(1)
        : (t.unknown ?? "Unknown")
    }
    (${getBMICategory(lifestyleData?.BMI) ?? "Not available"})
  </span>
</p>
            <p class="metric"><span class="label">${t.steps || "Steps"}:</span> <span class="value">${formatNumber(lifestyleData?.Daily_Steps) ?? "0"} (${t.daily || "Daily"})</span></p>
            <p class="metric"><span class="label">${t.sleep || "Sleep"}:</span> <span class="value">${lifestyleData?.Sleep_Hours !== undefined ? `${lifestyleData.Sleep_Hours}${t.hrs || "h"}` : `0${t.hrs || "h"}`} (${getSleepStatus(lifestyleData?.Sleep_Hours) || "Not available"})</span></p>
            <p class="metric"><span class="label">${t.exercise || "Exercise"}:</span> <span class="value">${lifestyleData?.Exercise_Frequency !== undefined ? `${lifestyleData.Exercise_Frequency}/${t.week || "week"}` : `0/${t.week || "week"}`} (${getExerciseStatus(lifestyleData?.Exercise_Frequency) || "Not available"})</span></p>
          </div>
          <div class="section">
            <h2>${t.lifestyleFactors || "Lifestyle Factors"}</h2>
            <p class="metric"><span class="label">${t.dietQuality || "Diet Quality"}:</span> <span class="value">${lifestyleData?.Diet_Quality ? t[lifestyleData.Diet_Quality.toLowerCase()] || lifestyleData.Diet_Quality : t.unknown || "Unknown"}</span></p>
            <p class="metric"><span class="label">${t.fruitsVeggies || "Fruits & Vegetables"}:</span> <span class="value">${lifestyleData?.FRUITS_VEGGIES !== undefined ? `${lifestyleData.FRUITS_VEGGIES} ${t.servingsPerDay || "servings/day"}` : `0 ${t.servingsPerDay || "servings/day"}`}</span></p>
            <p class="metric"><span class="label">${t.stressLevel || "Stress Level"}:</span> <span class="value">${getStressLevelText(lifestyleData?.Stress_Level) || "Not available"} (${lifestyleData?.Stress_Level !== undefined ? `${lifestyleData.Stress_Level}/10` : "0/10"})</span></p>
            <p class="metric"><span class="label">${t.screenTime || "Screen Time"}:</span> <span class="value">${lifestyleData?.Screen_Time_Hours !== undefined ? `${lifestyleData.Screen_Time_Hours}${t.hrs.toLowerCase() || "h"}` : `0${t.hrs?.toLowerCase() || "h"}`} (${t.perDay || "per day"})</span></p>
          </div>
          <div class="section">
            <h2>${t.chronicDiseaseRisk || "Chronic Disease Risk"}</h2>
            <p class="risk"><span class="label">${t.obesityRisk || "Obesity Risk"}:</span> <span class="value">${diseaseRisks.obesity.toFixed(2)}% (${diseaseRisks.obesity >= 67 ? t.high || "High" : diseaseRisks.obesity >= 34 ? t.medium || "Medium" : t.low || "Low"})</span></p>
            <p class="risk"><span class="label">${t.hypertensionRisk || "Hypertension Risk"}:</span> <span class="value">${diseaseRisks.hypertension.toFixed(2)}% (${diseaseRisks.hypertension >= 67 ? t.high || "High" : diseaseRisks.hypertension >= 34 ? t.medium || "Medium" : t.low || "Low"})</span></p>
            <p class="risk"><span class="label">${t.strokeRisk || "Stroke Risk"}:</span> <span class="value">${diseaseRisks.stroke.toFixed(2)}% (${diseaseRisks.stroke >= 67 ? t.high || "High" : diseaseRisks.stroke >= 34 ? t.medium || "Medium" : t.low || "Low"})</span></p>
          </div>
          <div class="section">
            <h2>${t.personalizedTips || "Personalized Tips"}</h2>
            ${tips.map((tip) => `<p class="tip"><span class="label">-</span> ${tip.text}</p>`).join("")}
          </div>
        </body>
      </html>
    `;
  };

  const downloadHealthReport = async () => {
    if (!lifestyleData || !predictionData) {
      Alert.alert(
        t.error || "Error",
        t.noDataForReport ||
          "Please submit lifestyle data to generate a health report."
      );
      return;
    }

    try {
      const html = generateHealthReportHTML();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        fileName: `Health_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      });
      await Sharing.shareAsync(uri);
      Alert.alert(
        t.success || "Success",
        t.reportGenerated || "Health report generated and ready to share."
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert(
        t.error || "Error",
        t.reportGenerationFailed || "Failed to generate health report."
      );
    }
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

  const renderRiskCard = ({ item }, t) => {
    const riskPercentage = diseaseRisks[item.key] || 0;
    const progress = riskPercentage / 100;
    const color = getRiskColor(riskPercentage);
    const predictionStatus =
      riskPercentage >= 67
        ? t.high || "High"
        : riskPercentage >= 34
          ? t.medium || "Medium"
          : t.low || "Low";

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
          <Animated.View style={[styles.headerContainer]}>
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
                  ? `${lifestyleData.Sleep_Hours}${t.hrs || "h"}`
                  : `0${t.hrs || "h"}`,
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
              lifestyleData?.Diet_Quality
                ? t[lifestyleData.Diet_Quality.toLowerCase()] ||
                    lifestyleData.Diet_Quality
                : t.unknown || "Unknown",
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
                ? `${lifestyleData.Screen_Time_Hours}${t.hrs.toLowerCase() || "h"}`
                : `0${t.hrs?.toLowerCase() || "h"}`,
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
              renderItem={(props) => renderRiskCard(props, t)}
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
          <Animated.View style={[styles.recalculateContainer]}>
            <TouchableOpacity
              style={styles.recalculateButton}
              onPress={() => navigation.navigate("LifestyleDataInput")}
            >
              <Text style={styles.recalculateButtonText}>
                {t.recalculate || "Submit Lifestyle Data"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={downloadHealthReport}
            >
              <Text style={styles.downloadButtonText}>
                {t.downloadReport || "Download Health Report"}
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
