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
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import * as Google from "expo-google-app-auth";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDb } from "./db";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
      email: "",
      password: "",
    };

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    const setters = {
      email: setEmail,
      password: setPassword,
    };
    setters[field](value);

    // Validate the changed field
    const newErrors = { ...errors };
    if (field === "email") {
      newErrors.email = value.trim()
        ? validateEmail(value)
          ? ""
          : t.invalidEmail || "Please enter a valid email address"
        : t.validFillAllFields || "Please fill in all fields";
    }
    if (field === "password") {
      newErrors.password = value
        ? ""
        : t.validFillAllFields || "Please fill in all fields";
    }
    setErrors(newErrors);
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Check if user exists in Users table
      const db = await getDb();
      const user = await db.getFirstAsync(
        `SELECT * FROM Users WHERE email = ? AND password = ?`,
        [email, password]
      );

      if (!user) {
        setErrors((prev) => ({
          ...prev,
          email: t.invalidCredentials || "Invalid email or password",
          password: t.invalidCredentials || "Invalid email or password",
        }));
        Alert.alert(
          t.error || "Error",
          t.invalidCredentials || "Invalid email or password"
        );
        return;
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({ fullName: user.fullName, email })
      );

      console.log("Login:", { email, password });
      navigation.navigate("MainApp", {
        userData: { fullName: user.fullName, email },
      });
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(t.error || "Error", t.loginError || "Failed to log in");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: "YOUR_ANDROID_CLIENT_ID",
        iosClientId: "YOUR_IOS_CLIENT_ID",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        const userEmail = result.user.email || "";
        const userFullName = result.user.name || null;

        // Save to Users table
        const db = await getDb();
        try {
          await db.runAsync(
            `INSERT INTO Users (fullName, email, createdAt) VALUES (?, ?, ?)`,
            [userFullName, userEmail, new Date().toISOString()]
          );
        } catch (error) {
          if (error.message.includes("UNIQUE constraint failed")) {
            console.log("User already exists, proceeding with login");
          } else {
            throw error;
          }
        }

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          "userProfileData",
          JSON.stringify({ fullName: userFullName, email: userEmail })
        );

        console.log("Google Sign-In successful:", result);
        Alert.alert(
          t.success || "Success",
          t.googleSignInSuccess || "Google sign-in successful"
        );
        navigation.navigate("MainApp", {
          userData: { fullName: userFullName, email: userEmail },
        });
      } else {
        console.log("Google Sign-In cancelled");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        t.error || "Error",
        t.googleSignInError || "Google sign-in failed"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.loginTitle || "Login"}</Text>
          <Text style={styles.subtitle}>
            {t.loginSubtitle || "Sign in to continue"}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.email || "Email"}</Text>
            <View
              style={[
                styles.input,
                isEmailFocused && { borderColor: "#008080", borderWidth: 1.5 },
                errors.email && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.inputText}
                placeholder={t.email || "Email"}
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => handleInputChange("email", text)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.password || "Password"}</Text>
            <View
              style={[
                styles.input,
                isPasswordFocused && {
                  borderColor: "#008080",
                  borderWidth: 1.5,
                },
                errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.inputText}
                placeholder={t.password || "Password"}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => handleInputChange("password", text)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.passwordToggle}>
                  {showPassword ? t.hide || "Hide" : t.show || "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.helpLink}
            onPress={() =>
              Alert.alert(
                t.help || "Help",
                t.troubleSigningIn || "Having trouble signing in?"
              )
            }
          >
            <Text style={styles.linkText}>
              {t.forgotPassword || "Forgot Password?"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>{t.signIn || "Sign In"}</Text>
          </TouchableOpacity>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.or || "or"}</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Icon
              name="google"
              size={20}
              color="#DB4437"
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>
              {t.continueWithGoogle || "Continue with Google"}
            </Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t.noAccount || "Don't have an account?"}{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>{t.signUp || "Sign Up"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputText: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
  passwordToggle: {
    color: "#008080",
    fontWeight: "500",
    fontSize: 13,
  },
  helpLink: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  linkText: {
    color: "#008080",
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#008080",
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    color: "#6b7280",
    fontSize: 13,
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  footerText: {
    color: "#6b7280",
    fontSize: 13,
  },
  footerLink: {
    color: "#008080",
    fontWeight: "500",
    fontSize: 13,
  },
});

export default LoginScreen;
