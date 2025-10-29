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

// Simple tab components without React.memo for faster rendering
const FactorsTab = ({ shapRankings, t }) => (
  <View>
    {shapRankings.map((item, index) => (
      <View key={index} style={styles.factorItem}>
        <Text style={styles.factorName}>{item.factor}</Text>
        <Text style={styles.factorValue}>{(item.value * 100).toFixed(0)}%</Text>
      </View>
    ))}
  </View>
);

const RisksTab = ({ summaryStats, t }) => {
  if (!summaryStats) {
    return (
      <Text style={styles.riskName}>
        {t.noDataAvailable || "No data available"}
      </Text>
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
        <Text style={styles.riskValue}>{summaryStats.latestRisks.stroke}%</Text>
      </View>
    </>
  );
};

const HistoryItem = ({ item, t, onDelete }) => (
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
        <Text style={styles.progressDetailItem}>BMI: {item.bmi || "N/A"}</Text>
        <Text style={styles.progressDetailItem}>
          {t.kgAbbreviation || "Weight"}: {item.weight_kg || "N/A"}{" "}
          {t.kgAbbreviation}
        </Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(item)}
    >
      <Text style={styles.deleteButtonText}>{t.delete || "Delete"}</Text>
    </TouchableOpacity>
  </View>
);

const HistoryTab = ({ filteredHistoryData, t, onDelete }) => {
  if (filteredHistoryData.length === 0) {
    return (
      <Text style={styles.riskName}>
        {t.noHistoryDataAvailable || "No history data available"}
      </Text>
    );
  }

  return (
    <>
      {filteredHistoryData.map((item, index) => (
        <HistoryItem
          key={`${item.id || item.date}-${item.source}-${index}`}
          item={item}
          t={t}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

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

  // Simplified delete functions
  const handleDeleteEntry = async (item) => {
    try {
      const db = await getDb();
      const table =
        item.source === "UserProfile" ? "UserProfile" : "HealthRecords";
      await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [item.id]);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      Alert.alert(
        t.error || "Error",
        t.deleteError || "Failed to delete entry"
      );
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      t.confirmDelete || "Confirm Delete",
      `${t.deleteConfirmation || "Are you sure you want to delete this entry from"} (${item.date})?`,
      [
        { text: t.cancel || "Cancel", style: "cancel" },
        {
          text: t.delete || "Delete",
          style: "destructive",
          onPress: () => handleDeleteEntry(item),
        },
      ]
    );
  };

  // Simplified data fetching
  const fetchProgressData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const db = await getDb();
      const today = formatDate(new Date().toISOString().split("T")[0]);

      // Get latest user profile
      const userProfileLatest = await db.getAllAsync(
        "SELECT * FROM UserProfile ORDER BY id DESC LIMIT 1"
      );

      let latestRecord = null;
      if (userProfileLatest.length > 0) {
        const item = userProfileLatest[0];
        latestRecord = {
          id: item.id,
          date: formatDate(item.date || today),
          daily_steps: Number(item.Daily_Steps) || 0,
          sleep_hours: Number(item.Sleep_Hours) || 0,
          bmi: Number(item.BMI) || null,
          weight_kg: Number(item.Weight_kg) || null,
          exercise_frequency: Number(item.Exercise_Frequency) || 0,
          stress_level: Number(item.Stress_Level) || 1,
          diet_quality: item.Diet_Quality || "Average",
          source: "UserProfile",
        };
      }
      setLatestUserProfile(latestRecord);

      // Get all data
      const userProfileData = await db.getAllAsync(
        "SELECT * FROM UserProfile ORDER BY id DESC"
      );
      const healthRecordsData = await db.getAllAsync(
        "SELECT * FROM HealthRecords ORDER BY id DESC"
      );

      const transformedUserProfileData = userProfileData.map((item) => ({
        id: item.id,
        date: formatDate(item.date || today),
        daily_steps: Number(item.Daily_Steps) || 0,
        sleep_hours: Number(item.Sleep_Hours) || 0,
        bmi: Number(item.BMI) || null,
        weight_kg: Number(item.Weight_kg) || null,
        exercise_frequency: Number(item.Exercise_Frequency) || 0,
        stress_level: Number(item.Stress_Level) || 1,
        diet_quality: item.Diet_Quality || "Average",
        source: "UserProfile",
      }));

      const transformedHealthRecordsData = healthRecordsData.map((item) => ({
        id: item.id,
        date: formatDate(item.date || today),
        daily_steps: Number(item.daily_steps) || 0,
        sleep_hours: Number(item.sleep_hours) || 0,
        bmi: Number(item.bmi) || null,
        weight_kg: Number(item.weight_kg) || null,
        exercise_frequency: Number(item.exercise_frequency) || 0,
        stress_level: Number(item.stress_level) || 1,
        diet_quality: item.diet_quality || "Average",
        source: "HealthRecords",
      }));

      let allData = [
        ...transformedUserProfileData,
        ...transformedHealthRecordsData,
      ];

      // Add current day data from navigation if available
      const navLifestyleData = route.params?.lifestyleData;
      if (navLifestyleData) {
        allData.push({
          date: today,
          daily_steps: Number(navLifestyleData.Daily_Steps) || 0,
          sleep_hours: Number(navLifestyleData.Sleep_Hours) || 0,
          bmi: Number(navLifestyleData.BMI) || null,
          weight_kg: Number(navLifestyleData.Weight_kg) || null,
          exercise_frequency: Number(navLifestyleData.Exercise_Frequency) || 0,
          stress_level: Number(navLifestyleData.Stress_Level) || 1,
          diet_quality: navLifestyleData.Diet_Quality || "Average",
          source: "UserProfile",
        });
      }

      // Sort by date
      setProgressData(
        allData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateA - dateB;
        })
      );
    } catch (error) {
      setError("Failed to load data from database");
      setLatestUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Single effect for data loading
  useEffect(() => {
    fetchProgressData();
  }, [refreshKey]);

  // Simplified calculations
  const calculateLifestyleScore = (data) => {
    if (!data) return 0;
    let totalScore = 0;

    // BMI Score
    const bmi = data.bmi || 0;
    if (bmi >= 18.5 && bmi < 25) totalScore += 15;
    else if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi < 27))
      totalScore += 12;
    else if ((bmi >= 16 && bmi < 17) || (bmi >= 27 && bmi < 30))
      totalScore += 8;
    else if ((bmi >= 15 && bmi < 16) || (bmi >= 30 && bmi < 35))
      totalScore += 4;

    // Steps Score
    const steps = data.daily_steps || 0;
    if (steps >= 10000) totalScore += 15;
    else if (steps >= 8000) totalScore += 12;
    else if (steps >= 6000) totalScore += 9;
    else if (steps >= 4000) totalScore += 6;
    else if (steps >= 2000) totalScore += 3;

    // Sleep Score
    const hours = data.sleep_hours || 0;
    if (hours >= 7 && hours <= 9) totalScore += 15;
    else if ((hours >= 6 && hours < 7) || (hours > 9 && hours <= 10))
      totalScore += 12;
    else if ((hours >= 5 && hours < 6) || (hours > 10 && hours <= 11))
      totalScore += 8;
    else if ((hours >= 4 && hours < 5) || hours > 11) totalScore += 4;

    return Math.max(0, Math.min(100, totalScore));
  };

  const calculateDiseaseRisks = (data) => {
    if (!data) return { obesity: 1, hypertension: 1, stroke: 1 };

    const bmi = data.bmi || 0;
    const steps = data.daily_steps || 0;
    const exercise = data.exercise_frequency || 0;

    const obesity = Math.max(
      1,
      Math.min(
        100,
        (bmi >= 30 ? 50 : bmi >= 25 ? 30 : bmi < 18.5 ? 10 : 0) +
          (exercise < 1 ? 20 : exercise < 3 ? 10 : 0) +
          (steps < 5000 ? 20 : steps < 7000 ? 10 : 0)
      )
    );

    const hypertension = Math.max(
      1,
      Math.min(
        100,
        (bmi >= 30 ? 30 : bmi >= 25 ? 15 : 0) +
          (steps < 5000 ? 20 : steps < 7000 ? 10 : 0)
      )
    );

    const stroke = Math.max(
      1,
      Math.min(
        100,
        (bmi >= 30 ? 25 : bmi >= 25 ? 15 : 0) +
          (exercise < 1 ? 20 : exercise < 3 ? 10 : 0)
      )
    );

    return { obesity, hypertension, stroke };
  };

  // Simplified data filtering
  const filteredData = useMemo(() => {
    const today = new Date();
    const daysAgo = timeRange === "7days" ? 7 : 30;
    const cutoffDate = new Date(today.setDate(today.getDate() - daysAgo));

    return progressData
      .filter((item) => {
        const itemDate = new Date(item.date.split("/").reverse().join("-"));
        return itemDate >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return dateA - dateB;
      });
  }, [progressData, timeRange]);

  // Simplified computed data
  const lifestyleScores = filteredData.map((item) =>
    calculateLifestyleScore(item)
  );
  const stepsData = filteredData.map((item) => item.daily_steps || 0);
  const sleepData = filteredData.map((item) => item.sleep_hours || 0);

  const shapRankings = [
    { factor: t.steps || "Steps", value: 0.25 },
    { factor: t.bmi || "BMI", value: 0.2 },
    { factor: t.exerciseFrequency || "Exercise Frequency", value: 0.2 },
    { factor: t.sleep || "Sleep", value: 0.15 },
    { factor: t.dietQuality?.label || "Diet Quality", value: 0.1 },
    { factor: t.fruitsVeggies || "Fruits & Veggies", value: 0.1 },
  ];

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

  // Simplified summary stats
  const summaryStats = useMemo(() => {
    if (!latestUserProfile) return null;

    const latestData = latestUserProfile;
    const latestScore = calculateLifestyleScore(latestData);
    const latestRisks = calculateDiseaseRisks(latestData);

    return {
      score: latestScore,
      steps: latestData.daily_steps || 0,
      sleep: latestData.sleep_hours || 0,
      bmi: latestData.bmi || null,
      weight: latestData.weight_kg || null,
      riskLevel:
        (latestRisks.obesity + latestRisks.hypertension + latestRisks.stroke) /
        3,
      latestRisks,
    };
  }, [latestUserProfile]);

  // Simplified filtered history data
  const filteredHistoryData = useMemo(() => {
    return filteredData
      .filter((item) => sourceFilter === "all" || item.source === sourceFilter)
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [filteredData, sourceFilter, sortOrder]);

  // Simple render functions without useCallback
  const renderQuickStats = () => (
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
              <Text style={styles.compactStatValue}>{summaryStats.score}</Text>
              <Text style={styles.compactStatLabel}>
                {t.lifestyleScore || "Lifestyle Score"}
              </Text>
            </View>
            <View style={styles.compactStatItem}>
              <Text style={styles.compactStatValue}>
                {Math.round(summaryStats.steps).toLocaleString()}
              </Text>
              <Text style={styles.compactStatLabel}>{t.steps || "Steps"}</Text>
            </View>
            <View style={styles.compactStatItem}>
              <Text style={styles.compactStatValue}>{summaryStats.sleep}</Text>
              <Text style={styles.compactStatLabel}>{t.sleep || "Sleep"}</Text>
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
  );

  const renderTimeRange = () => (
    <View style={styles.timeRangeCard}>
      <View style={styles.timeRangeContainer}>
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
  );

  const renderLifestyleChart = () => (
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
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      ) : (
        <Text style={styles.compactStatLabel}>
          {t.noDataAvailable || "No data available"}
        </Text>
      )}
    </View>
  );

  const renderStepsSleepCharts = () => (
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
                  {t.latest || "Latest"}: {summaryStats.steps.toLocaleString()}
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
  );

  const renderTabs = () => (
    <View style={styles.bottomSection}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "factors" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("factors")}
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
          style={[styles.tabButton, activeTab === "risks" && styles.activeTab]}
          onPress={() => setActiveTab("risks")}
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
          <FactorsTab shapRankings={shapRankings} t={t} />
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
                      sourceFilter === "all" && styles.activeControlButtonText,
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

  const renderTooltip = () => {
    if (!selectedDataPoint) return null;
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
              {t.lifestyleScore || "Lifestyle Score"} - {selectedDataPoint.date}
            </Text>
            <Text style={styles.tooltipText}>
              {t.value || "Value"}: {Math.round(selectedDataPoint.value)}
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
  };

  const data = [
    { type: "quickStats" },
    { type: "timeRange" },
    { type: "lifestyleChart" },
    { type: "stepsSleepCharts" },
    { type: "tabs" },
  ];

  const renderItem = ({ item }) => {
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
  };

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
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
      />
      {renderTooltip()}
    </SafeAreaView>
  );
};

export default ProgressScreen;
