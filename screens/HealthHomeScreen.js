import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import { LanguageContext } from "./LanguageContext";
import { getDb } from "./db.js";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

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
    paddingTop: 30,
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
    marginBottom: 4,
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
    fontSize: 16,
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
            {this.state.error?.message ||
              this.props.t?.unknown ||
              "Unknown error"}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const calculateLifestyleScore = (lifestyleData) => {
  if (!lifestyleData) return 0;

  let totalScore = 0;
  const maxScore = 100;

  const bmiScore = (() => {
    const bmi = lifestyleData.BMI;
    if (!bmi) return 0;
    if (bmi >= 18.5 && bmi < 25) return 15;
    if (bmi >= 17 && bmi < 18.5) return 12;
    if (bmi >= 25 && bmi < 27) return 12;
    if (bmi >= 16 && bmi < 17) return 8;
    if (bmi >= 27 && bmi < 30) return 8;
    if (bmi >= 15 && bmi < 16) return 4;
    if (bmi >= 30 && bmi < 35) return 4;
    return 0;
  })();

  const stepsScore = (() => {
    const steps = lifestyleData.Daily_Steps || 0;
    if (steps >= 10000) return 15;
    if (steps >= 8000) return 12;
    if (steps >= 6000) return 9;
    if (steps >= 4000) return 6;
    if (steps >= 2000) return 3;
    return 0;
  })();

  const sleepScore = (() => {
    const hours = lifestyleData.Sleep_Hours || 0;
    if (hours >= 7 && hours <= 9) return 15;
    if (hours >= 6 && hours < 7) return 12;
    if (hours > 9 && hours <= 10) return 12;
    if (hours >= 5 && hours < 6) return 8;
    if (hours > 10 && hours <= 11) return 8;
    if (hours >= 4 && hours < 5) return 4;
    if (hours > 11) return 4;
    return 0;
  })();

  const exerciseScore = (() => {
    const frequency = lifestyleData.Exercise_Frequency || 0;
    if (frequency >= 5) return 15;
    if (frequency >= 3) return 12;
    if (frequency >= 2) return 8;
    if (frequency >= 1) return 4;
    return 0;
  })();

  const dietScore = (() => {
    const quality = lifestyleData.Diet_Quality?.toLowerCase() || "poor";
    switch (quality) {
      case "excellent":
        return 10;
      case "good":
        return 8;
      case "fair":
        return 6;
      case "poor":
        return 2;
      default:
        return 0;
    }
  })();

  const fruitsVeggiesScore = (() => {
    const servings = lifestyleData.FRUITS_VEGGIES || 0;
    if (servings >= 5) return 10;
    if (servings >= 4) return 8;
    if (servings >= 3) return 6;
    if (servings >= 2) return 4;
    if (servings >= 1) return 2;
    return 0;
  })();

  const stressScore = (() => {
    const stress = lifestyleData.Stress_Level || 5;
    if (stress <= 2) return 10;
    if (stress <= 4) return 8;
    if (stress <= 6) return 6;
    if (stress <= 8) return 3;
    return 0;
  })();

  const screenTimeScore = (() => {
    const hours = lifestyleData.Screen_Time_Hours || 0;
    if (hours <= 2) return 5;
    if (hours <= 4) return 4;
    if (hours <= 6) return 3;
    if (hours <= 8) return 2;
    if (hours <= 10) return 1;
    return 0;
  })();

  const smokingPenalty = (() => {
    const smoking = lifestyleData.Smoking_Habit?.toLowerCase() || "no";
    if (smoking === "yes" || smoking === "daily" || smoking === "heavy")
      return -10;
    if (smoking === "occasionally" || smoking === "social") return -5;
    return 0;
  })();

  const alcoholPenalty = (() => {
    const alcohol = lifestyleData.Alcohol_Consumption?.toLowerCase() || "no";
    if (alcohol === "heavy" || alcohol === "daily") return -5;
    if (alcohol === "frequently") return -2;
    return 0;
  })();

  totalScore =
    bmiScore +
    stepsScore +
    sleepScore +
    exerciseScore +
    dietScore +
    fruitsVeggiesScore +
    stressScore +
    screenTimeScore +
    smokingPenalty +
    alcoholPenalty;

  return Math.max(0, Math.min(100, totalScore));
};

