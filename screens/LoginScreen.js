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
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
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
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  GoogleSignin.configure({
    webClientId:
      "197590438015-jkpo6rbjq2icl5uqsqkkik3r85q3s19k.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

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
      newErrors.email = t.invalidEmail || "Invalid email format";
      isValid = false;
    }

    if (!password) {
      newErrors.password = t.validFillAllFields || "Please fill in all fields";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t.invalidPassword || "Password must be at least 6 characters";
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

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const checkIfFirstTimeUser = async (userEmail) => {
    try {
      const db = await getDb();
      const result = await db.getFirstAsync(
        `SELECT * FROM UserProfile WHERE email = ?`,
        [userEmail]
      );
      return !result;
    } catch (error) {
      console.error("Error checking user profile:", error);
      return false; 
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({
          fullName: user.displayName || "User",
          email: user.email,
        })
      );

      const isFirstTimeUser = await checkIfFirstTimeUser(user.email);

      navigation.navigate(
        isFirstTimeUser ? "LifestyleDataInput" : "MainApp",
        {
          userData: { fullName: user.displayName || "User", email: user.email },
        }
      );
    } catch (error) {
      console.error("Email/Password Login error:", error);
      let errorMessage = t.invalidCredentials || "Invalid email or password";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = t.invalidCredentials || "Invalid email or password";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = t.troubleSigningIn || "Too many attempts, try again later";
      } else {
        errorMessage = error.message || t.error || "An error occurred";
      }
      Alert.alert(t.error || "Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      // Check for idToken in the data object
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      if (!idToken) {
        console.error("Google Sign-In error: No ID token received", userInfo);
        throw new Error("No ID token received from Google Sign-In");
      }

      const accessToken = userInfo.data?.accessToken || userInfo.accessToken;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userData = {
        fullName:
          user.displayName ||
          userInfo.user?.name ||
          (userInfo.user?.givenName && userInfo.user?.familyName
            ? `${userInfo.user.givenName} ${userInfo.user.familyName}`
            : "Google User"),
        email: user.email || userInfo.user?.email,
      };

      await AsyncStorage.setItem("userProfileData", JSON.stringify(userData));

      const isFirstTimeUser = await checkIfFirstTimeUser(user.email);

      Alert.alert(
        t.success || "Success",
        t.googleSignInSuccess || "Successfully signed in with Google!"
      );

      navigation.navigate(
        isFirstTimeUser ? "LifestyleDataInput" : "MainApp",
        { userData }
      );
    } catch (error) {
      console.error("Google Sign-In error:", error);
      let errorMessage = t.googleSignInError || "Google sign-in failed";
      if (error.code === 12501) {
        console.log("User cancelled Google Sign-In");
        return;
      } else if (error.code === "auth/argument-error") {
        errorMessage =
          t.googleSignInError ||
          "Authentication configuration error. Please check your Google Sign-In setup.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          t.networkError || "Network error. Please check your internet connection.";
      } else if (error.code === 10) {
        errorMessage =
          t.googleSignInError || "Google Sign-In configuration error. Please contact support.";
      } else if (error.message && error.message.includes("DEVELOPER_ERROR")) {
        errorMessage =
          t.googleSignInError ||
          "Configuration error. Please check SHA-1 fingerprint and package name.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert(t.error || "Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.header}>
        <Text style={styles.appName}>{t.loginTitle || "Welcome Back"}</Text>
        <Text style={styles.appTagline}>
          {t.loginSubtitle || "Sign in to continue your health journey"}
        </Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.email || "Email"}</Text>
            <View
              style={[
                styles.input,
                isEmailFocused && styles.inputFocused,
                errors.email && styles.inputError,
              ]}
            >
              <Icon
                name="envelope-o"
                size={18}
                color="#6b7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder={t.email || "Enter your email"}
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => handleInputChange("email", text)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorMessage}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.password || "Password"}</Text>
            <View
              style={[
                styles.input,
                isPasswordFocused && styles.inputFocused,
                errors.password && styles.inputError,
              ]}
            >
              <Icon
                name="lock"
                size={18}
                color="#6b7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder={t.password || "Enter your password"}
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => handleInputChange("password", text)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={styles.passwordToggle}
              >
                <Icon
                  name={showPassword ? "eye-slash" : "eye"}
                  size={18}
                  color="#008080"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorMessage}>{errors.password}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => !isLoading && navigation.navigate("ForgotPassword")}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                {t.forgotPassword || "Forgot Password?"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {t.signIn || "Sign In"}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.secondaryText}>{t.or || "or"}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleSignInButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Icon name="google" size={18} color="#DB4437" />
            <Text style={styles.googleSignInText}>
              {t.continueWithGoogle || "Continue with Google"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signUpPrompt}>
            <Text style={styles.secondaryText}>
              {t.noAccount || "Don't have an account?"}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => !isLoading && navigation.navigate("Register")}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>{t.signUp || "Sign Up"}</Text>
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
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight + 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#008080",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  appTagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 8,
    fontWeight: "500",
    paddingLeft: 4,
  },
  input: {
    height: 50,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  inputFocused: {
    borderColor: "#008080",
    backgroundColor: "#fff",
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  inputIcon: {
    marginRight: 12,
    width: 18,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    paddingVertical: 0,
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 8,
    padding: 4,
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#008080",
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleSignInButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DB4437",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#DB4437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 20,
  },
  googleSignInText: {
    color: "#DB4437",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  secondaryText: {
    marginHorizontal: 12,
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
  signUpPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default LoginScreen;