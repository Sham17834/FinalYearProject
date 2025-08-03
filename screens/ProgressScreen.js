import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  View,
  Text,
  SectionList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { styles } from "./styles";
import { LanguageContext } from "./LanguageContext";
import { mockStorage } from "../storage.js";
import { useRoute } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const ProgressScreen = () => {
  const { t } = useContext(LanguageContext);
  const route = useRoute();
  const [timeRange, setTimeRange] = useState("7days");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (route.params?.lifestyleData) {
      setRefreshKey((prev) => prev + 1);
    }
    console.log("mockStorage in ProgressScreen:", mockStorage);
  }, [route.params]);

  const progressData = useMemo(() => {
    const fallbackData = [
      {
        date: "2025-08-02",
        steps: 8234,
        sleep: 7.2,
        heartRate: null,
        bmi: 22.4,
        riskLevel: t.low || "Low",
        age: 30,
        gender: "Male",
        chronic_disease: "None",
        exercise_frequency: 3,
        alcohol_consumption: "No",
        smoking_habit: "No",
        diet_quality: "Good",
        fruits_veggies: 5,
        stress_level: 5,
        screen_time_hours: 4,
      },
      {
        date: "2025-08-01",
        steps: 7500,
        sleep: 6.8,
        heartRate: null,
        bmi: 22.4,
        riskLevel: t.low || "Low",
        age: 30,
        gender: "Male",
        chronic_disease: "None",
        exercise_frequency: 3,
        alcohol_consumption: "No",
        smoking_habit: "No",
        diet_quality: "Good",
        fruits_veggies: 5,
        stress_level: 5,
        screen_time_hours: 4,
      },
    ];
    if (!mockStorage || !Array.isArray(mockStorage)) {
      console.warn(
        "mockStorage is undefined or not an array, using fallback data"
      );
      return fallbackData;
    }
    return mockStorage.length > 0
      ? mockStorage.map((item) => ({
          ...item,
          riskLevel:
            item.riskLevel === "Unknown"
              ? estimateRiskLevel(item)
              : item.riskLevel,
        }))
      : fallbackData;
  }, [t.low, refreshKey]);

  const estimateRiskLevel = (item) => {
    if (item.chronic_disease !== t.none) return t.high || "High";
    if (item.stress_level >= 8) return t.high || "High";
    if (item.stress_level >= 5) return t.medium || "Medium";
    return t.low || "Low";
  };

  const shapRankings = useMemo(
    () => [
      { factor: t.steps || "Steps", value: 0.3 },
      { factor: t.sleep || "Sleep", value: 0.25 },
      { factor: t.bmi || "BMI", value: 0.15 },
      { factor: t.stressLevel || "Stress Level", value: 0.15 },
      { factor: t.dietQuality || "Diet Quality", value: 0.1 },
      { factor: t.age || "Age", value: 0.05 },
    ],
    [t.steps, t.sleep, t.bmi, t.stressLevel, t.dietQuality, t.age]
  );

  const filteredData = useMemo(
    () => (timeRange === "7days" ? progressData.slice(0, 7) : progressData),
    [progressData, timeRange]
  );

  const calculateLifestyleScore = useCallback((item) => {
    let score = 0;
    score += (item.steps / 10000) * 40;
    score += (item.sleep / 8) * 30;
    score += ((25 - (item.bmi || 25)) / 5) * 20;
    score += ((10 - (item.stress_level || 5)) / 10) * 10;
    return Math.min(Math.max(score, 0), 100).toFixed(1);
  }, []);

  const lifestyleScores = useMemo(
    () => filteredData.map((item) => parseFloat(calculateLifestyleScore(item))),
    [filteredData, calculateLifestyleScore]
  );
  const stepsData = useMemo(
    () => filteredData.map((item) => item.steps || 0),
    [filteredData]
  );
  const sleepData = useMemo(
    () => filteredData.map((item) => item.sleep || 0),
    [filteredData]
  );
  const riskLevels = useMemo(
    () =>
      filteredData.map((item) =>
        item.riskLevel === t.low
          ? 1
          : item.riskLevel === t.medium
          ? 2
          : 3
      ),
    [filteredData, t.low, t.medium, t.high]
  );

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
      style: { borderRadius: 12 },
      propsForDots: { r: "4", strokeWidth: "1", stroke: "#008080" },
      propsForBackgroundLines: { strokeDasharray: "", stroke: "#e5e7eb" },
    }),
    []
  );

  const sections = useMemo(
    () => [
      {
        title: t.timeRange || "Time Range",
        data: [{ type: "timeRange" }],
        key: "timeRange",
      },
      {
        title: t.lifestyleScoreTrend || "Lifestyle Score Trend",
        data: [{ type: "lifestyleChart" }],
        key: "lifestyleChart",
      },
      {
        title: t.stepsSleepTrend || "Steps & Sleep Trend",
        data: [{ type: "stepsSleepChart" }],
        key: "stepsSleepChart",
      },
      {
        title: t.riskLevelTrend || "Risk Level Trend",
        data: [{ type: "riskChart" }],
        key: "riskChart",
      },
      {
        title: t.shapFactors || "Key Health Factors",
        data: shapRankings,
        key: "shap",
      },
      {
        title: t.weeklyProgress || "Progress Details",
        data: filteredData,
        key: "progress",
      },
      {
        title: t.lifestyleDetails || "Lifestyle Details",
        data: filteredData,
        key: "lifestyle",
      },
    ],
    [
      filteredData,
      shapRankings,
      t.timeRange,
      t.lifestyleScoreTrend,
      t.stepsSleepTrend,
      t.riskLevelTrend,
      t.shapFactors,
      t.weeklyProgress,
      t.lifestyleDetails,
    ]
  );

  const renderItem = useCallback(
    ({ item, section }) => {
      if (!section) return null;
      switch (section.key) {
        case "timeRange":
          return (
            <View style={styles.timeRangeSwitcher}>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "7days" && styles.activeTimeRange,
                ]}
                onPress={() => setTimeRange("7days")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "7days" && styles.activeTimeRangeText,
                  ]}
                >
                  {t.sevenDays || "7 Days"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "30days" && styles.activeTimeRange,
                ]}
                onPress={() => setTimeRange("30days")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "30days" && styles.activeTimeRangeText,
                  ]}
                >
                  {t.thirtyDays || "30 Days"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        case "lifestyleChart":
          return (
            <LineChart
              data={{
                labels: filteredData
                  .map((item) => item.date.split("-").slice(1).join("/"))
                  .reverse(),
                datasets: [{ data: lifestyleScores.slice().reverse() }],
                legend: [t.lifestyleScoreTrend || "Lifestyle Score"],
              }}
              width={screenWidth - 48}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          );
        case "stepsSleepChart":
          return (
            <LineChart
              data={{
                labels: filteredData
                  .map((item) => item.date.split("-").slice(1).join("/"))
                  .reverse(),
                datasets: [
                  {
                    data: stepsData.slice().reverse(),
                    color: () => `rgba(0, 128, 128, 1)`,
                    strokeWidth: 2,
                  },
                  {
                    data: sleepData.slice().reverse(),
                    color: () => `rgba(219, 112, 147, 1)`,
                    strokeWidth: 2,
                  },
                ],
                legend: [
                  t.steps || "Steps",
                  `${t.sleep || "Sleep"} (${t.hrs || "hrs"})`,
                ],
              }}
              width={screenWidth - 48}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          );
        case "riskChart":
          return (
            <LineChart
              data={{
                labels: filteredData
                  .map((item) => item.date.split("-").slice(1).join("/"))
                  .reverse(),
                datasets: [{ data: riskLevels.slice().reverse() }],
                legend: [t.riskLevelTrend || "Risk Level"],
              }}
              width={screenWidth - 48}
              height={200}
              chartConfig={{
                ...chartConfig,
                formatYLabel: (value) =>
                  [t.low, t.medium, t.high][parseInt(value) - 1] || value,
              }}
              bezier
              style={styles.chart}
            />
          );
        case "shap":
          return (
            <View style={styles.shapItem}>
              <Text style={styles.shapFactor}>{item.factor}</Text>
              <Text style={styles.shapValue}>
                {t.impact || "Impact: "}
                {(item.value * 100).toFixed(1)}%
              </Text>
            </View>
          );
        case "progress":
          return (
            <View style={styles.progressItem}>
              <Text style={styles.progressDate}>{item.date}</Text>
              <View style={styles.progressMetrics}>
                <Text style={styles.progressMetric}>
                  {t.stepsLabel || "Steps: "}
                  {item.steps || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.sleepLabel || "Sleep: "}
                  {item.sleep || "N/A"} {t.hrs || "hrs"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.bmiLabel || "BMI: "}
                  {item.bmi || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.riskLabel || "Risk Level: "}
                  {t[item.riskLevel] || item.riskLevel || "N/A"}
                </Text>
              </View>
            </View>
          );
        case "lifestyle":
          return (
            <View style={styles.progressItem}>
              <Text style={styles.progressDate}>{item.date}</Text>
              <View style={styles.progressMetrics}>
                <Text style={styles.progressMetric}>
                  {t.age || "Age"}: {item.age || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.gender || "Gender"}: {t[item.gender] || item.gender || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.heightCm || "Height"}: {item.height_cm || "N/A"} cm
                </Text>
                <Text style={styles.progressMetric}>
                  {t.weightKg || "Weight"}: {item.weight_kg || "N/A"} kg
                </Text>
                <Text style={styles.progressMetric}>
                  {t.chronicDisease || "Chronic Disease"}:{" "}
                  {t[item.chronic_disease] || item.chronic_disease || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.exerciseFrequency || "Exercise Frequency"}:{" "}
                  {item.exercise_frequency || "N/A"}{" "}
                  {item.exercise_frequency === 1 ? t.day || "day" : t.days || "days"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.alcoholConsumption || "Alcohol Consumption"}:{" "}
                  {t[item.alcohol_consumption] || item.alcohol_consumption || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.smokingHabit || "Smoking Habit"}:{" "}
                  {t[item.smoking_habit] || item.smoking_habit || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.dietQuality || "Diet Quality"}:{" "}
                  {t[item.diet_quality] || item.diet_quality || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.fruitsVeggies || "Fruits & Veggies"}:{" "}
                  {item.fruits_veggies || "N/A"}{" "}
                  {item.fruits_veggies === 1
                    ? t.serving || "serving"
                    : t.servings || "servings"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.stressLevel || "Stress Level"}:{" "}
                  {item.stress_level || "N/A"}
                </Text>
                <Text style={styles.progressMetric}>
                  {t.screenTimeHours || "Screen Time"}:{" "}
                  {item.screen_time_hours || "N/A"} {t.hours || "hours"}
                </Text>
              </View>
            </View>
          );
        default:
          return null;
      }
    },
    [
      timeRange,
      filteredData,
      lifestyleScores,
      stepsData,
      sleepData,
      riskLevels,
      chartConfig,
      t.steps,
      t.sleep,
      t.hrs,
      t.low,
      t.medium,
      t.high,
      t.sevenDays,
      t.thirtyDays,
      t.lifestyleScoreTrend,
      t.stepsSleepTrend,
      t.riskLevelTrend,
      t.impact,
      t.stepsLabel,
      t.sleepLabel,
      t.bmiLabel,
      t.riskLabel,
      t.age,
      t.gender,
      t.heightCm,
      t.weightKg,
      t.chronicDisease,
      t.exerciseFrequency,
      t.alcoholConsumption,
      t.smokingHabit,
      t.dietQuality,
      t.fruitsVeggies,
      t.stressLevel,
      t.screenTimeHours,
      t.day,
      t.days,
      t.serving,
      t.servings,
      t.hours,
    ]
  );

  const renderSectionHeader = useCallback(({ section }) => {
    if (!section || !section.title) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  }, []);

  const getItemLayout = useCallback((data, index) => {
    if (!data) return { length: 0, offset: 0, index };

    let offset = 0;
    let currentIndex = 0;

    for (let section of data) {
      offset += 50;
      for (let i = 0; i < section.data.length; i++) {
        if (currentIndex === index) {
          const length = section.key.includes("Chart")
            ? 240
            : section.key === "timeRange"
            ? 60
            : section.key === "shap"
            ? 60
            : section.key === "lifestyle"
            ? 300
            : 140;
          return { length, offset, index };
        }
        offset += section.key.includes("Chart")
          ? 240
          : section.key === "timeRange"
          ? 60
          : section.key === "shap"
          ? 60
          : section.key === "lifestyle"
          ? 300
          : 140;
        currentIndex++;
      }
    }

    return { length: 0, offset: 0, index };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.appName}>{t.progressTitle || "Your Progress"}</Text>
            <Text style={styles.appTagline}>
              {t.progressTagline || "Track your health journey"}
            </Text>
          </View>
        </View>

        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) =>
            item.type || item.factor || item.date + index
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          getItemLayout={getItemLayout}
          extraData={refreshKey}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;