const CustomProgressBar = ({ progress, color }) => {
  return (
    <View style={styles.riskProgressBar}>
      <View
        style={[
          styles.progressBarFill,
          {
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
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
  const circleRef = React.useRef();
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const getScoreColor = (score) => {
    if (!score) return "#34C759";
    if (score >= 80) return "#34C759";
    if (score >= 60) return "#FFD60A";
    return "#FF3B30";
  };

  const color = getScoreColor(percentage);
  const offset = circumference - (circumference * (percentage || 0)) / 100;

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
          strokeDashoffset={offset}
          fill="none"
          ref={circleRef}
          rotation="-90"
          origin={`${halfSize}, ${halfSize}`}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={styles.progressNumber}>{percentage ?? 0}</Text>
        <Text style={styles.progressSubtext}>{t.outOf100 ?? "out of 100"}</Text>
      </View>
    </View>
  );
};

const HealthHomeScreen = () => {
  const { t, language } = useContext(LanguageContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [lifestyleData, setLifestyleData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [lifestyleScore, setLifestyleScore] = useState(null);
  const [diseaseRisks, setDiseaseRisks] = useState({
    obesity: 0,
    hypertension: 0,
    stroke: 0,
  });

  const getRiskColor = (risk) => {
    if (risk >= 67) return "#FF3B30";
    if (risk >= 34) return "#FFD60A";
    return "#34C759";
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return t.unknown || "Unknown";
    if (bmi < 18.5) return t.underweight || "Underweight";
    if (bmi < 25) return t.normal || "Normal";
    if (bmi < 30) return t.overweight || "Overweight";
    return t.obese || "Obese";
  };

  const getBMIColor = (bmi) => {
    if (!bmi) return "#457B9D";
    if (bmi < 18.5) return "#FFD60A";
    if (bmi < 25) return "#34C759";
    if (bmi < 30) return "#FFD60A";
    return "#FF3B30";
  };

  const getSleepStatus = (hours) => {
    if (!hours) return t.unknown || "Unknown";
    if (hours < 6) return t.poor || "Poor";
    if (hours <= 8) return t.good || "Good";
    return t.excessive || "Excessive";
  };

  const getExerciseStatus = (frequency) => {
    if (!frequency) return t.unknown || "Unknown";
    if (frequency === 0) return t.sedentary || "Sedentary";
    if (frequency <= 3) return t.moderate || "Moderate";
    return t.active || "Active";
  };

  const getStressLevelText = (level) => {
    if (!level) return t.unknown || "Unknown";
    if (level <= 3) return t.lowStress || "Low";
    if (level <= 7) return t.moderateStress || "Moderate";
    return t.highStress || "High";
  };

  const getStressColor = (level) => {
    if (!level) return "#457B9D";
    if (level <= 3) return "#34C759";
    if (level <= 7) return "#FFD60A";
    return "#FF3B30";
  };

  const getDietQualityText = (dietQuality) => {
    if (!dietQuality) return t.dietQuality?.unknown || "Unknown";
    switch (dietQuality.toLowerCase()) {
      case "excellent":
        return t.dietQuality?.excellent || "Excellent";
      case "good":
        return t.dietQuality?.good || "Good";
      case "fair":
        return t.dietQuality?.fair || "Fair";
      case "poor":
        return t.dietQuality?.poor || "Poor";
      default:
        return t.dietQuality?.unknown || "Unknown";
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || "0";
  };

  const generatePersonalizedTips = () => {
    const tips = [];
    if (!lifestyleData) return tips;

    if (lifestyleData.BMI >= 30) {
      tips.push({
        text:
          t.manageWeightTips || "Maintain a calorie deficit to reduce weight.",
        icon: "monitor-weight",
      });
    } else if (lifestyleData.BMI < 18.5) {
      tips.push({
        text:
          t.maintainHealthyWeight || "Focus on maintaining a healthy weight.",
        icon: "monitor-weight",
      });
    }

    if (lifestyleData.Daily_Steps < 5000) {
      tips.push({
        text:
          t.increaseWalkingSteps || "Walk 8000+ steps daily for better health.",
        icon: "directions-walk",
      });
    }

    if (lifestyleData.Sleep_Hours < 6) {
      tips.push({
        text: t.improvesSleepQuality || "Aim for 7-9 hours of sleep nightly.",
        icon: "bed",
      });
    }

    if (lifestyleData.Exercise_Frequency < 3) {
      tips.push({
        text: t.increasePhysicalActivity || "Try to exercise 3+ days/week.",
        icon: "fitness-center",
      });
    }

    if (lifestyleData.Stress_Level > 7) {
      tips.push({
        text: t.manageStressLevels || "Practice meditation to reduce stress.",
        icon: "mood",
      });
    }

    if (lifestyleData.FRUITS_VEGGIES < 5) {
      tips.push({
        text:
          t.eatMoreFruitsVeggies || "Eat 5+ servings of fruits/veggies daily.",
        icon: "local-dining",
      });
    }

    if (lifestyleData.Screen_Time_Hours > 6) {
      tips.push({
        text: t.reduceScreenTime || "Limit screen time to 6 hours/day.",
        icon: "devices",
      });
    }

    if (lifestyleData.Smoking_Habit === "Yes") {
      tips.push({
        text: t.quitSmoking || "Consider quitting smoking for better health.",
        icon: "smoking-rooms",
      });
    }

    if (lifestyleData.Alcohol_Consumption === "Yes") {
      tips.push({
        text: t.limitAlcohol || "Limit alcohol consumption.",
        icon: "local-drink",
      });
    }

    return tips;
  };

  const downloadHealthReport = async () => {
    if (!lifestyleData || !predictionData) {
      Alert.alert(
        t.error || "Error",
        t.noData || "Please submit your lifestyle data to generate a report."
      );
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const scoreColor =
      lifestyleScore >= 80
        ? "#34C759"
        : lifestyleScore >= 60
          ? "#FFD60A"
          : "#FF3B30";
    const scoreStatus =
      lifestyleScore >= 80
        ? t.pdfExcellent || "EXCELLENT"
        : lifestyleScore >= 60
          ? t.pdfGood || "GOOD"
          : t.needsImprovement || "NEEDS IMPROVEMENT";

    const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Arial', 'Helvetica', sans-serif;
            background: #ffffff;
            padding: 0;
            margin: 0;
            line-height: 1.4;
            color: #333333;
            font-size: 12px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #dddddd;
          }
          
          /* Hospital Header */
          .hospital-header {
            background: #005eb8;
            color: white;
            padding: 30px 40px;
            border-bottom: 4px solid #003087;
          }
          
          .hospital-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
          }
          
          .hospital-tagline {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 20px;
          }
          
          .report-title {
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .patient-info-section {
            background: #f8f9fa;
            padding: 25px 40px;
            border-bottom: 2px solid #dee2e6;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          
          .info-item {
            margin-bottom: 8px;
          }
          
          .info-label {
            font-weight: bold;
            color: #005eb8;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          
          .info-value {
            font-size: 13px;
            color: #333;
          }
          
          /* Summary Section */
          .summary-section {
            padding: 30px 40px;
            background: white;
            border-bottom: 1px solid #dee2e6;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #005eb8;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid #005eb8;
            text-transform: uppercase;
          }
          
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 25px;
          }
          
          .summary-card {
            border: 1px solid #dee2e6;
            padding: 20px;
            background: #f8f9fa;
          }
          
          .summary-card-title {
            font-size: 12px;
            font-weight: bold;
            color: #005eb8;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          
          .score-display {
            text-align: center;
            padding: 25px;
            background: white;
            border: 2px solid ${scoreColor};
            margin: 20px 0;
          }
          
          .score-number {
            font-size: 48px;
            font-weight: bold;
            color: ${scoreColor};
            margin-bottom: 5px;
          }
          
          .score-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .score-status {
            font-size: 16px;
            font-weight: bold;
            color: ${scoreColor};
            text-transform: uppercase;
          }
          
          /* Clinical Metrics */
          .clinical-section {
            padding: 30px 40px;
            background: white;
            border-bottom: 1px solid #dee2e6;
          }
          
          .metrics-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          
          .metrics-table th {
            background: #005eb8;
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            border: 1px solid #005eb8;
          }
          
          .metrics-table td {
            padding: 12px 15px;
            border: 1px solid #dee2e6;
            font-size: 12px;
          }
          
          .metrics-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          
          .metric-value {
            font-weight: bold;
            color: #005eb8;
          }
          
          .metric-status {
            font-size: 11px;
            color: #666;
          }
          
          /* Risk Assessment */
          .risk-section {
            padding: 30px 40px;
            background: white;
            border-bottom: 1px solid #dee2e6;
          }
          
          .risk-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          
          .risk-table th {
            background: #005eb8;
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
          }
          
          .risk-table td {
            padding: 15px;
            border: 1px solid #dee2e6;
            vertical-align: top;
          }
          
          .risk-name {
            font-weight: bold;
            color: #333;
          }
          
          .risk-percentage {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
          }
          
          .risk-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            margin: 8px 0;
            overflow: hidden;
          }
          
          .risk-bar-fill {
            height: 100%;
            border-radius: 4px;
          }
          
          .risk-category {
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
          }
          
          /* Recommendations */
          .recommendations-section {
            padding: 30px 40px;
            background: #f0f7ff;
          }
          
          .recommendation-item {
            margin-bottom: 15px;
            padding-left: 20px;
            position: relative;
          }
          
          .recommendation-item:before {
            content: "•";
            color: #005eb8;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          .rec-priority {
            display: inline-block;
            padding: 2px 8px;
            background: #005eb8;
            color: white;
            border-radius: 3px;
            font-size: 10px;
            margin-right: 8px;
            text-transform: uppercase;
          }
          
          /* Footer */
          .report-footer {
            padding: 25px 40px;
            background: #f8f9fa;
            border-top: 2px solid #dee2e6;
            font-size: 10px;
            color: #666;
          }
          
          .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
          }
          
          .disclaimer {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            margin-top: 15px;
            font-size: 10px;
          }
          
          .disclaimer-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 5px;
          }
          
          .signature-area {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
          }
          
          .signature-line {
            width: 300px;
            border-bottom: 1px solid #333;
            margin: 0 auto 5px;
            padding-top: 40px;
          }
          
          .signature-label {
            font-size: 11px;
            color: #666;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .alert-high {
            background: #f8d7da !important;
            color: #721c24 !important;
          }
          
          .alert-medium {
            background: #fff3cd !important;
            color: #856404 !important;
          }
          
          .alert-low {
            background: #d1edff !important;
            color: #004085 !important;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Hospital Header -->
          <div class="hospital-header">
            <div class="hospital-name">${t.pdfHospitalName || "HEALTH TRACK MEDICAL CENTER"}</div>
            <div class="hospital-tagline">${t.pdfHospitalTagline || "Comprehensive Health Assessment & Risk Analysis"}</div>
            <div class="report-title">${t.pdfReportTitle || "Lifestyle Health Assessment Report"}</div>
          </div>
          
          <!-- Patient Information -->
          <div class="patient-info-section">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">${t.pdfReportDate || "Report Date"}</div>
                <div class="info-value">${currentDate}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t.pdfReportID || "Report ID"}</div>
                <div class="info-value">HT-MC-${Date.now().toString().slice(-8)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t.pdfPatientID || "Patient ID"}</div>
                <div class="info-value">${t.pdfSelfAssessment || "Self-Assessment"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t.pdfAssessmentType || "Assessment Type"}</div>
                <div class="info-value">${t.pdfComprehensiveAnalysis || "Comprehensive Lifestyle Analysis"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t.pdfPhysician || "Physician"}</div>
                <div class="info-value">${t.pdfAutomatedSystem || "Automated Health System"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t.pdfDepartment || "Department"}</div>
                <div class="info-value">${t.pdfPreventiveMedicine || "Preventive Medicine"}</div>
              </div>
            </div>
          </div>
          
          <!-- Executive Summary -->
          <div class="summary-section">
            <div class="section-title">${t.pdfExecutiveSummary || "Executive Summary"}</div>
            
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-card-title">${t.pdfOverallHealthScore || "Overall Health Score"}</div>
                <div class="score-display">
                  <div class="score-number">${lifestyleScore ?? 0}</div>
                  <div class="score-label">${t.outOf100 || "out of 100"}</div>
                  <div class="score-status">${scoreStatus}</div>
                </div>
              </div>
              
              <div class="summary-card">
                <div class="summary-card-title">${t.pdfRiskAssessmentSummary || "Risk Assessment Summary"}</div>
                <div style="padding: 15px;">
                  <div style="margin-bottom: 10px;">
                    <strong>${t.pdfOverallRiskLevel || "Overall Risk Level"}:</strong> 
                    <span style="color: ${getOverallRiskColor()}">${getOverallRiskLevel().toUpperCase()}</span>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>${t.obesityRisk || "Obesity Risk"}:</strong> 
                    <span style="color: ${getRiskColor(diseaseRisks.obesity)}">${diseaseRisks.obesity.toFixed(1)}%</span>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>${t.hypertensionRisk || "Hypertension Risk"}:</strong> 
                    <span style="color: ${getRiskColor(diseaseRisks.hypertension)}">${diseaseRisks.hypertension.toFixed(1)}%</span>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>${t.strokeRisk || "Stroke Risk"}:</strong> 
                    <span style="color: ${getRiskColor(diseaseRisks.stroke)}">${diseaseRisks.stroke.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Clinical Metrics -->
          <div class="clinical-section">
            <div class="section-title">${t.pdfClinicalMetrics || "Clinical Metrics & Vital Signs"}</div>
            
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>${t.pdfParameter || "Parameter"}</th>
                  <th>${t.pdfValue || "Value"}</th>
                  <th>${t.pdfStatus || "Status"}</th>
                  <th>${t.pdfReferenceRange || "Reference Range"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${t.pdfBodyMassIndex || "Body Mass Index (BMI)"}</strong></td>
                  <td class="metric-value">${lifestyleData?.BMI?.toFixed(1) ?? (t.pdfNoData || "N/A")}</td>
                  <td>${getBMICategory(lifestyleData?.BMI)}</td>
                  <td>18.5 - 24.9 kg/m²</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfPhysicalActivity || "Physical Activity (Steps)"}</strong></td>
                  <td class="metric-value">${formatNumber(lifestyleData?.Daily_Steps) ?? "0"}</td>
                  <td>${lifestyleData?.Daily_Steps >= 10000 ? t.pdfExcellent || "Excellent" : lifestyleData?.Daily_Steps >= 8000 ? t.pdfGood || "Good" : lifestyleData?.Daily_Steps >= 6000 ? t.pdfFair || "Fair" : t.pdfPoor || "Poor"}</td>
                  <td>> 8,000 ${t.steps || "steps"}/${t.day || "day"}</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfSleepDuration || "Sleep Duration"}</strong></td>
                  <td class="metric-value">${lifestyleData?.Sleep_Hours ?? 0} ${t.hours || "hours"}</td>
                  <td>${getSleepStatus(lifestyleData?.Sleep_Hours)}</td>
                  <td>7-9 ${t.pdfHoursPerNight || "hours/night"}</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfExerciseFrequency || "Exercise Frequency"}</strong></td>
                  <td class="metric-value">${lifestyleData?.Exercise_Frequency ?? 0} ${t.pdfDaysPerWeek || "days/week"}</td>
                  <td>${getExerciseStatus(lifestyleData?.Exercise_Frequency)}</td>
                  <td>3-5 ${t.pdfDaysPerWeek || "days/week"}</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfDietQuality || "Diet Quality"}</strong></td>
                  <td class="metric-value">${getDietQualityText(lifestyleData?.Diet_Quality)}</td>
                  <td>${lifestyleData?.Diet_Quality === "excellent" ? t.pdfOptimal || "Optimal" : lifestyleData?.Diet_Quality === "good" ? t.pdfGood || "Good" : lifestyleData?.Diet_Quality === "fair" ? t.pdfFair || "Fair" : t.needsImprovement || "Needs Improvement"}</td>
                  <td>${t.pdfGood || "Good"} - ${t.pdfExcellent || "Excellent"}</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfFruitVegetableIntake || "Fruit & Vegetable Intake"}</strong></td>
                  <td class="metric-value">${lifestyleData?.FRUITS_VEGGIES ?? 0} ${t.pdfServingsPerDay || "servings/day"}</td>
                  <td>${lifestyleData?.FRUITS_VEGGIES >= 5 ? t.pdfExcellent || "Excellent" : lifestyleData?.FRUITS_VEGGIES >= 3 ? t.pdfGood || "Good" : t.pdfInsufficient || "Insufficient"}</td>
                  <td>≥ 5 ${t.pdfServingsPerDay || "servings/day"}</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfStressLevel || "Stress Level"}</strong></td>
                  <td class="metric-value">${lifestyleData?.Stress_Level ?? 0}${t.pdfOutOf10 || "/10"}</td>
                  <td>${getStressLevelText(lifestyleData?.Stress_Level)}</td>
                  <td>1-3 (${t.low || "Low"})</td>
                </tr>
                <tr>
                  <td><strong>${t.pdfScreenTime || "Screen Time"}</strong></td>
                  <td class="metric-value">${lifestyleData?.Screen_Time_Hours ?? 0} ${t.pdfHoursPerDay || "hours/day"}</td>
                  <td>${lifestyleData?.Screen_Time_Hours <= 4 ? t.pdfGood || "Good" : lifestyleData?.Screen_Time_Hours <= 6 ? t.medium || "Moderate" : t.high || "High"}</td>
                  <td>< 6 ${t.pdfHoursPerDay || "hours/day"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Risk Assessment -->
          <div class="risk-section">
            <div class="section-title">${t.pdfChronicDiseaseRisk || "Chronic Disease Risk Assessment"}</div>
            
            <table class="risk-table">
              <thead>
                <tr>
                  <th>${t.pdfCondition || "Condition"}</th>
                  <th style="width: 15%;">${t.pdfRiskLevel || "Risk Level"}</th>
                  <th style="width: 25%;">${t.pdfProbability || "Probability"}</th>
                  <th style="width: 30%;">${t.pdfRiskCategory || "Risk Category"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="risk-name">${t.pdfObesity || "Obesity"}</td>
                  <td class="risk-percentage" style="color: ${getRiskColor(diseaseRisks.obesity)}">${diseaseRisks.obesity.toFixed(1)}%</td>
                  <td>
                    <div class="risk-bar">
                      <div class="risk-bar-fill" style="width: ${diseaseRisks.obesity}%; background-color: ${getRiskColor(diseaseRisks.obesity)}"></div>
                    </div>
                    <div style="font-size: 10px; text-align: center;">
                      ${t.low || "Low"} │ ${t.medium || "Medium"} │ ${t.high || "High"}
                    </div>
                  </td>
                  <td>
                    <div class="risk-category" style="background: ${getRiskColor(diseaseRisks.obesity)}; color: white;">
                      ${diseaseRisks.obesity >= 67 ? t.pdfHighRisk || "HIGH RISK" : diseaseRisks.obesity >= 34 ? t.pdfMediumRisk || "MEDIUM RISK" : t.pdfLowRisk || "LOW RISK"}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="risk-name">${t.pdfHypertension || "Hypertension"}</td>
                  <td class="risk-percentage" style="color: ${getRiskColor(diseaseRisks.hypertension)}">${diseaseRisks.hypertension.toFixed(1)}%</td>
                  <td>
                    <div class="risk-bar">
                      <div class="risk-bar-fill" style="width: ${diseaseRisks.hypertension}%; background-color: ${getRiskColor(diseaseRisks.hypertension)}"></div>
                    </div>
                    <div style="font-size: 10px; text-align: center;">
                      ${t.low || "Low"} │ ${t.medium || "Medium"} │ ${t.high || "High"}
                    </div>
                  </td>
                  <td>
                    <div class="risk-category" style="background: ${getRiskColor(diseaseRisks.hypertension)}; color: white;">
                      ${diseaseRisks.hypertension >= 67 ? t.pdfHighRisk || "HIGH RISK" : diseaseRisks.hypertension >= 34 ? t.pdfMediumRisk || "MEDIUM RISK" : t.pdfLowRisk || "LOW RISK"}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="risk-name">${t.pdfStroke || "Stroke"}</td>
                  <td class="risk-percentage" style="color: ${getRiskColor(diseaseRisks.stroke)}">${diseaseRisks.stroke.toFixed(1)}%</td>
                  <td>
                    <div class="risk-bar">
                      <div class="risk-bar-fill" style="width: ${diseaseRisks.stroke}%; background-color: ${getRiskColor(diseaseRisks.stroke)}"></div>
                    </div>
                    <div style="font-size: 10px; text-align: center;">
                      ${t.low || "Low"} │ ${t.medium || "Medium"} │ ${t.high || "High"}
                    </div>
                  </td>
                  <td>
                    <div class="risk-category" style="background: ${getRiskColor(diseaseRisks.stroke)}; color: white;">
                      ${diseaseRisks.stroke >= 67 ? t.pdfHighRisk || "HIGH RISK" : diseaseRisks.stroke >= 34 ? t.pdfMediumRisk || "MEDIUM RISK" : t.pdfLowRisk || "LOW RISK"}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Recommendations -->
          <div class="recommendations-section">
            <div class="section-title">${t.pdfMedicalRecommendations || "Medical Recommendations & Health Plan"}</div>
            
            ${generatePersonalizedTips()
              .map(
                (tip, index) => `
                <div class="recommendation-item">
                  <span class="rec-priority">${index < 3 ? t.pdfHighPriority || "HIGH" : t.pdfMediumPriority || "MEDIUM"}</span>
                  <strong>${tip.text.split(".")[0]}:</strong> ${tip.text}
                </div>
              `
              )
              .join("")}
              
            <div class="recommendation-item">
              <span class="rec-priority">${t.pdfFollowUp || "FOLLOW-UP"}</span>
              <strong>${t.pdfNextAssessment || "Next Assessment"}</strong> ${t.pdfNextAssessmentDesc || "Recommend follow-up assessment in 3 months to monitor progress and adjust recommendations as needed."}
            </div>
          </div>
          
          <!-- Signature & Footer -->
          <div class="report-footer">
            <div class="footer-grid">
              <div>
                <div class="disclaimer">
                  <div class="disclaimer-title">${t.pdfMedicalDisclaimer || "MEDICAL DISCLAIMER"}</div>
                  <div>${t.pdfDisclaimerText || "This report is generated based on self-reported lifestyle data and predictive algorithms. It is intended for informational purposes only and should not be considered medical advice. This assessment does not replace consultation with a qualified healthcare professional. Please consult your physician for proper medical evaluation and personalized health recommendations."}</div>
                </div>
              </div>
              <div>
                <div style="text-align: center;">
                  <div style="font-weight: bold; margin-bottom: 10px;">${t.pdfHospitalName || "Health Track Medical Center"}</div>
                  <div style="font-size: 9px;">${t.pdfPreventiveMedicine || "Preventive Medicine Department"}</div>
                  <div style="font-size: 9px;">${t.pdfReportGenerated || "Report Generated"}: ${currentDate}</div>
                </div>
              </div>
            </div>
            
            <div class="signature-area">
              <div class="signature-line"></div>
              <div class="signature-label">${t.pdfAutomatedSystem || "Automated Health Assessment System"}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

    try {
      // Generate filename with current date in YYYYMMDD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const filename = `HealthReport_${year}${month}${day}.pdf`;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        fileName: filename,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert(
        t.error || "Error",
        t.pdfGenerationError || "Failed to generate PDF."
      );
    }
  };

  const fetchProgressData = useCallback(async () => {
    try {
      const db = await getDb();
      let lifestyle, prediction, score;

      if (route.params?.predictionData) {
        lifestyle = route.params.lifestyleData;
        prediction = route.params.predictionData;
        score = route.params.lifestyleScore;
      } else {
        const userProfileData = await db.getAllAsync(
          "SELECT * FROM UserProfile ORDER BY id DESC LIMIT 1"
        );

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
            Chronic_Disease: record.Chronic_Disease || t.none || "None",
            Exercise_Frequency: Number(record.Exercise_Frequency) || 0,
            Alcohol_Consumption: record.Alcohol_Consumption || t.no || "No",
            Smoking_Habit: record.Smoking_Habit || t.no || "No",
            Diet_Quality: record.Diet_Quality || "unknown",
            FRUITS_VEGGIES: Number(record.FRUITS_VEGGIES) || 0,
            Stress_Level: Number(record.Stress_Level) || 1,
            Screen_Time_Hours: Number(record.Screen_Time_Hours) || 0,
          };
          prediction = {
            Obesity_Flag: JSON.parse(
              record.Obesity_Flag || '{"prediction": 0, "probability": 0}'
            ),
            Hypertension_Flag: JSON.parse(
              record.Hypertension_Flag || '{"prediction": 0, "probability": 0}'
            ),
            Stroke_Flag: JSON.parse(
              record.Stroke_Flag || '{"prediction": 0, "probability": 0}'
            ),
          };
          score = Number(record.Lifestyle_Score) || null;
        }
      }

      if (lifestyle) {
        setLifestyleData(lifestyle);
        setPredictionData(prediction);
        const calculatedScore = score ?? calculateLifestyleScore(lifestyle);
        setLifestyleScore(calculatedScore);
        setDiseaseRisks({
          obesity: (prediction?.Obesity_Flag?.probability || 0) * 100,
          hypertension: (prediction?.Hypertension_Flag?.probability || 0) * 100,
          stroke: (prediction?.Stroke_Flag?.probability || 0) * 100,
        });
      } else {
        setLifestyleData(null);
        setPredictionData(null);
        setLifestyleScore(0);
        setDiseaseRisks({ obesity: 0, hypertension: 0, stroke: 0 });
      }
    } catch (error) {
      Alert.alert(
        t.error || "Error",
        t.dataFetchError || "Failed to fetch health data."
      );
    }
  }, [route.params, t]);

  useFocusEffect(
    useCallback(() => {
      fetchProgressData();
    }, [fetchProgressData])
  );

  const renderMetricCard = (
    title,
    value,
    subtext,
    iconName,
    iconColor = "#457B9D"
  ) => (
    <View style={styles.metricCard}>
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
    </View>
  );

  const renderFullWidthMetricCard = (
    title,
    value,
    subtext,
    iconName,
    iconColor = "#457B9D"
  ) => (
    <View style={styles.fullWidthCard}>
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
    </View>
  );

  const renderRiskCard = ({ item }, t) => {
    const riskPercentage = diseaseRisks[item.key] || 0;
    const progress = Math.max(0, Math.min(1, riskPercentage / 100));
    const color = getRiskColor(riskPercentage);
    const predictionStatus =
      riskPercentage >= 67
        ? t.high || "High"
        : riskPercentage >= 34
          ? t.medium || "Medium"
          : t.low || "Low";

    return (
      <View style={styles.riskCard}>
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
      </View>
    );
  };

  const renderTipCard = ({ item }) => (
    <View style={styles.tipCard}>
      <Icon name={item.icon} size={24} color="#34C759" style={styles.tipIcon} />
      <Text style={styles.tipText}>{item.text}</Text>
    </View>
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
    if (item.type === "score" && !lifestyleData) {
      return (
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>
            {t.yourLifestyleScore || "Your Lifestyle Score"}
          </Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t.noData ||
                "Please submit your lifestyle data to view your health risk predictions."}
            </Text>
            <TouchableOpacity
              style={[styles.recalculateButton, { marginTop: 20 }]}
              onPress={() => navigation.navigate("LifestyleDataInput")}
            >
              <Text style={styles.recalculateButtonText}>
                {t.recalculate || "Update Lifestyle Data"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    switch (item.type) {
      case "header":
        return (
          <View style={styles.headerContainer}>
            <Text style={styles.greeting}>{t.homeTitle || "Dashboard"}</Text>
            <Text style={styles.appTagline}>
              {t.homeTagline || "Your health overview"}
            </Text>
          </View>
        );
      case "score":
        return (
          <View style={styles.scoreContainer}>
            <AnimatedProgressCircle percentage={lifestyleScore ?? 0} />
            <Text style={styles.progressLabel}>
              {t.yourLifestyleScore || "Your Lifestyle Score"}
            </Text>
            <Text
              style={[styles.riskStatusText, { color: getOverallRiskColor() }]}
            >
              {getOverallRiskLevel()}{" "}
              {t.overallHealthRisk || "Overall Health Risk"}
            </Text>
          </View>
        );
      case "metrics":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.keyMetrics || "Key Metrics"}
            </Text>
            {lifestyleData && (
              <View style={styles.metricsGrid}>
                {renderMetricCard(
                  t.bmiLabel?.replace(": ", "") || "BMI",
                  lifestyleData?.BMI?.toFixed(1) ?? t.unknown,
                  getBMICategory(lifestyleData?.BMI),
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
                    ? `${lifestyleData.Sleep_Hours} ${t.hrs || "h"}`
                    : `0 ${t.hrs || "h"}`,
                  getSleepStatus(lifestyleData?.Sleep_Hours),
                  "bed",
                  "#8A2BE2"
                )}
                {renderMetricCard(
                  t.exercise,
                  lifestyleData?.Exercise_Frequency !== undefined
                    ? `${lifestyleData.Exercise_Frequency}/${t.daysPerWeek || "days/week"}`
                    : `0/${t.daysPerWeek || "days/week"}`,
                  getExerciseStatus(lifestyleData?.Exercise_Frequency),
                  "fitness-center",
                  "#FF9500"
                )}
              </View>
            )}
          </View>
        );
      case "lifestyle":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.lifestyleFactors || "Lifestyle Factors"}
            </Text>
            {lifestyleData && (
              <>
                {renderFullWidthMetricCard(
                  t.dietQuality?.label || "Diet Quality",
                  lifestyleData?.Diet_Quality !== undefined
                    ? getDietQualityText(lifestyleData.Diet_Quality)
                    : t.dietQuality?.unknown || "Unknown",
                  "",
                  "restaurant",
                  "#4CAF50"
                )}
                {renderFullWidthMetricCard(
                  t.fruitsVeggies || "Fruits & Vegetables",
                  lifestyleData?.FRUITS_VEGGIES !== undefined
                    ? `${lifestyleData.FRUITS_VEGGIES} ${t.servingsDaily || "servings/day"}`
                    : `0 ${t.servingsDaily || "servings/day"}`,
                  "",
                  "local-dining",
                  "#8BC34A"
                )}
                {renderFullWidthMetricCard(
                  t.stressLevel || "Stress Level",
                  getStressLevelText(lifestyleData?.Stress_Level),
                  lifestyleData?.Stress_Level !== undefined
                    ? `${lifestyleData.Stress_Level}/10`
                    : `0/10`,
                  "mood",
                  getStressColor(lifestyleData?.Stress_Level)
                )}
                {renderFullWidthMetricCard(
                  t.screenTime || "Screen Time",
                  lifestyleData?.Screen_Time_Hours !== undefined
                    ? `${lifestyleData.Screen_Time_Hours} ${t.hours?.toLowerCase() || "h"}`
                    : `0 ${t.hours?.toLowerCase() || "h"}`,
                  t.perDay || "per day",
                  "devices",
                  "#607D8B"
                )}
              </>
            )}
          </View>
        );
      case "risks":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.chronicDiseaseRisk || "Chronic Disease Risk"}
            </Text>
            {lifestyleData && (
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
                scrollEnabled={false}
              />
            )}
          </View>
        );
      case "tips":
        const tips = generatePersonalizedTips();
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.personalizedTips || "Personalized Tips"}
            </Text>
            {tips.length > 0 && (
              <FlatList
                data={tips}
                renderItem={renderTipCard}
                keyExtractor={(item, index) => `${item.text}-${index}`}
                contentContainerStyle={{ paddingHorizontal: 0 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                scrollEnabled={false}
              />
            )}
          </View>
        );
      case "recalculate":
        return (
          <View style={styles.recalculateContainer}>
            <TouchableOpacity
              style={styles.recalculateButton}
              onPress={() => navigation.navigate("LifestyleDataInput")}
            >
              <Text style={styles.recalculateButtonText}>
                {t.recalculate || "Update Lifestyle Data"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={downloadHealthReport}
              disabled={!lifestyleData}
            >
              <Text style={styles.downloadButtonText}>
                {t.downloadReport || "Download Health Report"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary t={t}>
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
