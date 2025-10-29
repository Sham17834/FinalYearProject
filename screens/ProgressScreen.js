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
import { useRoute } from "@react-navigation/native";
import { getDb } from "./db";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const API_BASE_URL = "https://finalyearproject-c5hy.onrender.com";

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
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#008080",
    width: "100%",
    paddingTop: 30,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "absolute",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  headerSubtitle: { fontSize: 14, color: "#e0f2f1", textAlign: "center" },
  mainContent: { padding: 16, paddingTop: 100 },
  topSection: { flexDirection: "row", gap: 12 },
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
    marginBottom: 16,
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
  chartsSection: { marginBottom: 16 },
  chartRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
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
  activeTab: { backgroundColor: "#008080" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#64748b" },
  activeTabText: { color: "#ffffff" },
  tabContent: { padding: 16, minHeight: 200 },
  compactStatsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
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
  compactStatLabel: { fontSize: 8, color: "#64748b", textAlign: "center" },
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
    marginRight: 16,
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
  timeRangeText: { fontSize: 13, fontWeight: "500" },
  activeTimeRange: { backgroundColor: "#008080" },
  activeTimeRangeText: { color: "#ffffff" },
  inactiveTimeRangeText: { color: "#64748b" },
  factorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  factorName: { fontSize: 13, color: "#334155", flex: 1 },
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
  progressDetails: { flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 },
  progressDetailItem: { fontSize: 11, color: "#475569", width: "48%" },
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
  riskName: { fontSize: 12, color: "#334155", flex: 1 },
  riskValue: { fontSize: 12, fontWeight: "600", color: "#008080" },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  trendText: { fontSize: 11, marginLeft: 4 },
  positiveTrend: { color: "#10b981" },
  negativeTrend: { color: "#ef4444" },
  neutralTrend: { color: "#64748b" },
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
  activeControlButton: { backgroundColor: "#008080" },
  controlButtonText: { fontSize: 13, fontWeight: "500", color: "#64748b" },
  activeControlButtonText: { color: "#ffffff" },
  deleteButton: { padding: 8, backgroundColor: "#ef4444", borderRadius: 8 },
  deleteButtonText: { fontSize: 12, color: "#ffffff", fontWeight: "500" },
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
  tooltipText: { fontSize: 14, color: "#334155" },
  tooltipCloseButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#008080",
    borderRadius: 8,
    alignItems: "center",
  },
  tooltipCloseText: { color: "#ffffff", fontWeight: "500" },
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
  const [predictionResult, setPredictionResult] = useState(null);
  const [shapLoading, setShapLoading] = useState(false);

  const handleDeleteEntry = useCallback(
    async (item) => {
      try {
        const db = await getDb();
        const table =
          item.source === "UserProfile" ? "UserProfile" : "HealthRecords";
        await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [item.id]);
        setRefreshKey((prev) => prev + 1);
      } catch (e) {
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
        `${t.deleteConfirmation || "Delete entry from"} (${item.date})?`,
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

  const fetchProgressData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const db = await getDb();

      const navLifestyleData = route.params?.lifestyleData;
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
        ...transformedUserProfileData,
        ...transformedHealthRecordsData,
      ];
      if (currentDayData) allData.push(currentDayData);

      setProgressData(
        allData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateA - dateB;
        })
      );
    } catch (e) {
      setError("Failed to load data from database");
      setLatestUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [route.params]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData, refreshKey, route.params]);

  useEffect(() => {
    if (route.params?.lifestyleData) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [route.params]);

  useEffect(() => {
    if (!latestUserProfile) return;

    const runPrediction = async () => {
      setShapLoading(true);
      try {
        const payload = {
          Age: latestUserProfile.age ?? 30,
          Gender: latestUserProfile.gender ?? "Unknown",
          Height_cm: latestUserProfile.height_cm ?? 170,
          Weight_kg: latestUserProfile.weight_kg ?? 70,
          BMI: latestUserProfile.bmi ?? 24,
          Daily_Steps: latestUserProfile.daily_steps ?? 0,
          Exercise_Frequency: latestUserProfile.exercise_frequency ?? 0,
          Sleep_Hours: latestUserProfile.sleep_hours ?? 0,
          Alcohol_Consumption: latestUserProfile.alcohol_consumption ?? "No",
          Smoking_Habit: latestUserProfile.smoking_habit ?? "No",
          Diet_Quality: latestUserProfile.diet_quality ?? "Average",
          Stress_Level: latestUserProfile.stress_level ?? 5,
          FRUITS_VEGGIES: latestUserProfile.fruits_veggies ?? 0,
          Screen_Time_Hours: latestUserProfile.screen_time_hours ?? 0,
        };

        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        setPredictionResult(result);
      } catch (err) {
        console.warn("SHAP prediction failed:", err);
        setPredictionResult(null);
      } finally {
        setShapLoading(false);
      }
    };

    runPrediction();
  }, [latestUserProfile]);

  /* -------------------------- CALCULATIONS -------------------------- */
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
    let total = 0;

    const bmiScore = (() => {
      const b = data.bmi || 0;
      if (b >= 18.5 && b < 25) return 15;
      if (b >= 17 && b < 18.5) return 12;
      if (b >= 25 && b < 27) return 12;
      if (b >= 16 && b < 17) return 8;
      if (b >= 27 && b < 30) return 8;
      if (b >= 15 && b < 16) return 4;
      if (b >= 30 && b < 35) return 4;
      return 0;
    })();

    const stepsScore = (() => {
      const s = data.daily_steps || 0;
      if (s >= 10000) return 15;
      if (s >= 8000) return 12;
      if (s >= 6000) return 9;
      if (s >= 4000) return 6;
      if (s >= 2000) return 3;
      return 0;
    })();

    const sleepScore = (() => {
      const h = data.sleep_hours || 0;
      if (h >= 7 && h <= 9) return 15;
      if (h >= 6 && h < 7) return 12;
      if (h > 9 && h <= 10) return 12;
      if (h >= 5 && h < 6) return 8;
      if (h > 10 && h <= 11) return 8;
      if (h >= 4 && h < 5) return 4;
      if (h > 11) return 4;
      return 0;
    })();

    const exerciseScore = (() => {
      const f = data.exercise_frequency || 0;
      if (f >= 5) return 15;
      if (f >= 3) return 12;
      if (f >= 2) return 8;
      if (f >= 1) return 4;
      return 0;
    })();

    const dietScore = (() => {
      const q = data.diet_quality?.toLowerCase() || "poor";
      switch (q) {
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

    const fruitsScore = (() => {
      const s = data.fruits_veggies || 0;
      if (s >= 5) return 10;
      if (s >= 4) return 8;
      if (s >= 3) return 6;
      if (s >= 2) return 4;
      if (s >= 1) return 2;
      return 0;
    })();

    const stressScore = (() => {
      const s = data.stress_level || 5;
      if (s <= 2) return 10;
      if (s <= 4) return 8;
      if (s <= 6) return 6;
      if (s <= 8) return 3;
      return 0;
    })();

    const screenScore = (() => {
      const h = data.screen_time_hours || 0;
      if (h <= 2) return 5;
      if (h <= 4) return 4;
      if (h <= 6) return 3;
      if (h <= 8) return 2;
      if (h <= 10) return 1;
      return 0;
    })();

    const smokingPenalty =
      data.smoking_habit?.toLowerCase() === "yes" ||
      data.smoking_habit?.toLowerCase() === "daily" ||
      data.smoking_habit?.toLowerCase() === "heavy"
        ? -10
        : data.smoking_habit?.toLowerCase() === "occasionally" ||
            data.smoking_habit?.toLowerCase() === "social"
          ? -5
          : 0;

    const alcoholPenalty =
      data.alcohol_consumption?.toLowerCase() === "heavy" ||
      data.alcohol_consumption?.toLowerCase() === "daily"
        ? -5
        : data.alcohol_consumption?.toLowerCase() === "frequently"
          ? -2
          : 0;

    total =
      bmiScore +
      stepsScore +
      sleepScore +
      exerciseScore +
      dietScore +
      fruitsScore +
      stressScore +
      screenScore +
      smokingPenalty +
      alcoholPenalty;

    return Math.max(0, Math.min(100, total));
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

  const featureToLabel = (feat, t) => {
    const map = {
      Daily_Steps: t.steps || "Steps",
      BMI: t.bmi || "BMI",
      Exercise_Frequency: t.exerciseFrequency || "Exercise Frequency",
      Sleep_Hours: t.sleep || "Sleep",
      Diet_Quality: t.dietQuality?.label || "Diet Quality",
      FRUITS_VEGGIES: t.fruitsVeggies || "Fruits & Veggies",
      Stress_Level: t.stress || "Stress",
      Screen_Time_Hours: t.screenTime || "Screen Time",
      Age: t.age || "Age",
      Alcohol_Consumption: t.alcohol || "Alcohol",
      Smoking_Habit: t.smoking || "Smoking",
      Height_cm: t.height || "Height",
      Weight_kg: t.weight || "Weight",
    };
    return map[feat] ?? feat;
  };

  const shapRankings = useMemo(() => {
    if (!predictionResult?.predictions) return [];

    const map = new Map();

    Object.values(predictionResult.predictions).forEach((disease) => {
      (disease.top_features ?? []).forEach((f) => {
        const name = f.feature;
        const abs = Math.abs(f.shap_value);
        map.set(name, (map.get(name) ?? 0) + abs);
      });
    });

    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
    return Array.from(map.entries())
      .map(([feature, weight]) => ({
        factor: featureToLabel(feature, t),
        value: weight / total,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [predictionResult, t]);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#008080" },
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
      const prevRisks = calculateDiseaseRisks(previousData);
      const avgPrev =
        (prevRisks.obesity + prevRisks.hypertension + prevRisks.stroke) / 3;
      const avgNow =
        (latestRisks.obesity + latestRisks.hypertension + latestRisks.stroke) /
        3;
      riskChange =
        avgNow < avgPrev
          ? "improved"
          : avgNow > avgPrev
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

  const filteredHistoryData = useMemo(() => {
    return filteredData
      .filter((item) => sourceFilter === "all" || item.source === sourceFilter)
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [filteredData, sourceFilter, sortOrder]);

  const FactorsTab = React.memo(({ shapRankings, t, loading }) => (
    <View>
      {loading ? (
        <Text style={styles.loadingText}>{t.loading || "Loading SHAP…"}</Text>
      ) : shapRankings.length === 0 ? (
        <Text style={styles.riskName}>
          {t.noShapData || "SHAP data unavailable"}
        </Text>
      ) : (
        shapRankings.map((item, i) => (
          <View key={i} style={styles.factorItem}>
            <Text style={styles.factorName}>{item.factor}</Text>
            <Text style={styles.factorValue}>
              {(item.value * 100).toFixed(0)}%
            </Text>
          </View>
        ))
      )}
    </View>
  ));

  const RisksTab = React.memo(({ summaryStats, t }) => {
    if (!summaryStats) {
      return (
        <Text style={styles.riskName}>{t.noDataAvailable || "No data"}</Text>
      );
    }
    return (
      <>
        <View style={styles.riskIndicator}>
          <Text style={styles.riskName}>{t.obesityRisk || "Obesity Risk"}</Text>
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
          <Text style={styles.riskName}>{t.strokeRisk || "Stroke Risk"}</Text>
          <Text style={styles.riskValue}>
            {summaryStats.latestRisks.stroke}%
          </Text>
        </View>
      </>
    );
  });

  const HistoryItem = React.memo(({ item, t, onDelete }) => (
    <View style={styles.progressItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.progressDate}>{item.date}</Text>
        <View style={styles.progressDetails}>
          <Text style={styles.progressDetailItem}>
            {t.steps || "Steps"}: {item.daily_steps?.toLocaleString() || 0}
          </Text>
          <Text style={styles.progressDetailItem}>
            {t.sleep || "Sleep"}: {item.sleep_hours || 0} {t.hrs}
          </Text>
          <Text style={styles.progressDetailItem}>
            BMI: {item.bmi || "N/A"}
          </Text>
          <Text style={styles.progressDetailItem}>
            {t.kgAbbreviation || "Weight"}: {item.weight_kg || "N/A"}{" "}
            {t.kgAbbreviation}
          </Text>
          <Text style={styles.progressDetailItem}>
            {t.exercise || "Exercise"}: {item.exercise_frequency || 0}/
            {t.perWeek || "week"}
          </Text>
          <Text style={styles.progressDetailItem}>
            {t.stress || "Stress"}: {item.stress_level || 0}/10
          </Text>
          <Text style={styles.progressDetailItem}>
            {t.dietQuality?.label || "Diet"}:{" "}
            {item.diet_quality
              ? t.dietQuality?.[item.diet_quality.toLowerCase()] ||
                item.diet_quality
              : t.dietQuality?.unknown || "N/A"}
          </Text>
          <Text style={styles.progressDetailItem}>
            {t.screenTime || "Screen"}: {item.screen_time_hours || 0} {t.hrs}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item)}
        accessibilityLabel={t.deleteEntry || "Delete Entry"}
      >
        <Text style={styles.deleteButtonText}>{t.delete || "Delete"}</Text>
      </TouchableOpacity>
    </View>
  ));

  const HistoryTab = React.memo(({ filteredHistoryData, t, onDelete }) => {
    if (filteredHistoryData.length === 0) {
      return (
        <Text style={styles.riskName}>
          {t.noHistoryDataAvailable || "No history"}
        </Text>
      );
    }
    return (
      <>
        {filteredHistoryData.map((item, i) => (
          <HistoryItem
            key={`${item.id || item.date}-${item.source}-${i}`}
            item={item}
            t={t}
            onDelete={onDelete}
          />
        ))}
      </>
    );
  });

  const renderTabs = useCallback(() => {
    return (
      <View style={styles.bottomSection}>
        <View style={styles.tabContainer}>
          {["factors", "risks", "history"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              accessibilityLabel={t[tab] || tab}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {t[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "factors" && (
            <FactorsTab
              shapRankings={shapRankings}
              t={t}
              loading={shapLoading}
            />
          )}
          {activeTab === "risks" && (
            <RisksTab summaryStats={summaryStats} t={t} />
          )}
          {activeTab === "history" && (
            <>
              <View style={styles.historyControls}>
                <View style={styles.timeRangeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      sortOrder === "asc" && styles.activeControlButton,
                    ]}
                    onPress={() => setSortOrder("asc")}
                  >
                    <Text
                      style={[
                        styles.controlButtonText,
                        sortOrder === "asc" && styles.activeControlButtonText,
                      ]}
                    >
                      {t.sortAsc || "Oldest"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      sortOrder === "desc" && styles.activeControlButton,
                    ]}
                    onPress={() => setSortOrder("desc")}
                  >
                    <Text
                      style={[
                        styles.controlButtonText,
                        sortOrder === "desc" && styles.activeControlButtonText,
                      ]}
                    >
                      {t.sortDesc || "Newest"}
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
              <HistoryTab
                filteredHistoryData={filteredHistoryData}
                t={t}
                onDelete={confirmDelete}
              />
            </>
          )}
        </View>
      </View>
    );
  }, [
    activeTab,
    shapRankings,
    shapLoading,
    summaryStats,
    filteredHistoryData,
    t,
    sortOrder,
    sourceFilter,
    confirmDelete,
  ]);

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
                  color: (o) => `rgba(0,128,128,${o})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 64}
            height={180}
            chartConfig={chartConfig}
            bezier
            onDataPointClick={handleChartSelect}
            style={{ marginVertical: 8, borderRadius: 16 }}
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
                    labels: filteredData.map((i) => i.date.slice(0, 5)),
                    datasets: [
                      {
                        data: stepsData,
                        color: (o) => `rgba(0,128,128,${o})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth / 2 - 40}
                  height={120}
                  chartConfig={chartConfig}
                  bezier
                  style={{ marginVertical: 8, borderRadius: 16 }}
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
                    labels: filteredData.map((i) => i.date.slice(0, 5)),
                    datasets: [
                      {
                        data: sleepData,
                        color: (o) => `rgba(0,128,128,${o})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth / 2 - 40}
                  height={120}
                  chartConfig={chartConfig}
                  bezier
                  style={{ marginVertical: 8, borderRadius: 16 }}
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
    [stepsData, sleepData, filteredData, chartConfig, summaryStats, t]
  );

  const renderTooltip = useCallback(() => {
    if (!selectedDataPoint) return null;
    const { chartType, date, value, details } = selectedDataPoint;
    let title = "",
      valueText = "";
    if (chartType === "lifestyle") {
      title = t.lifestyleScore || "Lifestyle Score";
      valueText = `${Math.round(value)}`;
    }
    return (
      <Modal
        transparent
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
              {t.dietQuality?.label || "Diet"}: {details.diet_quality || "N/A"}
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
        keyExtractor={(item, i) => `${item.type}-${i}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={7}
        initialNumToRender={3}
        getItemLayout={(d, i) => ({
          length:
            i === 0 ? 120 : i === 1 ? 60 : i === 2 ? 240 : i === 3 ? 220 : 300,
          offset:
            i === 0 ? 0 : i === 1 ? 120 : i === 2 ? 180 : i === 3 ? 420 : 640,
          index: i,
        })}
      />
      {renderTooltip()}
    </SafeAreaView>
  );
};

export default ProgressScreen;
