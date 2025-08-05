import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDb } from "./db";

const RegisterScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = t.validFillAllFields || "Please fill in all fields";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = t.validFillAllFields || "Please fill in all fields";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = t.invalidEmail || "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = t.validFillAllFields || "Please fill in all fields";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t.invalidPassword || "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t.validFillAllFields || "Please fill in all fields";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t.validPasswordMatch || "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    const setters = {
      fullName: setFullName,
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
    };
    setters[field](value);

    // Validate the changed field
    const newErrors = { ...errors };
    if (field === "fullName" && value.trim()) {
      newErrors.fullName = "";
    }
    if (field === "email") {
      newErrors.email = value.trim()
        ? validateEmail(value)
          ? ""
          : t.invalidEmail || "Please enter a valid email address"
        : t.validFillAllFields || "Please fill in all fields";
    }
    if (field === "password") {
      newErrors.password = value
        ? value.length >= 6
          ? ""
          : t.invalidPassword || "Password must be at least 6 characters long"
        : t.validFillAllFields || "Please fill in all fields";
    }
    if (field === "confirmPassword") {
      newErrors.confirmPassword = value
        ? value === password
          ? ""
          : t.validPasswordMatch || "Passwords do not match"
        : t.validFillAllFields || "Please fill in all fields";
    }
    setErrors(newErrors);
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const db = await getDb();

      // Check if email already exists
      const existingUser = await db.getFirstAsync(
        `SELECT * FROM Users WHERE email = ?`,
        [email]
      );
      if (existingUser) {
        setErrors((prev) => ({
          ...prev,
          email: t.emailExists || "Email already registered",
        }));
        Alert.alert(
          t.error || "Error",
          t.emailExists || "Email already registered"
        );
        return;
      }

      // Save to Users table
      await db.runAsync(
        `INSERT INTO Users (fullName, email, password, createdAt) VALUES (?, ?, ?, ?)`,
        [fullName, email, password, new Date().toISOString()]
      );

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({ fullName, email })
      );

      console.log("Register:", { fullName, email, password });
      Alert.alert(
        t.success || "Success",
        t.registrationSuccess || "Registration successful"
      );
      navigation.navigate("MainApp", { userData: { fullName, email } });
    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert(
        t.error || "Error",
        t.saveProfileError || "Failed to save user data"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t.registerTitle || "Register"}</Text>
            <Text style={styles.subtitle}>
              {t.registerSubtitle || "Fill in your details to begin"}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.fullName ? styles.inputError : null]}
                placeholder={t.fullName || "Full Name"}
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={(text) => handleInputChange("fullName", text)}
                autoCapitalize="words"
              />
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder={t.emailPlaceholder || "Email Address"}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.password ? styles.inputError : null]}
                placeholder={t.passwordPlaceholder || "Password"}
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                placeholder={t.confirmPassword || "Confirm Password"}
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => handleInputChange("confirmPassword", text)}
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>
                {t.registerButton || "Register"}
              </Text>
            </TouchableOpacity>
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                {t.haveAccount || "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.bottomTextLink}>
                  {t.signIn || "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    justifyContent: "flex-start",
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  registerButton: {
    height: 56,
    backgroundColor: "#008080",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  bottomText: {
    color: "#666",
    marginRight: 8,
  },
  bottomTextLink: {
    color: "#008080",
    fontWeight: "600",
  },
});

export default RegisterScreen;