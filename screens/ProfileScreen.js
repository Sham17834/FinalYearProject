import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  Modal,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDb } from "./db";
import { auth } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const BIO_MAX_LENGTH = 250;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const db = await getDb();
        let userData = {};
        const storedData = await AsyncStorage.getItem("userProfileData");
        if (storedData) {
          userData = JSON.parse(storedData);
        }
        const user = await db.getFirstAsync(
          `SELECT fullName, email, dateOfBirth, bio, profileImage FROM Users WHERE email = ?`,
          [userData.email || route.params?.userData?.email || ""]
        );

        if (user) {
          setName(user.fullName || "");
          setEmail(user.email || "");
          setDateOfBirth(user.dateOfBirth ? new Date(user.dateOfBirth) : null);
          setBio(user.bio || "");
          setProfileImage(user.profileImage || null);
        } else {
          const data = route.params?.userData || {};
          if (storedData) {
            Object.assign(data, JSON.parse(storedData));
          }
          setName(data.fullName || "");
          setEmail(data.email || "");
          setDateOfBirth(data.dateOfBirth ? new Date(data.dateOfBirth) : null);
          setBio(data.bio || "");
          setProfileImage(data.profileImage || null);
        }
      } catch (error) {
        Alert.alert(
          t.error || "Error",
          t.loadProfileError || "Failed to load profile data."
        );
      }
    };

    loadProfileData();
    requestPermissions();
  }, [route.params, t]);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      try {
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== "granted" || libraryStatus !== "granted") {
          Alert.alert(
            t.permissionRequired || "Permission Required",
            t.permissionMessage ||
              "Sorry, we need camera and photo library permissions to update your profile picture."
          );
        }
      } catch (error) {
        console.log("Permission request error:", error);
      }
    }
  };

  const availableLanguages = [
    { code: "English", name: "English", nativeName: "English" },
    { code: "Malay", name: "Malay", nativeName: "Bahasa Melayu" },
    { code: "Chinese", name: "Chinese", nativeName: "中文" },
  ];

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", dateOfBirth: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = t.validFillAllFields || "Please enter your full name";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = t.validFillAllFields || "Please enter your email";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = t.invalidEmail || "Please enter a valid email address";
      isValid = false;
    }

    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      if (age < 13) {
        newErrors.dateOfBirth =
          t.ageRestriction || "You must be at least 13 years old";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(
      (lang) => lang.code === language
    );
    return currentLang ? currentLang.nativeName : language;
  };

  const handleImagePick = async (type) => {
    setShowImageOptions(false);

    try {
      let result;
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image pick error:", error);
      Alert.alert(
        t.error || "Error",
        t.imagePickError || "Failed to pick image. Please try again."
      );
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      t.removeImage || "Remove Photo",
      t.removeImageConfirm ||
        "Are you sure you want to remove your profile photo?",
      [
        { text: t.cancel || "Cancel", style: "cancel" },
        {
          text: t.remove || "Remove",
          style: "destructive",
          onPress: () => {
            setProfileImage(null);
            setShowImageOptions(false);
          },
        },
      ]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: "" });
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const data = {
      fullName: name,
      email,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
      bio: bio.trim(),
      profileImage,
    };

    try {
      const db = await getDb();
      const user = await db.getFirstAsync(
        `SELECT id FROM Users WHERE email = ?`,
        [data.email]
      );

      if (user) {
        await db.runAsync(
          `UPDATE Users SET fullName = ?, dateOfBirth = ?, bio = ?, profileImage = ? WHERE email = ?`,
          [
            data.fullName,
            data.dateOfBirth,
            data.bio,
            data.profileImage,
            data.email,
          ]
        );
      } else {
        await db.runAsync(
          `INSERT INTO Users (fullName, email, dateOfBirth, bio, profileImage, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            data.fullName,
            data.email,
            data.dateOfBirth,
            data.bio,
            data.profileImage,
            new Date().toISOString(),
          ]
        );
      }

      await AsyncStorage.setItem("userProfileData", JSON.stringify(data));

      Alert.alert(
        t.profileSaved || "Profile Saved",
        t.profileSavedMsg || "Profile data saved successfully",
        [{ text: t.ok || "OK", style: "default" }]
      );
    } catch (error) {
      Alert.alert(
        t.error || "Error",
        t.saveProfileError || "Failed to save profile data."
      );
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://www.who.int/about/policies/privacy").catch((err) =>
      Alert.alert(
        t.error || "Error",
        t.errorPrivacyPolicy || "Failed to open privacy policy."
      )
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      t.logOut || "Log Out",
      t.logOutConfirm || "Are you sure you want to log out?",
      [
        { text: t.cancel || "Cancel", style: "cancel" },
        {
          text: t.logOut || "Log Out",
          style: "default",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userProfileData");
              await auth.signOut();
            } catch (error) {
              Alert.alert(
                t.error || "Error",
                t.logoutError || "Failed to log out."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.appName}>{t.profileTitle || "Profile"}</Text>
            <Text style={styles.appTagline}>
              {t.profileTagline ||
                "Manage your personal information and settings"}
            </Text>
          </View>
        </View>

        <View style={styles.scrollContent}>
          {/* Profile Picture Section */}
          <View style={styles.profileImageSection}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => setShowImageOptions(true)}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageInitials}>
                    {getInitials(name)}
                  </Text>
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.profileImageHint}>
              {t.tapToChangePhoto || "Tap to change photo"}
            </Text>
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.personalInfo || "Personal Information"}
            </Text>
            <View style={styles.formCard}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t.fullName || "Full Name"}
                </Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder={t.enterFullName || "Enter your full name"}
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name ? (
                  <Text style={styles.errorMessage}>{errors.name}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t.emailAddress || "Email Address"}
                </Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder={t.enterEmail || "Enter your email"}
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                />
                {errors.email ? (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t.dateOfBirth || "Date of Birth"}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.datePickerButton,
                    errors.dateOfBirth && styles.inputError,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={[
                      styles.datePickerText,
                      !dateOfBirth && styles.datePickerPlaceholder,
                    ]}
                  >
                    {dateOfBirth
                      ? formatDate(dateOfBirth)
                      : t.selectDateOfBirth || "Select your date of birth"}
                  </Text>
                  <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
                {dateOfBirth && (
                  <Text style={styles.ageText}>
                    {t.age || "Age"}: {calculateAge(dateOfBirth)}{" "}
                    {t.years || "years"}
                  </Text>
                )}
                {errors.dateOfBirth ? (
                  <Text style={styles.errorMessage}>{errors.dateOfBirth}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.bioLabelContainer}>
                  <Text style={styles.inputLabel}>
                    {t.bio || "Bio / About Me"}
                  </Text>
                  <Text style={styles.characterCount}>
                    {bio.length}/{BIO_MAX_LENGTH}
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  placeholder={
                    t.enterBio || "Tell us a little bit about yourself..."
                  }
                  placeholderTextColor="#9ca3af"
                  value={bio}
                  onChangeText={(text) => {
                    if (text.length <= BIO_MAX_LENGTH) {
                      setBio(text);
                    }
                  }}
                  multiline
                  numberOfLines={4}
                  maxLength={BIO_MAX_LENGTH}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.preferences || "Preferences"}
            </Text>
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
            </View>
          </View>

          {/* Security & Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t.securityPrivacy || "Security & Privacy"}
            </Text>
            <View style={styles.securityCard}>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon}>
                  <Text style={styles.securityIconText}>🔒</Text>
                </View>
                <View style={styles.securityContent}>
                  <Text style={styles.securityTitle}>
                    {t.dataEncryption || "Data Encryption"}
                  </Text>
                  <Text style={styles.securityDescription}>
                    {t.encryptionDesc || "Your data is encrypted and secure."}
                  </Text>
                </View>
                <View style={styles.securityStatus}>
                  <Text style={styles.activeStatus}>
                    {t.active || "Active"}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePrivacyPolicy}
            >
              <Text style={styles.secondaryButtonText}>
                {t.privacyPolicy || "Privacy Policy"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>
                {t.saveChanges || "Save Changes"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text
                style={[styles.secondaryButtonText, styles.logoutButtonText]}
              >
                {t.logOut || "Log Out"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Language Modal */}
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
                onPress={() => {
                  changeLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
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

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.imageModalContent}>
            <Text style={styles.modalTitle}>
              {t.changeProfilePhoto || "Change Profile Photo"}
            </Text>

            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={() => handleImagePick("camera")}
            >
              <Text style={styles.imageOptionIcon}>📸</Text>
              <Text style={styles.imageOptionText}>
                {t.takePhoto || "Take Photo"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={() => handleImagePick("gallery")}
            >
              <Text style={styles.imageOptionIcon}>🖼️</Text>
              <Text style={styles.imageOptionText}>
                {t.chooseFromGallery || "Choose from Gallery"}
              </Text>
            </TouchableOpacity>

            {profileImage && (
              <TouchableOpacity
                style={[styles.imageOptionButton, styles.removeOptionButton]}
                onPress={handleRemoveImage}
              >
                <Text style={styles.imageOptionIcon}>🗑️</Text>
                <Text style={[styles.imageOptionText, styles.removeOptionText]}>
                  {t.removePhoto || "Remove Photo"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelButtonText}>
                {t.cancel || "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.datePickerModalContent}>
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.doneButtonText}>{t.done || "Done"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  headerContent: {
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textInverse,
    textAlign: "center",
  },
  appTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageContainer: {
    position: "relative",
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: COLORS.primaryLight,
  },
  profileImageInitials: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.textInverse,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    fontSize: 16,
  },
  profileImageHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
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
  bioInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  bioLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: "#fef2f2",
  },
  errorMessage: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  datePickerButton: {
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
  datePickerText: {
    fontSize: 16,
    color: COLORS.text,
  },
  datePickerPlaceholder: {
    color: COLORS.textMuted,
  },
  calendarIcon: {
    fontSize: 18,
  },
  ageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
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
  imageModalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: "100%",
    position: "absolute",
    bottom: 0,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  imageOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  removeOptionButton: {
    backgroundColor: "#fef2f2",
    borderColor: COLORS.danger + "30",
  },
  imageOptionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  imageOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  removeOptionText: {
    color: COLORS.danger,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  datePickerModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textInverse,
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
    fontSize: 12,
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
    marginBottom: 32,
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
  logoutButton: {
    borderColor: COLORS.danger + "40",
  },
  logoutButtonText: {
    color: COLORS.danger,
  },
});

export default ProfileScreen;
