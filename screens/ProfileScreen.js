import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Linking,
  Alert,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDb } from "./db";

const COLORS = {
  primary: "#008080",
  primaryDark: "#006666",
  primaryLight: "#20a5a5",
  secondary: "#3b82f6",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceElevated: "#ffffff",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  text: "#1f2937",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  textInverse: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.1)",
  shadow: "rgba(0, 0, 0, 0.08)",
};

const ProfileScreen = () => {
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState("Sample User");
  const [email, setEmail] = useState("john.doe@example.com");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [gender, setGender] = useState("Male");
  const [chronicDisease, setChronicDisease] = useState("None");
  const [dailySteps, setDailySteps] = useState("5000");
  const [exerciseFrequency, setExerciseFrequency] = useState("3");
  const [sleepHours, setSleepHours] = useState("7");
  const [alcoholConsumption, setAlcoholConsumption] = useState(false);
  const [smokingHabit, setSmokingHabit] = useState(false);
  const [dietQuality, setDietQuality] = useState("Good");
  const [fruitsVeggies, setFruitsVeggies] = useState("5");
  const [stressLevel, setStressLevel] = useState("5");
  const [screenTimeHours, setScreenTimeHours] = useState("4");
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const db = await getDb();
        const userProfileLatest = await db.getAllAsync(
          "SELECT * FROM UserProfile ORDER BY id DESC LIMIT 1"
        );

        if (userProfileLatest.length > 0) {
          const data = userProfileLatest[0];
          setEmail(data.email || "john.doe@example.com");
          setAge(data.Age?.toString() || "30");
          setGender(data.Gender || "Male");
          setHeight(data.Height_cm?.toString() || "175");
          setWeight(data.Weight_kg?.toString() || "70");
          setChronicDisease(data.Chronic_Disease || "None");
          setDailySteps(data.Daily_Steps?.toString() || "5000");
          setExerciseFrequency(data.Exercise_Frequency?.toString() || "3");
          setSleepHours(data.Sleep_Hours?.toString() || "7");
          setAlcoholConsumption(data.Alcohol_Consumption === "Yes");
          setSmokingHabit(data.Smoking_Habit === "Yes");
          setDietQuality(data.Diet_Quality || "Good");
          setFruitsVeggies(data.FRUITS_VEGGIES?.toString() || "5");
          setStressLevel(data.Stress_Level?.toString() || "5");
          setScreenTimeHours(data.Screen_Time_Hours?.toString() || "4");
        } else if (route.params?.userData) {
          const data = route.params.userData;
          setEmail(data.email || email);
          setAge(data.age?.toString() || age);
          setGender(data.gender || gender);
          setHeight(data.height_cm?.toString() || height);
          setWeight(data.weight_kg?.toString() || weight);
          setChronicDisease(data.chronic_disease || chronicDisease);
          setDailySteps(data.daily_steps?.toString() || dailySteps);
          setExerciseFrequency(
            data.exercise_frequency?.toString() || exerciseFrequency
          );
          setSleepHours(data.sleep_hours?.toString() || sleepHours);
          setAlcoholConsumption(data.alcohol_consumption === "Yes");
          setSmokingHabit(data.smoking_habit === "Yes");
          setDietQuality(data.diet_quality || dietQuality);
          setFruitsVeggies(data.fruits_veggies?.toString() || fruitsVeggies);
          setStressLevel(data.stress_level?.toString() || stressLevel);
          setScreenTimeHours(
            data.screen_time_hours?.toString() || screenTimeHours
          );
        }
      } catch (error) {
        console.error("Error loading profile data from database:", error);
        Alert.alert(
          t.error || "Error",
          t.loadProfileError || "Failed to load profile data."
        );
      }
    };

    loadProfileData();
  }, [route.params, t]);

  const availableLanguages = [
    { code: "English", name: "English", nativeName: "English" },
    { code: "Malay", name: "Malay", nativeName: "Bahasa Melayu" },
    { code: "Chinese", name: "Chinese", nativeName: "中文" },
  ];

  const frequencyOptions = [
    { label: t.daily || "Daily", value: "daily" },
    { label: t.weekly || "Weekly", value: "weekly" },
    { label: t.monthly || "Monthly", value: "monthly" },
  ];

  const genderOptions = [
    { label: t.male || "Male", value: "Male" },
    { label: t.female || "Female", value: "Female" },
  ];

  const handleLanguageSelect = async (selectedLanguage) => {
    try {
      await changeLanguage(selectedLanguage.code);
      setShowLanguageModal(false);
      Alert.alert(
        t.languageChanged || "Language Changed",
        t.languageChangedMsg ||
          "The app language has been updated successfully.",
        [{ text: t.ok || "OK", style: "default" }]
      );
    } catch (error) {
      console.error("Error changing language:", error);
      Alert.alert(
        t.error || "Error",
        t.languageChangeError || "Failed to change language. Please try again.",
        [{ text: t.ok || "OK", style: "default" }]
      );
    }
  };

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(
      (lang) => lang.code === language
    );
    return currentLang ? currentLang.nativeName : language;
  };

  const handleSave = async () => {
    const data = {
      email,
      age: parseInt(age) || 30,
      gender,
      height_cm: parseFloat(height) || 175,
      weight_kg: parseFloat(weight) || 70,
      chronic_disease: chronicDisease,
      daily_steps: parseInt(dailySteps) || 5000,
      exercise_frequency: parseInt(exerciseFrequency) || 3,
      sleep_hours: parseFloat(sleepHours) || 7,
      alcohol_consumption: alcoholConsumption ? "Yes" : "No",
      smoking_habit: smokingHabit ? "Yes" : "No",
      diet_quality: dietQuality,
      fruits_veggies: parseInt(fruitsVeggies) || 5,
      stress_level: parseInt(stressLevel) || 5,
      screen_time_hours: parseFloat(screenTimeHours) || 4,
      isOfflineMode,
      notificationsEnabled,
      notificationFrequency,
      language,
    };

    try {
      await AsyncStorage.setItem("userProfileData", JSON.stringify(data));
      Alert.alert(t.profileSaved, t.profileSavedMsg, [
        { text: t.ok, style: "default" },
      ]);
      console.log("Saved:", data);
    } catch (error) {
      console.error("Error saving profile data:", error);
      Alert.alert(
        t.error || "Error",
        t.saveProfileError || "Failed to save profile data."
      );
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://www.who.int/about/policies/privacy").catch((err) =>
      Alert.alert(t.error, t.errorPrivacyPolicy)
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(t.deleteAccount, t.deleteAccountConfirm, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.delete,
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userProfileData");
            console.log("Account deletion requested");
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          } catch (error) {
            console.error("Error deleting account:", error);
            Alert.alert(
              t.error || "Error",
              t.deleteAccountError || "Failed to delete account."
            );
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert(t.logOut, t.logOutConfirm, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.logOut,
        style: "default",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userProfileData");
            console.log("User logged out successfully");
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert(
              t.error || "Error",
              t.logoutError || "Failed to log out."
            );
          }
        },
      },
    ]);
  };

  const SwitchRow = ({ label, value, onValueChange, description }) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchContent}>
        <Text style={styles.switchLabel}>{label}</Text>
        {description && (
          <Text style={styles.switchDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e5e7eb", true: "#008080" }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor="#e5e7eb"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.appName}>{t.profileTitle}</Text>
            <Text style={styles.appTagline}>{t.profileTagline}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.personalInfo}</Text>

            <View style={styles.formCard}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.fullName}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterFullName}
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.emailAddress}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterEmail}
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputRow}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                >
                  <Text style={styles.inputLabel}>{t.age}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.age}
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                  />
                </View>

                <View
                  style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
                >
                  <Text style={styles.inputLabel}>{t.gender}</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={gender}
                      style={styles.picker}
                      dropdownIconColor={COLORS.textMuted}
                      mode="dropdown"
                      onValueChange={(itemValue) => setGender(itemValue)}
                    >
                      {genderOptions.map((option) => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                          style={styles.pickerItem}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                >
                  <Text style={styles.inputLabel}>{t.heightCm}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.heightPlaceholder}
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                  />
                </View>

                <View
                  style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
                >
                  <Text style={styles.inputLabel}>{t.weightKg}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.weightPlaceholder}
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.preferences}</Text>

            <View style={styles.settingsCard}>
              <View style={styles.pickerSection}>
                <Text style={styles.inputLabel}>
                  {t.language || "Language"}
                </Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowLanguageModal(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {getCurrentLanguageName()}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <SwitchRow
                label={t.offlineMode}
                description={t.offlineModeDesc}
                value={isOfflineMode}
                onValueChange={setIsOfflineMode}
              />

              <View style={styles.divider} />

              <SwitchRow
                label={t.pushNotifications}
                description={t.notificationsDesc}
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />

              {notificationsEnabled && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.pickerSection}>
                    <Text style={styles.inputLabel}>
                      {t.notificationFrequency}
                    </Text>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => setShowFrequencyModal(true)}
                    >
                      <Text style={styles.pickerButtonText}>
                        {
                          frequencyOptions.find(
                            (option) => option.value === notificationFrequency
                          )?.label
                        }
                      </Text>
                      <Text style={styles.pickerArrow}>▼</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.securityPrivacy}</Text>

            <View style={styles.securityCard}>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon}>
                  <Text style={styles.securityIconText}>🔒</Text>
                </View>
                <View style={styles.securityContent}>
                  <Text style={styles.securityTitle}>{t.dataEncryption}</Text>
                  <Text style={styles.securityDescription}>
                    {t.encryptionDesc}
                  </Text>
                </View>
                <View style={styles.securityStatus}>
                  <Text style={styles.activeStatus}>{t.active}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePrivacyPolicy}
            >
              <Text style={styles.secondaryButtonText}>
                {t.reviewPrivacyPolicy}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>{t.saveChanges}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.dangerButtonText}>{t.deleteAccount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleLogout}
            >
              <Text style={styles.secondaryButtonText}>{t.logOut}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t.selectLanguage || "Select Language"}
            </Text>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.modalOption,
                  language === lang.code && styles.modalOptionSelected,
                ]}
                onPress={() => handleLanguageSelect(lang)}
              >
                <View style={styles.languageOptionContent}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      language === lang.code && styles.modalOptionTextSelected,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text
                    style={[
                      styles.languageSubtext,
                      language === lang.code && styles.languageSubtextSelected,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </View>
                {language === lang.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showFrequencyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFrequencyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFrequencyModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectFrequency}</Text>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  notificationFrequency === option.value &&
                    styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setNotificationFrequency(option.value);
                  setShowFrequencyModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    notificationFrequency === option.value &&
                      styles.modalOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {notificationFrequency === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  headerContent: {
    alignItems: "center",
  },

  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textInverse,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  securityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  inputContainer: {
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.1,
  },

  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 50,
    textAlignVertical: "center",
  },

  pickerContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    minHeight: 50,
    justifyContent: "center",
  },

  picker: {
    width: "100%",
    height: 50,
    color: COLORS.text,
  },

  pickerItem: {
    fontSize: 16,
    color: COLORS.text,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  switchContent: {
    flex: 1,
    marginRight: 16,
  },

  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },

  switchDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
  },

  pickerSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  pickerButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
  },

  pickerButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },

  pickerArrow: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 300,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },

  modalOptionSelected: {
    backgroundColor: COLORS.primaryLight + "20",
  },

  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },

  modalOptionTextSelected: {
    fontWeight: "600",
    color: COLORS.primary,
  },

  languageOptionContent: {
    flex: 1,
  },

  languageSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  languageSubtextSelected: {
    color: COLORS.primary,
    opacity: 0.8,
  },

  checkmark: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  securityItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  securityIconText: {
    fontSize: 20,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },

  securityDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  securityStatus: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textInverse,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  actionSection: {
    marginTop: 8,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textInverse,
    letterSpacing: 0.3,
  },

  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    letterSpacing: 0.2,
  },

  dangerButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.danger,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },

  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.danger,
    letterSpacing: 0.2,
  },
});

export default ProfileScreen;
