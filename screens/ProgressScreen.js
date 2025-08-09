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
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
  Animated,
  Alert,
  Modal,
} from "react-native";
import { LanguageContext } from "./LanguageContext";
import * as SQLite from "expo-sqlite";
import { useRoute } from "@react-navigation/native";
import { getDb } from "./db";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#008080",
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "absolute",
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0f2f1",
    textAlign: "center",
  },
  mainContent: {
    padding: 16,
    paddingTop: 100,
  },
  topSection: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 20,
  },
  quickStatsCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16
  },
  timeRangeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  chartsSection: {
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  chartCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 200,
  },
  fullWidthChartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  bottomSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#008080",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabText: {
    color: "#ffffff",
  },
  tabContent: {
    padding: 16,
    minHeight: 200,
  },
  compactStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  compactStatItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    minWidth: "30%",
    alignItems: "center",
  },
  compactStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 4,
  },
  compactStatLabel: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  smallChartTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  miniChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  timeRangeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  activeTimeRange: {
    backgroundColor: "#008080",
  },
  activeTimeRangeText: {
    color: "#ffffff",
  },
  inactiveTimeRangeText: {
    color: "#64748b",
  },
  factorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  factorName: {
    fontSize: 13,
    color: "#334155",
    flex: 1,
  },
  factorValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#008080",
    minWidth: 50,
    textAlign: "right",
  },
  progressItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#008080",
    marginBottom: 6,
  },
  progressDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  progressDetailItem: {
    fontSize: 11,
    color: "#475569",
    width: "48%",
  },
  riskIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginBottom: 4,
  },
  riskName: {
    fontSize: 12,
    color: "#334155",
    flex: 1,
  },
  riskValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#008080",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  trendText: {
    fontSize: 11,
    marginLeft: 4,
  },
  positiveTrend: {
    color: "#10b981",
  },
  negativeTrend: {
    color: "#ef4444",
  },
  neutralTrend: {
    color: "#64748b",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    textAlign: "center",
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    fontStyle: "italic",
  },
  historyControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  controlButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  activeControlButton: {
    backgroundColor: "#008080",
  },
  controlButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  activeControlButtonText: {
    color: "#ffffff",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  tooltipModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tooltipContent: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    width: screenWidth - 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  tooltipText: {
    fontSize: 14,
    color: "#334155",
  },
  tooltipCloseButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#008080",
    borderRadius: 8,
    alignItems: "center",
  },
  tooltipCloseText: {
    color: "#ffffff",
    fontWeight: "500",
  },
});

const ProgressScreen = () => {
  const { t } = useContext(LanguageContext);
  const route = useRoute();
  const [timeRange, setTimeRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("factors");
  const [refreshKey, setRefreshKey] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const [latestUserProfile, setLatestUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const scrollY = new Animated.Value(0);

  const handleDeleteEntry = useCallback(
    async (item) => {
      try {
        const db = await getDb();
        const table =
          item.source === "UserProfile" ? "UserProfile" : "HealthRecords";
        await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [item.id]);
        console.log(
          `Deleted ${table} record with id ${item.id} and date ${item.date}`
        );
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error(
          `Error deleting ${table} entry with id ${item.id}:`,
          error
        );
        Alert.alert(
          t.error || "Error",
          t.deleteError || "Failed to delete entry"
        );
      }
    },
    [t]
  );

  const confirmDelete = useCallback(
    (item) => {
      Alert.alert(
        t.confirmDelete || "Confirm Delete",
        `${
          t.deleteConfirmation ||
          "Are you sure you want to delete this entry from"
        } (${item.date})?`,
        [
          { text: t.cancel || "Cancel", style: "cancel" },
          {
            text: t.delete || "Delete",
            style: "destructive",
            onPress: () => handleDeleteEntry(item),
          },
        ]
      );
    },
    [t, handleDeleteEntry]
  );

  const fallbackData = useMemo(
    () => [
      {
        date: formatDate("2025-08-03"),
        daily_steps: 9150,
        sleep_hours: 7.5,
        bmi: 22.1,
        age: 30,
        gender: "Male",
        height_cm: 175,
        weight_kg: 68,
        chronic_disease: "None",
        exercise_frequency: 4,
        alcohol_consumption: "No",
        smoking_habit: "No",
        diet_quality: "Good",
        fruits_veggies: 6,
        stress_level: 4,
        screen_time_hours: 3,
        salt_intake: "Moderate",
        source: "UserProfile",
      },
      {
        date: formatDate("2025-08-02"),
        daily_steps: 8234,
        sleep_hours: 7.2,
        bmi: 22.4,
        age: 30,
        gender: "Male",
        height_cm: 175,
        weight_kg: 69,
        chronic_disease: "None",
        exercise_frequency: 3,
        alcohol_consumption: "No",
        smoking_habit: "No",
        diet_quality: "Good",
        fruits_veggies: 5,
        stress_level: 5,
        screen_time_hours: 4,
        salt_intake: "Moderate",
        source: "UserProfile",
      },
      {
        date: formatDate("2025-08-01"),
        daily_steps: 7500,
        sleep_hours: 6.8,
        bmi: 22.4,
        age: 30,
        gender: "Male",
        height_cm: 175,
        weight_kg: 69,
        chronic_disease: "None",
        exercise_frequency: 3,
        alcohol_consumption: "No",
        smoking_habit: "No",
        diet_quality: "Good",
        fruits_veggies: 5,
        stress_level: 5,
        screen_time_hours: 4,
        salt_intake: "Moderate",
        source: "UserProfile",
      },
    ],
    []
  );

  const fetchProgressData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const db = await getDb();

      const navLifestyleData = route.params?.lifestyleData;
      const navPredictionData = route.params?.predictionData;

      const today = formatDate(new Date().toISOString().split("T")[0]);
      let currentDayData = null;

      if (navLifestyleData) {
        currentDayData = {
          date: today,
          daily_steps: Number(navLifestyleData.Daily_Steps) || 0,
          sleep_hours: Number(navLifestyleData.Sleep_Hours) || 0,
          bmi: Number(navLifestyleData.BMI) || null,
          age: Number(navLifestyleData.Age) || null,
          gender: navLifestyleData.Gender || "Unknown",
          height_cm: Number(navLifestyleData.Height_cm) || null,
          weight_kg: Number(navLifestyleData.Weight_kg) || null,
          chronic_disease: navLifestyleData.Chronic_Disease || "None",
          exercise_frequency: Number(navLifestyleData.Exercise_Frequency) || 0,
          alcohol_consumption: navLifestyleData.Alcohol_Consumption || "No",
          smoking_habit: navLifestyleData.Smoking_Habit || "No",
          diet_quality: navLifestyleData.Diet_Quality || "Average",
          fruits_veggies: Number(navLifestyleData.FRUITS_VEGGIES) || 0,
          stress_level: Number(navLifestyleData.Stress_Level) || 1,
          screen_time_hours: Number(navLifestyleData.Screen_Time_Hours) || 0,
          salt_intake: navLifestyleData.Salt_Intake || "Moderate",
          source: "UserProfile",
        };
      }

      const userProfileLatest = await db.getAllAsync(
        "SELECT * FROM UserProfile ORDER BY id DESC LIMIT 1"
      );

      let latestRecord = null;
      if (userProfileLatest.length > 0) {
        const item = userProfileLatest[0];
        latestRecord = {
          id: item.id,
          date: formatDate(item.date || new Date().toISOString().split("T")[0]),
          daily_steps: Number(item.Daily_Steps) || 0,
          sleep_hours: Number(item.Sleep_Hours) || 0,
          bmi: Number(item.BMI) || null,
          age: Number(item.Age) || null,
          gender: item.Gender || "Unknown",
          height_cm: Number(item.Height_cm) || null,
          weight_kg: Number(item.Weight_kg) || null,
          chronic_disease: item.Chronic_Disease || "None",
          exercise_frequency: Number(item.Exercise_Frequency) || 0,
          alcohol_consumption: item.Alcohol_Consumption || "No",
          smoking_habit: item.Smoking_Habit || "No",
          diet_quality: item.Diet_Quality || "Average",
          fruits_veggies: Number(item.FRUITS_VEGGIES) || 0,
          stress_level: Number(item.Stress_Level) || 1,
          screen_time_hours: Number(item.Screen_Time_Hours) || 0,
          salt_intake: item.Salt_Intake || "Moderate",
          source: "UserProfile",
        };
      } else if (currentDayData) {
        latestRecord = currentDayData;
      }

      setLatestUserProfile(latestRecord);

      const userProfileData = await db.getAllAsync(
        "SELECT * FROM UserProfile ORDER BY id DESC"
      );

      const transformedUserProfileData = userProfileData.map((item) => ({
        id: item.id,
        date: formatDate(item.date || new Date().toISOString().split("T")[0]),
        daily_steps: Number(item.Daily_Steps) || 0,
        sleep_hours: Number(item.Sleep_Hours) || 0,
        bmi: Number(item.BMI) || null,
        age: Number(item.Age) || null,
        gender: item.Gender || "Unknown",
        height_cm: Number(item.Height_cm) || null,
        weight_kg: Number(item.Weight_kg) || null,
        chronic_disease: item.Chronic_Disease || "None",
        exercise_frequency: Number(item.Exercise_Frequency) || 0,
        alcohol_consumption: item.Alcohol_Consumption || "No",
        smoking_habit: item.Smoking_Habit || "No",
        diet_quality: item.Diet_Quality || "Average",
        fruits_veggies: Number(item.FRUITS_VEGGIES) || 0,
        stress_level: Number(item.Stress_Level) || 1,
        screen_time_hours: Number(item.Screen_Time_Hours) || 0,
        salt_intake: item.Salt_Intake || "Moderate",
        source: "UserProfile",
      }));

      const healthRecordsData = await db.getAllAsync(
        "SELECT * FROM HealthRecords ORDER BY id DESC"
      );

      const transformedHealthRecordsData = healthRecordsData.map((item) => ({
        id: item.id,
        date: formatDate(item.date || new Date().toISOString().split("T")[0]),
        daily_steps: Number(item.daily_steps) || 0,
        sleep_hours: Number(item.sleep_hours) || 0,
        bmi: Number(item.bmi) || null,
        age: Number(item.age) || null,
        gender: item.gender || "Unknown",
        height_cm: Number(item.height_cm) || null,
        weight_kg: Number(item.weight_kg) || null,
        chronic_disease: item.chronic_disease || "None",
        exercise_frequency: Number(item.exercise_frequency) || 0,
        alcohol_consumption: item.alcohol_consumption || "No",
        smoking_habit: item.smoking_habit || "No",
        diet_quality: item.diet_quality || "Average",
        fruits_veggies: Number(item.fruits_veggies) || 0,
        stress_level: Number(item.stress_level) || 1,
        screen_time_hours: Number(item.screen_time_hours) || 0,
        salt_intake: item.salt_intake || "Moderate",
        source: "HealthRecords",
      }));

      let allData = [
        ...fallbackData,
        ...transformedUserProfileData,
        ...transformedHealthRecordsData,
      ];

      const uniqueData = [];
      const seenDates = new Set();

      if (currentDayData) {
        const existingIndex = allData.findIndex(
          (existing) =>
            existing.date === currentDayData.date &&
            existing.source === "UserProfile"
        );
        if (existingIndex >= 0) {
          allData[existingIndex] = currentDayData;
        } else {
          allData.push(currentDayData);
        }
      }

      allData
        .sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateB - dateA;
        })
        .forEach((item) => {
          const key = `${item.date}-${item.source}`;
          if (!seenDates.has(key)) {
            seenDates.add(key);
            uniqueData.push(item);
          }
        });

      setProgressData(
        uniqueData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateA - dateB;
        })
      );
    } catch (error) {
      console.error("Error fetching progress data:", error);
      setError("Failed to load data from database");
      setProgressData(fallbackData);
      setLatestUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackData, route.params]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData, refreshKey, route.params]);

  useEffect(() => {
    if (route.params?.lifestyleData) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [route.params]);

  const calculateDiseaseRisks = useCallback((data) => {
    if (!data) return { obesity: 1, hypertension: 1, stroke: 1 };

    const risks = { obesity: 1, hypertension: 1, stroke: 1 };

    let obesityScore = 0;
    if (data.bmi >= 30) obesityScore += 50;
    else if (data.bmi >= 25) obesityScore += 30;
    else if (data.bmi < 18.5) obesityScore += 10;

    if (data.fruits_veggies < 3) obesityScore += 20;
    else if (data.fruits_veggies < 5) obesityScore += 10;

    if (data.exercise_frequency < 1) obesityScore += 20;
    else if (data.exercise_frequency < 3) obesityScore += 10;

    if (data.diet_quality === "Poor") obesityScore += 20;
    else if (data.diet_quality === "Average") obesityScore += 10;

    risks.obesity = Math.max(1, Math.min(100, Math.round(obesityScore)));

    let hypertensionScore = 0;
    if (data.bmi >= 30) hypertensionScore += 30;
    else if (data.bmi >= 25) hypertensionScore += 15;

    if (data.daily_steps < 5000) hypertensionScore += 20;
    else if (data.daily_steps < 7000) hypertensionScore += 10;

    if (data.salt_intake?.toUpperCase() === "HIGH") hypertensionScore += 20;
    else if (data.salt_intake?.toUpperCase() === "MODERATE")
      hypertensionScore += 10;

    if (data.alcohol_consumption === "Yes") hypertensionScore += 15;

    if (data.stress_level > 7) hypertensionScore += 20;
    else if (data.stress_level > 3) hypertensionScore += 10;

    risks.hypertension = Math.max(
      1,
      Math.min(100, Math.round(hypertensionScore))
    );

    let strokeScore = 0;
    if (data.bmi >= 30) strokeScore += 25;
    else if (data.bmi >= 25) strokeScore += 15;

    if (data.smoking_habit === "Yes") strokeScore += 25;
    if (data.alcohol_consumption === "Yes") strokeScore += 15;

    if (data.chronic_disease === "Hypertension") strokeScore += 25;
    else if (data.chronic_disease !== "None") strokeScore += 10;

    if (data.stress_level > 7) strokeScore += 20;
    else if (data.stress_level > 3) strokeScore += 10;

    risks.stroke = Math.max(1, Math.min(100, Math.round(strokeScore)));

    return risks;
  }, []);

  const calculateLifestyleScore = useCallback((data) => {
    if (!data) return 0;

    let score = 0;

    if (data.bmi >= 18.5 && data.bmi < 25) score += 15;
    else if (data.bmi < 18.5 || data.bmi < 30) score += 8;
    else score += 3;

    if (data.daily_steps >= 10000) score += 10;
    else if (data.daily_steps >= 7000) score += 7;
    else if (data.daily_steps >= 5000) score += 4;
    else score += 1;

    if (data.exercise_frequency >= 5) score += 15;
    else if (data.exercise_frequency >= 3) score += 10;
    else if (data.exercise_frequency >= 1) score += 5;
    else score += 1;

    if (data.sleep_hours >= 7 && data.sleep_hours <= 9) score += 15;
    else if (data.sleep_hours === 6 || data.sleep_hours === 10) score += 10;
    else score += 5;

    if (data.fruits_veggies >= 5) score += 10;
    else if (data.fruits_veggies >= 3) score += 7;
    else if (data.fruits_veggies >= 1) score += 3;
    else score += 0;

    const isNonSmoker = data.smoking_habit === "No";
    const isLowAlcohol = data.alcohol_consumption === "No";
    if (isNonSmoker && isLowAlcohol) score += 10;
    else if (isNonSmoker || isLowAlcohol) score += 5;
    else score += 0;

    if (data.screen_time_hours < 2) score += 5;
    else if (data.screen_time_hours <= 4) score += 3;
    else if (data.screen_time_hours <= 6) score += 1;
    else score += 0;

    if (data.diet_quality === "Excellent") score += 10;
    else if (data.diet_quality === "Good") score += 7;
    else if (data.diet_quality === "Average") score += 4;
    else score += 1;

    if (data.stress_level <= 3) score += 5;
    else if (data.stress_level <= 6) score += 3;
    else score += 1;

    if (data.chronic_disease === "None") score += 5;
    else score += 0;

    return Math.min(Math.round(score), 100);
  }, []);

  const filteredData = useMemo(() => {
    const today = new Date();
    const daysAgo = timeRange === "7days" ? 7 : 30;
    const cutoffDate = formatDate(
      new Date(today.setDate(today.getDate() - daysAgo))
    );
    return progressData
      .filter((item) => {
        const itemDate = new Date(item.date.split("/").reverse().join("-"));
        const cutoff = new Date(cutoffDate.split("/").reverse().join("-"));
        return itemDate >= cutoff;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return dateA - dateB;
      });
  }, [progressData, timeRange]);

  const lifestyleScores = useMemo(
    () => filteredData.map((item) => calculateLifestyleScore(item)),
    [filteredData, calculateLifestyleScore]
  );

  const stepsData = useMemo(
    () => filteredData.map((item) => item.daily_steps || 0),
    [filteredData]
  );

  const sleepData = useMemo(
    () => filteredData.map((item) => item.sleep_hours || 0),
    [filteredData]
  );

  const riskData = useMemo(
    () => filteredData.map((item) => calculateDiseaseRisks(item)),
    [filteredData, calculateDiseaseRisks]
  );

  const shapRankings = useMemo(
    () => [
      { factor: t.steps || "Steps", value: 0.25 },
      { factor: t.bmi || "BMI", value: 0.2 },
      { factor: t.exerciseFrequency || "Exercise Frequency", value: 0.2 },
      { factor: t.sleep || "Sleep", value: 0.15 },
      { factor: t.dietQuality || "Diet Quality", value: 0.1 },
      { factor: t.fruitsVeggies || "Fruits & Veggies", value: 0.1 },
    ],
    [
      t.steps,
      t.bmi,
      t.exerciseFrequency,
      t.sleep,
      t.dietQuality,
      t.fruitsVeggies,
    ]
  );

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#008080",
    },
  };

  const summaryStats = useMemo(() => {
    if (!latestUserProfile) return null;

    const latestData = latestUserProfile;
    const userProfileData = filteredData.filter(
      (item) => item.source === "UserProfile"
    );
    const previousData =
      userProfileData.length > 1
        ? userProfileData[userProfileData.length - 2]
        : null;

    const latestScore = calculateLifestyleScore(latestData);
    const previousScore = previousData
      ? calculateLifestyleScore(previousData)
      : latestScore;
    const scoreChange = latestScore - previousScore;

    const latestRisks = calculateDiseaseRisks(latestData);
    let riskChange = "stable";

    if (previousData) {
      const previousRisks = calculateDiseaseRisks(previousData);
      const avgPreviousRisk =
        (previousRisks.obesity +
          previousRisks.hypertension +
          previousRisks.stroke) /
        3;
      const avgLatestRisk =
        (latestRisks.obesity + latestRisks.hypertension + latestRisks.stroke) /
        3;

      riskChange =
        avgLatestRisk < avgPreviousRisk
          ? "improved"
          : avgLatestRisk > avgPreviousRisk
          ? "worsened"
          : "stable";
    }

    return {
      score: latestScore,
      scoreChange,
      steps: latestData.daily_steps || 0,
      sleep: latestData.sleep_hours || 0,
      bmi: latestData.bmi || null,
      weight: latestData.weight_kg || null,
      height: latestData.height_cm || null,
      riskLevel:
        (latestRisks.obesity + latestRisks.hypertension + latestRisks.stroke) /
        3,
      riskChange,
      latestRisks,
    };
  }, [
    latestUserProfile,
    filteredData,
    calculateLifestyleScore,
    calculateDiseaseRisks,
  ]);

  const data = useMemo(
    () => [
      { type: "quickStats" },
      { type: "timeRange" },
      { type: "lifestyleChart" },
      { type: "stepsSleepCharts" },
      { type: "tabs" },
    ],
    []
  );

  const handleChartSelect = useCallback(
    (dataPoint, index) => {
      if (index >= 0 && index < filteredData.length) {
        const selectedItem = filteredData[index];
        setSelectedDataPoint({
          chartType: "lifestyle",
          date: selectedItem.date,
          value: dataPoint.value,
          details: selectedItem,
        });
      }
    },
    [filteredData]
  );

  const renderQuickStats = useCallback(
    () => (
      <View style={styles.topSection}>
        <View style={styles.quickStatsCard}>
          <Text style={styles.smallChartTitle}>
            {t.quickStats || "Quick Stats"}
          </Text>
          {isLoading ? (
            <Text style={styles.loadingText}>{t.loading || "Loading..."}</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : summaryStats ? (
            <View style={styles.compactStatsGrid}>
              <View style={styles.compactStatItem}>
                <Text style={styles.compactStatValue}>
                  {summaryStats.score}
                </Text>
                <Text style={styles.compactStatLabel}>
                  {t.lifestyleScore || "Lifestyle Score"}
                </Text>
              </View>
              <View style={styles.compactStatItem}>
                <Text style={styles.compactStatValue}>
                  {Math.round(summaryStats.steps).toLocaleString()}
                </Text>
                <Text style={styles.compactStatLabel}>
                  {t.steps || "Steps"}
                </Text>
              </View>
              <View style={styles.compactStatItem}>
                <Text style={styles.compactStatValue}>
                  {summaryStats.sleep}
                </Text>
                <Text style={styles.compactStatLabel}>
                  {t.sleep || "Sleep"}
                </Text>
              </View>
              <View style={styles.compactStatItem}>
                <Text style={styles.compactStatValue}>
                  {summaryStats.bmi || t.unknown || "N/A"}
                </Text>
                <Text style={styles.compactStatLabel}>{t.bmi || "BMI"}</Text>
              </View>
              <View style={styles.compactStatItem}>
                <Text style={styles.compactStatValue}>
                  {summaryStats.weight || t.unknown || "N/A"}
                  {summaryStats.weight ? t.kgAbbreviation || "kg" : ""}
                </Text>
                <Text style={styles.compactStatLabel}>
                  {t.weight || "Weight"}
                </Text>
              </View>
              <View style={styles.compactStatItem}>
                <Text style={styles.compactStatValue}>
                  {Math.round(summaryStats.riskLevel)}
                  {t.percentSymbol || "%"}
                </Text>
                <Text style={styles.compactStatLabel}>
                  {t.avgRisk || "Avg Risk"}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.compactStatLabel}>
              {t.noStatsAvailable || "No stats available"}
            </Text>
          )}
        </View>
      </View>
    ),
    [isLoading, error, summaryStats, t]
  );

  const renderTimeRange = useCallback(
    () => (
      <View style={styles.timeRangeCard}>
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === "7days" && styles.activeTimeRange,
            ]}
            onPress={() => setTimeRange("7days")}
            accessibilityLabel={t.sevenDays || "7 Days"}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === "7days"
                  ? styles.activeTimeRangeText
                  : styles.inactiveTimeRangeText,
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
            accessibilityLabel={t.thirtyDays || "30 Days"}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === "30days"
                  ? styles.activeTimeRangeText
                  : styles.inactiveTimeRangeText,
              ]}
            >
              {t.thirtyDays || "30 Days"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [timeRange, t]
  );

  const renderLifestyleChart = useCallback(
    () => (
      <View style={styles.fullWidthChartCard}>
        <Text style={styles.chartTitle}>
          {t.lifestyleScoreTrend || "Lifestyle Score Trend"}
        </Text>
        {lifestyleScores.length > 0 ? (
          <LineChart
            data={{
              labels: filteredData.map((item) => item.date.slice(0, 5)),
              datasets: [
                {
                  data: lifestyleScores,
                  color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 64}
            height={180}
            chartConfig={chartConfig}
            bezier
            onDataPointClick={handleChartSelect}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.compactStatLabel}>
            {t.noDataAvailable || "No data available"}
          </Text>
        )}
      </View>
    ),
    [lifestyleScores, filteredData, chartConfig, t, handleChartSelect]
  );

  const renderStepsSleepCharts = useCallback(
    () => (
      <View style={styles.chartsSection}>
        <View style={styles.chartRow}>
          <View style={styles.chartCard}>
            <Text style={styles.smallChartTitle}>
              {t.stepsChart || "Daily Steps"}
            </Text>
            <View style={styles.miniChartContainer}>
              {stepsData.length > 0 ? (
                <LineChart
                  data={{
                    labels: filteredData.map((item) => item.date.slice(0, 5)),
                    datasets: [
                      {
                        data: stepsData,
                        color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth / 2 - 40}
                  height={120}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              ) : (
                <Text style={styles.compactStatLabel}>
                  {t.noData || "No data"}
                </Text>
              )}
              {summaryStats && (
                <View style={styles.trendContainer}>
                  <Text style={[styles.trendText, styles.neutralTrend]}>
                    {t.latest || "Latest"}:{" "}
                    {summaryStats.steps.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.chartCard}>
            <Text style={styles.smallChartTitle}>
              {t.sleepChart || "Sleep Hours"}
            </Text>
            <View style={styles.miniChartContainer}>
              {sleepData.length > 0 ? (
                <LineChart
                  data={{
                    labels: filteredData.map((item) => item.date.slice(0, 5)),
                    datasets: [
                      {
                        data: sleepData,
                        color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth / 2 - 40}
                  height={120}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              ) : (
                <Text style={styles.compactStatLabel}>
                  {t.noData || "No data"}
                </Text>
              )}
              {summaryStats && (
                <View style={styles.trendContainer}>
                  <Text style={[styles.trendText, styles.neutralTrend]}>
                    {t.latest || "Latest"}: {summaryStats.sleep}h
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    ),
    [
      stepsData,
      sleepData,
      filteredData,
      chartConfig,
      summaryStats,
      t,
    ]
  );

  const renderTooltip = useCallback(() => {
    if (!selectedDataPoint) return null;

    const { chartType, date, value, details } = selectedDataPoint;
    let title = "";
    let valueText = "";

    if (chartType === "lifestyle") {
      title = t.lifestyleScore || "Lifestyle Score";
      valueText = `${Math.round(value)}`;
    } else if (chartType === "steps") {
      title = t.steps || "Steps";
      valueText = `${Math.round(value).toLocaleString()}`;
    } else if (chartType === "sleep") {
      title = t.sleep || "Sleep";
      valueText = `${value.toFixed(1)}h`;
    }

    return (
      <Modal
        transparent={true}
        visible={!!selectedDataPoint}
        animationType="fade"
        onRequestClose={() => setSelectedDataPoint(null)}
      >
        <View style={styles.tooltipModal}>
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipTitle}>
              {title} - {date}
            </Text>
            <Text style={styles.tooltipText}>
              {t.value || "Value"}: {valueText}
            </Text>
            <Text style={styles.tooltipText}>
              {t.bmi || "BMI"}: {details.bmi || "N/A"}
            </Text>
            <Text style={styles.tooltipText}>
              {t.exercise || "Exercise"}: {details.exercise_frequency || 0}/
              {t.perWeek || "week"}
            </Text>
            <Text style={styles.tooltipText}>
              {t.dietQuality || "Diet"}: {details.diet_quality || "N/A"}
            </Text>
            <TouchableOpacity
              style={styles.tooltipCloseButton}
              onPress={() => setSelectedDataPoint(null)}
            >
              <Text style={styles.tooltipCloseText}>{t.close || "Close"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }, [selectedDataPoint, t]);

  const renderTabs = useCallback(() => {
    const filteredHistoryData = filteredData
      .filter((item) => {
        if (sourceFilter === "all") return true;
        return item.source === sourceFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

    return (
      <View style={styles.bottomSection}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "factors" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("factors")}
            accessibilityLabel={t.factors || "Factors"}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "factors" && styles.activeTabText,
              ]}
            >
              {t.factors || "Factors"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "risks" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("risks")}
            accessibilityLabel={t.risks || "Risks"}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "risks" && styles.activeTabText,
              ]}
            >
              {t.risks || "Risks"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "history" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("history")}
            accessibilityLabel={t.history || "History"}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.activeTabText,
              ]}
            >
              {t.history || "History"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContent}>
          {activeTab === "factors" && (
            <View>
              {shapRankings.map((item, index) => (
                <View key={index} style={styles.factorItem}>
                  <Text style={styles.factorName}>{item.factor}</Text>
                  <Text style={styles.factorValue}>
                    {(item.value * 100).toFixed(0)}%
                  </Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === "risks" && (
            <View>
              {summaryStats ? (
                <>
                  <View style={styles.riskIndicator}>
                    <Text style={styles.riskName}>
                      {t.obesityRisk || "Obesity Risk"}
                    </Text>
                    <Text style={styles.riskValue}>
                      {summaryStats.latestRisks.obesity}%
                    </Text>
                  </View>
                  <View style={styles.riskIndicator}>
                    <Text style={styles.riskName}>
                      {t.hypertensionRisk || "Hypertension Risk"}
                    </Text>
                    <Text style={styles.riskValue}>
                      {summaryStats.latestRisks.hypertension}%
                    </Text>
                  </View>
                  <View style={styles.riskIndicator}>
                    <Text style={styles.riskName}>
                      {t.strokeRisk || "Stroke Risk"}
                    </Text>
                    <Text style={styles.riskValue}>
                      {summaryStats.latestRisks.stroke}%
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.riskName}>
                  {t.noDataAvailable || "No data available"}
                </Text>
              )}
            </View>
          )}
          {activeTab === "history" && (
            <View>
              <View style={styles.historyControls}>
                <View style={styles.timeRangeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      sortOrder === "asc" && styles.activeControlButton,
                    ]}
                    onPress={() => setSortOrder("asc")}
                    accessibilityLabel={t.sortAsc || "Sort Ascending"}
                  >
                    <Text
                      style={[
                        styles.controlButtonText,
                        sortOrder === "asc" && styles.activeControlButtonText,
                      ]}
                    >
                      {t.sortAsc || "Sort Asc"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      sortOrder === "desc" && styles.activeControlButton,
                    ]}
                    onPress={() => setSortOrder("desc")}
                    accessibilityLabel={t.sortDesc || "Sort Descending"}
                  >
                    <Text
                      style={[
                        styles.controlButtonText,
                        sortOrder === "desc" && styles.activeControlButtonText,
                      ]}
                    >
                      {t.sortDesc || "Sort Desc"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeRangeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      sourceFilter === "all" && styles.activeControlButton,
                    ]}
                    onPress={() => setSourceFilter("all")}
                    accessibilityLabel={t.allSources || "All Sources"}
                  >
                    <Text
                      style={[
                        styles.controlButtonText,
                        sourceFilter === "all" &&
                          styles.activeControlButtonText,
                      ]}
                    >
                      {t.allSources || "All"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {filteredHistoryData.length > 0 ? (
                filteredHistoryData.map((item, index) => (
                  <View
                    key={`${item.date}-${item.source}-${index}`}
                    style={styles.progressItem}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.progressDate}>{item.date}</Text>
                      <View style={styles.progressDetails}>
                        <Text style={styles.progressDetailItem}>
                          {t.steps || "Steps"}:{" "}
                          {item.daily_steps?.toLocaleString() || 0}
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          {t.sleep || "Sleep"}: {item.sleep_hours || 0} {t.hrs}
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          BMI: {item.bmi || "N/A"}
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          {t.kgAbbreviation || "Weight"}:{" "}
                          {item.weight_kg || "N/A"} {t.kgAbbreviation}
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          {t.exercise || "Exercise"}:{" "}
                          {item.exercise_frequency || 0}/{t.perWeek || "week"}
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          {t.stress || "Stress"}: {item.stress_level || 0}/10
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          {t.dietQuality || "Diet"}:{" "}
                          {item.diet_quality || "N/A"}
                        </Text>
                        <Text style={styles.progressDetailItem}>
                          {t.screenTime || "Screen"}:{" "}
                          {item.screen_time_hours || 0} {t.hrs}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => confirmDelete(item)}
                      accessibilityLabel={t.deleteEntry || "Delete Entry"}
                    >
                      <Text style={styles.deleteButtonText}>
                        {t.delete || "Delete"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.riskName}>
                  {t.noHistoryDataAvailable || "No history data available"}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }, [
    activeTab,
    shapRankings,
    summaryStats,
    filteredData,
    t,
    sortOrder,
    sourceFilter,
    confirmDelete,
  ]);

  const renderItem = useCallback(
    ({ item }) => {
      switch (item.type) {
        case "quickStats":
          return renderQuickStats();
        case "timeRange":
          return renderTimeRange();
        case "lifestyleChart":
          return renderLifestyleChart();
        case "stepsSleepCharts":
          return renderStepsSleepCharts();
        case "tabs":
          return renderTabs();
        default:
          return null;
      }
    },
    [
      renderQuickStats,
      renderTimeRange,
      renderLifestyleChart,
      renderStepsSleepCharts,
      renderTabs,
    ]
  );

  const fadeAnim = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const slideAnim = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.headerTitle}>
          {t.progressTitle || "Your Health Progress"}
        </Text>
        <Animated.Text
          style={[
            styles.headerSubtitle,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {t.progressTagline || "Track and improve your wellbeing"}
        </Animated.Text>
      </Animated.View>
      <AnimatedFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={5}
        initialNumToRender={3}
        getItemLayout={(data, index) => ({
          length:
            index === 0
              ? 120
              : index === 1
              ? 60
              : index === 2
              ? 240
              : index === 3
              ? 220
              : 300,
          offset:
            index === 0
              ? 0
              : index === 1
              ? 120
              : index === 2
              ? 180
              : index === 3
              ? 420
              : 640,
          index,
        })}
      />
      {renderTooltip()}
    </SafeAreaView>
  );
};

export default ProgressScreen;