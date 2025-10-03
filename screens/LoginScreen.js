import React, { useState, useContext, useEffect } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Google from "expo-auth-session/providers/google";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getDb } from "./db";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // Configure Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "197590438015-jkpo6rbjq2icl5uqsqkkik3r85q3s19k.apps.googleusercontent.com",
    androidClientId:
      "197590438015-84oj8si3rlq22pgq73iqsgm8frtp902v.apps.googleusercontent.com",
    iosClientId:
      "197590438015-2lrdo9hkmbuv889vggpol35png2orm9v.apps.googleusercontent.com",
    scopes: ["profile", "email", "openid"],
    usePKCE: true,
    redirectUri: "com.fyp.healthapps://",
  });

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === "success") {
      console.log("Auth Response:", JSON.stringify(response, null, 2));
      handleGoogleAuthResponse(response);
    } else if (response?.type === "error") {
      console.error("Google Sign-In Error:", response.error);
      Alert.alert(
        t.error || "Error",
        response.error?.message ||
          t.googleSignInFailed ||
          "Google Sign-In failed."
      );
      setIsLoading(false);
    } else if (response?.type === "cancel") {
      Alert.alert(
        t.cancel || "Cancelled",
        t.googleSignInCancelled || "Google Sign-In was cancelled."
      );
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleAuthResponse = async ({ authentication, params }) => {
    setIsLoading(true);
    try {
      console.log(
        "Extracted authentication:",
        JSON.stringify(authentication, null, 2)
      );
      console.log("Extracted params:", JSON.stringify(params, null, 2));

      let idToken = params?.id_token || authentication?.idToken;
      if (!idToken) {
        throw new Error(
          `No ID token found. Authentication: ${JSON.stringify(authentication || {}, null, 2)}, Params: ${JSON.stringify(params || {}, null, 2)}`
        );
      }

      const accessToken = params?.access_token || authentication?.accessToken;
      console.log("Using idToken:", idToken);
      console.log("Using accessToken:", accessToken);

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      console.log("Firebase Sign-In Success:", user.uid);

      // Check if first-time user BEFORE saving data
      const isFirstTimeUser = await checkIfFirstTimeUser(user.email);

      const userData = {
        fullName: user.displayName || params?.name || "Google User",
        email: user.email || params?.email,
      };

      await saveUserData(userData);

      if (isFirstTimeUser) {
        navigation.navigate("LifestyleDataInput", { userData });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.code, error.message);
      Alert.alert(
        t.error || "Error",
        error.message || t.googleSignInFailed || "Google Sign-In failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      newErrors.password =
        t.invalidPassword || "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveUserData = async (userData) => {
    try {
      console.log("Saving user data:", userData);
      await AsyncStorage.setItem("userProfileData", JSON.stringify(userData));

      const db = await getDb();
      const existingUser = await db.getFirstAsync(
        `SELECT id FROM Users WHERE email = ?`,
        [userData.email]
      );

      const currentTime = new Date().toISOString();

      if (existingUser) {
        await db.runAsync(`UPDATE Users SET fullName = ? WHERE email = ?`, [
          userData.fullName,
          userData.email,
        ]);
        console.log("Updated existing user in database");
      } else {
        await db.runAsync(
          `INSERT INTO Users (fullName, email, createdAt) VALUES (?, ?, ?)`,
          [userData.fullName, userData.email, currentTime]
        );
        console.log("Inserted new user into database");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
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

      // Check if user exists in Users table
      const userExists = await db.getFirstAsync(
        `SELECT * FROM Users WHERE email = ?`,
        [userEmail]
      );

      // Check if user has lifestyle data
      const hasLifestyleData = await db.getFirstAsync(
        `SELECT * FROM UserProfile LIMIT 1`
      );

      // User is first-time if they don't exist in Users table OR have no lifestyle data
      return !userExists || !hasLifestyleData;
    } catch (error) {
      console.error("Error checking first-time user:", error);
      return true; // Assume first-time on error to be safe
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if first-time user BEFORE saving data
      const isFirstTimeUser = await checkIfFirstTimeUser(user.email);

      const userData = {
        fullName: user.displayName || "User",
        email: user.email,
      };

      await saveUserData(userData);

      if (isFirstTimeUser) {
        navigation.navigate("LifestyleDataInput", { userData });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      }
    } catch (error) {
      console.error("Email login error:", error);
      Alert.alert(
        t.error || "Error",
        t.loginFailed || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!request) {
      console.error("Auth request not ready");
      Alert.alert(
        t.error || "Error",
        t.googleSignInNotReady ||
          "Google Sign-In is not ready. Please try again."
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log("Initiating Google Sign-In...");
      await promptAsync();
    } catch (error) {
      console.error("Google Sign-In Prompt Error:", error.code, error.message);
      Alert.alert(
        t.error || "Error",
        error.message || t.googleSignInFailed || "Google Sign-In failed."
      );
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}></View>
          <Text style={styles.welcomeText}>
            {t.loginTitle || "Welcome Back"}
          </Text>
          <Text style={styles.subtitleText}>
            {t.loginSubtitle || "Sign in to continue your health journey"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.modernInput,
                  isEmailFocused && styles.inputFocused,
                  errors.email && styles.inputError,
                ]}
              >
                <Icon
                  name="envelope-o"
                  size={20}
                  color={isEmailFocused ? "#008080" : "#6b7280"}
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
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.modernInput,
                  isPasswordFocused && styles.inputFocused,
                  errors.password && styles.inputError,
                ]}
              >
                <Icon
                  name="lock"
                  size={20}
                  color={isPasswordFocused ? "#008080" : "#6b7280"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
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
                    size={20}
                    color="#008080"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() =>
                !isLoading && navigation.navigate("ForgotPassword")
              }
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>
                {t.forgotPassword || "Forgot Password?"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <View style={styles.signInButtonContent}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>
                  {t.signIn || "Sign In"}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.dividerSection}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerTextContainer}>
              <Text style={styles.dividerText}>{t.or || "or"}</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.9}
            disabled={isLoading || !request}
          >
            <View style={styles.googleButtonContent}>
              <Icon name="google" size={20} color="#DB4437" />
              <Text style={styles.googleButtonText}>
                {t.continueWithGoogle || "Continue with Google"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signUpSection}>
            <Text style={styles.signUpPromptText}>
              {t.noAccount || "Don't have an account?"}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => !isLoading && navigation.navigate("Register")}
              disabled={isLoading}
            >
              <Text style={styles.signUpLinkText}>{t.signUp || "Sign Up"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight + 20,
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  modernInput: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#3b82f6",
    backgroundColor: "#ffffff",
    transform: [{ scale: 1.02 }],
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputError: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "600",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#008080",
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#008080",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonContent: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#d1d5db",
  },
  dividerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerTextContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  dividerText: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  googleButton: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  signUpSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  signUpPromptText: {
    color: "#6b7280",
    fontSize: 16,
  },
  signUpLinkText: {
    color: "#008080",
    fontWeight: "700",
  },
});

export default LoginScreen;
