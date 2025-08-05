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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "./LanguageContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ResponseType, makeRedirectUri } from "expo-auth-session";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDb } from "./db";

// Required for web-based flows (Expo Go)
WebBrowser.maybeCompleteAuthSession();

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

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "201040809867-ikcsmf4h7ounu0otc5u5dgn7iie8a3ds.apps.googleusercontent.com",
    iosClientId:
      "201040809867-ikcsmf4h7ounu0otc5u5dgn7iie8a3ds.apps.googleusercontent.com",
    expoClientId:
      "2278465694-ne50ajia20laqf1mgtgr5jjcqcc5csv0.apps.googleusercontent.com",
    responseType: ResponseType.Token,
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({
      native: "com.googleusercontent.apps.2278465694-cut7quuif1m2uc9v7rjvpmca3v31o53c://",
      useProxy: true
    }),
  });

  useEffect(() => {
    console.log("Google response:", response);
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleSignIn(authentication.accessToken);
    } else if (response?.type === "error") {
      console.error("Google Sign-In error:", response.error);
      // More detailed error message to help diagnose the issue
      const errorMessage = response.error?.message || t.googleSignInError;
      const errorDetails = response.error?.code ? `\nError code: ${response.error.code}` : '';
      Alert.alert(
        t.error, 
        `${errorMessage}${errorDetails}\n\nPlease try again or use email login instead.`
      );
    }
  }, [response]);

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
      const db = await getDb();
      const user = await db.getFirstAsync(
        `SELECT * FROM Users WHERE email = ? AND password = ?`,
        [email, password]
      );

      if (!user) {
        Alert.alert(t.error, t.invalidCredentials);
        setIsLoading(false);
        return;
      }

      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({ fullName: user.fullName, email })
      );

      navigation.navigate("MainApp", {
        userData: { fullName: user.fullName, email },
      });
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(t.error, t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (accessToken) => {
    setIsLoading(true);
    try {
      console.log("Attempting to fetch user info with token:", accessToken.substring(0, 10) + "...");
      
      // Get user info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        console.error("Google API error:", errorText);
        throw new Error(`Google API error: ${userInfoResponse.status} ${errorText}`);
      }
      
      const userInfo = await userInfoResponse.json();
      console.log("User info received:", { name: userInfo.name, email: userInfo.email });

      if (userInfo.error) {
        throw new Error(userInfo.error.message);
      }

      // Save user data to database
      const db = await getDb();
      try {
        await db.runAsync(
          `INSERT INTO Users (fullName, email, createdAt) VALUES (?,?,?)`,
          [userInfo.name, userInfo.email, new Date().toISOString()]
        );
        console.log("User saved to database");
      } catch (error) {
        if (!error.message.includes("UNIQUE constraint failed")) {
          console.error("Database error:", error);
          Alert.alert(t.error, t.databaseError || "Failed to save user data");
          return;
        } else {
          console.log("User already exists in database");
        }
      }

      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify({ fullName: userInfo.name, email: userInfo.email })
      );
      console.log("User data saved to AsyncStorage");

      navigation.navigate("MainApp", {
        userData: { fullName: userInfo.name, email: userInfo.email },
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        t.error, 
        `${t.googleSignInError}\n\n${error.message}\n\nPlease try again or use email login instead.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t.loginTitle}</Text>
          <Text style={styles.subtitle}>{t.loginSubtitle}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.email}</Text>
            <View
              style={[
                styles.input,
                isEmailFocused && { borderColor: "#008080", borderWidth: 1.5 },
                errors.email && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.inputText}
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
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t.password}</Text>
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
              >
                <Icon
                  name={showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#008080"
                  style={styles.passwordToggleIcon}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.helpLink}
            onPress={() => !isLoading && navigation.navigate("ForgotPassword")}
            disabled={isLoading}
          >
            <Text style={styles.linkText}>{t.forgotPassword}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? t.processing : t.signIn}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.or}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={() => {
              try {
                console.log("Initiating Google Sign-In");
                promptAsync();
              } catch (error) {
                console.error("Error starting Google Sign-In:", error);
                Alert.alert(
                  t.error,
                  "Failed to start Google Sign-In. Please try again or use email login."
                );
              }
            }}
            disabled={!request || isLoading}
            activeOpacity={0.8}
          >
            <Icon
              name="google"
              size={20}
              color="#DB4437"
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>{t.continueWithGoogle}</Text>
          </TouchableOpacity>
          
          {response?.type === "error" && (
            <Text style={styles.errorHelpText}>
              If you're having trouble with Google Sign-In, please try using email login instead.
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t.noAccount} </Text>
            <TouchableOpacity
              onPress={() => !isLoading && navigation.navigate("Register")}
              disabled={isLoading}
            >
              <Text style={styles.footerLink}>{t.signUp}</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordToggleIcon: {
    marginLeft: 8,
  },
  helpLink: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  linkText: {
    color: "#008080",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#008080",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginVertical: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
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
    fontSize: 14,
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  footerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  footerLink: {
    color: "#008080",
    fontWeight: "500",
    fontSize: 14,
  },
  errorHelpText: {
    color: "#ef4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
});

export default LoginScreen;
