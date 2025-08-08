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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig"; 

const { height } = Dimensions.get('window');

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

  // Configure Google Signin
  GoogleSignin.configure({
    webClientId: "201040809867-al40so5evbse3gibsbas7cc67hsl90aa.apps.googleusercontent.com", 
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
      newErrors.email = t.validFillAllFields;
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = t.invalidEmail;
      isValid = false;
    }

    if (!password) {
      newErrors.password = t.validFillAllFields;
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t.invalidPassword;
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

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Sign in with Firebase email/password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in AsyncStorage
      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({ fullName: user.displayName || "User", email: user.email })
      );

      // Navigate to MainApp
      navigation.navigate("MainApp", {
        userData: { fullName: user.displayName || "User", email: user.email },
      });
    } catch (error) {
      console.error("Email/Password Login error:", error);
      let errorMessage = t.invalidCredentials;
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = t.invalidCredentials;
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = t.troubleSigningIn;
      } else {
        errorMessage = error.message || t.error;
      }
      Alert.alert(t.error, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Get Google ID token
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      // Sign in with Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Store user data in AsyncStorage
      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({ fullName: user.displayName || "Google User", email: user.email })
      );

      // Show success message
      Alert.alert(t.success, t.googleSignInSuccess);

      // Navigate to MainApp
      navigation.navigate("MainApp", {
        userData: { fullName: user.displayName || "Google User", email: user.email },
      });
    } catch (error) {
      console.error("Google Sign-In error:", error);
      Alert.alert(t.error, t.googleSignInError || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>{t.loginTitle}</Text>
            <Text style={styles.welcomeSubtitle}>{t.loginSubtitle}</Text>
          </View>
        </View>

        {/* Main Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.formCard}>
            {/* Input Fields Section */}
            <View style={styles.inputSection}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{t.email}</Text>
                <View
                  style={[
                    styles.inputField,
                    isEmailFocused && styles.inputFocused,
                    errors.email && styles.inputError,
                  ]}
                >
                  <Icon name="envelope-o" size={18} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.email}
                    placeholderTextColor="#9ca3af"
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

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{t.password}</Text>
                <View
                  style={[
                    styles.inputField,
                    isPasswordFocused && styles.inputFocused,
                    errors.password && styles.inputError,
                  ]}
                >
                  <Icon name="lock" size={18} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.password}
                    placeholderTextColor="#9ca3af"
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
                
                {/* Forgot Password Link - moved here */}
                <TouchableOpacity
                  style={styles.forgotPasswordLink}
                  onPress={() => !isLoading && navigation.navigate("ForgotPassword")}
                  disabled={isLoading}
                >
                  <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>{t.signIn}</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t.or}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleSignInButton, isLoading && styles.disabledButton]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Icon name="google" size={18} color="#DB4437" />
              <Text style={styles.googleSignInText}>{t.continueWithGoogle}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <View style={styles.signUpPrompt}>
            <Text style={styles.signUpPromptText}>{t.noAccount} </Text>
            <TouchableOpacity
              onPress={() => !isLoading && navigation.navigate("Register")}
              disabled={isLoading}
            >
              <Text style={styles.signUpLink}>{t.signUp}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  
  // Header Section
  headerSection: {
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
    marginHorizontal: 20,
  },

  // Content Section
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Input Section
  inputSection: {
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "600",
  },
  inputField: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    minHeight: 50,
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
    fontSize: 15,
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
    marginTop: 6,
    padding: 2,
  },
  forgotPasswordText: {
    color: "#008080",
    fontSize: 13,
    fontWeight: "600",
  },

  // Buttons
  signInButton: {
    backgroundColor: "#008080",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  googleSignInButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
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
  },
  googleSignInText: {
    color: "#DB4437",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "500",
  },

  // Footer Section
  footerSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 150,
    alignItems: 'center',
  },
  signUpPrompt: {
    flexDirection: "row",
    alignItems: 'center',
  },
  signUpPromptText: {
    color: "#6b7280",
    fontSize: 13,
  },
  signUpLink: {
    color: "#008080",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default LoginScreen;