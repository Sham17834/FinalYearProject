import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import { getDb } from "./db";
import { center } from "@shopify/react-native-skia";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForDisplay = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    backgroundColor: "#008080",
    paddingTop: 30,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
  },
  recordHeader: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  recordDate: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  datePickerButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "500",
  },
  datePickerIcon: {
    fontSize: 16,
    color: "#008080",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  calendarHeader: {
    backgroundColor: "#008080",
    padding: 16,
  },
  calendarYearText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  calendarDateText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "700",
    marginTop: 4,
  },
  calendarNavigator: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  monthPickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },
  yearPickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },
  datePickerPicker: {
    height: 50,
  },
  calendarBody: {
    padding: 16,
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#1f2937",
  },
  emptyDay: {
    opacity: 0,
  },
  selectedDay: {
    backgroundColor: "#008080",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  todayDay: {
    borderWidth: 1,
    borderColor: "#008080",
  },
  disabledDay: {
    opacity: 0.3,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cancelButton: {
    color: "#374151",
  },
  okButton: {
    color: "#008080",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  fieldValue: {
    fontSize: 15,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  readOnlyField: {
    backgroundColor: "#f1f5f9",
    color: "#6b7280",
  },
  picker: {
    height: 50,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    color: "#1f2937",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },
  switchIndicator: {
    marginLeft: 12,
  },
  sliderGroup: {
    marginBottom: 6,
  },
  sliderContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 8,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#008080",
    textAlign: "center",
    marginTop: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sliderRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rangeLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  stressIndicator: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    marginVertical: 8,
    overflow: "hidden",
  },
  stressColor: {
    flex: 1,
  },
  submitSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: "#008080",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  validationNote: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
};

const TrackScreen = () => {
  const { t = {} } = useContext(LanguageContext);
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  
  // Form data - matching LifestyleDataInputScreen fields
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bmi, setBmi] = useState("");
  const [chronicDisease, setChronicDisease] = useState("None");
  const [dailySteps, setDailySteps] = useState(5000);
  const [dailyStepsLive, setDailyStepsLive] = useState(5000);
  const [isSlidingDailySteps, setIsSlidingDailySteps] = useState(false);
  const [exerciseFrequency, setExerciseFrequency] = useState(3);
  const [exerciseFrequencyLive, setExerciseFrequencyLive] = useState(3);
  const [isSlidingExerciseFrequency, setIsSlidingExerciseFrequency] = useState(false);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepHoursLive, setSleepHoursLive] = useState(7);
  const [isSlidingSleepHours, setIsSlidingSleepHours] = useState(false);
  const [alcoholConsumption, setAlcoholConsumption] = useState(false);
  const [smokingHabit, setSmokingHabit] = useState(false);
  const [dietQuality, setDietQuality] = useState("Good");
  const [fruitsVeggies, setFruitsVeggies] = useState(3);
  const [fruitsVeggiesLive, setFruitsVeggiesLive] = useState(3);
  const [isSlidingFruitsVeggies, setIsSlidingFruitsVeggies] = useState(false);
  const [stressLevel, setStressLevel] = useState(5);
  const [stressLevelLive, setStressLevelLive] = useState(5);
  const [isSlidingStressLevel, setIsSlidingStressLevel] = useState(false);
  const [screenTimeHours, setScreenTimeHours] = useState(4);
  const [screenTimeHoursLive, setScreenTimeHoursLive] = useState(4);
  const [isSlidingScreenTimeHours, setIsSlidingScreenTimeHours] = useState(false);

  const chronicDiseaseOptions = [
    { label: t.none || "None", value: "None" },
    { label: t.stroke || "Stroke", value: "Stroke" },
    { label: t.hypertension || "Hypertension", value: "Hypertension" },
    { label: t.obesity || "Obesity", value: "Obesity" },
  ];

  const dietQualityOptions = [
    { label: t.excellent || "Excellent", value: "Excellent" },
    { label: t.good || "Good", value: "Good" },
    { label: t.average || "Average", value: "Average" },
    { label: t.poor || "Poor", value: "Poor" },
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push(i);
    }
    return years;
  };

  const handleHeightChange = (text) => {
    setHeightCm(text);
    calculateBMI(text, weightKg);
  };

  const handleWeightChange = (text) => {
    setWeightKg(text);
    calculateBMI(heightCm, text);
  };

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightM = parseFloat(height) / 100;
      const weightNum = parseFloat(weight);
      if (heightM > 0 && weightNum > 0) {
        const bmiValue = (weightNum / (heightM * heightM)).toFixed(1);
        setBmi(bmiValue);
      } else {
        setBmi("");
      }
    } else {
      setBmi("");
    }
  };

  const showDatePickerModal = () => {
    setTempDate(new Date(selectedDate));
    setCalendarMonth(selectedDate.getMonth());
    setCalendarYear(selectedDate.getFullYear());
    setShowDatePicker(true);
  };

  const handleDateConfirm = () => {
    setSelectedDate(new Date(tempDate));
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleMonthChange = (month) => {
    setCalendarMonth(month);
    // Adjust day if it exceeds the days in the new month
    const daysInNewMonth = getDaysInMonth(month, calendarYear);
    if (tempDate.getDate() > daysInNewMonth) {
      setTempDate(new Date(calendarYear, month, daysInNewMonth));
    }
  };

  const handleYearChange = (year) => {
    setCalendarYear(year);
    // Adjust day if it exceeds the days in the new month/year
    const daysInNewMonth = getDaysInMonth(calendarMonth, year);
    if (tempDate.getDate() > daysInNewMonth) {
      setTempDate(new Date(year, calendarMonth, daysInNewMonth));
    }
  };

  const handleDayPress = (day) => {
    const newDate = new Date(calendarYear, calendarMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (newDate <= today) {
      setTempDate(newDate);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
    const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <View style={[styles.dayButton, styles.emptyDay]}>
            <Text style={styles.dayText}></Text>
          </View>
        </View>
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(calendarYear, calendarMonth, day);
      currentDate.setHours(0, 0, 0, 0);
      const isSelected = tempDate.getDate() === day && 
                        tempDate.getMonth() === calendarMonth && 
                        tempDate.getFullYear() === calendarYear;
      const isToday = currentDate.getTime() === today.getTime();
      const isFuture = currentDate > today;
      
      days.push(
        <View key={day} style={styles.dayCell}>
          <TouchableOpacity
            style={[
              styles.dayButton,
              isSelected && styles.selectedDay,
              isToday && !isSelected && styles.todayDay,
              isFuture && styles.disabledDay,
            ]}
            onPress={() => handleDayPress(day)}
            disabled={isFuture}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return days;
  };

  const formatCalendarDate = (date) => {
    const shortWeekDays = t.shortWeekDays || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const shortMonthNames = t.shortMonthNames || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${shortWeekDays[date.getDay()]}, ${shortMonthNames[date.getMonth()]} ${date.getDate()}`;
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSubmit = async () => {
    if (!age || !heightCm || !weightKg) {
      Alert.alert(
        t.validationError || "Validation Error",
        t.pleaseComplete || "Please complete all required fields"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const db = await getDb();
      const formattedDate = formatDateForDisplay(selectedDate);
      
      await db.runAsync(
        `INSERT INTO HealthRecords (
          date, age, gender, height_cm, weight_kg, bmi, 
          chronic_disease, daily_steps, exercise_frequency, sleep_hours,
          alcohol_consumption, smoking_habit, screen_time_hours,
          diet_quality, fruits_veggies, stress_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          formattedDate,
          parseInt(age),
          gender,
          parseFloat(heightCm),
          parseFloat(weightKg),
          parseFloat(bmi),
          chronicDisease,
          dailySteps,
          exerciseFrequency,
          sleepHours,
          alcoholConsumption ? 1 : 0,
          smokingHabit ? 1 : 0,
          screenTimeHours,
          dietQuality,
          fruitsVeggies,
          stressLevel,
        ]
      );

      Alert.alert(
        t.success || "Success",
        t.recordSaved || "Health record saved successfully!",
        [
          {
            text: t.ok || "OK",
            onPress: () => navigation.navigate("Progress"),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving record:", error);
      Alert.alert(
        t.error || "Error",
        t.errorSaving || "Failed to save health record. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.appName}>{t.appName || "HealthTrack"}</Text>
        <Text style={styles.appTagline}>
          {t.tagline || "Your Personal Health Companion"}
        </Text>
      </View>
      
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDateCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarYearText}>{calendarYear}</Text>
              <Text style={styles.calendarDateText}>
                {formatCalendarDate(tempDate)}
              </Text>
            </View>
            
            <View style={styles.calendarNavigator}>
              <View style={styles.pickerRow}>
                <View style={styles.monthPickerContainer}>
                  <Picker
                    selectedValue={calendarMonth}
                    style={styles.datePickerPicker}
                    onValueChange={handleMonthChange}
                  >
                    {(t.monthNames || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]).map((month, index) => (
                      <Picker.Item key={index} label={month} value={index} />
                    ))}
                  </Picker>
                </View>
                
                <View style={styles.yearPickerContainer}>
                  <Picker
                    selectedValue={calendarYear}
                    style={styles.datePickerPicker}
                    onValueChange={handleYearChange}
                  >
                    {generateYears().map((year) => (
                      <Picker.Item key={year} label={String(year)} value={year} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.calendarBody}>
              <View style={styles.weekDaysRow}>
                {(t.weekDayShorts || ["S", "M", "T", "W", "T", "F", "S"]).map((day, index) => (
                  <Text key={index} style={styles.weekDayText}>
                    {day}
                  </Text>
                ))}
              </View>
              
              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDateCancel}
              >
                <Text style={[styles.modalButtonText, styles.cancelButton]}>
                  {t.cancel || "CANCEL"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDateConfirm}
              >
                <Text style={[styles.modalButtonText, styles.okButton]}>
                  {t.ok || "OK"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <ScrollView
        style={styles.content}
        scrollEnabled={isScrollEnabled}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.recordHeader}>
          <Text style={styles.recordTitle}>
            {t.newHealthRecord || "New Health Record"}
          </Text>
          <Text style={styles.recordDate}>
            {t.date || "Date"}: {formatDateForDisplay(selectedDate)}
          </Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={showDatePickerModal}
          >
            <Text style={styles.datePickerButtonText}>
              {t.selectDate || "Select Date"}
            </Text>
            <Text style={styles.datePickerIcon}>📅</Text>
          </TouchableOpacity>
        </View>
        
        {/* PERSONAL INFORMATION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.personalInfo || "Personal Information"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.age || "Age"}</Text>
              <TextInput
                style={styles.fieldValue}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder={t.enterAge || "Enter your age"}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t.gender || "Gender"}</Text>
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label={t.male || "Male"} value="Male" />
                <Picker.Item label={t.female || "Female"} value="Female" />
              </Picker>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.heightCm || "Height (cm)"}
              </Text>
              <TextInput
                style={styles.fieldValue}
                value={heightCm}
                onChangeText={handleHeightChange}
                keyboardType="numeric"
                placeholder={t.enterHeight || "Enter height in cm"}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.weightKg || "Weight (kg)"}
              </Text>
              <TextInput
                style={styles.fieldValue}
                value={weightKg}
                onChangeText={handleWeightChange}
                keyboardType="numeric"
                placeholder={t.enterWeight || "Enter weight in kg"}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.bmi || "BMI (Body Mass Index)"}
              </Text>
              <TextInput
                style={[styles.fieldValue, styles.readOnlyField]}
                value={bmi}
                editable={false}
                placeholder={t.bmiPlaceholder || "Calculated automatically"}
              />
            </View>
          </View>
        </View>

        {/* HEALTH & ACTIVITY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.healthHabitsTitle || "Health & Activity"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.chronicDisease || "Chronic Disease"}
              </Text>
              <Picker
                selectedValue={chronicDisease}
                style={styles.picker}
                onValueChange={(itemValue) => setChronicDisease(itemValue)}
              >
                {chronicDiseaseOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.dailySteps || "Daily Steps"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={50000}
                  step={100}
                  value={isSlidingDailySteps ? dailyStepsLive : dailySteps}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onSlidingStart={() => {
                    setIsSlidingDailySteps(true);
                    setDailyStepsLive(dailySteps);
                    setIsScrollEnabled(false);
                  }}
                  onSlidingComplete={(value) => {
                    setDailySteps(value);
                    setIsSlidingDailySteps(false);
                    setIsScrollEnabled(true);
                  }}
                  onValueChange={(value) => setDailyStepsLive(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>0</Text>
                  <Text style={styles.rangeLabel}>50,000+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {formatNumber(isSlidingDailySteps ? dailyStepsLive : dailySteps)} {t.steps || "steps"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.exerciseFrequency || "Exercise Frequency (days/week)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={7}
                  step={1}
                  value={isSlidingExerciseFrequency ? exerciseFrequencyLive : exerciseFrequency}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onSlidingStart={() => {
                    setIsSlidingExerciseFrequency(true);
                    setExerciseFrequencyLive(exerciseFrequency);
                    setIsScrollEnabled(false);
                  }}
                  onSlidingComplete={(value) => {
                    setExerciseFrequency(value);
                    setIsSlidingExerciseFrequency(false);
                    setIsScrollEnabled(true);
                  }}
                  onValueChange={(value) => setExerciseFrequencyLive(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{t.sedentary || "Sedentary"}</Text>
                  <Text style={styles.rangeLabel}>{t.veryActive || "Very Active"}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {isSlidingExerciseFrequency ? exerciseFrequencyLive : exerciseFrequency} {t.daysPerWeek || "days/week"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.sleepHours || "Sleep Hours"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={3}
                  maximumValue={12}
                  step={0.5}
                  value={isSlidingSleepHours ? sleepHoursLive : sleepHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onSlidingStart={() => {
                    setIsSlidingSleepHours(true);
                    setSleepHoursLive(sleepHours);
                    setIsScrollEnabled(false);
                  }}
                  onSlidingComplete={(value) => {
                    setSleepHours(value);
                    setIsSlidingSleepHours(false);
                    setIsScrollEnabled(true);
                  }}
                  onValueChange={(value) => setSleepHoursLive(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{`3 ${t.hoursAbbrev || "h"}`}</Text>
                  <Text style={styles.rangeLabel}>{`12 ${t.hoursAbbrev || "h"}`}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {isSlidingSleepHours ? sleepHoursLive : sleepHours} {t.hours || "hours"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {t.alcoholConsumption || "Alcohol Consumption"}
                </Text>
                <Switch
                  style={styles.switchIndicator}
                  value={alcoholConsumption}
                  onValueChange={(value) => setAlcoholConsumption(value)}
                  trackColor={{ false: "#e5e7eb", true: "#008080" }}
                  thumbColor={alcoholConsumption ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {t.smokingHabit || "Smoking Habit"}
                </Text>
                <Switch
                  style={styles.switchIndicator}
                  value={smokingHabit}
                  onValueChange={(value) => setSmokingHabit(value)}
                  trackColor={{ false: "#e5e7eb", true: "#008080" }}
                  thumbColor={smokingHabit ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>
          </View>
        </View>

        {/* LIFESTYLE & WELLNESS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.lifestyleTitle || "Lifestyle & Wellness"}
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.dietQuality?.label || "Diet Quality"}
              </Text>
              <Picker
                selectedValue={dietQuality}
                style={styles.picker}
                onValueChange={(itemValue) => setDietQuality(itemValue)}
              >
                {dietQualityOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.fruitsVeggies || "Fruits & Vegetables (servings/day)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={isSlidingFruitsVeggies ? fruitsVeggiesLive : fruitsVeggies}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onSlidingStart={() => {
                    setIsSlidingFruitsVeggies(true);
                    setFruitsVeggiesLive(fruitsVeggies);
                    setIsScrollEnabled(false);
                  }}
                  onSlidingComplete={(value) => {
                    setFruitsVeggies(value);
                    setIsSlidingFruitsVeggies(false);
                    setIsScrollEnabled(true);
                  }}
                  onValueChange={(value) => setFruitsVeggiesLive(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>0</Text>
                  <Text style={styles.rangeLabel}>10+</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {isSlidingFruitsVeggies ? fruitsVeggiesLive : fruitsVeggies} {t.servingsPerDay || "servings/day"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.stressLevel || "Stress Level"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={isSlidingStressLevel ? stressLevelLive : stressLevel}
                  minimumTrackTintColor="#10b981"
                  maximumTrackTintColor="#ef4444"
                  onSlidingStart={() => {
                    setIsSlidingStressLevel(true);
                    setStressLevelLive(stressLevel);
                    setIsScrollEnabled(false);
                  }}
                  onSlidingComplete={(value) => {
                    setStressLevel(value);
                    setIsSlidingStressLevel(false);
                    setIsScrollEnabled(true);
                  }}
                  onValueChange={(value) => setStressLevelLive(value)}
                />
                <View style={styles.stressIndicator}>
                  <View
                    style={[styles.stressColor, { backgroundColor: "#10b981" }]}
                  />
                  <View
                    style={[styles.stressColor, { backgroundColor: "#a3e635" }]}
                  />
                  <View
                    style={[styles.stressColor, { backgroundColor: "#f59e0b" }]}
                  />
                  <View
                    style={[styles.stressColor, { backgroundColor: "#ef4444" }]}
                  />
                </View>
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{t.lowStress || "Low"}</Text>
                  <Text style={styles.rangeLabel}>{t.highStress || "High"}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {t.level || "Level"} {isSlidingStressLevel ? stressLevelLive : stressLevel}/10
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                {t.screenTimeHours || "Screen Time (hours/day)"}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={16}
                  step={0.5}
                  value={isSlidingScreenTimeHours ? screenTimeHoursLive : screenTimeHours}
                  minimumTrackTintColor="#008080"
                  maximumTrackTintColor="#e5e7eb"
                  onSlidingStart={() => {
                    setIsSlidingScreenTimeHours(true);
                    setScreenTimeHoursLive(screenTimeHours);
                    setIsScrollEnabled(false);
                  }}
                  onSlidingComplete={(value) => {
                    setScreenTimeHours(value);
                    setIsSlidingScreenTimeHours(false);
                    setIsScrollEnabled(true);
                  }}
                  onValueChange={(value) => setScreenTimeHoursLive(value)}
                />
                <View style={styles.sliderRange}>
                  <Text style={styles.rangeLabel}>{`0 ${t.hours || "hours"}`}</Text>
                  <Text style={styles.rangeLabel}>{`16 ${t.hours || "hours"}`}</Text>
                </View>
                <Text style={styles.sliderValue}>
                  {isSlidingScreenTimeHours ? screenTimeHoursLive : screenTimeHours} {t.hours || "hours"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? t.saving || "Saving Record..."
                : t.save || "Save Health Record"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.validationNote}>
            {t.validationNote || "All fields are validated before submission"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackScreen;