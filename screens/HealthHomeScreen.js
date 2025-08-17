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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

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
            {this.state.error?.message || t.unknown || "Unknown error"}
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
        <Text style={styles.progressSubtext}>{t.outOf100 ?? "out of 100"}</Text>
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
    return (
      t.dietQuality?.[dietQuality.toLowerCase()] ||
      dietQuality ||
      t.dietQuality?.unknown ||
      "Unknown"
    );
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const generatePersonalizedTips = () => {
    const tips = [];
    if (lifestyleData?.BMI && lifestyleData.BMI >= 25) {
      tips.push({
        text:
          t.maintainHealthyWeight || "Focus on maintaining a healthy weight",
        icon: "accessibility",
      });
    }
    if (lifestyleData?.Daily_Steps < 5000) {
      tips.push({
        text:
          t.increaseWalkingSteps || "Walk 8000+ steps daily for better health",
        icon: "directions-walk",
      });
    }
    if (lifestyleData?.Sleep_Hours < 6) {
      tips.push({
        text: t.improvesSleepQuality || "Aim for 7-9 hours of sleep nightly",
        icon: "bed",
      });
    }
    if (lifestyleData?.Exercise_Frequency < 3) {
      tips.push({
        text: t.increasePhysicalActivity || "Try to exercise 3+ days/week",
        icon: "fitness-center",
      });
    }
    if (lifestyleData?.FRUITS_VEGGIES < 5) {
      tips.push({
        text:
          t.eatMoreFruitsVeggies || "Eat 5+ servings of fruits/veggies daily",
        icon: "local-dining",
      });
    }
    if (lifestyleData?.Diet_Quality?.toLowerCase() === "poor") {
      tips.push({
        text: t.eatMoreVegetables || "Eat more vegetables",
        icon: "local-dining",
      });
    }
    if (lifestyleData?.Stress_Level > 7) {
      tips.push({
        text: t.manageStressLevels || "Practice meditation to reduce stress",
        icon: "mood",
      });
    }
    return tips.length > 0
      ? tips
      : [
          {
            text:
              t.generalTip ||
              "Maintain a balanced lifestyle for optimal health.",
            icon: "favorite",
          },
        ];
  };

  const downloadHealthReport = async () => {
    try {
      if (!lifestyleData || !predictionData) {
        Alert.alert(
          t.error || "Error",
          t.noData || "Please submit your lifestyle data to generate a report."
        );
        return;
      }

      console.log("Document Directory:", FileSystem.documentDirectory);
      console.log("Cache Directory:", FileSystem.cacheDirectory);

      const date = new Date().toLocaleDateString();
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #1D3557; }
              h1 { color: #008080; text-align: center; }
              h2 { color: #457B9D; }
              .section { margin-bottom: 20px; }
              .metric { margin: 10px 0; }
              .metric-title { font-weight: bold; color: #457B9D; }
              .metric-value { font-size: 18px; color: #1D3557; }
              .risk { margin: 10px 0; }
              .risk-title { font-weight: bold; color: #457B9D; }
              .tip { margin: 10px 0; color: #34C759; }
            </style>
          </head>
          <body>
            <h1>${t.healthAssessmentRecord || "Health Report"}</h1>
            <p style="text-align: center;">${t.date || "Generated on"} ${date}</p>
            
            <div class="section">
              <h2>${t.keyMetrics || "Key Metrics"}</h2>
              <div class="metric">
                <span class="metric-title">${t.bmiLabel?.replace(": ", "") || "BMI"}:</span>
                <span class="metric-value">${lifestyleData?.BMI?.toFixed(1) || t.unknown || "Unknown"} (${getBMICategory(lifestyleData?.BMI)})</span>
              </div>
              <div class="metric">
                <span class="metric-title">${t.steps || "Steps"}:</span>
                <span class="metric-value">${formatNumber(lifestyleData?.Daily_Steps) || "0"} (${t.daily || "Daily"})</span>
              </div>
              <div class="metric">
                <span class="metric-title">${t.sleep || "Sleep"}:</span>
                <span class="metric-value">${lifestyleData?.Sleep_Hours || 0}${t.hrs || "h"} (${getSleepStatus(lifestyleData?.Sleep_Hours)})</span>
              </div>
              <div class="metric">
                <span class="metric-title">${t.exercise || "Exercise"}:</span>
                <span class="metric-value">${lifestyleData?.Exercise_Frequency || 0}/${t.week || "week"} (${getExerciseStatus(lifestyleData?.Exercise_Frequency)})</span>
              </div>
            </div>

            <div class="section">
              <h2>${t.lifestyleFactors || "Lifestyle Factors"}</h2>
              <div class="metric">
                <span class="metric-title">${t.dietQuality?.label || "Diet Quality"}:</span>
                <span class="metric-value">${getDietQualityText(lifestyleData?.Diet_Quality)}</span>
              </div>
              <div class="metric">
                <span class="metric-title">${t.fruitsVeggies || "Fruits & Vegetables"}:</span>
                <span class="metric-value">${lifestyleData?.FRUITS_VEGGIES || 0} ${t.servingsDaily || "servings/day"}</span>
              </div>
              <div class="metric">
                <span class="metric-title">${t.stressLevel || "Stress Level"}:</span>
                <span class="metric-value">${getStressLevelText(lifestyleData?.Stress_Level)} (${lifestyleData?.Stress_Level || 0}/10)</span>
              </div>
              <div class="metric">
                <span class="metric-title">${t.screenTime || "Screen Time"}:</span>
                <span class="metric-value">${lifestyleData?.Screen_Time_Hours || 0}${t.hours?.toLowerCase() || "h"} ${t.perDay || "per day"}</span>
              </div>
            </div>

            <div class="section">
              <h2>${t.chronicDiseaseRisk || "Chronic Disease Risk"}</h2>
              <div class="risk">
                <span class="risk-title">${t.obesityRisk || "Obesity Risk"}:</span>
                <span class="metric-value">${(diseaseRisks.obesity || 0).toFixed(2)}% (${diseaseRisks.obesity >= 67 ? t.high || "High" : diseaseRisks.obesity >= 34 ? t.medium || "Medium" : t.low || "Low"})</span>
              </div>
              <div class="risk">
                <span class="risk-title">${t.hypertensionRisk || "Hypertension Risk"}:</span>
                <span class="metric-value">${(diseaseRisks.hypertension || 0).toFixed(2)}% (${diseaseRisks.hypertension >= 67 ? t.high || "High" : diseaseRisks.hypertension >= 34 ? t.medium || "Medium" : t.low || "Low"})</span>
              </div>
              <div class="risk">
                <span class="risk-title">${t.strokeRisk || "Stroke Risk"}:</span>
                <span class="metric-value">${(diseaseRisks.stroke || 0).toFixed(2)}% (${diseaseRisks.stroke >= 67 ? t.high || "High" : diseaseRisks.stroke >= 34 ? t.medium || "Medium" : t.low || "Low"})</span>
              </div>
            </div>

            <div class="section">
              <h2>${t.personalizedTips || "Personalized Tips"}</h2>
              ${generatePersonalizedTips()
                .map((tip) => `<div class="tip">${tip.text}</div>`)
                .join("")}
            </div>
          </body>
        </html>
      `;

      const fileName = `HealthReport_${date.replace(/\//g, "-")}.pdf`;
      const options = {
        html: htmlContent,
        fileName: fileName.replace(".pdf", ""),
        directory: "Documents",
      };

      console.log("Generating PDF with options:", options);

      const file = await RNHTMLtoPDF.convert(options);
      console.log("PDF generation result:", file);

      if (!file.filePath) {
        throw new Error(
          t.errorSubmission || "PDF creation failed: No file path returned"
        );
      }

      const validFilePath = file.filePath.startsWith("file://")
        ? file.filePath
        : `file://${file.filePath}`;
      console.log("Valid file path for sharing:", validFilePath);

      const fileInfo = await FileSystem.getInfoAsync(validFilePath);
      console.log("File info:", fileInfo);
      if (!fileInfo.exists) {
        throw new Error(
          `${t.errorSubmission || "PDF file does not exist at path"}: ${validFilePath}`
        );
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          t.error || "Error",
          t.sharingNotAvailable || "Sharing is not available on this device."
        );
        return;
      }

      await Sharing.shareAsync(validFilePath, {
        mimeType: "application/pdf",
        dialogTitle: t.shareReport || "Share Health Report",
        UTI: "com.adobe.pdf",
      });

      Alert.alert(
        t.success || "Success",
        t.reportGenerated ||
          "Health report has been generated and is ready to share or save."
      );

      try {
        await FileSystem.deleteAsync(validFilePath);
        console.log("Cleaned up PDF file:", validFilePath);
      } catch (cleanupError) {
        console.warn("Failed to clean up PDF file:", cleanupError);
      }
    } catch (error) {
      console.error("Error generating health report:", error);
      Alert.alert(
        t.error || "Error",
        `${t.reportError || "Failed to generate health report. Please try again."} (${error.message})`
      );
    }
  };

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
          Chronic_Disease: record.Chronic_Disease || t.none || "None",
          Exercise_Frequency: Number(record.Exercise_Frequency) || 0,
          Alcohol_Consumption: record.Alcohol_Consumption || t.no || "No",
          Smoking_Habit: record.Smoking_Habit || t.no || "No",
          Diet_Quality:
            record.Diet_Quality || t.dietQuality?.unknown || "Unknown",
          FRUITS_VEGGIES: Number(record.FRUITS_VEGGIES) || 0,
          Stress_Level: Number(record.Stress_Level) || 1,
          Screen_Time_Hours: Number(record.Screen_Time_Hours) || 0,
        };
        setLifestyleData(lifestyle);

        // Parse prediction flags from JSON strings
        prediction = {
          Obesity_Flag: JSON.parse(record.Obesity_Flag || "0"),
          Hypertension_Flag: JSON.parse(record.Hypertension_Flag || "0"),
          Stroke_Flag: JSON.parse(record.Stroke_Flag || "0"),
        };
        setPredictionData(prediction);

        // Update disease risks based on prediction flags
        setDiseaseRisks({
          obesity: prediction.Obesity_Flag ? 67 : 1, // Simplified: 67% for positive, 1% for negative
          hypertension: prediction.Hypertension_Flag ? 67 : 1,
          stroke: prediction.Stroke_Flag ? 67 : 1,
        });
      }

      // Placeholder score calculation; replace with actual logic
      setLocalScore(75);
    } catch (error) {
      console.error("Error fetching progress data:", error);
      Alert.alert(
        t.error || "Error",
        t.dataFetchError || "Failed to fetch health data."
      );
    }
  }, [t]);

  useEffect(() => {
    fetchProgressData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fetchProgressData]);

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
    if (!lifestyleData && item.type !== "recalculate") {
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
              {t.recalculate || "Update Lifestyle Data"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (item.type) {
      case "header":
        return (
          <Animated.View style={[styles.headerContainer]}>
            <Text style={styles.greeting}>{t.homeTitle || "Dashboard"}</Text>
            <Text style={styles.appTagline}>
              {t.homeTagline || "Your health overview"}
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
              {getOverallRiskLevel()}{" "}
              {t.overallHealthRisk || "Overall Health Risk"}
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
                  ? `${lifestyleData.Sleep_Hours}${t.hrs || "h"}`
                  : `0${t.hrs || "h"}`,
                getSleepStatus(lifestyleData?.Sleep_Hours),
                "bed",
                "#8A2BE2"
              )}
              {renderMetricCard(
                t.exercise || "Exercise",
                lifestyleData?.Exercise_Frequency !== undefined
                  ? `${lifestyleData.Exercise_Frequency}/${t.daysPerWeek || "week"}`
                  : `0/${t.daysPerWeek || "week"}`,
                getExerciseStatus(lifestyleData?.Exercise_Frequency),
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
              t.dietQuality?.label || "Diet Quality",
              getDietQualityText(lifestyleData?.Diet_Quality),
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
                ? `${lifestyleData.Screen_Time_Hours}${t.hours?.toLowerCase() || "h"}`
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
                {t.recalculate || "Update Lifestyle Data"}
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
